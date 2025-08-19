import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoadingScreen from "./pages/LoadingScreen";
import LoginScreen from "./pages/LoginScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoadingScreen />} />
        <Route path='/login' element={<LoginScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
