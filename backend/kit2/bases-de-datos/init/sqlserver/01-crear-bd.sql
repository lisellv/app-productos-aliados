-- Lo ejecuta el servicio "db-init" cada vez que enciendes el compose.
-- Por eso todo va con "IF ... IS NULL": si ya existe, no hace nada.

-- 1) Crear la base de datos (SQL Server no la crea solo)
IF DB_ID('servicetechdb') IS NULL
    CREATE DATABASE servicetechdb;
GO

USE servicetechdb;
GO

-- 2) Tabla de prueba que NO choca con las tablas de tu backend
IF OBJECT_ID('dbo.kit_prueba') IS NULL
BEGIN
    CREATE TABLE dbo.kit_prueba (
        id       INT IDENTITY(1,1) PRIMARY KEY,
        mensaje  NVARCHAR(200) NOT NULL,
        creado   DATETIME2     NOT NULL DEFAULT SYSDATETIME()
    );
    INSERT INTO dbo.kit_prueba (mensaje) VALUES (N'Hola desde el script de inicio de SQL Server');
END
GO
