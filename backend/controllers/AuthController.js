const User = require("../models/UserSchema");
const UserController = require('../controllers/UserController');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


const uniqueID = () => {
	return uuidv4();
}

// POST /auth/login
exports.login = catchAsync(async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	
	const user = await User.findOne({"email": email});

	if(user && user.password === password) {
		// GENERATE JWT
		const userJWT = jwt.sign({
			id: user._id,
			email: user.email
		}, process.env.JWT_SECRET);

		// STORE IN SESSION
		req.session = {
			jwt: userJWT
		};

		req.session.userId = {
			userId: user._id
		};

		res.status(201).json({
			"Status": "Success, User logged in!"
		});
	} else {
		res.status(404).json({
			"Status": "Failed, Check email and password!"
		}).end();
	}
});

// POST /auth/signup
exports.signup = catchAsync(async (req, res) => {
	const email = req.body.email;
	
	const user = await User.findOne({"email": email});

	if(user) {
		res.status(404).json({
			"Status": "This email is already exists!"
		});
	} else {
		var token = uniqueID();
		const newUser = 
		new User(
			{ 
				_id: uniqueID().slice(0,6), 
				firstName: req.body.firstName, 
				lastName: req.body.lastName,
				email: req.body.email, 
				role: req.body.role,
				photo: "default.jpg", 
				password: req.body.password,
				password_confirm: req.body.password_confirm, 
				passwordChangedAt: Date.now(),
				reset_token: token, 
				reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
				blocked: false,
				interestedIn: req.body.interestedIn
			}
		);
	
		newUser.save(function (err) {
			if(err) {
				res.status(404).json({
					"Status": "Failed, To register user!"
				});
			} else {
				const userJWT = jwt.sign({
					id: newUser._id,
					email: newUser.email
				}, process.env.JWT_SECRET);
		
				// STORE IN SESSION
				req.session = {
					jwt: userJWT
				};
		
				req.session.userId = {
					userId: newUser._id
				};

				console.log(req.session.userId);
	
				res.status(201).json({
					"Status": "Success, User registered!"
				});
			}
		});
	}
});





