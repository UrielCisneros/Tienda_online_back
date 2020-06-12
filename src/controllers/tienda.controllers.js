const tiendaCtrl = {};
const Tienda = require('../models/Tienda');

tiendaCtrl.crearTienda = async (req, res) => {
    const newTienda = new Tienda(req.body)
    newTienda.activo = true;
    await newTienda.save((err, response) => {
        if(err){
            res.status(500).send({message: 'Ups, error al crear Tienda'})
        }else{
            res.status(200).send({message: 'Nueva tienda creada'})
        }
    })
};

tiendaCtrl.obtenerTienda = async (req, res) => {
    try {
        const tienda = await Tienda.findById(req.params.idTienda)
        if(!tienda){
            res.status(404).send({ message: 'Esta tienda no existe'})
        }
        res.json(tienda)
    } catch (error) {
        res.status(500).send({ message: 'Ups, hubo un error al obtener esta tienda' })
    }
};

tiendaCtrl.actualizarTienda = async (req, res) => {
	await Tienda.findOneAndUpdate({_id: req.params.idTienda}, req.body, (err, response) => {
        if(err){
            res.status(500).send({message: 'Ups, error al actualizar Tienda'})
        }else{
            if(!response){
                res.status(404).send({ message: 'Esta tienda no existe'})
            }else{
                res.status(200).send({message: 'Tienda actualizada'})
            }
        }
    })
};

tiendaCtrl.eliminarTienda = async (req, res) => {
    try {
        await Tienda.findByIdAndDelete(req.params.idTienda)
    } catch (error) {
        res.status(500).send({message: 'Ups, error al eliminar Tienda'})
    }
};

module.exports = tiendaCtrl;
