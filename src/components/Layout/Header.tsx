import { NavLink } from "react-router-dom";
import { observer} from "mobx-react-lite";
import logo from '../../assets/logo.png';
import UserIcon from "components/icons/UserIcon/UserIcon";
import styles from './Header.module.scss';
import Text from "components/Text";
import { useStore } from '../../stores';
import CartIcon from "components/icons/CartIcon/CartIcon";
import cn from "classnames";


export const Header = observer(() => {
    const { cartStore } = useStore();
    return (
        <header className={styles.header}>
            <div className={styles['header__container']}>
                <NavLink to="/" className={styles['header__logo']}><img src={logo} alt="shop logo" /> </NavLink>
                <nav className={styles['header__nav']}>
                    <NavLink to="/" className={({ isActive }) => cn(styles['header__nav--link'], {[styles.active] : isActive})}>
                        <Text className={styles['header__nav--text']}>Products</Text>
                    </NavLink>
                    <NavLink to="/" className={styles['header__nav--link']}>
                        <Text className={styles['header__nav--text']}>Categories</Text>
                    </NavLink>
                    <NavLink to="/" className={styles['header__nav--link']}>
                        <Text className={styles['header__nav--text']}>About us</Text>
                    </NavLink>
                </nav>
                <div className={styles['header__icons']}>
                    <NavLink to="/cart" className={styles['header__icons--link--cart']}>
                        <CartIcon />
                        {cartStore.totalItems > 0 && (
                            <span className={styles['header__icons--link--cart--badge']}> {cartStore.totalItems} </span>
                        )}
                    </NavLink>
                    <NavLink to="/" className={styles['header__icons--link--user']}><UserIcon /></NavLink>
                </div>
            </div>
        </header>
    )
});
