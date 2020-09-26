const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

var admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "smartcarweb-74525",
        "private_key_id": "6589ad5dd678810d3a395632f844ddbc5a9bab3e",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEkUbFA5NYbUgk\nvu45xxLMj5OnKbyHz4MqvQG0dz74iAxiLZGWb2K2j9UOxjXeg6wcN09c7vnM8Urc\nGkTxrETcyS1H/3P/+MWL2Otk0M3+rSHylS4vUODnyDktyPUopbMQJR7iEQFmTewz\nJRFdKH3foK7PhH/rufEUJW8nz5FVfSM7feBBVx2y7hi5c+CR4yZmyvmD/Z0Sud2m\ng/HVNIPwVsgw0jRoB1Wq3ggx6UaCTBG69JqllnPHM7xVjs+miSXBAazXcJmm+FPw\nkxpCJqfDU+Sqd+tA5zUCVMpgNDlAhd+JTmqLBNUh+D0e/UuBwWBVK6LHDYzmwQ9K\neLvOoxPzAgMBAAECggEAH7zLHeVBZZ4jb1dqlGaZmPC3qN5aw9zT81MYEuDMCInC\n4hk0cAMk/5ACmQOU0AwXfmjJxhoJuDbfXOFa72Ber/1Fc+IBgztR/g30l88E65Fd\nsVK35cjbv2C7JrLTLpBudHVh4qNXRALh17Is9wsiI7jIcNYWZ2Oa0qNmqplfgFtP\nCEhkvBzdW71oV8OiUP10AKS0F6dNuMpHtLNbPPV3P8tqGFXmsXYyKUiJDzKmSHEp\nHuzCoij4BqwggofHDs9IcQoMZam5BmQ1l8PEFpCXxO4pEaFf6jufZPNsV4OSCx0P\nUIMobwMIg9ByDp7NW1WH5D/XZSqsMZCINaRHXuCinQKBgQDs8h7Hy8X+kRpDVptJ\nPbXLr8cpzzv+uZKnPnVzTCsr/C8/uESgYnroRYB1hLlbmUxM6b3p0BCchkxu5uuf\nZ3FnuxPRPLWSXea1MU+oqaIk/aEFndk31omWGyzm3WeHq28a62do3VjjvbOIIhl+\nvKYRwYZrD88tHbOHE4/ZMCxvbQKBgQDUX+jBFeFoRxQZxqrpmDz1iWfhdIm/WHB+\nZMn+KKJGkIwVItMb0jzN/NilvC6QMhaIdx8ELnRVI6Z4865KfnJHdO145z0TBC9q\nFEgavxPAICWF0V9KGZumH3IVAv08Yt+fF2nItiPbEKhizVRY2FfL5xT8kDTSPMyz\nKk4rbK+U3wKBgEg+cmAco1vAxi8t4t7r79gQ2jrHMtWxoyNXCdyDps4ccBOPjW0R\nWcQkHMy4EQP6s6bnxb3acJYo5HkT81eA5LTp91relcXw13z7cfxM7GE267eYrzg1\nM3IPCxvA+eYFwTSF/dudUZLuriSdsQRRZJkZVnCiO1rYKXrP3hYsd//pAoGAUyYV\n3/ssHIKvuQPSiNDFFTEuDdRt1g/PQ308pJjOKCiR3/iZhOwESHX1cLZD2MrzjYxu\nBVoWy/rAQ9zMYXguUBHUpCCNBfP+iF7WeDpVhkRPzJvT3hQ2n4zyQo3ADjN78DLf\nhOjjEvLrqntPydUyUq/vxI7FT4bkckVfA5tzBysCgYBPT9qerV3szCVzFn5is9GO\n0x/iyi/BckIZz+kn6rZ4ETfuNAinW0SWq5mOnTBVT4vvrPEl5iiyH+DrwZcVpSfQ\nbwCZWWuP2TOBs9Aj5vKwTXyKh2Wy69cQGVEjo2Tv5jmsJhBuu8YRwrqEcUbF9fs9\n/xs6utG92LPtaRmRVCDFvw==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-tmkly@smartcarweb-74525.iam.gserviceaccount.com",
        "client_id": "116905074636670847755",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tmkly%40smartcarweb-74525.iam.gserviceaccount.com"
      }),
      databaseURL: "https://smartcarweb-74525.firebaseio.com"
});
const dba = admin.firestore();
const messaging = admin.messaging();

db.defaults({ peso: [], hora_salida: [], hora_llegada: [], t_entrega: [], t_regreso: [], obstaculos: 0 })
    .write();

var app = express();
app.use(cors());
app.use(bodyParser.json());

var tokenFB = "AAAAr88BvCs:APA91bEo_Ag6w_kL8_DEqa-eR9WKXgLQkl6bBVO1oHZjSFzssKGCF1f4FJhamoBD3ZP64JcW0H7jL7LVS5GFAi7Or2h4pc-UG7FY60W3J-4xklFgm5nzYnYrjivdZGArbQLG-IIjsa3l";

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
    if(req.body.valores == null) {
        console.log("Es nulo");
        res.json("null");
    } else {
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
    }
    
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
    console.log('Enviando a carrito...');
    if(mCarrito == "") {
        res.send("s");
    } else {
        res.send("n");
    }
});

app.get('/promedio', (req, res) => {
    promedioPeso = 0;
    db.get('peso').map('peso').value().forEach(element => {
        promedioPeso = promedioPeso + element;
    });
    promedioPeso = promedioPeso / db.get('peso').size().value();
    console.log(promedioPeso);
    res.json(promedioPeso);
});

function hola () {
    var message = {
        notification: {
            title: 'Esperando',
            body: 'El carrito se encuentra esperando un paquete'
        },
        android: {
            notification: {
            icon: 'stock_ticker_update',
            color: '#7e55c3'
            }
        },
        token: tokenFB
    };
    admin.messaging().send(message)
        .then((res) => {
            console.log('Notificación de buzon enviada con exito!');
        })
        .catch((err) => {
            console.log(err);
        })
}

app.listen(3000, (err) => {
    if (err) console.log('Ocurrio un error'), process.exit(1);

    console.log('Escuchando en el puerto 3000');
});
