import { Navigate, Outlet } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import './Admin.css';
import { Link } from 'react-router-dom';

const AdminLayout = () => {
  const { account } = useWeb3();

  if (!account) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/movies">Movies</Link>
        </nav>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
