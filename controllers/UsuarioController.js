import jwt from 'jsonwebtoken';
import Usuario from '../models/UsuarioModel.js';
import ApiError from '../utils/ApiError.js';

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) throw new ApiError(409, 'El email ya está registrado');
    const user = await Usuario.create({ nombre, email, password, rol });
    const token = signToken(user);
    res.status(201).json({ ok: true, token, user: { id: user._id, nombre, email, rol: user.rol } });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) throw new ApiError(401, 'Credenciales inválidas');
    const ok = await user.compararPassword(password);
    if (!ok) throw new ApiError(401, 'Credenciales inválidas');
    const token = signToken(user);
    res.json({ ok: true, token, user: { id: user._id, nombre: user.nombre, email, rol: user.rol } });
  } catch (e) { next(e); }
};

export const me = async (req, res, next) => {
  try {
    const user = await Usuario.findById(req.user.id).select('-password');
    res.json({ ok: true, user });
  } catch (e) { next(e); }
};

