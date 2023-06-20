# MEREDDIUM
Author: Authors: Phu Lam, Nickzad Bayati, Mohammed Sultanov, Ryan Frank
Mereddium is a blog/discussion/informational website where users can go to and register an account. They can view, read, and comment on other people's posts. Posts can typically be displayed in filters that are relevant to viewers. The website can be used as a personal blog, where an individual creates an ongoing online diary or commentary about what they are interested in. It can also be a discussion on different topics such as politics, technology, or advocacy, etc.
 
Note: This app is depoyed to heroku. But Heroku no longer offer a free tier on November 28, 2022.
So we only let the app locally. .env files are left in the repo on purpose. Follow the step below to do so. 

## Technologies
MERN stack

Clone the project using this command:
`https://github.com/phulam11031996/blog-website.git`

## Installation Guide
### Softwares Requirements:
1) npm
2) Node.js

#### Back-end libraries installation:
Inside the root directory<br />
`cd backend` <br />
`npm install` <br />
`npm run dev` <br />
That should start the back-end server. Note: the default port will be 3030

#### Front-end libraries installation:
Open another terminal and type the following commands (make sure you are in the root folder):<br />
`cd frontend`<br />
`npm install`<br />
`npm run dev`<br />
That should start the front-end server, and the landing page will be http://localhost:3000/

#### Run API and E2E tests:
Both backend and frontend needs to run for running the tests. Inside the root directory<br />
`cd frontend`<br />
`npm run cypress:open`<br />

#### Run JUnit and Mock tests:
Inside the root directory.<br />
`cd backend`<br />
`npm test`<br />

#### Some Pictures from the App:
* ![Alt text 2](https://res.cloudinary.com/dak2sbffy/image/upload/v1687237656/Screen_Shot_2023-06-19_at_9.59.32_PM_m4qrfn.png)
* ![Alt text 3](https://res.cloudinary.com/dak2sbffy/image/upload/v1687237656/Screen_Shot_2023-06-19_at_9.59.48_PM_hugg05.png)
* ![Alt text 1](https://res.cloudinary.com/dak2sbffy/image/upload/v1687237658/Screen_Shot_2023-06-19_at_9.58.38_PM_wzq6yy.png)
* ![Alt text 3](https://res.cloudinary.com/dak2sbffy/image/upload/v1687237657/Screen_Shot_2023-06-19_at_9.59.19_PM_yfawdl.png)
