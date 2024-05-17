const mongoose = require('mongoose')

const ahorroSchema = new mongoose.Schema(
    {
        nombre: String,
        clienteId: String,
        clienteNombre: String,
        nota: String,
        total: Number,
        totalDeDepositos: Number,
        totalDeRetiros: Number,
        guid: String,
        id: Number,
        tipoDeCuenta: String,
        interes: Number,
        depositos: [
            {
                cantidad: Number,
                id: String,
                fechaDeRegistro: Date,
                concepto: String,
                referencia: String
            }
        ],
        retiros: [
            {
                cantidad: Number,
                id: String,
                fechaDeRegistro: Date,
                concepto: String,
                referencia: String
            }
        ],
    }
)

const depositoSchema = new mongoose.Schema()

module.exports = mongoose.model('Ahorro', ahorroSchema)