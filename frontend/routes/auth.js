import express from 'express'

const router = express.Router()
const API_URL = 'http://localhost:4000'

// Pagina per il login
router.get('/login', (req, res) => {
    res.render('pages/login')
})

// Pagina per il register
router.get('/register', (req, res) => {
    res.render('pages/register')
})

// Logica per la pagina del login (form button)
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        if (response.ok) {
            req.session.email = email
            res.redirect('/')
        } else {
            res.render('pages/login', { errore: 'Credenziali non valide' })
        }
    } catch (e) {
        res.status(500).send('Erorre proveniente dal server')
    }
})

// Logica per la pagina del register (form button)
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body
    try {
        if (password == password2) {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })

            if (response.ok) {
                res.redirect('/login')
            } else {
                res.render('pages/register', { errore: 'La registrazione non è stata effettuata correttamente, contatta il supporto tecnico per ricevere aiuto' })
            }
        } else {
            res.render('pages/register', { errore: 'Le password non sono uguali, inseriscila di nuovo' })
        }
    } catch (e) {
        res.status(500).send('Errore proveniente dal server')
    }
})

// Logica per sloggare dall'account
router.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

export default router