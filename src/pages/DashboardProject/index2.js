import { TableCell } from '@mui/material';
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from "react-router-dom";

const SalesOrderDashboard = () => {
    const [salesOrders, setSalesOrders] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesOrdersResponse, rawMaterialsResponse, purchaseResponse ] = await Promise.all([
                    axios.get("http://18.141.34.124:5154/api/salesorder"),
                    axios.get("http://18.141.34.124:5154/api/rawmaterials"),
                    axios.get("http://18.141.34.124:5154/api/outliers")
                ]);

                // const [salesOrdersResponse, rawMaterialsResponse, purchaseResponse ] = await Promise.all([
                //     axios.get("http://localhost:5154/api/salesorder"),
                //     axios.get("http://localhost:5154/api/rawmaterials"),
                //     axios.get("http://localhost:5154/api/outliers")
                // ]);

                const salesOrdersData = salesOrdersResponse.$values || [];
                const rawMaterialsData = rawMaterialsResponse.$values || [];
                const purchaseOrderData = purchaseResponse.$values || []; 

                 const groupedData = groupSalesOrders(salesOrdersData);

                setSalesOrders(groupedData);
                setRawMaterials(rawMaterialsData);
                setPurchaseOrders(purchaseOrderData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

   const columns = useMemo(
    () => [
        {
            accessorKey: "soNo",
            header: "Sales Order No",
            enableGrouping: true,
        },
        {
            accessorKey: "items",
            header: "Item Names",
            Cell: ({ row }) => (
                <ol>
                    {row.original.items.map((item, index) => (
                        <li key={index}>
                            <Link to="/materiallist" style={{ color: 'blue' }}>{item.itemServiceDescription}</Link>
                        </li>
                    ))}
                </ol>
            ),
        },
        {
            accessorKey: "qtyOrdered",
            header: "Total Quantity",
        },
        {
            accessorKey: "rowDeliveryDate",
            header: "Required Date",
        },
        {
            accessorKey: "custName",
            header: "Customer Name",
        },
        {
            accessorKey: "estimatedLeadTime",
            header: "Estimated Lead Time",
        },
    ],
    []
);

    const table = useMaterialReactTable({
        columns,
        data: salesOrders,
        initialState: {
            expanded: {},
            groupBy: ['soNo'],
        },
        filterFromLeafRows: true,
        getSubRows: (row) => row.subRows,
        initialState: { expanded: {} },
        enablePagination: false,
        enableGrouping: true,
    });

    const groupSalesOrders = (salesOrders) => {
    const groupedData = salesOrders.reduce((acc, order) => {
        const { soNo, itemServiceDescription, qtyOrdered, rowDeliveryDate, custName, estimatedLeadTime } = order;
        
        if (!acc[soNo]) {
            acc[soNo] = {
                soNo,
                qtyOrdered,
                rowDeliveryDate,
                custName,
                estimatedLeadTime,
                items: [] 
            };
        }

        acc[soNo].items.push({ itemServiceDescription });
        return acc;
    }, {});

    return Object.values(groupedData);
};


   return (
    <div className="react-table">
        <div className="procurement-title flex mb-2">
            <h1>SALES ORDERS LIST</h1>
        </div>
        <MaterialReactTable table={table} />
    </div>
);

}

export default SalesOrderDashboard;
