import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductList } from 'pages/ProductList/ProductList';
import { ProductDetail } from 'pages/ProductDetail/ProductDetail';
import { Layout } from 'components/Layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path='/product/:documentId' element={<ProductDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;