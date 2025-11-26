import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AddProduct from './pages/AddProduct';
import ShowProduct from './pages/ShowProduct';
import Layout from './components/Layaout';
import AddSale from './pages/AddSale';

function App() {

  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/agregar" element={<AddProduct />} />
              <Route path="/mostrar" element={<ShowProduct />} />
              <Route path="/venta" element={<AddSale />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
