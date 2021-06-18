import { Route, Redirect } from "react-router-dom";

//All the components import goes here
import Auth from './Components/Screens/Auth';
import Dashboard from "./Components/Screens/Dashboard";
import Election from "./Components/Screens/Election";

const Routing = () => {
  return (
    <>
      <Route path="/" exact component={() => <Redirect to="/auth"/>}/>
      <Route path="/auth" exact component={() => <Auth/>}/>
      <Route path="/dashboard" exact component={() => <Dashboard/>}/>
      <Route path="/election" exact component={() => <Election/>}/>
    </>
  )
};

export default Routing;