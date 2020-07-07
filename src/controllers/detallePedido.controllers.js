const detalleCtrl = {};
const detalleModel = require('../models/DetallePedido');
const productoModel = require('../models/Producto');
const pedidoModel = require('../models/Pedido');


detalleCtrl.createDetalle = async (req,res) => {
    const {id_pedido} = req.body;

    const newDetalle = new detalleModel(req.body);
    await newDetalle.save((err, postStored) => {
        if (err) {
            res.send({ message: 'Error al crear el detalle' })
            throw err;
        } else {
            if (!postStored) {
                res.send({ message: 'Error al crear el detalle' })
                throw err;
            }
        }
    });
    if(newDetalle){
        const pedidoBase = await pedidoModel.findById(id_pedido)
        pedidoBase.pedido.map(async (pedido) => {
            console.log(pedido)
            if(pedido.talla){
                const producto = await productoModel.findById(pedido.producto);
                producto.tallas.map(async (talla) => {
                    if(talla.talla == pedido.talla){
                        if(talla.cantidad == '0' || talla.cantidad < pedido.cantidad){
                            res.send({ message: 'No exixten suficientes en el inventario' })
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
                                }, (err, response) => {
                                    if (err) {
                                        res.send({ message: 'Ups algo paso al restar la talla' })
                                        throw err;
                                    } else {
                                        if (!response) {
                                            res.send({ message: 'Ups algo paso al restar la talla' })
                                            throw err;
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
                            res.send({ message: 'No exixten suficientes en el inventario' })
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
                                        res.send({ message: 'Ups algo paso al restar la talla' })
                                        throw err;
                                    } else {
                                        if (!response) {
                                            res.send({ message: 'Ups algo paso al restar la talla' })
                                            throw err;
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
                    res.send({ message: 'No exixten suficientes en el inventario' })
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
        res.send({ message: 'Detalle de venta creado' })
    }

}

detalleCtrl.getDetalle = async (req,res) => {
    try {
        const detalle = await detalleModel.find().populate('id_pedido').populate('id_pago').populate('cliente');
        res.json(detalle);
    } catch (error) {
        res.send({ messege: 'Ups, algo paso al obtenero el pedidos', error });
        next();
    }
}

detalleCtrl.getDetalleUser = async (req, res) => {
    try {
        console.log(req.params.idUser);
        const DetalleUser = await detalleModel .find({ cliente: req.params.idUser });
        res.json(DetalleUser);
    } catch (error) {
        res.send({ messege: 'Ups, algo paso al obtenero el pedidos', error });
    }
}

module.exports = detalleCtrl;