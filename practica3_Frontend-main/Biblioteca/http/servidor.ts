import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { InMemoryPrestamoRepository } from '../src/infra/in-memory-prestamo.repository.js';
import { PrestamoService } from '../src/servicios/prestamo.service.js';
import { aResponseDto } from '../contratos/prestamo.dto.js';
import { ErrorValidacion, validarCrearPrestamo } from './validar.js';
import { EjemplarPrestadoError } from '../src/errores/ejemplar-prestado.error.js';

const app = express();
const repositorio = new InMemoryPrestamoRepository();
const servicio = new PrestamoService(repositorio);

app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, '../publico')));

app.get('/api/prestamos', async (req, res) => {
  const libroId = typeof req.query.libroId === 'string'
    ? req.query.libroId.trim()
    : '';

  if (libroId === '') {
    res.status(400).json({ mensaje: 'El parámetro libroId es obligatorio' });
    return;
  }

  try {
    const prestamos = await servicio.listarPorLibro(libroId);

    // Nunca exponemos la entidad: costoReposicion es un dato interno.
    res.status(200).json(prestamos.map(aResponseDto));
  } catch {
    res.status(500).json({ mensaje: 'No se pudieron consultar los préstamos' });
  }
});

app.post('/api/prestamos', async (req, res, next) => {
  try {
    const dto = validarCrearPrestamo(req.body);
    const creado = await servicio.crear(dto);

    res
      .status(201)
      .location(`/api/prestamos/${encodeURIComponent(creado.folio)}`)
      .json(aResponseDto(creado));
  } catch (error) {
    next(error);
  }
});

// Middleware de errores: debe tener exactamente cuatro parámetros.
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ErrorValidacion) {
    res.status(400).json({ mensaje: error.message });
    return;
  }

  if (error instanceof EjemplarPrestadoError) {
    res.status(409).json({ mensaje: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

export { app };

const puerto = Number(process.env.PORT ?? 3000);
const archivoActual = fileURLToPath(import.meta.url);
const archivoEjecutado = process.argv[1]
  ? path.resolve(process.argv[1])
  : '';

if (archivoEjecutado === archivoActual) {
  app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
  });
}
