const pagoCtrl = {};
const pagoModel = require('../models/Pago');

pagoCtrl.createPago = async (req, res) => {
    try {

        console.log(req.body);
/*         const newPago = new pagoModel(req.body);
        await newPago.save((err, postStored) => {
            if (err) {
                res.status(500).json({ message: "Error en el servidor" })
            } else {
                if (!postStored) {
                    res.status(404).json({ message: "No se a podido crear el Pago" });
                } else {
                    res.status(200).json({ message: "Pago creado correctamente",postStored });
                }
            }
        }); */

    } catch (err) {
        res.status(500).json({ message: "Error en el servidor",err });	
        console.log(err);
    }

}

module.exports = pagoCtrl;
