// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/KasturiVoucher.sol";

/**
 * @title SetVoucherURIScript
 * @notice Script to update the metadata URI for KasturiVoucher ERC-1155 contract
 * @dev This script sets the base URI that will be used for all voucher token metadata
 */
contract SetVoucherURIScript is Script {
    // Deployed voucher contract address on Lisk Sepolia
    address constant VOUCHER_ADDRESS = 0x7614C13cD1b629262161de25857AEb502cB54499;
    
    // New metadata URI - points to our API endpoint
    // The {id} placeholder will be replaced by the token ID by ERC-1155 clients
    // Example: For token ID 3, it becomes: https://kasturi.fun/api/voucher/3
    string constant NEW_URI = "https://kasturi.fun/api/voucher/{id}";

    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Get voucher contract instance
        KasturiVoucher voucher = KasturiVoucher(VOUCHER_ADDRESS);

        // Update the metadata URI
        console.log("=== Updating KasturiVoucher Metadata URI ===");
        console.log("Contract Address:", VOUCHER_ADDRESS);
        console.log("New URI:", NEW_URI);
        console.log("");
        
        voucher.setURI(NEW_URI);
        
        console.log("URI updated successfully!");
        console.log("===========================================");

        // Stop broadcasting
        vm.stopBroadcast();
    }
}
