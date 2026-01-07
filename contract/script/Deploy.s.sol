// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/Kasturi.sol";
import "../src/KasturiToken.sol";
import "../src/KasturiSBT.sol";
import "../src/KasturiVoucher.sol";

contract DeployScript is Script {
    // EXP to Token rate: 1 EXP = 1e18 tokens (1 token with 18 decimals)
    uint256 public constant EXP_TO_TOKEN_RATE = 1e18;

    // Voucher prices (in tokens)
    uint256 public constant FOOD_VOUCHER_PRICE = 100 * 1e18;
    uint256 public constant TRAVEL_VOUCHER_PRICE = 500 * 1e18;

    // Faucet configuration (for demo)
    uint256 public constant FAUCET_AMOUNT = 1000 * 1e18; // 1000 tokens per claim
    uint256 public constant FAUCET_COOLDOWN = 1 days; // 1 day cooldown
    bool public constant FAUCET_ENABLED = true; // Enable for demo

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy all contracts
        KasturiToken token = new KasturiToken();
        KasturiSBT sbt = new KasturiSBT();
        KasturiVoucher voucher = new KasturiVoucher("https://api.kasturi.id/voucher/{id}.json");
        Kasturi kasturi = new Kasturi(EXP_TO_TOKEN_RATE);

        // 2. Set Kasturi as minter/operator for sub-contracts
        token.setMinter(address(kasturi), true);
        sbt.setOperator(address(kasturi), true);
        voucher.setOperator(address(kasturi), true);

        // 3. Connect contracts to main Kasturi contract
        kasturi.setContracts(address(token), address(sbt), address(voucher));

        // 4. Setup voucher contract
        voucher.setKasturiToken(address(token));
        token.setMinter(address(voucher), true); // Allow voucher to burn tokens

        // 5. Create voucher types (ERC-1155)
        voucher.createVoucherType("Voucher Makan", FOOD_VOUCHER_PRICE);
        voucher.createVoucherType("Voucher Wisata", TRAVEL_VOUCHER_PRICE);

        // 6. Set base URI for SBT
        sbt.setBaseURI("https://api.kasturi.id/sbt/");

        // 7. Configure faucet for demo (users can claim free tokens)
        token.setFaucetConfig(FAUCET_AMOUNT, FAUCET_COOLDOWN, FAUCET_ENABLED);

        vm.stopBroadcast();

        // Log deployed addresses
        console.log("=== Kasturi Contracts Deployed ===");
        console.log("KasturiToken:", address(token));
        console.log("KasturiSBT:", address(sbt));
        console.log("KasturiVoucher (ERC-1155):", address(voucher));
        console.log("Kasturi (Main):", address(kasturi));
        console.log("==================================");
        console.log("");
        console.log("=== Configuration ===");
        console.log("EXP to Token Rate:", EXP_TO_TOKEN_RATE);
        console.log("Food Voucher Price:", FOOD_VOUCHER_PRICE);
        console.log("Travel Voucher Price:", TRAVEL_VOUCHER_PRICE);
        console.log("Faucet Amount:", FAUCET_AMOUNT);
        console.log("Faucet Cooldown:", FAUCET_COOLDOWN);
        console.log("Faucet Enabled:", FAUCET_ENABLED);
        console.log("==================================");
    }
}
