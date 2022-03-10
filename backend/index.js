const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser')

const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
const tagRouter = require('./routes/tagRoutes')

const authRouter = require('./routes/authRoutes');

// Initializing
const app = express();

app.use(cookieParser());
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


// Routers
app.use('/user', userRouter);
app.use('/post', postRouter);
// app.use('/comment', commentRouter);
// app.use('/auth', authRouter);
app.use('/tag', tagRouter);

// PORT NUMBER 3030
const PORT = 3030;
app.listen(PORT, () => {
	console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
