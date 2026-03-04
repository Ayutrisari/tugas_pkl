const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: '192.168.18.66', // Gunakan IP laptop kamu
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

module.exports = minioClient;