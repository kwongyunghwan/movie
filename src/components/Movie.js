import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Movie.module.css";

function Movie({ id, coverImg, title, rating, ottProviders }) {
    return (
        <div className={styles.movie}>
            <img src={coverImg} alt={title} className={styles.movie__img} />
            <div>
                <h2 className={styles.movie__title}>
                    <Link to={`/movie/${id}`}>{title}</Link>
                </h2>
                
                {/* 별점 */}
                {rating && (
                    <div className={styles.movie__rating}>
                        ⭐ {rating.toFixed(1)}
                    </div>
                )}
                
                {/* OTT 정보 */}
                {ottProviders && ottProviders.length > 0 && (
                    <div className={styles.movie__ott}>
                        <ul className={styles.movie__ott__list}>
                            {ottProviders.map((provider) => (
                                <li key={provider.provider_id} className={styles.movie__ott__item}>
                                    {provider.logo_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                            alt={provider.provider_name}
                                            className={styles.movie__ott__logo}
                                        />
                                    )}
                                    <span>{provider.provider_name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
)}
            </div>
        </div>
    );
}

Movie.propTypes = {
    id: PropTypes.number.isRequired,
    coverImg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    year: PropTypes.string,
    rating: PropTypes.number,
    ottProviders: PropTypes.arrayOf(PropTypes.shape({
        provider_id: PropTypes.number,
        provider_name: PropTypes.string,
    })),
};

export default Movie;