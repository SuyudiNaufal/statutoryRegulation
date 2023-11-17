// Import CSS
import styles from './header.module.css'

const Header = () => {
    return (
        <div className={styles.headerContainer}>
            <div></div>
            <div className={styles.headerLogo}>
                <a href="#" className={styles.headerLogoLink}>logo</a>
            </div>
            <div className={styles.headerMenu}>
                <div className={styles.headerSubMenu}>
                    <button type='button' className={styles.headerRegister}>Register</button>
                    <button type='button' className={styles.headerLogin}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Header;