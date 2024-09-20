import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import axios from 'axios';

const MaterialList = () => {
  const [inputFinalLeadTime, setInputFinalLeadTime] = useState("");
  const [showRecommend, setShowRecommend] = useState(false);
  const [orders, setOrders] = useState([]);
  const [componentData, setComponentData] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [batchDetails, setBatchDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get('http://18.141.34.124:5154/api/rawmaterials');
        console.log("API Response:", itemsResponse.$values);

        const components = Array.isArray(itemsResponse.$values) ? itemsResponse.$values : [];
        setComponentData(components);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  const getNextDate = (days) => {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
  };

  const getPastDate = (days) => {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(pastDate.getDate() - days);
    return pastDate;
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const exhaustionDatesArray = [
    getNextDate(1),
    getNextDate(5),
    getNextDate(10),
    getNextDate(15),
    getNextDate(20),
    getNextDate(25),
    getNextDate(30),
    getNextDate(35),
    getNextDate(40),
    getNextDate(45),
  ];

  const pastDateArray = [
    getPastDate(30),
    getPastDate(60),
    getPastDate(90),
    getPastDate(120),
    getPastDate(150),
    getPastDate(180),
    getPastDate(210),
    getPastDate(240),
    getPastDate(270),
    getPastDate(300),
  ];
  

  const exhaustionDate = exhaustionDatesArray[6 % exhaustionDatesArray.length];
  const pastDate = pastDateArray[1 % pastDateArray.length];

  const formattedPastDate = formatDate(pastDate);
  const formattedExhaustionDate = formatDate(exhaustionDate);

  const handleNewOrder = async (order) => {
    const { partNo, quantity } = order;

    // Make a POST request to update inventory
    try {
      await axios.post('http://localhost:8081/api/updateInventory', {
        partNo,
        quantity
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      return;
    }

    const lastProcurementDate = getPastDate(0); // Assuming last procurement date is today
    const expiredDate = new Date(lastProcurementDate);
    expiredDate.setFullYear(expiredDate.getFullYear() + 1); // Set expiration date 1 year after last procurement

    setBatchDetails(prevBatchDetails => {
      const newBatchDetails = { ...prevBatchDetails };
      if (!newBatchDetails[partNo]) {
        newBatchDetails[partNo] = [];
      }
      newBatchDetails[partNo].push({ ...order, expiredDate }); // Include expired date
      return newBatchDetails;
    });

    setComponentData(prevComponentData => {
      const updatedComponentData = prevComponentData.map(component => {
        if (component.partNo === partNo) {
          const newInventory = (component.inventory || 0) + quantity;
          return { ...component, inventory: newInventory };
        }
        return component;
      });
      return updatedComponentData;
    });
  };


  const history = useNavigate();
  const handleRecommendedClick = () => {
    history('/supplierlist');
  };

  // useEffect(() => {
  //   // Handle new orders
  //   orders.forEach(order => {
  //     if (order.status === 'delivered') {
  //       handleNewOrder(order);
  //     }
  //   });
  // }, [orders]);

    // Function to filter out items that have child items
const filterParentItems = () => {
  const childIds = new Set(componentData.map(item => item.parentId).filter(id => id));
  return componentData.filter(item => !childIds.has(item.id));
  };
  
  console.log(componentData)


  const filteredData = filterParentItems();

  return (
    <Container fluid className="react-table">
      <div className="procurement-title flex mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 'auto', width: '100%', textAlign: 'center' }}>RAW MATERIAL LIST</h1>
        <button className="recommend-label" onClick={handleRecommendedClick}>RECOMMENDED PO</button>
      </div>
      <Row>
        {filteredData
          .map((component, index) => (

          <Col sm={4} xl={4} key={index}>
            <Card>
              <CardBody style={{ marginBottom: '20px' }}>
                <h4 className="card-title mb-2">
                  <a href="/supplierdetails" style={{ color: 'lightblue' }}>{component.name}</a>
                </h4>
                <h5 className="card-title mb-2">
                  Part Number: {component.partNo}
                </h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <span className="fw-bold">
                      Current Inventory: {component.inventory !== undefined ? Math.abs(component.inventory) : 'N/A'}
                    </span>
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">
                      Predicted Date Exhaustion: {formattedExhaustionDate}
                    </span>
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">Suppliers: </span>
                    <a href='/data-synthesizer' style={{ color: 'lightblue' }}>BIOplastic BV</a>
                  </li>
                  <li className="list-group-item">
                    <span className="fw-bold">Last Procurement Date:</span>{" "}
                    {formattedPastDate}
                  </li>
                  <span></span>
                </ul>
                <React.Fragment>
                  {batchDetails[component.partNo] && (
                    <React.Fragment>
                      <br />
                      <h5 style={{ textDecoration: 'underline' }}>Batch Details: </h5>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>PO Number</th>
                            <th>Quantity</th>
                            <th>Expired Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batchDetails[component.partNo].map((batch, batchIndex) => {
                            const absQuantity = Math.abs(batch.quantity);
                            return (
                              <tr key={batchIndex}>
                                <td>{batch.poNumber}</td>
                                <td>{absQuantity}</td>
                                <td>{formatDate(batch.expiredDate)}</td> 
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </React.Fragment>
                  )}
                </React.Fragment>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MaterialList;
