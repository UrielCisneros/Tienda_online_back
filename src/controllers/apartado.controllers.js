const apartadoCtrl = {};
const Apartado = require('../models/Apartado');
const Producto = require('../models/Producto')
const mongoose = require('mongoose');
const email = require('../middleware/sendEmail');
const { response } = require('express');
const clienteModel = require('../models/Cliente');
const adminModel = require('../models/Administrador');
const Tienda = require('../models/Tienda');

apartadoCtrl.agregarApartado = async (req, res) => {
	console.log(req.body);
	const { producto, cliente, cantidad, estado, medida,tipoEntrega } = req.body;
	const datosProducto = await Producto.find({_id: producto})
	const newApartado = new Apartado({ producto, cliente, cantidad, estado, medida, tipoEntrega });
	const clienteBase = await clienteModel.findById(cliente);
	const admin = await adminModel.find({});
	const tienda = await Tienda.find();



	if(req.body.medida){
		if(medida[0].numero){
			datosProducto[0].numeros.map(async (numero) => {
				if(numero.numero == medida[0].numero){
					if(cantidad > numero.cantidad){
						res.status(500).send({ message: 'No existen suficientes productos en el inventario' })
					}else{
						await newApartado.save((err, response) => {
							if(err){
								res.status(500).json({ message: 'Hubo un error al crear apartado', err });
							}else {
								if(!response){
									res.status(404).json({ message: 'Error al Crear apartado' });
								}else{
									res.status(200).json({ message: 'Apartado creado', response });
								}
							}
						})
					}
				}
			})
		}else if(medida[0].talla){
			datosProducto[0].tallas.map(async (talla) => {
				if(talla.talla == medida[0].talla){
					if(cantidad > talla.cantidad){
						res.status(500).send({ message: 'No existen suficientes productos en el inventario' })
					}else{
						await newApartado.save((err, response) => {
							if(err){
								res.status(500).json({ message: 'Hubo un error al crear apartado', err });
							}else {
								if(!response){
									res.status(404).json({ message: 'Error al Crear apartado' });
								}else{
									res.status(200).json({ message: 'Apartado creado', response });
								}
							}
						})
					}
				}
			})
		}
	}else{
		console.log(datosProducto);
		if(cantidad > datosProducto[0].cantidad){
			res.status(500).send({ message: 'No existen suficientes productos en el inventario' })
		}else{
			await newApartado.save((err, response) => {
				if(err){
					res.status(500).json({ message: 'Hubo un error al crear apartado', err });
				}else {
					if(!response){
						res.status(404).json({ message: 'Error al Crear apartado' });
					}else{
						res.status(200).json({ message: 'Apartado creado', response });
					}
				}
			})
		}
	}

	const htmlContent = `
	<div>
		<h3 style="text-align: center;  font-family: sans-serif; margin: 15px 15px;">Tienes una nueva solicitud de apartado</h3>
		<div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5);transition: 0.3s; width: 350px; display:block; margin:auto;">
			<img style="max-width: 200px; display:block; margin:auto;" class="" src="https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${datosProducto[0].imagen}" />
			<p style="text-align: center; font-family: sans-serif;" ><span style="font-weight: bold;">Producto:</span> ${datosProducto[0].nombre}</p>
			<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Cantidad:</span> ${cantidad}</p>
			${req.body.medida ? req.body.medida[0].numero ? 
				`<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Medida:</span> ${req.body.medida[0].numero}</p>` : 
				`<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Medida:</span> ${req.body.medida[0].talla}</p>`:
			""}
			<div class="" style="margin-top: 20px; padding: 5px;">
				<p style="text-align: center; font-family: sans-serif;" > <span style="font-weight: bold;">Solicitud de:</span> ${clienteBase.nombre} ${clienteBase.apellido}</p>

				<p style="text-align: center; font-family: sans-serif;">Info del cliente:</p>
				<div  style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5);transition: 0.3s; width: 200px; display:block; margin:auto;">

				${clienteBase.tipoSesion !== "FireBase" ? `<img style="max-width: 70px; display:block; margin:auto;" class="" src="https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${clienteBase.imagen}"/>` : `<img style="max-width: 70px; display:block; margin:auto;" class="" src="${clienteBase.imagen}"/>`}

					<p style="text-align: center; font-family: sans-serif;font-size: 13px;" ><span style="font-weight: bold;">Correo:</span> ${clienteBase.email}</p>
					<p style="text-align: center; font-family: sans-serif;font-size: 13px;" ><span style="font-weight: bold;">Telefono:</span> ${clienteBase.telefono}</p>
					<p style="text-align: center; font-family: sans-serif;font-size: 13px;" ><span style="font-weight: bold;">Direccion:</span> ${clienteBase.direccion[0].calle_numero} Colonia ${clienteBase.direccion[0].colonia} ${clienteBase.direccion[0].ciudad} ${clienteBase.direccion[0].estado} ${clienteBase.direccion[0].pais}.</p>
				</div>
				<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Tipo de entrega:</span> ${tipoEntrega === 'ENVIO' ? "Envio a domicilio" : "Recoger a sucursal"}</p>
			</div>
		</div>
		<p style="text-align: center;  font-family: sans-serif; margin: 15px 15px;">El cliente espera que te contactes con el, Hazlo ya!!!</p>
	</div>
	`;

	const htmlContentUser = `
	<div>
		<h3 style="text-align: center;  font-family: sans-serif; margin: 15px 15px;">Tu apartado esta siendo <span style="color: #09ABF6;">procesado</span></h3>
		<h4 style="text-align: center;  font-family: sans-serif; margin: 15px 15px;">Te pedimos que tengas paciencia, en breve se contactaran contigo para mas detalle.</h4>

		<h3 style="text-align: center;  font-family: sans-serif; margin: 15px 15px; font-weight: bold;">Detalle del pedido:</h3>
		<div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5);transition: 0.3s; width: 350px; display:block; margin:auto;">
			<img style="max-width: 200px; display:block; margin:auto;" class="" src="https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${datosProducto[0].imagen}" />
			<p style="text-align: center; font-family: sans-serif;" ><span style="font-weight: bold;">Producto:</span> ${datosProducto[0].nombre}</p>
			<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Cantidad:</span> ${cantidad}</p>
			${req.body.medida ? req.body.medida[0].numero ? 
				`<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Medida:</span> ${req.body.medida[0].numero}</p>` : 
				`<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Medida:</span> ${req.body.medida[0].talla}</p>`:
			""}
		</div>
	</div>
	`;

	email.sendEmail(admin[0].email,"Solicitud de apartado",htmlContent,"Cafi service");

	email.sendEmail(clienteBase.email,"Apartado en proceso",htmlContentUser,tienda[0].nombre);

};

apartadoCtrl.obtenerApartados = async (req, res) => {
	try {
		const { page = 1, limit = 10} = req.query;
		const options = {
			page,
            limit: parseInt(limit)
		}

		const aggregate = Apartado.aggregate([
			{
				$lookup: {
					from: 'productos',
					localField: 'producto',
					foreignField: '_id',
					as: 'producto'
				}
			},
			{
				$lookup: {
					from: 'clientes',
					localField: 'cliente',
					foreignField: '_id',
					as: 'cliente'
				}
			},
		]);

		await Apartado.aggregatePaginate(aggregate,options, (err, postStored) => {
			if (err) {
				res.status(500).json({ message: 'Error en el servidor', err });
			} else {
				if (!postStored) {
					res.status(404).json({ message: 'Error al mostrar Blogs' });
				} else {
					res.status(200).json({ posts: postStored });
				}
			}
		});


	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener los apartados', error });
	}
	
};

apartadoCtrl.obtenerApartado = async (req, res) => {
	try {
		await Apartado.aggregate([
            {
				$lookup: {
					from: 'promocions',
					localField: 'producto',
					foreignField: 'productoPromocion',
					as: 'promocion'
				}
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.idApartado)
                }
            }
		]).exec(async function(err, transactions) {
			if (err) {
				res.send({ message: 'Error al obtener apartado', err });
			} else {
				await Apartado.populate(transactions, { path: 'cliente producto' }, function(err, populatedTransactions
				) {
					// Your populated translactions are inside populatedTransactions
					if (err) {
						res.send({ message: 'Error al obtener apartado', err });
					} else {
						res.json(populatedTransactions[0]);
					}
				});
			}
		});
	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener apartado', error });
	}
	
};

apartadoCtrl.obtenerApartadosCliente = async (req, res) => {
	try {
		await Apartado.aggregate([
            {
				$lookup: {
					from: 'promocions',
					localField: 'producto',
					foreignField: 'productoPromocion',
					as: 'promocion'
				}
            },
            {
                $match: {
                    cliente: mongoose.Types.ObjectId(req.params.idCliente)
                }
            }
		]).sort({ "createdAt" : -1}).exec(async function(err, transactions) {
			if (err) {
				res.send({ message: 'Error al obtener apartado', err });
			} else {
				await Apartado.populate(transactions, { path: 'cliente producto' }, function(err, populatedTransactions
				) {
					// Your populated translactions are inside populatedTransactions
					if (err) {
						res.send({ message: 'Error al obtener apartado', err });
					} else {
						res.json(populatedTransactions);
					}
				});
			}
		});
	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener apartado', error });
	}
	
};

apartadoCtrl.filtroApartadosCliente = async (req,res) => {

	await Apartado.aggregate(
		[
			{
				$lookup: {
					from: 'productos',
					localField: 'producto',
					foreignField: '_id',
					as: 'producto'
				}
			},
			{
				$lookup: {
					from: 'clientes',
					localField: 'cliente',
					foreignField: '_id',
					as: 'cliente'
				}
			},
			{
				$match: {
					$or: [
						{ 'cliente.nombre': { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ 'cliente.email': { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ tipoEntrega: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ estado: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ paqueteria: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ fecha_envio: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ 'producto.nombre': { $regex: '.*' + req.params.filter + '.*', $options: 'i' } }
					]
				}
			}
		],
		(err, postStored) => {
			if (err) {
				res.status(500).json({ message: 'Error en el servidor', err });
			} else {
				if (!postStored) {
					res.status(404).json({ message: 'Error al mostrar Productos' });
				} else {
					res.status(200).json(postStored);
				}
			}
		}
	);
}

/* apartadoCtrl.obtenerApartado = async (req, res) => {
	try {
		const apartado = await Apartado.find({cliente: req.params.idCliente}).populate('cliente').populate('producto');
		if(!apartado){
			res.status(404).json({ message: 'Apartado no encontrado' });
		}
		res.status(200).json(apartado);
	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener apartado', error });
	}
	
}; */

apartadoCtrl.actualizarApartado = async (req, res) => {
	const apatadoActualizado = req.body;
	console.log(apatadoActualizado);
	apatadoActualizado.fecha_envio = new Date();
	const apartadoBase = await Apartado.findById(req.params.idApartado).populate("producto cliente");
	const tienda = await Tienda.find();

	await Apartado.findOneAndUpdate({_id: req.params.idApartado}, apatadoActualizado, (err, response) => {
		if(err){
			res.status(500).json({message: 'Hubo un error al actualizar el apartado', err})
		}else{
			if(!response){
				res.status(404).json({message: 'Apartado no encontrado'})
			}else{
				res.status(200).json({message: 'Apartado Actualizado', response})
			}
		}
	});

	console.log(apartadoBase);
	let color = "";
	let mensaje = ""
	switch(apatadoActualizado.estado){
		case "ACEPTADO":
			color = "#10B42B";
			mensaje= "Tu apartado fue aceptado, puedes pasar por el a la sucursal."
			break;
		case "RECHAZADO":
			color = "#F7401B";
			mensaje= "Tu apartado fue rechazado, puedes ponete en contacto para mas detalle."
			break;
		case "ENVIADO":
			color = "#10B42B";
			mensaje= "Tu apartado fue aceptado, tu apartado ya esta en camino, esperalo pronto."
			break;
		case "CANCELADO":
			color = "#F7401B";
			mensaje= "Tu apartado fue rechazado, puedes ponete en contacto para mas detalle."
			break;
		default:
			break;
	}

	const htmlContentUser = `
	<div>
		<h3 style="text-align: center;  font-family: sans-serif; margin: 15px 15px;">Tu apartado a sido: <span style="color: ${color};">${apatadoActualizado.estado}</span></h3>
		<h4 style="text-align: center;  font-family: sans-serif; margin: 15px 15px;">${mensaje}</h4>

		<h3 style="text-align: center;  font-family: sans-serif; margin: 15px 15px; font-weight: bold;">Detalle del pedido:</h3>
		<div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5);transition: 0.3s; width: 350px; display:block; margin:auto;">
			<img style="max-width: 200px; display:block; margin:auto;" class="" src="https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${apartadoBase.producto.imagen}" />
			<p style="text-align: center; font-family: sans-serif;" ><span style="font-weight: bold;">Producto:</span> ${apartadoBase.producto.nombre}</p>
			<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Cantidad:</span> ${apartadoBase.cantidad}</p>
			${apartadoBase.medida ? apartadoBase.medida[0].numero ? 
				`<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Medida:</span> ${apartadoBase.medida[0].numero}</p>` : 
				`<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Medida:</span> ${apartadoBase.medida[0].talla}</p>`:
			""}

			${apatadoActualizado.estado === "ENVIADO" ? 
			`
			<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Paqueteria:</span> ${apartadoBase.paqueteria}</p>
			<p style="text-align: center; font-family: sans-serif;"><span style="font-weight: bold;">Numero de seguimiento:</span> ${apartadoBase.codigo_seguimiento}</p>
			
			`
			:""}
		</div>
	</div>
	`;

	email.sendEmail(apartadoBase.cliente.email,`Apartado ${apatadoActualizado.estado}`,htmlContentUser,tienda[0].nombre);
};


apartadoCtrl.eliminarApartado = async (req, res) => {
	await Apartado.findOneAndDelete({_id: req.params.idApartado}, (err, response) => {
		if(err){
			res.status(500).json({message: 'Hubo un error al eliminar apartado', err})
		}else if(!response){
			res.status(404).json({message: 'Apartado no encontrado'})
		}else{
			res.status(200).json({ message: 'Apartado eliminado' });
		}	
	});
};

apartadoCtrl.obtenerUnApartado = async (req, res) => {
	try {
		const apartado =  await Apartado.findById(req.params.id).populate('cliente').populate('producto');
		if(apartado){
			res.status(200).json(apartado);
		}
	} catch (err) {
		res.status(500).json({ message: 'Hubo un error al obtener apartado', err });
	}
	

}

module.exports = apartadoCtrl;
