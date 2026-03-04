const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: '192.168.18.66', // Sesuai IP di dashboard MinIO kamu
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

module.exports = minioClient;