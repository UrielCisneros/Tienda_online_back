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
            res.send({ messege: "Error en el servidor",err });
        } else {
            if (!postStored) {
                res.send({ messege: "Error al mostrar Blogs" })
            } else {
                res.send({ posts: postStored });
            }
        }
    });
}

blogCtrl.createBlog = async (req, res) => {
    try {
        if (!req.file) {
            res.send({ messege: "La imagen es obligatoria" });
        } else {
            const newBlog = new blogModel(req.body);
            newBlog.imagen = req.file.filename;
            await newBlog.save((err, postStored) => {
                if (err) {
                    res.send({ message: "Error en el servidor",err })
                } else {
                    if (!postStored) {
                        res.send({ messege: "No se a podido crear el Blog" });
                    } else {
                        res.send({ messege: "Blog creado correctamente" });
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
                res.send({ message: "Error en el servidor",err })
            } else {
                if (!postStored) {
                    res.send({ messege: "No se a podido actualizar el blog" });
                } else {
                    res.send({ messege: "Blog actualizado" });
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
                res.send({ messege: "Error en la base",err });
            } else {
                if (!postStored) {
                    res.send({ messege: "Error al eliminar" });
                } else {
                    res.send({ post: postStored })
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
                    res.send({ messege: "Error en la base",err });
                } else {
                    if (!postStored) {
                        res.send({ messege: "Error al eliminar" });
                    } else {
                        res.send({ messege: "Blog eliminado" })
                    }
                }
            });
        }else{
            res.send({ messege: "Este blog no existeCre" });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = blogCtrl;