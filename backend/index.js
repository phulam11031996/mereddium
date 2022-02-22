const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieSession = require('cookie-session');

const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
// Initializing
const app = express();
// app.set('trust proxy', true);
app.use(express.json());
//Authorization
app.use(
	cookieSession({
		signed: false
	//	secure: true
	})
);
// CORS
app.use(cors());

// MiddleWare - BodyParser
app.use(express.urlencoded( {extended: false} ));
dotenv.config();

// Initializing DB Connection
const database = process.env.MONGOLAB_URI;

mongoose.connect(database, {
	useUnifiedTopology: true,
	useNewUrlParser: true
}).then( () => {
	console.log("Successfully Connected to CSC309 DataBase");
}).catch ( err => {
	console.log(err);
});

// Routers
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);

// PORT NUMBER 3030
const PORT = 3030;
app.listen(PORT, () => {
	console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
