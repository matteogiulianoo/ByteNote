import express from 'express'
import session from 'express-session'
import expressLayouts from 'express-ejs-layouts'
import path from 'path'

// Funzioni custom
import homeRouter from './routes/home.js'
import authRouter from './routes/auth.js'
import spaceRouter from './routes/space.js'
import noteRouter from './routes/note.js'
import settingsUserRouter from './routes/settings-user.js'

const __dirname = import.meta.dirname
const app = express()

// la cartella views avrà i file .ejs
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: 'byt3n0TE@242604-',
    resave: false,
    saveUninitialized: false
}))

// Rendo disponibile isLoggedIn a tutti i template EJS
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.email
    next()
})

app.use('/', authRouter)
app.use('/', homeRouter)
app.use('/', spaceRouter)
app.use('/', noteRouter)
app.use('/', settingsUserRouter)

// Mostro l'errore 404 a schermo
app.use((req, res) => {
    res.render('errors/404', { layout: false })
})

// Avvio il backend sulla porta 3000
app.listen(3000, () => {
    console.log(`Web App avviata correttamente su http://localhost:3000`)
})