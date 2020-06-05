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
    try {
        await Carrito.updateOne(
        {
            _id: req.params.idCarrito
        },
        { $addToSet: 
            {
                articulos: 
                {
                    idarticulo: req.body.idarticulo,
                    nombre: req.body.nombre,
                    precio: req.body.precio,
                    cantidad: req.body.cantidad,
                    subtotal: req.body.subtotal
                }
            }
        });
        res.json({ message: 'Articulo agregado' })
        console.log(req.body)
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