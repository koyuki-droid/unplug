// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PermissionManager
 * @dev Manages time-limited permissions with signature-based authentication
 * Similar to MetaMask's permission system
 */
contract PermissionManager is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    struct Permission {
        address grantee;            // Who has permission
        uint256 recordId;           // Which record they can access
        uint256 expiryTime;         // When permission expires
        uint256 grantedTime;        // When permission was granted
        string permissionType;      // e.g., "read", "write", "ai_access"
        bool isActive;              // Whether permission is still active
        bytes signature;            // Signature from owner granting permission
    }

    // Mapping from permission ID to Permission
    mapping(bytes32 => Permission) public permissions;
    
    // Mapping from owner to array of permission IDs they've granted
    mapping(address => bytes32[]) public ownerPermissions;
    
    // Mapping from grantee to array of permission IDs they have
    mapping(address => bytes32[]) public granteePermissions;
    
    // Mapping from record ID to array of permission IDs
    mapping(uint256 => bytes32[]) public recordPermissions;
    
    // Nonce for signature replay protection
    mapping(address => uint256) public nonces;

    // Events
    event PermissionGranted(
        bytes32 indexed permissionId,
        address indexed owner,
        address indexed grantee,
        uint256 recordId,
        uint256 expiryTime,
        string permissionType
    );
    
    event PermissionRevoked(
        bytes32 indexed permissionId,
        address indexed owner
    );
    
    event PermissionExpired(
        bytes32 indexed permissionId,
        uint256 recordId
    );

    /**
     * @dev Grant permission with signature (MetaMask-style)
     * @param grantee Address to grant permission to
     * @param recordId ID of the record
     * @param expiryTime Unix timestamp when permission expires
     * @param permissionType Type of permission
     * @param signature Signature from owner
     */
    function grantPermission(
        address grantee,
        uint256 recordId,
        uint256 expiryTime,
        string memory permissionType,
        bytes memory signature
    ) external nonReentrant returns (bytes32) {
        require(expiryTime > block.timestamp, "Expiry must be in future");
        
        address owner = msg.sender;
        uint256 nonce = nonces[owner];
        nonces[owner]++;
        
        // Create permission message hash
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encodePacked(
                        owner,
                        grantee,
                        recordId,
                        expiryTime,
                        permissionType,
                        nonce,
                        address(this)
                    )
                )
            )
        );
        
        // Verify signature
        address signer = messageHash.recover(signature);
        require(signer == owner, "Invalid signature");
        
        bytes32 permissionId = keccak256(
            abi.encodePacked(owner, grantee, recordId, nonce, block.timestamp)
        );
        
        permissions[permissionId] = Permission({
            grantee: grantee,
            recordId: recordId,
            expiryTime: expiryTime,
            grantedTime: block.timestamp,
            permissionType: permissionType,
            isActive: true,
            signature: signature
        });
        
        ownerPermissions[owner].push(permissionId);
        granteePermissions[grantee].push(permissionId);
        recordPermissions[recordId].push(permissionId);
        
        emit PermissionGranted(
            permissionId,
            owner,
            grantee,
            recordId,
            expiryTime,
            permissionType
        );
        
        return permissionId;
    }

    /**
     * @dev Revoke a permission (owner can revoke before expiry)
     * @param permissionId ID of the permission to revoke
     */
    function revokePermission(bytes32 permissionId) external {
        Permission storage perm = permissions[permissionId];
        require(perm.isActive, "Permission not active");
        
        // Verify caller is owner or grantee
        address owner = msg.sender;
        require(
            perm.grantee == owner || owner == this.owner(),
            "Not authorized to revoke"
        );
        
        perm.isActive = false;
        
        emit PermissionRevoked(permissionId, owner);
    }

    /**
     * @dev Check if a permission is valid (not expired and active)
     * @param permissionId ID of the permission
     */
    function isValidPermission(bytes32 permissionId) external view returns (bool) {
        Permission memory perm = permissions[permissionId];
        
        if (!perm.isActive) {
            return false;
        }
        
        if (block.timestamp > perm.expiryTime) {
            return false;
        }
        
        return true;
    }

    /**
     * @dev Get permission details
     * @param permissionId ID of the permission
     */
    function getPermission(bytes32 permissionId) external view returns (Permission memory) {
        return permissions[permissionId];
    }

    /**
     * @dev Revoke expired permissions (anyone can call to clean up)
     * @param permissionIds Array of permission IDs to check and revoke
     */
    function revokeExpiredPermissions(bytes32[] memory permissionIds) external {
        for (uint256 i = 0; i < permissionIds.length; i++) {
            Permission storage perm = permissions[permissionIds[i]];
            if (perm.isActive && block.timestamp > perm.expiryTime) {
                perm.isActive = false;
                emit PermissionExpired(permissionIds[i], perm.recordId);
            }
        }
    }

    /**
     * @dev Get all permissions for a record
     * @param recordId ID of the record
     */
    function getRecordPermissions(uint256 recordId) external view returns (bytes32[] memory) {
        return recordPermissions[recordId];
    }
}

