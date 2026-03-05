const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
const cors = require('cors');

// --- IMPORT FILE PATHS YANG BARU KAMU BUAT ---
const postPaths = require('./routes/post_swagger'); // Sesuaikan folder tempat lo simpen file tadi

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Flower App & User CRUD',
      version: '1.0.0',
    },
    // --- MASUKKAN KODE LO DI SINI ---
    paths: {
      ...postPaths, // Titik tiga ini artinya menggabungkan isi postPaths ke sini
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ... sisa kode pendaftaran route lo (authRoutes, postRoutes, dll) ...
// --- PENDAFTARAN SEMUA ROUTE SESUAI FILE LO ---
const authRoutes = require('./routes/auth_route'); 
const postRoutes = require('./routes/post_route'); // INI YANG BUAT UPLOAD BUNGA
const categoryRoutes = require('./routes/category_route');
const userRoutes = require('./routes/user_route');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌸 Server jalan di http://localhost:${PORT}`);
  console.log(`🚀 CEK SWAGGER SEKARANG: http://localhost:${PORT}/api-docs`);
});