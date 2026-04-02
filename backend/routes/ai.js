import OpenAI from "openai"
import express from "express"
import { getIdFromEmail } from '../utilities/utility.js'

const router = express.Router()

const client = new OpenAI({
    apiKey: '',
})

// Logica per il bottone "AI" nella pagina delle note
router.post('/ai', async (req, res) => {
    const { email, context } = req.body
    try {
        const user_id = await getIdFromEmail(email)
        if(!user_id) return res.status(403).json({ errore: 'Non autorizzato' })

        const prompt = "Sistema i seguenti appunti controllando se ci sono errori e sintetizzali meglio: " + context

        const response = await client.responses.create({
            model: "gpt-4.1",
            input: prompt,
        })

        const text = response.output[0].content[0].text
        res.json({ result: text })
    } catch (e) {
        console.error(e)
        res.status(500).json({ errore: 'Errore proveniente dal server (OpenAI)' })
    }
})

export default router