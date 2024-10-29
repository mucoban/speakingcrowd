import 'bootstrap/scss/bootstrap.scss';
import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path="blogs" element={<Blogs />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
