const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter)

db.defaults({ peso: [], hora_salida: [], hora_llegada: [], t_entrega: [], t_regreso: [], obstaculos: 0 })
    .write();

var app = express();
app.use(cors());
app.use(bodyParser.json());

var actual = -1;
var nsalidas = 0;
var nllegadas = 0;

var totaPaquetes = 0;

var datosCarro = {
    estado: "",
    position: "",
    h_salida: "",
    h_llegada: "",
    peso: "",
    obstaculos: "",
    total_paquetes: "",
    peso_promedio: "",
    promedio_entrega: "",
    promedio_buzon: "",
}

var mCarrito = "1";

//Ubicacion-Estado-Peso-NumeroObstaculos
app.post('/setestados', (req, res) => {
    //console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    console.log(req.body.valores);

    let datos = req.body.valores.split('-');

    if(datos[0] == 0) {
        if(actual != datos[0]) {
            nsalidas++;
            actual = parseInt(datos[0]);

            datosCarro.h_salida = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            datosCarro.position = datos[0];
            datosCarro.estado = mCarrito;
            datosCarro.peso = 0;
            
            db.get('hora_salida')
              .push({ id: nsalidas, hora: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), milis: new Date().getTime() })
              .write();

            if(db.get('hora_llegada').size().value() > 0) {

                db.get('t_regreso')
                  .push({ tiempo: (db.get('hora_salida').find({ id: nsalidas }).value().milis - db.get('hora_llegada').find({ id: nllegadas }).value().milis) / 1000 })
                  .write();
                  datosCarro.obstaculos = datos[3];
            } 
        }
    } else if(datos[0] == 1) {
        if(actual != datos[0] && parseInt(datos[2]) > 0) {
            actual = parseInt(datos[0]);

            datosCarro.peso = datos[2];
            datosCarro.position = datos[0];

            db.get('peso')
              .push({ peso: parseInt(datos[2]) })
              .write();
        }

        datosCarro.estado = mCarrito;
        datosCarro.obstaculos = datos[3];
    } else if(datos[0] == 2) {
        if(actual != datos[0]) {
            nllegadas++;

            actual = parseInt(datos[0]);
            
            datosCarro.h_llegada = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            datosCarro.position = datos[0];
            datosCarro.estado = mCarrito;
            datosCarro.obstaculos = datos[3];

            db.get('hora_llegada')
              .push({ id: nllegadas, hora: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), milis: new Date().getTime() })
              .write();

            db.get('t_entrega')
              .push({ tiempo: (db.get('hora_llegada').find({ id: nsalidas }).value().milis - db.get('hora_salida').find({ id: nsalidas }).value().milis) / 1000 })
              .write();

            totaPaquetes++;
            datosCarro.total_paquetes = totaPaquetes;
        }
    }
    
    db.update('obstaculos', n => datos[3]) 
      .write();

    res.json('ok');
})

app.post('/movercarro', (req, res) => {
    console.log('Mover carro: ' + req.body.status);
    mCarrito = req.body.status;
    res.json('ok');
});

app.get('/getestados', (req, res) => {
    console.log("Mandando estados");

    datosCarro.estado = datosCarro.estado + "";
    datosCarro.position = datosCarro.position + "";
    datosCarro.h_salida = datosCarro.h_salida + "";
    datosCarro.h_llegada = datosCarro.h_llegada + "";
    datosCarro.peso = datosCarro.peso + "";
    datosCarro.obstaculos = datosCarro.obstaculos + "";
    datosCarro.total_paquetes = datosCarro.total_paquetes + "";

    if(db.get('peso').size().value() > 0) {
        promedioPeso = 0;
        db.get('peso').map('peso').value().forEach(element => {
            promedioPeso = promedioPeso + element;
        });
        promedioPeso = promedioPeso / db.get('peso').size().value();
        datosCarro.peso_promedio = promedioPeso + "";
    } else {
        datosCarro.peso_promedio = "0";
    }

    if(db.get('t_entrega').size().value() > 0) {
        promedioLlegada = 0;
        db.get('t_entrega').map('tiempo').value().forEach(element => {
            promedioLlegada = promedioLlegada + element;
        });
        promedioLlegada = promedioLlegada / db.get('t_entrega').size().value();
        datosCarro.promedio_entrega = promedioLlegada + "";
    } else {
        datosCarro.promedio_entrega = "0";
    }

    if(db.get('t_regreso').size().value() > 0) {
        promedioRegreso = 0;
        db.get('t_regreso').map('tiempo').value().forEach(element => {
            promedioRegreso = promedioRegreso + element;
        });
        promedioRegreso = promedioRegreso / db.get('t_regreso').size().value();
        datosCarro.promedio_buzon = promedioRegreso + "";
    } else {
        datosCarro.promedio_buzon = "0";
    }
    
    res.json(datosCarro);
});

app.get('/getestadoactivo', (req, res) => {
    if(mCarrito == "") {
        res.send("s");
    } else {
        res.send("n");
    }
})

app.get('/promedio', (req, res) => {
    promedioPeso = 0;
    db.get('peso').map('peso').value().forEach(element => {
        promedioPeso = promedioPeso + element;
    });
    promedioPeso = promedioPeso / db.get('peso').size().value();
    console.log(promedioPeso);
    res.json(promedioPeso);
});


app.listen(3000, (err) => {
    if (err) console.log('Ocurrio un error'), process.exit(1);

    console.log('Escuchando en el puerto 3000');
});
