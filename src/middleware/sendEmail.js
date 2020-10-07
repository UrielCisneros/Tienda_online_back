const nodemailer = require('nodemailer');

const sendEmail = {};

sendEmail.sendEmail = (emailAdmin,htmlContent) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.hostinger.mx',
		port: 587,
		secure: false,
		auth: {
			user: 'correo_cafi@cursosuniline.com',
			pass: 'erk&I/H[*L5'
		},
		tls: {
			rejectUnauthorize: false
		}
	})

	const info = transporter.sendMail({
		from:` 'Cafi service' <correo_cafi@cursosuniline.com>`,
		to: emailAdmin,
		subject: "Solicitud de un producto a apartar",
		html: htmlContent,
    })
    
    return info;
}


module.exports = sendEmail;