import {promises as fs} from 'fs'
import {nanoid} from "nanoid"
import { productsModel } from '../models/products.model.js'

class ProductManager extends productsModel
{
    constructor() {
        super();
    }
      async addProduct(productData) 
      {
          try 
          {
            await productsModel.create(productData);
            return "El producto ha sido agregado";
          } catch (error) {
            console.error("Ha fallado al agregar el producto:", error);
            return "Ha fallado al agregar el producto";
          }
        }
      async updateProduct(id, productData) 
      {
        try 
        {
          const product = await ProductManager.findById(id);   
          if (!product) {
            return "Lo lamentamos producto no encontrado";
          } 
          
          product.set(productData);
    
          await product.save();
          return "El producto ha sido actualizado";
        } catch (error) {
          console.error("Ha fallado al actualizar el producto:", error);
          return "Ha fallado al actualizar el producto";
        }
      }
    
      async getProducts() 
      {
        try 
        {
          const products = await ProductManager.find({});
          return products;
        } catch (error) {
          console.error("Ha fallado al obtener los productos:", error);
          return [];
        }
      }
    
      async getProductById(id) 
      {
        try 
        {
         
          const product = await ProductManager.findById(id).lean();    
          if (!product) 
          {
            return "Lo lamentamos producto no encontrado";
          }   
          return product;
        } catch (error) {
          console.error("Ha fallado al obtener el producto:", error);
          return "Ha fallado al obtener el producto";
        }
      }

      
      async getProductsByLimit(limit) 
      {
        try 
        {
          const products = await ProductManager.find().limit(limit); 
          if (products.length < limit) {
            limit = products.length;
          }     
          return products;
        } catch (error) {
          throw error;
        }
      }
     
      async getProductsByPage(page, productsPerPage) 
      {
        if (page <= 0) {
          page = 1;
        }
        try {
          const products = await ProductManager.find()
            .skip((page - 1) * productsPerPage) 
            .limit(productsPerPage); 
          return products;
        } catch (error) {
          throw error;
        }
      }
     
      async getProductsByQuery(query) 
      {
        try 
        {
          const products = await productsModel.find({
            description: { $regex: query, $options: 'i' }
          });
          return products;
        } catch (error) {
          throw error;
        }
      }
      async getProductsBySort(sortOrder) 
      {
        try 
        {
          const products = await productsModel
          .find({})
          .sort({ price: sortOrder });
          return products;
        } catch (error) {
          throw error;
        }
      }

      async getProductsMaster(page = 1, limit = 10, category, availability, sortOrder) 
      {
        try
        {
        
          let filter = {};
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;

          const sortOptions = {};
          
          if (sortOrder === 'asc') {
            sortOptions.price = 1; 
          } else if (sortOrder === 'desc') {
            sortOptions.price = -1; 
          } else {
            throw new Error('El parámetro sortOrder debe ser "asc" o "desc".');
          }

          if (category != "") {
            filter.category = category;
          }
          if (availability != "") {
            filter.availability = availability;
          }

          const query = ProductManager.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sortOptions); ;
          const products = await query.exec();
        const totalProducts = await ProductManager.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = startIndex > 0;
        const hasNextPage = endIndex < totalProducts;
        const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;

        return {
          status: 'success',
          payload: products,
          totalPages: totalPages,
          prevPage: hasPrevPage ? page - 1 : null,
          nextPage: hasNextPage ? page + 1 : null,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink: prevLink,
          nextLink: nextLink,
        };
        } catch (error) {
          console.error("Ha fallado al obtener los productos:", error);
        
          return { status: "error", payload: "Ha fallado al obtener los productos" };
        }
      }
    
      async deleteProduct(id) 
      {
        try 
        {
          const product = await ProductManager.findById(id);  
          if (!product) {
            return "Lo lamentamos, producto no encontrado";
          }
    
          await product.remove();
          return "Producto eliminado";
        } catch (error) {
          console.error("Ha fallado al eliminar el producto:", error);
          return "Ha fallado al eliminar el producto";
        }
      }
}
export default ProductManager;