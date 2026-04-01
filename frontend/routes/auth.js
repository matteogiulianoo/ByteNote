import express from 'express'

const router = express.Router()
const API_URL = 'http://localhost:4000'

// Pagina per il login
router.get('/login', (req, res) => {
    res.render('pages/login')
})

// Logica per la pagina del login
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

// Logica per sloggare dall'account
router.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

export default router