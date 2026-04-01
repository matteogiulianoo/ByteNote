import express from 'express'
import { sql } from './../../database/db-utilities.js'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const rows = await sql('SELECT email, password_hash FROM bn_user WHERE email = ?', [email])
        if (rows.length === 0) return res.status(401).json({ errore: 'Credenziali non valide' })

        const user = rows[0]

        // Verifico la password
        const password_check = await bcrypt.compare(password, user.password_hash)
        if (!password_check) return res.status(401).json({ errore: 'Credenziali non valide' })

        res.json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Verifico se l'email all'interno del database esiste davvero
        const email_exist = await sql('SELECT id FROM bn_user WHERE email = ?', [email])
        if (email_exist.length > 0) return res.status(409).json({ errore: 'Email già registrata dentro il nostro sistema' })

        const hash_password = await bcrypt.hash(password, 10)
        await sql('INSERT INTO bn_user (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hash_password]
        )

        res.status(201).json({ successo: true })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server' })
    }
})

export default router