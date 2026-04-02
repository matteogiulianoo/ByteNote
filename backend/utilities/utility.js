import express from 'express'
import { sql } from './../../database/db-utilities.js'

/**
 * Prendo l'id di un utente nel database tramite un'e-mail
 * @param {*} email 
 */
export async function getIdFromEmail(email) {
    try {
        const rows = await sql('SELECT id FROM bn_user WHERE email = ?', [email])
        if (rows.length === 0) return res.status(401).json({ errore: 'Utente non trovato' })

        const user_id = rows[0].id
        return user_id;
    } catch (e) {
        console.error(e);
    }
}

export async function isNoteOwner(note_id, user_id) {
    const res = await sql('SELECT 1 FROM bn_note n JOIN bn_space s ON n.space_id = s.id WHERE n.id = ? AND s.user_id = ?', [note_id, user_id])
    return res.length > 0
}

export async function isTagOwner(tag_id, user_id) {
    const res = await sql('SELECT 1 FROM bn_tag WHERE id = ? AND user_id = ?', [tag_id, user_id])
    return res.length > 0
}

export async function noteHasTag(note_id) {
    const res = await sql('SELECT 1 FROM bn_note_tag WHERE note_id = ?', [note_id])
    return res.length > 0
}