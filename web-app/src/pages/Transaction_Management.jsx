// Transaction_Management.jsx (without PDF/Excel export)
import React, { useState, useEffect } from 'react'
import supabase from '../helper/supabaseClient.js'
import Sidebar from '../Components/SideBar.jsx'

function TransactionManagement() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [filters, setFilters] = useState({
    transactionId: '',
    stationCode: '',
    fuelType: '',
    paymentStatus: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: ''
  })
  
  // Statistics
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    totalVolume: 0,
    todayTransactions: 0,
    pendingPayments: 0
  })

  useEffect(() => {
    fetchTransactions()
    fetchStats()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
        .limit(100)

      // Apply date filter if set
      if (dateRange.startDate && dateRange.endDate) {
        query = query
          .gte('transaction_date', `${dateRange.startDate}T00:00:00`)
          .lte('transaction_date', `${dateRange.endDate}T23:59:59`)
      }

      // Apply other filters
      if (filters.transactionId) {
        query = query.ilike('transaction_id', `%${filters.transactionId}%`)
      }
      if (filters.stationCode) {
        query = query.ilike('station_code', `%${filters.stationCode}%`)
      }
      if (filters.fuelType && filters.fuelType !== 'all') {
        query = query.eq('fuel_type', filters.fuelType)
      }
      if (filters.paymentStatus && filters.paymentStatus !== 'all') {
        query = query.eq('payment_status', filters.paymentStatus)
      }
      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        query = query.eq('payment_method', filters.paymentMethod)
      }
      if (filters.minAmount) {
        query = query.gte('total_amount', parseFloat(filters.minAmount))
      }
      if (filters.maxAmount) {
        query = query.lte('total_amount', parseFloat(filters.maxAmount))
      }

      const { data, error } = await query

      if (error) throw error
      setTransactions(data || [])
      
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get today's date
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch all transactions for stats
      const { data, error } = await supabase
        .from('transactions')
        .select('*')

      if (error) throw error

      const todayTransactions = data?.filter(t => 
        new Date(t.transaction_date).toISOString().split('T')[0] === today
      ).length || 0

      const pendingPayments = data?.filter(t => 
        t.payment_status === 'pending'
      ).length || 0

      const totalRevenue = data?.reduce((sum, t) => sum + parseFloat(t.total_amount || 0), 0) || 0
      const totalVolume = data?.reduce((sum, t) => sum + parseFloat(t.quantity_liters || 0), 0) || 0

      setStats({
        totalTransactions: data?.length || 0,
        totalRevenue,
        totalVolume,
        todayTransactions,
        pendingPayments
      })

    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleEdit = (transaction) => {
    setEditingId(transaction.id)
    setEditData({ ...transaction })
  }

  const handleSave = async (id) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          ...editData,
          total_amount: parseFloat(editData.quantity_liters) * parseFloat(editData.price_per_liter),
          net_amount: (parseFloat(editData.quantity_liters) * parseFloat(editData.price_per_liter)) - parseFloat(editData.subsidy_amount || 0),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setTransactions(transactions.map(t => 
        t.id === id ? { ...t, ...editData } : t
      ))
      setEditingId(null)
      setEditData({})
      fetchStats() // Refresh stats
      alert('Transaction updated successfully!')
    } catch (err) {
      alert(`Error updating transaction: ${err.message}`)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTransactions(transactions.filter(t => t.id !== id))
      fetchStats() // Refresh stats
      alert('Transaction deleted successfully!')
    } catch (err) {
      alert(`Error deleting transaction: ${err.message}`)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const applyFilters = () => {
    fetchTransactions()
  }

  const resetFilters = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    })
    setFilters({
      transactionId: '',
      stationCode: '',
      fuelType: '',
      paymentStatus: '',
      paymentMethod: '',
      minAmount: '',
      maxAmount: ''
    })
    fetchTransactions()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745'
      case 'pending': return '#ffc107'
      case 'failed': return '#dc3545'
      case 'refunded': return '#6c757d'
      default: return '#6c757d'
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return '💳'
      case 'debit_card': return '💳'
      case 'cash': return '💵'
      case 'ewallet': return '📱'
      case 'bank_transfer': return '🏦'
      default: return '💰'
    }
  }

  // Simple CSV export function
  const exportToCSV = () => {
    const headers = [
      'Transaction ID,Date,Time,Station,Fuel Type,Quantity (L),Price/Liter,Total Amount,Subsidy,Net Amount,Payment Method,Status,Vehicle No.,Remarks'
    ]

    const data = transactions.map(t => 
      `${t.transaction_id},${new Date(t.transaction_date).toLocaleDateString()},${t.transaction_time?.substring(0, 5) || ''},${t.station_name || t.station_code || ''},${t.fuel_type},${parseFloat(t.quantity_liters).toFixed(2)},RM ${parseFloat(t.price_per_liter).toFixed(2)},RM ${parseFloat(t.total_amount).toFixed(2)},RM ${parseFloat(t.subsidy_amount || 0).toFixed(2)},RM ${parseFloat(t.net_amount).toFixed(2)},${t.payment_method},${t.payment_status},${t.vehicle_number || ''},${t.remarks || ''}`
    )

    const csvContent = headers.concat(data).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
      
      <div style={{ padding: '20px', marginRight: '90px' }}>
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
              Transaction Management
            </h1>
            <p style={{ color: '#666', fontSize: '1.1em' }}>
              Monitor and manage all fuel transactions
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={fetchTransactions}
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
              onClick={exportToCSV}
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
              <span>📊</span> Export CSV
            </button>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{ 
                padding: '12px 24px',
                backgroundColor: showFilters ? '#007bff' : '#6c757d',
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
              <span>🔍</span> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Stats Cards - Same as before */}
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
              {stats.totalTransactions}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Total Transactions</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>All time</div>
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
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Total Revenue</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>Gross income</div>
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
              {stats.totalVolume.toFixed(2)}L
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Fuel Volume</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>Total liters sold</div>
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
              {stats.todayTransactions}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Today's Transactions</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Filters Panel - Same as before */}
        {showFilters && (
          <div style={{ 
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#333', fontSize: '1.5em' }}>
              Filter Transactions
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '25px'
            }}>
              {/* Date Range */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                />
              </div>
              
              {/* Transaction ID */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={filters.transactionId}
                  onChange={(e) => handleFilterChange('transactionId', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Search by TXN ID"
                />
              </div>
              
              {/* Station Code */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Station Code
                </label>
                <input
                  type="text"
                  value={filters.stationCode}
                  onChange={(e) => handleFilterChange('stationCode', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Station code"
                />
              </div>
              
              {/* Fuel Type */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                >
                  <option value="all">All Fuel Types</option>
                  <option value="RON95">RON95</option>
                  <option value="RON97">RON97</option>
                  <option value="DIESEL">DIESEL</option>
                  <option value="BUDI95">BUDI95</option>
                </select>
              </div>
              
              {/* Payment Status */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Payment Status
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              {/* Amount Range */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Min Amount (RM)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Max Amount (RM)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="1000.00"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button 
                onClick={resetFilters}
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
                Reset Filters
              </button>
              <button 
                onClick={applyFilters}
                style={{ 
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Transactions List - Same as before */}
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
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: '#333', fontSize: '1.3em' }}>
              Recent Transactions ({transactions.length})
            </h3>
            <div style={{ color: '#666', fontSize: '0.9em' }}>
              Showing {Math.min(transactions.length, 100)} of {stats.totalTransactions} transactions
            </div>
          </div>
          
          <div style={{ padding: '20px' }}>
            {transactions.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '3em', marginBottom: '20px' }}>📋</div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No transactions found</h3>
                <p>No transactions match your current filters.</p>
                <button 
                  onClick={resetFilters}
                  style={{ 
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    style={{
                      backgroundColor: editingId === transaction.id ? '#f0f7ff' : 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px',
                      padding: '20px',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Left border color based on status */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: getStatusColor(transaction.payment_status)
                    }}></div>

                    {editingId === transaction.id ? (
                      // Edit Mode
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>
                            Transaction ID
                          </label>
                          <input
                            type="text"
                            value={editData.transaction_id || ''}
                            onChange={(e) => setEditData({...editData, transaction_id: e.target.value})}
                            style={{ 
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '1em'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>
                            Fuel Type
                          </label>
                          <select
                            value={editData.fuel_type || ''}
                            onChange={(e) => setEditData({...editData, fuel_type: e.target.value})}
                            style={{ 
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '1em'
                            }}
                          >
                            <option value="RON95">RON95</option>
                            <option value="RON97">RON97</option>
                            <option value="DIESEL">DIESEL</option>
                            <option value="BUDI95">BUDI95</option>
                          </select>
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>
                            Quantity (L)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editData.quantity_liters || ''}
                            onChange={(e) => setEditData({...editData, quantity_liters: e.target.value})}
                            style={{ 
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '1em'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>
                            Price/Liter
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '5px' }}>RM</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editData.price_per_liter || ''}
                              onChange={(e) => setEditData({...editData, price_per_liter: e.target.value})}
                              style={{ 
                                flex: 1,
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1em'
                              }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>
                            Payment Status
                          </label>
                          <select
                            value={editData.payment_status || ''}
                            onChange={(e) => setEditData({...editData, payment_status: e.target.value})}
                            style={{ 
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '1em'
                            }}
                          >
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                        
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
                          <button 
                            onClick={() => handleSave(transaction.id)}
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
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                              <h4 style={{ margin: 0, fontSize: '1.2em', color: '#333' }}>
                                {transaction.transaction_id}
                              </h4>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.8em',
                                fontWeight: '600',
                                backgroundColor: getStatusColor(transaction.payment_status) + '20',
                                color: getStatusColor(transaction.payment_status)
                              }}>
                                {transaction.payment_status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#666', fontSize: '0.9em' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span>📅</span>
                                <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span>🕒</span>
                                <span>{transaction.transaction_time?.substring(0, 5)}</span>
                              </div>
                              {transaction.station_code && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span>⛽</span>
                                  <span>{transaction.station_code}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#1976d2', marginBottom: '5px' }}>
                              {formatCurrency(transaction.total_amount)}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#666' }}>
                              {transaction.quantity_liters}L @ {formatCurrency(transaction.price_per_liter)}/L
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                          gap: '15px',
                          paddingTop: '15px',
                          borderTop: '1px solid #eee'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>Fuel Type</div>
                            <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: 
                                  transaction.fuel_type === 'RON95' ? '#4ecdc4' :
                                  transaction.fuel_type === 'RON97' ? '#45b7d1' :
                                  transaction.fuel_type === 'DIESEL' ? '#96ceb4' : '#ff6b6b'
                              }}></span>
                              {transaction.fuel_type}
                            </div>
                          </div>
                          
                          <div>
                            <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>Payment Method</div>
                            <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {getPaymentMethodIcon(transaction.payment_method)}
                              {transaction.payment_method?.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                          
                          <div>
                            <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>Subsidy</div>
                            <div style={{ fontWeight: '500', color: transaction.subsidy_amount > 0 ? '#388e3c' : '#666' }}>
                              {formatCurrency(transaction.subsidy_amount || 0)}
                            </div>
                          </div>
                          
                          <div>
                            <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>Net Amount</div>
                            <div style={{ fontWeight: '600', color: '#28a745' }}>
                              {formatCurrency(transaction.net_amount)}
                            </div>
                          </div>
                          
                          {transaction.vehicle_number && (
                            <div>
                              <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>Vehicle</div>
                              <div style={{ fontWeight: '500' }}>
                                {transaction.vehicle_number}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginTop: '15px',
                          paddingTop: '15px',
                          borderTop: '1px solid #eee'
                        }}>
                          {transaction.remarks && (
                            <div style={{ fontSize: '0.9em', color: '#666', fontStyle: 'italic' }}>
                              "{transaction.remarks}"
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={() => handleEdit(transaction)}
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
                              onClick={() => handleDelete(transaction.id)}
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
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
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
              <strong>Data Range:</strong> {
                dateRange.startDate && dateRange.endDate 
                  ? `${dateRange.startDate} to ${dateRange.endDate}`
                  : 'All dates'
              }
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
            </div>
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
  )
}

export default TransactionManagement