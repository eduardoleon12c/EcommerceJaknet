//invocacion de modulos a utilizar
import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import router from './router'


//Configurar base de datos
mongoose.Promise = global.Promise;
const dbUrL = "mongodb://localhost:27017/ecommerce_jaknet";
mongoose.connect(
    dbUrL ,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(mongoose => console.log("Conexion con la BD en el puerto 27017"))
.catch(err => console.log(err));

//invocamos express
const app = express()

//Utilizamos cors
app.use(cors())

//Configuramos procesamiento de datos
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Carpeta public para los archivos estaticos
app.use(express.static(path.join(__dirname,'public')))

//rutas
app.use('/api/',router)

//Puerto del servidor
app.listen(3000, ()=>{
    console.log('Server corriendo en el puerto 3000')
})