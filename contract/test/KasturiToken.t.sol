// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/KasturiToken.sol";

contract KasturiTokenTest is Test {
    KasturiToken public token;
    
    address public owner = address(this);
    address public minter = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    event MinterUpdated(address indexed minter, bool status);
    event TokensClaimed(address indexed user, uint256 expAmount, uint256 tokenAmount);
    event TokensBurned(address indexed user, uint256 amount);

    function setUp() public {
        token = new KasturiToken();
    }

    // ============ Constructor Tests ============

    function test_Constructor_SetsOwner() public view {
        assertEq(token.owner(), owner);
    }

    function test_Constructor_SetsNameAndSymbol() public view {
        assertEq(token.name(), "Kasturi Token");
        assertEq(token.symbol(), "KASTURI");
    }

    function test_Constructor_InitialSupplyIsZero() public view {
        assertEq(token.totalSupply(), 0);
    }

    // ============ Minter Tests ============

    function test_SetMinter_ByOwner() public {
        vm.expectEmit(true, false, false, true);
        emit MinterUpdated(minter, true);
        
        token.setMinter(minter, true);
        assertTrue(token.isMinter(minter));
    }

    function test_SetMinter_RevokeMinter() public {
        token.setMinter(minter, true);
        assertTrue(token.isMinter(minter));
        
        token.setMinter(minter, false);
        assertFalse(token.isMinter(minter));
    }

    function test_SetMinter_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        token.setMinter(minter, true);
    }

    function test_SetMinter_RevertIfZeroAddress() public {
        vm.expectRevert(KasturiToken.InvalidAddress.selector);
        token.setMinter(address(0), true);
    }

    // ============ Claim Tokens Tests ============

    function test_ClaimTokens_ByOwner() public {
        vm.expectEmit(true, false, false, true);
        emit TokensClaimed(user1, 100, 1000);
        
        token.claimTokens(user1, 100, 1000);
        
        assertEq(token.balanceOf(user1), 1000);
        assertEq(token.getClaimedEXP(user1), 100);
    }

    function test_ClaimTokens_ByMinter() public {
        token.setMinter(minter, true);
        
        vm.prank(minter);
        token.claimTokens(user1, 50, 500);
        
        assertEq(token.balanceOf(user1), 500);
        assertEq(token.getClaimedEXP(user1), 50);
    }

    function test_ClaimTokens_MultipleClaims() public {
        token.claimTokens(user1, 100, 1000);
        token.claimTokens(user1, 50, 500);
        
        assertEq(token.balanceOf(user1), 1500);
        assertEq(token.getClaimedEXP(user1), 150);
    }

    function test_ClaimTokens_RevertIfUnauthorized() public {
        vm.prank(user1);
        vm.expectRevert(KasturiToken.UnauthorizedMinter.selector);
        token.claimTokens(user1, 100, 1000);
    }

    function test_ClaimTokens_RevertIfZeroAddress() public {
        vm.expectRevert(KasturiToken.InvalidAddress.selector);
        token.claimTokens(address(0), 100, 1000);
    }

    function test_ClaimTokens_RevertIfZeroAmount() public {
        vm.expectRevert(KasturiToken.InvalidAmount.selector);
        token.claimTokens(user1, 100, 0);
    }

    // ============ Burn Tests ============

    function test_Burn_ByUser() public {
        token.claimTokens(user1, 100, 1000);
        
        vm.expectEmit(true, false, false, true);
        emit TokensBurned(user1, 300);
        
        vm.prank(user1);
        token.burn(300);
        
        assertEq(token.balanceOf(user1), 700);
    }

    function test_Burn_AllTokens() public {
        token.claimTokens(user1, 100, 1000);
        
        vm.prank(user1);
        token.burn(1000);
        
        assertEq(token.balanceOf(user1), 0);
    }

    function test_Burn_RevertIfZeroAmount() public {
        token.claimTokens(user1, 100, 1000);
        
        vm.prank(user1);
        vm.expectRevert(KasturiToken.InvalidAmount.selector);
        token.burn(0);
    }

    function test_Burn_RevertIfInsufficientBalance() public {
        token.claimTokens(user1, 100, 1000);
        
        vm.prank(user1);
        vm.expectRevert(KasturiToken.InsufficientBalance.selector);
        token.burn(2000);
    }

    // ============ BurnFrom Tests ============

    function test_BurnFrom_ByMinter() public {
        token.setMinter(minter, true);
        token.claimTokens(user1, 100, 1000);
        
        vm.prank(minter);
        token.burnFrom(user1, 300);
        
        assertEq(token.balanceOf(user1), 700);
    }

    function test_BurnFrom_RevertIfUnauthorized() public {
        token.claimTokens(user1, 100, 1000);
        
        vm.prank(user2);
        vm.expectRevert(KasturiToken.UnauthorizedMinter.selector);
        token.burnFrom(user1, 300);
    }

    function test_BurnFrom_RevertIfZeroAddress() public {
        vm.expectRevert(KasturiToken.InvalidAddress.selector);
        token.burnFrom(address(0), 100);
    }

    function test_BurnFrom_RevertIfZeroAmount() public {
        token.claimTokens(user1, 100, 1000);
        vm.expectRevert(KasturiToken.InvalidAmount.selector);
        token.burnFrom(user1, 0);
    }

    function test_BurnFrom_RevertIfInsufficientBalance() public {
        token.claimTokens(user1, 100, 1000);
        vm.expectRevert(KasturiToken.InsufficientBalance.selector);
        token.burnFrom(user1, 2000);
    }

    // ============ Transfer Tests ============

    function test_Transfer_Works() public {
        token.claimTokens(user1, 100, 1000);
        
        vm.prank(user1);
        token.transfer(user2, 400);
        
        assertEq(token.balanceOf(user1), 600);
        assertEq(token.balanceOf(user2), 400);
    }

    // ============ Fuzz Tests ============

    function testFuzz_ClaimTokens(uint256 expAmount, uint256 tokenAmount) public {
        vm.assume(expAmount > 0 && expAmount < type(uint128).max);
        vm.assume(tokenAmount > 0 && tokenAmount < type(uint128).max);
        
        token.claimTokens(user1, expAmount, tokenAmount);
        
        assertEq(token.balanceOf(user1), tokenAmount);
        assertEq(token.getClaimedEXP(user1), expAmount);
    }

    function testFuzz_Burn(uint256 claimAmount, uint256 burnAmount) public {
        vm.assume(claimAmount > 0 && claimAmount < type(uint128).max);
        vm.assume(burnAmount > 0 && burnAmount <= claimAmount);
        
        token.claimTokens(user1, 100, claimAmount);
        
        vm.prank(user1);
        token.burn(burnAmount);
        
        assertEq(token.balanceOf(user1), claimAmount - burnAmount);
    }
}
