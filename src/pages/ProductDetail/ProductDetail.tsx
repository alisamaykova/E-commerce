import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useLocalStore } from "hooks/useLocalStore";
import { ProductDetailPageStore } from "../../stores/local/pages/ProductDetailPageStore";
import { useStore } from "../../stores";
import ArrowSideIcon from "components/icons/ArrowDownIcon";
import styles from './ProductDetail.module.scss';
import Text from "components/Text";
import Loader from "components/Loader";
import Button from "components/Button";

export const ProductDetail = observer(() => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { cartStore } = useStore();

  const store = useLocalStore(() => new ProductDetailPageStore());

  useEffect(() => {
    if (documentId) {
      store.loadProduct(documentId);
    }
  }, [documentId, store]);

  const handleGoBack = () => navigate(-1);

  const handleAddToCart = () => {
    if (store.product) {
      cartStore.addItem(store.product.id);
    }
  };

  if (store.productMeta.isLoading) {
    return <div className={styles['loader--container']}><Loader size='l' /></div>;
  }

  if (store.productMeta.isError) {
    return <div className={styles['error--container']}>
      <Text view='subtitle'>Error: {store.productMeta.error}</Text>
    </div>;
  }

  if (!store.product) {
    return <div className={styles.errorContainer}>
      <Text view='subtitle'>Product not found</Text>
    </div>;
  }

  const imageUrl = store.product.images?.[0]?.formats?.medium?.url || store.product.images?.[0]?.url;
    return (
        <div className={styles.root}>
            <button onClick={handleGoBack} className={styles['root__go-back--button']}
            > <ArrowSideIcon className={styles['root__arrow-side-icon']} />
                <Text view="p-20" className={styles['root__go-back--text']}>Назад</Text>
            </button>

            <div className={styles['root__product--container']}>
                <div className={styles['root__image--container']}>
                    <img className={styles['root__product--image']}
                        src={imageUrl}
                        alt={store.product.title}
                    />
                </div>
                <div className={styles['root__description--container']}>
                    <Text view="title" className={styles['root__product--title']}>{store.product.title}</Text>
                    <Text view="p-20" color="secondary" className={styles['root__product--description']}>{store.product.description}</Text>
                    <Text view="title" className={styles['root__product--price']}>${store.product.price}</Text>
                    <div className={styles['root__button--container']}>
                        <Button className={styles['root__button']} onClick={handleAddToCart}>
                            Add to cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
});