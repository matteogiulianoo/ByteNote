import express from 'express'
import { sql } from './../../database/db-utilities.js'
import { getIdFromEmail, isNoteOwner } from '../utilities/utility.js'

const router = express.Router()

router.post('/crea', async (req, res) => {
    const { email, nomeNota, spazioNota } = req.body
    try {
        const user_id = await getIdFromEmail(email) 

        const space = await sql('SELECT user_id FROM bn_space WHERE id = ?', [spazioNota])
        if (!space.length || space[0].user_id != user_id)
            return res.status(403).json({ errore: 'Non sei il proprietario di questo spazio' })

        await sql('INSERT INTO bn_note (title, space_id) VALUES (?, ?)', [nomeNota, spazioNota])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/aggiungiTagANota', async (req, res) => {
    const { email, note_id, tag_id } = req.body
    try {
        const user_id = await getIdFromEmail(email)
        if (!await isNoteOwner(note_id, user_id))  
            return res.status(403).json({ errore: 'Non autorizzato' })

        await sql('INSERT INTO bn_note_tag (note_id, tag_id) VALUES (?, ?)', [note_id, tag_id])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore server' })
    }
})

router.post('/rimuoviTagANota', async (req, res) => {
    const { email, note_id, tag_id } = req.body
    try {
        const user_id = await getIdFromEmail(email)
        if (!await isNoteOwner(note_id, user_id))  
            return res.status(403).json({ errore: 'Non autorizzato' })

        await sql('DELETE FROM bn_note_tag WHERE note_id = ? AND tag_id = ?', [note_id, tag_id])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore server' })
    }
})

router.post('/popolaNote', async (req, res) => {
    const { email, note_id } = req.body
    try {
        const user_id = await getIdFromEmail(email)
        if (!await isNoteOwner(note_id, user_id)) 
            return res.status(403).json({ errore: 'Non autorizzato' })

        const data = await sql('SELECT title, context, modified_date FROM bn_note WHERE id = ?', [note_id])
        res.json(data)
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/cambiaSpazio', async (req, res) => {
    const { email, space_id, note_id } = req.body
    try {
        const user_id = await getIdFromEmail(email)

        const check_space = await sql('SELECT id FROM bn_space WHERE id = ? AND user_id = ?', [space_id, user_id]) 
        if (!check_space.length)
            return res.status(403).json({ errore: 'Non sei il proprietario di questo spazio' })

        await sql('UPDATE bn_note SET space_id = ? WHERE id = ?', [space_id, note_id])
        res.json({ successo: true }) 
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/modifica', async (req, res) => {
    const { email, title, context, note_id } = req.body
    try {
        const user_id = await getIdFromEmail(email)
        if (!await isNoteOwner(note_id, user_id)) 
            return res.status(403).json({ errore: 'Non autorizzato' })

        await sql('UPDATE bn_note SET title = ?, context = ? WHERE id = ?', [title, context, note_id])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/elimina', async (req, res) => {
    const { email, note_id } = req.body
    try {
        const user_id = await getIdFromEmail(email)
        if (!await isNoteOwner(note_id, user_id))
            return res.status(403).json({ errore: 'Non autorizzato' })

        await sql('DELETE FROM bn_note WHERE id = ?', [note_id])
        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

export default router