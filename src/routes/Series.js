import { useEffect, useState } from "react";
import Header from "../components/Header";
import Movie from "../components/Movie";
import styles from "./Series.module.css";

function Series() {
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [ottProviders, setOttProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedOTT, setSelectedOTT] = useState(null);
    
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    
    // 장르 목록 가져오기
    const getGenres = async () => {
        try {
            const data = await (await fetch(
                `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ko-KR`
            )).json();
            
            setGenres(data.genres);
            
            // 액션 장르 찾기 (ID: 28)
            const actionGenre = data.genres.find(genre => genre.id === 28);
            if (actionGenre) {
                setSelectedGenre(actionGenre);
                getMoviesByGenreAndOTT(actionGenre.id, null);
            }
        } catch (error) {
            console.error("장르 데이터 로딩 실패:", error);
        }
    };

    // OTT 제공자 목록 가져오기
    const getOTTProviders = async () => {
        try {
            const data = await (await fetch(
                `https://api.themoviedb.org/3/watch/providers/movie?api_key=${API_KEY}&language=ko-KR&watch_region=KR`
            )).json();
            
            setOttProviders(data.results.slice(0, 10)); // 상위 10개만
        } catch (error) {
            console.error("OTT 제공자 데이터 로딩 실패:", error);
        }
    };

    useEffect(() => {
        getGenres();
        getOTTProviders();
    }, []);
    
    const getMoviesByGenreAndOTT = async (genreId, ottId) => {
        setLoading(true);
        try {
            // OTT 필터가 있으면 추가
            const ottParam = ottId ? `&with_watch_providers=${ottId}&watch_region=KR` : '';
            
            const data = await (await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=1000&page=1${ottParam}`
            )).json();
            
            // 각 영화의 OTT 정보 가져오기
            const moviesWithOTT = await Promise.all(
                data.results.map(async (movie) => {
                    const ottData = await (await fetch(
                        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`
                    )).json();
                    
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
            
            setMovies(moviesWithOTT);
            setLoading(false);
        } catch (error) {
            console.error("영화 데이터 로딩 실패:", error);
            setLoading(false);
        }
    };

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
        getMoviesByGenreAndOTT(genre.id, selectedOTT?.provider_id);
    };

    const handleOTTClick = (ott) => {
        // 같은 OTT 클릭 시 해제
        if (selectedOTT?.provider_id === ott.provider_id) {
            setSelectedOTT(null);
            getMoviesByGenreAndOTT(selectedGenre.id, null);
        } else {
            setSelectedOTT(ott);
            getMoviesByGenreAndOTT(selectedGenre.id, ott.provider_id);
        }
    };

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
                <section className={styles.section}>
                    <h2 className={styles.section__title}>시리즈별 영화</h2>

                    {/* 장르 버튼들 */}
                    <div className={styles.filter__group}>
                        <h3 className={styles.filter__label}>장르</h3>
                        <div className={styles.series__buttons}>
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    className={`${styles.series__button} ${
                                        selectedGenre?.id === genre.id ? styles.series__button_active : ''
                                    }`}
                                    onClick={() => handleGenreClick(genre)}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* OTT 버튼들 */}
                    <div className={styles.filter__group}>
                        <h3 className={styles.filter__label}>OTT 플랫폼</h3>
                        <div className={styles.ott__buttons}>
                            {ottProviders.map((ott) => (
                                <button
                                    key={ott.provider_id}
                                    className={`${styles.ott__button} ${
                                        selectedOTT?.provider_id === ott.provider_id ? styles.ott__button_active : ''
                                    }`}
                                    onClick={() => handleOTTClick(ott)}
                                >
                                    {ott.logo_path && (
                                        <img 
                                            src={`https://image.tmdb.org/t/p/original${ott.logo_path}`}
                                            alt={ott.provider_name}
                                            className={styles.ott__logo}
                                        />
                                    )}
                                    <span>{ott.provider_name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 영화 목록 */}
                    {loading ? (
                        <div className={styles.loader}>
                            <span>Loading...</span>
                        </div>
                    ) : selectedGenre ? (
                        <div className={styles.movies__section}>
                            <h3 className={styles.movies__section__title}>
                                {selectedGenre.name}
                                {selectedOTT && ` · ${selectedOTT.provider_name}`}
                            </h3>
                            <div className={styles.movies__grid}>
                                {(searchTerm ? filteredMovies : movies).length > 0 ? (
                                    (searchTerm ? filteredMovies : movies).map((movie) => (
                                        <Movie
                                            key={`genre-${movie.id}`}
                                            id={movie.id}
                                            year={movie.release_date?.split('-')[0]}
                                            coverImg={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            title={movie.title}
                                            summary={movie.overview}
                                            genres={[]}
                                            rating={movie.vote_average}
                                            ottProviders={movie.ottProviders}
                                        />
                                    ))
                                ) : (
                                    <p className={styles.no__results}>검색 결과가 없습니다</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.empty__state}>
                            <p>장르를 선택해주세요</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

export default Series;