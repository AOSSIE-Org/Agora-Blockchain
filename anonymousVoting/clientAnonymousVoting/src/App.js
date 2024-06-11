import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';

import Home from './components/Home';
import Register from './components/Register';
import Footer from './components/Footer';
import VotingPage from './components/VotingPage';
import CreateProcess from './components/CreateProcessPage';
import HowItWorks from './components/HowItWorks';
import Dashboard from './components/Dashboard';
import Election from './components/Election';

import { useSelector } from 'react-redux';
import { selectHasRegistered } from './store/home.slice';

function App() {
  const hasRegistered = useSelector(selectHasRegistered);

  const renderRoutes = () => {
    let ret;
    // if (!hasRegistered){
    //   ret = 
    //   <Routes>
    //     <Route path="/auth" element={<Register/>} />
    //     <Route path="/howItWorks" element={<HowItWorks/>} />
    //     <Route path="/dashboard" element={<Dashboard/>} />
    //     <Route path="/election" element={<Election />} />

    //   </Routes>
    // }else{
      ret = 
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Register/>} />
        <Route path="/voting/:id" element={<VotingPage/>} />
        <Route path="/createProcess" element={<CreateProcess/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/election" element={<Election />} />
      </Routes>
    // }
    return ret;
  }

  return (
    <Router>
      <>
		    {/* <Navbar /> */}
		    <div className="" style={{height:"100%"}}>
          {renderRoutes()}
		    </div>
        {/* <Footer />   */}
      </>
    </Router>
  );
}

export default App;
