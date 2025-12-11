<<<<<<< HEAD
import PropTypes from "prop-types"

function Movie({ coverImg, title, summary, genres}){
    return (
    <div>
            <img src={coverImg}/>
            <h2>{title}</h2>
            <p>{summary}</p>    
            <ul>
              {genres.map((g)=>(
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
    )
}

Movie.PropTypes = {
=======
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Movie.module.css";

function Movie({ id, coverImg, title, year, summary, genres}){
    return (
    <div className={styles.movie}>
      <img src={coverImg} alt={title} className={styles.movie__img} />
      <div>
        <h2 className={styles.movie__title}>
          <Link to={`/movie/${id}`}>{title}</Link>
        </h2>
        <h3 className={styles.movie__year}>{year}</h3>
        <p>{summary.length > 235 ? `${summary.slice(0,235)}...` : summary}</p>
        <ul className={styles.movie__genres}>
          {genres.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </div>
    )
}

Movie.propTypes = {
    id : PropTypes.number.isRequired,
>>>>>>> c43bb58 (영화리스트 css 추가)
    coverImg : PropTypes.string.isRequired,
    title : PropTypes.string.isRequired,
    summary : PropTypes.string.isRequired,
    genres : PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Movie;