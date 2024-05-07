const axios = require('axios')
const config = require('./config')

const url = `https://api.telegram.org/bot${config.token}`
const parse_mode = "Markdown"

// Manda un singolo messaggio tramite le api di telegram
async function send_maessage(message) {
    const u = `${url}/sendMessage`
    params = {
        "chat_id": config.chat_id,
        "text": message,
        "parse_mode": parse_mode
    }
    const result = await axios.post(u, params)
    return result
}

// Manda una singola immagine partendo da un url
async function sendPhoto(photo_url) {
    try {
        const u = `${url}/sendPhoto`;
        params = {
            "chat_id": config.chat_id,
            "photo": photo_url
        }
        const result = await axios.post(u, params)
        return result
    }
    catch (e) {
        console.log(`Impossibile mandare la foto con url ${photo_url}`, e)
    }

}


module.exports = {
    send_maessage,
    sendPhoto
}