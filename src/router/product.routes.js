import { Router } from "express"
import mongoose from "mongoose"
import ProductManager from "../controllers/ProductManager.js"

const prodRouter = Router()
const product = new ProductManager()

prodRouter.put("/:id", async (req,res) => {
    let id = req.params.id
    let updProd = req.body
    res.send(await product.updateProduct(id, updProd))
})
prodRouter.get("/:id", async (req, res) => {
    try{
        const prodId = req.params.id;
        const productDetails = await product.getProductById(prodId);
        res.render("viewDetails", { product: productDetails });
    } catch (error) {
        console.error("Ha fallado al obtener el producto:", error);
        res.status(500).json({ error: "Ha fallado al obtener el producto" });
    } 
});

prodRouter.get("/limit/:limit", async (req, res) => { 
    let limit = parseInt(req.params.limit)
    if (isNaN(limit) || limit <= 0) {
        limit = 10; 
    }    
    res.send(await product.getProductsByLimit(limit))
})

prodRouter.get("/page/:page", async (req, res) => { 
    let page = parseInt(req.params.page)
    if (isNaN(page) || page <= 0) {
        page = 1;
    }
    const productsPerPage = 1;   
    res.send(await product.getProductsByPage(page, productsPerPage))
})

prodRouter.get("/buscar/query", async (req, res) => { 
    const query = req.query.q  
    res.send(await product.getProductsByQuery(query))
})

prodRouter.get("/ordenar/sort", async (req, res) => { 
        let sortOrder = 0;
        if (req.query.sort) {
        
        if (req.query.sort === "desc") {
          sortOrder = -1; // Orden descendente
        }else if(req.query.sort === "asc"){
            sortOrder = 1; 
        }
      }
    res.send(await product.getProductsBySort(sortOrder))
})

prodRouter.get("/", async (req, res) => {
    let sortOrder = req.query.sortOrder; 
    let category = req.query.category; 
    let availability = req.query.availability; 
    if(sortOrder === undefined){
        sortOrder = "asc"
    }
    if(category === undefined){
        category = ""
    }
    if(availability === undefined){
        availability = ""
    }
    res.send(await product.getProductsMaster(null,null,category,availability, sortOrder))
})

prodRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.delProducts(id))
})

prodRouter.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await product.addProduct(newProduct))
})

export default prodRouter