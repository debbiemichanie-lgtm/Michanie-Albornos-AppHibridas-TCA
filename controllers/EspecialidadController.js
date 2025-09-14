import Especialidad from '../models/EspecialidadModel.js';
import ApiError from '../utils/ApiError.js';

// GET /api/especialidades  (lista + ?q=busqueda)
export const list = async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = q ? { $text: { $search: q } } : {};
    const data = await Especialidad.find(filter).sort({ nombre: 1 });
    res.json({ ok: true, total: data.length, data });
  } catch (e) { next(e); }
};

// GET /api/especialidades/:id
export const getById = async (req, res, next) => {
  try {
    const doc = await Especialidad.findById(req.params.id);
    if (!doc) throw new ApiError(404, 'Especialidad no encontrada');
    res.json({ ok: true, data: doc });
  } catch (e) { next(e); }
};

// POST /api/especialidades  (protegido)
export const create = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const exists = await Especialidad.findOne({ nombre });
    if (exists) throw new ApiError(409, 'La especialidad ya existe');
    const doc = await Especialidad.create({ nombre, descripcion, createdBy: req.user.id });
    res.status(201).json({ ok: true, data: doc });
  } catch (e) { next(e); }
};

// PUT /api/especialidades/:id  (protegido)
export const update = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const doc = await Especialidad.findByIdAndUpdate(
      req.params.id,
      { $set: { nombre, descripcion } },
      { new: true, runValidators: true }
    );
    if (!doc) throw new ApiError(404, 'Especialidad no encontrada');
    res.json({ ok: true, data: doc });
  } catch (e) { next(e); }
};

// DELETE /api/especialidades/:id  (protegido)
export const remove = async (req, res, next) => {
  try {
    const doc = await Especialidad.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, 'Especialidad no encontrada');
    res.json({ ok: true, message: 'Eliminada' });
  } catch (e) { next(e); }
};
