import express from 'express'
import { sql } from './../../database/db-utilities.js'

const router = express.Router()

/**
 * Questa API permette di creare una nuova nota in uno spazio specifico
 */
router.post('/crea', async (req, res) => {
    const { email, nomeNota, spazioNota } = req.body

    try {
        // Prendo l'id dell'utente
        const rows = await sql('SELECT id FROM bn_user WHERE email = ?', [email])
        if (rows.length === 0) return res.status(401).json({ errore: 'Utente non trovato' })

        const user_id = rows[0].id

        // Controllo che l'id dell'utente è proprietario dello spazio scelto
        const space = await sql('SELECT user_id FROM bn_space WHERE id = ?', [spazioNota])
        if (space[0].user_id != user_id) return res.status(403).json({ errore: 'Non sei il proprietario di questo spazio' })

        await sql('INSERT INTO bn_note (title, space_id) VALUES (?, ?)', [nomeNota, spazioNota])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

export default router