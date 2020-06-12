const carritoCtrl = {};
const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto')

carritoCtrl.crearCarrito = async (req, res) => {
    const { cliente, articulos:[{ idarticulo, cantidad }] } = req.body  
    const articulos = await Producto.find({_id: idarticulo})
    articulos.map( async (productos) => {
        if(cantidad > productos.cantidad){
            res.send({ messege: 'cantidad de articulos es mayor al stock' });
        }else{
            const precio = productos.precio
            const subtotal = precio * cantidad
            const newCarrito = new Carrito({cliente, articulos:[{ idarticulo, cantidad, subtotal }] });
    
            await newCarrito.save((err, response) => {
                if (err) {
                    res.status(500).send({ messege: 'Ups, algo paso al crear el Carrito' });
                } else {
                    if (!response) {
                        res.status(404).send({ message: 'Error al crear el Carrito (404)' });
                    } else {
                        res.status(200).send({ message: 'Carrito creado' });
                    }
                }
            }); 
        }
    })    
}

carritoCtrl.obtenerCarrito = async (req, res) => {
    try {
        const carrito = await Carrito.findById(req.params.idCarrito)
        .populate('cliente', 'nombre apellido')
        .populate('articulos.idarticulo', 'nombre precio imagen')
        if (!carrito) {
            res.json({ message: "Este carrito no existe" });
        }
        res.json(carrito);
    } catch (error) {
        console.log(error)
        res.json({mensaje : 'Error al obtener carrito'});
    }   
}

carritoCtrl.agregarArticulo = async (req, res) => {
    const { articulos:[{ idarticulo, cantidad }] } = req.body    
    const articulos = await Producto.find({_id: idarticulo})
    articulos.map( async (productos) => {
        if(cantidad > productos.cantidad){
            res.send({ messege: 'cantidad de articulos es mayor al stock' });
        }else{
            const precio = productos.precio
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
                        res.status(404).send({ message: 'Error al crear el articulo (404)' });
                    } else {
                        res.status(200).send({ message: 'Articulo agregado' });
                    }
                }
            });
        }
    })
}

carritoCtrl.eliminarCarrito = async (req, res) => {
    await Carrito.findByIdAndDelete(req.params.idCarrito, (err, response) => {
        if (err) {
            res.status(500).send({ messege: 'Ups, algo paso al eliminar el Carrito' });
        } else {
            if (!response) {
                res.status(404).send({ message: 'Error al eliminar el Carrito (404)' });
            } else {
                res.status(200).send({ message: 'Carrito eliminado' });
            }
        }
    })
}

carritoCtrl.eliminarArticulo = async (req, res) => {
    await Carrito.updateOne(
    {
        _id: req.params.idCarrito
    },
    { $pull: { articulos: { _id: req.params.idArticulo }} }, (err, response) => {
        if (err) {
            res.status(500).send({ messege: 'Ups, algo paso al eliminar articulo' });
        } else {
            if (!response) {
                res.status(404).send({ message: 'Error al eliminar articulo (404)' });
            } else {
                res.status(200).send({ message: 'Articulo eliminado' });
            }
        }
    });
}

carritoCtrl.modificarCantidadArticulo = async (req, res) => {

    const { articulos } = await Carrito.findById(req.params.idCarrito)
    const articuloFiltrado = articulos.filter(x => x._id == req.params.idArticulo)

    articuloFiltrado.map( async (articulo) => {

        const idarticulo = articulo.idarticulo
        const productos = await Producto.find({_id: idarticulo})
        const { cantidad } = req.body
        productos.map( async (producto) => {
            if(cantidad > producto.cantidad){
                res.send({ messege: 'cantidad de articulos es mayor al stock' });
            }else{
                const precio = producto.precio            
                const subtotal = cantidad * precio
                await Carrito.updateOne(
                    {
                        "articulos._id" : req.params.idArticulo
                    },
                    { 
                        $set: { "articulos.$": { idarticulo, cantidad, subtotal } }           
                    }, (err, response) => {

                    if(err){
                        res.status(500).send({ message: 'Ups, algo paso al modificar la cantidad' });
                    }else {
                        if(!response){
                            res.status(404).send({ message: 'Error al modificar la cantidad (404)' });
                        }else{
                            res.status(200).send({ message: 'Cantidad Modificada' });
                        }
                    }
                })
            }
        })
    })
}


module.exports = carritoCtrl;