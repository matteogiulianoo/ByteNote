import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const router = express.Router()
const API_URL = 'http://localhost:4000'

// Logica per il bottone "AI" nella pagina delle note
router.post("/ai", isAuthenticated, async (req, res) => {
    const { context } = req.body
    const email = req.session.email

    try {
        const response = await fetch(`${API_URL}/api/ai/ai`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, context })
        })

        const data = await response.json()

        if (!response.ok)
            return res.status(response.status).json(data)

        res.json({ result: data.result })
    } catch (e) {
        console.error(e);
        res.status(500).send('Erorre proveniente dal server (OpenAI)')
    }
})

export default router