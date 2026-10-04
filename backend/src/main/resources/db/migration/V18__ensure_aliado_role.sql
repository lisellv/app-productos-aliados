INSERT INTO
    rol (nombre_rol, alta)
VALUES ('aliado', 1) ON CONFLICT (nombre_rol) DO
UPDATE
SET
    alta = EXCLUDED.alta;
