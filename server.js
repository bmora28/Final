import express from 'express';
import hbs from 'hbs';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { Usuario } from './Usuarios.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const secret = "bmora28@gmail.com";
const userbank = new Usuario();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
hbs.registerPartials(__dirname + '/views/partials');

// app.get('/',async(req,res)=>{});
// app.post('/',async(req,res)=>{});
app.get('/',async(req,res)=>{
    let disabledmodal
    const token = req.query.token;
        jwt.verify(token, 'bmora28@gmail.com', async (err, decoded) => {
            if (err) {
              console.error('Error al verificar el token:', err.message);
              disabledmodal = "disabled";
              res.render('index',{disabledmodal});
              
            } else {
                let saldo = decoded.saldo;
                let nombre = decoded.nombre;
                const data = await userbank.selecttransferencias();
                res.render('index',{data,saldo,nombre,token});  
            }
        });
});
// renderiza la vista de Login
app.get('/login', (req, res) => {
    
    res.render('login');
});
app.post('/login', async (req, res) => {
    const userlog = req.body;
    const userlogin = await userbank.getuser(userlog.email,userlog.password);
    const token = jwt.sign(userlogin[0],secret,{expiresIn:"1m"});
    res.redirect(`/?token=${token}`);
});
// renderiza la vista Registro
app.get('/registro', (req, res) => {
    res.render('registro');
});
app.post('/registro', async(req, res) => {
    const newuser = req.body;
    await userbank.newuser(newuser.Nombre,newuser.email,newuser.password)
    const userlogin = await userbank.getuser(newuser.email,newuser.password);
    console.log("usuario ",userlogin);
    const token = jwt.sign(userlogin[0],secret,{expiresIn:"1m"});
    res.redirect(`/cuenta?token=${token}`);
});
app.get('/cuenta',async(req,res)=>{
    const token = req.query.token;
    jwt.verify(token, 'bmora28@gmail.com', (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:');
            res.redirect('/');
            
        } else {
            
            let nombre =decoded.nombre
            let apellido =decoded.apellido
                let email =decoded.email
                let rut =decoded.rut
                let foto =decoded.foto
                let numero_telefonico =decoded.numero_telefonico
                let direccion =decoded.direccion
                let comuna =decoded.comuna
                let region =decoded.region
                let id =decoded.id
                
                res.render('cuenta',{email,nombre,apellido,region,foto,rut,numero_telefonico,direccion,comuna,id,token});
                
            }
        });
        res.render('cuenta',)
    });
    app.post('/cuenta',async(req,res)=>{
        const userpush= req.body;
        await userbank.actualizarUsuario(   userpush.id,
            userpush.Nombre,
            userpush.Apellido,
            userpush.email,
            userpush.rut,
            userpush.numero,
            userpush.Direccion,
            userpush.region,
            userpush.comuna)
            
            const userlogin = await userbank.getuserid(userpush.id);
            const token = jwt.sign(userlogin[0],secret,{expiresIn:"1m"});
            res.redirect(`/cuenta?token=${token}`);
});

app.post('/delete',async(req,res)=>{
    await userbank.eliminarUser(req.body.delete)
    res.redirect('/');
});
app.post('/transferir',async(req,res)=>{
    
            const transferencia = req.body;
            await userbank.transferirenciaUser(transferencia.id,transferencia.destinatario,transferencia.monto,transferencia.comentario)
            // await userbank.transferirenciaUser(1,8,100,"a")
            console.log("transferencia realizada");
            res.redirect('/',{token});
            
        
    
});





app.all('*',(req,res)=>{
    res.status(404).render('error')
});
app.listen(3000, () => {
    console.log('Server on port 3000');
});
