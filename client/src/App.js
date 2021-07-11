import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import "./App.css";
import ElectionContext from "./ReducerComponents/Context/ElectionContext";
import { UserProvider } from "./ReducerComponents/Context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ElectionContext>
          <Routing/>
        </ElectionContext>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
