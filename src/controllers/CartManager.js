import {promises as fs} from 'fs'
import {nanoid} from "nanoid"
import { cartsModel } from '../models/carts.model.js'
import ProductManager from './ProductManager.js'

const prodAll = new ProductManager()

class CartManager extends cartsModel
{
    constructor() {
        super();
    }
    async getCarts() 
    {
        try 
        {
          const carts = await CartManager.find({})
          .populate({
            path: "products.productId",
            model: "products",
            select: "image description price stock",
          });
          return carts;
        } 
        catch (error) 
        {
          console.error("Fallo al obtener los carritos:", error);
          return [];
        }
      }
    async addCart(cartData) 
    {
        try 
        {
          await cartsModel.create(cartData);
          return "Hemos agregado el carrito";
        } catch (error) {
          console.error("Lo sentimos, fallo al agregar el carrito:", error);
          return "}Lo sentimos, fallo al agregar el carrito";
        }
      }
    
   
      async getCartById(id) 
      {
        try 
        {
          const cart = await cartsModel.findById(id)   
          if (!cart) {
            return "Lo lamentamos, carrito no encontrado";
          } 
          return cart;
        } 
        catch (error) 
        {
          console.error("Fallo al obtener el carrito:", error);
          return "Fallo al obtener el carrito";
        }
      }
    
      async addProductInCart(cartId, prodId) 
      {
        try 
        {
          const cart = await cartsModel.findById(cartId);
    
          if (!cart) 
          {
            return "Lo lamentamos, carrito no encontrado";
          }
    
         
          const existingProduct = cart.products.find((product) => product.productId === prodId);
    
          if (existingProduct) 
          {
         
            existingProduct.quantity += 1;
          } 
          else 
          {
           
            cart.products.push({
              productId: prodId,
              quantity: 1,
            });
          } 
          await cart.save();
          return "Se ha agregado el producto al carrito";
        } catch (error) {
          console.error("Lo lamentamos, fallo al agregar el producto al carrito:", error);
          return "Fallo al agregar el producto al carrito";
        }
      }
      async removeProductFromCart(cartId, prodId) 
      {
        try 
        {
          const cart = await cartsModel.findById(cartId);
          if (!cart) 
          {
            return "Lo lamentamos carrito no encontrado";
          }
      
         
          const productIndex = cart.products.findIndex((product) => product.productId === prodId);
      
          if (productIndex !== -1) 
          {
          
            cart.products.splice(productIndex, 1);
            await cart.save();
            return "Hemos eliminado el producto del carrito";
          } 
          else 
          {
         
            return "Lo lamentamos producto no encontrado en el carrito";
          }
        } catch (error) {
          console.error("Fallo al eliminar el producto del carrito:", error);
          return "Fallo al eliminar el producto del carrito";
        }
      }
      async updateProductsInCart(cartId, newProducts) 
      {
        try 
        {
          const cart = await cartsModel.findById(cartId);
      
          if (!cart) 
          {
            return "Lo lamentamos, carrito no encontrado";
          }
      
          cart.products = newProducts;
      
          await cart.save();
          return "El carrito  ha sido actualizado con los nuevos productos";
        } catch (error) {
          console.error("Fallo al actualizar el carrito con nuevos productos:", error);
          return "Fallo al actualizar el carrito con nuevos productos";
        }
      }
      async updateProductInCart(cartId, prodId, updatedProduct) 
      {
        try 
        {
          const cart = await cartsModel.findById(cartId);
          if (!cart) 
          {
            return "Lo lamentamos, carrito no encontrado";
          }     
       
          const productToUpdate = cart.products.find((product) => product.productId === prodId);
      
          if (!productToUpdate) 
          {
            return "Producto no encontrado en el carrito";
          }

          Object.assign(productToUpdate, updatedProduct);
      
          await cart.save();
          return "El producto ha sido actualizado en el carrito";
        } catch (error) {
          console.error("Fallo al actualizar el producto en el carrito:", error);
          return "Fallo al actualizar el producto en el carrito";
        }
      }
      async removeAllProductsFromCart(cartId) 
      {
        try {
          const cart = await cartsModel.findById(cartId);    
          if (!cart) 
          {
            return "Lo lamentamos, carrito no encontrado";
          }
      
         
          cart.products = [];
          await cart.save();
          
          return "Todos los productos han sido eliminados del carrito";
        } catch (error) {
          console.error("Fallo al eliminar los productos del carrito:", error);
          return "Fallo al eliminar los productos del carrito";
        }
      }
      async getCartWithProducts(cartId) 
      {
        try
        {
          const cart = await cartsModel.findById(cartId).populate("products.productId").lean();
      
          if (!cart) {
            return "Lo lamentamos, carrito no encontrado";
          }
      
          return cart;
        } catch (error) {
          console.error("Fallo al obtener el carrito con productos:", error);
          return "Fallo al obtener el carrito con productos";
        }
      }     
}
export default CartManager