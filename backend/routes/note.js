import express from 'express'
import { sql } from './../../database/db-utilities.js'
import { getIdFromEmail } from '../utilities/utility.js'

const router = express.Router()

/**
 * Questa API permette di creare una nuova nota in uno spazio specifico
 */
router.post('/crea', async (req, res) => {
    const { email, nomeNota, spazioNota } = req.body

    try {
        const user_id = getIdFromEmail(email)

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