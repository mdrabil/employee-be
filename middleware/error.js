import { StatusCodes } from 'http-status-codes';


export function notFound(req, res, next) {
res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Route not found' });
}


export function errorHandler(err, req, res, next) {
console.error(err);
const code = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
res.status(code).json({ success: false, message: err.message || 'Server error' });
}