-- Se ejecuta SOLO en el primer arranque (cuando el volumen está vacío),
-- dentro de la base MYSQL_DATABASE (servicetechdb).
-- Crea una tabla de prueba que NO choca con las tablas de tu backend.
-- Para que vuelva a ejecutarse: docker compose -f mysql-8.4.yml down -v
CREATE TABLE IF NOT EXISTS kit_prueba (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    mensaje  VARCHAR(200) NOT NULL,
    creado   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO kit_prueba (mensaje) VALUES ('Hola desde el script de inicio de MySQL');
