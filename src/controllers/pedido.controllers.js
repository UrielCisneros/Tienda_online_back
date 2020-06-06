const pedidoCtrl = {};

const pedidoModel = require('../models/Pedido');
const clienteModel = require('../models/Cliente');

pedidoCtrl.createPedido = async (req, res) => {
    const { cliente, referencia, total, fecha_creacion } = req.body;
    const datosCliente = await clienteModel.findById(cliente);
    console.log(datosCliente);
}

pedidoCtrl.updateEstadoPedido = (req, res) => {

}

pedidoCtrl.updateMensajePedido = (req, res) => {

}

module.exports = pedidoCtrl;