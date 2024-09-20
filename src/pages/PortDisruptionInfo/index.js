import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import './PortDisruptionInfo.css';
import { useMap } from 'react-leaflet';

const BASE_URL = "http://18.141.34.124:7043/api";

const PortDisruptionInfo = () => {
  const [articles, setArticles] = useState([]);
  const [newArticles, setNewArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [cities, setCities] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [lat, setLat] = useState(1.3521);
  const [lng, setLng] = useState(103.8198);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(5);
  const [expandedArticleIndex, setExpandedArticleIndex] = useState(null);

  useEffect(() => {
    fetchInitialArticles();
    fetchCities();
    fetchSuppliers();

    const queryParams = new URLSearchParams(window.location.search);
    const latParam = parseFloat(queryParams.get('lat'));
    const lngParam = parseFloat(queryParams.get('lng'));
    if (!isNaN(latParam) && !isNaN(lngParam)) {
      setLat(latParam);
      setLng(lngParam);
    }
  }, [currentPage]);

  const fetchInitialArticles = async () => {
    try {
      const url = `${BASE_URL}/articles?page=${currentPage}&size=${articlesPerPage}`;
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.$values || []);
      setDisplayedArticles(data.$values || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchNewArticles = async (from = null, to = null) => {
    try {
      let url = `${BASE_URL}/articles/articles?page=${currentPage}&size=${articlesPerPage}`;
      if (from && to) {
        url += `&fromDate=${from.toISOString()}&toDate=${to.toISOString()}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      const articles = data.values?.$values || [];
      setNewArticles(articles);
      setDisplayedArticles(articles);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/cities`);
      const data = await response.json();
      setCities(data.$values?.map(city => ({
        label: city.location,
        value: city
      })) || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/suppliers`);
      const data = await response.json();
      setSuppliers(data.$values?.map(supplier => ({
        label: supplier.bP_Name,
        value: supplier
      })) || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleCitySelect = (selectedOption) => {
    const city = selectedOption?.value;
    if (city) {
      setSelectedCity(city);
      setLat(city.latitude);
      setLng(city.longitude);
      updateQueryParams({ lat: city.latitude, lng: city.longitude });
    }
  };

  const handleSupplierSelect = (selectedOption) => {
    const supplier = selectedOption?.value;
    if (supplier) {
      setLat(supplier.lat);
      setLng(supplier.lng);
      updateQueryParams({ lat: supplier.latitude, lng: supplier.longitude });
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchNewArticles(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const handleDateChange = (dates, type) => {
    if (type === 'from') {
      setFromDate(dates[0]);
    } else {
      setToDate(dates[0]);
    }
  };

  const handleDateSearch = () => {
    if (fromDate && toDate) {
      fetchNewArticles(fromDate, toDate);
    } else {
      console.error("Please select both From Date and To Date.");
    }
  };

  const updateQueryParams = (params) => {
    const queryParams = new URLSearchParams(window.location.search);
    Object.keys(params).forEach(key => {
      queryParams.set(key, params[key]);
    });
    window.history.replaceState(null, null, `${window.location.pathname}?${queryParams.toString()}`);
  };

  const MapUpdater = ({ lat, lng }) => {
    const map = useMap();

    useEffect(() => {
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], map.getZoom());
      }
    }, [lat, lng, map]);

    return null;
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleArticleClick = (index) => {
    setExpandedArticleIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="container">
      <div className="search-box">
        <Select
          id="city-dropdown"
          options={cities}
          onChange={handleCitySelect}
          placeholder="Select a city"
          isClearable
        />
      </div>

      <div className="search-box">
        <Select
          id="supplier-dropdown"
          options={suppliers}
          onChange={handleSupplierSelect}
          placeholder="Select a supplier"
          isClearable
        />
      </div>

      <div className="date-pickers">
        <Flatpickr
          data-enable-time
          value={fromDate}
          onChange={date => handleDateChange(date, 'from')}
          placeholder="From Date"
        />
        <Flatpickr
          data-enable-time
          value={toDate}
          onChange={date => handleDateChange(date, 'to')}
          placeholder="To Date"
        />
        <button onClick={handleDateSearch}>Search</button>
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater lat={lat} lng={lng} /> 
        {displayedArticles.map((article, index) => (
          article.lat && article.lng && (
            <Circle
              key={index}
              center={[article.lat, article.lng]}
              radius={3000}
              color='red'
              fillColor='#f03'
              fillOpacity={0.5}
            >
              <Popup>{article.title}</Popup>
            </Circle>
          )
        ))}
      </MapContainer>

      <div className="article-list">
        <h2>Article List</h2>
        {displayedArticles.length > 0 ? (
          <ul>
            {displayedArticles.map((article, index) => (
              <li key={index} onClick={() => handleArticleClick(index)} className="article-item">
                <h3>{article.title}</h3>
                {expandedArticleIndex === index && (
                  <div className="article-details">
                    <p>{article.description}</p>
                    <p><strong>Location:</strong> {article.location}</p>
                    <p><strong>Date:</strong> {new Date(article.publishedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No articles found.</p>
        )}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default PortDisruptionInfo;
