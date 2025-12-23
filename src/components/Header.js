import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header({ onSearch, showSearch = true }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === "") {
            onSearch("");
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.header__container}>
                <div className={styles.header__left}>
                    <Link to="/" className={styles.header__logo}>
                        영목사
                    </Link>
                    <nav className={styles.header__nav}>
                        <Link to="/" className={styles.header__nav__link}>
                            홈
                        </Link>
                        <Link to="/popular" className={styles.header__nav__link}>
                            인기영화
                        </Link>
                        <Link to="/series" className={styles.header__nav__link}>
                            장르별 영화
                        </Link>
                    </nav>
                </div>

                {showSearch && (
                    <form onSubmit={handleSubmit} className={styles.header__search}>
                        <input
                            type="text"
                            placeholder="영화를 검색해보세요."
                            value={searchTerm}
                            onChange={handleChange}
                            className={styles.header__input}
                        />
                    </form>
                )}
            </div>
        </header>
    );
}

Header.propTypes = {
    onSearch: PropTypes.func.isRequired,
    showSearch: PropTypes.bool,
};

export default Header;