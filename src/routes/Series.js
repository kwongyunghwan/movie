import { useEffect, useState, useCallback, useMemo } from "react";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const API_BASE_URL = process.env.REACT_APP_API_URL;


    // 영화 데이터 가져오기
    const getMoviesByGenreAndOTT = useCallback(async (genreId, ottId, page = 1) => {
        setLoading(true);
        try {
            const ottParam = ottId ? `&ottId=${ottId}` : '';

            const data = await (await fetch(
                `${API_BASE_URL}/movies/genre/${genreId}?page=${page}${ottParam}`
            )).json();

            setMovies(data.results);
            setTotalPages(data.total_pages);
            setLoading(false);
        } catch (error) {
            console.error("영화 데이터 로딩 실패:", error);
            setLoading(false);
        }
    }, [API_BASE_URL]);

    // 초기 데이터 로드
    useEffect(() => {
        const initializeData = async () => {
            try {
                // 1. 장르 목록 가져오기
                const genresData = await (await fetch(
                    `${API_BASE_URL}/movies/genres`
                )).json();

                setGenres(genresData.genres);

                // 2. OTT 제공자 목록 가져오기
                const ottData = await (await fetch(
                    `${API_BASE_URL}/movies/providers`
                )).json();

                setOttProviders(ottData);

                // 3. 액션 장르 찾아서 초기 로드
                const actionGenre = genresData.genres.find(genre => genre.id === 28);
                if (actionGenre) {
                    setSelectedGenre(actionGenre);
                    await getMoviesByGenreAndOTT(actionGenre.id, null, 1);
                }
            } catch (error) {
                console.error("초기 데이터 로딩 실패:", error);
            }
        };

        initializeData();
    }, [API_BASE_URL, getMoviesByGenreAndOTT]);

    const handleGenreClick = useCallback((genre) => {
        setSelectedGenre(genre);
        setCurrentPage(1);
        getMoviesByGenreAndOTT(genre.id, selectedOTT?.provider_id, 1);
    }, [selectedOTT, getMoviesByGenreAndOTT]);

    const handleOTTClick = useCallback((ott) => {
        if (selectedOTT?.provider_id === ott.provider_id) {
            setSelectedOTT(null);
            setCurrentPage(1);
            getMoviesByGenreAndOTT(selectedGenre.id, null, 1);
        } else {
            setSelectedOTT(ott);
            setCurrentPage(1);
            getMoviesByGenreAndOTT(selectedGenre.id, ott.provider_id, 1);
        }
    }, [selectedGenre, selectedOTT, getMoviesByGenreAndOTT]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        getMoviesByGenreAndOTT(selectedGenre.id, selectedOTT?.provider_id, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedGenre, selectedOTT, getMoviesByGenreAndOTT]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            handlePageChange(1);  // 첫 페이지로
        }
    }, [currentPage, handlePageChange]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            handlePageChange(totalPages);  // 마지막 페이지로
        }
    }, [currentPage, totalPages, handlePageChange]);

    const filteredMovies = useMemo(() =>
        movies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [movies, searchTerm]
    );

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    // 페이지 번호 배열 생성
    const pageNumbers = useMemo(() =>
        Array.from({ length: totalPages }, (_, i) => i + 1),
        [totalPages]
    );

    return (
        <>
            <Header onSearch={handleSearch} />
            <div className={styles.container}>
                <section className={styles.section}>
                    <h2 className={styles.section__title}>장르별 영화</h2>

                    {/* 장르 버튼들 */}
                    <div className={styles.filter__group}>
                        <div className={styles.series__buttons}>
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    className={`${styles.series__button} ${selectedGenre?.id === genre.id ? styles.series__button_active : ''
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
                        <h3 className={styles.filter__label}>OTT</h3>
                        <div className={styles.ott__buttons}>
                            {ottProviders.map((ott) => (
                                <button
                                    key={ott.provider_id}
                                    className={`${styles.ott__button} ${selectedOTT?.provider_id === ott.provider_id ? styles.ott__button_active : ''
                                        }`}
                                    onClick={() => handleOTTClick(ott)}
                                    title={ott.provider_name}
                                >
                                    {ott.logo_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/original${ott.logo_path}`}
                                            alt={ott.provider_name}
                                            className={styles.ott__logo}
                                        />
                                    )}
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

                            {/* 페이지네이션 */}
                            {!searchTerm && totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button
                                        className={styles.pagination__button}
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        aria-label="이전 페이지"
                                    >
                                        ←
                                    </button>

                                    {pageNumbers.map((page) => (
                                        <button
                                            key={page}
                                            className={`${styles.pagination__button} ${currentPage === page ? styles.pagination__button_active : ''
                                                }`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        className={styles.pagination__button}
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        aria-label="다음 페이지"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
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