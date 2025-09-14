import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import especialidadRouter from './routes/EspecialidadRouter.js';

app.use('/api/specialists', especialistaRouter);
app.use('/api/especialidades', especialidadRouter);


import indexRouter from './routes/index.js';
import usuarioRouter from './routes/UsuarioRouter.js';
import especialistaRouter from './routes/EspecialistaRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares base
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Static (landing HTML + assets)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRouter);
app.use('/api/auth', usuarioRouter);
app.use('/api/specialists', especialistaRouter);

// Manejo de errores centralizado
app.use(errorHandler);

// Conexión DB y arranque
const { URI_DB, DB_NAME, PORT = 5000 } = process.env;


// DEBUG (no imprime tu password)
const uri = process.env.URI_DB?.trim();
console.log('🔍 Host:', uri?.split('@')[1]?.split('/')[0]);  // ej: cluster0.yeqwjeg.mongodb.net
console.log('🔍 DB_NAME:', process.env.DB_NAME);             // ej: ta_api

mongoose
  .connect(process.env.URI_DB)   // ← sin { dbName: ... }
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });
