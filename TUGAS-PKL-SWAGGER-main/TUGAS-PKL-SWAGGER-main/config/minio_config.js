const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: '192.168.18.66', 
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

const bucketName = 'pkl-images'; // Ganti dengan nama bucketmu

// Fungsi untuk inisialisasi bucket otomatis
const initBucket = async () => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`Bucket "${bucketName}" berhasil dibuat.`);

            // Policy untuk akses Public Read-Only
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetBucketLocation", "s3:ListBucket"],
                        Resource: [`arn:aws:s3:::${bucketName}`]
                    },
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${bucketName}/*`]
                    }
                ]
            };

            // Terapkan policy ke bucket
            await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
            console.log(`Policy Public Read-Only berhasil diterapkan pada "${bucketName}".`);
        } else {
            console.log(`Bucket "${bucketName}" sudah ada.`);
        }
    } catch (err) {
        console.error('Gagal inisialisasi bucket:', err);
    }
};

initBucket();

module.exports = { minioClient, bucketName };