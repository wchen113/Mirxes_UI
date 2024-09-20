import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button } from '@mui/material';
import withRouter from '../../Components/Common/withRouter';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    textField: {
        '& .MuiInputBase-root': {
            color: 'white',
            '& fieldset': {
                borderColor: 'white'
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white'
            }
        }
    },

    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 16
    },
}));

function CreateOrderForm({ onCreateOrder, onCancel }) {
    const [formData, setFormData] = useState({
        poNumber: '',
        partNo: '',
        totalQty: 0, // Changed to number type
        requiredDate: '',
        customerName: ''
    });

    const [items, setItems] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5154/api/item');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

const fetchCustomers = async () => {
    try {
        const response = await fetch('http://localhost:5154/api/customer');
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        const data = await response.json();

        const uniqueCustomers = Array.from(new Set(data.map(customer => customer.name)));
        const uniqueCustomersData = uniqueCustomers.map(name => {
            return data.find(customer => customer.name === name);
        });

        setCustomers(uniqueCustomersData); // Set unique customers here
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
};

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to handle increase/decrease of quantity
    const handleQuantityChange = (action) => {
        if (action === 'increase') {
            setFormData({ ...formData, totalQty: formData.totalQty + 1 });
        } else if (action === 'decrease' && formData.totalQty > 0) {
            setFormData({ ...formData, totalQty: formData.totalQty - 1 });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreateOrder(formData);
        setFormData({
            poNumber: '',
            partNo: '',
            totalQty: 0,
            requiredDate: '',
            customerName: ''
        });
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        console.log('Cancel button clicked'); // Add this line for debugging
    };


    return (
        <form onSubmit={handleSubmit} style={{ listStyleType: 'none', padding: 0 }}>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="partNo" style={{ width: '150px', textAlign: 'right', marginRight: '10px' }}>Item:</label>
                    <select id="partNo" name="partNo" value={formData.partNo} onChange={handleInputChange}>
                        <option value="" style={{ color: 'white' }}>Select Item</option>
                        {items.map(item => (
                            <option key={item.ID} value={item.Name} style={{ color: 'white' }}>{item.Name}</option>
                        ))}

                    </select>
                </li>

                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="totalQty" style={{ width: '150px', textAlign: 'right', marginRight: '10px' }}>Total Quantity:</label>
                    <div>
                        <input type="number" id="totalQty" name="totalQty" value={formData.totalQty} onChange={handleInputChange} />
                        <button type="button" onClick={() => handleQuantityChange('decrease')}>-</button>
                        <button type="button" onClick={() => handleQuantityChange('increase')}>+</button>
                    </div>
                </li>
                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="requiredDate" style={{ width: '150px', textAlign: 'right', marginRight: '10px' }}>Required Date:</label>
                    <input type="date" id="requiredDate" name="requiredDate" value={formData.requiredDate} onChange={handleInputChange} />
                </li>
                <li style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="customerName" style={{ width: '150px', textAlign: 'right', marginRight: '10px' }}>Customer:</label>
                    <select id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange}>
                        <option value="" style={{ color: 'white' }}>Select Customer</option>
                        {customers.map(customer => (
                            <option key={customer.ID} value={customer.CustName} style={{ color: 'white' }}>{customer.name}</option>
                        ))}
                    </select>
                </li>
                <li style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit">Create Order</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </li>
            </ul>
        </form>
    );
}

const Modal = ({ open, onClose, children }) => {
    const modalStyle = {
        display: open ? 'block' : 'none',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '50%',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        zIndex: 1000,
        textAlign: 'center',
        alignItems: 'center',
    };

    const modalContentStyle = {
        width: '100%',
        height: '100%',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column', // Align children vertically
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001,
    };

    const closeStyle = {
        position: 'absolute',
        top: '5px',
        right: '5px',
        cursor: 'pointer',
        fontSize: '20px',
        color: 'white'
    };

    const closeModal = () => {
        if (onClose) onClose();
    };

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                {/* <span className="close" onClick={closeModal} style={closeStyle}>&times;</span> */}
                {children}
            </div>
        </div>
    );
};


const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [componentData, setComponentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedField, setSortedField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [randomDates, setRandomDates] = useState({});
    const [randomCustomers, serRandomCustomers] = useState([]);
    const [totalQuantities, setTotalQuantities] = useState({});

    const classes = useStyles();
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [salesOrders, setSalesOrders] = useState([]);

    const [formData, setFormData] = useState({
        poNumber: '',
        partNo: '',
        totalQty: 0,
        requiredDate: '',
        customerName: ''
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsResponse = await axios.get('http://localhost:5154/api/item');
                const customerResponse = await axios.get('http://localhost:5154/api/customer');
                //const ordersResponse = await axios.get('http://localhost:8081/api/orders');
                // const customersResponse = await axios.get('http://localhost:8081/api/customers');
                // const componentsResponse = await axios.get('http://localhost:8081/api/components');
                const response = await axios.get('http://localhost:5154/api/salesorder');
                //const suppliers = customersResponse.map(customer => customer.name);
                setItems(itemsResponse)
                setCustomers(customerResponse);
                setSalesOrders(response);
                // setOrders(ordersResponse);
                // setCustomers(customersResponse);
                // setComponentData(componentsResponse);
                // serRandomCustomers(suppliers);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // useEffect(() => {
    //     const generateRandomDates = () => {
    //         const startDate = new Date();
    //         const endDate = new Date();
    //         endDate.setDate(endDate.getDate() + 30);

    //         const newRandomDates = {};
    //         orders.forEach(order => {
    //             let randomDate = sessionStorage.getItem(randomDate_${order.id});
    //             if (!randomDate) {
    //                 randomDate = getRandomDate(startDate, endDate);
    //                 sessionStorage.setItem(randomDate_${order.id}, randomDate);
    //             }
    //             const formattedRandomDate = formatDate(new Date(randomDate));
    //             newRandomDates[order.id] = formattedRandomDate;
    //         });
    //         setRandomDates(newRandomDates);
    //     };

    //     if (orders.length > 0 && Object.keys(randomDates).length === 0) {
    //         generateRandomDates();
    //     }
    // }, [orders, randomDates]);

    useEffect(() => {
        const storedTotalQuantities = JSON.parse(localStorage.getItem('totalQuantities'));
        if (storedTotalQuantities) {
            setTotalQuantities(storedTotalQuantities);
        } else {
            // If total quantities are not stored in local storage, generate random quantities
            const randomQuantities = {};
            orders.forEach(order => {
                randomQuantities[order.id] = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
            });
            setTotalQuantities(randomQuantities);
            localStorage.setItem('totalQuantities', JSON.stringify(randomQuantities));
        }
    }, [orders]);

    const getRandomDate = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // const formatDate = (date) => {
    //     const formattedDate = new Date(date);
    //     const day = formattedDate.getDate();
    //     const month = formattedDate.getMonth() + 1;
    //     const year = formattedDate.getFullYear();

    //     return ${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day};
    // };

    const calculateEstimatedLeadTime = (poNumber) => {
        const ordersWithSamePoNumber = orders.filter(order => order.pO_Number === poNumber);
        const totalLeadTime = ordersWithSamePoNumber.reduce((acc, order) => acc + (order.required_to_Post_Date + order.grN_to_Required_Date), 0);
        const averageLeadTime = totalLeadTime / ordersWithSamePoNumber.length;
        return Math.ceil(averageLeadTime);
    };

    const handleSort = (field) => {
        if (sortedField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedField(field);
            setSortOrder('asc');
        }
    };

    const sortedOrders = () => {
        if (!sortedField) return orders;

        return [...orders].sort((a, b) => {
            const aValue = a[sortedField];
            const bValue = b[sortedField];
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    };

    const filteredOrders = sortedOrders().filter((order, index, self) => {
        return index === self.findIndex(o => o.poNumber === order.poNumber);
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreateOrder = (newOrder) => {
        setOrders([...orders, newOrder]);
        setIsCreatingOrder(false);
    };

    const handleCancel = () => {
        setIsCreatingOrder(false);
        setIsModalOpen(false);
    };

    return (
        <div className='react-table'>
            <div className="procurement-title flex mb-2">
                <h1>SALES ORDERS DASHBOARD</h1>
            </div>


            <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                    style: { color: 'white' },
                    classes: {
                        root: classes.inputRoot,
                        focused: classes.inputFocused,
                        notchedOutline: classes.inputOutline
                    }
                }}
                InputLabelProps={{
                    style: { color: 'white' },
                    inputProps: {
                        // Ensure that only the date is displayed
                        min: new Date().toISOString().split("T")[0] // Optional: set min date to today
                    }
                }}
                className={classes.textField}
            />
            <div className={classes.buttonContainer}>
                <Button variant="contained" onClick={() => setIsModalOpen(true)}>Import Order</Button>
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <CreateOrderForm onCreateOrder={handleCreateOrder} onCancel={handleCancel} />
                </Modal>
            </div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ color: 'white', cursor: 'pointer' }} onClick={() => handleSort('poNumber')}>Sales Order Number</TableCell>
                            <TableCell style={{ color: 'white', cursor: 'pointer' }} onClick={() => handleSort('partNo')}>Item Name</TableCell>
                            <TableCell style={{ color: 'white', cursor: 'pointer' }} onClick={() => handleSort('totalQty')}>Total Quantity</TableCell>
                            <TableCell style={{ color: 'white', cursor: 'pointer' }}>Required Date</TableCell>
                            <TableCell style={{ color: 'white', cursor: 'pointer' }}>Customer Name</TableCell>
                            <TableCell style={{ color: 'white', cursor: 'pointer' }}>Estimated Lead Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salesOrders.map(order => {
                            const formattedRandomDate = randomDates[order.id];
                            const estimatedLeadTime = calculateEstimatedLeadTime(order.pO_Number);
                            const randomCustomerIndex = Math.floor(Math.random() * randomCustomers.length);
                            const randomCustomer = randomCustomers[randomCustomerIndex];
                            const totalQty = totalQuantities[order.id];

                            // Filter orders with the same poNumber and extract unique partNo values
                            const uniquePartNos = orders
                                .filter(o => o.poNumber === order.poNumber)
                                .map(o => o.poNumber)
                                .filter((value, index, self) => self.indexOf(value) === index);

                            return (
                                <TableRow key={order.id}>
                                    <TableCell style={{ color: 'white' }}>
                                        {order.soNo}
                                    </TableCell>
                                    <TableCell style={{ color: 'white' }}>
                                        {items.map(item => {
                                            if (item.id === order.id) {
                                                return (
                                                    <Link key={item.id} to="/materiallist" style={{ color: 'lightblue' }}>{item.name}</Link>
                                                );
                                            }
                                            return null;
                                        })}
                                    </TableCell>
                                    <TableCell style={{ color: 'white' }}>{order.qtyOrdered}</TableCell>
                                    <TableCell style={{ color: 'white' }}>{(order.rowDeliveryDate)}</TableCell>
                                    {/* <TableCell style={{ color: 'white' }}>
                                        {salesOrders.map(order => {
                                            const customer = customers.find(customer => customer.custCode === order.custCode);
                                            if (customer) {
                                                return (
                                                    <span key={customer.id}>{order.custName}</span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </TableCell> */}

                                    <TableCell style={{ color: 'white' }}>
                                        {order.custName}
                                    </TableCell>

                                    <TableCell style={{ color: 'white' }}>{isNaN(estimatedLeadTime) ? 0 : estimatedLeadTime}</TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default withRouter(Dashboard);