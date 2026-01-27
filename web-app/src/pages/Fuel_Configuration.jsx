// FuelConfiguration.jsx
import React, { useState, useEffect } from 'react'
import supabase from '../helper/supabaseClient.js'
import Sidebar from '../Components/SideBar.jsx'

function FuelConfiguration() {
  const [fuelPrices, setFuelPrices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [recordId, setRecordId] = useState(null)

  useEffect(() => {
    fetchFuelData()
  }, [])

  const fetchFuelData = async () => {
    try {
      setLoading(true)
      // Get all records
      const { data, error } = await supabase
        .from('fuel_prices')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      
      console.log('Fetched data:', data) // Debug log
      
      if (data && data.length > 0) {
        // Get the most recent record
        const latestRecord = data[0]
        console.log('Latest record:', latestRecord) // Debug log
        
        setFuelPrices(latestRecord)
        setEditData(latestRecord)
        setRecordId(latestRecord.id)
      } else {
        // If no data exists, create default structure
        const defaultData = {
          budi95: 0.00,
          ron95: 0.00,
          ron97: 0.00,
          diesel: 0.00
        }
        console.log('No data, using default:', defaultData) // Debug log
        setFuelPrices(defaultData)
        setEditData(defaultData)
      }
    } catch (err) {
      console.error('Error fetching fuel data:', err)
      setError(err.message)
      
      // Set default data on error
      const defaultData = {
        budi95: 0.00,
        ron95: 0.00,
        ron97: 0.00,
        diesel: 0.00
      }
      setFuelPrices(defaultData)
      setEditData(defaultData)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setEditData({ ...fuelPrices })
  }

  const handleSave = async () => {
    try {
      console.log('Saving data:', editData) // Debug log
      
      // Prepare update data - only include the columns that exist
      const updateData = {
        budi95: parseFloat(editData.budi95) || 0,
        ron95: parseFloat(editData.ron95) || 0,
        ron97: parseFloat(editData.ron97) || 0,
        diesel: parseFloat(editData.diesel) || 0
      }
      
      console.log('Update data:', updateData) // Debug log
      
      let result
      
      if (recordId) {
        // Update existing record
        console.log('Updating record ID:', recordId) // Debug log
        result = await supabase
          .from('fuel_prices')
          .update(updateData)
          .eq('id', recordId)
      } else {
        // Insert new record
        console.log('Inserting new record') // Debug log
        result = await supabase
          .from('fuel_prices')
          .insert([updateData])
          .select()
          
        // Get the new record ID
        if (result.data && result.data.length > 0) {
          setRecordId(result.data[0].id)
        }
      }

      console.log('Save result:', result) // Debug log
      
      if (result.error) throw result.error

      setFuelPrices({ 
        ...editData,
        budi95: parseFloat(editData.budi95) || 0,
        ron95: parseFloat(editData.ron95) || 0,
        ron97: parseFloat(editData.ron97) || 0,
        diesel: parseFloat(editData.diesel) || 0
      })
      setEditing(false)
      alert('Fuel prices updated successfully!')
      
      // Refresh data
      fetchFuelData()
    } catch (err) {
      console.error('Save error details:', err) // Debug log
      alert(`Error saving fuel prices: ${err.message}`)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setEditData({ ...fuelPrices })
  }

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Debug function to check table structure
  const checkTableStructure = async () => {
    try {
      console.log('Checking table structure...')
      const { data, error } = await supabase
        .from('fuel_prices')
        .select('*')
        .limit(1)
      
      if (error) {
        console.error('Structure check error:', error)
      } else if (data && data.length > 0) {
        console.log('First record structure:', data[0])
        console.log('Columns:', Object.keys(data[0]))
      } else {
        console.log('Table is empty')
      }
    } catch (err) {
      console.error('Structure check failed:', err)
    }
  }

  // Run structure check on mount
  useEffect(() => {
    checkTableStructure()
  }, [])

  if (loading) return (
    <div className="main-content-sex">
      <Sidebar />
      <div style={{ padding: '20px'}}>
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
      <div style={{ padding: '20px', marginRight: '150px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>
          Fuel Configuration
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Set current fuel prices for all fuel types
        </p>

        {/* Debug button - remove in production */}
        {/* <button 
          onClick={checkTableStructure}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.8em'
          }}
        >
          Debug Table Structure
        </button> */}

        {error && (
          <div style={{ 
            backgroundColor: '#ffebee',
            border: '1px solid #ef5350',
            color: '#c62828',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <p><strong>Error:</strong> {error}</p>
            <button 
              onClick={fetchFuelData}
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#ef5350',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '10px'
              }}
            >
              Retry
            </button>
          </div>
        )}

        <div style={{ 
          maxWidth: '800px',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            backgroundColor: '#1976d2',
            padding: '20px',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              {editing ? 'Edit Fuel Prices' : 'Current Fuel Prices'}
            </h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
              Price per liter in Malaysian Ringgit (RM)
            </p>
          </div>
          
          <div style={{ padding: '30px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '25px' 
            }}>
              {/* BUDI95 */}
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ff6b6b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: '15px'
                  }}>
                    B
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#333' }}>BUDI95</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                      Budget 95 Octane
                    </p>
                  </div>
                </div>
                
                {editing ? (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                      Price per liter (RM)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold' }}>RM</span>
                      <input
                        type="number"
                        step="0.01"
                        value={editData.budi95 || ''}
                        onChange={(e) => handleChange('budi95', e.target.value)}
                        style={{ 
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '1.1em',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>
                      Current Price
                    </div>
                    <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#1976d2' }}>
                      RM {parseFloat(fuelPrices.budi95 || 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* RON95 */}
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#4ecdc4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: '15px'
                  }}>
                    R95
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#333' }}>RON95</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                      Regular 95 Octane
                    </p>
                  </div>
                </div>
                
                {editing ? (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                      Price per liter (RM)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold' }}>RM</span>
                      <input
                        type="number"
                        step="0.01"
                        value={editData.ron95 || ''}
                        onChange={(e) => handleChange('ron95', e.target.value)}
                        style={{ 
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '1.1em',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>
                      Current Price
                    </div>
                    <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#1976d2' }}>
                      RM {parseFloat(fuelPrices.ron95 || 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* RON97 */}
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#45b7d1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: '15px'
                  }}>
                    R97
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#333' }}>RON97</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                      Premium 97 Octane
                    </p>
                  </div>
                </div>
                
                {editing ? (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                      Price per liter (RM)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold' }}>RM</span>
                      <input
                        type="number"
                        step="0.01"
                        value={editData.ron97 || ''}
                        onChange={(e) => handleChange('ron97', e.target.value)}
                        style={{ 
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '1.1em',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>
                      Current Price
                    </div>
                    <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#1976d2' }}>
                      RM {parseFloat(fuelPrices.ron97 || 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* DIESEL */}
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#96ceb4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: '15px'
                  }}>
                    D
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#333' }}>DIESEL</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                      Regular Diesel
                    </p>
                  </div>
                </div>
                
                {editing ? (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                      Price per liter (RM)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold' }}>RM</span>
                      <input
                        type="number"
                        step="0.01"
                        value={editData.diesel || ''}
                        onChange={(e) => handleChange('diesel', e.target.value)}
                        style={{ 
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: '100%',
                          fontSize: '1.1em',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>
                      Current Price
                    </div>
                    <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#1976d2' }}>
                      RM {parseFloat(fuelPrices.diesel || 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              marginTop: '40px', 
              paddingTop: '20px', 
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>
                  {recordId ? 'Record ID:' : 'Status:'}
                </div>
                <div style={{ fontSize: '1em', fontWeight: '500' }}>
                  {recordId ? recordId.substring(0, 8) + '...' : 'No record found'}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {editing ? (
                  <>
                    <button 
                      onClick={handleCancel}
                      style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={fetchFuelData}
                      style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>↻</span> Refresh
                    </button>
                    <button 
                      onClick={handleEdit}
                      style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Edit Prices
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginTop: '30px'
        }}>
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #bbdefb',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#1976d2' }}>
              RM {parseFloat(fuelPrices.ron95 || 0).toFixed(2)}
            </div>
            <div style={{ color: '#1976d2', fontWeight: '500', marginTop: '5px' }}>RON95</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>Most Popular</div>
          </div>
          
          <div style={{
            backgroundColor: '#e8f5e9',
            border: '1px solid #c8e6c9',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#388e3c' }}>
              RM {parseFloat(fuelPrices.budi95 || 0).toFixed(2)}
            </div>
            <div style={{ color: '#388e3c', fontWeight: '500', marginTop: '5px' }}>BUDI95</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>Most Affordable</div>
          </div>
          
          <div style={{
            backgroundColor: '#fff3e0',
            border: '1px solid #ffccbc',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#f57c00' }}>
              RM {parseFloat(fuelPrices.ron97 || 0).toFixed(2)}
            </div>
            <div style={{ color: '#f57c00', fontWeight: '500', marginTop: '5px' }}>RON97</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>Premium Fuel</div>
          </div>
          
          <div style={{
            backgroundColor: '#f3e5f5',
            border: '1px solid #e1bee7',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#7b1fa2' }}>
              RM {parseFloat(fuelPrices.diesel || 0).toFixed(2)}
            </div>
            <div style={{ color: '#7b1fa2', fontWeight: '500', marginTop: '5px' }}>DIESEL</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>Commercial</div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}</style>
      </div>
    </div>
  )
}

export default FuelConfiguration