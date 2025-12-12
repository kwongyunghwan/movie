import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Header.module.css";

function Header({ onSearch }) {
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
                <h1 className={styles.header__logo}>
                    영추사
                </h1>
                <form onSubmit={handleSubmit} className={styles.header__search}>
                    <input
                        type="text"
                        placeholder="영화 제목을 검색해보세요."
                        value={searchTerm}
                        onChange={handleChange}
                        className={styles.header__input}
                    />
                </form>
            </div>
        </header>
    );
}

Header.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default Header;