import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from 'api/products'
import type { Product } from "types/Product";
import { useStore } from "../../stores";
import ArrowSideIcon from "components/icons/ArrowDownIcon";
import styles from './ProductDetail.module.scss';
import Text from "components/Text";
import Loader from "components/Loader";
import Button from "components/Button";

export const ProductDetail = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!documentId) return;

        getProductById(documentId)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [documentId]);

    const handleGoBack = () => {
        navigate(-1);
    }

    const { cartStore } = useStore();

    if (loading) {
        return <div className={styles['loader--container']}><Loader size='l' /></div>
    }
    if (error) {
        return <div className={styles['error--container']}><Text view='subtitle'>Error: {error}</Text></div>
    }
    if (!product) {
        return <div className={styles['error--container']}><Text view='subtitle'>Error: The product was not found</Text></div>
    }
    return (
        <div className={styles.root}>
            <button onClick={handleGoBack} className={styles['root__go-back--button']}
            > <ArrowSideIcon className={styles['root__arrow-side-icon']} />
                <Text view="p-20" className={styles['root__go-back--text']}>Назад</Text>
            </button>

            <div className={styles['root__product--container']}>
                <div className={styles['root__image--container']}>
                    <img className={styles['root__product--image']}
                        src={product.images?.[0]?.formats?.medium?.url || product.images?.[0]?.url}
                        alt={product.title}
                    />
                </div>
                <div className={styles['root__description--container']}>
                    <Text view="title" className={styles['root__product--title']}>{product.title}</Text>
                    <Text view="p-20" color="secondary" className={styles['root__product--description']}>{product.description}</Text>
                    <Text view="title" className={styles['root__product--price']}>${product.price}</Text>
                    <div className={styles['root__button--container']}>
                        <Button className={styles['root__button']} onClick={() => cartStore.addItem(product.id)}>
                            Add to cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 