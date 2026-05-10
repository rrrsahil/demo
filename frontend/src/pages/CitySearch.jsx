import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/calculateBudget';
import '../css/citySearch.css';

const CitySearch = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [addingToTrip, setAddingToTrip] = useState(false);

  const loadCities = async () => {
    try {
      const res = await api.get('/cities', { params: { search, country: countryFilter } });
      setCities(res.data.cities);
      setCountries(res.data.countries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, countryFilter]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await api.post('/cities/seed');
      await loadCities();
    } catch (err) {
      alert("Failed to seed cities");
    } finally {
      setSeeding(false);
    }
  };

  const openAddModal = async (city) => {
    setSelectedCity(city);
    setShowModal(true);
    try {
      const res = await api.get('/trips');
      // Only show trips that are planning or ongoing
      setUserTrips(res.data.trips.filter(t => t.status !== 'completed'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToTrip = async () => {
    if (!selectedTripId) return;
    setAddingToTrip(true);
    
    try {
      // First get the trip
      const tripRes = await api.get(`/trips/${selectedTripId}`);
      const trip = tripRes.data.trip;

      // Append new destination
      const existingDestinations = trip.destinations || [];
      // Check if already exists
      if (existingDestinations.some(d => d.city === selectedCity.name)) {
        alert(`${selectedCity.name} is already in this trip!`);
        setAddingToTrip(false);
        return;
      }

      const updatedDestinations = [
        ...existingDestinations,
        { city: selectedCity.name, country: selectedCity.country, nights: 1 }
      ];

      // Update the trip
      await api.put(`/trips/${selectedTripId}`, {
        destinations: updatedDestinations
      });

      setShowModal(false);
      navigate(`/trips/${selectedTripId}/itinerary`);
    } catch (err) {
      alert("Failed to add city to trip");
    } finally {
      setAddingToTrip(false);
    }
  };

  return (
    <div className="city-search-wrap">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title"><i className="fas fa-globe-americas" style={{ color: 'var(--primary)', marginRight: '10px' }} />Discover Cities</h1>
        <p className="page-subtitle">Find the perfect destinations for your next adventure</p>
      </div>

      {/* Filters */}
      <div className="city-filters">
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: '250px' }}>
          <i className="fas fa-magnifying-glass input-icon" />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by city name..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div style={{ minWidth: '200px' }}>
          <select 
            className="form-select" 
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
          >
            <option value="All">All Countries</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader />
      ) : cities.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-map-location-dot" />
          <h3>No cities found</h3>
          <p>{search ? 'Try adjusting your search filters.' : 'Your city database is currently empty.'}</p>
          {!search && (
            <button className="btn btn-primary" onClick={handleSeed} disabled={seeding} style={{ marginTop: '16px' }}>
              {seeding ? <><i className="fas fa-circle-notch fa-spin" /> Seeding...</> : <><i className="fas fa-database" /> Populate Sample Cities</>}
            </button>
          )}
        </div>
      ) : (
        <div className="city-grid">
          {cities.map(city => (
            <div className="city-card" key={city._id}>
              <div className="city-card-img">
                {city.image ? <img src={city.image} alt={city.name} /> : <i className="fas fa-city" />}
                <span className="city-country-badge">{city.country}</span>
              </div>
              <div className="city-card-body">
                <h3 className="city-card-title">{city.name}</h3>
                <p className="city-card-desc">{city.description}</p>
                
                {city.tags && city.tags.length > 0 && (
                  <div className="city-tags">
                    {city.tags.map(tag => (
                      <span key={tag} className="city-tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="city-meta">
                  <div className="city-cost">
                    {formatCurrency(city.avgDailyCost)} <span>/day</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => openAddModal(city)}>
                    <i className="fas fa-plus" /> Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add to Trip Modal */}
      {showModal && selectedCity && (
        <div className="add-city-modal" onClick={() => setShowModal(false)}>
          <div className="add-city-modal-box" onClick={e => e.stopPropagation()}>
            <div className="add-city-modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Add {selectedCity.name} to Trip</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>
                <i className="fas fa-xmark" />
              </button>
            </div>
            
            <div className="add-city-modal-body">
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Select an upcoming trip to add <strong>{selectedCity.name}</strong> as a destination:
              </p>
              
              {userTrips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You don't have any active trips.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/trips/create')}>
                    Create a Trip
                  </button>
                </div>
              ) : (
                <div className="trip-select-list">
                  {userTrips.map(trip => (
                    <div 
                      key={trip._id} 
                      className={`trip-select-item ${selectedTripId === trip._id ? 'selected' : ''}`}
                      onClick={() => setSelectedTripId(trip._id)}
                    >
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{trip.tripName}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{trip.destinations?.length || 0} destinations planned</p>
                      </div>
                      {selectedTripId === trip._id && <i className="fas fa-circle-check" style={{ color: 'var(--primary)', fontSize: '18px' }} />}
                    </div>
                  ))}
                </div>
              )}
              
              {userTrips.length > 0 && (
                <button 
                  className="btn btn-primary btn-full" 
                  style={{ marginTop: '24px' }}
                  disabled={!selectedTripId || addingToTrip}
                  onClick={handleAddToTrip}
                >
                  {addingToTrip ? <><i className="fas fa-circle-notch fa-spin" /> Adding...</> : 'Add Destination'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CitySearch;
