const pagoCtrl = {};
const pagoModel = require('../models/Pago');

pagoCtrl.createPago = async (req, res) => {
    try {
        const newPago = new pagoModel(req.body);
        await newPago.save((err, postStored) => {
            if (err) {
                res.send({ message: "Error en el servidor" })
            } else {
                if (!postStored) {
                    res.send({ messege: "No se a podido crear el Pago" });
                } else {
                    res.send({ messege: "Pago creado correctamente",postStored });
                }
            }
        });

    } catch (error) {
        console.log(error);
    }

}

module.exports = pagoCtrl;
