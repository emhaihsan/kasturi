// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Kasturi.sol";
import "../src/KasturiToken.sol";
import "../src/KasturiSBT.sol";
import "../src/KasturiVoucher.sol";

contract KasturiTest is Test {
    Kasturi public kasturi;
    KasturiToken public token;
    KasturiSBT public sbt;
    KasturiVoucher public voucher;
    
    address public owner = address(this);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    
    bytes32 public programBanjar = keccak256("banjar");
    bytes32 public programAmbon = keccak256("ambon");
    
    uint256 public constant EXP_TO_TOKEN_RATE = 1e18; // 1 EXP = 1 Token

    event ContractsUpdated(address token, address sbt, address voucher);
    event ExpToTokenRateUpdated(uint256 newRate);
    event TokensClaimed(address indexed user, uint256 expAmount, uint256 tokenAmount);
    event CredentialIssued(address indexed user, bytes32 indexed programId, uint256 tokenId);

    function setUp() public {
        // Deploy all contracts
        kasturi = new Kasturi(EXP_TO_TOKEN_RATE);
        token = new KasturiToken();
        sbt = new KasturiSBT();
        voucher = new KasturiVoucher("https://api.kasturi.id/voucher/");
        
        // Set Kasturi as minter/operator for sub-contracts
        token.setMinter(address(kasturi), true);
        sbt.setOperator(address(kasturi), true);
        voucher.setOperator(address(kasturi), true);
        
        // Connect contracts
        kasturi.setContracts(address(token), address(sbt), address(voucher));
    }

    // ============ Constructor Tests ============

    function test_Constructor_SetsOwner() public view {
        assertEq(kasturi.owner(), owner);
    }

    function test_Constructor_SetsExpToTokenRate() public view {
        assertEq(kasturi.expToTokenRate(), EXP_TO_TOKEN_RATE);
    }

    // ============ Set Contracts Tests ============

    function test_SetContracts_Success() public {
        Kasturi newKasturi = new Kasturi(EXP_TO_TOKEN_RATE);
        
        vm.expectEmit(false, false, false, true);
        emit ContractsUpdated(address(token), address(sbt), address(voucher));
        
        newKasturi.setContracts(address(token), address(sbt), address(voucher));
        
        assertEq(address(newKasturi.tokenContract()), address(token));
        assertEq(address(newKasturi.sbtContract()), address(sbt));
        assertEq(address(newKasturi.voucherContract()), address(voucher));
    }

    function test_SetContracts_RevertIfZeroAddress() public {
        Kasturi newKasturi = new Kasturi(EXP_TO_TOKEN_RATE);
        
        vm.expectRevert(Kasturi.InvalidAddress.selector);
        newKasturi.setContracts(address(0), address(sbt), address(voucher));
        
        vm.expectRevert(Kasturi.InvalidAddress.selector);
        newKasturi.setContracts(address(token), address(0), address(voucher));
        
        vm.expectRevert(Kasturi.InvalidAddress.selector);
        newKasturi.setContracts(address(token), address(sbt), address(0));
    }

    function test_SetContracts_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        kasturi.setContracts(address(token), address(sbt), address(voucher));
    }

    // ============ Set Rate Tests ============

    function test_SetExpToTokenRate_Success() public {
        vm.expectEmit(false, false, false, true);
        emit ExpToTokenRateUpdated(2e18);
        
        kasturi.setExpToTokenRate(2e18);
        assertEq(kasturi.expToTokenRate(), 2e18);
    }

    function test_SetExpToTokenRate_RevertIfZero() public {
        vm.expectRevert(Kasturi.InvalidAmount.selector);
        kasturi.setExpToTokenRate(0);
    }

    function test_SetExpToTokenRate_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        kasturi.setExpToTokenRate(2e18);
    }

    // ============ Claim Tokens Tests ============

    function test_ClaimTokensForUser_Success() public {
        vm.expectEmit(true, false, false, true);
        emit TokensClaimed(user1, 100, 100 * EXP_TO_TOKEN_RATE);
        
        kasturi.claimTokensForUser(user1, 100);
        
        assertEq(token.balanceOf(user1), 100 * EXP_TO_TOKEN_RATE);
        assertEq(token.getClaimedEXP(user1), 100);
    }

    function test_ClaimTokensForUser_MultipleClaims() public {
        kasturi.claimTokensForUser(user1, 100);
        kasturi.claimTokensForUser(user1, 50);
        
        assertEq(token.balanceOf(user1), 150 * EXP_TO_TOKEN_RATE);
        assertEq(token.getClaimedEXP(user1), 150);
    }

    function test_ClaimTokensForUser_RevertIfContractNotSet() public {
        Kasturi newKasturi = new Kasturi(EXP_TO_TOKEN_RATE);
        
        vm.expectRevert(Kasturi.ContractNotSet.selector);
        newKasturi.claimTokensForUser(user1, 100);
    }

    function test_ClaimTokensForUser_RevertIfZeroAddress() public {
        vm.expectRevert(Kasturi.InvalidAddress.selector);
        kasturi.claimTokensForUser(address(0), 100);
    }

    function test_ClaimTokensForUser_RevertIfZeroAmount() public {
        vm.expectRevert(Kasturi.InvalidAmount.selector);
        kasturi.claimTokensForUser(user1, 0);
    }

    function test_ClaimTokensForUser_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        kasturi.claimTokensForUser(user1, 100);
    }

    // ============ Issue Credential Tests ============

    function test_IssueCredentialForUser_Success() public {
        vm.expectEmit(true, true, false, true);
        emit CredentialIssued(user1, programBanjar, 1);
        
        kasturi.issueCredentialForUser(user1, programBanjar);
        
        assertTrue(sbt.hasCredential(user1, programBanjar));
        assertEq(sbt.getCredentialToken(user1, programBanjar), 1);
    }

    function test_IssueCredentialForUser_MultiplePrograms() public {
        kasturi.issueCredentialForUser(user1, programBanjar);
        kasturi.issueCredentialForUser(user1, programAmbon);
        
        assertTrue(sbt.hasCredential(user1, programBanjar));
        assertTrue(sbt.hasCredential(user1, programAmbon));
    }

    function test_IssueCredentialForUser_RevertIfContractNotSet() public {
        Kasturi newKasturi = new Kasturi(EXP_TO_TOKEN_RATE);
        
        vm.expectRevert(Kasturi.ContractNotSet.selector);
        newKasturi.issueCredentialForUser(user1, programBanjar);
    }

    function test_IssueCredentialForUser_RevertIfZeroAddress() public {
        vm.expectRevert(Kasturi.InvalidAddress.selector);
        kasturi.issueCredentialForUser(address(0), programBanjar);
    }

    function test_IssueCredentialForUser_RevertIfZeroProgram() public {
        vm.expectRevert(Kasturi.InvalidProgram.selector);
        kasturi.issueCredentialForUser(user1, bytes32(0));
    }

    function test_IssueCredentialForUser_RevertIfAlreadyClaimed() public {
        kasturi.issueCredentialForUser(user1, programBanjar);
        
        vm.expectRevert(Kasturi.CredentialAlreadyClaimed.selector);
        kasturi.issueCredentialForUser(user1, programBanjar);
    }

    function test_IssueCredentialForUser_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        kasturi.issueCredentialForUser(user1, programBanjar);
    }

    // ============ View Functions Tests ============

    function test_GetUserStatus() public {
        kasturi.claimTokensForUser(user1, 100);
        
        (uint256 tokenBalance, bool hasCredential, uint256 credentialTokenId) = kasturi.getUserStatus(user1, programBanjar);
        
        assertEq(tokenBalance, 100 * EXP_TO_TOKEN_RATE);
        assertFalse(hasCredential);
        assertEq(credentialTokenId, 0);
    }

    function test_GetUserStatus_WithCredential() public {
        kasturi.claimTokensForUser(user1, 100);
        kasturi.issueCredentialForUser(user1, programBanjar);
        
        (uint256 tokenBalance, bool hasCredential, uint256 credentialTokenId) = kasturi.getUserStatus(user1, programBanjar);
        
        assertEq(tokenBalance, 100 * EXP_TO_TOKEN_RATE);
        assertTrue(hasCredential);
        assertEq(credentialTokenId, 1);
    }

    function test_GetUserStatus_ContractsNotSet() public {
        Kasturi newKasturi = new Kasturi(EXP_TO_TOKEN_RATE);
        
        (uint256 tokenBalance, bool hasCredential, uint256 credentialTokenId) = newKasturi.getUserStatus(user1, programBanjar);
        
        assertEq(tokenBalance, 0);
        assertFalse(hasCredential);
        assertEq(credentialTokenId, 0);
    }

    function test_VerifyCompletion_True() public {
        kasturi.issueCredentialForUser(user1, programBanjar);
        assertTrue(kasturi.verifyCompletion(user1, programBanjar));
    }

    function test_VerifyCompletion_False() public view {
        assertFalse(kasturi.verifyCompletion(user1, programBanjar));
    }

    function test_VerifyCompletion_ContractNotSet() public {
        Kasturi newKasturi = new Kasturi(EXP_TO_TOKEN_RATE);
        assertFalse(newKasturi.verifyCompletion(user1, programBanjar));
    }

    function test_GetCredentialDetails() public {
        kasturi.issueCredentialForUser(user1, programBanjar);
        
        (bool hasCredential, uint256 tokenId, uint256 issuedAt) = kasturi.getCredentialDetails(user1, programBanjar);
        
        assertTrue(hasCredential);
        assertEq(tokenId, 1);
        assertGt(issuedAt, 0);
    }

    function test_GetCredentialDetails_NotCompleted() public view {
        (bool hasCredential, uint256 tokenId, uint256 issuedAt) = kasturi.getCredentialDetails(user1, programBanjar);
        
        assertFalse(hasCredential);
        assertEq(tokenId, 0);
        assertEq(issuedAt, 0);
    }

    function test_GetCredentialDetails_ContractNotSet() public {
        Kasturi newKasturi = new Kasturi(EXP_TO_TOKEN_RATE);
        
        (bool hasCredential, uint256 tokenId, uint256 issuedAt) = newKasturi.getCredentialDetails(user1, programBanjar);
        
        assertFalse(hasCredential);
        assertEq(tokenId, 0);
        assertEq(issuedAt, 0);
    }

    // ============ Integration Tests ============

    function test_FullLearningFlow() public {
        // 1. User completes lessons (off-chain), backend claims tokens
        kasturi.claimTokensForUser(user1, 500);
        assertEq(token.balanceOf(user1), 500 * EXP_TO_TOKEN_RATE);
        
        // 2. User completes program, backend issues credential
        kasturi.issueCredentialForUser(user1, programBanjar);
        assertTrue(sbt.hasCredential(user1, programBanjar));
        assertTrue(kasturi.verifyCompletion(user1, programBanjar));
        
        // 3. User can purchase vouchers with tokens (ERC-1155)
        voucher.setKasturiToken(address(token));
        uint256 sotoVoucherId = voucher.createVoucherType("Voucher Makan Soto", 100 * EXP_TO_TOKEN_RATE);
        token.setMinter(address(voucher), true);
        
        // Buy 3 vouchers
        vm.startPrank(user1);
        token.approve(address(voucher), 300 * EXP_TO_TOKEN_RATE);
        voucher.purchaseVoucher(sotoVoucherId, 3);
        vm.stopPrank();
        
        assertEq(voucher.balanceOf(user1, sotoVoucherId), 3);
        assertEq(token.balanceOf(user1), 200 * EXP_TO_TOKEN_RATE);
        
        // 4. User redeems vouchers one by one
        vm.prank(user1);
        voucher.redeemVoucher(sotoVoucherId, 1);
        assertEq(voucher.balanceOf(user1, sotoVoucherId), 2);
        
        vm.prank(user1);
        voucher.redeemVoucher(sotoVoucherId, 1);
        assertEq(voucher.balanceOf(user1, sotoVoucherId), 1);
    }

    // ============ Fuzz Tests ============

    function testFuzz_ClaimTokensForUser(uint256 expAmount) public {
        vm.assume(expAmount > 0 && expAmount < type(uint128).max);
        
        kasturi.claimTokensForUser(user1, expAmount);
        assertEq(token.balanceOf(user1), expAmount * EXP_TO_TOKEN_RATE);
    }
}
