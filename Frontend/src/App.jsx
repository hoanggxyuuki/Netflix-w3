import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header/Header';
import MovieGrid from './components/MovieGrid/MovieGrid';
import ViewModeSelection from './components/ViewModeSelection/ViewModeSelection';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import MovieManagement from './components/Admin/MovieManagement';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<MovieGrid />} />
              <Route path="/movie/:id" element={<ViewModeSelection />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="movies" element={<MovieManagement />} />
              </Route>
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
