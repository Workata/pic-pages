import ReactDOM from "react-dom/client";
import "./index.css";
import ContextProvider from "AppContext";
import axios from "axios";
import App from "./App";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  // <React.StrictMode>
  <ContextProvider>
    <App />
  </ContextProvider>,
  // </React.StrictMode>
);
