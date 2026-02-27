import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { Pagination } from '../../components/Pagination/Pagination';
import Text from '../../components/Text';
import Input from '../../components/Input';
import MultiDropdown from 'components/MultiDropdown/MultiDropdown'
import type { Option } from 'components/MultiDropdown/MultiDropdown';
import Loader from 'components/Loader';
import styles from './ProductList.module.scss';

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
  if (productStore.error) {
    return <div className={styles['error--container']}>Error: {productStore.error}</div>;
  }


  return (
    <div className={styles.root}>
      <div className={styles.root__header}>
        <div className={styles.root__title}>
          <Text className={styles['root__title--text']} view="title" color="primary">Products</Text>
        </div>
        <div className={styles.root__subtitle}>
          <Text className={styles['root__subtitle--text']} view="p-20" color="secondary">
            We display products based on the latest products we have, if you want to see our old products please enter the name of the item
          </Text>
        </div>
      </div>

      <div className={styles['root__search--section']}>
        <div className={styles['root__search--bar']}>
          <div className={styles['root__input--container']}>
            <Input
              className={styles['root__search--input']}
              value={localSearch}
              onChange={setLocalSearch}
              placeholder="Search product"
              afterSlot={null}
            />
          </div>
          <Button className={styles['root__search--button']} onClick={handleSearch}>Find now</Button>
        </div>
        <div className={styles['root__dropdown--container']}>
          <MultiDropdown
            className={styles.dropdown}
            options={categories}
            value={productStore['selectedCategories']}
            onChange={handleFilterChange}
            getTitle={(values) =>
              values.length === 0
                ? 'All categories'
                : values.length === 0
                  ? 'All categories'
                  : values.map(v => v.value).join(', ')
            }
          />
        </div>
        <div className={styles['root__total--products']}>
          <Text className={styles['root__total--products--text']} view="subtitle">Total products</Text>
          <Text className={styles['root__total--text']} view="p-20" weight='bold' color="accent">{productStore.total}</Text>
        </div>
      </div>

      <div className={styles['root__grid--container']}>
        {productStore.loading ? (
          <div className={styles['loader--container']}>
            <Loader size='l' />
          </div>) : productStore.products.length === 0 ? (
            <div className={styles['root__empty--grid']}>
              <Text view='p-20' color='secondary'>
                По данному запросу ничего не найдено
              </Text>
            </div>
          ) : (
          <div className={styles['root__grid']}>
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
        )}
      </div>
      <div className={styles['root__pagination--container']}>
        <Pagination
          currentPage={productStore.page}
          pageCount={productStore.pageCount}
          onPageChange={(page) => productStore.setPage(page)}
        />
      </div>
    </div>
  );
});