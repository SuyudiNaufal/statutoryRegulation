// Import CSS
import styles from './header.module.css'

const Header = () => {
    return (
        <div className={styles.headerContainer}>
            <div></div>
            <div className={styles.headerLogo}>
                <a href="/" className={styles.headerLogoLink}>Home Page</a>
            </div>
            <div></div>
        </div>
    );
};

export default Header;