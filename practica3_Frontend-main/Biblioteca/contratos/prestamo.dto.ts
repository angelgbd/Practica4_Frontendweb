import type { EstadoPrestamo, Prestamo } from '../src/dominio/prestamo.entity.js';

/** Datos públicos que devuelve la API. */
export interface PrestamoResponseDto {
  folio: string;
  libroId: string;
  ejemplares: number[];
  socioId: string;
  estado: EstadoPrestamo;
  creadoEn: string;
}

/** Datos que acepta la API al crear un préstamo. */
export type CrearPrestamoRequestDto = Omit<
  Prestamo,
  'folio' | 'creadoEn' | 'estado' | 'costoReposicion'
>;

/** Forma común de los errores enviados por la API. */
export interface ErrorResponseDto {
  mensaje: string;
}

/**
 * Convierte una entidad interna en el DTO que puede salir por la API.
 * La fecha se serializa como ISO y costoReposicion queda fuera.
 */
export function aResponseDto(prestamo: Prestamo): PrestamoResponseDto {
  return {
    folio: prestamo.folio,
    libroId: prestamo.libroId,
    ejemplares: [...prestamo.ejemplares],
    socioId: prestamo.socioId,
    estado: prestamo.estado,
    creadoEn: prestamo.creadoEn.toISOString(),
  };
}
