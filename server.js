import express from "express";
import session from "express-session";
import MongoStore from 'connect-mongo'

const DB = [ {
    username: 'coder',
    password: 'secret',
    role: 'admin'
}]

const app = express()

app.use(session({
    store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017',
            dbName: 'marathon-sessions',
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
    }),
    secret: 'victoriasecret',
    resave: true,
    saveUninitialized: true
}))

const auth = (req, res, next) => {
    if (req.session.user) return next()
    return res.send('Error de autenticación')
}

app.get('/api/login', (req, res) => {
    const { username, password} = req.query
    const user = DB.find(u => u.username === username && u.password === password )
    if (!user) return res.send('Invalid crendentials')
    req.session.user = user
    res.send('Login success!')
})

app.get('/api/private', auth, (req, res) => {
    res.send('Bienvenido!!')
})


app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Logout error')
    })
    return res.send('Logout ok')
})

app.listen(8080, () => console.log('Server UP!'))