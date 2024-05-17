const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
var cors = require('cors')

//conexion a la db
try {
    mongoose.connect(process.env.DATABASE_URL, { dbName: process.env.MONGO_DB })
    const database = mongoose.connection
    database.on('error', (error) => {
        console.log(error)
    })
    database.on('connected', () => {
        console.log('Conexión a la Db exitosa')
    })
} catch (error) {
    console.log(error)
}
//fin de la conexion a la db

const app = express()
app.use(cors())
app.use(express.json())
const ahorroRoutes = require('./src/routes/ahorro.routes')

app.get('/', async (resquest, response) => {
    response.status(200).json({ mensaje: "Hola mundo" })
})

app.use('/api/ahorros', ahorroRoutes) // api/ahorros
//app.use(express.json())

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto ' + 3000)
    console.log("http://127.0.0.1:3000")
    fecha = new Date()
    console.log(fecha)
})