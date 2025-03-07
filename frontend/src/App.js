import 'bootstrap/scss/bootstrap.scss';
import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './provider/AuthProvider';
import Authorization from './components/Authorization';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Tests from './pages/tests/Tests';
import Test from './pages/test/Test';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import ManageTests from './pages/ManageTests';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="tests" element={<Tests />} />
          <Route path="manage-tests" element={<ManageTests />} />
          <Route path="" element={<Authorization />}>
            <Route path="test/:id" element={<Test />} />
            <Route path='profile' element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
