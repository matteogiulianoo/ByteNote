import express from 'express'

const router = express.Router()

router.post('/login', (req, res) => {
    const { email, password } = req.body

    // Verififica con il database
})

export default router