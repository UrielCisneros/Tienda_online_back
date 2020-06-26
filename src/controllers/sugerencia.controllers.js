const sugerenciaCtrl = {};
const Sugerencia = require('../models/Sugerencia');

sugerenciaCtrl.crearSugerencia = async (req, res) => {
    const newSugerencia = new Sugerencia(req.body);
    await newSugerencia.save((err, response) => {
        if (err) {
            res.status(500).send({ message: 'Ups, hubo un error al crear esta sugerencia' });
        } else {
            if (!response) {
                res.status(404).send({ message: 'Error al crear sugerencia (404)' });
            } else {
                res.status(200).json(response);
            }
        }
    })
}

sugerenciaCtrl.obtenerSugerencia = async (req, res) => {
    try {
        const sugerencia = await Sugerencia.findById(req.params.idSugerencia).populate('producto').populate('sugerencias.producto');
        if (!sugerencia) {
            res.status(404).send({ message: 'Esta sugerencia de compra no existe' })
        } else {
            res.json(sugerencia)
        }
    } catch (error) {
        res.status(500).send({ message: 'Ups, hubo un error al obtener esta sugerencia' })
    }
}

sugerenciaCtrl.actualizarSugerencia = async (req, res) => {
    await Sugerencia.findOneAndUpdate(req.params.idSugerencia, req.body, (err, response) => {
        if (err) {
            res.status(500).send({ message: 'Ups, hubo un error al actualizar esta sugerencia' })
        } else {
            if (!response) {
                res.status(404).send({ message: 'Esta sugerencia de compra no existe' })
            } else {
                res.status(200).json(response)
            }
        }
    })
}

sugerenciaCtrl.eliminarSugerencia = async (req, res) => {
    const sugerencia = await Sugerencia.findByIdAndDelete(req.params.idSugerencia)
    try {
        if (!sugerencia) {
            res.status(404).send({ message: 'Esta sugerencia de compra no existe' })
        } else {
            res.status(200).send({ message: 'Sugerencia de compra eliminada' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Ups, hubo un error al eliminar esta sugerencia' })
    }
}

module.exports = sugerenciaCtrl;