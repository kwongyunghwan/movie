import { useEffect, useState } from "react";
import Header from "../components/Header";
import Movie from "../components/Movie";
import styles from "./Popular.module.css";

function Popular() {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    
    const getMovies = async () => {
        try {
            const popularData = await (await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&region=KR&page=1`
            )).json();
            
            // OTT 정보 추가
            const popularWithOTT = await Promise.all(
                popularData.results.map(async (movie) => {
                    const ottResponse = await fetch(
                        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`
                    );
                    const ottData = await ottResponse.json();
                    
                    const flatrate = ottData.results?.KR?.flatrate || [];
                    const buy = ottData.results?.KR?.buy || [];
                    const uniqueBuy = buy.filter(
                        b => !flatrate.some(f => f.provider_name === b.provider_name)
                    );
                    const allProviders = [...flatrate, ...uniqueBuy];
                    
                    return {
                        ...movie,
                        ottProviders: allProviders
                    };
                })
            );
            
            setMovies(popularWithOTT);
            setLoading(false);
        } catch (error) {
            console.error("영화 데이터 로딩 실패:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getMovies();
    }, []);

    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <>
            <Header onSearch={handleSearch} />
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loader}>
                        <span>Loading...</span>
                    </div>
                ) : (
                    <>
                        <section className={styles.section}>
                            <h2 className={styles.section__title}>인기 영화</h2>
                            <div className={styles.movies__grid}>
                                {(searchTerm ? filteredMovies : movies).map((movie) => (
                                    <Movie
                                        key={`popular-${movie.id}`}
                                        id={movie.id}
                                        year={movie.release_date}
                                        coverImg={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        title={movie.title}
                                        summary={movie.overview}
                                        genres={[]}
                                        rating={movie.vote_average}
                                        ottProviders={movie.ottProviders}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </>
    );
}

export default Popular;