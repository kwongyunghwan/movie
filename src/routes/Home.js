import { useEffect, useState } from "react";
import Header from "../components/Header";
import Movie from "../components/Movie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";

function Home() {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");

    const getMovies = async () => {
        const json = await (
            await fetch(
                `https://yts.lt/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year`
            )
        ).json();
        setMovies(json.data.movies);
        setLoading(false);
        console.log(json.data.movies);
    }

    useEffect(() => {
        getMovies();
    }, []);
    // 평점 높은 순으로 정렬
    const sortedMovies = [...movies].sort((a, b) => b.rating - a.rating);

    // 모든 장르 추출
    const allGenres = ["All", ...new Set(movies.flatMap(movie => movie.genres || []))];

    // 검색 + 장르 필터링
    const filteredMovies = sortedMovies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre === "All" || (movie.genres && movie.genres.includes(selectedGenre));
        return matchesSearch && matchesGenre;
    });
    // Carousel 설정
    const settings = {
        dots: true,              // 하단에 점(dot) 표시
        infinite: true,          // 무한 반복
        speed: 500,              // 슬라이드 속도
        slidesToShow: 3,         // 한 번에 3개 보여주기
        slidesToScroll: 3,       // 3개씩 넘기기
        autoplay: true,          // 자동 슬라이드
        autoplaySpeed: 10000,     // 5초마다
        pauseOnHover: true,      // 마우스 올리면 멈춤
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
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
                        {/* Carousel Section */}
                        <div className={styles.carousel__section}>
                            <h2 className={styles.section__title}>추천 영화</h2>
                            <div className={styles.movies__carousel}>
                                <Slider {...settings}>
                                    {sortedMovies.slice(0, 12).map((movie) => (
                                        <Movie
                                            key={movie.id}
                                            id={movie.id}
                                            year={movie.year}
                                            coverImg={movie.medium_cover_image}
                                            title={movie.title}
                                            summary={movie.summary}
                                            genres={movie.genres}
                                            rating={movie.rating}
                                        />
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        {/* Genre Filter Section */}
                        <div className={styles.genre__section}>
                            <h2 className={styles.section__title}>장르별 영화</h2>
                            <div className={styles.genre__buttons}>
                                {allGenres.map((genre) => (
                                    <button
                                        key={genre}
                                        className={`${styles.genre__button} ${
                                            selectedGenre === genre ? styles.genre__button_active : ""
                                        }`}
                                        onClick={() => handleGenreClick(genre)}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Movies Grid Section */}
                        <div className={styles.grid__section}>
                            {filteredMovies.length > 0 ? (
                                <div className={styles.movies__grid}>
                                    {filteredMovies.map((movie) => (
                                        <Movie
                                            key={movie.id}
                                            id={movie.id}
                                            year={movie.year}
                                            coverImg={movie.medium_cover_image}
                                            title={movie.title}
                                            summary={movie.summary}
                                            genres={movie.genres}
                                            rating={movie.rating}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.no__results}>검색 결과가 없습니다 😢</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Home;