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
            onSearch(""); // 검색어가 비면 전체 보기
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.header__container}>
                <h1 className={styles.header__logo}>
                    영화평점 사이트 (영평사)
                </h1>
                <form onSubmit={handleSubmit} className={styles.header__search}>
                    <input
                        type="text"
                        placeholder="영화 제목을 검색하세요..."
                        value={searchTerm}
                        onChange={handleChange}
                        className={styles.header__input}
                    />
                    <button type="submit" className={styles.header__button}>
                        검색
                    </button>
                </form>
            </div>
        </header>
    );
}

Header.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default Header;