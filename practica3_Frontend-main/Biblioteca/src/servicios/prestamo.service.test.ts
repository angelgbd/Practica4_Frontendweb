import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PrestamoService } from './prestamo.service.js';
import { InMemoryPrestamoRepository } from '../infra/in-memory-prestamo.repository.js';
import { EjemplarPrestadoError } from '../errores/ejemplar-prestado.error.js';

function servicioNuevo(): PrestamoService {
  return new PrestamoService(new InMemoryPrestamoRepository());
}

describe('PrestamoService', () => {
  it('camino feliz: crea un prestamo activo', async () => {
    const servicio = servicioNuevo();

    const prestamo = await servicio.crear({
      libroId: 'LIB-0417',
      socioId: 'S-001',
      ejemplares: [14, 15],
    });

    assert.equal(prestamo.estado, 'activo');
    assert.equal(prestamo.libroId, 'LIB-0417');
    assert.equal(prestamo.socioId, 'S-001');
    assert.deepEqual(prestamo.ejemplares, [14, 15]);
    assert.match(prestamo.folio, /^P-\d+$/);

    const lista = await servicio.listarPorLibro('LIB-0417');
    assert.equal(lista.length, 1);
    assert.equal(lista[0]?.folio, prestamo.folio);
  });

  it('ejemplar duplicado: lanza EjemplarPrestadoError', async () => {
    const servicio = servicioNuevo();

    await servicio.crear({
      libroId: 'LIB-0417',
      socioId: 'S-001',
      ejemplares: [14, 15],
    });

    await assert.rejects(
      () =>
        servicio.crear({
          libroId: 'LIB-0417',
          socioId: 'S-002',
          ejemplares: [15, 16],
        }),
      (error: unknown) => {
        assert.ok(error instanceof EjemplarPrestadoError);
        assert.equal(error.ejemplar, 15);
        return true;
      },
    );
  });
});
