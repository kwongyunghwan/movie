import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import styles from "./Carousel3D.module.css";

// 포지션별 애니메이션 설정
const POSITION_CONFIG = {
    'far_left': { opacity: 0.3, scale: 0.7, x: '-120%', z: 0, rotateY: 35 },
    'left': { opacity: 0.6, scale: 0.9, x: '-60%', z: 50, rotateY: 25 },
    'center': { opacity: 1, scale: 1.2, x: '0%', z: 100, rotateY: 0 },
    'right': { opacity: 0.6, scale: 0.9, x: '60%', z: 50, rotateY: -25 },
    'far_right': { opacity: 0.3, scale: 0.7, x: '120%', z: 0, rotateY: -35 }
};

// 포지션 계산 함수
const getPositionName = (offset) => {
    const positions = ['far_left', 'left', 'center', 'right', 'far_right'];
    return positions[offset + 2];
};

function Carousel3D({ movies }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const location = useLocation();

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, [movies.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    }, [movies.length]);

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
    }, []);

    const visibleMovies = useMemo(() => {
        return [-2, -1, 0, 1, 2].map(offset => {
            const index = (currentIndex + offset + movies.length) % movies.length;
            return {
                movie: movies[index],
                position: getPositionName(offset),
                movieIndex: index
            };
        });
    }, [currentIndex, movies]);

    const createMovieState = useCallback((movie) => ({
        background: location,
        movie: {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            overview: movie.overview,
            genres: [],
        },
        ottProviders: []
    }), [location]);

    return (
        <div className={styles.carousel}>
            <button 
                className={styles.button_prev} 
                onClick={prevSlide}
                aria-label="이전 영화"
            >
                ‹
            </button>

            <div className={styles.carousel__container}>
                <AnimatePresence mode="wait">
                    {visibleMovies.map(({ movie, position, movieIndex }) => {
                        const isCenter = position === 'center';
                        const config = POSITION_CONFIG[position];

                        return (
                            <motion.div
                                key={`${movie.id}-${position}`}
                                className={`${styles.carousel__item} ${styles[`carousel__item_${position}`]}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={config}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                onClick={() => !isCenter && goToSlide(movieIndex)}
                                style={{ cursor: isCenter ? 'default' : 'pointer' }}
                            >
                                {isCenter ? (
                                    <Link
                                        to={{
                                            pathname: `/${movie.id}`,
                                            state: createMovieState(movie)
                                        }}
                                    >
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={movie.title}
                                            className={styles.carousel__img}
                                            loading="lazy"
                                        />
                                    </Link>
                                ) : (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className={styles.carousel__img}
                                        loading="lazy"
                                    />
                                )}
                                
                                {isCenter && (
                                    <div className={styles.carousel__info}>
                                        <h3>{movie.title}</h3>
                                        <p>⭐ {movie.vote_average.toFixed(1)}</p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <button 
                className={styles.button_next} 
                onClick={nextSlide}
                aria-label="다음 영화"
            >
                ›
            </button>
        </div>
    );
}

export default Carousel3D;