import { useEffect, useState } from "react";
import Header from "../components/Header";
import Movie from "../components/Movie";
import styles from "./Popular.module.css";

function Popular() {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const getMovies = async () => {
            try {
                const data = await (await fetch(
                    `${API_BASE_URL}/movies/popular`
                )).json();

                setMovies(data.results);
                setLoading(false);
            } catch (error) {
                console.error("인기 영화 데이터 로딩 실패:", error);
                setLoading(false);
            }
        };

        getMovies();
    }, [API_BASE_URL]);

    return (
        <>
            <Header onSearch={() => {}} showSearch={false} />
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loader}>
                        <span>Loading...</span>
                    </div>
                ) : (
                    <section className={styles.section}>
                        <h2 className={styles.section__title}>🔥 인기 영화</h2>
                        <div className={styles.movies__grid}>
                            {movies.map((movie) => (
                                <Movie
                                    key={`popular-${movie.id}`}
                                    id={movie.id}
                                    year={movie.release_date?.split('-')[0]}
                                    coverImg={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    title={movie.title}
                                    summary={movie.overview}
                                    genres={movie.genres || []}
                                    rating={movie.vote_average}
                                    ottProviders={movie.ottProviders}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

export default Popular;