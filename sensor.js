const mqtt = require('mqtt');

// Lokal Docker üzerinde çalışan Mosquitto MQTT Broker'ına bağlanıyoruz
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('--- Akıllı Şehir IoT Simülatörü Aktif ---');
    console.log('MQTT Broker\'ına başarıyla bağlanıldı. Veriler gönderiliyor...\n');
    
    // Her 5 saniyede bir buluta/brokera yeni veri gönderir
    setInterval(() => {
        const akilliSehirVerisi = {
            deviceId: "sensor_ankara_01",
            timestamp: Math.floor(Date.now() / 1000),
            sicaklik: (20 + Math.random() * 10).toFixed(1),      // 20-30 °C arası rastgele
            hava_kalitesi_pm25: (10 + Math.random() * 40).toFixed(1), // Hava kalitesi indeksi
            bos_otopark_sayisi: Math.floor(Math.random() * 50)  // 0-50 arası boş park yeri
        };

        // Veriyi 'bulutproje4/hava_durumu' başlığı (topic) altında yayınlıyoruz
        client.publish('bulutproje4/hava_durumu', JSON.stringify(akilliSehirVerisi));
        console.log('🚀 IoT Cihazından Gönderilen Veri:', akilliSehirVerisi);
    }, 5000);
});

client.on('error', (err) => {
    console.error('Bağlantı hatası:', err);
});