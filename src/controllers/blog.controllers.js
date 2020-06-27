const blogCtrl = {};
const imagen = require('./uploadFile.controllers');
const blogModel = require('../models/Blog');

blogCtrl.subirImagen = async (req, res, next) => {
    await imagen.upload(req, res, function (error) {
        if (error) {
            res.json({ message: error });
        }
        return next();
    });
};

blogCtrl.getBlogs = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const options = {
        page,
        limit: parseInt(limit),
        sort: { date: "desc" }
    }
    blogModel.paginate({}, options, (err, postStored) => {
        if (err) {
            res.status(500).send({ code: 500, messege: "Error en el servidor" });
        } else {
            if (!postStored) {
                res.status(404).send({ code: 404, messege: "Error al mostrar Blogs" })
            } else {
                res.status(200).send({ code: 200, posts: postStored });
            }
        }
    });
}

blogCtrl.createBlog = async (req, res) => {
    try {
        if (!req.file) {
            res.status(500).send({ messege: "La imagen es obligatoria" });
        } else {
            const newBlog = new blogModel(req.body);
            newBlog.imagen = req.file.filename;
            await newBlog.save((err, postStored) => {
                if (err) {
                    res.status(500).send({ code: 500, message: "Error en el servidor" })
                } else {
                    if (!postStored) {
                        res.status(400).send({ code: 400, messege: "No se a podido crear el Blog" });
                    } else {
                        res.status(200).send({ code: 200, messege: "Blog creado correctamente" });
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
    }

}

blogCtrl.updateBlog = async (req, res) => {
    try {
        const blogBase = await blogModel.findById(req.params.id);
        const newBlog = req.body;
        if (req.file) {
            newBlog.imagen = req.file.filename;
            await imagen.eliminarImagen(blogBase.imagen);
        } else {
            newBlog.imagen = blogBase.imagen;
        }
        await blogModel.findByIdAndUpdate(req.params.id, newBlog, (err, postStored) => {
            if (err) {
                res.status(500).send({ code: 500, message: "Error en el servidor" })
            } else {
                if (!postStored) {
                    res.status(400).send({ code: 400, messege: "No se a podido actualizar el blog" });
                } else {
                    res.status(200).send({ code: 200, messege: "Blog actualizado" });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }

}

blogCtrl.getBlog = async (req, res) => {
    try {
        const { url } = req.params;
        await blogModel.findOne({ url }, (err, postStored) => {
            if (err) {
                res.status(500).send({ code: 500, messege: "Error en la base" });
            } else {
                if (!postStored) {
                    res.status(404).send({ code: 404, messege: "Error al eliminar" });
                } else {
                    res.status(200).send({ code: 200, post: postStored })
                }
            }
        });
    } catch (error) {
        console.log(error);
    }

}

blogCtrl.deleteBlog = async (req, res) => {
    try {
        const blogBase = await blogModel.findById(req.params.id);
        if (blogBase.imagen) {
            await imagen.eliminarImagen(blogBase.imagen);
        }
        await clienteModel.findByIdAndDelete(req.params.id, (err, postStored) => {
            if (err) {
                res.status(500).send({ code: 500, messege: "Error en la base" });
            } else {
                if (!postStored) {
                    res.status(404).send({ code: 404, messege: "Error al eliminar" });
                } else {
                    res.status(200).send({ code: 200, messege: "Blog eliminado" })
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = blogCtrl;