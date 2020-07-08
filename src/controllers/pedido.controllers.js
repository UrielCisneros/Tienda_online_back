const pedidoCtrl = {};

const pedidoModel = require('../models/Pedido');

pedidoCtrl.getPedidos = async (req, res, next) => {
    try {
        const pedidos = await pedidoModel.find().populate('cliente').populate({
            path: 'pedido.producto',
            model: 'producto'
        });
        res.json(pedidos);
    } catch (error) {
        res.send({ message: 'Ups, algo paso al obtenero el pedidos', error });
        next();
    }
}

pedidoCtrl.getPedido = async (req, res, next) => {
    try {
        const pedidos = await pedidoModel.findById(req.params.id).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'producto'
        });
        res.json(pedidos);
    } catch (error) {
        res.send({ message: 'Ups, algo paso al obtenero el pedidos', error });
        next();
    }
}

pedidoCtrl.getPedidosUser = async (req, res, next) => {
    try {
        const pedidosUser = await pedidoModel.find({ cliente: req.params.id });
        res.json(pedidosUser);
    } catch (error) {
        res.send({ message: 'Ups, algo paso al obtenero el pedidos', error });
    }
}

pedidoCtrl.createPedido = async (req, res, next) => {
    const newpedido = new pedidoModel(req.body);
    newpedido.pagado = false;
    try {
        await newpedido.save((err, userStored) => {
            if (err) {
                res.send({ message: 'Ups, algo paso al registrar el usuario', err });
            } else {
                if (!userStored) {
                    res.send({ message: 'Error al crear el Pedodo' });
                } else {
                    res.json({ message: "Se agrego el pedido" });
                }
            }
        });
    } catch (error) {
        console.log(error);
        next();
    }
}

pedidoCtrl.updateEstadoPedido = async (req, res, next) => {
    try {
        const {estado_pedido,mensaje_admin} = req.body;
        if(estado_pedido === "Enviado"){
            const pedido = await pedidoModel.findByIdAndUpdate({ _id: req.params.id }, {
                fecha_envio: new Date(),
                estado_pedido,
                mensaje_admin
            }, { new: true });
            console.log(pedido);
            res.send({ message: 'Pedido Actualizado'});
        }else{
            const pedido = await pedidoModel.findByIdAndUpdate({ _id: req.params.id }, {
                mensaje_admin
            }, { new: true });
            console.log(pedido);
            res.send({ message: 'Mensaje del pedido actualizado'});
        }
    } catch (error) {
        res.send({ message: 'Ups, algo paso al obtenero el pedidos', error });
        next();
    }
}

module.exports = pedidoCtrl;