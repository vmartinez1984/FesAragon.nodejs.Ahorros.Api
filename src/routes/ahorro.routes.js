const express = require('express')
const router = express.Router()
const ahorroModel = require('../models/ahorro.model')

//http://127.0.0.1:3000/api/ahorros
router.post('/', async (request, response) => {
    try {
        var ahorro00 = await obtenerAhorroPorId(request.body.id)
        console.log(ahorro00)
        if (ahorro00)
            return response.status(200).json(ahorro00)
        const { nombre, clienteId, nota, guid, tipoDeCuenta, interes } = request.body
        const ahorro = new ahorroModel({
            nombre,
            clienteId,
            nota,
            id: ((await ahorroModel.find().count()) + 1),
            guid,
            tipoDeCuenta,
            interes,
            total: 0,
            totalDeDepositos: 0,
            totalDeRetiros: 0
        })
        const ahorroNuevo = await ahorro.save()
        //console.log(ahorroNuevo)
        response.status(201).json(ahorroNuevo)
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: 'Ocurrio un error' })
    }
})

router.get('/', async (request, response) => {
    //response.status(200).json({"mensaje": "GET desde ahorro routes"})
    try {
        const ahorros = await ahorroModel.find()
        const ahorroDtos = []
        //console.log(ahorros)
        for (var i = 0; i < ahorros.length; i++) {
            var item = ahorros[i]
            ahorroDtos.push({
                "nombre": item.nombre,
                "total": item.total == undefined ? 0 : item.total,
                "nota": item.nota == undefined ? "" : item.nota,
                "id": item.id == undefined ? "" : item.id,
                "tipoDeCuenta": item.tipoDeCuenta == undefined ? "" : item.tipoDeCuenta
            })
        }
        // console.log('get all', ahorros)
        console.log(ahorroDtos)
        return response.status(200).json(ahorroDtos)
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: 'Ocurrio un error' })
    }
})

//http://127.0.0.1:3000/api/ahorros/6621aa852e10b0bcc468199c
router.get('/:id', async (request, response) => {
    try {
        let result
        result = await obtenerAhorroPorId(request.params.id)
        if(result == undefined)
            return response.status(200).json({mensaje: "No encontrado"})
        console.log(result)
        return response.status(200).json(result)
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: 'Ocurrio un error' })
    }
})

const obtenerAhorroPorId = async (id) => {
    let result
    if (id == 24)//6643b4c6e3187f6d28a62d7e
        result = await ahorroModel.findById(id);
    else if (id == 36)//06dc7a78-8f85-4983-b848-cedf003148f9
        result = await ahorroModel.findOne({ guid: id })
    else if (isNumeric(id))
        result = await ahorroModel.findOne({ id: id })
    else
        result = undefined

    return result
}

const isNumeric = n => !!Number(n);

//http://127.0.0.1:3000/api/ahorros/6621aa852e10b0bcc468199c
router.put('/:id', async (request, response) => {
    try {
        let ahorro = await ahorroModel.findById(request.params.id);
        ahorro.nombre = request.body.nombre
        ahorro.clienteId = request.body.clienteId
        ahorro.nota = request.body.nota
        const ahorroUpdate = await ahorro.save()

        return response.status(200).json(ahorroUpdate)
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: 'Ocurrio un error' })
    }
})

//http://127.0.0.1:3000/api/ahorros/6621aa852e10b0bcc468199c/depositos
router.post('/:id/depositos', async (request, response) => {
    try {
        console.log(new Date())
        console.log("/api/ahorros/" + request.params.id + "/depositos")
        console.log(request.body)
        let ahorro
        if (request.params.id.length == 24)
            ahorro = await ahorroModel.findById(request.params.id)
        else
            ahorro = await ahorroModel.findOne({ id: request.params.id })
        var depositoId = request.body.id;
        var deposito = ahorro.depositos.find(x => x.id == depositoId)
        if (deposito) {
            console.log("200", deposito)
            return response.status(200).json(deposito)
        }
        ahorro.totalDeDepositos += request.body.cantidad
        ahorro.total = ahorro.totalDeDepositos - ahorro.totalDeRetiros
        ahorro.depositos.push(request.body)
        const updatedBook = await ahorro.save()
        let ahorro201 = updatedBook.depositos.find(x => x.id == depositoId)
        console.log("201", ahorro201)

        return response.status(201).json(ahorro201)
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: 'Ocurrio un error' })
    }
})

router.post('/:id/retiros', async (request, response) => {
    try {
        console.log(new Date())
        console.log("/api/ahorros/" + request.params.id + "/retiros")
        console.log(request.body)
        let ahorro = await ahorroModel.findById(request.params.id)
        var retiroId = request.body.id;
        var retiro = ahorro.retiros.find(x => x.id == retiroId)
        if (retiro) {
            console.log("200", retiro)
            return response.status(200).json(retiro)
        }
        ahorro.totalDeRetiros += request.body.cantidad
        ahorro.total = ahorro.totalDeDepositos - ahorro.totalDeRetiros
        ahorro.retiros.push(request.body)
        const updatedBook = await ahorro.save()
        let retiro201 = updatedBook.retiros.find(x => x.id == retiroId)
        console.log("201", retiro201)

        return response.status(201).json(retiro201)
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: 'Ocurrio un error' })
    }
})

module.exports = router