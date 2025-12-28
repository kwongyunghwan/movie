require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moviesRouter = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 로그 추가
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString('ko-KR');
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/movies', moviesRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: '서버 정상 가동중' });
});

app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT}에서 가동중입니다.`);
});