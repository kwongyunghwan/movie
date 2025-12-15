import { useEffect, useState } from "react";
import Header from "../components/Header";
import Movie from "../components/Movie";
import styles from "./Home.module.css";
import Carousel3D from "../components/Carousel3D";

function Home() {
    const [loading, setLoading] = useState(true);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
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

            // 공개 예정 데이터 
            const upcomingResponse = await (
                await fetch(
                    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko-KR&region=KR&page=1`
                )
            ).json();
            const today = new Date();
            const upcomingMovies = upcomingResponse.results
                .filter(movie => {
                    if (!movie.release_date) return false;
                    const releaseDate = new Date(movie.release_date);
                    return releaseDate > today;
                })
                .sort((a, b) => {
                    const dateA = new Date(a.release_date);
                    const dateB = new Date(b.release_date);
                    return dateA - dateB; // 오름차순 (가까운 날짜가 먼저)
                });

            setNowPlayingMovies(nowPlayingResponse.results);
            setUpcomingMovies(upcomingMovies);
            setLoading(false);

        }catch (error){
            console.error("영화 데이터 로딩 실패:", error);
            setLoading(true);            
        }
    }

    console.log('now',nowPlayingMovies);
    console.log('up',upcomingMovies);

    useEffect(() => {
        getMovies();
    }, []);



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
                            {/* 현재 상영중 - 3D Carousel */}
                            <section className={styles.section}>
                                <h2 className={styles.section__title}>현재 상영중</h2>
                                <Carousel3D movies={nowPlayingMovies} />
                            </section>

                        

                        {/* 공개 예정 - Grid */}
                        <section className={styles.section}>
                            <h2 className={styles.section__title}>개봉 예정 영화</h2>
                            <div className={styles.movies__grid}>
                                {upcomingMovies.map((movie) => (
                                    <Movie
                                        key={`upcoming-${movie.id}`}
                                        id={movie.id}
                                        coverImg={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        title={movie.title}
                                        year={movie.release_date}
                                        summary={movie.overview}
                                        genres={[]} 
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