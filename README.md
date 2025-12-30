# 영목사 (영화 목록 보여주는 사이트)

React + Node.js 기반 영화 정보 웹 애플리케이션

## 주요 기능

- 현재 상영중/개봉 예정 영화
- 인기 영화 TOP 40
- 장르별 영화 탐색
- OTT 플랫폼 필터링
- 영화 검색 (장르/OTT 통합)
- 예고편 링크
- 반응형 디자인

## 기술 스택

### Frontend
- React 19.2
- React Router v5
- Framer Motion (3D Carousel)
- CSS Modules

### Backend
- Node.js + Express 5
- Axios
- NodeCache (캐싱)
- TMDB API

## 실행 방법

### 1. 백엔드 서버
```bash
cd server
npm install
cp .env.example .env  # API 키 입력
npm start
```

### 2. 프론트엔드
```bash
npm install
npm start
```

## 프로젝트 구조
```
movie/
├── public/
├── server/
│   ├── routes/
│   │   └── movies.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── src/
│   ├── components/
│   ├── routes/
│   └── App.js
└── package.json
```

## 환경 변수

### server/.env
```
TMDB_API_KEY=your_api_key
PORT=3001
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### .env (프로젝트 루트)
```
REACT_APP_API_URL=http://localhost:3001/api
```

## API 엔드포인트

- `GET /api/movies/genres` - 장르 목록
- `GET /api/movies/providers` - OTT 제공자
- `GET /api/movies/genre/:id` - 장르별 영화 (40개)
- `GET /api/movies/popular` - 인기 영화 (40개)
- `GET /api/movies/search` - 영화 검색
- `GET /api/movies/detail/:id` - 영화 상세

## 주요 기능 상세

### 3D Carousel
- Framer Motion 애니메이션
- 5개 슬라이드 동시 표시
- useMemo/useCallback 최적화

### 통합 검색
- 장르 + OTT 필터 동시 적용
- 전체 영화 검색 지원
