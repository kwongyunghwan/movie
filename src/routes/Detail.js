import { useLocation } from "react-router-dom";
import MovieDetailModal from "../components/MovieDetailModal";

function Detail() {
    const location = useLocation();
    const movie = location.state?.movie;
    const ottProviders = location.state?.ottProviders;

    return <MovieDetailModal movie={movie} ottProviders={ottProviders} />;
}

export default Detail;