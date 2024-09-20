import React, { useEffect, useRef } from "react";

import { Link } from "react-router-dom";

//import Components
import BreadCrumb from "../../Components/Common/BreadCrumb";

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  Row,
} from "reactstrap";

// interface PoCardProps {
//   item_name: string;
//   current_inventory: number;
//   predicted_date_exhaustion: string; // TODO: change to date
//   suppliers: string[];
//   last_procument_date: string;
//   lead_time: number;
// }

const PoCard = (props) => {
  <Col sm={4} xl={4}>
    <Card>
      <CardBody>
        <h4 className="card-title mb-2">{props.item_name}</h4>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <span className="fw-bold">Current Inventory:</span>{" "}
            {props.current_inventory}
          </li>
          <li className="list-group-item">
            <span className="fw-bold">Predicted Date Exhaustion:</span>{" "}
            {props.predicted_date_exhaustion}
          </li>
          <li className="list-group-item">
            <span className="fw-bold">Suppliers:</span>{" "}
            {props.suppliers.map((supplier, index) => (
              <span key={index}>{supplier}</span>
            ))}
          </li>
          <li className="list-group-item">
            <span className="fw-bold">Last Procument Date:</span>{" "}
            {props.last_procument_date}
          </li>
          <li className="list-group-item">
            <span className="fw-bold">Lead Time:</span> {props.lead_time}
          </li>
        </ul>
      </CardBody>
      <div className="card-footer">
        <Link to="#" className="card-link link-secondary">
          Details{" "}
          <i className="ri-arrow-right-s-line ms-1 align-middle lh-1"></i>
        </Link>
        <Link to="#" className="card-link link-success">
          Bookmark <i className="ri-bookmark-line align-middle ms-1 lh-1"></i>
        </Link>
      </div>
    </Card>

  </Col>;
};

export default PoCard;
