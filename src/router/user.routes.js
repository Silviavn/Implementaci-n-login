import express from "express"
import UserManager from "../controllers/UserManager.js"
import { Router } from "express"

const userRouter = Router()
const userM = new UserManager()

userRouter.post("/register", async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;
    try {
        if (!first_name || !last_name || !age || !email || !password) {
          return res.status(404).json({ error: "Debe ingresar todos los datos" });
        }
      // Verificamos si el usuario ya existe
      const user = await userM.getUsers(email);
      console.log("prueba".user)
      if (user) {
        
        return res.status(404).json({ error: `El usuario con el email ${email} ya existe` });
      }
  
      // Verificamos que ingreso todos los datos
  
      // Creamos el usuario
      const newUser = await userM.createUser({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password), 
      });
  
      // Devolvemos el usuario creado
      return res.json({ user: newUser });
    } catch (error) {
      console.log(error);

    }
})

userRouter.post("/login", async (req, res) => {
    try 
    {
        let email = req.body.email       
        const data = await userM.validateUser(email)      
        if(data.password === req.body.password)
        {   
            if(data.rol === 'admin'){
               req.session.emailUsuario = email
               req.session.nomUsuario = data.first_name
               req.session.apeUsuario = data.last_name
               req.session.rolUsuario = data.rol
                res.redirect("/profile")
            }
            else{
                req.session.emailUsuario = email
                req.session.rolUsuario = data.rol
                res.redirect("/products")
            }
        
        }
        else
        {
          console.log("redirigiendo al login")
            res.redirect("../../login")
        }

    } 
    catch (error) 
    {
        res.status(500).send("Error al acceder al perfil: " + error.message);
    }
})

userRouter.get("/logout", async (req, res) => {
    req.session.destroy((error) =>{
        if(error)
        {
            return res.json({ status: 'Logout Error', body: error})
        }
        res.redirect('../../login')
    })    
})

userRouter.get("/login", async (req, res) => {
    res.render("login")
} )

export default userRouter