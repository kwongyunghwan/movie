require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moviesRouter = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRouter);

app.get('/api/health', (req, res)=>{
    res.json({status : '서버 정상 가동중'});
});

app.listen(PORT, ()=>{
    console.log(`서버가 https://localhost:${PORT}에서 가동중입니다.`);
    }
)