const blogCtrl = {};

const blogModel = require('../models/Blog');

blogCtrl.getBlogs = async (req, res) => {
    const blogs = await blogModel.find();
    res.json(blogs);
}

blogCtrl.createBlog = async (req, res) => {
    const { nombre, titulo, administrador, descripcion, fecha } = req.body;
    const newBlog = new blogModel({
        nombre,
        titulo,
        administrador,
        descripcion,
        fecha
    });
    await newBlog.save();
    res.json({ messege: "Blog save" });
}

blogCtrl.updateBlog = async (req, res) => {
    const { nombre, titulo, administrador, descripcion } = req.body;
    const blog = await blogModel.findById(req.params.id);

    await blogModel.findByIdAndUpdate(req.params.id, {
        nombre,
        titulo,
        administrador,
        descripcion
    });
    res.json({ messege: "Blog Update" });
}

blogCtrl.getBlog = async (req, res) => {
    const blog = await blogModel.findById(req.params.id);
    if (blog == null) {
        res.json({ message: "This is blog not exist" });
    } else {
        res.json(blog);
    }
}

blogCtrl.deleteBlog = async (req, res) => {
    await blogModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog Deleted" });
}

module.exports = blogCtrl;