const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const fs = require('fs');
app.use(express.json());
/*
- Create new html file name home.html
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req,res) => {
  //res.send('This is home router')
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req,res) => {
  //res.send('This is profile router');
  let data = fs.readFileSync(path.join(__dirname, 'user.json'));
  let profile = JSON.parse(data);
  res.json(profile);
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below
    {
        status: false,
        message: "Password is invalid"
    }
*/

router.post('/login', (req,res) => {
  //res.send('This is login router');
  const { username, password } = req.body;

  try {
    let data = fs.readFileSync(path.join(__dirname, 'user.json'), 'utf8');
    let profile = JSON.parse(data);

    // Validate username and password
    if (profile.username === username) {
      if (profile.password === password) {
        res.json({ status: true, message: "User Is valid" });
      } else {
        res.json({ status: false, message: "Password is invalid" });
      }
    } else {
      res.json({ status: false, message: "User Name is invalid" });
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout/:username', (req,res) => {
  //res.send('This is logout router');
  const { username } = req.params;
  res.send(`<b>${username} successfully logged out</b>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/

app.use((err,req,res,next) => {
  //res.send('This is error router');
  err.status = 500;
  res.status(500).json({ status: false, message: "Server Error" });
});


app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));