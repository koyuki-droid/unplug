// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PermissionManager.sol";
import "./DataVault.sol";

/**
 * @title AccessControl
 * @dev Central contract that coordinates access between DataVault and PermissionManager
 * Validates permissions before allowing data operations
 */
contract AccessControl is Ownable {
    DataVault public dataVault;
    PermissionManager public permissionManager;

    constructor(address _dataVault, address _permissionManager) {
        dataVault = DataVault(_dataVault);
        permissionManager = PermissionManager(_permissionManager);
    }

    /**
     * @dev Check if an address has valid permission to access a record
     * @param recordId ID of the record
     * @param requester Address requesting access
     * @param permissionType Type of permission required
     */
    function hasAccess(
        uint256 recordId,
        address requester,
        string memory permissionType
    ) external view returns (bool, bytes32) {
        // Owner always has access
        DataVault.DataRecord memory record = dataVault.getRecord(recordId);
        if (record.owner == requester) {
            return (true, bytes32(0));
        }

        // Check permissions
        bytes32[] memory perms = permissionManager.getRecordPermissions(recordId);
        
        for (uint256 i = 0; i < perms.length; i++) {
            PermissionManager.Permission memory perm = permissionManager.getPermission(perms[i]);
            
            if (
                perm.grantee == requester &&
                keccak256(bytes(perm.permissionType)) == keccak256(bytes(permissionType)) &&
                perm.isActive &&
                block.timestamp <= perm.expiryTime
            ) {
                return (true, perms[i]);
            }
        }
        
        return (false, bytes32(0));
    }

    /**
     * @dev Upload data on behalf of owner with permission check
     * @param owner Address of the data owner
     * @param ipfsHash IPFS CID
     * @param dataType Type of data
     */
    function uploadDataWithPermission(
        address owner,
        string memory ipfsHash,
        string memory dataType
    ) external returns (uint256) {
        // Check if uploader is owner
        if (msg.sender == owner) {
            return dataVault.uploadData(ipfsHash, dataType);
        }
        
        // Check for write permission
        // Note: This is simplified - in production, you'd check specific permissions
        // For now, allow if they have any active permission
        bytes32[] memory ownerPerms = permissionManager.ownerPermissions(owner);
        bool hasPermission = false;
        
        for (uint256 i = 0; i < ownerPerms.length; i++) {
            if (permissionManager.isValidPermission(ownerPerms[i])) {
                PermissionManager.Permission memory perm = permissionManager.getPermission(ownerPerms[i]);
                if (perm.grantee == msg.sender && keccak256(bytes(perm.permissionType)) == keccak256("write")) {
                    hasPermission = true;
                    break;
                }
            }
        }
        
        require(hasPermission || msg.sender == owner, "No write permission");
        
        return dataVault.uploadDataForOwner(owner, ipfsHash, dataType);
    }
}

