const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

// USER DATA
const user = {
    id: 1,
    username: "admin",
    password: "1234",
    name: "Kyaw Tun",
    email: "kyawtun@email.com",
    bio: "AI Student & Flutter Developer",
    image: "https://i.pinimg.com/564x/8e/0b/9e/8e0b9e1207dd382176bce6853c46a2b8.jpg"
};

// MOVIES DATA
const movies = [
    {
        id: 1,
        title: "Avengers Endgame",
        year: 2019,
        image: "https://cdn.marvel.com/content/2x/MLou2_Payoff_1-Sht_Online_DOM_v7_Sm.jpg",
        description: "Superheroes unite to defeat Thanos and restore balance."
    },
    {
        id: 2,
        title: "Interstellar",
        year: 2014,
        image: "https://m.media-amazon.com/images/I/81kz06oSUeL._AC_UF894,1000_QL80_.jpg",
        description: "A journey through space to save humanity."
    },
    {
        id: 3,
        title: "Inception",
        year: 2010,
        image: "https://c8.alamy.com/comp/2JH2PW0/movie-poster-inception-2010-2JH2PW0.jpg",
        description: "A thief steals secrets through dream-sharing technology."
    }
];


// HOME ROUTE
app.get('/', (req, res) => {
    res.send("🚀 Movie API is running");
});

// DOCS ROUTE
app.get('/docs', (req, res) => {
    res.json({
        endpoints: {
            login: "POST /login",
            movies: "GET /movies (token required)",
            movieDetail: "GET /movies/:id",
            profile: "GET /profile"
        }
    });
});


// LOGIN API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === user.username && password === user.password) {
        const token = jwt.sign({ id: user.id }, SECRET);

        res.json({
            status: "ok",
            token,
            name: user.name
        });
    } else {
        res.status(401).json({
            status: "error",
            message: "Invalid login"
        });
    }
});


// VERIFY TOKEN
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: "No token" });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.userId = decoded.id;
        next();
    });
}


// GET ALL MOVIES
app.get('/movies', verifyToken, (req, res) => {
    res.json(movies);
});


// GET SINGLE MOVIE
app.get('/movies/:id', verifyToken, (req, res) => {
    const movie = movies.find(m => m.id == req.params.id);
    res.json(movie);
});


// PROFILE
app.get('/profile', verifyToken, (req, res) => {
    res.json(user);
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});