# MEREDDIUM

CSC 309 Project  
Authors: Nickzad Bayati, Phu Lam, Mohammed Sultanov, Ryan Frank

How to run development mode:
    - change directory to frontend then run 'npm run dev'
    - change directory to backend then run 'npm run dev'

How to run API & E2E testing:
    - change directory to frontend then run 'npm run dev'
    - change directory to backend then run 'npm run dev'
    - after both frontend and backend are running, change directory to frontend then run 'npm run cypress:open'


How to run JUnit test and Mock test:
    - change directory to backend then run 'npm test'

CI & CD requirement run with:
      - backend:
            + npm ci
            + npm run build --if-present
            + npm test (this includes prettier, JUnit tests, and Mock tests)
    - frontend:
            + npm ci
            + npm run build --if-present
            + npm test (this includes prettier)

Backend Testing Coverage Report:
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |     100 |      100 |     100 |     100 |
 models             |     100 |      100 |     100 |     100 |
  CommentHandler.js |     100 |      100 |     100 |     100 |
  CommentSchema.js  |     100 |      100 |     100 |     100 |
  PostHandler.js    |     100 |      100 |     100 |     100 |
  PostSchema.js     |     100 |      100 |     100 |     100 |
  TagHandler.js     |     100 |      100 |     100 |     100 |
  TagSchema.js      |     100 |      100 |     100 |     100 |
  UserHandler.js    |     100 |      100 |     100 |     100 |
  UserSchema.js     |     100 |      100 |     100 |     100 |
 utils              |     100 |      100 |     100 |     100 |
  http-error.js     |     100 |      100 |     100 |     100 |

Mockup URL: https://www.figma.com/exit?url=https%3A%2F%2Fwww.figma.com%2Fproto%2Fkj3cs8pg3kmDcrNahTSwHX%2FBlogSite%3Fnode-id%3D12%253A657%26scaling%3Dcontain%26page-id%3D0%253A1%26starting-point-node-id%3D12%253A657

Project Specs Doc: https://docs.google.com/document/d/1s4cOeRCfrJMtJSfYuEES8qef-e5iDFaK_OYWxrlwdcM/edit?usp=sharing
