import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./MovieDetailModal.module.css";

function MovieDetailModal({ movie, ottProviders }) {
    const { id } = useParams();
    const history = useHistory();
    const [detailedMovie, setDetailedMovie] = useState(movie);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        // body 스크롤 막기
        document.body.style.overflow = 'hidden';
        
        return () => {
            // 모달 닫힐 때 스크롤 복구
            document.body.style.overflow = 'unset';
        };
    }, []);

     useEffect(() => {
        const getMovieDetails = async () => {
            try {
                
                const data = await (await fetch(
                    `${API_BASE_URL}/movies/detail/${id}`
                )).json();

                setDetailedMovie(data);
                setLoading(false);
            } catch (error) {
                console.error("영화 상세 정보 로딩 실패:", error);
                setLoading(false);
            }
        };

        getMovieDetails();
    }, [id, API_BASE_URL]);

    const handleClose = () => {
        history.goBack();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!detailedMovie || loading) {
        return (
            <div className={styles.modal__backdrop}>
                <div className={styles.modal__container}>
                    <div style={{ color: 'white', padding: '100px', textAlign: 'center', fontSize: '24px' }}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modal__backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal__container}>
                <button className={styles.modal__close} onClick={handleClose}>
                    ✕
                </button>

                <div className={styles.detail}>
                    {/* 포스터 이미지 */}
                    <div className={styles.detail__poster}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500${detailedMovie.poster_path}`}
                            alt={detailedMovie.title}
                            className={styles.detail__img}
                        />
                    </div>

                    {/* 영화 정보 */}
                    <div className={styles.detail__info}>
                        <h1 className={styles.detail__title}>{detailedMovie.title}</h1>

                        {detailedMovie.tagline && (
                            <p className={styles.detail__tagline}>"{detailedMovie.tagline}"</p>
                        )}

                        <div className={styles.detail__meta}>
                            <span className={styles.detail__year}>
                                <strong>개봉일:</strong> {detailedMovie.release_date}
                            </span>
                            <span className={styles.detail__rating}>
    <strong>평균 평점:</strong> {detailedMovie.vote_average > 0 ? detailedMovie.vote_average.toFixed(1) : '없음'}
</span>
                            {detailedMovie.runtime && (
                                <span className={styles.detail__runtime}>
                                    <strong>상영 시간:</strong> {detailedMovie.runtime}분
                                </span>
                            )}
                        </div>

                        {/* 장르 */}
                        {detailedMovie.genres && detailedMovie.genres.length > 0 && (
                            <div className={styles.detail__genres}>
                                {detailedMovie.genres.map((genre) => (
                                    <span key={genre.id} className={styles.detail__genre}>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 줄거리 */}
                        <div className={styles.detail__overview}>
                            <h2>줄거리</h2>
                            <p>{detailedMovie.overview || "줄거리 정보가 없습니다."}</p>
                        </div>

                        {/* OTT 정보 */}
                        {ottProviders && ottProviders.length > 0 && (
                            <div className={styles.detail__ott}>
                                <h3>시청 가능</h3>
                                <div className={styles.detail__ott__list}>
                                    {ottProviders.map((provider, index) => (
                                        <div key={index} className={styles.detail__ott__item}>
                                            {provider.logo_path && (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                    alt={provider.provider_name}
                                                    className={styles.detail__ott__logo}
                                                />
                                            )}
                                            <span>{provider.provider_name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 추가 정보 */}
                        {(detailedMovie.budget > 0 || detailedMovie.revenue > 0 || (detailedMovie.production_companies && detailedMovie.production_companies.length > 0)) && (
                            <div className={styles.detail__extra}>
                                {detailedMovie.budget > 0 && (
                                    <div className={styles.detail__extra__item}>
                                        <strong>제작비:</strong> ${detailedMovie.budget.toLocaleString()}
                                    </div>
                                )}
                                {detailedMovie.revenue > 0 && (
                                    <div className={styles.detail__extra__item}>
                                        <strong>수익:</strong> ${detailedMovie.revenue.toLocaleString()}
                                    </div>
                                )}
                                {detailedMovie.production_companies && detailedMovie.production_companies.length > 0 && (
                                    <div className={styles.detail__extra__item}>
                                        <strong>제작사:</strong> {detailedMovie.production_companies.map(c => c.name).join(', ')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

MovieDetailModal.propTypes = {
    movie: PropTypes.object.isRequired,
    ottProviders: PropTypes.array,
};

export default MovieDetailModal;