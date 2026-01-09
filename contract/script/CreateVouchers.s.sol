// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/KasturiVoucher.sol";

contract CreateVouchersScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address voucherAddress = vm.envAddress("KASTURI_VOUCHER");
        
        vm.startBroadcast(deployerPrivateKey);

        KasturiVoucher voucher = KasturiVoucher(voucherAddress);

        // Create 3 new voucher types
        // 1. Gratis 1 Mangkok Soto Bang Amat Bawah Jembatan - 500 KSTR
        voucher.createVoucherType(
            "Gratis 1 Mangkok Soto Bang Amat Bawah Jembatan",
            500 * 1e18
        );

        // 2. Diskon 50% Wisata Phinisi Sungai Barito - 300 KSTR
        voucher.createVoucherType(
            "Diskon 50% Wisata Phinisi Sungai Barito",
            300 * 1e18
        );

        // 3. Diskon 30% Sewa Perahu ke Pasar Terapung Lok Baintan - 200 KSTR
        voucher.createVoucherType(
            "Diskon 30% Sewa Perahu ke Pasar Terapung Lok Baintan",
            200 * 1e18
        );

        vm.stopBroadcast();

        console.log("=== Vouchers Created ===");
        console.log("Total voucher types:", voucher.totalVoucherTypes());
        console.log("=======================");
    }
}
