const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

try{
    mongoose.connect(process.env.DATABASE_URL, { dbName: process.env.MONGO_DB})
    const database = mongoose.connection
    database.on('error', (error)=>{
        console.log(error)
    })
    database.on('connected', ()=>{
        console.log('Conexión a la Db exitosa')
    })
}catch(error){
    console.log(error)
}

const app = express()
app.use(express.json())
const ahorroRoutes = require('./src/routes/ahorro.routes')

app.use('/api/ahorros', ahorroRoutes) // api/ahorros
//app.use(express.json())

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto ' + 3000)
    console.log("http://127.0.0.1:3000")
    fecha = new Date()
    console.log(fecha)
})