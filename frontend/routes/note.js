import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const router = express.Router()
const API_URL = 'http://localhost:4000'

// Finestra di una nota
router.get('/nota/:id', isAuthenticated, async (req, res) => {
    const note_id = req.params.id
    const email = req.session.email

    try {
        const response = await fetch(`${API_URL}/api/note/popolaNote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, note_id })
        })

        if (response.status === 403) return res.redirect('/')

        const nota = await response.json()
        res.render('pages/nota', { nota: nota[0] })
    } catch(e) {
        res.status(500).send('Erorre proveniente dal server')
    }
})

// Logica per il bottone "crea nuova nota"
router.post('/nuovanota', isAuthenticated, async (req, res) => {
    const { nomeNota, spazioNota } = req.body
    const email = req.session.email

    try {
        const response = await fetch(`${API_URL}/api/note/crea`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, nomeNota, spazioNota })
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

// Logica per il bottone "salva"
router.post('/salvanota', isAuthenticated, async (req, res) => {
    const email = req.session.email
    const { title, context, note_id } = req.body

    try {
        const response = await fetch(`${API_URL}/api/note/modifica`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, title, context, note_id })
        })

        if (response.status === 403) return res.redirect('/')
        res.redirect(`/nota/${note_id}`)
    } catch(e) {
        res.status(500).send('Erorre proveniente dal server')
    }
})

// Logica per il bottone "chiudi"
router.get('/chiudinota', isAuthenticated, async (req, res) => {
    res.redirect(`/`)
})

// Logica per il bottone "elimina nota"
router.post('/eliminanota', isAuthenticated, async (req, res) => {
    const email = req.session.email
    const { note_id } = req.body

    try {
        const response = await fetch(`${API_URL}/api/note/elimina`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, note_id })
        })

        if (response.status === 403) return res.redirect('/')
        res.redirect(`/`)
    } catch(e) {
        res.status(500).send('Erorre proveniente dal server')
    }
})

export default router