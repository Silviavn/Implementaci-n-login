import express from "express"
import prodRouter from "./src/router/product.routes.js"
import cartRouter from "./src/router/carts.routes.js"
import ProductManager from "./src/controllers/ProductManager.js"
import CartManager from "./src/controllers/CartManager.js"
import mongoose from "mongoose"
import { engine } from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"
import userRouter from "./src/router/user.routes.js"
import MongoStore from "connect-mongo"
import session from 'express-session'
import FileStore from 'session-file-store'

const PORT = 8080
const fileStorage = FileStore(session)
const product = new ProductManager()
const cart = new CartManager()
const app = express()
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/src/views"))

app.use("/", express.static(__dirname + "/src/public"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
//app.set("views", "./src/views")
app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})


app.use("/api/products", prodRouter)
app.use("/api/carts", cartRouter)
app.use("/api/sessions", userRouter)


app.get("/products", async (req, res) => {
    if (!req.session.emailUsuario) 
    {
        return res.redirect("/login")
    }
    let allProducts  = await product.getProducts()
    allProducts = allProducts.map(product => product.toJSON());
    res.render("viewProducts", {
        title: "Vista Productos",
        products : allProducts,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,
        algo: req.session.algo,
    });
})
app.get("/carts/:cid", async (req, res) => {
    let id = req.params.cid
    let allCarts  = await cart.getCartWithProducts(id)
    res.render("viewCart", {
        title: "Vista Carro",
        carts : allCarts
    });
})

app.get("/login", async (req, res) => {
    res.render("login", {
        title: "Vista Login",
    });
    
})

app.get("/register", async (req, res) => { 
    res.render("register", {
        title: "Vista Register",
    });
})

app.get("/profile", async (req, res) => { 
    if (!req.session.emailUsuario) 
    {
        return res.redirect("/login")
    }
    res.render("profile", {
        title: "Vista Profile Admin",
        first_name: req.session.nomUsuario,
        last_name: req.session.apeUsuario,
        email: req.session.emailUsuario,
        rol: req.session.rolUsuario,

    });
})
//-------------------------------------Mongoose----------------------------------------------------------//
mongoose.connect("mongodb+srv://SilviaVN:Ma.2405@cluster0.k4o0wdx.mongodb.net/test?retryWrites=true&w=majority&appName=AtlasApp")
.then(()=>{
    console.log("Conectado a la base de datos")
})
.catch(error => {
    console.error("Error al conectarse a la base de datos, error"+error)
})

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://SilviaVN:Ma.2405@cluster0.k4o0wdx.mongodb.net/test?retryWrites=true&w=majority&appName=AtlasApp",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true}, ttl: 3600
    }),
    secret: "ClaveSecreta",
    resave: false,
    saveUninitialized: false,
}))