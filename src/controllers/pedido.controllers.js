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
        console.log(error);
        next();
    }
}


pedidoCtrl.getPedidosUser = async (req, res, next) => {
    try {
        const pedidosUser = await pedidoModel.find({ cliente: req.params.id });
        res.json(pedidosUser);
    } catch (error) {
        console.log(error);
    }
}

pedidoCtrl.createPedido = async (req, res, next) => {
    const pedido = new pedidoModel(req.body);
    try {
        await pedido.save();
        res.json({ messege: "Se agrego el pedido" });
    } catch (error) {
        console.log(error);
        next();
    }
}

pedidoCtrl.updateEstadoPedido = async (req, res, next) => {

    try {
        const pedido = await pedidoModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        console.log(pedido);
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = pedidoCtrl;