import { Route } from "react-router-dom";

//All the components import goes here
import Auth from './Components/Screens/Auth';
import Dashboard from "./Components/Screens/Dashboard";

const Routing = () => {
  return (
    <>
      <Route path="/auth" exact component={() => <Auth/>}/>
      <Route path="/dashboard" exact component={() => <Dashboard/>}/>
    </>
  )
};

export default Routing;