import express from 'express';
import hbs from 'hbs';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const secret = "bmora28@gmail.com"

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
hbs.registerPartials(__dirname + '/views/partials');

// app.get('/',async(req,res)=>{});
// app.post('/',async(req,res)=>{});
app.get('/',async(req,res)=>{
    res.render('index');  
});
app.listen(3000, () => {
    console.log('Server on port 3000');
});
app.all('*',(req,res)=>{
    res.status(404).render('error')
});
