// Dashboard.jsx
import React, { useState, useEffect } from "react";
import supabase from "/Users/samio_ayman/FYP-Fuelnomic/web-app/src/helper/supabaseClient.js";
import { useNavigate } from "react-router-dom";
import Sidebar from "/Users/samio_ayman/FYP-Fuelnomic/web-app/src/Components/SideBar.jsx";

function Dashboard() {
  const navigate = useNavigate();
  const [fuelPrices, setFuelPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFuelData();
  }, []);

  const fetchFuelData = async () => {
    try {
      const { data, error } = await supabase
        .from('fuel_prices')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      setFuelPrices(data || {});
    } catch (err) {
      console.error('Error fetching fuel data:', err);
      // Set default prices if no data
      setFuelPrices({
        budi95: 2.05,
        ron95: 2.15,
        ron97: 3.00,
        diesel: 2.15
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  return (
    <div className="main-content-sex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div style={{ marginRight: '70px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
              Dashboard Overview
            </h1>
            <p style={{ color: '#666' }}>
              Welcome back! Here's your system overview.
            </p>
          </div>
          <button
            onClick={signOut}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Quick Stats Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#1976d2' }}>
              4
            </div>
            <div style={{ color: '#333', fontWeight: '500', marginTop: '5px' }}>Fuel Types</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>Active configurations</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#388e3c' }}>
              RM {parseFloat(fuelPrices.budi95 || 0).toFixed(2)}
            </div>
            <div style={{ color: '#333', fontWeight: '500', marginTop: '5px' }}>Lowest Price</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>BUDI95</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#f57c00' }}>
              RM {parseFloat(fuelPrices.ron97 || 0).toFixed(2)}
            </div>
            <div style={{ color: '#333', fontWeight: '500', marginTop: '5px' }}>Highest Price</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>RON97</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#7b1fa2' }}>
              {new Date().toLocaleDateString('en-MY')}
            </div>
            <div style={{ color: '#333', fontWeight: '500', marginTop: '5px' }}>Today's Date</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>Last updated</div>
          </div>
        </div>

        {/* Fuel Prices Dashboard Section */}
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ 
            backgroundColor: '#1976d2',
            padding: '20px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Current Fuel Prices</h2>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
                  Live market prices per liter
                </p>
              </div>
              <button 
                onClick={fetchFuelData}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>↻</span> Refresh
              </button>
            </div>
          </div>
          
          <div style={{ padding: '30px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
                <p style={{ marginTop: '15px', color: '#666' }}>Loading fuel prices...</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '25px' 
              }}>
                {/* BUDI95 Card */}
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  padding: '25px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#ff6b6b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>
                        B
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: '#333', fontSize: '1.2em' }}>BUDI95</h3>
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                          Budget Fuel
                        </p>
                      </div>
                    </div>
                    <div style={{ 
                      backgroundColor: '#ffebee',
                      color: '#c62828',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85em',
                      fontWeight: 'bold'
                    }}>
                      ECONOMY
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#ff6b6b', marginBottom: '10px' }}>
                    RM {parseFloat(fuelPrices.budi95 || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    per liter
                  </div>
                </div>

                {/* RON95 Card */}
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  padding: '25px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#4ecdc4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>
                        R95
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: '#333', fontSize: '1.2em' }}>RON95</h3>
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                          Most Popular
                        </p>
                      </div>
                    </div>
                    <div style={{ 
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85em',
                      fontWeight: 'bold'
                    }}>
                      STANDARD
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#4ecdc4', marginBottom: '10px' }}>
                    RM {parseFloat(fuelPrices.ron95 || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    per liter
                  </div>
                </div>

                {/* RON97 Card */}
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  padding: '25px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#45b7d1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>
                        R97
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: '#333', fontSize: '1.2em' }}>RON97</h3>
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                          Premium
                        </p>
                      </div>
                    </div>
                    <div style={{ 
                      backgroundColor: '#fff3e0',
                      color: '#f57c00',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85em',
                      fontWeight: 'bold'
                    }}>
                      PREMIUM
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#45b7d1', marginBottom: '10px' }}>
                    RM {parseFloat(fuelPrices.ron97 || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    per liter
                  </div>
                </div>

                {/* DIESEL Card */}
                <div style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  padding: '25px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#96ceb4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>
                        D
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: '#333', fontSize: '1.2em' }}>DIESEL</h3>
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                          Commercial
                        </p>
                      </div>
                    </div>
                    <div style={{ 
                      backgroundColor: '#e8f5e9',
                      color: '#388e3c',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85em',
                      fontWeight: 'bold'
                    }}>
                      COMMERCIAL
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#96ceb4', marginBottom: '10px' }}>
                    RM {parseFloat(fuelPrices.diesel || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    per liter
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, color: '#333', marginBottom: '15px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/fuel-configuration')}
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ⛽ Edit Fuel Prices
            </button>
            <button 
              onClick={() => navigate('/user-management')}
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              👥 Manage Users
            </button>
            <button 
              onClick={() => navigate('/reports')}
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
              📊 View Reports
            </button>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Dashboard;