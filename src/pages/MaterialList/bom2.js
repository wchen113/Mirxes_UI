import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  tableContainer: {
    marginTop: '20px',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  bodyCell: {
    fontSize: '14px',
  },
  topLevelRow: {
    backgroundColor: '#006da3', // Light blue for top-level rows (parents)
  },
  childRow: {
    backgroundColor: '#44a91d', // Light green for rows with parentId (children)
  },
  overall: {
    marginTop: '100px',
  },
});

const Example = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for editing and deleting
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [editedItem, setEditedItem] = useState({}); // State for edited item
  const classes = useStyles();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
  try {
    const response = await  axios.get("http://18.141.34.124:5154/api/rawmaterials")
    const flatData = response.$values || []; // Adjust based on actual API response
    console.log(response)
    const hierarchicalData = buildHierarchy(flatData);
    setItems(hierarchicalData);
  } catch (error) {
      console.error('Error fetching item data:', error);
    }
  };

  const buildHierarchy = (flatData) => {
    const itemMap = {};

    flatData.forEach(item => {
      item.subRows = [];
      itemMap[item.id] = item;
    });

    const hierarchicalData = [];
    flatData.forEach(item => {
      if (item.parentId === null) {
        hierarchicalData.push(item);
      } else {
        if (itemMap[item.parentId]) {
          itemMap[item.parentId].subRows.push(item);
        }
      }
    });

    return hierarchicalData;
  };

  const handleAdd = () => {
    // Open dialog for adding a new item
    setEditedItem({ partNo: '', name: '', quantity: '' }); // Initialize with empty values
    setOpenDialog(true);
  };

  const handleEdit = (item) => {
    // Open dialog for editing the selected item
    setSelectedItem(item);
    setEditedItem({ ...item }); // Initialize editedItem state with current item data
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editedItem.id) {
        // Update existing item
        await axios.put(`https://localhost:7016/api/item/${editedItem.id}`, editedItem);
      } else {
        // Add new item
        const response = await axios.post('https://localhost:7016/api/item', editedItem);
        const newItem = response;
        setItems([...items, newItem]);
      }

      setOpenDialog(false);
      fetchItems(); // Refresh data after save
    } catch (error) {
      console.error('Error saving item:', error);
      // Implement error handling (e.g., show error message)
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedItem) return;

      // Confirm deletion
      const confirmDelete = window.confirm(`Are you sure you want to delete "${selectedItem.name}"?`);
      if (!confirmDelete) return;

      // Delete item
      await axios.delete(`https://localhost:7016/api/item/${selectedItem.id}`);
      setItems(items.filter(item => item.id !== selectedItem.id));
      setSelectedItem(null); // Clear selected item after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
      // Implement error handling (e.g., show error message)
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedItem({ ...editedItem, [name]: value });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'partNo',
        header: 'Part No',
        muiTableBodyCellProps: { className: classes.bodyCell },
        muiTableHeadCellProps: { className: classes.headerCell },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        muiTableBodyCellProps: { className: classes.bodyCell },
        muiTableHeadCellProps: { className: classes.headerCell },
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        muiTableBodyCellProps: { className: classes.bodyCell },
        muiTableHeadCellProps: { className: classes.headerCell },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <>
            <Button variant="contained" color="primary" onClick={() => handleEdit(row.original)}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(row.original)}>
              Delete
            </Button>
          </>
        ),
        disableSortBy: true,
      },
    ],
    [classes, handleEdit]
  );

  const table = useMaterialReactTable({
    columns,
    data: items,
    enableExpandAll: true,
    enableExpanding: true,
    filterFromLeafRows: true,
    getSubRows: (row) => row.subRows,
    initialState: { expanded: {} },
    muiTableContainerProps: { className: classes.tableContainer },
    enablePagination: false,
    getRowProps: ({ row }) => ({
      className: row.parentId === null ? classes.topLevelRow : classes.childRow,
    }),
  });

  return (
    <div className={classes.overall}>
      <div>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </div>
      <MaterialReactTable table={table} />
      <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{selectedItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="partNo"
            name="partNo"
            label="Part No"
            type="text"
            fullWidth
            value={editedItem.partNo || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={editedItem.name || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="quantity"
            name="quantity"
            label="Quantity"
            type="text"
            fullWidth
            value={editedItem.quantity || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Example;
