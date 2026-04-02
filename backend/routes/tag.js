import express from 'express'
import { sql } from './../../database/db-utilities.js'
import { getIdFromEmail, isTagOwner, isNoteOwner, noteHasTag } from '../utilities/utility.js'

const router = express.Router()

router.post('/crea', async (req, res) => {
    const { email, nome } = req.body
    try {
        const user_id = await getIdFromEmail(email) 
        await sql('INSERT INTO bn_tag (name, user_id) VALUES (?, ?)', [nome, user_id])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/modifica', async (req, res) => {
    const { email, nome, tag_id } = req.body
    try {
        const user_id = await getIdFromEmail(email)  
        await sql('UPDATE bn_tag SET name = ? WHERE user_id = ? AND id = ?', [nome, user_id, tag_id])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/elimina', async (req, res) => {
    const { email, tag_id } = req.body
    try {
        const user_id = await getIdFromEmail(email)  
        await sql('DELETE FROM bn_tag WHERE user_id = ? AND id = ?', [user_id, tag_id])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/popolaTag', async (req, res) => {
    const { email } = req.body
    try {
        const user_id = await getIdFromEmail(email)
        const tags = await sql('SELECT id, name FROM bn_tag WHERE user_id = ?', [user_id])
        res.json(tags)
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/popolaTagInNota', async (req, res) => {
    const { email, note_id } = req.body
    try {
        // Verifico se sono il proprietario del tag e della nota
        const user_id = await getIdFromEmail(email)
        if (!await isNoteOwner(note_id, user_id))
            return res.status(403).json({ errore: 'Non autorizzato' })

        const tags = await sql('SELECT tag_id FROM bn_note_tag WHERE note_id = ?', [note_id])
        res.json(tags)
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/aggiorna', async (req, res) => {
    const { email, tag_id, note_id, checked } = req.body

    try {
        const user_id = await getIdFromEmail(email)
        if (!await isNoteOwner(note_id, user_id))
            return res.status(403).json({ errore: 'Non autorizzato' })
        if (!await isTagOwner(tag_id, user_id))
            return res.status(403).json({ errore: 'Non autorizzato' })

        if (checked) {
            await sql('INSERT INTO bn_note_tag (note_id, tag_id) VALUES (?, ?)', [note_id, tag_id])
        } else {
            await sql('DELETE FROM bn_note_tag WHERE note_id = ? AND tag_id = ?', [note_id, tag_id])
        }

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

export default router