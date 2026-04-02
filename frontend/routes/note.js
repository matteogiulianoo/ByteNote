import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'

const router = express.Router()
const API_URL = 'http://localhost:4000'

// Finestra di una nota
router.get('/nota/:id', isAuthenticated, async (req, res) => {
    const note_id = req.params.id
    const email = req.session.email

    try {
        // Popola Note
        const response = await fetch(`${API_URL}/api/note/popolaNote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, note_id })
        })
        if (response.status === 403) return res.redirect('/')
        const nota = await response.json()

        // Popola Tag
        const response2 = await fetch(`${API_URL}/api/tag/popolaTag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        if (response2.status === 403) return res.redirect('/')
        const tag = await response2.json()

        // Popola Tag nella Nota
        const response3 = await fetch(`${API_URL}/api/tag/popolaTagInNota`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, note_id })
        })
        if (response3.status === 403) return res.redirect('/')
        const tagInNota = await response3.json()

        // Invio tutto alla pagina
        res.render('pages/nota', { nota: nota[0], tag, tagInNota })
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

// Logica per la funzione "changeTag"
router.post('/cambiaTag', isAuthenticated, async (req, res) => {
    const email = req.session.email
    const { tag_id, note_id, checked } = req.body

    try {
        const response = await fetch(`${API_URL}/api/tag/aggiorna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, tag_id, note_id, checked })
        })

        if (response.status === 403) return res.status(403).json({ errore: 'Non autorizzato' })
        res.json({ successo: true })
    } catch(e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

export default router