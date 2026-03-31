import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import { runInAction } from 'mobx';
import Button from '../../components/Button/Button';
import Text from '../../components/Text';
import styles from './CartPage.module.scss';
import Loader from 'components/Loader';

export const CartPage = observer(() => {
  const { cartStore } = useStore();

  if (cartStore.cartMeta.isLoading) return <div className={styles['loader--container']}><Loader size='l'/> </div>
  if (cartStore.cartMeta.isError) return <div className={styles['error--container']}>Error: {cartStore.cartMeta.error}</div>;

  return (
    <div className={styles.root}>
      <Text view="title" className={styles['root__title']}>Shopping Cart</Text>

      {cartStore.items.length === 0 ? (
        <Text view="p-20" color="secondary">Your cart is empty</Text>
      ) : (
        <>
          <div className={styles['root__items']}>
            {cartStore.items.map((item) => (
              <div key={item.id} className={styles['root__item']}>
                <img
                  src={item.product.images?.[0]?.formats?.medium?.url || item.product.images?.[0]?.url || ''}
                  alt={item.product.title}
                  className={styles['root__item--image']}
                />
                <div className={styles['root__item--info']}>
                  <Text className={styles['root__item--title--text']}view="p-18" weight="bold">{item.product.title}</Text>
                  <Text view="p-16" color="secondary">${item.product.price}</Text>
                </div>
                <div className={styles['root__item--quantity']}>
                  <Button
                    onClick={() => runInAction(() => cartStore.removeItem(item.product.id))}
                    className={styles['root__quantity--button']}
                  >−</Button>
                  <Text view="p-16">{item.quantity}</Text>
                  <Button
                    onClick={() => runInAction(() => cartStore.addItem(item.product.id))}
                    className={styles['root__quantity--button']}
                  >+</Button>
                </div>
                <Text view="p-18" weight="bold">
                  ${item.product.price * item.quantity}
                </Text>
              </div>
            ))}
          </div>

          <div className={styles['root__total']}>
            <Text view="p-20" weight="bold">Total:</Text>
            <Text view="p-20" weight="bold" color="accent">
              ${cartStore.totalPrice}
            </Text>
          </div>
        </>
      )}
    </div>
  );
});