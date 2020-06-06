const carritoCtrl = {};
const Carrito = require('../models/Carrito');

carritoCtrl.crearCarrito = async (req, res, next) => {
    const newCarrito = new Carrito(req.body);
    try {
        await newCarrito.save();
        res.json({ message: 'Carrito creado' });
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error al crear carrito' });
        next()
    }    
}

carritoCtrl.obtenerCarrito = async (req, res, next) => {
    try {
        const carrito = await Carrito.findById(req.params.idCarrito);
        res.json(carrito);
    } catch (error) {
        console.log(error)
        res.json({mensaje : 'Este carrito no existe'});
        next()
    }   
}

carritoCtrl.agregarArticulo = async (req, res, next) => {
    const { articulos:[{ idarticulo, nombre, precio, cantidad, subtotal }] } = req.body    
    try {
        await Carrito.updateOne(
        {
            _id: req.params.idCarrito
        },
        { $push: 
            {
                articulos: [
                    {
                        idarticulo,
                        nombre,
                        precio,
                        cantidad,
                        subtotal
                    }
                ]
            }
        });
        res.json({ message: 'Articulo agregado' })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error al agregar articulo' });
        next()
    }
}

carritoCtrl.eliminarCarrito = async (req, res, next) => {
    try {
        await Carrito.findByIdAndDelete(req.params.idCarrito)
        res.json({ message: 'Carrito eliminado' })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error al eliminar carrito' });
        next()
    }
}

carritoCtrl.eliminarArticulo = async (req, res, next) => {
    try {
        await Carrito.updateOne(
            {
                _id: req.params.idCarrito
            },
            { 
                $pull: 
                {
                    articulos: 
                    {
                        _id: req.params.idArticulo
                    } 
                }
            });
        res.json({ message: 'Articulo eliminado' })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error al eliminar articulo' });
        next()
    }
}

module.exports = carritoCtrl;