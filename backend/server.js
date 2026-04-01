import express from 'express'
import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'

const app = express()

// Middleware per parsare il JSON
app.use(express.json())

app.use('/api/utenti', userRouter)
app.use('/api/auth', authRouter)

// Avvio il server
app.listen(4000, () => {
    console.log(`Server avviato correttamente su http://localhost:4000`)
})