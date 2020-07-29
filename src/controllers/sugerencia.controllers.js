const sugerenciaCtrl = {};
const Sugerencia = require('../models/Sugerencia');

sugerenciaCtrl.crearSugerencia = async (req, res) => {
    const newSugerencia = new Sugerencia (req.body);
    await newSugerencia.save((err, response) => {
        if(err){
            res.status(500).json({ message: 'Hubo un error al crear esta sugerencia', err})
        }else{
            if(!response){
                res.status(404).json({ message: 'Error al crear sugerencia'})
            }else{
                res.status(200).json({message: 'Sugerencia creada', response})
            }
        }
    })
}

sugerenciaCtrl.obtenerSugerencia = async (req, res) => {
    try {
        const sugerencia = await Sugerencia.findOne({producto: req.params.idProducto}).populate('producto').populate('sugerencias.producto');
        if(!sugerencia){
            res.status(404).json({ message: 'Sugerencia no encontrada' })
        }else{
            res.status(200).json(sugerencia)
        } 
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener esta sugerencia', error})
    }
}

sugerenciaCtrl.actualizarSugerencia = async (req, res) => {
       await Sugerencia.findOneAndUpdate({producto: req.params.idProducto}, req.body, (err, response) => {
           if(err){
               res.status(500).json({ message: 'Hubo un error al actualizar esta sugerencia', err})
           }else{
               if(!response){
                   res.status(404).json({message: 'Sugerencia no encontrada'})
               }else{
                   res.status(200).json({message: 'Sugerencia Actualizada', response})
               }
           }
       })
}

sugerenciaCtrl.eliminarSugerencia = async (req, res) => {
    const sugerencia = await Sugerencia.findOneAndDelete({producto: req.params.idProducto})
        try {
            if(!sugerencia){
                res.status(404).json({message: 'Sugerencia no encontrada'})
            }else{
                res.status(200).json({message: 'Sugerencia de compra eliminada'})
            }
        } catch (error) {
            res.status(500).json({ message: 'Hubo un error al eliminar esta sugerencia', error})
        }
}

module.exports = sugerenciaCtrl;
