const tiendaCtrl = {};
const imagen = require('./uploadFile.controllers');
const Tienda = require('../models/Tienda');

tiendaCtrl.subirImagen = async (req,res,next) => {
    imagen.upload(req, res, function (err) {
		if (err) {
			res.send({ message: "formato de imagen no valido", err });
		}else{
			return next();
		}
	});
}

tiendaCtrl.crearTienda = async (req, res) => {
    const newTienda = new Tienda(req.body)
    newTienda.activo = true;
    if(req.file){
        newTienda.imagenLogo = req.file.key;
    }
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
    const infoTiendaBase =  await Tienda.findById(req.params.idTienda);
    const newTienda = req.body;
    if(req.file){
        if(infoTiendaBase.imagenLogo){
            await imagen.eliminarImagen(infoTiendaBase.imagenLogo)
        }
        newTienda.imagenLogo = req.file.key;
    }else{
        newTienda.imagenLogo = infoTiendaBase.imagenLogo;
    }
 	await Tienda.findOneAndUpdate({_id: req.params.idTienda}, newTienda, (err, response) => {
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
