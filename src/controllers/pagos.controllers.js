const pagoCtrl = {};
const pagoModel = require('../models/Pago');
const Stripe = require('stripe');
const productoModel = require('../models/Producto');
const pedidoModel = require('../models/Pedido');
const Carrito = require('../models/Carrito');

pagoCtrl.createPago = async (req, res) => {
    try {
        const {sesionStripe,pedidoCompleto,amount} = req.body;
        const stripe = new Stripe(process.env.LLAVE_SECRETA_STRIPE);
        console.log(req.body);
        let sesion = "";
        if(sesionStripe.id){
            sesion = sesionStripe.id;
        }else{
            sesion = sesionStripe.tokenId;
        }

       const payment = await stripe.paymentIntents.create({
            amount,
            currency:"MXN",
            description: pedidoCompleto._id,
            payment_method_types: ['card'], 
            payment_method: sesion,
            confirm:true
        })

        console.log(payment);

        if(payment){
            const newPago = new pagoModel({
                id_objeto_sesion_stripe: sesionStripe.id,
                intento_pago: payment.id,
                pedido: pedidoCompleto._id,
                cliente: pedidoCompleto.cliente._id
            });
            await newPago.save(async (err, postStored) => {
                if (err) {
                    res.status(500).json({ message: "Error en el servidor" })
                } else {
                    if (!postStored) {
                        res.status(404).json({ message: "No se a podido crear el Pago" });
                    } else {
                        const pedidoBase = await pedidoModel.findById(pedidoCompleto._id)
                        pedidoBase.pedido.map(async (pedido) => {
                            if(pedido.talla){
                                const producto = await productoModel.findById(pedido.producto);
                                producto.tallas.map(async (talla) => {
                                    if(talla.talla == pedido.talla){
                                        if(talla.cantidad == '0' || talla.cantidad < pedido.cantidad){
                                            res.status(500).send({ message: 'No existen suficientes productos en el inventario' })
                                            throw talla.cantidad;
                                        }else{
                                            let cantidad = talla.cantidad - pedido.cantidad;
                                            await productoModel.updateOne(
                                                {
                                                    'tallas._id': talla._id
                                                },
                                                {
                                                    $set: { 'tallas.$': { 
                                                        talla: talla.talla, 
                                                        cantidad: cantidad } }
                                                }, async (err, response) => {
                                                    if (err) {
                                                        res.status(500).send({ message: 'Ups algo paso al restar la talla' })
                                                        throw err;
                                                    } else {
                                                        if (!response) {
                                                            res.status(500).send({ message: 'Ups algo paso al restar la talla' })
                                                            throw err;
                                                        }else{
                                                            const productoNuevo = await productoModel.findById(pedido.producto);
                                                            console.log(productoNuevo);
                                                            let contador = 0;
                                                            for(let i = 0; i <= productoNuevo.tallas.length; i++){
                                                                console.log(productoNuevo.tallas[i]);
                                                                contador += productoNuevo.tallas[i].cantidad;
                                                            }
                                                            console.log(contador);
    /*                                                         console.log(verificarArreglo(productoNuevo.tallas));
                                                            if(verificarArreglo(productoNuevo.tallas) === 0){
                                                                productoNuevo.activo  = false;
                                                                await productoModel.findByIdAndUpdate(productoNuevo._id,productoNuevo);
                                                            } */
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    }
                                }) 
                            }else if(pedido.numero){
                                const producto = await productoModel.findById(pedido.producto);
                                producto.numeros.map(async (numero) => {
                                    if(numero.numero == pedido.numero){
                                        if(numero.cantidad == '0' || numero.cantidad < pedido.cantidad){
                                            res.status(500).send({ message: 'No existen suficientes productos en el inventario' })
                                            throw numero.cantidad;
                                        }else{
                                            let cantidad = numero.cantidad - pedido.cantidad;
                                            await productoModel.updateOne(
                                                {
                                                    'numeros._id': numero._id
                                                },
                                                {
                                                    $set: { 'numeros.$': { 
                                                        numero: numero.numero, 
                                                        cantidad: cantidad } }
                                                }, (err, response) => {
                                                    if (err) {
                                                        res.status(500).send({ message: 'Ups algo paso al restar la talla' })
                                                        throw err;
                                                    } else {
                                                        if (!response) {
                                                            res.status(500).send({ message: 'Ups algo paso al restar la talla' })
                                                            throw err;
                                                        }else{
                                                            
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    }
                                }) 
                            }else{
                                const producto = await productoModel.findById(pedido.producto);
                                const newProducto = producto;
                                if(producto.cantidad == 0 || producto.cantidad < pedido.cantidad){
                                    res.status(500).send({ message: 'No exixten suficientes en el inventario' })
                                    throw error;
                                }else{
                                    newProducto.cantidad = parseInt(producto.cantidad) - parseInt(pedido.cantidad);
                                    await productoModel.findByIdAndUpdate(pedido.producto, newProducto,(err, userStored) => {
                                       if (err) {
                                           throw userStored;
                                       } else {
                                           if (!userStored) {
                                               throw userStored;
                                           }
                                       }
                                   });
                                }
                            }
                        })
                        if(pedidoCompleto.carrito === true){
                            await Carrito.findOneAndDelete({ cliente: pedidoCompleto.cliente._id });
                        }
                        const pedidoPagado = await pedidoModel.findById(pedidoCompleto._id);
                        pedidoPagado.pagado = true;  
                         await pedidoModel.findByIdAndUpdate({ _id: pedidoPagado._id },pedidoPagado, { new: true },(err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Ups, parece que algo salio mal', err });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({ message: 'Error al actualizar pedido' });
                                } else {
                                    res.status(200).json({ message: "Pago realzado con exito" });
                                }
                            }
                        });
                    }
                }
            });
        }else{
            res.status(404).json({ message: "No se a podido crear el Pago" });
        }

    } catch (err) {
        res.status(500).json({ message: "Error en el servidor",err });	
        console.log(err);
    }

}

pagoCtrl.obtenerPagosCliente = async (req, res) => {
	try {
        const pagos = await pagoModel.find({cliente: req.params.idCliente}).populate('pedido cliente');
		res.status(200).json(pagos);
	} catch (err) {
		res.status(500).json({ message: 'Error en el servidor', err });
		next();
	}
};

module.exports = pagoCtrl;
