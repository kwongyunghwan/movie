import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import styles from "./Movie.module.css";

function Movie({ id, coverImg, title, year, summary, genres, rating, ottProviders }) {
    const location = useLocation();

    return (
        <div className={styles.movie}>
            <Link
                to={{
                    pathname: `/${id}`,
                    state: {
                        background: location,
                        movie: {
                            id,
                            title,
                            poster_path: coverImg.split('/w500')[1],
                            release_date: year,
                            vote_average: rating,
                            overview: summary,
                            genres: genres || [],
                        },
                        ottProviders: ottProviders || []
                    }
                }}
            >
                <img src={coverImg} alt={title} className={styles.movie__img} />
            </Link>
            <div>
                <h2 className={styles.movie__title}>
                    <Link
                        to={{
                            pathname: `/${id}`,
                            state: {
                                background: location,
                                movie: {
                                    id,
                                    title,
                                    poster_path: coverImg.split('/w500')[1],
                                    release_date: year,
                                    vote_average: rating,
                                    overview: summary,
                                    genres: genres || [],
                                },
                                ottProviders: ottProviders || []
                            }
                        }}
                    >
                        {title}
                    </Link>
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
                        {ottProviders.map((provider, index) => (
                            provider.logo_path && (
                                <img
                                    key={`${id}-ott-${index}`}
                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                    alt={provider.provider_name}
                                    className={styles.ott__logo}
                                />
                            )
                        ))}
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