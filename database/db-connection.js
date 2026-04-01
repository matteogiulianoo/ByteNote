import mysql from 'mysql2/promise'
import fs from 'fs'

const __dirname = import.meta.dirname

let pool

/**
 * Questa funzione permette la connessione al database di ByteNote
 */
export function connect() {
    if (pool) return pool

    const data = fs.readFileSync(__dirname + '/data.dat', 'utf-8')

    /*
        Questo pezzo di codice mi sono fatto aiutare dall'AI che mi ha spiegato come
        prendere i dati dal mio file data.dat
    */
    const config = {}
    for (const line of data.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('[')) continue
        const [key, value] = trimmed.split('=').map(s => s.trim())
        config[key] = value
    }

    pool = mysql.createPool({
        host:               config.host,
        user:               config.user,
        password:           config.password,
        database:           config.database,
        waitForConnections: true,
        connectionLimit:    10
    })

    return pool
}