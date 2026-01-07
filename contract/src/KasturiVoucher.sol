// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./KasturiToken.sol";

/**
 * @title KasturiVoucher
 * @notice ERC-1155 Voucher system - users can buy and redeem multiple vouchers of the same type
 * @dev Like marketplace vouchers (Shopee/Tokopedia) - buy multiple, use one at a time
 * 
 * Example: User buys 5 "Soto Vouchers", can redeem them one by one
 */
contract KasturiVoucher is ERC1155, Ownable {
    // Kasturi Token contract reference
    KasturiToken public kasturiToken;
    
    // Mapping of authorized operators
    mapping(address => bool) private _operators;

    // Voucher type info
    struct VoucherType {
        string name;           // e.g., "Voucher Makan Soto"
        uint256 price;         // Price in Kasturi Tokens
        bool active;           // Is this voucher available for purchase
        uint256 totalMinted;   // Total vouchers minted
        uint256 totalRedeemed; // Total vouchers redeemed
    }

    // Mapping of voucher ID to VoucherType info
    mapping(uint256 => VoucherType) public voucherTypes;

    // Counter for voucher type IDs
    uint256 private _nextVoucherId;

    // Track total redeemed per user per voucher type
    mapping(address => mapping(uint256 => uint256)) public userRedemptions;

    // Events
    event VoucherTypeCreated(uint256 indexed voucherId, string name, uint256 price);
    event VoucherTypeUpdated(uint256 indexed voucherId, uint256 price, bool active);
    event VoucherPurchased(address indexed user, uint256 indexed voucherId, uint256 amount, uint256 totalPrice);
    event VoucherRedeemed(address indexed user, uint256 indexed voucherId, uint256 amount);
    event VoucherGranted(address indexed user, uint256 indexed voucherId, uint256 amount);
    event OperatorUpdated(address indexed operator, bool status);
    event KasturiTokenUpdated(address indexed tokenAddress);

    // Errors
    error UnauthorizedAction();
    error InvalidAddress();
    error InvalidVoucherId();
    error InvalidAmount();
    error InvalidPrice();
    error InsufficientTokens();
    error InsufficientVouchers();
    error TokenNotSet();
    error VoucherNotActive();

    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {
        _nextVoucherId = 1; // Start from 1
    }

    /**
     * @notice Check if caller is owner or authorized operator
     */
    modifier onlyAuthorized() {
        if (msg.sender != owner() && !_operators[msg.sender]) {
            revert UnauthorizedAction();
        }
        _;
    }

    /**
     * @notice Set Kasturi Token contract address
     * @param _kasturiToken Address of KasturiToken contract
     */
    function setKasturiToken(address _kasturiToken) external onlyOwner {
        if (_kasturiToken == address(0)) revert InvalidAddress();
        kasturiToken = KasturiToken(_kasturiToken);
        emit KasturiTokenUpdated(_kasturiToken);
    }

    /**
     * @notice Set operator status
     * @param operator Address to set as operator
     * @param status True to authorize, false to revoke
     */
    function setOperator(address operator, bool status) external onlyOwner {
        if (operator == address(0)) revert InvalidAddress();
        _operators[operator] = status;
        emit OperatorUpdated(operator, status);
    }

    /**
     * @notice Check if address is an operator
     */
    function isOperator(address operator) external view returns (bool) {
        return _operators[operator];
    }

    /**
     * @notice Set base URI for metadata
     */
    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }

    /**
     * @notice Create a new voucher type
     * @param name Human-readable name (e.g., "Voucher Makan Soto")
     * @param price Price in Kasturi Tokens (with 18 decimals)
     * @return voucherId The created voucher type ID
     */
    function createVoucherType(string calldata name, uint256 price) external onlyOwner returns (uint256) {
        if (price == 0) revert InvalidPrice();
        
        uint256 voucherId = _nextVoucherId;
        _nextVoucherId++;
        
        voucherTypes[voucherId] = VoucherType({
            name: name,
            price: price,
            active: true,
            totalMinted: 0,
            totalRedeemed: 0
        });
        
        emit VoucherTypeCreated(voucherId, name, price);
        return voucherId;
    }

    /**
     * @notice Update voucher type price and status
     * @param voucherId Voucher type ID
     * @param price New price (0 to keep current)
     * @param active Whether voucher is available for purchase
     */
    function updateVoucherType(uint256 voucherId, uint256 price, bool active) external onlyOwner {
        if (voucherId == 0 || voucherId >= _nextVoucherId) revert InvalidVoucherId();
        if (active && price == 0 && voucherTypes[voucherId].price == 0) revert InvalidPrice();
        
        if (price > 0) {
            voucherTypes[voucherId].price = price;
        }
        voucherTypes[voucherId].active = active;
        
        emit VoucherTypeUpdated(voucherId, voucherTypes[voucherId].price, active);
    }

    /**
     * @notice Purchase vouchers using Kasturi Tokens
     * @param voucherId Voucher type to purchase
     * @param amount Number of vouchers to buy
     */
    function purchaseVoucher(uint256 voucherId, uint256 amount) external {
        if (address(kasturiToken) == address(0)) revert TokenNotSet();
        if (voucherId == 0 || voucherId >= _nextVoucherId) revert InvalidVoucherId();
        if (amount == 0) revert InvalidAmount();
        
        VoucherType storage vType = voucherTypes[voucherId];
        if (!vType.active) revert VoucherNotActive();
        
        uint256 totalPrice = vType.price * amount;
        if (kasturiToken.balanceOf(msg.sender) < totalPrice) revert InsufficientTokens();
        
        // Transfer and burn tokens
        kasturiToken.transferFrom(msg.sender, address(this), totalPrice);
        kasturiToken.burn(totalPrice);
        
        // Mint vouchers to user
        _mint(msg.sender, voucherId, amount, "");
        vType.totalMinted += amount;
        
        emit VoucherPurchased(msg.sender, voucherId, amount, totalPrice);
    }

    /**
     * @notice Grant vouchers to user (for promotions, rewards, etc.)
     * @param user Address to receive vouchers
     * @param voucherId Voucher type ID
     * @param amount Number of vouchers to grant
     */
    function grantVoucher(address user, uint256 voucherId, uint256 amount) external onlyAuthorized {
        if (user == address(0)) revert InvalidAddress();
        if (voucherId == 0 || voucherId >= _nextVoucherId) revert InvalidVoucherId();
        if (amount == 0) revert InvalidAmount();
        
        _mint(user, voucherId, amount, "");
        voucherTypes[voucherId].totalMinted += amount;
        
        emit VoucherGranted(user, voucherId, amount);
    }

    /**
     * @notice Redeem vouchers (burn them after use)
     * @param voucherId Voucher type to redeem
     * @param amount Number of vouchers to redeem
     */
    function redeemVoucher(uint256 voucherId, uint256 amount) external {
        if (voucherId == 0 || voucherId >= _nextVoucherId) revert InvalidVoucherId();
        if (amount == 0) revert InvalidAmount();
        if (balanceOf(msg.sender, voucherId) < amount) revert InsufficientVouchers();
        
        // Burn the vouchers
        _burn(msg.sender, voucherId, amount);
        voucherTypes[voucherId].totalRedeemed += amount;
        userRedemptions[msg.sender][voucherId] += amount;
        
        emit VoucherRedeemed(msg.sender, voucherId, amount);
    }

    /**
     * @notice Get voucher type info
     * @param voucherId Voucher type ID
     */
    function getVoucherType(uint256 voucherId) external view returns (
        string memory name,
        uint256 price,
        bool active,
        uint256 totalMinted,
        uint256 totalRedeemed
    ) {
        VoucherType storage vType = voucherTypes[voucherId];
        return (vType.name, vType.price, vType.active, vType.totalMinted, vType.totalRedeemed);
    }

    /**
     * @notice Get user's voucher balance for a type
     * @param user User address
     * @param voucherId Voucher type ID
     */
    function getVoucherBalance(address user, uint256 voucherId) external view returns (uint256) {
        return balanceOf(user, voucherId);
    }

    /**
     * @notice Get user's total redemptions for a voucher type
     * @param user User address
     * @param voucherId Voucher type ID
     */
    function getUserRedemptions(address user, uint256 voucherId) external view returns (uint256) {
        return userRedemptions[user][voucherId];
    }

    /**
     * @notice Get total number of voucher types created
     */
    function totalVoucherTypes() external view returns (uint256) {
        return _nextVoucherId - 1;
    }
}
