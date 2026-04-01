import express from 'express'
import { sql } from './../../database/db-utilities.js'
import { getIdFromEmail } from '../utilities/utility.js'

const router = express.Router()

/**
 * Questa API permette di creare un tag
 */
router.post('/crea', async (req, res) => {
    const { email, nome } = req.body

    try {
        const user_id = getIdFromEmail(email)
        await sql('INSERT INTO bn_tag (name, user_id) VALUES (?, ?)', [nome, user_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

/**
 * Questa API permette di modificare il nome di un tag
 */
router.post('/modifica', async (req, res) => {
    const { email, nome, tag_id } = req.body

    try {
        const user_id = getIdFromEmail(email)
        await sql('UPDATE bn_tag SET name = ? WHERE user_id = ? && id = ? ', [nome, user_id, tag_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

/**
 * Questa API permette di eliminare un tag
 */
router.post('/elimina', async (req, res) => {
    const { email, tag_id } = req.body

    try {
        const user_id = getIdFromEmail(email)
        await sql('DELETE FROM bn_tag WHERE user_id = ? && id = ? ', [user_id, tag_id])

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})


export default router