import type { CrearPrestamoRequestDto } from '../contratos/prestamo.dto.js';

export class ErrorValidacion extends Error {
  constructor(public readonly errores: string[]) {
    super(errores.join('; '));
    this.name = 'ErrorValidacion';
  }
}

/** Valida el cuerpo de una petición sin confiar en su tipo de entrada. */
export function validarCrearPrestamo(dato: unknown): CrearPrestamoRequestDto {
  const errores: string[] = [];

  if (typeof dato !== 'object' || dato === null || Array.isArray(dato)) {
    throw new ErrorValidacion(['El cuerpo debe ser un objeto']);
  }

  const cuerpo = dato as Record<string, unknown>;
  const libroId = cuerpo.libroId;
  const socioId = cuerpo.socioId;
  const ejemplares = cuerpo.ejemplares;

  if (typeof libroId !== 'string' || libroId.trim() === '') {
    errores.push('libroId es obligatorio');
  }

  if (typeof socioId !== 'string' || socioId.trim() === '') {
    errores.push('socioId es obligatorio');
  }

  const ejemplaresValidos: number[] = [];
  if (!Array.isArray(ejemplares) || ejemplares.length === 0) {
    errores.push('ejemplares debe contener al menos un número');
  } else {
    ejemplares.forEach((ejemplar, indice) => {
      if (typeof ejemplar !== 'number' || !Number.isInteger(ejemplar) || ejemplar <= 0) {
        errores.push(`ejemplares[${indice}] debe ser un entero positivo`);
      } else {
        ejemplaresValidos.push(ejemplar);
      }
    });
  }

  if (errores.length > 0) {
    throw new ErrorValidacion(errores);
  }

  return {
    libroId: (libroId as string).trim(),
    socioId: (socioId as string).trim(),
    ejemplares: ejemplaresValidos,
  };
}
