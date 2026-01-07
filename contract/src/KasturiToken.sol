// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KasturiToken
 * @notice ERC20 token that users can claim by converting off-chain EXP
 * @dev Backend verifies EXP balance off-chain, then calls mint for eligible users
 */
contract KasturiToken is ERC20, Ownable {
    // Mapping of authorized minters (backend services)
    mapping(address => bool) private _minters;

    // Mapping to track claimed EXP per user (prevents double claiming)
    mapping(address => uint256) private _claimedEXP;

    // Events
    event MinterUpdated(address indexed minter, bool status);
    event TokensClaimed(address indexed user, uint256 expAmount, uint256 tokenAmount);
    event TokensBurned(address indexed user, uint256 amount);

    // Errors
    error UnauthorizedMinter();
    error InvalidAddress();
    error InvalidAmount();
    error InsufficientBalance();

    constructor() ERC20("Kasturi Token", "KASTURI") Ownable(msg.sender) {}

    /**
     * @notice Check if caller is an authorized minter
     */
    modifier onlyMinter() {
        if (!_minters[msg.sender] && msg.sender != owner()) {
            revert UnauthorizedMinter();
        }
        _;
    }

    /**
     * @notice Set minter status
     * @param minter Address to set as minter
     * @param status True to authorize, false to revoke
     */
    function setMinter(address minter, bool status) external onlyOwner {
        if (minter == address(0)) revert InvalidAddress();
        _minters[minter] = status;
        emit MinterUpdated(minter, status);
    }

    /**
     * @notice Check if address is a minter
     * @param minter Address to check
     * @return bool True if minter
     */
    function isMinter(address minter) external view returns (bool) {
        return _minters[minter];
    }

    /**
     * @notice Mint tokens to user (called by backend after verifying off-chain EXP)
     * @param user Address of the user
     * @param expAmount Amount of EXP being converted (for tracking)
     * @param tokenAmount Amount of tokens to mint
     */
    function claimTokens(
        address user,
        uint256 expAmount,
        uint256 tokenAmount
    ) external onlyMinter {
        if (user == address(0)) revert InvalidAddress();
        if (tokenAmount == 0) revert InvalidAmount();

        _claimedEXP[user] += expAmount;
        _mint(user, tokenAmount);

        emit TokensClaimed(user, expAmount, tokenAmount);
    }

    /**
     * @notice Burn tokens from caller's balance
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        if (amount == 0) revert InvalidAmount();
        if (balanceOf(msg.sender) < amount) revert InsufficientBalance();
        
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @notice Burn tokens from user (for purchasing vouchers)
     * @param user Address to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address user, uint256 amount) external onlyMinter {
        if (user == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        if (balanceOf(user) < amount) revert InsufficientBalance();

        _burn(user, amount);
        emit TokensBurned(user, amount);
    }

    /**
     * @notice Get total EXP claimed by user
     * @param user Address to check
     * @return uint256 Total EXP claimed
     */
    function getClaimedEXP(address user) external view returns (uint256) {
        return _claimedEXP[user];
    }
}
