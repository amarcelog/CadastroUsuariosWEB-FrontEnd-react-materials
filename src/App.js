import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes/index";
import "./assets/css/global.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <RoutesApp />
    </BrowserRouter>
  );
}

export default App;


