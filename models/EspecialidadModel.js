import mongoose from 'mongoose';

const EspecialidadSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, unique: true, index: true },
    descripcion: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
  },
  { timestamps: true }
);

// Búsqueda por texto en nombre
EspecialidadSchema.index({ nombre: 'text' });

export default mongoose.model('Especialidad', EspecialidadSchema);
