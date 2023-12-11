import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import "./global.scss"

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
