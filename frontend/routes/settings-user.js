import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const router = express.Router()
const API_URL = 'http://localhost:4000'

// Pagina per le impostazioni
router.get('/settings-user', isAuthenticated, (req, res) => {
    res.render('pages/settings-user')
})

export default router