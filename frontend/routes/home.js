import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import rssParser from 'rss-parser'

const router = express.Router()
const API_URL = 'http://localhost:4000'

// Per le notizie RSI, parser = legge una stringa e lo trasforma in dati strutturati
const RSI_FEED = 'https://www.rsi.ch/info/ticino-grigioni-e-insubria/?f=rss'
const RSI = async () => {
    const parser = new rssParser({
        customFields: {
            item: ['media:content', 'media:thumbnail', 'enclosure']
        }
    })
    try {
        const feed = await parser.parseURL(RSI_FEED)
        return feed.items.slice(0, 20).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }),
            immagine: item['media:content']?.$.url
                   || item['media:thumbnail']?.$.url
                   || item.enclosure?.url
                   || null
        }))
    } catch (e) {
        console.error('Errore RSS RSI:', e.message)
        return []
    }
}

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/spazi/tutti`, {
            method: 'POST',
            headers: { 'email': req.session.email }
        })
        const spazi = await response.json()

        const news = await RSI()

        res.render('pages/home', { spazi, news })
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Errore proveniente dal server backend')
    }
})

export default router