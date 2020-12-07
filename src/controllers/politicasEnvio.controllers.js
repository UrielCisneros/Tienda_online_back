const politicasCtrl = {};
const politicasModel = require('../models/PoliticasEnvio');
const estadosModel = require('../models/EstadosEnvio');

politicasCtrl.getPoliticas = async (req, res) => {
	try {
		const politicas = await politicasModel.find().populate("idTienda").populate("idAdministrador");
		res.json(politicas[0]);
	} catch (err) {
		res.status(500).json({ message: "Error en el servidor",err })	
	}

};

politicasCtrl.createPoliticas = async (req,res) => {
    try {
        const newPolticas = new politicasModel(req.body);
        console.log(req.body)
        newPolticas.save((err, userStored) => {
            if (err) {
                res.status(500).json({ message: 'Ups, algo paso al registrar el usuario',err });
            } else {
                res.status(200).json({ message: 'Politicas Registradas',userStored });
            }
        });
        
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.updatePoliticas = async (req,res) => {
    try {
        await politicasModel.findByIdAndUpdate(req.params.id,req.body,(err, userStored) => {
            if (err) {
                res.status(500).json({ message: 'Ups, algo paso al registrar el usuario',err });
            } else {
                res.status(200).json({ message: 'Politicas Actualizadas' });
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.getEstados = async (req,res) => {
    try {
        const estados = await estadosModel.find();
        res.status(200).json(estados);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.createEstados = async (req,res) => {
    try {
        console.log(req.body);
        const newEstado = new estadosModel(req.body);
        await newEstado.save();
        res.status(200).json({ message: 'Estado registrado' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err });
    }
}

politicasCtrl.editEstados = async (req,res) => {
    try {
        const newEstado = req.body;
        await estadosModel.findByIdAndUpdate(req.params.idEstado, newEstado);
        res.status(200).json({ message: 'Estado actualizado' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err })
    }
}

politicasCtrl.deleteEstados = async (req,res) => {
    try {
        const estadoEliminado = await estadosModel.findById(req.params.idEstado);
        if(estadoEliminado){
            await estadosModel.findByIdAndDelete(req.params.idEstado);
            res.status(200).json({ message: 'Estado eliminado.' });
        }else{
            res.status(404).json({ message: "El estado no existe." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err });
    }
}

politicasCtrl.compararEstados = async (req,res) => {
    try {
        console.log(req.params.idMunicipio);
        const estadosMunicipios = await estadosModel.find({'municipios.municipio': req.params.idMunicipio});
        console.log(estadosMunicipios);
        res.status(200).json(estadosMunicipios);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor",err });
    }
}




module.exports = politicasCtrl;