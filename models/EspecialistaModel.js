import mongoose from 'mongoose';

const EspecialistaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, index: true },
    profesion: {
      type: String,
      enum: ['psicologa', 'nutricionista', 'psiquiatra', 'ginecologa', 'medico_clinico', 'otro'],
      required: true
    },
    modality: { type: String, enum: ['presencial', 'virtual', 'mixta'], required: true },
    insurance: { type: String, enum: ['prepaga', 'particular', 'ambas'], required: true },
    specialties: [{ type: String, trim: true }], // p.ej. anorexia, bulimia, TCA, atracón
    city: { type: String, required: true, trim: true },
    province: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    social: {
      instagram: { type: String, trim: true },
      web: { type: String, trim: true }
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
  },
  { timestamps: true }
);

// Búsqueda por nombre con índice de texto simple
EspecialistaSchema.index({ nombre: 'text' });

export default mongoose.model('Especialista', EspecialistaSchema);
