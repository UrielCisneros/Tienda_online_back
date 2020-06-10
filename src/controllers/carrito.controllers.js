const carritoCtrl = {};
const Carrito = require('../models/Carrito');

carritoCtrl.crearCarrito = async (req, res) => {
    const { cliente, articulos:[{ idarticulo, nombre, precio, cantidad }] } = req.body  
    const subtotal = precio * cantidad
    const total = subtotal
    const newCarrito = new Carrito({cliente, articulos:[{ idarticulo, nombre, precio, cantidad, subtotal }], total});
    
    await newCarrito.save((err, response) => {
        if (err) {
            res.status(500).send({ messege: 'Ups, algo paso al crear el Carrito' });
        } else {
            if (!response) {
                res.status(404).send({ message: 'Error al crear el Carrito' });
            } else {
                res.status(200).send({ message: 'Carrito creado' });
            }
        }
    });  
}

carritoCtrl.obtenerCarrito = async (req, res, next) => {
    try {
        const carrito = await Carrito.findById(req.params.idCarrito).populate('cliente');
        if (!carrito) {
            res.json({ message: "Este carrito no existe" });
        }
        res.json(carrito);
    } catch (error) {
        console.log(error)
        res.json({mensaje : 'Error al obtener carrito'});
        next()
    }   
}

carritoCtrl.agregarArticulo = async (req, res, next) => {
    const { articulos:[{ idarticulo, nombre, precio, cantidad }] } = req.body    
    const subtotal = precio * cantidad
    await Carrito.updateOne(
    {
        _id: req.params.idCarrito
    },
    { $addToSet: 
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
    }, (err, response) => {
        if (err) {
            res.status(500).send({ messege: 'Ups, algo paso al agregar articulo' });
        } else {
            if (!response) {
                res.status(404).send({ message: 'Error al crear el articulo' });
            } else {
                res.status(200).send({ message: 'Articulo agregado' });
            }
        }
    });
    next();
}

carritoCtrl.eliminarCarrito = async (req, res, next) => {
    await Carrito.findByIdAndDelete(req.params.idCarrito, (err, response) => {
        if (err) {
            res.status(500).send({ messege: 'Ups, algo paso al eliminar el Carrito' });
        } else {
            if (!response) {
                res.status(404).send({ message: 'Error al eliminar el Carrito' });
            } else {
                res.status(200).send({ message: 'Carrito eliminado' });
            }
        }
    })
}

carritoCtrl.eliminarArticulo = async (req, res, next) => {
    await Carrito.updateOne(
    {
        _id: req.params.idCarrito
    },
    { $pull: { articulos: { _id: req.params.idArticulo }} }, (err, response) => {
        if (err) {
            res.status(500).send({ messege: 'Ups, algo paso al eliminar articulo' });
        } else {
            if (!response) {
                res.status(404).send({ message: 'Error al eliminar articulo' });
            } else {
                res.status(200).send({ message: 'Articulo eliminado' });
            }
        }
    });
    next();
}

carritoCtrl.modificarCantidadArticulo = async (req, res, next) => {
    const { articulos: [{ idarticulo, nombre, precio }] } = await Carrito.findById(req.params.idCarrito)
    const { cantidad } = req.body
    const subtotal = cantidad * precio
    await Carrito.updateOne(
        {
            "articulos._id" : req.params.idArticulo//Esto es para descomponer el Array en documentos.
        },
        { 
            $set: { "articulos.$": { idarticulo, nombre, precio, cantidad, subtotal } }           
        }, (err, response) => {
            if(err){
                res.status(500).send({ message: 'Ups, algo paso al modificar la cantidad' });
            }else if(!response){
                res.status(404).send({ message: 'Error al modificar la cantidad' });
            }else{
                res.status(200).send({ message: 'Cantidad Modificada' });
            }
        })
        next();
}


carritoCtrl.actualizarTotal = async (req, res) => {
    const carrito = await Carrito.aggregate([
        {
            $unwind: '$articulos' //Esto es para descomponer el Array en documentos.
        },
        {
            $group: {
                _id: "$_id", //Agrupamos por cada _id (suponiendo que es única)
                total: {"$sum": "$articulos.subtotal"} //Sumamos todos los precios de cada _id
            }
        }
    ])
    const datos = carrito.filter(x => x._id == req.params.idCarrito)
    datos.map( async (id) => {
        total = id.total
        try {
            await Carrito.updateOne({ _id: req.params.idCarrito }, 
                { $set: {total: total}})
        } catch (error) {
            console.log(error)
        }
    })   
}

module.exports = carritoCtrl;