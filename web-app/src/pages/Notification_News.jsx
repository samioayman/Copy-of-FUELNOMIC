// NotificationNews.jsx
import React, { useState } from 'react';
import Sidebar from '../Components/SideBar.jsx';

function Notification_News() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Fuel Price Update',
      message: 'RON95 prices have been adjusted effective tomorrow. Please update your pricing systems.',
      type: 'price_update',
      date: '2024-03-15',
      priority: 'high',
      isRead: false,
      expanded: false
    },
    {
      id: 2,
      title: 'Maintenance Schedule',
      message: 'Station #23 will undergo maintenance from 10 PM to 4 AM tonight. Please redirect customers.',
      type: 'maintenance',
      date: '2024-03-14',
      priority: 'medium',
      isRead: true,
      expanded: false
    },
    {
      id: 3,
      title: 'New Feature Released',
      message: 'Transaction reports now support PDF export with enhanced formatting options.',
      type: 'feature',
      date: '2024-03-13',
      priority: 'low',
      isRead: true,
      expanded: false
    },
    {
      id: 4,
      title: 'System Upgrade Notice',
      message: 'The payment gateway will be upgraded this weekend. Expect downtime from 2 AM to 4 AM.',
      type: 'system',
      date: '2024-03-12',
      priority: 'medium',
      isRead: false,
      expanded: false
    },
    {
      id: 5,
      title: 'Fuel Subsidy Changes',
      message: 'Government subsidy rates have been updated for RON95. New rate: RM0.50 per liter.',
      type: 'policy',
      date: '2024-03-11',
      priority: 'high',
      isRead: true,
      expanded: false
    },
    {
      id: 6,
      title: 'New Station Opening',
      message: 'Fuelnomic station #45 will open next week in Cyberjaya. Pre-launch promotions available.',
      type: 'announcement',
      date: '2024-03-10',
      priority: 'low',
      isRead: true,
      expanded: false
    }
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      title: 'Record Breaking Quarter',
      message: 'Fuelnomic achieved 35% growth in Q1 2024 with over 50,000 transactions processed.',
      date: '2024-03-15',
      category: 'achievement',
      author: 'Admin',
      isPublished: true,
      expanded: false
    },
    {
      id: 2,
      title: 'Sustainable Fuel Initiative',
      message: 'We are launching a new green fuel initiative across all stations starting next month.',
      date: '2024-03-14',
      category: 'sustainability',
      author: 'CEO Office',
      isPublished: true,
      expanded: false
    },
    {
      id: 3,
      title: 'Mobile App Update',
      message: 'Version 2.5 of Fuelnomic mobile app is now available with enhanced features.',
      date: '2024-03-13',
      category: 'product',
      author: 'Tech Team',
      isPublished: true,
      expanded: false
    },
    {
      id: 4,
      title: 'Partnership Announcement',
      message: 'Fuelnomic partners with EV charging network to provide integrated services.',
      date: '2024-03-12',
      category: 'partnership',
      author: 'Business Dev',
      isPublished: true,
      expanded: false
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'announcement',
    priority: 'medium'
  });

  const [newNews, setNewNews] = useState({
    title: '',
    message: '',
    category: 'announcement'
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [showCreateNews, setShowCreateNews] = useState(false);

  // Notification functions
  const toggleNotification = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, expanded: !notif.expanded } : notif
    ));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleCreateNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newNotif = {
      id: notifications.length + 1,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      date: new Date().toISOString().split('T')[0],
      priority: newNotification.priority,
      isRead: false,
      expanded: false
    };

    setNotifications([newNotif, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'announcement', priority: 'medium' });
    setShowCreateNotification(false);
    alert('Notification created successfully!');
  };

  // News functions
  const toggleNews = (id) => {
    setNews(news.map(newsItem => 
      newsItem.id === id ? { ...newsItem, expanded: !newsItem.expanded } : newsItem
    ));
  };

  const deleteNews = (id) => {
    setNews(news.filter(newsItem => newsItem.id !== id));
  };

  const handleCreateNews = () => {
    if (!newNews.title.trim() || !newNews.message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newNewsItem = {
      id: news.length + 1,
      title: newNews.title,
      message: newNews.message,
      category: newNews.category,
      date: new Date().toISOString().split('T')[0],
      author: 'Admin',
      isPublished: true,
      expanded: false
    };

    setNews([newNewsItem, ...news]);
    setNewNews({ title: '', message: '', category: 'announcement' });
    setShowCreateNews(false);
    alert('News created successfully!');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'price_update': return '💰';
      case 'maintenance': return '🔧';
      case 'feature': return '🚀';
      case 'system': return '⚙️';
      case 'policy': return '📜';
      case 'announcement': return '📢';
      default: return '📋';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'achievement': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'sustainability': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'product': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'partnership': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default: return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    }
  };

  return (
    <div className="main-content-sex">
      <Sidebar />
      
      <div style={{ padding: '20px', marginRight : '50px' }}>
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
              Notifications & News
            </h1>
            <p style={{ color: '#666', fontSize: '1.1em' }}>
              Stay updated with latest announcements and system updates
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={markAllAsRead}
              style={{ 
                padding: '12px 24px',
                backgroundColor: '#007bff',
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
              <span>✓</span> Mark All as Read
            </button>
            
            <button 
              onClick={() => setShowCreateNotification(true)}
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
              <span>+</span> New Notification
            </button>
            
            <button 
              onClick={() => setShowCreateNews(true)}
              style={{ 
                padding: '12px 24px',
                backgroundColor: '#17a2b8',
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
              <span>📰</span> Create News
            </button>
          </div>
        </div>

        {/* Stats */}
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
              backgroundColor: '#007bff20', 
              borderRadius: '50%'
            }}></div>
            <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
              {notifications.filter(n => !n.isRead).length}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Unread Notifications</div>
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
              backgroundColor: '#28a74520', 
              borderRadius: '50%'
            }}></div>
            <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#28a745', marginBottom: '10px' }}>
              {notifications.length}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Total Notifications</div>
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
              backgroundColor: '#ffc10720', 
              borderRadius: '50%'
            }}></div>
            <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#ffc107', marginBottom: '10px' }}>
              {news.length}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>Published News</div>
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
              backgroundColor: '#17a2b820', 
              borderRadius: '50%'
            }}></div>
            <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#17a2b8', marginBottom: '10px' }}>
              {notifications.filter(n => n.priority === 'high').length}
            </div>
            <div style={{ color: '#333', fontWeight: '600', fontSize: '1.1em' }}>High Priority</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '25px'
        }}>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              padding: '15px 30px',
              backgroundColor: activeTab === 'notifications' ? '#007bff' : 'transparent',
              color: activeTab === 'notifications' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'notifications' ? '3px solid #0056b3' : 'none',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            style={{
              padding: '15px 30px',
              backgroundColor: activeTab === 'news' ? '#007bff' : 'transparent',
              color: activeTab === 'news' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'news' ? '3px solid #0056b3' : 'none',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            News ({news.length})
          </button>
        </div>

        {/* Create Notification Modal */}
        {showCreateNotification && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '25px', color: '#333' }}>
                Create New Notification
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Enter notification title"
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Message *
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em',
                    minHeight: '150px',
                    resize: 'vertical'
                  }}
                  placeholder="Enter notification message"
                />
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '20px',
                marginBottom: '25px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Type
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                    style={{ 
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  >
                    <option value="announcement">Announcement</option>
                    <option value="price_update">Price Update</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="system">System Update</option>
                    <option value="policy">Policy Change</option>
                    <option value="feature">New Feature</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                    Priority
                  </label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                    style={{ 
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button 
                  onClick={() => setShowCreateNotification(false)}
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
                  onClick={handleCreateNotification}
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
                  Create Notification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create News Modal */}
        {showCreateNews && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '25px', color: '#333' }}>
                Create News Article
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newNews.title}
                  onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                  placeholder="Enter news title"
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Content *
                </label>
                <textarea
                  value={newNews.message}
                  onChange={(e) => setNewNews({...newNews, message: e.target.value})}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em',
                    minHeight: '200px',
                    resize: 'vertical'
                  }}
                  placeholder="Write your news content here..."
                />
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                  Category
                </label>
                <select
                  value={newNews.category}
                  onChange={(e) => setNewNews({...newNews, category: e.target.value})}
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                >
                  <option value="announcement">Announcement</option>
                  <option value="achievement">Achievement</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="product">Product Update</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button 
                  onClick={() => setShowCreateNews(false)}
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
                  onClick={handleCreateNews}
                  style={{ 
                    padding: '12px 24px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Publish News
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
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
                System Notifications
              </h3>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                {notifications.filter(n => !n.isRead).length} unread notifications
              </p>
            </div>
            
            <div style={{ padding: '20px' }}>
              {notifications.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '3em', marginBottom: '20px' }}>📋</div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No notifications</h3>
                  <p>All caught up! No new notifications.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      style={{
                        backgroundColor: notification.isRead ? '#ffffff' : '#f0f7ff',
                        border: `1px solid ${notification.isRead ? '#e0e0e0' : '#007bff20'}`,
                        borderRadius: '10px',
                        padding: '20px',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onClick={() => toggleNotification(notification.id)}
                    >
                      {/* Priority indicator */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: getPriorityColor(notification.priority)
                      }}></div>
                      
                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div style={{
                          position: 'absolute',
                          right: '15px',
                          top: '15px',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#007bff',
                          borderRadius: '50%'
                        }}></div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '1.5em' }}>
                              {getTypeIcon(notification.type)}
                            </span>
                            <h4 style={{ 
                              margin: 0, 
                              fontSize: '1.1em', 
                              color: '#333',
                              fontWeight: notification.isRead ? '500' : '600'
                            }}>
                              {notification.title}
                            </h4>
                            <span style={{
                              padding: '2px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75em',
                              fontWeight: '600',
                              backgroundColor: getPriorityColor(notification.priority) + '20',
                              color: getPriorityColor(notification.priority)
                            }}>
                              {notification.priority.toUpperCase()}
                            </span>
                          </div>
                          
                          <div style={{ 
                            color: '#666', 
                            fontSize: '0.9em',
                            marginBottom: notification.expanded ? '15px' : '0'
                          }}>
                            {notification.expanded ? notification.message : `${notification.message.substring(0, 100)}...`}
                          </div>
                          
                          {notification.expanded && (
                            <div style={{ 
                              marginTop: '15px',
                              paddingTop: '15px',
                              borderTop: '1px solid #eee'
                            }}>
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '20px',
                                  color: '#666',
                                  fontSize: '0.85em'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span>📅</span>
                                    <span>{notification.date}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span>🏷️</span>
                                    <span>{notification.type.replace('_', ' ')}</span>
                                  </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    style={{ 
                                      padding: '6px 12px',
                                      backgroundColor: notification.isRead ? '#6c757d' : '#007bff',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '0.85em'
                                    }}
                                  >
                                    {notification.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm('Delete this notification?')) {
                                        deleteNotification(notification.id);
                                      }
                                    }}
                                    style={{ 
                                      padding: '6px 12px',
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '0.85em'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div style={{ 
                          marginLeft: '15px',
                          color: '#666',
                          fontSize: '0.85em',
                          textAlign: 'right'
                        }}>
                          {notification.date}
                        </div>
                      </div>
                      
                      {!notification.expanded && (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '10px',
                          paddingTop: '10px',
                          borderTop: '1px solid #eee'
                        }}>
                          <span style={{ color: '#007bff', fontSize: '0.85em' }}>
                            Click to {notification.expanded ? 'collapse' : 'expand'}
                          </span>
                          <span style={{ color: '#666', fontSize: '0.8em' }}>
                            {notification.message.length > 100 ? `${notification.message.length} characters` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
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
                Company News & Announcements
              </h3>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                Latest updates and announcements
              </p>
            </div>
            
            <div style={{ padding: '20px' }}>
              {news.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '3em', marginBottom: '20px' }}>📰</div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No news articles</h3>
                  <p>No news articles have been published yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                  {news.map((newsItem) => (
                    <div 
                      key={newsItem.id}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '0',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onClick={() => toggleNews(newsItem.id)}
                    >
                      {/* Category header */}
                      <div style={{
                        background: getCategoryColor(newsItem.category),
                        padding: '15px 20px',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.9em'
                      }}>
                        {newsItem.category.toUpperCase()}
                      </div>
                      
                      <div style={{ padding: '20px' }}>
                        <h4 style={{ 
                          margin: '0 0 10px 0', 
                          fontSize: '1.1em', 
                          color: '#333',
                          lineHeight: '1.4'
                        }}>
                          {newsItem.title}
                        </h4>
                        
                        <div style={{ 
                          color: '#666', 
                          fontSize: '0.9em',
                          marginBottom: newsItem.expanded ? '15px' : '0',
                          lineHeight: '1.5'
                        }}>
                          {newsItem.expanded ? newsItem.message : `${newsItem.message.substring(0, 120)}...`}
                        </div>
                        
                        {newsItem.expanded && (
                          <div style={{ 
                            marginTop: '15px',
                            paddingTop: '15px',
                            borderTop: '1px solid #eee'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.85em',
                              color: '#666'
                            }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                  <span>👤</span>
                                  <span>By {newsItem.author}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span>📅</span>
                                  <span>Published on {newsItem.date}</span>
                                </div>
                              </div>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Delete this news article?')) {
                                    deleteNews(newsItem.id);
                                  }
                                }}
                                style={{ 
                                  padding: '6px 12px',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.85em'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {!newsItem.expanded && (
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '15px',
                            paddingTop: '15px',
                            borderTop: '1px solid #eee'
                          }}>
                            <span style={{ color: '#007bff', fontSize: '0.85em' }}>
                              Read more
                            </span>
                            <span style={{ color: '#666', fontSize: '0.8em' }}>
                              {newsItem.date}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
              <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
            </div>
            <div>
              <strong>Notifications:</strong> {notifications.filter(n => !n.isRead).length} unread • {notifications.length} total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification_News;