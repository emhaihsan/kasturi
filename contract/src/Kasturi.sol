// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./KasturiToken.sol";
import "./KasturiSBT.sol";
import "./KasturiVoucher.sol";

/**
 * @title Kasturi
 * @notice Main coordinator contract for Kasturi learning platform
 * @dev Manages token claims, credentials, and vouchers
 * 
 * Architecture:
 * - EXP is tracked OFF-CHAIN (web2 database) for gas efficiency
 * - Users claim Kasturi Tokens ON-CHAIN by converting off-chain EXP
 * - Kasturi Tokens can be used to purchase Voucher NFTs
 * - SBT credentials are issued for program completion
 */
contract Kasturi is Ownable {
    // Contract references
    KasturiToken public tokenContract;
    KasturiSBT public sbtContract;
    KasturiVoucher public voucherContract;

    // Conversion rate: 1 EXP = X tokens (e.g., 1 EXP = 1e18 tokens)
    uint256 public expToTokenRate;

    // Events
    event ContractsUpdated(address token, address sbt, address voucher);
    event ExpToTokenRateUpdated(uint256 newRate);
    event TokensClaimed(address indexed user, uint256 expAmount, uint256 tokenAmount);
    event CredentialIssued(address indexed user, bytes32 indexed programId, uint256 tokenId);

    // Errors
    error ContractNotSet();
    error InvalidProgram();
    error CredentialAlreadyClaimed();
    error InvalidAddress();
    error InvalidAmount();

    constructor(uint256 _expToTokenRate) Ownable(msg.sender) {
        expToTokenRate = _expToTokenRate;
    }

    /**
     * @notice Set contract references
     * @param _token Address of KasturiToken contract
     * @param _sbt Address of KasturiSBT contract
     * @param _voucher Address of KasturiUtility (voucher) contract
     */
    function setContracts(
        address _token,
        address _sbt,
        address _voucher
    ) external onlyOwner {
        if (_token == address(0) || _sbt == address(0) || _voucher == address(0)) {
            revert InvalidAddress();
        }
        tokenContract = KasturiToken(_token);
        sbtContract = KasturiSBT(_sbt);
        voucherContract = KasturiVoucher(_voucher);
        emit ContractsUpdated(_token, _sbt, _voucher);
    }

    /**
     * @notice Set EXP to Token conversion rate
     * @param rate New rate (tokens per 1 EXP, with 18 decimals)
     */
    function setExpToTokenRate(uint256 rate) external onlyOwner {
        if (rate == 0) revert InvalidAmount();
        expToTokenRate = rate;
        emit ExpToTokenRateUpdated(rate);
    }

    /**
     * @notice Claim tokens for a user (called by backend after verifying off-chain EXP)
     * @param user Address of the user
     * @param expAmount Amount of EXP being converted
     */
    function claimTokensForUser(address user, uint256 expAmount) external onlyOwner {
        if (address(tokenContract) == address(0)) revert ContractNotSet();
        if (user == address(0)) revert InvalidAddress();
        if (expAmount == 0) revert InvalidAmount();

        uint256 tokenAmount = expAmount * expToTokenRate;
        tokenContract.claimTokens(user, expAmount, tokenAmount);
        
        emit TokensClaimed(user, expAmount, tokenAmount);
    }

    /**
     * @notice Issue credential to user (called by backend after verifying program completion)
     * @param user Address of the user
     * @param programId Program identifier
     */
    function issueCredentialForUser(address user, bytes32 programId) external onlyOwner {
        if (address(sbtContract) == address(0)) revert ContractNotSet();
        if (user == address(0)) revert InvalidAddress();
        if (programId == bytes32(0)) revert InvalidProgram();
        
        if (sbtContract.hasCredential(user, programId)) {
            revert CredentialAlreadyClaimed();
        }

        uint256 tokenId = sbtContract.issueCredential(user, programId);
        emit CredentialIssued(user, programId, tokenId);
    }

    /**
     * @notice Get user's token balance and credential status
     * @param user Address of the user
     * @param programId Program to check
     * @return tokenBalance User's Kasturi Token balance
     * @return hasCredential Whether user has the credential
     * @return credentialTokenId Token ID of credential (0 if none)
     */
    function getUserStatus(
        address user,
        bytes32 programId
    ) external view returns (
        uint256 tokenBalance,
        bool hasCredential,
        uint256 credentialTokenId
    ) {
        if (address(tokenContract) != address(0)) {
            tokenBalance = tokenContract.balanceOf(user);
        }
        if (address(sbtContract) != address(0)) {
            hasCredential = sbtContract.hasCredential(user, programId);
            credentialTokenId = sbtContract.getCredentialToken(user, programId);
        }
    }

    /**
     * @notice Verify if a user has completed a program (public verification)
     * @param user Address to verify
     * @param programId Program to check
     * @return completed Whether user has completed
     */
    function verifyCompletion(address user, bytes32 programId) external view returns (bool) {
        if (address(sbtContract) == address(0)) return false;
        return sbtContract.hasCredential(user, programId);
    }

    /**
     * @notice Get credential details for verification
     * @param user Address to check
     * @param programId Program to check
     * @return hasCredential Whether user has credential
     * @return tokenId Credential token ID
     * @return issuedAt Timestamp when issued
     */
    function getCredentialDetails(
        address user,
        bytes32 programId
    ) external view returns (
        bool hasCredential,
        uint256 tokenId,
        uint256 issuedAt
    ) {
        if (address(sbtContract) == address(0)) {
            return (false, 0, 0);
        }
        return sbtContract.getUserStatus(user, programId);
    }
}
