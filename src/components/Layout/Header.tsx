import { NavLink } from "react-router-dom";
import logo from '../../assets/logo.png';
import UserIcon from "components/icons/UserIcon/UserIcon";
import styles from './Header.module.scss';
import Text from "components/Text";

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <NavLink to="/" className={styles.logo}><img src={logo} alt="shop logo" /> </NavLink>
                <nav className={styles.nav}>
                    <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}><Text className={styles.navLinkText} view='p-18'>Products</Text></NavLink>
                    <NavLink to="/" className={styles.navLink}><Text className={styles.navLinkText} view='p-18'>Categories</Text></NavLink>
                    <NavLink to="/" className={styles.navLink}><Text className={styles.navLinkText}view='p-18'>About us</Text></NavLink>
                </nav>
                <div className={styles.icons}>
                    <NavLink to="/" className={styles.iconLink}><UserIcon/></NavLink>
                </div>
            </div>
        </header>
    )
}