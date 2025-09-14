import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export default function auth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, 'Token requerido'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, rol: decoded.rol };
    next();
  } catch {
    next(new ApiError(401, 'Token inválido o expirado'));
  }
}
