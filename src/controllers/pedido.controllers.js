const pedidoCtrl = {};

const pedidoModel = require('../models/Pedido');

pedidoCtrl.getPedidos = async (req, res, next) => {
    try {
        const pedidos = await pedidoModel.find().populate('cliente').populate({
            path: 'pedido.producto',
            model: 'producto'
        });
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ message: 'Ups, algo paso al obtenero el pedidos', err });
        next();
    }
}
pedidoCtrl.getPedidosAdmin = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
		const options = {
			page,
            limit: parseInt(limit),
            populate: ['cliente', { path: 'pedido.producto', model: 'producto'}]
		}
        const pedidos = await pedidoModel.paginate({pagado: true}, options);
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ message: 'Ups, algo paso al obtenero el pedidos', err });
        next();
    }
}
pedidoCtrl.getPedidosAdminFiltrados = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, filtro } = req.query;
		const options = {
			page,
            limit: parseInt(limit),
            populate: ['cliente', { path: 'pedido.producto', model: 'producto'}]
		}
        const pedidos = await pedidoModel.paginate({pagado: true, estado_pedido: filtro}, options);
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ message: 'Ups, algo paso al obtenero el pedidos', err });
        next();
    }
}

pedidoCtrl.getPedido = async (req, res, next) => {
    try {
        const pedidos = await pedidoModel.findById(req.params.id).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'producto'
        });
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ message: 'Ups, algo paso al obtenero el pedidos', err });
        next();
    }
}

pedidoCtrl.getPedidosUser = async (req, res, next) => {
    try {
        const pedidosUser = await pedidoModel.find({ cliente: req.params.id });
        res.status(200).json(pedidosUser);
    } catch (err) {
        res.status(500).json({ message: 'Ups, algo paso al obtenero el pedidos', err });
    }
}

pedidoCtrl.createPedido = async (req, res, next) => {
    const newpedido = new pedidoModel(req.body);
    newpedido.pagado = false;
    newpedido.estado_pedido = "En proceso";
    newpedido.mensaje_admin = "Tu pedido esta siendo procesado";
    try {
        await newpedido.save((err, userStored) => {
            if (err) {
                res.status(500).json({ message: 'Ups, algo paso al registrar el usuario', err });
            } else {
                if (!userStored) {
                    res.status(404).json({ message: 'Error al crear el Pedodo' });
                } else {
                    res.status(200).json({ message: "Se agrego el pedido" });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Ups, algo paso al registrar el usuario', err });
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
            res.status(200).json({ message: 'Pedido Actualizado'});
        }else{
            const pedido = await pedidoModel.findByIdAndUpdate({ _id: req.params.id }, {
                mensaje_admin
            }, { new: true });
            console.log(pedido);
            res.status(200).json({ message: 'Mensaje del pedido actualizado'});
        }
    } catch (err) {
        res.status(500).json({ message: 'Ups, algo paso al obtenero el pedidos', err });
        next();
    }
}

module.exports = pedidoCtrl;