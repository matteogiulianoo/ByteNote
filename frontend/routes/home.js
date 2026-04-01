import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const router = express.Router()
const API_URL = 'http://localhost:4000'

router.get('/', isAuthenticated, async (req, res) => {
    try {
        res.render('pages/home', {})
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Errore proveniente dal server backend')
    }
})

export default router