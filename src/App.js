import { useEffect, useState } from "react";
import Movie from "./Movie";

function App() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovies = async() =>{
    const json = await ( 
      await fetch(
        `https://yts.lt/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year`
      )
    ).json();
    setMovies(json.data.movies);
    setLoading(false);
    console.log(json.data.movies);
  }
  
  useEffect(()=> {
      getMovies();
    }, []);

  return (
    <div>{loading? <h1>Loading...</h1> 
      : (
    <div>
      {movies.map((movie)=>
      <Movie 
        key={movie.id}
        cover_image={movie.medium_cover_image}
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

export default App;
