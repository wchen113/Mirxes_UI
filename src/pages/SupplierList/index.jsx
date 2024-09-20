import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://18.141.34.124:5154/api/suppliers');
        const supplierData = response.$values;
        setSuppliers(supplierData);
        setFilteredSuppliers(supplierData);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://18.141.34.124:5154/api/salesorder');
        const orderData = response.$values;
        setOrders(orderData);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterSuppliers(e.target.value);
  };

  const filterSuppliers = (term) => {
    const filtered = suppliers.filter(supplier =>
      supplier.bpName.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  return (
    <div>
      <div className="procurement-title mb-4" style={{ textAlign: 'center', color: '#fff' }}>
        <h1>SUPPLIER LIST</h1>
      </div>
      <Input
        type="text"
        placeholder="Search suppliers..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', width: '100%', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}
      />
      <Container fluid className="react-table">
        <Container>
          <h6 style={{ textAlign: 'center', color: '#fff' }}>Suppliers</h6>
          <Row className="justify-content-center flex">
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier, index) => (
                <Col xs={12} md={8} lg={7} key={index} style={{ marginBottom: '15px' }}>
                  <Card style={{ padding: '1rem' }}>
                    <Row>
                      <Col xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaBell size={20} />
                      </Col>
                      <Col xs={10}>
                        <Link to="/supplierdetails" style={{ textDecoration: 'none', color: '#333', display: 'flex', textAlign: 'center', alignItems: 'center' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '30px',
                              backgroundColor: '#007bff',
                              color: '#fff',
                              borderRadius: '50%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              textAlign: 'center'
                            }}
                          >
                            {orders.filter(order => order.supplier === supplier.bpName).length}
                          </div>
                          <h4 style={{ textAlign: 'center', color: '#fff', width: '500px' }}>
                            {supplier.bpName}
                          </h4>
                        </Link>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))
            ) : (
              <p style={{ color: '#fff', textAlign: 'center' }}>No suppliers found.</p>
            )}
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default SupplierList;
