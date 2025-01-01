import 'bootstrap/scss/bootstrap.scss';
import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Test from './pages/test/Test';
import Login from './pages/login/Login';
import { AuthProvider } from './provider/AuthProvider';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="test" element={<Test />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
