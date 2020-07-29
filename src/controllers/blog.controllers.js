const blogCtrl = {};
const imagen = require('./uploadFile.controllers');
const blogModel = require('../models/Blog');

blogCtrl.subirImagen = async (req, res, next) => {
    await imagen.upload(req, res, function (error) {
        if (err) {
            res.status(400).json({ message: err });
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
            res.send({ message: "Error en el servidor",err });
        } else {
            if (!postStored) {
                res.send({ message: "Error al mostrar Blogs" })
            } else {
                res.send({ posts: postStored });
            }
        }
    });
}

blogCtrl.createBlog = async (req, res) => {
    try {
        if (!req.file) {
            res.status(404).send({ message: "La imagen es obligatoria" });
        } else {
            const newBlog = new blogModel(req.body);
            newBlog.imagen = req.file.key;
            await newBlog.save((err, postStored) => {
                if (err) {
                    res.status(500).send({ message: "Parece que se duplico un campo",err })
                } else {
                    if (!postStored) {
                        res.status(400).send({ message: "No se a podido crear el Blog" });
                    } else {
                        res.status(200).send({ message: "Blog creado correctamente" });
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
            newBlog.imagen = req.file.key;
            await imagen.eliminarImagen(blogBase.imagen);
        } else {
            newBlog.imagen = blogBase.imagen;
        }
        await blogModel.findByIdAndUpdate(req.params.id, newBlog, (err, postStored) => {
            if (err) {
                res.status(500).send({ message: "Error en el servidor",err })
            } else {
                if (!postStored) {
                    res.status(400).send({ message: "No se a podido actualizar el blog" });
                } else {
                    res.status(200).send({ message: "Blog actualizado" });
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
                res.status(500).send({ message: "Error en la base",err });
            } else {
                if (!postStored) {
                    res.status(400).send({ message: "Error al eliminar" });
                } else {
                    res.status(200).send({ post: postStored })
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
        if(blogBase){
            if (blogBase.imagen && blogBase.imagen != null) {
                await imagen.eliminarImagen(blogBase.imagen);
            }
            await blogModel.findByIdAndDelete(req.params.id, (err, postStored) => {
                if (err) {
                    res.status(500).send({ message: "Error en la base",err });
                } else {
                    if (!postStored) {
                        res.status(400).send({ message: "Error al eliminar" });
                    } else {
                        res.status(200).send({ message: "Blog eliminado" })
                    }
                }
            });
        }else{
            res.send({ message: "Este blog no existe" });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = blogCtrl;