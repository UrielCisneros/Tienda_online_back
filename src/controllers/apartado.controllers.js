const apartadoCtrl = {};
const Apartado = require('../models/Apartado');

apartadoCtrl.agregarApartado = async (req, res) => {
	try {
		const { producto, cliente, cantidad, estado = false } = req.body;
		const newApartado = new Apartado({ producto, cliente, cantidad, estado });
		await newApartado.save()
		res.json({ message: 'Apartado Creado' });
	} catch (error) {
		console.log(error)
		res.json({ message: 'Error al crear apartado' });
	}
};

apartadoCtrl.obtenerApartado = async (req, res) => {
	try {
		const apartado = await Apartado.find();
		res.json(apartado);
	} catch (error) {
		res.json({ message: 'error al obtener apartado' });
	}
	
};

apartadoCtrl.cambiarEstado = async (req, res) => {
	await Apartado.findByIdAndUpdate(req.params.id, req.body, function(err, response) {
        if (err) return res.status(500).send(err.message);
		if (response.estado === 'ENVIADO') return res.json({ message: 'Estado: Enviado' });
		res.json({ message: 'Estado Actualizado' });
	});
};

apartadoCtrl.actualizarApartado = async (req, res) => {
	await Apartado.findByIdAndUpdate(req.params.id, req.body);
	res.json({ message: 'Apartado actualizado' });
};

apartadoCtrl.eliminarApartado = async (req, res) => {
	await Apartado.findByIdAndDelete(req.params.id);
	res.json({ message: 'Apartado eliminado' });
};

module.exports = apartadoCtrl;
