// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DataVault
 * @dev Main contract for storing data metadata and managing data ownership
 * Actual data is stored on IPFS, this contract stores the IPFS hashes and metadata
 */
contract DataVault is Ownable, ReentrancyGuard {
    struct DataRecord {
        string ipfsHash;           // IPFS CID for the encrypted data
        address owner;              // Owner of the data
        string dataType;            // e.g., "medical_record", "personal_file"
        uint256 uploadTime;         // Timestamp when uploaded
        address uploader;           // Who uploaded it (could be owner or authorized party)
        bool isActive;              // Whether record is active
    }

    // Mapping from record ID to DataRecord
    mapping(uint256 => DataRecord) public records;
    
    // Mapping from owner address to array of record IDs they own
    mapping(address => uint256[]) public ownerRecords;
    
    // Total number of records
    uint256 public recordCount;
    
    // Events
    event DataUploaded(
        uint256 indexed recordId,
        address indexed owner,
        address indexed uploader,
        string ipfsHash,
        string dataType,
        uint256 timestamp
    );
    
    event DataDeleted(uint256 indexed recordId, address indexed owner);
    
    event AccessGranted(
        uint256 indexed recordId,
        address indexed granter,
        address indexed grantee,
        uint256 expiryTime
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Upload a new data record
     * @param ipfsHash IPFS CID of the encrypted data
     * @param dataType Type of data (e.g., "medical_record")
     */
    function uploadData(
        string memory ipfsHash,
        string memory dataType
    ) external nonReentrant returns (uint256) {
        recordCount++;
        uint256 recordId = recordCount;
        
        records[recordId] = DataRecord({
            ipfsHash: ipfsHash,
            owner: msg.sender,
            dataType: dataType,
            uploadTime: block.timestamp,
            uploader: msg.sender,
            isActive: true
        });
        
        ownerRecords[msg.sender].push(recordId);
        
        emit DataUploaded(
            recordId,
            msg.sender,
            msg.sender,
            ipfsHash,
            dataType,
            block.timestamp
        );
        
        return recordId;
    }

    /**
     * @dev Allow authorized party (like hospital) to upload data on behalf of owner
     * @param owner Address of the data owner
     * @param ipfsHash IPFS CID of the encrypted data
     * @param dataType Type of data
     */
    function uploadDataForOwner(
        address owner,
        string memory ipfsHash,
        string memory dataType
    ) external nonReentrant returns (uint256) {
        // Note: Permission checking should be done via PermissionManager contract
        // This is simplified - in production, verify permission first
        
        recordCount++;
        uint256 recordId = recordCount;
        
        records[recordId] = DataRecord({
            ipfsHash: ipfsHash,
            owner: owner,
            dataType: dataType,
            uploadTime: block.timestamp,
            uploader: msg.sender,
            isActive: true
        });
        
        ownerRecords[owner].push(recordId);
        
        emit DataUploaded(
            recordId,
            owner,
            msg.sender,
            ipfsHash,
            dataType,
            block.timestamp
        );
        
        return recordId;
    }

    /**
     * @dev Delete/deactivate a data record (soft delete)
     * @param recordId ID of the record to delete
     */
    function deleteData(uint256 recordId) external {
        require(records[recordId].owner == msg.sender, "Not owner");
        require(records[recordId].isActive, "Already deleted");
        
        records[recordId].isActive = false;
        
        emit DataDeleted(recordId, msg.sender);
    }

    /**
     * @dev Get data record by ID
     * @param recordId ID of the record
     */
    function getRecord(uint256 recordId) external view returns (DataRecord memory) {
        return records[recordId];
    }

    /**
     * @dev Get all record IDs owned by an address
     * @param owner Address of the owner
     */
    function getOwnerRecords(address owner) external view returns (uint256[] memory) {
        return ownerRecords[owner];
    }
}

