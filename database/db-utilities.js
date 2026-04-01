import { connect } from './db-connection.js'

/**
 * Questa funzione esegue le query che li passiamo
 * @param {*} query 
 * @param {*} params 
 */
export async function sql(query, params = []) {
    const pool = connect()

    try {
        const [rows] = await pool.query(query, params)
        return rows
    } catch (err) {
        throw err
    }
}