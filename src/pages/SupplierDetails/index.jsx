import React, { useState } from "react";
import { Card, CardBody, Container } from "reactstrap";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
} from 'chart.js';
import { Padding } from "@mui/icons-material";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

export default function SupplierDetails() {
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const bioplasticData = {
        labels: ["2021 Q1", "2021 Q2", "2021 Q3", "2021 Q4", "2022 Q1", "2022 Q2", "2022 Q3", "2022 Q4", "2023 Q1", "2023 Q2", "2023 Q3", "2023 Q4", "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4", "2025 Q1", "2025 Q2", "2025 Q3", "2025 Q4"],
        datasets: [
            {
                label: "Lead Time",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [5, 8, 12, 10, 6, 9, 11, 15, 18, 14, 10, 12, 8, 17, null, null, null, null, null, null],
            },
            {
                label: "Projected Lead Time",
                fill: false,
                lineTension: 0.1,
                borderColor: "red",
                pointBorderColor: "red",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "red",
                pointHoverBorderColor: "red",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [null, null, null, null, null, null, null, null, null, null, null, null, null, 17, 17, 14, 15, 18, 12, 20, 22],
            },
        ],
    };

    const lifeTechnologiesData = {
        labels: ["2021 Q1", "2021 Q2", "2021 Q3", "2021 Q4", "2022 Q1", "2022 Q2", "2022 Q3", "2022 Q4", "2023 Q1", "2023 Q2", "2023 Q3", "2023 Q4", "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4", "2025 Q1", "2025 Q2", "2025 Q3", "2025 Q4"],
        datasets: [
            {
                label: "Lead Time",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [8, 14, 12, 10, 6, 9, 11, 15, 18, 14, 10, 12, 8, 17, null, null, null, null, null, null],
            },
            {
                label: "Projected Lead Time",
                fill: false,
                lineTension: 0.1,
                borderColor: "red",
                pointBorderColor: "red",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "red",
                pointHoverBorderColor: "red",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [null, null, null, null, null, null, null, null, null, null, null, null, null, 17, 20, 21, 19, 18, 12, 20, 22],
            },
        ],
    };

    const showDetails = (supplier) => {
        setSelectedSupplier(supplier);
    };

    const renderSupplierDetails = () => {
        if (selectedSupplier === 'BioPlasticBV') {
            return (
                <div>
                    <h4>Details for BioPlastic BV</h4>
                    <p>Additional information about BioPlastic BV.</p>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <span className="fw-bold">Procurement Strategy:</span> Fixed Price Contract
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Cost Details:</span> $xxx per 100 unit
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Example:</span>
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Example:</span>
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Example:</span>
                        </li>
                    </ul>
                </div>
            );
        } else if (selectedSupplier === 'LifeTechnologies') {
            return (
                <div>
                    <h4>Details for Life Technologies Holdings Pte Ltd</h4>
                    <p>Additional information about Life Technologies Holdings Pte Ltd.</p>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <span className="fw-bold">Procurement Strategy:</span> Purchase To Order
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Cost Details:</span> $xxx per 100 unit
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Example:</span>
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Example:</span>
                        </li>
                        <li className="list-group-item">
                            <span className="fw-bold">Example:</span>
                        </li>
                    </ul>
                </div>
            );
        } else {
            return (
                <div>
                    <p>No details available for the selected supplier.</p>
                </div>
            );
        }
    };

    const goBack = () => {
        window.location.href = `http://localhost:3000/materiallist`;
    };

    return (
        <Container className="react-table">
            <div className="procurement-title flex mb-2">
                <h1>Procurement Recommendations</h1>
                <h2 className="procurement-product">Cap, 8-strip, Optical, Bioplastics, for RT</h2>
            </div>
            {/* <div style={{paddingLeft:'1000px'}}>
                <button onClick={goBack}>back</button>
            </div> */}
            <div className="procurement-wrapper" style={{width:'100%'}}>
                <div className="procurement-left" >
                    <Card>
                        <CardBody>
                            <h4 className="card-title mb-2">
                                Reagent, TE Buffer, Invitrogen, 100 ML
                            </h4>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <span className="fw-bold">Current Inventory:</span> 231
                                </li>
                                <li className="list-group-item">
                                    <span className="fw-bold">Predicted Date Exhaustion:</span> 2024-2-10
                                </li>
                                <li className="list-group-item">
                                    <span className="fw-bold">Last Procurement Date:</span> 2023-10-18
                                </li>
                            </ul>

                            <button className="supplier-details" onClick={() => showDetails('BioPlasticBV')}>
                                BioPlastic BV
                            </button>
                            <button className="supplier-details" onClick={() => showDetails('LifeTechnologies')}>
                                Life Technologies Holdings Pte Ltd
                            </button>
                        </CardBody>
                    </Card>
                    {renderSupplierDetails()}
                </div>
                <div className="procurement-right">
                    {selectedSupplier === 'BioPlasticBV' && (
                        <Line
                            data={bioplasticData}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Lead Time",
                                        },
                                    },
                                },
                            }}
                        />
                    )}
                    {selectedSupplier === 'LifeTechnologies' && (
                        <Line
                            data={lifeTechnologiesData}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Lead Time",
                                        },
                                    },
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </Container>

    );
}
