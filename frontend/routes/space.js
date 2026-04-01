import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const router = express.Router()
const API_URL = 'http://localhost:4000'

// Logica per il bottone "crea spazio"
router.post('/crea', isAuthenticated, async (req, res) => {
    const { nome, descr } = req.body
    const email = req.session.email 
    
    try {
        const response = await fetch(`${API_URL}/api/spazi/crea`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, nome, descr })
        })

        if (response.ok) {
            res.redirect('/')
        } else {
            res.redirect('/')
        }
    } catch(e) {
        res.status(500).send('Erorre proveniente dal server')
    }
})

export default router