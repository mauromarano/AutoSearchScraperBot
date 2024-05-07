const cheerio = require('cheerio')
const axios = require('axios')
const DB = require('./database')
const Telegram = require('./telegram')

const urls = [
    // land cruiser italia 5 porte  max 10.000€
	'https://www.autoscout24.it/lst/toyota/land-cruiser?atype=C&cy=I&damaged_listing=exclude&desc=1&doorfrom=4&doorto=5&powertype=hp&priceto=10000&search_id=1uije5iveul&sort=age&source=detailsearch&ustate=N%2CU',
    // pajero 5 porte min 160 cv max 10.000€
    'https://www.autoscout24.it/lst/mitsubishi/pajero?atype=C&cy=I&damaged_listing=exclude&desc=1&doorfrom=4&doorto=5&powerfrom=118&powertype=hp&priceto=10000&search_id=sgxbr8ofyq&sort=age&source=detailsearch&ustate=N%2CU'
]

const base_url = 'https://www.autoscout24.it'

// Estrai tutti i link delle auto dall'url impostato sopra
async function get_links(url) {
    let source = await axios.get(url)
    source = source['data']

    const $ = cheerio.load(source)
    let cars = $('article')
    let links = []
    for (let car of cars) {
        let link = $(car).find('div > a').attr('href')
        links.push(base_url + link)
    }
    return (links)
}

// estrae le informazioni delle singole auto a partire dall'url della singola auto
async function get_car_data(url) {

    let source = await axios.get(url)
    source = source['data']

    const $ = cheerio.load(source)
    const data = {}

    data['url'] = url;

    // car: 'Toyota Land Cruiser'
    data['car'] = $('h1 > div > span').text()

    // details: 'Land Cruiser kdj95 5p 3.0 GX'
    data['details'] = $('h1 > div:eq(1)').text()

    // price: '€ 10.900'
    data['price'] = $('[class*="SuperDeal_highlightContainer"]').text().split(',')[0]
    if (data['price'] == '') {
        data['price'] = $('[class*="PriceInfo_price"]').text().split(',')[0]
    }
    data['price'] = await clean_price(data['price'])

    // location: 'Travagliato - Brescia - Bs, IT'
    data['location'] = $('[class*="LocationWithPin"]').text()

    // chilometraggio: '490.000 km',
    // 'Tipo di cambio': 'Automatico',docker
    // anno: '06/2003',
    // Carburante: 'Diesel',
    // Potenza: '120 kW (163 CV)',
    // Venditore: 'Rivenditore',
    const divs = $('[class*=VehicleOverview_containerMoreThanFourItems] > div')
    for (div of divs) {
        let title = $(div).find('[class*=VehicleOverview_itemTitle]').text().toLowerCase()
        if (title == "tipo di cambio") {
            title = "cambio"
        }
        let value = $(div).find('[class*=VehicleOverview_itemText]').text()
        data[title] = value
    }

    // array di immagini
    data['image_url'] = await get_image_url($)

    // Descrizione del veicolo
    data['seller_note'] = $('[class*="SellerNotesSection_content"]').text()

    data['car_id'] = await get_car_id(url)

    return (data)
}

// estrae tutti i link dall'url impostato sopra, estrae tutte le informazioni di ogni singola auto
// e ritorna un array con tutti i dati
async function get_data(url) {
    let links = await get_links(url)
    let promises = []
    for (link of links) {
        promises.push(get_car_data(link))
    }
    const result = await Promise.all(promises)
    return (result)
}

async function get_image_url($) {
    const regex = /120x90/gm;
    const subst = `1920x1080`;
    const result = []
    let images = $('.image-gallery-thumbnail')
    for (image of images) {
        let url = String($(image).find('img').attr('src'))

        if (url != 'undefined') {
            url = url.replace(regex, subst);
            result.push(url)
        }
    }
    return result

}

async function get_car_id(url) {
    const pattern = /-(.{8}-.{4}-.{4}-.{4}-.{12})\??/gm;
    let regex = new RegExp(pattern);
    let result = regex.exec(url)

    return (result[1])
}


async function make_message(car) {
    return `*${car.car} - ${car.details}* _ \n${car.location}_\n${car.price}€ - ${car.chilometraggio} - ${car.anno}\n[URL Annuncio](${car.url})\n*Descrizione*:\n_${car.seller_note}_`
}

async function send_images(images) {
    for (image of images) {
        await Telegram.sendPhoto(image)
    }
}

// pulisce il prezzo eliminando il simbolo dell'euro, gli spazi vuoti ed i punti
async function clean_price(price) {
    return price.replace(/^./gm, "").replace(/\./gm, "").replace(/\s/gm, "")
}

async function main() {

    for (url of urls) {
        cars = await get_data(url)
        for (car of cars) {
            if (await DB.is_new(car.car_id) == true) {
                await DB.insert(car)
                let message = await make_message(car)

                await Telegram.send_maessage(message)
                await send_images(car.image_url)
            }
	   else{
			console.log('Auto già presente nel database');
		}
        }
    }

}

main();
