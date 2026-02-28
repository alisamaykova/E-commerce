import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from 'api/products'
import type { Product } from "types/Product";
import ArrowSideIcon from "components/icons/ArrowDownIcon";
import styles from './ProductDetail.module.scss';
import Text from "components/Text";
import Loader from "components/Loader";

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

    if (loading) {
        return <div className={styles.loaderContainer}><Loader size='l' /></div>
    }
    if (error) {
        return <div className={styles.errorContainer}><Text view='subtitle'>Error: {error}</Text></div>
    }
    if (!product) {
        return <div className={styles.errorContainer}><Text view='subtitle'>Error: The product was not found</Text></div>
    }
    return (
        <div>
            <button onClick={handleGoBack} className={styles.goBackButton}
            > <ArrowSideIcon className={styles.ArrowDownIcon} />
                <Text view="p-20" className={styles.goBackText}>Назад</Text>
            </button>

            <div className={styles.productContainer}>
                <div className={styles.imageContainer}>
                    <img className={styles.productImage}
                        src={product.images?.[0]?.formats?.medium?.url || product.images?.[0]?.url}
                        alt={product.title}
                    />
                </div>
                <div className={styles.descriptionContainer}>
                    <Text view="title" className={styles.productTitle}>{product.title}</Text>
                    <Text view="p-20" color="secondary" className={styles.productDescription}>{product.description}</Text>
                    <Text view="title" className={styles.productPrice}>${product.price}</Text>
                </div>
            </div>
        </div>
    )
} 