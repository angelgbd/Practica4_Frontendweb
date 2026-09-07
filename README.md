1. Express manda los rechazos de un handler async directo al middleware de errores, sin try/catch en cada ruta. ¿Qué tendrían que agregar en cada ruta si esto no fuera así?
   Tendrían que envolver cada handler async en try/catch y llamar a next(error) o un wrapper usando asyncHandler.
2. ¿Por qué el servicio no lanza directamente un 409 en vez de EjemplarPrestadoError?
    PrestamoService pertenece a la capa de negocio y no debe conocer HTTP ni códigos como 409. El middleware http decide traducirla a 409. Asi es desacoplable y no depende de una app o una api especifica.
3. Si mañana agregaran una app móvil que también consume esta API, ¿qué archivos de esta práctica tendrían que tocar?
   Solo se desarrollaría el cliente móvil por que se consume la misma api, no habría necesidad de tocar nada de el backend.

Profe por cierto llevo toda la semana sin laptop personal por que no pude probarlo con express por que no puedo instalar node en las compus del cisco. En cuanto pueda hago las pruebas.
