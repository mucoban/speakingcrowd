import 'bootstrap/scss/bootstrap.scss';
import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Test from './pages/test/Test';
import Login from './pages/login/Login';
import { AuthProvider } from './provider/AuthProvider';
import Profile from './pages/profile/Profile';
import Authorization from './components/Authorization';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="" element={<Authorization />}>
            <Route path="test" element={<Test />} />
            <Route path='profile' element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
