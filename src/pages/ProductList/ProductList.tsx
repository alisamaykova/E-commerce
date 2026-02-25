import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { Pagination } from '../../components/Pagination/Pagination';
import Text from '../../components/Text';
import Input from '../../components/Input';
import styles from './ProductList.module.scss';
import { values } from 'mobx';
import MultiDropdown from 'components/MultiDropdown/MultiDropdown'
import type { Option } from 'components/MultiDropdown/MultiDropdown';

export const ProductList = observer(() => {
  const navigate = useNavigate();
  const { productStore, cartStore } = useStore();
  const [localSearch, setLocalSearch] = useState(productStore.searchQuery);

  console.log('render:', {
    localSearch,
    storeSearch: productStore.searchQuery
  });

  useEffect(() => {
    setLocalSearch(productStore.searchQuery);
  }, [productStore.searchQuery]);

  const handleSearch = () => {
    productStore.applySearch(localSearch);
  };
  if (!productStore.categories) {
    return null
  }
  const categories = productStore.categories;

  const handleCardClick = (documentId: string) => {
    navigate(`/product/${documentId}`);
  };

  const handleFilterChange = (categories: Option[]) => {
    productStore.applyFilter(categories);
  };

  if (productStore.loading && productStore.products.length === 0) {
    return <div>Loading...</div>; // Лоадер добавь
  }
  if (productStore.error) {
    return <div className={styles.error}>Error: {productStore.error}</div>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Text className={styles.titleText} view="title" color="primary">Products</Text>
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
              value={localSearch}
              onChange={setLocalSearch}
              placeholder="Search product"
              afterSlot={null}
            />
          </div>
          <Button className={styles.searchButton} onClick={handleSearch}>Find now</Button>
        </div>
        <div className={styles.filters}>
          <MultiDropdown
            options={categories}
            value={productStore.selectedCategories}
            onChange={handleFilterChange}
            getTitle={(values) =>
              values.length === 0
                ? 'All categories'
                : values.length === 1
                  ? values[0].value
                  : `${values.length} categories`
            }
          />
        </div>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {productStore.products.map((product) => (
            <Card
              key={product.id}
              image={
                product.images?.[0]?.formats?.medium?.url ||
                product.images?.[0]?.url ||
                ''
              }
              captionSlot={product.productCategory?.title}
              title={product.title}
              subtitle={product.description}
              contentSlot={`$${product.price}`}
              onClick={() => handleCardClick(product.documentId)}
              actionSlot={<Button onClick={() => cartStore.addItem(product.id)}> 
                Add to cart
              </Button>}
            />
          ))}
        </div>
      </div>
      <div className={styles.paginationContainer}>
        <Pagination
          currentPage={productStore.page}
          pageCount={productStore.pageCount}
          onPageChange={(page) => productStore.setPage(page)}
        />
      </div>
    </div>
  );
});