const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'public')));


const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
    console.log('✅ Backend Sunucusu MQTT Broker\'ına bağlandı.');
    
    
    mqttClient.subscribe('bulutproje4/hava_durumu', (err) => {
        if (!err) {
            console.log('"bulutproje4/hava_durumu" konusu dinleniyor...');
        }
    });
});
mqttClient.on('message', (topic, message) => {
    const hamVeri = message.toString();
    const parseEdilmisVeri = JSON.parse(hamVeri);
    
    console.log(`📩 Broker'dan Gelen Veri [${topic}]:`, parseEdilmisVeri);
    
    io.emit('anlik-iot-verisi', parseEdilmisVeri);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n  Dashboard Paneli http://localhost:${PORT} adresinde hazır!`);
});