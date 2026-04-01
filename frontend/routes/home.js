import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const router = express.Router()
const API_URL = 'http://localhost:4000'

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/utenti`)
        const { dati } = await response.json()

        res.render('pages/home', { utenti: dati })
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Errore proveniente dal server backend')
    }
})

export default router