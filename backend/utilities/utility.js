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