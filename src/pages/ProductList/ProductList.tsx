import { useEffect, useState } from 'react';
import { getProducts } from 'api/products';
import { useNavigate } from 'react-router-dom';
import type { Product } from 'types/Product';
import Card from 'components/Card';
import Button from 'components/Button';
import { Pagination } from 'components/Pagination/Pagination';
import Text from 'components/Text';
import Input from 'components/Input';
import styles from './ProductList.module.scss';
import Loader from 'components/Loader';

export const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9;

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setLoading(true);
    getProducts(currentPage, pageSize)
      .then(response => {
        setProducts(response.data);
        setPageCount(response.meta.pagination.pageCount);
        setTotal(response.meta.pagination.total);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [currentPage]);

  const handleCardClick = (documentId: string) => {
    navigate(`/product/${documentId}`);
  };

  if (loading) return <div className={styles.loaderContainer}><Loader size='l'/></div>;
  if (error) return <div className={styles.errorContainer}><Text view='subtitle'>Error: {error}</Text></div>;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Text className={styles.titleText}view="title" color="primary">Products</Text>
        </div>
        <div className={styles.subtitle}>
          <Text className={styles.subtitleText} view="p-20" color="secondary">
            We display products based on the latest products we have, if you want to see our old products please enter the name of the item
          </Text>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <div className={styles.inputContainer}>
            <Input
              className={styles.searchInput}
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search product"
              afterSlot={null}
            />
          </div>
          <Button className={styles.searchButton}>Find now</Button>
        </div>
        <div className={styles.totalProducts}>
          <Text className={styles.totalProductsText} view="subtitle">Total products</Text>
          <Text className={styles.totalText} view="p-20" weight='bold' color="accent">{total}</Text>
        </div>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {products.map(product => (
            <Card
              key={product.id}
              image={
                product.images?.[0]?.formats?.small?.url ||
                product.images?.[0]?.url ||
                ''
              }
              captionSlot={product.productCategory?.title || undefined}
              title={product.title}
              subtitle={product.description}
              contentSlot={`$${product.price}`}
              onClick={() => handleCardClick(product.documentId)}
              actionSlot={
                <Button onClick={() => handleCardClick(product.documentId)}>
                  Add to cart
                </Button>
              }
            />
          ))}
        </div>
      </div>
      {pageCount > 1 && (
        <div className={styles.paginationContainer}>
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={setCurrentPage}
          />
        </div>
        </div>
      )}
    </div>
  );
};
