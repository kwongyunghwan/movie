import { useEffect, useState } from "react";
import Movie from "../components/Movie";
<<<<<<< HEAD
=======
import styles from "./Home.module.css";
>>>>>>> c43bb58 (영화리스트 css 추가)

function Home() {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
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

    return (
<<<<<<< HEAD
        <div>{loading ? <h1>Loading...</h1>
            : (
                <div>
                    {movies.map((movie) =>
                        <Movie
                            key={movie.id}
=======
        <div className={styles.container}>
            {loading ? (
                <div className={styles.loader}>
                <span>Loading...</span>
                </div>
            ) : (
                <div className={styles.movies}>
                    {movies.map((movie) =>
                        <Movie
                            key={movie.id}
                            id={movie.id}
                            year={movie.year}
>>>>>>> c43bb58 (영화리스트 css 추가)
                            coverImg={movie.medium_cover_image}
                            title={movie.title}
                            summary={movie.summary}
                            genres={movie.genres}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;