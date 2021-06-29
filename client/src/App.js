import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import "./App.css";
import ElectionContext from "./ReducerComponents/Context/ElectionContext";
import UserContext from "./ReducerComponents/Context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserContext>
        <ElectionContext>
          <Routing/>
        </ElectionContext>
      </UserContext>
    </BrowserRouter>
  );
}

export default App;
