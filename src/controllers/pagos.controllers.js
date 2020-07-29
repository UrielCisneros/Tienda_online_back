const pagoCtrl = {};
const pagoModel = require('../models/Pago');

pagoCtrl.createPago = async (req, res) => {
    try {
        const newPago = new pagoModel(req.body);
        await newPago.save((err, postStored) => {
            if (err) {
                res.status(500).send({ message: "Error en el servidor" })
            } else {
                if (!postStored) {
                    res.status(404).send({ message: "No se a podido crear el Pago" });
                } else {
                    res.status(200).send({ message: "Pago creado correctamente",postStored });
                }
            }
        });

    } catch (error) {
        console.log(error);
    }

}

module.exports = pagoCtrl;
