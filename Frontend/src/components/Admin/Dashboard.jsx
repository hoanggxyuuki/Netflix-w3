import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
          <Link to="/admin/users">Manage Users</Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Movies</h3>
          <p>{stats.totalMovies}</p>
          <Link to="/admin/movies">Manage Movies</Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>{stats.totalRevenue} ETH</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/movies/add" className="action-button">
            Add New Movie
          </Link>
          <Link to="/admin/users" className="action-button">
            View Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
