import express from 'express'
import { sql } from './../../database/db-utilities.js'

const router = express.Router()

/**
 * Questa API permette di recuperare tutti gli spazi di un utente specifico
 */
router.post('/tutti', async (req, res) => {
    const email = req.headers['email']

    try {
        const rows = await sql('SELECT id FROM bn_user WHERE email = ?', [email])
        if (rows.length === 0) return res.status(401).json({ errore: 'Utente non trovato' })

        const user_id = rows[0].id

        // Controllo se l'utente ha spazi
        const spaces = await sql("SELECT s.id, s.nome, s.descr, s.creation_date, JSON_ARRAYAGG(JSON_OBJECT('title', n.title)) AS note FROM bn_space s LEFT JOIN bn_note n ON n.space_id = s.id WHERE s.user_id = ? GROUP BY s.id", [user_id])
        res.json(spaces)
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

/**
 * Questa API permette di creare un nuovo spazio
 */
router.post('/crea', async (req, res) => {
    const { email, nome, descr } = req.body

    try {
        const rows = await sql('SELECT id FROM bn_user WHERE email = ?', [email])
        if (rows.length === 0) return res.status(401).json({ errore: 'Utente non trovato' })

        const user_id = rows[0].id
        await sql('INSERT INTO bn_space (nome, descr, user_id) VALUES (?, ?, ?)', [nome, descr, user_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

export default router