const pagoCtrl = {};
const pagoModel = require('../models/Pago');
const Stripe = require('stripe');

pagoCtrl.createPago = async (req, res) => {
    try {
        const {sesionStripe,pedidoCompleto,amount} = req.body;
        const stripe = new Stripe(process.env.LLAVE_SECRETA_STRIPE);

       const payment = await stripe.paymentIntents.create({
            amount,
            currency:"MXN",
            description: pedidoCompleto._id,
            payment_method: sesionStripe.id,
            confirm:true
        })

        res.status(200).json({ message: "Pago realzado",payment });
        
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
