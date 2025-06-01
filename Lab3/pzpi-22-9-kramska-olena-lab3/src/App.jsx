import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RegisterOperator from './pages/RegisterOperator';
import Recipes from './pages/Recipes';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Sensors from './pages/Sensors';
import Containers from './pages/Containers'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterOperator />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/containers" element={<Containers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
