const tiendaCtrl = {};
const Tienda = require('../models/Tienda');

tiendaCtrl.crearTienda = async (req, res) => {
    const newTienda = new Tienda(req.body)
    newTienda.activo = true;
    await newTienda.save((err, response) => {
        if(err){
            res.send({message: 'Error al crear Tienda', err})
        }else{
            res.json(response)
        }
    })
};

tiendaCtrl.obtenerTienda = async (req, res) => {
    try {
        const tienda = await Tienda.findById(req.params.idTienda)
        if(!tienda){
            res.send({ message: 'Esta tienda no existe'})
        }
        res.json(tienda)
    } catch (error) {
        res.send({ message: 'Hubo un error al obtener esta tienda', error })
    }
};

tiendaCtrl.actualizarTienda = async (req, res) => {
	await Tienda.findOneAndUpdate({_id: req.params.idTienda}, req.body, (err, response) => {
        if(err){
            res.send({message: 'Error al actualizar Tienda', err})
        }else{
            if(!response){
                res.send({ message: 'Esta tienda no existe'})
            }else{
                res.json(response)
            }
        }
    })
};

tiendaCtrl.eliminarTienda = async (req, res) => {
    try {
        await Tienda.findByIdAndDelete(req.params.idTienda)
        res.send({message: "Tienda eliminada"})
    } catch (error) {
        res.send({message: 'Ups, error al eliminar Tienda', error})
    }
};

module.exports = tiendaCtrl;
