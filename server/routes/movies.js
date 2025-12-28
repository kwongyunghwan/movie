const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 })

const API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

// 장르 목록 가져오기
router.get('/genres', async(req, res)=>{
    try{
        const cacheKey = 'genres';
        const cached = cache.get(cacheKey);

        if(cached){
            return res.json(cached);
        }

        const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`,{
            params:{
                api_key : API_KEY,
                language: 'ko-KR'
            }
        });
        cache.set(cacheKey, response.data);
        res.json(response.data);
        console.log("장르 데이터 로딩 성공");
    }catch(error){
        console.error("장르 데이터 로딩 실패 : ", error);
        res.status(500).json({error: "장르 데이터 로딩 실패"});
    }
});

// OTT 제공자 목록
router.get('/providers', async (req, res) => {
    try {
        const cacheKey = 'providers';
        const cached = cache.get(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        const response = await axios.get(`${TMDB_BASE_URL}/watch/providers/movie`, {
            params: {
                api_key: API_KEY,
                language: 'ko-KR',
                watch_region: 'KR'
            }
        });

        const providers = response.data.results.slice(0, 10);
        cache.set(cacheKey, providers);
        res.json(providers);
        console.log("OTT 제공자 로딩 성공");
    } catch (error) {
        console.error('OTT 제공자 로딩 실패:', error);
        res.status(500).json({ error: 'OTT 제공자 데이터를 불러올 수 없습니다.' });
    }
});

// 장르별 영화 + OTT 정보 (통합) - 40개
router.get('/genre/:genreId', async (req, res) => {
    try {
        const { genreId } = req.params;
        const { ottId, page = 1 } = req.query;

        const cacheKey = `genre-${genreId}-ott-${ottId || 'none'}-page-${page}`;
        const cached = cache.get(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        const actualPage1 = (page - 1) * 2 + 1;
        const actualPage2 = actualPage1 + 1;

        const params = {
            api_key: API_KEY,
            language: 'ko-KR',
            sort_by: 'vote_average.desc',
            'vote_count.gte': 1000,
        };

        // genreId가 'all'이 아닐 때만 장르 필터 추가
        if (genreId !== 'all') {
            params.with_genres = genreId;
        }

        if (ottId) {
            params.with_watch_providers = ottId;
            params.watch_region = 'KR';
        }

        const [response1, response2] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/discover/movie`, { 
                params: { ...params, page: actualPage1 } 
            }),
            axios.get(`${TMDB_BASE_URL}/discover/movie`, { 
                params: { ...params, page: actualPage2 } 
            })
        ]);

        const allMovies = [...response1.data.results, ...response2.data.results];

        const moviesWithOTT = await Promise.all(
            allMovies.map(async (movie) => {
                try {
                    const ottResponse = await axios.get(
                        `${TMDB_BASE_URL}/movie/${movie.id}/watch/providers`,
                        { params: { api_key: API_KEY } }
                    );

                    const flatrate = ottResponse.data.results?.KR?.flatrate || [];
                    const buy = ottResponse.data.results?.KR?.buy || [];
                    const uniqueBuy = buy.filter(
                        b => !flatrate.some(f => f.provider_name === b.provider_name)
                    );

                    return {
                        ...movie,
                        ottProviders: [...flatrate, ...uniqueBuy]
                    };
                } catch (error) {
                    return { ...movie, ottProviders: [] };
                }
            })
        );

        const result = {
            page: parseInt(page),
            total_pages: Math.min(Math.ceil(response1.data.total_pages / 2), 5),
            results: moviesWithOTT
        };

        cache.set(cacheKey, result);
        res.json(result);
        console.log("영화 40개 로딩 성공");
    } catch (error) {
        console.error('영화 로딩 실패:', error);
        res.status(500).json({ error: '영화 데이터를 불러올 수 없습니다.' });
    }
});

// 현재 상영중
router.get('/now-playing', async (req, res) => {
    try {
        const cacheKey = 'now-playing';
        const cached = cache.get(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
            params: {
                api_key: API_KEY,
                language: 'ko-KR',
                region: 'KR',
                page: 1
            }
        });

        cache.set(cacheKey, response.data.results);
        res.json(response.data.results);
        console.log("현재 상영중 로딩 성공");
    } catch (error) {
        console.error('현재 상영중 로딩 실패:', error);
        res.status(500).json({ error: '현재 상영중 영화를 불러올 수 없습니다.' });
    }
});

// 개봉 예정
router.get('/upcoming', async (req, res) => {
    try {
        const cacheKey = 'upcoming';
        const cached = cache.get(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
            params: {
                api_key: API_KEY,
                language: 'ko-KR',
                region: 'KR',
                page: 1
            }
        });
        
        cache.set(cacheKey, response.data.results);
        res.json(response.data.results);
        console.log("개봉 예정 로딩 성공");
    } catch (error) {
        console.error('개봉 예정 로딩 실패:', error);
        res.status(500).json({ error: '개봉 예정 영화를 불러올 수 없습니다.' });
    }
});

// 인기 영화 - 40개
router.get('/popular', async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const cacheKey = `popular-page-${page}`;
        const cached = cache.get(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        // 2개 페이지 동시 요청 (40개 영화)
        const actualPage1 = (page - 1) * 2 + 1;
        const actualPage2 = actualPage1 + 1;

        const [response1, response2] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
                params: {
                    api_key: API_KEY,
                    language: 'ko-KR',
                    region: 'KR',
                    page: actualPage1
                }
            }),
            axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
                params: {
                    api_key: API_KEY,
                    language: 'ko-KR',
                    region: 'KR',
                    page: actualPage2
                }
            })
        ]);

        // 40개 영화 합치기
        const allMovies = [...response1.data.results, ...response2.data.results];

        // OTT 정보 추가
        const moviesWithOTT = await Promise.all(
            allMovies.map(async (movie) => {
                try {
                    const ottResponse = await axios.get(
                        `${TMDB_BASE_URL}/movie/${movie.id}/watch/providers`,
                        { params: { api_key: API_KEY } }
                    );

                    const flatrate = ottResponse.data.results?.KR?.flatrate || [];
                    const buy = ottResponse.data.results?.KR?.buy || [];
                    const uniqueBuy = buy.filter(
                        b => !flatrate.some(f => f.provider_name === b.provider_name)
                    );

                    return {
                        ...movie,
                        ottProviders: [...flatrate, ...uniqueBuy]
                    };
                } catch (error) {
                    return { ...movie, ottProviders: [] };
                }
            })
        );

        const result = {
            page: parseInt(page),
            total_pages: Math.ceil(response1.data.total_pages / 2),
            results: moviesWithOTT
        };

        cache.set(cacheKey, result);
        res.json(result);
        console.log("인기 영화 40개 로딩 성공");
    } catch (error) {
        console.error('인기 영화 로딩 실패:', error);
        res.status(500).json({ error: '인기 영화를 불러올 수 없습니다.' });
    }
});

// 영화 상세 정보
router.get('/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `detail-${id}`;
        const cached = cache.get(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        const [movieResponse, releaseDatesResponse, videosResponse] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
                params: { api_key: API_KEY, language: 'ko-KR' }
            }),
            axios.get(`${TMDB_BASE_URL}/movie/${id}/release_dates`, {
                params: { api_key: API_KEY }
            }),
            axios.get(`${TMDB_BASE_URL}/movie/${id}/videos`, {
                params: { api_key: API_KEY, language: 'ko-KR' }
            })
        ]);

        const movie = movieResponse.data;
        const releaseDates = releaseDatesResponse.data;
        const videos = videosResponse.data;

        const krRelease = releaseDates.results.find(r => r.iso_3166_1 === 'KR');
        const theatricalRelease = krRelease?.release_dates?.find(rd => rd.type === 3);
        const krReleaseDate = theatricalRelease?.release_date || krRelease?.release_dates?.[0]?.release_date;

        if (krReleaseDate) {
            movie.release_date = krReleaseDate.split('T')[0];
        }

        const trailer = videos.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );
        const teaser = videos.results.find(video => 
            video.type === 'Teaser' && video.site === 'YouTube'
        );
        
        movie.trailer = trailer || teaser || null;

        cache.set(cacheKey, movie);
        res.json(movie);
        console.log("영화 상세 정보 로딩 성공");
    } catch (error) {
        console.error('영화 상세 정보 로딩 실패:', error);
        res.status(500).json({ error: '영화 상세 정보를 불러올 수 없습니다.' });
    }
});

// 영화 검색 (장르 + OTT 필터 포함)
router.get('/search', async (req, res) => {
    try {
        const { query, genreId, ottId } = req.query;

        if (!query) {
            return res.status(400).json({ error: '검색어를 입력해주세요.' });
        }

        const cacheKey = `search-${query}-genre-${genreId || 'all'}-ott-${ottId || 'none'}`;
        const cached = cache.get(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        // TMDB 검색 API 호출
        const params = {
            api_key: API_KEY,
            language: 'ko-KR',
            query: query,
            page: 1,
            include_adult: false
        };

        // 장르 필터
        if (genreId) {
            params.with_genres = genreId;
        }

        const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });

        let movies = searchResponse.data.results;

        // 장르 필터링 (검색 결과에서)
        if (genreId) {
            movies = movies.filter(movie => 
                movie.genre_ids && movie.genre_ids.includes(parseInt(genreId))
            );
        }

        // OTT 정보 추가 및 필터링
        const moviesWithOTT = await Promise.all(
            movies.slice(0, 40).map(async (movie) => {
                try {
                    const ottResponse = await axios.get(
                        `${TMDB_BASE_URL}/movie/${movie.id}/watch/providers`,
                        { params: { api_key: API_KEY } }
                    );

                    const flatrate = ottResponse.data.results?.KR?.flatrate || [];
                    const buy = ottResponse.data.results?.KR?.buy || [];
                    const uniqueBuy = buy.filter(
                        b => !flatrate.some(f => f.provider_name === b.provider_name)
                    );

                    return {
                        ...movie,
                        ottProviders: [...flatrate, ...uniqueBuy]
                    };
                } catch (error) {
                    return { ...movie, ottProviders: [] };
                }
            })
        );

        // OTT 필터링
        let filteredMovies = moviesWithOTT;
        if (ottId) {
            filteredMovies = moviesWithOTT.filter(movie => 
                movie.ottProviders.some(provider => provider.provider_id === parseInt(ottId))
            );
        }

        const result = {
            results: filteredMovies,
            total_results: filteredMovies.length
        };

        cache.set(cacheKey, result);
        res.json(result);
        console.log(`검색 성공: "${query}" - ${filteredMovies.length}개 결과`);
    } catch (error) {
        console.error('검색 실패:', error);
        res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
    }
});

module.exports = router;