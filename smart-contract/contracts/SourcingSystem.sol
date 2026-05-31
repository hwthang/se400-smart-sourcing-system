// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProcurementContract.sol";

/**
 * @title SourcingSystem
 * @notice Factory and registry for creating and managing ProcurementContract instances
 * @dev Domain service responsible for procurement contract lifecycle management
 *      Acts as the entry point for creating new procurement workflows
 */
contract SourcingSystem {
    // =========================================================
    // STATE VARIABLES (DOMAIN REGISTRY)
    // =========================================================

    /// @dev System owner with administrative privileges (contract factory authority)
    address public owner;

    /// @dev Registry mapping external business ID to deployed contract address
    /// @notice Business invariant: One external ID maps to exactly one contract
    mapping(bytes32 => address) public procurementContractsByExternalId;

    /// @dev Enumerable list of all created procurement contract addresses
    address[] private allContracts;

    // =========================================================
    // EVENTS (DOMAIN NOTIFICATIONS)
    // =========================================================

    /// @param externalId Unique business identifier for the procurement
    /// @param contractAddress Address of the newly created contract
    event ProcurementContractCreated(
        bytes32 indexed externalId,
        address indexed contractAddress
    );

    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    // =========================================================
    // ACCESS CONTROL MODIFIERS (AUTHORIZATION RULES)
    // =========================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    /// @dev Business rule: External IDs must be globally unique across all contracts
    modifier uniqueExternalId(bytes32 externalId) {
        require(
            procurementContractsByExternalId[externalId] == address(0),
            "External ID already exists"
        );
        _;
    }

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    /// @dev Initializes system with deployer as the initial owner
    constructor() {
        owner = msg.sender;
    }

    // =========================================================
    // ADMINISTRATIVE OPERATIONS
    // =========================================================

    /**
     * @notice Transfers system ownership to a new address
     * @dev Business rule: Zero address cannot be owner (prevents permanent lockout)
     * @param newOwner Address of the new owner
     */
    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnerChanged(oldOwner, newOwner);
    }

    // =========================================================
    // FACTORY OPERATIONS - CREATE PROCUREMENT CONTRACT
    // =========================================================

    /**
     * @notice Creates a new ProcurementContract instance with specified parameters
     * @dev =========================================================
     *      BUSINESS WORKFLOW:
     *      =========================================================
     *      1. VALIDATE: External ID uniqueness and buyer non-zero
     *      2. PROCESS: Deploy new ProcurementContract with given weights
     *      3. PERSIST: Store contract address in registry mapping and array
     *      4. RETURN: Emit creation event with contract details
     *      =========================================================
     * 
     * @param externalId Unique business identifier (prevents duplicate creation)
     * @param buyer Address of the buyer who will evaluate suppliers
     * @param priceWeight Weight for price evaluation (basis points)
     * @param defectWeight Weight for defect rate evaluation (basis points)
     * @param leadTimeWeight Weight for lead time evaluation (basis points)
     * @param delayPenaltyRate Penalty rate for delivery delays (basis points)
     * @param defectPenaltyRate Penalty rate for product defects (basis points)
     */
    function createProcurementContract(
        bytes32 externalId,
        address buyer,
        uint16 priceWeight,
        uint16 defectWeight,
        uint16 leadTimeWeight,
        uint256 delayPenaltyRate,
        uint16 defectPenaltyRate
    ) external onlyOwner uniqueExternalId(externalId) {
        // =========================================================
        // 1. VALIDATE INPUT
        // Prevent contract creation with invalid buyer address
        // =========================================================
        require(buyer != address(0), "Buyer cannot be zero address");

        // =========================================================
        // 2. PROCESS: Deploy new procurement contract instance
        // Owner becomes the SourcingSystem (factory as administrator)
        // =========================================================
        ProcurementContract newContract = new ProcurementContract(
            owner,
            buyer,
            priceWeight,
            defectWeight,
            leadTimeWeight,
            delayPenaltyRate,
            defectPenaltyRate
        );

        // =========================================================
        // 3. PERSIST: Register contract in system registry
        // Dual storage enables both lookup-by-ID and full enumeration
        // =========================================================
        procurementContractsByExternalId[externalId] = address(newContract);
        allContracts.push(address(newContract));

        // =========================================================
        // 4. RETURN: Emit event for off-chain tracking
        // =========================================================
        emit ProcurementContractCreated(externalId, address(newContract));
    }

    // =========================================================
    // QUERY OPERATIONS (READ-ONLY)
    // =========================================================

    /**
     * @notice Retrieves contract address associated with an external ID
     * @dev Returns zero address if external ID doesn't exist (valid business state)
     * @param externalId The external ID to look up
     * @return address The corresponding ProcurementContract address
     */
    function getProcurementContractByExternalId(
        bytes32 externalId
    ) external view returns (address) {
        return procurementContractsByExternalId[externalId];
    }

    /**
     * @notice Returns complete list of all procurement contract addresses ever created
     * @dev Useful for off-chain enumeration and monitoring
     * @return address[] Array of all contract addresses
     */
    function getAllProcurementContracts()
        external
        view
        returns (address[] memory)
    {
        return allContracts;
    }

    /**
     * @notice Returns total number of procurement contracts created
     * @dev Useful for pagination or statistics
     * @return uint256 Total contract count
     */
    function getTotalContractsCount() external view returns (uint256) {
        return allContracts.length;
    }
}