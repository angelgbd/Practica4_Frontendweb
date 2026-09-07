1. ¿Hizo falta una base de datos real para probar la regla de negocio? ¿Qué dice eso sobre para qué sirve el patrón Repository?
   No, justo en eso consiste el patron repository que trata la persistencia como un puerto, no se sabe si detras hay un mock o una base de datos real, lo
   cual es excelente para desacoplar componentes
2. El Service recibe el repositorio como Repository<Prestamo>, no InMemoryPrestamoRepository. ¿Qué se rompía si usaban la clase concreta?
   El service importaria a infra, quedaria acoplado y tampoco podrias inyectar otra implementacion sin cambiar el service
3. Si cambiaran el Map en memoria por una base de datos real, ¿cuántos archivos tocarían? ¿Por qué tan pocos?
   muy poco, nueva clase en infra y el main el cambio seria en la implementacion pero las reglas son las mismas, el contrato manda vaya.
