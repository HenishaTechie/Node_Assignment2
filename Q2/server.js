const express = require('express')
const app = express()
const session = require('express-session')
const path = require('path')
const FileStore = require('session-file-store')(session)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({ path: './session-data' })
}))

// Define a list of valid users with their passwords
const validUsers = [
    { username: 'Henisha', password: '123' }
];

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/login.html')
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if provided username and password match any valid user
    const validUser = validUsers.find(user => user.username === username && user.password === password);

    if (validUser) {
        // Valid credentials, store data in session
        req.session.loggedIn = true;
        req.session.username = username;
        return res.redirect('/home');
    } else {
        return res.send('Invalid Username or Password!');
    }
})

app.get('/home', (req, res) => {
    if (req.session.loggedIn) {
        console.log('logged in')
        res.sendFile(__dirname + '/views/home.html')
    } else {
        console.log('not logged in')
        res.sendFile(__dirname + '/views/login.html')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
app.listen(8080, () => {
    console.log(`server listening`)
})
