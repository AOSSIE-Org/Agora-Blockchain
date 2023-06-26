import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';

import Home from './components/Home';
import Register from './components/Register';
import Footer from './components/Footer';
import VotingPage from './components/VotingPage';
import CreateProcess from './components/CreateProcessPage';
import HowItWorks from './components/HowItWorks';

import { useSelector } from 'react-redux';
import { selectHasRegistered } from './store/home.slice';

function App() {
  const hasRegistered = useSelector(selectHasRegistered);

  const renderRoutes = () => {
    let ret;
    if (!hasRegistered){
      ret = 
      <Routes>
        <Route path="/" element={<Register/>} />
        <Route path="/howItWorks" element={<HowItWorks/>} />
      </Routes>
    }else{
      ret = 
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/voting/:id" element={<VotingPage/>} />
        <Route path="/createProcess" element={<CreateProcess/>} />
      </Routes>
    }
    return ret;
  }

  return (
    <Router>
      <>
		    <Navbar />
		    <div className="" style={{height:"100%"}}>
          {renderRoutes()}
		    </div>
        {/* <Footer />   */}
      </>
    </Router>
  );
}

export default App;
