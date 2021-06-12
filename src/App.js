import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import "./App.css";
import ElectionContext from "./ReducerComponents/Context/ElectionContext";
import UserContext from "./ReducerComponents/Context/UserContext";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserContext>
          <ElectionContext>
            <Header />
            <Routing />
            <Footer />
          </ElectionContext>
        </UserContext>
      </BrowserRouter>
    </div>
  );
}

export default App;
