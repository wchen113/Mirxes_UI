import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './material.css';

const API_ENDPOINT = 'http://localhost:5154/api/';

const MaterialList = () => {
  const [data, setData] = useState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', positionName: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dropdownData, setDropdownData] = useState([]);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.itemName);
    fetchData(category.itemName);
  };

  const fetchData = async (category = '') => {
    try {
      const response = await fetch(`${API_ENDPOINT}RawMaterials?category=${category}`);
      const responseData = await response.json();

      if (!Array.isArray(responseData.$values)) {
        throw new Error('Expected $values to be an array');
      }

      const nodes = responseData.$values;
      console.log('Fetched nodes:', nodes); // Log fetched data

      // Initialize empty children arrays and direct subordinates count
      const nodesMap = new Map(nodes.map(node => [node.id, node]));
      nodes.forEach(node => {
        node.children = []; 
        node._directSubordinates = 0;
      });

      // Populate children arrays and direct subordinates count
      nodes.forEach(node => {
        if (node.parentId) {
          const parentNode = nodesMap.get(node.parentId);
          if (parentNode) {
            parentNode.children = parentNode.children || [];
            parentNode.children.push(node);
          }
        }
      });

      // Update direct subordinates count for each node
      nodes.forEach(node => {
        node._directSubordinates = (node.children || []).length;
      });

      console.log('Processed nodes:', nodes); // Log processed data

      // Identify the root node
      const rootNode = nodes.find(node => !node.parentId || node.parentId === null);

      if (!rootNode) {
        console.error('Root node not found');
        return;
      }

      setData([rootNode]);
    } catch (error) {
      console.error('Error fetching or processing data:', error);
    }
  };

  const fetchDropdown = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}RawMaterials/dropdown`);
      const responseData = await response.json();
      setDropdownData(responseData.$values);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  useEffect(() => {
    fetchDropdown();
  }, []);

  // Define modifySVG function here
  const modifySVG = (svgStr) => {
    return svgStr
      .replace('L135', 'L130')
      .replace('L15', 'L10')
      .replace('L0', 'L5')
      .replace('L150', 'L145');
  };

  useEffect(() => {
  if (data.length === 0) return;

  console.log('Data for OrgChart:', data); // Log data before rendering

  const chartContainer = d3.select('.chart-container');
    chartContainer.selectAll('*').remove(); // Clear previous chart
    
      const levelColors = [
    '#91e4c1',
    '#8ad554',
    '#b0b0b0',
    '#403047',
    '#54425f',
    '#6b5b7b',
  ];

  const chart = new OrgChart()
    .container('.chart-container')
    .data(data)
    .nodeContent((d) => {
      console.log('Rendering Node:', d); // Log node data for debugging
      const svgStr = `<svg width=150 height=75 style="background-color:none">
                        <path d="M 5,15 L20,0 L130,0 L145,15 L145,60 L130,75 L20,75 L5,60" fill="#2599DD" stroke="#2599DD"/>
                      </svg>`;
      const modifiedSVG = modifySVG(svgStr);
      const backgroundColor = levelColors[d.depth % levelColors.length];
      return `
        <div style="font-family: 'Inter', sans-serif; background-color:${backgroundColor}; position:absolute; margin-top:-1px; margin-left:-1px; width:${d.width}px; height:${d.height}px; border-radius:0px; border: 2px solid #2CAAE5;">
          <div style="color:black; position:absolute; left:20px; top:20px;">
            <div style="font-size:15px; color:black; margin-top:32px;">${d.data.name}</div>
            <br />
            <div style="font-size:15px; color:black;">Part No: ${d.data.partNo || ''}</div>
          </div>
        </div>`;
    })
    .render();

  chart.setExpanded('1').setCentered('1').render();

  return () => {
    chartContainer.selectAll('*').remove();
  };
}, [data]);

  const handleEdit = (node) => {
    setEditingNode(node);
    setEditForm({ name: node.name, positionName: node.positionName });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedNode = { ...editingNode, ...editForm };
      await fetch(`${API_ENDPOINT}RawMaterials/${updatedNode.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNode),
      });
      setData((prevData) =>
        prevData.map((node) => (node.id === updatedNode.id ? updatedNode : node))
      );
      setEditingNode(null);
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  const handleCancel = () => {
    setEditingNode(null);
  };

  return (
      <div style={{ marginTop: '200px' }}>
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
        <DropdownToggle caret>
          {selectedCategory || 'Select Category'}
        </DropdownToggle>
        <DropdownMenu>
          {dropdownData.map((item) => (
            <DropdownItem key={item.itemName} onClick={() => handleCategorySelect(item)}>
              {item.itemName}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <div className="chart-container" style={{ position: 'relative', width: '100%', height: '100vh' }}></div>
      {editingNode && (
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Part No:
            <input
              type="text"
              name="partNo"
              value={editForm.partNo}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MaterialList;
