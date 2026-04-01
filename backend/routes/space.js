import express from 'express'
import { sql } from './../../database/db-utilities.js'
import { getIdFromEmail } from '../utilities/utility.js'

const router = express.Router()

/**
 * Questa API permette di recuperare tutti gli spazi di un utente specifico
 */
router.post('/tutti', async (req, res) => {
    const email = req.headers['email']

    try {
        const user_id = await getIdFromEmail(email)

        // Controllo se l'utente ha spazi
        const spaces = await sql("SELECT s.id, s.nome, s.descr, s.creation_date, JSON_ARRAYAGG(JSON_OBJECT('id', n.id, 'title', n.title)) AS note FROM bn_space s LEFT JOIN bn_note n ON n.space_id = s.id WHERE s.user_id = ? GROUP BY s.id", [user_id])
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
        const user_id = await getIdFromEmail(email)
        await sql('INSERT INTO bn_space (nome, descr, user_id) VALUES (?, ?, ?)', [nome, descr, user_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

/**
 * Questa API permette di modificare il nome o/e la descrizione di uno spazio
 */
router.post('/modifica', async (req, res) => {
    const { email, nome, descr, space_id } = req.body

    try {
        const user_id = await getIdFromEmail(email)
        await sql('UPDATE bn_space SET nome = ?, descr = ? WHERE user_id = ? AND id = ?', [nome, descr, user_id, space_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

/**
 * Questa API permette di eliminare uno spazio
 */
router.post('/elimina', async (req, res) => {
    const { email, space_id } = req.body

    try {
        const user_id = await getIdFromEmail(email)
        await sql('DELETE FROM bn_space WHERE user_id = ? AND id = ?', [user_id, space_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

export default router