import {promises as fs} from 'fs'
import {nanoid} from "nanoid"
import { usersModel } from '../models/users.model.js'

class UserManager extends usersModel
{
    constructor() {
        super();
    }
    
      async addUser(userData) 
      {
          try 
          {
            await usersModel.create(userData);
            return "Hemos agregado el usuario";
          } catch (error) {
            console.error("Ha fallado al agregar el usuario:", error);
            return "Ha fallado al agregar el usuario";
          }
        }
    
      async updateUser(id, userData) 
      {
        try 
        {
          const user = await UserManager.findById(id);   
          if (!user) {
            return "Lo lamentamos, usuario no encontrado";
          } 
          user.set(userData);
    
          await user.save();
          return "Hemos actualizado el usuario";
        } catch (error) {
          console.error("Ha fallado al actualizar el usuario:", error);
          return "Ha fallado al actualizar el usuario";
        }
      }
      async getUsers() 
      {
        try 
        {
          const users = await UserManager.find({});
          return users;
        } catch (error) {
          console.error("Ha fallado al obtener los usuarios:", error);
          return [];
        }
      }
    
      async getUserById(id) 
      {
        try 
        {
          const user = await UserManager.findById(id).lean();    
          if (!user) 
          {
            return "Lo lamentamos, usuario no encontrado";
          }   
          return user;
        } catch (error) {
          console.error("Ha fallado al obtener el usuario:", error);
          return "Ha fallado al obtener el usuario";
        }
      }
      async deleteUser(id) 
      {
        try 
        {
          const user = await UserManager.findById(id);  
          if (!user) {
            return "Lo lamentamos, usuario no encontrado";
          }
    
          await user.remove();
          return "Hemos eliminado el usuario";
        } catch (error) {
          console.error("Ha fallado al eliminar el usuario:", error);
          return "Ha fallado al eliminar el usuario";
        }
      }
      async validateUser(param) {
        try 
        {
          const user = await UserManager.findOne({email: param});
           if(!user)
           {
            console.log(":(")
             return "Lo lamentamos, usuario no encontrado" 
           }
           console.log("user", user)
          return user;
        } 
        catch (error)
        {
          console.error("Ha fallado al validar usuario", error);
          return "Ha fallado al obtener el usuario";
        }
      }
      
}
export default UserManager;