import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import Register from './components/Register';
import VotingPage from './components/VotingPage';
import CreateProcess from './components/CreateProcessPage';
import HowItWorks from './components/HowItWorks';
import Dashboard from './components/Dashboard';
import Election from './components/Election';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/auth" />} />
                <Route path="/howItWorks" element={<HowItWorks />} />
                <Route path="/auth" element={<Register />} />
                <Route path="/voting/:id" element={<VotingPage />} />
                <Route path="/createProcess" element={<CreateProcess />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/election" element={<Election />} />
            </Routes>
        </Router>
    )
}

export default App;