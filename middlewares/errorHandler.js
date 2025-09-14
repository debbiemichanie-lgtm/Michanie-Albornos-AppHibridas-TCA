export default function errorHandler(err, req, res, next) {
  console.error('ERROR:', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(status).json({ ok: false, message });
}
