const productosCtrl = {};
const Producto = require('../models/Producto');

productosCtrl.getProductos = async (req, res) => {
    const productos = await Producto.find();
    res.json(productos);
}


productosCtrl.createProducto = async (req, res) => {
    const { nombre, categoria, cantidad, precio, imagen, promocion, descripcion, estado = false } = req.body;
    const newProducto = new Producto({ nombre, categoria, cantidad, precio, imagen, promocion, descripcion, estado });
    await newProducto.save();
    res.json({ message: 'Producto almacenado' });
}

productosCtrl.getProducto = async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    res.json(producto);
}

productosCtrl.updateProducto = async (req, res) => {
    await Producto.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Producto actualizado' });
}

productosCtrl.updateProductoCantidad = async (req, res) => {
    const { cantidad, operacion } = req.body;
    const query = await Producto.findById(req.params.id).select('cantidad -_id');
    switch (operacion) {

        case "+":
            await Producto.findByIdAndUpdate(req.params.id, { $set: { cantidad: query.cantidad + cantidad } });
            res.json({ message: `Se sumaron ${cantidad} productos del stock ` });
            break;

        case "-":
            if (cantidad <= query.cantidad) {
                await Producto.findByIdAndUpdate(req.params.id, { $set: { cantidad: query.cantidad - cantidad } });
                res.json({ message: `Se restaron ${cantidad} productos del stock ` });
            } else {
                res.json({ message: 'Cantidad no disponible' });
            }
            break;

        default:
            res.json({ message: 'Se esperaba una operacion valida' })
            break;
    }

}

productosCtrl.deleteProducto = async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' })
}

module.exports = productosCtrl;