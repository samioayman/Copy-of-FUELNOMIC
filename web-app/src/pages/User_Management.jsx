import React, { useState, useEffect } from 'react'
import supabase from '/Users/samio_ayman/FYP-Fuelnomic/web-app/src/helper/supabaseClient.js'
import Sidebar from '/Users/samio_ayman/FYP-Fuelnomic/web-app/src/Components/SideBar.jsx'

function UserManagement() {
  const [adminData, setAdminData] = useState([])
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSecond, setLoadingSecond] = useState(true)
  const [error, setError] = useState(null)
  const [errorSecond, setErrorSecond] = useState(null)
  
  // Admin table editing states
  const [editingAdminId, setEditingAdminId] = useState(null)
  const [editingAdminData, setEditingAdminData] = useState({})
  
  // User table editing states
  const [editingUserId, setEditingUserId] = useState(null)
  const [editingUserData, setEditingUserData] = useState({})

  useEffect(() => {
    fetchAdminData()
    fetchUserData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const { data: fetchedData, error } = await supabase
        .from('admin_profiles')
        .select('id, name, email, role, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAdminData(fetchedData || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      setLoadingSecond(true)
      const { data: fetchedData, error } = await supabase
        .from('profiles')
        .select('id, full_name, residency_status, mykad_number, eligibility_status, verification_status, email, created_at')
        .not('full_name', 'is', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUserData(fetchedData || [])
    } catch (err) {
      setErrorSecond(err.message)
      console.error('Error fetching user data:', err)
    } finally {
      setLoadingSecond(false)
    }
  }

  // ADMIN TABLE FUNCTIONS
  const handleAdminEdit = (admin) => {
    setEditingAdminId(admin.id)
    setEditingAdminData({ ...admin })
  }

  const handleAdminSave = async (id) => {
    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update({
          name: editingAdminData.name,
          email: editingAdminData.email,
          role: editingAdminData.role
        })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setAdminData(adminData.map(admin => 
        admin.id === id ? { ...admin, ...editingAdminData } : admin
      ))
      setEditingAdminId(null)
      setEditingAdminData({})
    } catch (err) {
      alert(`Error updating admin: ${err.message}`)
    }
  }

  const handleAdminCancel = () => {
    setEditingAdminId(null)
    setEditingAdminData({})
  }

  const handleAdminDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return
    
    try {
      const { error } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state
      setAdminData(adminData.filter(admin => admin.id !== id))
    } catch (err) {
      alert(`Error deleting admin: ${err.message}`)
    }
  }

  // USER TABLE FUNCTIONS
  const handleUserEdit = (user) => {
    setEditingUserId(user.id)
    setEditingUserData({ ...user })
  }

  const handleUserSave = async (id) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editingUserData.full_name,
          email: editingUserData.email,
          residency_status: editingUserData.residency_status,
          eligibility_status: editingUserData.eligibility_status,
          verification_status: editingUserData.verification_status
        })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setUserData(userData.map(user => 
        user.id === id ? { ...user, ...editingUserData } : user
      ))
      setEditingUserId(null)
      setEditingUserData({})
    } catch (err) {
      alert(`Error updating user: ${err.message}`)
    }
  }

  const handleUserCancel = () => {
    setEditingUserId(null)
    setEditingUserData({})
  }

  const handleUserDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state
      setUserData(userData.filter(user => user.id !== id))
    } catch (err) {
      alert(`Error deleting user: ${err.message}`)
    }
  }

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
      <div style={{ padding: '20px', marginRight: '50px' }}>
        <h1>User Management</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Managing admin and user profiles from Supabase
        </p>
        
        {/* Refresh Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <button 
            onClick={fetchAdminData} 
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
            <span>↻</span> Refresh Admin Data
          </button>
          <button 
            onClick={fetchUserData} 
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
            <span>↻</span> Refresh User Data
          </button>
        </div>

        {/* Two Tables in Vertical Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateRows: 'auto auto', 
          gap: '40px' 
        }}>
          
          {/* First Table - Admin Profiles */}
          <div style={{ 
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '15px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <h2 style={{ margin: 0, color: '#333' }}>Admin Profiles</h2>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                Total Admins: {adminData.length}
              </p>
            </div>
            
            <div style={{ padding: '20px' }}>
              {error ? (
                <div style={{ color: '#dc3545', padding: '20px', textAlign: 'center' }}>
                  <p>Error loading admin data: {error}</p>
                  <button 
                    onClick={fetchAdminData}
                    style={{ 
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      marginTop: '10px'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : adminData.length === 0 ? (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  border: '2px dashed #ddd',
                  borderRadius: '5px'
                }}>
                  <h3>No Admin Profiles Found</h3>
                  <p>Add admin profiles to see them here.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Created At</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData.map((item, index) => (
                        <tr key={item.id} style={{ 
                          backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                          borderBottom: '1px solid #eee'
                        }}>
                          <td style={{ padding: '12px' }}>
                            {editingAdminId === item.id ? (
                              <input
                                type="text"
                                value={editingAdminData.name || ''}
                                onChange={(e) => setEditingAdminData({...editingAdminData, name: e.target.value})}
                                style={{ 
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  width: '100%'
                                }}
                              />
                            ) : (
                              item.name || 'N/A'
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {editingAdminId === item.id ? (
                              <input
                                type="email"
                                value={editingAdminData.email || ''}
                                onChange={(e) => setEditingAdminData({...editingAdminData, email: e.target.value})}
                                style={{ 
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  width: '100%'
                                }}
                              />
                            ) : (
                              item.email || 'N/A'
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {editingAdminId === item.id ? (
                              <select
                                value={editingAdminData.role || ''}
                                onChange={(e) => setEditingAdminData({...editingAdminData, role: e.target.value})}
                                style={{ 
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  width: '100%'
                                }}
                              >
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="moderator">Moderator</option>
                              </select>
                            ) : (
                              <span style={{
                                backgroundColor: item.role === 'admin' ? '#e3f2fd' : 
                                              item.role === 'super_admin' ? '#f3e5f5' : '#e8f5e9',
                                color: item.role === 'admin' ? '#1976d2' : 
                                      item.role === 'super_admin' ? '#7b1fa2' : '#2e7d32',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.85em'
                              }}>
                                {item.role || 'N/A'}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                            {editingAdminId === item.id ? (
                              <>
                                <button 
                                  onClick={() => handleAdminSave(item.id)}
                                  style={{ 
                                    padding: '6px 12px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginRight: '8px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={handleAdminCancel}
                                  style={{ 
                                    padding: '6px 12px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleAdminEdit(item)}
                                  style={{ 
                                    padding: '6px 12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginRight: '8px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleAdminDelete(item.id)}
                                  style={{ 
                                    padding: '6px 12px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Second Table - User Profiles */}
          <div style={{ 
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '15px 20px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#333' }}>User Profiles</h2>
                {loadingSecond && (
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                )}
              </div>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                Total Users: {userData.length}
              </p>
            </div>
            
            <div style={{ padding: '20px' }}>
              {errorSecond ? (
                <div style={{ color: '#dc3545', padding: '20px', textAlign: 'center' }}>
                  <p>Error loading user data: {errorSecond}</p>
                  <button 
                    onClick={fetchUserData}
                    style={{ 
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      marginTop: '10px'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : userData.length === 0 ? (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  border: '2px dashed #ddd',
                  borderRadius: '5px'
                }}>
                  <h3>No User Profiles Found</h3>
                  <p>Change 'user_profiles' to your actual table name in the code.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Full Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Residency Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>MyKad Number</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Eligibility Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Verification Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Created At</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.map((item, index) => (
                        <tr key={item.id} style={{ 
                          backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                          borderBottom: '1px solid #eee'
                        }}>
                          <td style={{ padding: '12px' }}>
                            {editingUserId === item.id ? (
                              <input
                                type="text"
                                value={editingUserData.full_name || ''}
                                onChange={(e) => setEditingUserData({...editingUserData, full_name: e.target.value})}
                                style={{ 
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  width: '100%'
                                }}
                              />
                            ) : (
                              item.full_name || 'N/A'
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {editingUserId === item.id ? (
                              <input
                                type="email"
                                value={editingUserData.email || ''}
                                onChange={(e) => setEditingUserData({...editingUserData, email: e.target.value})}
                                style={{ 
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  width: '100%'
                                }}
                              />
                            ) : (
                              item.email || 'N/A'
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {editingUserId === item.id ? (
                              <select
                                value={editingUserData.residency_status || ''}
                                onChange={(e) => setEditingUserData({...editingUserData, residency_status: e.target.value})}
                                style={{ 
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  width: '100%'
                                }}
                              >
                                <option value="resident">Resident</option>
                                <option value="non-resident">Non-Resident</option>
                              </select>
                            ) : (
                              <span style={{
                                backgroundColor: item.residency_status === 'resident' ? '#e8f5e9' : 
                                              item.residency_status === 'non-resident' ? '#ffebee' : '#f5f5f5',
                                color: item.residency_status === 'resident' ? '#2e7d32' : 
                                      item.residency_status === 'non-resident' ? '#c62828' : '#616161',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.85em'
                              }}>
                                {item.residency_status || 'N/A'}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                            {item.mykad_number || 'N/A'}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {editingUserId === item.id ? (
                              <select
                                value={editingUserData.eligibility_status || ''}
                                onChange={(e) => setEditingUserData({...editingUserData, eligibility_status: e.target.value})}
                                style={{ 
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  width: '100%'
                                }}
                              >
                                <option value="eligible">Eligible</option>
                                <option value="not-eligible">Not Eligible</option>
                                <option value="pending">Pending</option>
                              </select>
                            ) : (
                              <span style={{
                                backgroundColor: item.eligibility_status === 'eligible' ? '#e8f5e9' : 
                                              item.eligibility_status === 'not-eligible' ? '#ffebee' : '#fff3cd',
                                color: item.eligibility_status === 'eligible' ? '#2e7d32' : 
                                      item.eligibility_status === 'not-eligible' ? '#c62828' : '#856404',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.85em',
                                fontWeight: 'bold'
                              }}>
                                {item.eligibility_status ? item.eligibility_status.toUpperCase() : 'N/A'}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {editingUserId === item.id ? (
                              <select
                                value={editingUserData.verification_status || ''}
                                onChange={(e) => setEditingUserData({...editingUserData, verification_status: e.target.value})}
                                style={{ 
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  width: '100%'
                                }}
                              >
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            ) : (
                              <span style={{
                                backgroundColor: item.verification_status === 'verified' ? '#e8f5e9' : 
                                              item.verification_status === 'pending' ? '#fff3cd' : 
                                              item.verification_status === 'rejected' ? '#ffebee' : '#f5f5f5',
                                color: item.verification_status === 'verified' ? '#2e7d32' : 
                                      item.verification_status === 'pending' ? '#856404' : 
                                      item.verification_status === 'rejected' ? '#c62828' : '#616161',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.85em'
                              }}>
                                {item.verification_status ? item.verification_status.charAt(0).toUpperCase() + item.verification_status.slice(1) : 'N/A'}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                            {editingUserId === item.id ? (
                              <>
                                <button 
                                  onClick={() => handleUserSave(item.id)}
                                  style={{ 
                                    padding: '6px 12px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginRight: '8px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={handleUserCancel}
                                  style={{ 
                                    padding: '6px 12px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleUserEdit(item)}
                                  style={{ 
                                    padding: '6px 12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginRight: '8px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleUserDelete(item.id)}
                                  style={{ 
                                    padding: '6px 12px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          tr:hover {
            background-color: #f0f0f0 !important;
            transition: background-color 0.2s;
          }
          table {
            min-width: 1400px;
          }
          input, select {
            font-size: 14px;
          }
        `}</style>
      </div>
    </div>
  )
}

export default UserManagement