// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MicroEconomy
 * @dev Payment system for data access permissions
 * Enables micro-payments for AI companies to access user data
 */
contract MicroEconomy is Ownable, ReentrancyGuard {
    struct PaymentAgreement {
        address dataOwner;          // Owner of the data
        address payer;              // AI company paying for access
        uint256 recordId;           // ID of the record being accessed
        uint256 totalAmount;        // Total payment amount
        uint256 paidAmount;         // Amount already paid
        uint256 startTime;          // When access starts
        uint256 endTime;            // When access ends
        uint256 paymentInterval;    // Payment interval in seconds (e.g., 3600 = hourly)
        uint256 paymentPerInterval; // Payment per interval
        bool isActive;              // Whether agreement is active
    }

    // Mapping from agreement ID to PaymentAgreement
    mapping(bytes32 => PaymentAgreement) public agreements;
    
    // Mapping from owner to array of agreement IDs
    mapping(address => bytes32[]) public ownerAgreements;
    
    // Mapping from payer to array of agreement IDs
    mapping(address => bytes32[]) public payerAgreements;
    
    // Native token (ETH) payments
    mapping(address => uint256) public ownerBalances;

    // Events
    event AgreementCreated(
        bytes32 indexed agreementId,
        address indexed owner,
        address indexed payer,
        uint256 recordId,
        uint256 totalAmount,
        uint256 endTime
    );
    
    event PaymentMade(
        bytes32 indexed agreementId,
        address indexed payer,
        address indexed owner,
        uint256 amount
    );
    
    event AgreementCompleted(
        bytes32 indexed agreementId,
        uint256 totalPaid
    );
    
    event Withdrawal(
        address indexed owner,
        uint256 amount
    );

    /**
     * @dev Create a payment agreement for data access
     * @param owner Address of data owner
     * @param recordId ID of the record
     * @param endTime When access ends
     * @param paymentPerInterval Payment per time interval
     * @param paymentInterval Length of payment interval in seconds
     */
    function createAgreement(
        address owner,
        uint256 recordId,
        uint256 endTime,
        uint256 paymentPerInterval,
        uint256 paymentInterval
    ) external payable nonReentrant returns (bytes32) {
        require(endTime > block.timestamp, "End time must be in future");
        require(paymentPerInterval > 0, "Payment must be > 0");
        
        address payer = msg.sender;
        
        // Calculate total amount based on duration
        uint256 duration = endTime - block.timestamp;
        uint256 intervals = duration / paymentInterval;
        uint256 totalAmount = intervals * paymentPerInterval;
        
        bytes32 agreementId = keccak256(
            abi.encodePacked(owner, payer, recordId, block.timestamp, block.number)
        );
        
        agreements[agreementId] = PaymentAgreement({
            dataOwner: owner,
            payer: payer,
            recordId: recordId,
            totalAmount: totalAmount,
            paidAmount: msg.value,
            startTime: block.timestamp,
            endTime: endTime,
            paymentInterval: paymentInterval,
            paymentPerInterval: paymentPerInterval,
            isActive: true
        });
        
        ownerAgreements[owner].push(agreementId);
        payerAgreements[payer].push(agreementId);
        
        // Store initial payment
        ownerBalances[owner] += msg.value;
        
        emit AgreementCreated(
            agreementId,
            owner,
            payer,
            recordId,
            totalAmount,
            endTime
        );
        
        return agreementId;
    }

    /**
     * @dev Make a payment for ongoing agreement
     * @param agreementId ID of the agreement
     */
    function makePayment(bytes32 agreementId) external payable nonReentrant {
        PaymentAgreement storage agreement = agreements[agreementId];
        require(agreement.isActive, "Agreement not active");
        require(msg.sender == agreement.payer, "Not the payer");
        require(block.timestamp <= agreement.endTime, "Agreement expired");
        
        uint256 amount = msg.value;
        agreement.paidAmount += amount;
        ownerBalances[agreement.dataOwner] += amount;
        
        emit PaymentMade(
            agreementId,
            agreement.payer,
            agreement.dataOwner,
            amount
        );
        
        // Auto-complete if fully paid or expired
        if (agreement.paidAmount >= agreement.totalAmount || block.timestamp >= agreement.endTime) {
            if (block.timestamp >= agreement.endTime) {
                agreement.isActive = false;
                emit AgreementCompleted(agreementId, agreement.paidAmount);
            }
        }
    }

    /**
     * @dev Withdraw accumulated balance (data owner)
     */
    function withdraw() external nonReentrant {
        uint256 balance = ownerBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        ownerBalances[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, balance);
    }

    /**
     * @dev Get agreement details
     * @param agreementId ID of the agreement
     */
    function getAgreement(bytes32 agreementId) external view returns (PaymentAgreement memory) {
        return agreements[agreementId];
    }

    /**
     * @dev Complete/expire an agreement when time is up
     * @param agreementId ID of the agreement
     */
    function completeAgreement(bytes32 agreementId) external {
        PaymentAgreement storage agreement = agreements[agreementId];
        require(agreement.isActive, "Agreement not active");
        require(block.timestamp >= agreement.endTime, "Agreement not expired");
        
        agreement.isActive = false;
        
        emit AgreementCompleted(agreementId, agreement.paidAmount);
    }

    /**
     * @dev Get balance for an owner
     * @param owner Address of the owner
     */
    function getBalance(address owner) external view returns (uint256) {
        return ownerBalances[owner];
    }
}

