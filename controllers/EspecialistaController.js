import Especialista from '../models/EspecialistaModel.js';
import ApiError from '../utils/ApiError.js';

// GET /api/specialists  (lista + filtros + búsqueda)
export const list = async (req, res, next) => {
  try {
    const { modality, insurance, specialty, city, province, q } = req.query;

    const filter = {};
    if (modality) filter.modality = modality;
    if (insurance) filter.insurance = insurance;
    if (specialty) filter.specialties = { $in: [specialty] };
    if (city) filter.city = new RegExp(`^${city}$`, 'i');
    if (province) filter.province = new RegExp(`^${province}$`, 'i');
    if (q) filter.$text = { $search: q };

    const docs = await Especialista.find(filter).sort({ createdAt: -1 });
    res.json({ ok: true, total: docs.length, data: docs });
  } catch (e) { next(e); }
};

// GET /api/specialists/:id
export const getById = async (req, res, next) => {
  try {
    const doc = await Especialista.findById(req.params.id);
    if (!doc) throw new ApiError(404, 'Especialista no encontrado');
    res.json({ ok: true, data: doc });
  } catch (e) { next(e); }
};

// POST /api/specialists  (protegido)
export const create = async (req, res, next) => {
  try {
    const payload = { ...req.body, createdBy: req.user.id };
    const doc = await Especialista.create(payload);
    res.status(201).json({ ok: true, data: doc });
  } catch (e) { next(e); }
};

// PUT /api/specialists/:id  (protegido)
export const update = async (req, res, next) => {
  try {
    const doc = await Especialista.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!doc) throw new ApiError(404, 'Especialista no encontrado');
    res.json({ ok: true, data: doc });
  } catch (e) { next(e); }
};

// DELETE /api/specialists/:id  (protegido)
export const remove = async (req, res, next) => {
  try {
    const doc = await Especialista.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, 'Especialista no encontrado');
    res.json({ ok: true, message: 'Eliminado' });
  } catch (e) { next(e); }
};
