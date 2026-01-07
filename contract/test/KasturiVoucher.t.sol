// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/KasturiVoucher.sol";
import "../src/KasturiToken.sol";

contract KasturiVoucherTest is Test {
    KasturiVoucher public voucher;
    KasturiToken public token;
    
    address public owner = address(this);
    address public operator = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    
    uint256 public constant VOUCHER_PRICE = 100 * 1e18;

    function setUp() public {
        token = new KasturiToken();
        voucher = new KasturiVoucher("https://api.kasturi.id/voucher/{id}.json");
        
        voucher.setKasturiToken(address(token));
        token.setMinter(address(voucher), true);
    }

    // ============ Constructor Tests ============

    function test_Constructor_SetsOwner() public view {
        assertEq(voucher.owner(), owner);
    }

    // ============ Setup Tests ============

    function test_SetKasturiToken() public {
        KasturiVoucher newVoucher = new KasturiVoucher("");
        newVoucher.setKasturiToken(address(token));
        assertEq(address(newVoucher.kasturiToken()), address(token));
    }

    function test_SetKasturiToken_RevertIfZeroAddress() public {
        KasturiVoucher newVoucher = new KasturiVoucher("");
        vm.expectRevert(KasturiVoucher.InvalidAddress.selector);
        newVoucher.setKasturiToken(address(0));
    }

    function test_SetOperator_ByOwner() public {
        voucher.setOperator(operator, true);
        assertTrue(voucher.isOperator(operator));
    }

    function test_SetOperator_RevertIfZeroAddress() public {
        vm.expectRevert(KasturiVoucher.InvalidAddress.selector);
        voucher.setOperator(address(0), true);
    }

    // ============ Create Voucher Type Tests ============

    function test_CreateVoucherType() public {
        uint256 voucherId = voucher.createVoucherType("Voucher Makan Soto", VOUCHER_PRICE);
        
        assertEq(voucherId, 1);
        
        (string memory name, uint256 price, bool active, uint256 totalMinted, uint256 totalRedeemed) = voucher.getVoucherType(1);
        
        assertEq(name, "Voucher Makan Soto");
        assertEq(price, VOUCHER_PRICE);
        assertTrue(active);
        assertEq(totalMinted, 0);
        assertEq(totalRedeemed, 0);
    }

    function test_CreateVoucherType_MultipleTypes() public {
        voucher.createVoucherType("Voucher Makan", VOUCHER_PRICE);
        voucher.createVoucherType("Voucher Wisata", VOUCHER_PRICE * 5);
        
        assertEq(voucher.totalVoucherTypes(), 2);
    }

    function test_CreateVoucherType_RevertIfZeroPrice() public {
        vm.expectRevert(KasturiVoucher.InvalidPrice.selector);
        voucher.createVoucherType("Invalid", 0);
    }

    // ============ Update Voucher Type Tests ============

    function test_UpdateVoucherType() public {
        voucher.createVoucherType("Voucher Test", VOUCHER_PRICE);
        
        voucher.updateVoucherType(1, VOUCHER_PRICE * 2, true);
        
        (, uint256 price, bool active,,) = voucher.getVoucherType(1);
        assertEq(price, VOUCHER_PRICE * 2);
        assertTrue(active);
    }

    function test_UpdateVoucherType_Deactivate() public {
        voucher.createVoucherType("Voucher Test", VOUCHER_PRICE);
        
        voucher.updateVoucherType(1, 0, false);
        
        (,, bool active,,) = voucher.getVoucherType(1);
        assertFalse(active);
    }

    function test_UpdateVoucherType_RevertIfInvalidId() public {
        vm.expectRevert(KasturiVoucher.InvalidVoucherId.selector);
        voucher.updateVoucherType(99, VOUCHER_PRICE, true);
    }

    // ============ Purchase Voucher Tests ============

    function test_PurchaseVoucher_Single() public {
        uint256 voucherId = voucher.createVoucherType("Voucher Soto", VOUCHER_PRICE);
        token.claimTokens(user1, 100, VOUCHER_PRICE);
        
        vm.startPrank(user1);
        token.approve(address(voucher), VOUCHER_PRICE);
        voucher.purchaseVoucher(voucherId, 1);
        vm.stopPrank();
        
        assertEq(voucher.balanceOf(user1, voucherId), 1);
        assertEq(token.balanceOf(user1), 0);
    }

    function test_PurchaseVoucher_Multiple() public {
        uint256 voucherId = voucher.createVoucherType("Voucher Soto", VOUCHER_PRICE);
        token.claimTokens(user1, 500, VOUCHER_PRICE * 5);
        
        vm.startPrank(user1);
        token.approve(address(voucher), VOUCHER_PRICE * 5);
        voucher.purchaseVoucher(voucherId, 5);
        vm.stopPrank();
        
        assertEq(voucher.balanceOf(user1, voucherId), 5);
        assertEq(token.balanceOf(user1), 0);
        
        (,,, uint256 totalMinted,) = voucher.getVoucherType(voucherId);
        assertEq(totalMinted, 5);
    }

    function test_PurchaseVoucher_RevertIfTokenNotSet() public {
        KasturiVoucher newVoucher = new KasturiVoucher("");
        newVoucher.createVoucherType("Test", VOUCHER_PRICE);
        
        vm.expectRevert(KasturiVoucher.TokenNotSet.selector);
        newVoucher.purchaseVoucher(1, 1);
    }

    function test_PurchaseVoucher_RevertIfInvalidId() public {
        vm.expectRevert(KasturiVoucher.InvalidVoucherId.selector);
        voucher.purchaseVoucher(99, 1);
    }

    function test_PurchaseVoucher_RevertIfZeroAmount() public {
        voucher.createVoucherType("Test", VOUCHER_PRICE);
        
        vm.expectRevert(KasturiVoucher.InvalidAmount.selector);
        voucher.purchaseVoucher(1, 0);
    }

    function test_PurchaseVoucher_RevertIfNotActive() public {
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        voucher.updateVoucherType(voucherId, 0, false);
        
        vm.expectRevert(KasturiVoucher.VoucherNotActive.selector);
        voucher.purchaseVoucher(voucherId, 1);
    }

    function test_PurchaseVoucher_RevertIfInsufficientTokens() public {
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        token.claimTokens(user1, 50, VOUCHER_PRICE / 2);
        
        vm.startPrank(user1);
        token.approve(address(voucher), VOUCHER_PRICE);
        vm.expectRevert(KasturiVoucher.InsufficientTokens.selector);
        voucher.purchaseVoucher(voucherId, 1);
        vm.stopPrank();
    }

    // ============ Grant Voucher Tests ============

    function test_GrantVoucher_ByOwner() public {
        uint256 voucherId = voucher.createVoucherType("Promo Voucher", VOUCHER_PRICE);
        
        voucher.grantVoucher(user1, voucherId, 3);
        
        assertEq(voucher.balanceOf(user1, voucherId), 3);
    }

    function test_GrantVoucher_ByOperator() public {
        uint256 voucherId = voucher.createVoucherType("Promo Voucher", VOUCHER_PRICE);
        voucher.setOperator(operator, true);
        
        vm.prank(operator);
        voucher.grantVoucher(user1, voucherId, 2);
        
        assertEq(voucher.balanceOf(user1, voucherId), 2);
    }

    function test_GrantVoucher_RevertIfUnauthorized() public {
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        
        vm.prank(user1);
        vm.expectRevert(KasturiVoucher.UnauthorizedAction.selector);
        voucher.grantVoucher(user1, voucherId, 1);
    }

    function test_GrantVoucher_RevertIfZeroAddress() public {
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        
        vm.expectRevert(KasturiVoucher.InvalidAddress.selector);
        voucher.grantVoucher(address(0), voucherId, 1);
    }

    // ============ Redeem Voucher Tests ============

    function test_RedeemVoucher_Single() public {
        uint256 voucherId = voucher.createVoucherType("Voucher Soto", VOUCHER_PRICE);
        voucher.grantVoucher(user1, voucherId, 3);
        
        vm.prank(user1);
        voucher.redeemVoucher(voucherId, 1);
        
        assertEq(voucher.balanceOf(user1, voucherId), 2);
        assertEq(voucher.getUserRedemptions(user1, voucherId), 1);
    }

    function test_RedeemVoucher_Multiple() public {
        uint256 voucherId = voucher.createVoucherType("Voucher Soto", VOUCHER_PRICE);
        voucher.grantVoucher(user1, voucherId, 5);
        
        vm.prank(user1);
        voucher.redeemVoucher(voucherId, 3);
        
        assertEq(voucher.balanceOf(user1, voucherId), 2);
        assertEq(voucher.getUserRedemptions(user1, voucherId), 3);
        
        (,,,, uint256 totalRedeemed) = voucher.getVoucherType(voucherId);
        assertEq(totalRedeemed, 3);
    }

    function test_RedeemVoucher_RevertIfInvalidId() public {
        vm.expectRevert(KasturiVoucher.InvalidVoucherId.selector);
        voucher.redeemVoucher(99, 1);
    }

    function test_RedeemVoucher_RevertIfZeroAmount() public {
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        voucher.grantVoucher(user1, voucherId, 1);
        
        vm.prank(user1);
        vm.expectRevert(KasturiVoucher.InvalidAmount.selector);
        voucher.redeemVoucher(voucherId, 0);
    }

    function test_RedeemVoucher_RevertIfInsufficientVouchers() public {
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        voucher.grantVoucher(user1, voucherId, 2);
        
        vm.prank(user1);
        vm.expectRevert(KasturiVoucher.InsufficientVouchers.selector);
        voucher.redeemVoucher(voucherId, 5);
    }

    // ============ Transfer Tests (ERC-1155 is transferable) ============

    function test_Transfer_Allowed() public {
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        voucher.grantVoucher(user1, voucherId, 3);
        
        vm.prank(user1);
        voucher.safeTransferFrom(user1, user2, voucherId, 2, "");
        
        assertEq(voucher.balanceOf(user1, voucherId), 1);
        assertEq(voucher.balanceOf(user2, voucherId), 2);
    }

    // ============ View Functions ============

    function test_GetVoucherBalance() public {
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        voucher.grantVoucher(user1, voucherId, 5);
        
        assertEq(voucher.getVoucherBalance(user1, voucherId), 5);
    }

    function test_TotalVoucherTypes() public {
        voucher.createVoucherType("Type 1", VOUCHER_PRICE);
        voucher.createVoucherType("Type 2", VOUCHER_PRICE);
        voucher.createVoucherType("Type 3", VOUCHER_PRICE);
        
        assertEq(voucher.totalVoucherTypes(), 3);
    }

    // ============ Full Flow Test ============

    function test_FullVoucherFlow() public {
        // Create voucher type
        uint256 sotoVoucherId = voucher.createVoucherType("Voucher Makan Soto", VOUCHER_PRICE);
        
        // User gets tokens from learning
        token.claimTokens(user1, 500, VOUCHER_PRICE * 5);
        
        // User buys 3 soto vouchers
        vm.startPrank(user1);
        token.approve(address(voucher), VOUCHER_PRICE * 3);
        voucher.purchaseVoucher(sotoVoucherId, 3);
        vm.stopPrank();
        
        assertEq(voucher.balanceOf(user1, sotoVoucherId), 3);
        assertEq(token.balanceOf(user1), VOUCHER_PRICE * 2); // 200 tokens left
        
        // User redeems vouchers one by one (like using at restaurant)
        vm.prank(user1);
        voucher.redeemVoucher(sotoVoucherId, 1);
        assertEq(voucher.balanceOf(user1, sotoVoucherId), 2);
        
        vm.prank(user1);
        voucher.redeemVoucher(sotoVoucherId, 1);
        assertEq(voucher.balanceOf(user1, sotoVoucherId), 1);
        
        // User gives remaining voucher to friend
        vm.prank(user1);
        voucher.safeTransferFrom(user1, user2, sotoVoucherId, 1, "");
        
        assertEq(voucher.balanceOf(user1, sotoVoucherId), 0);
        assertEq(voucher.balanceOf(user2, sotoVoucherId), 1);
        
        // Friend redeems the voucher
        vm.prank(user2);
        voucher.redeemVoucher(sotoVoucherId, 1);
        assertEq(voucher.balanceOf(user2, sotoVoucherId), 0);
        
        // Check stats
        (,,,uint256 totalMinted, uint256 totalRedeemed) = voucher.getVoucherType(sotoVoucherId);
        assertEq(totalMinted, 3);
        assertEq(totalRedeemed, 3);
    }

    // ============ Fuzz Tests ============

    function testFuzz_PurchaseAndRedeem(uint8 amount) public {
        vm.assume(amount > 0 && amount < 50);
        
        uint256 voucherId = voucher.createVoucherType("Test", VOUCHER_PRICE);
        uint256 totalCost = VOUCHER_PRICE * uint256(amount);
        uint256 expAmount = uint256(amount) * 100;
        
        token.claimTokens(user1, expAmount, totalCost);
        
        vm.startPrank(user1);
        token.approve(address(voucher), totalCost);
        voucher.purchaseVoucher(voucherId, amount);
        vm.stopPrank();
        
        assertEq(voucher.balanceOf(user1, voucherId), amount);
        
        vm.prank(user1);
        voucher.redeemVoucher(voucherId, amount);
        
        assertEq(voucher.balanceOf(user1, voucherId), 0);
    }
}
