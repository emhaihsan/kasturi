// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/KasturiSBT.sol";

contract KasturiSBTTest is Test {
    KasturiSBT public sbt;
    
    address public owner = address(this);
    address public operator = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    
    bytes32 public programBanjar = keccak256("banjar");
    bytes32 public programAmbon = keccak256("ambon");

    event CredentialIssued(address indexed user, bytes32 indexed programId, uint256 tokenId);
    event OperatorUpdated(address indexed operator, bool status);
    event BaseURIUpdated(string newBaseURI);

    function setUp() public {
        sbt = new KasturiSBT();
    }

    // ============ Constructor Tests ============

    function test_Constructor_SetsOwner() public view {
        assertEq(sbt.owner(), owner);
    }

    function test_Constructor_SetsNameAndSymbol() public view {
        assertEq(sbt.name(), "Kasturi Learning Credential");
        assertEq(sbt.symbol(), "KASTURI-SBT");
    }

    function test_Constructor_InitialCredentialsIsZero() public view {
        assertEq(sbt.totalCredentials(), 0);
    }

    // ============ Operator Tests ============

    function test_SetOperator_ByOwner() public {
        vm.expectEmit(true, false, false, true);
        emit OperatorUpdated(operator, true);
        
        sbt.setOperator(operator, true);
        assertTrue(sbt.isOperator(operator));
    }

    function test_SetOperator_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        sbt.setOperator(operator, true);
    }

    function test_SetOperator_RevertIfZeroAddress() public {
        vm.expectRevert(KasturiSBT.InvalidAddress.selector);
        sbt.setOperator(address(0), true);
    }

    // ============ Base URI Tests ============

    function test_SetBaseURI_ByOwner() public {
        vm.expectEmit(false, false, false, true);
        emit BaseURIUpdated("https://api.kasturi.id/metadata/");
        
        sbt.setBaseURI("https://api.kasturi.id/metadata/");
    }

    function test_TokenURI_WithBaseURI() public {
        sbt.setBaseURI("https://api.kasturi.id/metadata/");
        sbt.issueCredential(user1, programBanjar);
        
        string memory uri = sbt.tokenURI(1);
        assertEq(uri, "https://api.kasturi.id/metadata/1");
    }

    // ============ Issue Credential Tests ============

    function test_IssueCredential_ByOwner() public {
        vm.expectEmit(true, true, false, true);
        emit CredentialIssued(user1, programBanjar, 1);
        
        uint256 tokenId = sbt.issueCredential(user1, programBanjar);
        
        assertEq(tokenId, 1);
        assertEq(sbt.ownerOf(1), user1);
        assertTrue(sbt.hasCredential(user1, programBanjar));
        assertEq(sbt.getCredentialToken(user1, programBanjar), 1);
        assertEq(sbt.totalCredentials(), 1);
    }

    function test_IssueCredential_ByOperator() public {
        sbt.setOperator(operator, true);
        
        vm.prank(operator);
        uint256 tokenId = sbt.issueCredential(user1, programBanjar);
        
        assertEq(tokenId, 1);
        assertTrue(sbt.hasCredential(user1, programBanjar));
    }

    function test_IssueCredential_MultiplePrograms() public {
        sbt.issueCredential(user1, programBanjar);
        sbt.issueCredential(user1, programAmbon);
        
        assertTrue(sbt.hasCredential(user1, programBanjar));
        assertTrue(sbt.hasCredential(user1, programAmbon));
        assertEq(sbt.getCredentialToken(user1, programBanjar), 1);
        assertEq(sbt.getCredentialToken(user1, programAmbon), 2);
    }

    function test_IssueCredential_MultipleUsers() public {
        sbt.issueCredential(user1, programBanjar);
        sbt.issueCredential(user2, programBanjar);
        
        assertTrue(sbt.hasCredential(user1, programBanjar));
        assertTrue(sbt.hasCredential(user2, programBanjar));
        assertEq(sbt.totalCredentials(), 2);
    }

    function test_IssueCredential_RevertIfUnauthorized() public {
        vm.prank(user1);
        vm.expectRevert(KasturiSBT.UnauthorizedAction.selector);
        sbt.issueCredential(user1, programBanjar);
    }

    function test_IssueCredential_RevertIfZeroAddress() public {
        vm.expectRevert(KasturiSBT.InvalidAddress.selector);
        sbt.issueCredential(address(0), programBanjar);
    }

    function test_IssueCredential_RevertIfZeroProgram() public {
        vm.expectRevert(KasturiSBT.InvalidProgram.selector);
        sbt.issueCredential(user1, bytes32(0));
    }

    function test_IssueCredential_RevertIfAlreadyCompleted() public {
        sbt.issueCredential(user1, programBanjar);
        
        vm.expectRevert(KasturiSBT.AlreadyCompleted.selector);
        sbt.issueCredential(user1, programBanjar);
    }

    // ============ Verification Tests ============

    function test_VerifyCompletion_ReturnsTrue() public {
        sbt.issueCredential(user1, programBanjar);
        assertTrue(sbt.verifyCompletion(user1, programBanjar));
    }

    function test_VerifyCompletion_ReturnsFalse() public view {
        assertFalse(sbt.verifyCompletion(user1, programBanjar));
    }

    function test_GetUserStatus_Completed() public {
        sbt.issueCredential(user1, programBanjar);
        
        (bool completed, uint256 tokenId, uint256 issuedAt) = sbt.getUserStatus(user1, programBanjar);
        
        assertTrue(completed);
        assertEq(tokenId, 1);
        assertGt(issuedAt, 0);
    }

    function test_GetUserStatus_NotCompleted() public view {
        (bool completed, uint256 tokenId, uint256 issuedAt) = sbt.getUserStatus(user1, programBanjar);
        
        assertFalse(completed);
        assertEq(tokenId, 0);
        assertEq(issuedAt, 0);
    }

    function test_GetProgramId() public {
        sbt.issueCredential(user1, programBanjar);
        assertEq(sbt.getProgramId(1), programBanjar);
    }

    // ============ Soulbound Tests (Non-Transferable) ============

    function test_Transfer_RevertNonTransferable() public {
        sbt.issueCredential(user1, programBanjar);
        
        vm.prank(user1);
        vm.expectRevert(KasturiSBT.NonTransferableToken.selector);
        sbt.transferFrom(user1, user2, 1);
    }

    function test_SafeTransfer_RevertNonTransferable() public {
        sbt.issueCredential(user1, programBanjar);
        
        vm.prank(user1);
        vm.expectRevert(KasturiSBT.NonTransferableToken.selector);
        sbt.safeTransferFrom(user1, user2, 1);
    }

    function test_Approve_RevertNonTransferable() public {
        sbt.issueCredential(user1, programBanjar);
        
        vm.prank(user1);
        vm.expectRevert(KasturiSBT.NonTransferableToken.selector);
        sbt.approve(user2, 1);
    }

    function test_SetApprovalForAll_RevertNonTransferable() public {
        vm.prank(user1);
        vm.expectRevert(KasturiSBT.NonTransferableToken.selector);
        sbt.setApprovalForAll(user2, true);
    }

    // ============ Fuzz Tests ============

    function testFuzz_IssueCredential(bytes32 programId) public {
        vm.assume(programId != bytes32(0));
        
        uint256 tokenId = sbt.issueCredential(user1, programId);
        
        assertEq(tokenId, 1);
        assertTrue(sbt.hasCredential(user1, programId));
    }
}
