import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';

const PurchaseOrder = ({ onFinalLeadTimeStats }) => {
  const [orders, setOrders] = useState([]);
  const [inputFinalLeadTime, setInputFinalLeadTime] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [additionalLeadTimes, setAdditionalLeadTimes] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };


  const fetchData = async () => {
    try {
      const response = await axios.get('http://18.141.34.124:5154/api/outliers');
      //const response = await axios.get('http://localhost:5154/api/outliers');
      setOrders(response.$values || []);
      setInputFinalLeadTime(new Array(response.$values.length).fill({ value: '', updated: false }));

      // const initialRemarks = response.reduce((acc, order) => {
      //   acc[order.pO_Number] = '';
      //   return acc;
      // }, {});
      // setRemarks(initialRemarks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFinalLeadTimeChange = (event, index) => {
    const { value } = event.target;
    setInputFinalLeadTime(prevState => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], value };
      return newState;
    });
  };

  const increaseGRNToRequiredDate = async (id, poNumber, incrementValue) => {
    try {
      const response = await axios.put(`http://localhost:5154/api/outliers/${id}`, {
        pO_Number: poNumber,
        requiredToPostDate: incrementValue
      });
      console.log(response)
      fetchData();
    } catch (error) {
      console.error('Error increasing GRN to Required Date:', error.response?.data || error.message);
      alert('An error occurred while updating the GRN to Required Date. Please try again.');
    }
  };


  const handleAddFinalLeadTime = async (index) => {
    const inputValue = inputFinalLeadTime[index].value;
    if (inputValue.trim() === '' || isNaN(parseFloat(inputValue))) {
      alert('Please enter a valid number.');
      return;
    }

    const order = orders[index];
    // Assuming 'order.id' holds the ID of the record to update
    await increaseGRNToRequiredDate(order.id, order.pO_Number, parseInt(inputValue));

    setAdditionalLeadTimes((prevState) => {
      const newLeadTimes = [...prevState];
      newLeadTimes[index] = inputValue;
      return newLeadTimes;
    });
    setInputFinalLeadTime(prevState => {
      const newState = [...prevState];
      newState[index] = { value: '', updated: true };
      return newState;
    });
  };

  const handleRemarkChange = (event, poNumber) => {
    const { value } = event.target;
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [poNumber]: value,
    }));
  };

  const handleAddRemark = (index) => {
    const poNumber = orders[index].pO_Number;
    const updatedOrders = [...orders];
    updatedOrders[index].remarks = remarks[poNumber];
    setOrders(updatedOrders);

    // Clear input after adding remark
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [poNumber]: '',
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container fluid className="react-table">
      <div className="procurement-title flex mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 'auto', width: '100%', textAlign: 'center' }}>PURCHASE ORDER</h1>
      </div>
      <Row>
        {orders.map((order, index) => (
          <Col sm={4} xl={4} key={index}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-2">
                  <a href="/supplierdetails" style={{ color: 'lightblue' }}>{order.item_Name}</a>
                </h4>
                <h5 className="card-title mb-2">
                  Part Number: {order.part_No}
                </h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <span className="fw-bold">PO Number:</span> {order.pO_Number}
                  </li>
                  <li className="list-group-item"> <span className="fw-bold">Quantity: {order.quantity >= 0 ? order.quantity : -order.quantity}</span></li>
                  <li className="list-group-item">
                    <span className="fw-bold">Predicted Date Exhaustion:</span>{" "}
                    {formatDate(order.date_Exhaustion)}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">Suppliers: </span>
                    <a href='/data-synthesizer' style={{ color: 'lightblue' }}>{order.vendor}</a>
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">Last Procurement Date:</span>{" "}
                    {formatDate(order.last_Procurement)}
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">Estimated Lead Time:</span>{" "}
                    <span>{order.required_to_Post_Date}</span>
                  </li>
                  <li className="list-group-item">
                    <React.Fragment>
                      <input
                        key={index}
                        type="number"
                        placeholder="Add additional lead time"
                        value={inputFinalLeadTime[index].value || ''}
                        onChange={(event) => handleFinalLeadTimeChange(event, index)}
                      />
                      {" "}
                      <button onClick={() => handleAddFinalLeadTime(index)}>
                        Update
                      </button>{" "}
                      {additionalLeadTimes[index] && (
                        <span>Additional Lead Time: {additionalLeadTimes[index]}</span>
                      )}
                    </React.Fragment>
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">Final Lead Time:</span>{" "}
                    <span>
                      {order.required_to_Post_Date && additionalLeadTimes[index]
                        ? parseInt(order.required_to_Post_Date) + parseInt(additionalLeadTimes[index])
                        : order.required_to_Post_Date}
                    </span>
                  </li>

                  <li className="list-group-item">
                    <span className="fw-bold">Remarks:</span>{" "}
                    <input
                      type="text"
                      value={remarks[order.pO_Number] || ''}
                      onChange={(event) => handleRemarkChange(event, order.pO_Number)}
                      placeholder="Enter Remark"
                    />{" "}
                    <button onClick={() => handleAddRemark(index)}>
                      Add Remark
                    </button>
                    <ul>
                      {order.remarks && order.remarks.filter(remark => remark.text === "test").map((remark, remarkIndex) => (
                        <li key={remarkIndex}>{remark.text}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PurchaseOrder;
