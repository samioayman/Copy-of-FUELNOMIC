// StationManagement.jsx
import React, { useState, useEffect } from 'react'
import supabase from '/Users/samio_ayman/FYP-Fuelnomic/web-app/src/helper/supabaseClient.js'
import Sidebar from '/Users/samio_ayman/FYP-Fuelnomic/web-app/src/Components/SideBar.jsx'

function StationManagement() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStation, setNewStation] = useState({
    station_name: '',
    station_code: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    phone_number: '',
    email: '',
    manager_name: '',
    opening_time: '06:00',
    closing_time: '22:00',
    latitude: '',
    longitude: '',
    is_active: true
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filterState, setFilterState] = useState('')
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])

  useEffect(() => {
    fetchStations()
  }, [])

  const fetchStations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('fuel_stations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setStations(data || [])
      
      // Extract unique cities and states for filters
      const uniqueCities = [...new Set(data?.map(station => station.city).filter(Boolean) || [])]
      const uniqueStates = [...new Set(data?.map(station => station.state).filter(Boolean) || [])]
      setCities(uniqueCities)
      setStates(uniqueStates)
      
    } catch (err) {
      console.error('Error fetching stations:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (station) => {
    setEditingId(station.id)
    setEditData({ ...station })
    setShowAddForm(false)
  }

  const handleSave = async (id) => {
    try {
      const { error } = await supabase
        .from('fuel_stations')
        .update({
          ...editData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setStations(stations.map(station => 
        station.id === id ? { ...station, ...editData } : station
      ))
      setEditingId(null)
      setEditData({})
      alert('Station updated successfully!')
    } catch (err) {
      alert(`Error updating station: ${err.message}`)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
    setShowAddForm(false)
    setNewStation({
      station_name: '',
      station_code: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      phone_number: '',
      email: '',
      manager_name: '',
      opening_time: '06:00',
      closing_time: '22:00',
      latitude: '',
      longitude: '',
      is_active: true
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this station?')) return
    
    try {
      const { error } = await supabase
        .from('fuel_stations')
        .delete()
        .eq('id', id)

      if (error) throw error

      setStations(stations.filter(station => station.id !== id))
      alert('Station deleted successfully!')
    } catch (err) {
      alert(`Error deleting station: ${err.message}`)
    }
  }

  const handleAdd = async () => {
    try {
      const { data, error } = await supabase
        .from('fuel_stations')
        .insert([{
          ...newStation,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error

      setStations([data[0], ...stations])
      setShowAddForm(false)
      setNewStation({
        station_name: '',
        station_code: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        phone_number: '',
        email: '',
        manager_name: '',
        opening_time: '06:00',
        closing_time: '22:00',
        latitude: '',
        longitude: '',
        is_active: true
      })
      alert('Station added successfully!')
      fetchStations() // Refresh to update filters
    } catch (err) {
      alert(`Error adding station: ${err.message}`)
    }
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNewStationChange = (field, value) => {
    setNewStation(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Filter stations
  const filteredStations = stations.filter(station => {
    const matchesSearch = searchTerm === '' || 
      station.station_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.station_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.manager_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCity = filterCity === '' || station.city === filterCity
    const matchesState = filterState === '' || station.state === filterState
    
    return matchesSearch && matchesCity && matchesState
  })

  if (loading) return (
    <div className="main-content-sex">
      <Sidebar />
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px' 
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="main-content-sex">
      <Sidebar />
      
      <div style={{ padding: '20px' , marginRight: '50px'}}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '5px', color: '#1a237e' }}>
              Station Management
            </h1>
            <p style={{ color: '#666', fontSize: '1.1em' }}>
              Manage all fuel stations in your network
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={fetchStations}
              style={{ 
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500',
                fontSize: '0.95em'
              }}
            >
              <span>↻</span> Refresh
            </button>
            
            <button 
              onClick={() => setShowAddForm(true)}
              style={{ 
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500',
                fontSize: '0.95em'
              }}
            >
              <span style={{ fontSize: '1.2em' }}>+</span> Add New Station
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-20px', 
              right: '-20px', 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '50%',
              opacity: 0.3
            }}></div>
            <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#1976d2', marginBottom: '10px' }}>
              {stations.length}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Total Stations</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>In network</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-20px', 
              right: '-20px', 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#e8f5e9', 
              borderRadius: '50%',
              opacity: 0.3
            }}></div>
            <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#388e3c', marginBottom: '10px' }}>
              {stations.filter(s => s.is_active).length}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Active Stations</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>Currently operating</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-20px', 
              right: '-20px', 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#fff3e0', 
              borderRadius: '50%',
              opacity: 0.3
            }}></div>
            <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#f57c00', marginBottom: '10px' }}>
              {states.length}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>States Covered</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>Geographical coverage</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-20px', 
              right: '-20px', 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#f3e5f5', 
              borderRadius: '50%',
              opacity: 0.3
            }}></div>
            <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#7b1fa2', marginBottom: '10px' }}>
              {cities.length}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Cities Covered</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>Urban locations</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Search Stations
              </label>
              <input
                type="text"
                placeholder="Search by name, code, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1em',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Filter by City
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1em',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Filter by State
              </label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1em',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #eee'
          }}>
            <div style={{ color: '#666', fontSize: '0.9em' }}>
              Showing {filteredStations.length} of {stations.length} stations
            </div>
            <div>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setFilterCity('')
                  setFilterState('')
                }}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Add New Station Form */}
        {showAddForm && (
          <div style={{ 
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#333', fontSize: '1.5em' }}>
              Add New Station
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px',
              marginBottom: '25px'
            }}>
              {/* Station Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Station Name *
                </label>
                <input
                  type="text"
                  value={newStation.station_name}
                  onChange={(e) => handleNewStationChange('station_name', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Enter station name"
                />
              </div>
              
              {/* Station Code */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Station Code *
                </label>
                <input
                  type="text"
                  value={newStation.station_code}
                  onChange={(e) => handleNewStationChange('station_code', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="e.g., STN001"
                />
              </div>
              
              {/* Address */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Address *
                </label>
                <input
                  type="text"
                  value={newStation.address}
                  onChange={(e) => handleNewStationChange('address', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Full address"
                />
              </div>
              
              {/* City & State */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  City *
                </label>
                <input
                  type="text"
                  value={newStation.city}
                  onChange={(e) => handleNewStationChange('city', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="City"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  State *
                </label>
                <input
                  type="text"
                  value={newStation.state}
                  onChange={(e) => handleNewStationChange('state', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="State"
                />
              </div>
              
              {/* Contact Info */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newStation.phone_number}
                  onChange={(e) => handleNewStationChange('phone_number', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Phone number"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newStation.email}
                  onChange={(e) => handleNewStationChange('email', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Email address"
                />
              </div>
              
              {/* Manager & Hours */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Manager Name
                </label>
                <input
                  type="text"
                  value={newStation.manager_name}
                  onChange={(e) => handleNewStationChange('manager_name', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Manager name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Opening Hours
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="time"
                    value={newStation.opening_time}
                    onChange={(e) => handleNewStationChange('opening_time', e.target.value)}
                    style={{ 
                      flex: 1,
                      padding: '12px 15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center' }}>to</span>
                  <input
                    type="time"
                    value={newStation.closing_time}
                    onChange={(e) => handleNewStationChange('closing_time', e.target.value)}
                    style={{ 
                      flex: 1,
                      padding: '12px 15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  />
                </div>
              </div>
              
              {/* Status */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Status
                </label>
                <select
                  value={newStation.is_active}
                  onChange={(e) => handleNewStationChange('is_active', e.target.value === 'true')}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button 
                onClick={handleCancel}
                style={{ 
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                style={{ 
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Add Station
              </button>
            </div>
          </div>
        )}

        {/* Stations Table */}
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '20px 25px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <h3 style={{ margin: 0, color: '#333', fontSize: '1.3em' }}>
              Stations List
            </h3>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '1200px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '600', color: '#333' }}>Station</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '600', color: '#333' }}>Location</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '600', color: '#333' }}>Contact</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '600', color: '#333' }}>Hours</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '600', color: '#333' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: '600', color: '#333' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                      {stations.length === 0 ? 'No stations found. Add your first station!' : 'No stations match your filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredStations.map((station) => (
                    <tr key={station.id} style={{ 
                      borderBottom: '1px solid #eee',
                      backgroundColor: editingId === station.id ? '#f0f7ff' : 'white',
                      transition: 'background-color 0.2s'
                    }}>
                      {/* Station Info */}
                      <td style={{ padding: '15px', verticalAlign: 'top' }}>
                        {editingId === station.id ? (
                          <>
                            <div style={{ marginBottom: '10px' }}>
                              <input
                                type="text"
                                value={editData.station_name || ''}
                                onChange={(e) => handleInputChange('station_name', e.target.value)}
                                style={{ 
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '6px',
                                  fontSize: '1em'
                                }}
                                placeholder="Station Name"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={editData.station_code || ''}
                                onChange={(e) => handleInputChange('station_code', e.target.value)}
                                style={{ 
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '6px',
                                  fontSize: '0.9em',
                                  backgroundColor: '#f8f9fa'
                                }}
                                placeholder="Station Code"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontWeight: '600', fontSize: '1.1em', color: '#333', marginBottom: '5px' }}>
                              {station.station_name}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#666', backgroundColor: '#f8f9fa', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                              {station.station_code}
                            </div>
                            {station.manager_name && (
                              <div style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>
                                Manager: {station.manager_name}
                              </div>
                            )}
                          </>
                        )}
                      </td>
                      
                      {/* Location */}
                      <td style={{ padding: '15px', verticalAlign: 'top' }}>
                        {editingId === station.id ? (
                          <>
                            <div style={{ marginBottom: '10px' }}>
                              <input
                                type="text"
                                value={editData.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                style={{ 
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '6px',
                                  fontSize: '1em'
                                }}
                                placeholder="Address"
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <input
                                type="text"
                                value={editData.city || ''}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                style={{ 
                                  flex: 1,
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '6px',
                                  fontSize: '1em'
                                }}
                                placeholder="City"
                              />
                              <input
                                type="text"
                                value={editData.state || ''}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                style={{ 
                                  flex: 1,
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '6px',
                                  fontSize: '1em'
                                }}
                                placeholder="State"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ color: '#666', marginBottom: '5px' }}>
                              {station.address}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#888' }}>
                              {station.city}, {station.state}
                              {station.postal_code && ` - ${station.postal_code}`}
                            </div>
                          </>
                        )}
                      </td>
                      
                      {/* Contact */}
                      <td style={{ padding: '15px', verticalAlign: 'top' }}>
                        {editingId === station.id ? (
                          <>
                            <div style={{ marginBottom: '10px' }}>
                              <input
                                type="text"
                                value={editData.phone_number || ''}
                                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                style={{ 
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '6px',
                                  fontSize: '1em'
                                }}
                                placeholder="Phone"
                              />
                            </div>
                            <div>
                              <input
                                type="email"
                                value={editData.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                style={{ 
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: '1px solid #ddd',
                                  borderRadius: '6px',
                                  fontSize: '1em'
                                }}
                                placeholder="Email"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {station.phone_number && (
                              <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontSize: '0.9em', color: '#666' }}>Phone:</div>
                                <div style={{ fontWeight: '500' }}>{station.phone_number}</div>
                              </div>
                            )}
                            {station.email && (
                              <div>
                                <div style={{ fontSize: '0.9em', color: '#666' }}>Email:</div>
                                <div style={{ fontSize: '0.9em' }}>{station.email}</div>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                      
                      {/* Hours */}
                      <td style={{ padding: '15px', verticalAlign: 'top' }}>
                        {editingId === station.id ? (
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="time"
                              value={editData.opening_time || ''}
                              onChange={(e) => handleInputChange('opening_time', e.target.value)}
                              style={{ 
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1em'
                              }}
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={editData.closing_time || ''}
                              onChange={(e) => handleInputChange('closing_time', e.target.value)}
                              style={{ 
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1em'
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            <div style={{ fontWeight: '500', marginBottom: '5px' }}>
                              {station.opening_time?.substring(0, 5)} - {station.closing_time?.substring(0, 5)}
                            </div>
                            <div style={{ fontSize: '0.85em', color: '#666' }}>
                              Daily
                            </div>
                          </>
                        )}
                      </td>
                      
                      {/* Status */}
                      <td style={{ padding: '15px', verticalAlign: 'top' }}>
                        {editingId === station.id ? (
                          <select
                            value={editData.is_active}
                            onChange={(e) => handleInputChange('is_active', e.target.value === 'true')}
                            style={{ 
                              padding: '8px 12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '1em',
                              width: '100%'
                            }}
                          >
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </select>
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85em',
                            fontWeight: '600',
                            backgroundColor: station.is_active ? '#e8f5e9' : '#ffebee',
                            color: station.is_active ? '#2e7d32' : '#c62828'
                          }}>
                            {station.is_active ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      
                      {/* Actions */}
                      <td style={{ padding: '15px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        {editingId === station.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button 
                              onClick={() => handleSave(station.id)}
                              style={{ 
                                padding: '8px 16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9em',
                                fontWeight: '500'
                              }}
                            >
                              Save
                            </button>
                            <button 
                              onClick={handleCancel}
                              style={{ 
                                padding: '8px 16px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9em',
                                fontWeight: '500'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button 
                              onClick={() => handleEdit(station)}
                              style={{ 
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9em',
                                fontWeight: '500'
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(station.id)}
                              style={{ 
                                padding: '8px 16px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9em',
                                fontWeight: '500'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          color: '#666',
          fontSize: '0.9em'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <strong>Total Stations:</strong> {stations.length} | 
              <strong> Active:</strong> {stations.filter(s => s.is_active).length} | 
              <strong> Inactive:</strong> {stations.filter(s => !s.is_active).length}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date().toLocaleString('en-MY')}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          tr:hover {
            background-color: #f8f9fa !important;
          }
        `}</style>
      </div>
    </div>
  )
}

export default StationManagement