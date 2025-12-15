import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import styles from "./Carousel3D.module.css";

function Carousel3D({ movies }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const location = useLocation();

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === movies.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? movies.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // 현재 보이는 영화 5개 (왼쪽2, 현재, 오른쪽2)
    const getVisibleMovies = () => {
        const positions = [];
        
        for (let i = -2; i <= 2; i++) {
            let index = (currentIndex + i + movies.length) % movies.length;
            let position;
            
            if (i === -2) position = 'far-left';
            else if (i === -1) position = 'left';
            else if (i === 0) position = 'center';
            else if (i === 1) position = 'right';
            else if (i === 2) position = 'far-right';
            
            positions.push({ movie: movies[index], position, movieIndex: index });
        }
        
        return positions;
    };

    const visibleMovies = getVisibleMovies();

    return (
        <div className={styles.carousel}>
            <button className={styles.button_prev} onClick={prevSlide}>
                ‹
            </button>

            <div className={styles.carousel__container}>
                <AnimatePresence mode="wait">
                    {visibleMovies.map(({ movie, position, movieIndex }) => (
                        <motion.div
                            key={`${movie.id}-${position}`}
                            className={`${styles.carousel__item} ${styles[`carousel__item_${position}`]}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                                opacity: position === 'center' ? 1 : 
                                         position === 'left' || position === 'right' ? 0.6 : 0.3,
                                scale: position === 'center' ? 1.2 : 
                                       position === 'left' || position === 'right' ? 0.9 : 0.7,
                                x: position === 'far-left' ? '-120%' :
                                   position === 'left' ? '-60%' : 
                                   position === 'right' ? '60%' : 
                                   position === 'far-right' ? '120%' : '0%',
                                z: position === 'center' ? 100 : 
                                   position === 'left' || position === 'right' ? 50 : 0,
                                rotateY: position === 'far-left' ? 35 :
                                         position === 'left' ? 25 : 
                                         position === 'right' ? -25 : 
                                         position === 'far-right' ? -35 : 0
                            }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={() => {
                                // 가운데가 아닌 포스터 클릭 시 해당 포스터를 가운데로
                                if (position !== 'center') {
                                    goToSlide(movieIndex);
                                }
                            }}
                            style={{ 
                                cursor: position === 'center' ? 'default' : 'pointer'
                            }}
                        >
                            {position === 'center' ? (
                                <Link
                                    to={{
                                        pathname: `/${movie.id}`,
                                        state: {
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
                                        }
                                    }}
                                >
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className={styles.carousel__img}
                                    />
                                </Link>
                            ) : (
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className={styles.carousel__img}
                                />
                            )}
                            
                            {position === 'center' && (
                                <div className={styles.carousel__info}>
                                    <h3>{movie.title}</h3>
                                    <p>⭐ {movie.vote_average.toFixed(1)}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <button className={styles.button_next} onClick={nextSlide}>
                ›
            </button>
        </div>
    );
}

export default Carousel3D;