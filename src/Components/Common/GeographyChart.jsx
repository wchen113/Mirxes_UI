import axios from 'axios';
import { useEffect, useState } from 'react';
import { Circle, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../DataContext';

const MapComponent = () => {
  const navigate = useNavigate();
  const { suppliers, setSuppliers, events, setEvents, setSelectedSupplier, setArticles } = useDataContext();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (suppliers.length === 0) {
      axios.get('http://18.141.34.124:7043/api/suppliers')
        .then(response => {
          console.log('Suppliers Response:', response);
          const data = response.$values || []; // Ensure response.data is used
          setSuppliers(data);
        })
        .catch(error => {
          console.error('Error fetching suppliers', error);
          setError('Error fetching suppliers');
        });
    }
  }, [suppliers, setSuppliers]);

  const handleCircleClick = (lat, lng) => {
    console.log('Supplier Clicked - Lat:', lat, 'Lng:', lng);
    setSelectedSupplier({ lat, lng });
    axios.get(`http://18.141.34.124:7043/api/Articles/nearby?lat=${lat}&lng=${lng}&radius=5000`)
      .then(response => {
        console.log('Full Events Response:', response);
        const data = response.$values || []; 
        setArticles(data); 
        navigate(`/portdisruptioninfonew?lat=${lat}&lng=${lng}`);
      })
      .catch(error => {
        console.error('Error fetching events', error);
        setError('Error fetching events');
      });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <MapContainer center={[1.3521, 103.8198]} zoom={12} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {suppliers.map(supplier => (
          <Circle
            key={supplier.id}
            center={[supplier.lat || 0, supplier.lng || 0]}
            radius={supplier.radius || 500}
            color="green"
            eventHandlers={{
              click: () => handleCircleClick(supplier.lat, supplier.lng),
            }}
          >
            <Popup>
              <div>
                <h3>{supplier.bP_Name}</h3>
                <p><strong>Address:</strong> {supplier.address_1} {supplier.address_2} {supplier.address_3} {supplier.address_4}</p>
              </div>
            </Popup>
          </Circle>
        ))}
        {Array.isArray(events) && events.length > 0 ? (
          events.map(event => (
            <Circle
              key={event.id}
              center={[event.lat || 0, event.lng || 0]}
              radius={500}
              color="red"
              eventHandlers={{
                click: () => console.log(`Event clicked: ${event.title}`),
              }}
            >
              <Popup>
                <div>
                  <h6>{event.title}</h6>
                  <p>{event.description}</p>
                  <p><strong>Date:</strong> {event.created_At}</p>
                </div>
              </Popup>
            </Circle>
          ))
        ) : (
          <div>No events available.</div>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
