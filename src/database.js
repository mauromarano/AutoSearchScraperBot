const postgres = require('postgres');
const config = require('./config')

const user = config.user
const password = config.password
const host = config.host
const db_name = config.db_name


const sql = postgres (`postgres://${user}:${password}@${host}:5432/${db_name}`) 

async function insert(car){
    if (await is_new(car.car_id) == true){
        await sql `insert into cars (car, details, price, location, chilometraggio, cambio, carburante, potenza, venditore, seller_note, car_id, image_url, anno, url) values (${car.car}, ${car.details}, ${car.price}, ${car.location}, ${car.chilometraggio}, ${car.cambio}, ${car.carburante}, ${car.potenza}, ${car.venditore}, ${car.seller_note}, ${car.car_id}, ${car.image_url}, ${car.anno}, ${car.url})`
        console.log('Record inserito nel database.')
    }
    else{
        console.log(`L'id ${car.car_id} è già presente nel database`)
    }
}


async function is_new(car_id){
    const cars = await sql `select * from cars where car_id = ${car_id}`
    if(cars.length >0){
        return false
    }
    return true
}

 async function retrive(){
    const cars = await sql `select * from cars`
    return cars
 }

async function update_price(price, car_id){
    await sql `UPDATE cars SET price=${price} WHERE car_id=${car_id}`
}


module.exports = {
    is_new,
    insert,
    retrive,
    update_price
}
