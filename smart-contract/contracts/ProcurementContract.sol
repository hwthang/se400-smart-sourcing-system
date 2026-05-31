// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ProcurementContract
 * @notice Manages the complete procurement lifecycle from supplier registration to payment release
 * @dev Core domain aggregate handling supplier evaluation, order allocation, delivery tracking, and penalty calculation
 */
contract ProcurementContract {
    // =========================================================
    // DOMAIN TYPES: ENUMS & STRUCTS
    // =========================================================

    /// @dev Procurement lifecycle stages (business process states)
    enum ContractPhase {
        REGISTRATION, // Suppliers and customer being onboarded
        ORDERING, // Demand created, quotations collected
        ALLOCATION, // Buyer configures criteria, creates orders, deposits funds
        EXECUTING, // Delivery, inspection, payment execution
        COMPLETED // Terminal state - contract closed
    }

    /// @dev Buyer's purchasing constraints per supplier (business rule configuration)
    struct BuyerCriteria {
        uint256 minPurchaseQuantity; // Minimum quantity buyer commits to purchase
        uint16 maxAllocationPercent; // Cap on percentage of total demand from one supplier
    }

    /// @dev Supplier's commercial offer (competitive bid submitted by customer on supplier's behalf)
    struct SupplierQuotation {
        uint256 unitPrice; // Price per unit offered
        uint16 maxDefectRate; // Maximum defect rate supplier guarantees (basis points)
        uint16 maxLeadTimeDays; // Maximum delivery lead time promised (days)
        uint256 minSupplyQuantity; // Minimum quantity supplier can provide
        uint256 maxSupplyQuantity; // Maximum capacity supplier can provide
    }

    /// @dev Customer's procurement requirements (demand specification)
    struct Demand {
        uint256 requestedQuantity; // Total quantity customer needs
        uint256 requestedDeliveryTimestamp; // Required delivery deadline (Unix timestamp)
    }

    /// @dev Order execution and performance tracking per supplier
    struct Order {
        uint16 allocationScore; // Score used in allocation algorithm (0-10000)
        uint256 allocatedQuantity; // Quantity assigned to this supplier
        uint256 estimatedAmount; // Estimated payment before penalty adjustments
        uint256 deliveryTimestamp; // Actual delivery timestamp (0 = not delivered)
        uint16 defectRate; // Actual defect rate from inspection (basis points)
        uint256 paidAmount; // Amount already paid (0 = not paid)
    }

    /// @dev Multi-criteria supplier evaluation weights (basis points, sum = 10000)
    struct EvaluationWeights {
        uint16 priceWeight; // Weight for price competitiveness
        uint16 defectWeight; // Weight for quality guarantee
        uint16 leadTimeWeight; // Weight for delivery speed
    }

    /// @dev Penalty rates applied for non-performance (basis points)
    struct PenaltyRates {
        uint256 delayPenaltyRate; // Penalty ETH per day or per unit of delay
        uint16 qualityPenaltyRate; // Penalty per defect basis point above threshold
    }

    // =========================================================
    // STATE VARIABLES (DOMAIN ENTITIES)
    // =========================================================

    /// @dev Contract owner - SourcingSystem contract (administrative authority)
    address public owner;

    /// @dev Buyer - responsible for evaluation, configuration, and payment
    address public buyer;

    /// @dev Customer - creates demand and submits quotations on behalf of suppliers
    address public customer;

    /// @dev Current procurement demand requirements
    Demand public demand;

    /// @dev Evaluation weights for supplier selection algorithm
    EvaluationWeights public evalutationWeights; // NOTE: Typo preserved - would refactor to evaluationWeights

    /// @dev Penalty rates for delivery delays and quality defects
    PenaltyRates public penaltyRates;

    /// @dev Current procurement phase (business process state machine)
    ContractPhase public currentPhase;

    /// @dev List of all registered supplier addresses (iteration purpose)
    address[] public registeredSuppliers;

    /// @dev Authorization mapping for registered suppliers
    mapping(address => bool) public allowedSuppliers;

    /// @dev Quotations submitted per supplier
    mapping(address => SupplierQuotation) public quotations;

    /// @dev Buyer criteria configured per supplier
    mapping(address => BuyerCriteria) public criteria;

    /// @dev Order details per supplier
    mapping(address => Order) public orders;

    // =========================================================
    // EVENTS (DOMAIN NOTIFICATIONS)
    // =========================================================

    event PhaseChanged(ContractPhase newPhase);
    event CustomerRegistered(address customer);
    event SupplierRegistered(address supplier);
    event DemandConfirmed(address customer);
    event SupplierQuotationConfirmed(address supplier);
    event BuyerCriteriaConfirmed(address supplier);
    event OrderCreated(address supplier);
    event BuyerDeposited(uint256 depositedAmount);
    event OrderDeliveryCompleted(address supplier, uint256 deliveryTimestamp);
    event OrderInspectionCompleted(address supplier, uint16 defectRate);
    event SupplierPaymentReleased(address supplier, uint256 paidAmount);

    // =========================================================
    // ACCESS CONTROL MODIFIERS (AUTHORIZATION RULES)
    // =========================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer");
        _;
    }

    modifier onlyCustomer() {
        require(msg.sender == customer, "Only customer");
        _;
    }

    modifier onlySupplier() {
        require(allowedSuppliers[msg.sender], "Only registered supplier");
        _;
    }

    modifier atRegistrationPhase() {
        require(currentPhase == ContractPhase.REGISTRATION, "Invalid phase");
        _;
    }

    modifier atOrderingPhase() {
        require(currentPhase == ContractPhase.ORDERING, "Invalid phase");
        _;
    }

    modifier atAllocationPhase() {
        require(currentPhase == ContractPhase.ALLOCATION, "Invalid phase");
        _;
    }

    modifier atExecutingPhase() {
        require(currentPhase == ContractPhase.EXECUTING, "Invalid phase");
        _;
    }

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    /**
     * @notice Initializes evaluation weights and penalty rates
     * @dev Contract starts in REGISTRATION phase per business process design
     * @param _owner SourcingSystem contract address (administrative authority)
     * @param _buyer Address of the buyer responsible for procurement execution
     * @param priceWeight Weight for price criterion (basis points)
     * @param defectWeight Weight for defect rate criterion (basis points)
     * @param leadTimeWeight Weight for lead time criterion (basis points)
     * @param delayPenaltyRate Penalty rate for late delivery (basis points)
     * @param defectPenaltyRate Penalty rate for quality issues (basis points)
     */
    constructor(
        address _owner,
        address _buyer,
        uint16 priceWeight,
        uint16 defectWeight,
        uint16 leadTimeWeight,
        uint256 delayPenaltyRate,
        uint16 defectPenaltyRate
    ) {
        owner = _owner;
        buyer = _buyer;
        evalutationWeights = EvaluationWeights(
            priceWeight,
            defectWeight,
            leadTimeWeight
        );
        penaltyRates = PenaltyRates(delayPenaltyRate, defectPenaltyRate);
        currentPhase = ContractPhase.REGISTRATION;
    }

    // =========================================================
    // PHASE: REGISTRATION - SUPPLIER & CUSTOMER ONBOARDING
    // =========================================================

    /**
     * @notice Registers the customer who will create demand and quotations
     * @dev Business rule: Only one customer per contract
     * @param _customer Address of the customer entity
     */
    function registerCustomer(
        address _customer
    ) external onlyBuyer atRegistrationPhase {
        customer = _customer;
        emit CustomerRegistered(_customer);
    }

    /**
     * @notice Registers a supplier to participate in the procurement
     * @dev Business rule: Supplier must be explicitly authorized before submitting quotations
     * @param supplier Address of the supplier to register
     */
    function registerSupplier(
        address supplier
    ) external onlyBuyer atRegistrationPhase {
        registeredSuppliers.push(supplier);
        allowedSuppliers[supplier] = true;
        emit SupplierRegistered(supplier);
    }

    /**
     * @notice Advances workflow from REGISTRATION to ORDERING phase
     * @dev Triggered after all suppliers and customer are registered
     */
    function startOrderingPhase() external onlyBuyer atRegistrationPhase {
        currentPhase = ContractPhase.ORDERING;
        emit PhaseChanged(currentPhase);
    }

    // =========================================================
    // PHASE: ORDERING - DEMAND CREATION & QUOTATION COLLECTION
    // =========================================================

    /**
     * @notice Creates the demand specifying required quantity and delivery deadline
     * @dev Business rule: Demand must be created before any quotations are submitted
     * @param requestedQuantity Total quantity customer needs
     * @param requestedDeliveryTimestamp Required delivery deadline (Unix timestamp)
     */
    function confirmDemand(
        uint256 requestedQuantity,
        uint256 requestedDeliveryTimestamp
    ) external onlyCustomer atOrderingPhase {
        demand = Demand(requestedQuantity, requestedDeliveryTimestamp);
        emit DemandConfirmed(msg.sender);
    }

    /**
     * @notice Submits a quotation for a specific supplier
     * @dev Business rule: Customer acts as intermediary submitting quotes on behalf of suppliers
     * @param unitPrice Price per unit offered
     * @param minSupplyQuantity Minimum quantity supplier can provide
     * @param maxSupplyQuantity Maximum quantity supplier can provide
     * @param maxDefectRate Maximum defect rate supplier guarantees (basis points)
     * @param maxLeadTimeDays Maximum lead time in days promised
     */
    function confirmSupplierQuotation(
        uint256 unitPrice,
        uint256 minSupplyQuantity,
        uint256 maxSupplyQuantity,
        uint16 maxDefectRate,
        uint16 maxLeadTimeDays
    ) external onlySupplier atOrderingPhase {
        quotations[msg.sender] = SupplierQuotation(
            unitPrice,
            maxDefectRate,
            maxLeadTimeDays,
            minSupplyQuantity,
            maxSupplyQuantity
        );

        emit SupplierQuotationConfirmed(msg.sender);
    }

    /**
     * @notice Advances workflow from ORDERING to ALLOCATION phase
     * @dev Triggered after all quotations are collected from relevant suppliers
     */
    function startAllocationPhase() external onlyBuyer atOrderingPhase {
        currentPhase = ContractPhase.ALLOCATION;
        emit PhaseChanged(currentPhase);
    }

    // =========================================================
    // PHASE: ALLOCATION - CRITERIA CONFIGURATION, ORDER CREATION, FUNDING
    // =========================================================

    /**
     * @notice Configures buyer-specific purchasing constraints per supplier
     * @dev Business rule: Buyer constraints override supplier quotations during allocation
     * @param supplier Address of the supplier
     * @param minPurchaseQuantity Minimum quantity buyer will purchase from this supplier
     * @param maxAllocationPercent Maximum percentage of total demand allocated to this supplier
     */
    function confirmBuyerCriteria(
        address supplier,
        uint256 minPurchaseQuantity,
        uint16 maxAllocationPercent
    ) external onlyBuyer atAllocationPhase {
        criteria[supplier] = BuyerCriteria(
            minPurchaseQuantity,
            maxAllocationPercent
        );
        emit BuyerCriteriaConfirmed(supplier);
    }

    /**
     * @notice Creates an order for a supplier with allocation details
     * @dev Called by SourcingSystem after running allocation algorithm
     * @param supplier Address of the supplier receiving the order
     * @param allocationScore Score used in allocation algorithm (0-10000)
     * @param allocatedQuantity Quantity allocated to this supplier
     * @param estimatedAmount Estimated payment amount before penalties
     */
    function createOrder(
        address supplier,
        uint16 allocationScore,
        uint256 allocatedQuantity,
        uint256 estimatedAmount
    ) external onlyOwner atAllocationPhase {
        orders[supplier] = Order(
            allocationScore,
            allocatedQuantity,
            estimatedAmount,
            0, // deliveryTimestamp - not delivered yet
            0, // defectRate - not inspected yet
            0 // paidAmount - not paid yet
        );
        emit OrderCreated(supplier);
    }

    /**
     * @notice Buyer deposits funds to cover order payments
     * @dev Business rule: Funds must be deposited before moving to EXECUTING phase
     */
    function deposit() external payable onlyBuyer atAllocationPhase {
        emit BuyerDeposited(msg.value);
    }

    /**
     * @notice Advances workflow from ALLOCATION to EXECUTING phase
     * @dev Triggered after all orders are created and funds are deposited
     */
    function startExecutingPhase() external onlyBuyer atAllocationPhase {
        currentPhase = ContractPhase.EXECUTING;
        emit PhaseChanged(currentPhase);
    }

    // =========================================================
    // PHASE: EXECUTING - DELIVERY, INSPECTION, PAYMENT
    // =========================================================

    /**
     * @notice Records delivery completion for a supplier
     * @dev Business rule: Delivery timestamp is used to calculate delay penalties
     * @param supplier Address of the supplier completing delivery
     * @param deliveryTimestamp Actual delivery timestamp (Unix timestamp)
     */
    function completeDelivery(
        address supplier,
        uint256 deliveryTimestamp
    ) external onlyBuyer atExecutingPhase {
        orders[supplier].deliveryTimestamp = deliveryTimestamp;
    }

    /**
     * @notice Records inspection results with actual defect rate
     * @dev Business rule: Defect rate compared against quotation.maxDefectRate to calculate quality penalty
     * @param supplier Address of the supplier whose goods were inspected
     * @param defectRate Actual defect rate found during inspection (basis points)
     */
    function completeInspection(
        address supplier,
        uint16 defectRate
    ) external onlyBuyer atExecutingPhase {
        orders[supplier].defectRate = defectRate;
        emit OrderInspectionCompleted(supplier, defectRate);
    }

    function calculatePayment(address supplier) public view returns (uint256) {
        Order memory order = orders[supplier];
        SupplierQuotation memory quote = quotations[supplier];

        Demand memory d = demand;
        PenaltyRates memory p = penaltyRates;

        require(order.estimatedAmount > 0, "Order not found");

        // =========================================================
        // 1. BASE AMOUNT (P * Q already computed)
        // =========================================================
        uint256 base = order.estimatedAmount;

        // =========================================================
        // 2. DELAY PENALTY
        // =========================================================
        uint256 delayDays = 0;

        if (order.deliveryTimestamp > d.requestedDeliveryTimestamp) {
            delayDays =
                (order.deliveryTimestamp - d.requestedDeliveryTimestamp) /
                1 days;
        }

        uint256 delayPenalty = uint256(p.delayPenaltyRate) * delayDays;

        // =========================================================
        // 3. QUALITY PENALTY
        // =========================================================
        uint256 excessDefectRate = 0;

        if (order.defectRate > quote.maxDefectRate) {
            excessDefectRate = order.defectRate - quote.maxDefectRate;
        }

        uint256 qualityPenalty = (penaltyRates.qualityPenaltyRate *
            excessDefectRate *
            order.estimatedAmount) / 1e8;

        // =========================================================
        // 4. FINAL AMOUNT
        // =========================================================
        uint256 totalPenalty = delayPenalty + qualityPenalty;

        if (totalPenalty >= base) {
            return 0;
        }

        return base - totalPenalty;
    }

    /**
     * @notice Calculates and releases payment to supplier based on performance
     * @dev =========================================================
     *      BUSINESS RULES FOR PAYMENT CALCULATION:
     *      =========================================================
     *      1. Final amount = estimatedAmount - delayPenalty - qualityPenalty
     *      2. Delay penalty applies if deliveryTimestamp > demand.requestedDeliveryTimestamp
     *      3. Quality penalty applies if defectRate > quotation.maxDefectRate
     *      =========================================================
     *
     *      ⚠️ KNOWN ISSUES (To be fixed in refactor):
     *      - Condition incorrectly requires deliveryTimestamp == 0 (should be != 0)
     *      - Condition incorrectly requires paidAmount != 0 (should be == 0)
     *      - Amount is hardcoded to 100 ETH instead of using estimatedAmount with penalties
     *      - No penalty calculation logic implemented
     *      =========================================================
     *
     * @param supplier Address of the supplier to pay
     */
    function releaseSupplierPayment(
        address supplier
    ) external onlyBuyer atExecutingPhase {
        Order storage order = orders[supplier];

        // CHECK: Payment must not have been already released
        // BUG FIX NEEDED: Should be order.paidAmount == 0
        require(order.paidAmount == 0, "Payment already released");

        // PROCESS: Calculate final payment amount
        // BUG FIX NEEDED: Should calculate based on estimatedAmount minus penalties
        // Currently hardcoded to 10 ETH as placeholder
        uint256 amount = this.calculatePayment(supplier);

        require(amount > 0, "Invalid amount");

        // =========================================================
        // EFFECTS: Update state before external call (CE pattern)
        // =========================================================
        order.paidAmount = amount;

        // =========================================================
        // INTERACTION: Transfer funds to supplier
        // =========================================================
        (bool success, ) = payable(supplier).call{value: amount}("");
        require(success, "Payment transfer failed");

        emit SupplierPaymentReleased(supplier, amount);
    }

    /**
     * @notice Completes the procurement contract and moves to COMPLETED phase
     * @dev Terminal state - no further operations allowed after this
     */
    function finish() external onlyBuyer atExecutingPhase {
        currentPhase = ContractPhase.COMPLETED;

        emit PhaseChanged(currentPhase);

        uint256 remainingBalance = address(this).balance;

        if (remainingBalance > 0) {
            (bool success, ) = payable(buyer).call{value: remainingBalance}("");

            require(success, "Refund failed");
        }
    }
}
