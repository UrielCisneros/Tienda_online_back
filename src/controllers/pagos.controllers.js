const pagoCtrl = {};
const pagoModel = require('../models/Pago');

pagoCtrl.createPago = async (req, res) => {
    try {
        const newPago = new pagoModel(req.body);
        await newPago.save((err, postStored) => {
            if (err) {
                res.status(500).send({ code: 500, message: "Error en el servidor" })
            } else {
                if (!postStored) {
                    res.status(400).send({ code: 400, messege: "No se a podido crear el Blog" });
                } else {
                    res.status(200).send({ code: 200, messege: "Blog creado correctamente" });
                }
            }
        });

    } catch (error) {
        console.log(error);
    }

}

module.exports = pagoCtrl;
