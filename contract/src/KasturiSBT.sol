// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title KasturiSBT
 * @notice Soulbound Token for learning credentials
 * @dev Non-transferable ERC721 representing proof of learning completion
 */
contract KasturiSBT is ERC721, Ownable {
    // Token ID counter
    uint256 private _tokenIdCounter;
    
    // Mapping of authorized operators
    mapping(address => bool) private _operators;
    
    // Mapping of user + programId to tokenId (0 means no credential)
    mapping(address => mapping(bytes32 => uint256)) private _userCredentials;
    
    // Mapping of tokenId to programId
    mapping(uint256 => bytes32) private _tokenPrograms;
    
    // Mapping of tokenId to issue timestamp
    mapping(uint256 => uint256) private _issueTimestamps;
    
    // Base URI for metadata
    string private _baseTokenURI;

    // Mapping of tokenId to full tokenURI (ipfs://...)
    mapping(uint256 => string) private _tokenURIs;

    // Events
    event CredentialIssued(address indexed user, bytes32 indexed programId, uint256 tokenId);
    event OperatorUpdated(address indexed operator, bool status);
    event BaseURIUpdated(string newBaseURI);
    event TokenURIUpdated(uint256 indexed tokenId, string tokenURI);

    // Errors
    error UnauthorizedAction();
    error AlreadyCompleted();
    error InvalidProgram();
    error InvalidAddress();
    error NonTransferableToken();

    constructor() ERC721("Kasturi Learning Credential", "KASTURI-SBT") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from 1, 0 is reserved for "no credential"
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
     * @param operator Address to check
     * @return bool True if operator
     */
    function isOperator(address operator) external view returns (bool) {
        return _operators[operator];
    }

    /**
     * @notice Set base URI for token metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /**
     * @notice Set tokenURI for a specific tokenId (full URI)
     * @dev This enables wallets/explorers to fetch metadata directly from on-chain URI
     */
    function setTokenURI(uint256 tokenId, string calldata newTokenURI) external onlyAuthorized {
        if (_ownerOf(tokenId) == address(0)) revert InvalidProgram();
        _tokenURIs[tokenId] = newTokenURI;
        emit TokenURIUpdated(tokenId, newTokenURI);
    }

    /**
     * @notice Issue a credential to a user
     * @param user Address of the user
     * @param programId Identifier of the learning program
     * @return tokenId The issued token ID
     */
    function issueCredential(address user, bytes32 programId) external onlyAuthorized returns (uint256) {
        if (user == address(0)) revert InvalidAddress();
        if (programId == bytes32(0)) revert InvalidProgram();
        if (_userCredentials[user][programId] != 0) revert AlreadyCompleted();
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _mint(user, tokenId);
        _userCredentials[user][programId] = tokenId;
        _tokenPrograms[tokenId] = programId;
        _issueTimestamps[tokenId] = block.timestamp;
        
        emit CredentialIssued(user, programId, tokenId);
        
        return tokenId;
    }

    /**
     * @notice Check if user has a credential for a program
     * @param user Address of the user
     * @param programId Identifier of the learning program
     * @return bool True if user has the credential
     */
    function hasCredential(address user, bytes32 programId) external view returns (bool) {
        return _userCredentials[user][programId] != 0;
    }

    /**
     * @notice Get the token ID for a user's credential
     * @param user Address of the user
     * @param programId Identifier of the learning program
     * @return uint256 Token ID (0 if no credential)
     */
    function getCredentialToken(address user, bytes32 programId) external view returns (uint256) {
        return _userCredentials[user][programId];
    }

    /**
     * @notice Verify completion status for external verification
     * @param user Address of the user
     * @param programId Identifier of the learning program
     * @return completed Whether the user has completed the program
     */
    function verifyCompletion(address user, bytes32 programId) external view returns (bool completed) {
        return _userCredentials[user][programId] != 0;
    }

    /**
     * @notice Get user status for a program
     * @param user Address of the user
     * @param programId Identifier of the learning program
     * @return completed Whether completed
     * @return tokenId Token ID (0 if not completed)
     * @return issuedAt Timestamp when issued (0 if not completed)
     */
    function getUserStatus(address user, bytes32 programId) external view returns (
        bool completed,
        uint256 tokenId,
        uint256 issuedAt
    ) {
        tokenId = _userCredentials[user][programId];
        completed = tokenId != 0;
        issuedAt = completed ? _issueTimestamps[tokenId] : 0;
    }

    /**
     * @notice Get program ID for a token
     * @param tokenId Token ID
     * @return bytes32 Program ID
     */
    function getProgramId(uint256 tokenId) external view returns (bytes32) {
        return _tokenPrograms[tokenId];
    }

    /**
     * @notice Get total credentials issued
     * @return uint256 Total count
     */
    function totalCredentials() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    /**
     * @notice Return token URI (prefers per-token URI when set)
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert InvalidProgram();

        string memory uri = _tokenURIs[tokenId];
        if (bytes(uri).length > 0) {
            return uri;
        }

        string memory baseURI = _baseURI();
        if (bytes(baseURI).length == 0) {
            return "";
        }

        return string.concat(baseURI, Strings.toString(tokenId));
    }

    /**
     * @notice Override to return base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice Override to prevent transfers (Soulbound)
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // Block all other transfers
        if (from != address(0) && to != address(0)) {
            revert NonTransferableToken();
        }
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Override approve to prevent approvals (Soulbound)
     */
    function approve(address, uint256) public pure override {
        revert NonTransferableToken();
    }

    /**
     * @notice Override setApprovalForAll to prevent approvals (Soulbound)
     */
    function setApprovalForAll(address, bool) public pure override {
        revert NonTransferableToken();
    }
}
