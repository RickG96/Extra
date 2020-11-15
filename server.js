const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

var app = express();
app.use(cors());
app.use(bodyParser.json());

db.defaults({ posts: [], visitas: 0, temperatura: [], tiempo: [] })
    .write();

let enviar = {};

app.post('/infoed3', (req, res) => {
   if(req.body.data == null) {
       res.json("null");
   } else {
       let datos = req.body.data.split('-');
       
       enviar = {
           clean: datos[0],
           temp_user: datos[1],
           temp_amb: datos[2],
           temp_ok: datos[3],
           fase: datos[4],
       }
       console.log(enviar);
       db.get('posts')
        .push(enviar)
        .write();
   }
   
    res.json('ok'); 
});

app.get('/visitante', (req, res) => {
    db.update('visitas', n => n + 1)
        .write();
    
    res.json('vistas totales: ' + db.get('visitas').value());
});

app.post('/temperatura', (req, res) => {
    db.get('temperatura')
        .push(req.body.temperatura)
        .write();
    res.json('ok');
});

app.post('/tiempo', (req, res) => {
    db.get('tiempo')
        .push(req.body.tiempo)
        .write();
    res.json('ok');
});

app.get('/gettemperatura', (req, res) => {
    let temp = 0;
    db.get('temperatura').value().forEach(element => {
        temp = temp + element;
    });
    temp = temp / db.get('temperatura').size().value();
    let openload ={
        temperatura: temp.toFixed(2)
    }
    res.json(openload);
});

app.get('/gettiempo', (req, res) => {
    let tiempo_t = 0;
    db.get('tiempo').value().forEach(element => {
        tiempo_t = tiempo_t + element;
    });
    tiempo_t = tiempo_t / db.get('tiempo').size().value();
    let openload = {
        tiempo: tiempo_t.toFixed(2)
    }
    res.json(openload);
});

app.get('/getvisitas', (req, res) => {
    let numeroVisitas = db.get('visitas').value();
    let openload = {vistas: numeroVisitas + ''}
    res.json(openload);
})

app.get('/getinfoed3', (req, res) => {
    res.json(enviar);
});

app.listen(3000, (err) => {
    if (err) console.log('Ocurrio un error'), process.exit(1);

    console.log('Escuchando en el puerto 3000');
});
