import express from 'express'
//import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'
import spaceRouter from './routes/space.js'
import noteRouter from './routes/note.js'
import tagRouter from './routes/tag.js'
import aiRouter from './routes/ai.js'

const app = express()

// Middleware per parsare il JSON
app.use(express.json())

//app.use('/api/utenti', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/spazi', spaceRouter)
app.use('/api/note', noteRouter)
app.use('/api/tag', tagRouter)
app.use('/api/ai', aiRouter)

// Avvio il server
app.listen(4000, () => {
    console.log(`Server avviato correttamente su http://localhost:4000`)
})