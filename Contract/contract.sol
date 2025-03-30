// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PharmaSupplyChain {
    enum Role {
        Manufacturer,
        Distributor,
        Vendor,
        Pharmacy
    }
    enum OrderStatus {
        Pending,
        Approved,
        Shipped,
        Delivered,
        Cancelled
    }

    struct Entity {
        string name;
        string gstin;
        string addressInfo;
        string zipcode;
        Role role;
        bool isRegistered;
    }

    struct Medicine {
        uint256 id;
        string name;
        uint256 price;
        uint256 stock;
        address manufacturer;
    }

    struct Order {
        uint256 id;
        address buyer;
        address seller;
        uint256 medicineId;
        uint256 quantity;
        uint256 totalPrice;
        OrderStatus status;
    }

    mapping(address => Entity) public entities;
    mapping(uint256 => Medicine) public medicines;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256) public balances;

    uint256 public medicineCounter = 0;
    uint256 public orderCounter = 0;

    event EntityRegistered(
        address indexed entity,
        string name,
        string gstin,
        Role role
    );
    
    event MedicineAdded(
        uint256 indexed medicineId,
        string name,
        uint256 price,
        uint256 stock
    );
    event OrderPlaced(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 totalPrice
    );
    event OrderUpdated(uint256 indexed orderId, OrderStatus status);
    event PaymentReleased(
        uint256 indexed orderId,
        address seller,
        uint256 amount
    );
    event PaymentRefunded(
        uint256 indexed orderId,
        address buyer,
        uint256 amount
    );

    modifier onlyRegistered() {
        require(entities[msg.sender].isRegistered, "Not a registered entity.");
        _;
    }

    modifier onlyManufacturer() {
        require(
            entities[msg.sender].role == Role.Manufacturer,
            "Only manufacturers can add medicines."
        );
        _;
    }

    /// @notice Register an entity with a role
    function registerEntity(
        string memory _name,
        string memory _gstin,
        string memory _address,
        string memory _zipcode,
        Role _role
    ) public {
        require(
            !entities[msg.sender].isRegistered,
            "Entity already registered."
        );

        entities[msg.sender] = Entity({
            name: _name,
            gstin: _gstin,
            addressInfo: _address,
            zipcode: _zipcode,
            role: _role,
            isRegistered: true
        });

        emit EntityRegistered(msg.sender, _name, _gstin, _role);
    }

    /// @notice Only Manufacturers can add medicines
    function addMedicine(
        string memory _name,
        uint256 _price,
        uint256 _stock
    ) public onlyManufacturer {
        medicines[medicineCounter] = Medicine({
            id: medicineCounter,
            name: _name,
            price: _price,
            stock: _stock,
            manufacturer: msg.sender
        });

        emit MedicineAdded(medicineCounter, _name, _price, _stock);
        medicineCounter++;
    }

    /// @notice Place an order with escrow payment
    function placeOrder(
        uint256 _medicineId,
        uint256 _quantity,
        address _seller
    ) public payable onlyRegistered {
        require(
            medicines[_medicineId].stock >= _quantity,
            "Insufficient stock."
        );
        uint256 totalPrice = medicines[_medicineId].price * _quantity;
        require(msg.value >= totalPrice, "Insufficient payment.");

        orders[orderCounter] = Order({
            id: orderCounter,
            buyer: msg.sender,
            seller: _seller,
            medicineId: _medicineId,
            quantity: _quantity,
            totalPrice: msg.value,
            status: OrderStatus.Pending
        });

        balances[msg.sender] += msg.value;
        emit OrderPlaced(orderCounter, msg.sender, _seller, msg.value);
        orderCounter++;
    }

    /// @notice Approve an order (by seller)
    function approveOrder(uint256 _orderId) public onlyRegistered {
        require(
            orders[_orderId].seller == msg.sender,
            "Only seller can approve."
        );
        require(
            orders[_orderId].status == OrderStatus.Pending,
            "Invalid order status."
        );

        orders[_orderId].status = OrderStatus.Approved;
        emit OrderUpdated(_orderId, OrderStatus.Approved);
    }

    /// @notice Ship an order
    function shipOrder(uint256 _orderId) public onlyRegistered {
        require(orders[_orderId].seller == msg.sender, "Only seller can ship.");
        require(
            orders[_orderId].status == OrderStatus.Approved,
            "Order not approved."
        );

        orders[_orderId].status = OrderStatus.Shipped;
        emit OrderUpdated(_orderId, OrderStatus.Shipped);
    }

    /// @notice Mark an order as delivered and release payment
    function markOrderDelivered(uint256 _orderId) public onlyRegistered {
        require(
            orders[_orderId].seller == msg.sender,
            "Only seller can mark delivered."
        );
        require(
            orders[_orderId].status == OrderStatus.Shipped,
            "Order not shipped."
        );

        orders[_orderId].status = OrderStatus.Delivered;
        address seller = orders[_orderId].seller;
        uint256 amount = orders[_orderId].totalPrice;

        balances[seller] += amount;
        balances[orders[_orderId].buyer] -= amount;
        payable(seller).transfer(amount);

        emit OrderUpdated(_orderId, OrderStatus.Delivered);
        emit PaymentReleased(_orderId, seller, amount);
    }

    /// @notice Cancel an order and refund payment
    function cancelOrder(uint256 _orderId) public onlyRegistered {
        require(orders[_orderId].buyer == msg.sender, "Only buyer can cancel.");
        require(
            orders[_orderId].status == OrderStatus.Pending ||
                orders[_orderId].status == OrderStatus.Shipped,
            "Cannot cancel."
        );

        orders[_orderId].status = OrderStatus.Cancelled;
        address buyer = orders[_orderId].buyer;
        uint256 amount = orders[_orderId].totalPrice;

        balances[buyer] -= amount;
        payable(buyer).transfer(amount);

        emit OrderUpdated(_orderId, OrderStatus.Cancelled);
        emit PaymentRefunded(_orderId, buyer, amount);
    }
}
