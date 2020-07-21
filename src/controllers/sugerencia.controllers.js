const sugerenciaCtrl = {};
const Sugerencia = require('../models/Sugerencia');

sugerenciaCtrl.crearSugerencia = async (req, res) => {
    const newSugerencia = new Sugerencia (req.body);
    await newSugerencia.save((err, response) => {
        if(err){
            res.send({ message: 'Ups, hubo un error al crear esta sugerencia', err})
        }else{
            if(!response){
                res.send({ message: 'Error al crear sugerencia'})
            }else{
                res.json(response)
            }
        }
    })
}

sugerenciaCtrl.obtenerSugerencia = async (req, res) => {
    try {
        const sugerencia = await Sugerencia.findOne({producto: req.params.idProducto}).populate('producto').populate('sugerencias.producto');
        if(!sugerencia){
            res.send({ message: 'Esta sugerencia de compra no existe' })
        }else{
            res.json(sugerencia)
        } 
    } catch (error) {
        res.send({ message: 'Ups, hubo un error al obtener esta sugerencia', error})
    }
}

sugerenciaCtrl.actualizarSugerencia = async (req, res) => {
       await Sugerencia.findOneAndUpdate({producto: req.params.idProducto}, req.body, (err, response) => {
           if(err){
               res.send({ message: 'Ups, hubo un error al actualizar esta sugerencia', err})
           }else{
               if(!response){
                   res.send({message: 'Esta sugerencia de compra no existe'})
               }else{
                   res.json(response)
               }
           }
       })
}

sugerenciaCtrl.eliminarSugerencia = async (req, res) => {
    const sugerencia = await Sugerencia.findOneAndDelete({producto: req.params.idProducto})
        try {
            if(!sugerencia){
                res.send({message: 'Esta sugerencia de compra no existe'})
            }else{
                res.send({message: 'Sugerencia de compra eliminada'})
            }
        } catch (error) {
            res.send({ message: 'Ups, hubo un error al eliminar esta sugerencia', error})
        }
}

module.exports = sugerenciaCtrl;
