import { Layout } from 'components/Layout/Layout';
import { ProductDetail } from 'pages/ProductDetail/ProductDetail';
import { ProductList } from 'pages/ProductList/ProductList';
import { CartPage } from 'pages/CartPage/CartPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:documentId" element={<ProductDetail />} />
          <Route path='/cart' element={ <CartPage/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
