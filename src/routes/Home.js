import { useEffect, useState } from "react";
import Header from "../components/Header";
import Movie from "../components/Movie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";

function Home() {
    const [loading, setLoading] = useState(true);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    const getMovies = async () => {
        try {
            // 현재 상영중 데이터
            const nowPlayingResponse = await (
                await fetch(
                    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=KR&page=1`
                )
            ).json();

            // 인기 영화 데이터
            const popularResponse = await (
                await fetch(
                    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ko-KR&region=KR&page=1`
                )
            ).json();

            // 인기 영화데이터 ott 정보확인
            const popularWithOTT = await Promise.all(
                popularResponse.results.map(async (movie) => {
                    const ottResponse = await (
                        await fetch(
                        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`
                        )
                    ).json();

                    return {
                        ...movie,
                        ottProviders: ottResponse.results?.KR?.buy || [] // 한국에서 구매 가능한 OTT
                    };
                })
            );
            // 공개 예정 데이터 
            const upcomingMovies = await (
                await fetch(
                    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko-KR&region=KR&page=1`
                )
            ).json();

            setNowPlayingMovies(nowPlayingResponse.results);
            setPopularMovies(popularWithOTT);
            setUpcomingMovies(upcomingMovies.results);
            setLoading(false);

        }catch (error){
            console.error("영화 데이터 로딩 실패:", error);
            setLoading(true);            
        }
    }

    console.log('now',nowPlayingMovies);
    console.log('pop',popularMovies);
    console.log('up',upcomingMovies);

    useEffect(() => {
        getMovies();
    }, []);

    // 검색 필터링 (인기 영화에만 적용)
    const filteredPopularMovies = popularMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Carousel 설정
    const carouselSettings = {
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
                        {/* 현재 상영중 - Carousel */}
                        <section className={styles.section}>
                            <h2 className={styles.section__title}>현재 상영중</h2>
                            <div className={styles.carousel__wrapper}>
                                <Slider {...carouselSettings}>
                                    {nowPlayingMovies.map((movie) => (
                                        <Movie
                                            key={movie.id}
                                            id={movie.id}
                                            coverImg={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            title={movie.title}
                                            rating={movie.vote_average}
                                        />
                                    ))}
                                </Slider>
                            </div>
                        </section>

                        {/* 인기 영화 - Grid */}
                        <section className={styles.section}>
                            <h2 className={styles.section__title}>인기 영화</h2>
                            <div className={styles.movies__grid}>
                                {(searchTerm ? filteredPopularMovies : popularMovies).map((movie) => (
                                    <Movie
                                        key={movie.id}
                                        id={movie.id}
                                        coverImg={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        title={movie.title}
                                        rating={movie.vote_average}
                                        ottProviders={movie.ottProviders}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* 공개 예정 - Grid */}
                        <section className={styles.section}>
                            <h2 className={styles.section__title}>공개 예정</h2>
                            <div className={styles.movies__grid}>
                                {upcomingMovies.map((movie) => (
                                    <Movie
                                        key={movie.id}
                                        id={movie.id}
                                        coverImg={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        title={movie.title}
                                        rating={movie.vote_average}
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

export default Home;