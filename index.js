import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import indexRouter from './routes/index.js';
import usuarioRouter from './routes/UsuarioRouter.js';
import especialistaRouter from './routes/EspecialistaRouter.js';
import especialidadRouter from './routes/EspecialidadRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1) crear la app ANTES de usarla
const app = express();
const PORT = process.env.PORT || 5000;


// lindo formato de JSON en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.set('json spaces', 2);
}

// 2) middlewares base
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3) rutas
app.use('/', indexRouter);
app.use('/api/auth', usuarioRouter);
app.use('/api/specialists', especialistaRouter);
app.use('/api/especialistas', especialistaRouter);   // alias en castellano (opcional)
app.use('/api/especialidades', especialidadRouter);

// 4) manejador de errores
app.use(errorHandler);

// 5) DB + arranque del server
const uri = process.env.URI_DB?.trim();
mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    // opcional: arrancar igual para debug de rutas estáticas
    app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT} (sin DB)`));
  });
