import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoadingScreen from "./pages/LoadingScreen";
import LoginScreen from "./pages/LoginScreen";
import MainScreen from "./pages/MainScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoadingScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/dashboard' element={<MainScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
