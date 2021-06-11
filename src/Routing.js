import { Redirect, Route, Switch } from "react-router-dom";
import HomePage from "./Components/Screens/HomePage";
//All the components import goes here

const Routing = () => {
  return <Route exact path="/" component={HomePage} />;
};

export default Routing;
