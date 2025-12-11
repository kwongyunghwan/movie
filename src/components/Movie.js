import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Movie.module.css";

function Movie({ id, coverImg, title, year, summary, genres, rating }) {
    return (
        <div className={styles.movie}>
            <div className={styles.movie__img__wrapper}>
                <img src={coverImg} alt={title} className={styles.movie__img} />
            </div>
            <div className={styles.movie__content}>
                <h2 className={styles.movie__title}>
                    <Link to={`/movie/${id}`}>{title}</Link>
                </h2>
                <h3 className={styles.movie__year}>{year}</h3>
                {rating && (
                    <div className={styles.movie__rating}>
                        <span className={styles.movie__rating__star}>⭐</span>
                        <span>{rating}</span>
                    </div>
                )}
                <p className={styles.movie__summary}>
                    {summary.length > 150 ? `${summary.slice(0, 150)}...` : summary}
                </p>
                <ul className={styles.movie__genres}>
                    {genres && genres.map((g) => (
                        <li key={g}>{g}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

Movie.propTypes = {
    id: PropTypes.number.isRequired,
    coverImg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    year: PropTypes.number,
    rating: PropTypes.number,
};

export default Movie;