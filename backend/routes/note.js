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

/**
 * Questa API permette di aggiungere un nuovo tag alla nota
 */

/**
 * Questa API permette di rimuovere un tag alla nota
 */

/**
 * Questa API popola la sezione delle note con:
 *      - title
 *      - context
 *      - modified_date
 */
router.post('/popolaNote', async (req, res) => {
    const { email, note_id } = req.body

    try {
        const user_id = getIdFromEmail(email)

        // Controllo se l'utente è il proprietario di quello spazio
        const check_space = await sql('SELECT * FROM bn_space WHERE id = ? && user_id = ?', [space_id, user_id])
        if (check_space[0].user_id == user_id) {
            const data = await sql('SELECT title, context, modified_date FROM bn_note WHERE id = ?', [note_id])
            res.json(data)
        } else {
            res.status(500).json({ errore: 'Errore proveniente dal server' })
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

/**
 * Questa API permette di cambiare lo spazio di una nota (verificando che l'email in sessione è proprietaria di esso)
 */
router.post('/cambiaSpazio', async (req, res) => {
    const { email, space_id, note_id } = req.body

    try {
        const user_id = getIdFromEmail(email)

        // Controllo se l'utente è il proprietario di quello spazio
        const check_space = await sql('SELECT * FROM bn_space WHERE id = ? && user_id = ?', [space_id, user_id])
        if (check_space[0].user_id == user_id) {
            await sql('UPDATE bn_note SET space_id = ? WHERE id = ?', [space_id, note_id])
        } else {
            res.status(500).json({ errore: 'Errore proveniente dal server' })
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

/**
 * Questa API permette di modificare il testo e/o il nome di una nota
 */
router.post('/modifica', async (req, res) => {
    const { email, title, context, note_id } = req.body

    try {
        const user_id = getIdFromEmail(email)
        await sql('UPDATE bn_note SET title = ?, context = ? WHERE user_id = ? && id = ?', [title, context, user_id, note_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

/**
 * Questa API permette di eliminare una nota
 */
router.post('/elimina', async (req, res) => {
    const { email, note_id } = req.body

    try {
        const user_id = getIdFromEmail(email)
        await sql('DELETE FROM bn_note WHERE user_id = ? && id = ?', [user_id, note_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

export default router