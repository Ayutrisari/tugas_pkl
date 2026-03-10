const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
const cors = require('cors');

// --- 1. IMPORT SEMUA ROUTE PATHS ---
const authRoutes = require('./routes/auth_route'); 
const postRoutes = require('./routes/post_route'); 
const categoryRoutes = require('./routes/category_route');
const userRoutes = require('./routes/user_route');
const reviewRoutes = require('./routes/review_route'); // Rute Review Baru
const postPaths = require('./routes/post_swagger'); // Import Swagger Paths

dotenv.config();
const app = express();

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- 3. KONFIGURASI SWAGGER ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Flower App & User CRUD',
      version: '1.0.0',
      description: 'Dokumentasi API untuk aplikasi koleksi bunga, rating, dan komentar',
    },
    paths: {
      ...postPaths, // Menggabungkan dokumentasi swagger post
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

// --- 4. PENDAFTARAN SEMUA ENDPOINT API ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes); // Endpoint untuk Rating & Komentar

// --- 5. HANDLING ROUTE TIDAK DITEMUKAN (Optional tapi bagus) ---
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan, besti!' });
});

// --- 6. JALANKAN SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌸 ============================================`);
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`============================================ 🌸\n`);
});