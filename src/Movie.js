function Movie({ cover_image, title, summary, genres}){
    return (
    <div>
            <img src={cover_image}/>
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


export default Movie;