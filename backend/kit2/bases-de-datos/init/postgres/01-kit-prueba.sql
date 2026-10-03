-- Se ejecuta SOLO en el primer arranque (cuando el volumen está vacío).
-- Crea una tabla de prueba que NO choca con las tablas de tu backend.
-- Para que vuelva a ejecutarse: docker compose -f postgres-17.yml down -v
CREATE TABLE IF NOT EXISTS kit_prueba (
    id       SERIAL PRIMARY KEY,
    mensaje  VARCHAR(200) NOT NULL,
    creado   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO kit_prueba (mensaje) VALUES ('Hola desde el script de inicio de PostgreSQL');
