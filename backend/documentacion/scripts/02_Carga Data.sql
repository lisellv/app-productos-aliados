-- 1. Roles del sistema.
INSERT INTO rol (nombre_rol, alta)
VALUES
	('administrador', 1),
	('aliado', 1)
ON CONFLICT (nombre_rol) DO NOTHING;

-- 2. Aliados comerciales.
INSERT INTO aliado
	(tipo_documento, numero_documento, razon_social, contacto_nombre, contacto_correo, contacto_telefono, alta)
VALUES
	('RUC', '20123456789', 'Comercial Andina S.A.C.', 'Ana Torres', 'ana@andina.pe', '+51987654321', 1),
	('RUC', '20456789123', 'Servicios del Pacifico S.A.C.', 'Carlos Rojas', 'carlos@pacifico.pe', '+51981234567', 1)
ON CONFLICT (numero_documento) DO NOTHING;

-- 3. Usuarios: un administrador y un usuario para cada aliado.
INSERT INTO usuario
	(rol_id, aliado_id, correo_electronico, password_hash, alta)
VALUES
	((SELECT id FROM rol WHERE nombre_rol = 'administrador'), NULL,
	 'admin@financiamiento.pe', 'HASH_DE_PRUEBA_ADMIN', 1),
	((SELECT id FROM rol WHERE nombre_rol = 'aliado'),
	 (SELECT id FROM aliado WHERE numero_documento = '20123456789'),
	 'ana@andina.pe', 'HASH_DE_PRUEBA_ALIADO', 1),
	((SELECT id FROM rol WHERE nombre_rol = 'aliado'),
	 (SELECT id FROM aliado WHERE numero_documento = '20456789123'),
	 'carlos@pacifico.pe', 'HASH_DE_PRUEBA_ALIADO', 1)
ON CONFLICT (correo_electronico) DO NOTHING;

-- 4. Categorias de productos.
INSERT INTO categoria (nombre, descripcion, alta)
VALUES
	('Vehiculos', 'Vehiculos nuevos o usados ofrecidos por aliados', 1),
	('Equipamiento', 'Equipos y bienes para empresas', 1),
	('Capital de trabajo', 'Productos destinados a operaciones empresariales', 1)
ON CONFLICT (nombre) DO NOTHING;

-- 5. Productos de los aliados.
--select * from producto
INSERT INTO producto
	(aliado_id, categoria_id, nombre, descripcion, precio_lista, moneda, incluye_igv, estado, alta)
VALUES
	((SELECT id FROM aliado WHERE numero_documento = '20123456789'),
	 (SELECT id FROM categoria WHERE nombre = 'Vehiculos'),
	 'Camioneta comercial 4x4', 'Vehiculo para actividades comerciales', 95000.00, 'PEN', true, 'activo', 1),
	((SELECT id FROM aliado WHERE numero_documento = '20123456789'),
	 (SELECT id FROM categoria WHERE nombre = 'Equipamiento'),
	 'Equipo de refrigeracion industrial', 'Equipamiento para negocio', 28000.00, 'PEN', true, 'activo', 1),
	((SELECT id FROM aliado WHERE numero_documento = '20456789123'),
	 (SELECT id FROM categoria WHERE nombre = 'Capital de trabajo'),
	 'Paquete de insumos comerciales', 'Insumos para continuidad operativa', 15000.00, 'PEN', true, 'activo', 1);

-- 6. Tipos de financiamiento.
INSERT INTO tipo_financiamiento (codigo, nombre, alta)
VALUES
	('VEHICULAR', 'Financiamiento vehicular', 1),
	('LINEA_CREDITO', 'Línea de crédito', 1),
	('CAPITAL_TRABAJO', 'Capital de trabajo', 1)
ON CONFLICT (codigo) DO NOTHING;

-- 7. Tasas y condiciones por producto y tipo de financiamiento.
INSERT INTO producto_financiamiento
	(producto_id, tipo_financiamiento_id, tipo_tasa, tasa_anual,
	 plazo_minimo_meses, plazo_maximo_meses, monto_minimo, monto_maximo,
	 vigente_desde, alta)
SELECT p.id, tf.id, datos.tipo_tasa::tipo_tasa_interes, datos.tasa_anual,
	 datos.plazo_minimo, datos.plazo_maximo, datos.monto_minimo, datos.monto_maximo,
	 '2026-01-01 00:00:00-05', 1
FROM (VALUES
	('Camioneta comercial 4x4', 'VEHICULAR', 'TEA', 14.50, 12, 60, 10000.00, 95000.00),
	('Equipo de refrigeracion industrial', 'LINEA_CREDITO', 'TEA', 18.00, 6, 36, 5000.00, 28000.00),
	('Paquete de insumos comerciales', 'CAPITAL_TRABAJO', 'TNA', 22.00, 3, 24, 3000.00, 15000.00)
) AS datos(nombre_producto, codigo_financiamiento, tipo_tasa, tasa_anual,
	plazo_minimo, plazo_maximo, monto_minimo, monto_maximo)
JOIN producto p ON p.nombre = datos.nombre_producto
JOIN tipo_financiamiento tf ON tf.codigo = datos.codigo_financiamiento;

-- 8. Clientes: una persona natural y una persona juridica.

INSERT INTO cliente
	(tipo_persona, tipo_documento, numero_documento, nombres, apellidos, correo_electronico, telefono, alta)
VALUES
	('NATURAL', 'DNI', '71234567', 'Luis', 'Quispe', 'luis@example.pe', '+51976543210', 1);

INSERT INTO cliente
	(tipo_persona, tipo_documento, numero_documento, razon_social, correo_electronico, telefono, alta)
VALUES
	('JURIDICA', 'RUC', '20678912345', 'Distribuidora Sur S.A.C.', 'contacto@distribuidorasur.pe', '+51965432109', 1);

-- 9. Campaña comercial y productos asociados.
INSERT INTO campana
	(nombre, descripcion, fecha_inicio, fecha_fin, estado, creado_por_id, alta)
VALUES
	('Campaña Aliados 2026', 'Condiciones especiales para aliados comerciales',
	 '2026-01-01 00:00:00-05', '2026-12-31 23:59:59-05', 'activa',
	 (SELECT u.id FROM usuario u JOIN rol r ON r.id = u.rol_id
	  WHERE r.nombre_rol = 'administrador' AND u.correo_electronico = 'admin@financiamiento.pe'), 1);

INSERT INTO campana_producto (campana_id, producto_id, beneficio, alta)
SELECT ca.id, p.id, 'Tasa preferencial para campaña', 1
FROM campana ca
JOIN producto p ON p.nombre IN ('Camioneta comercial 4x4', 'Equipo de refrigeracion industrial')
WHERE ca.nombre = 'Campaña Aliados 2026';

INSERT INTO regla_precalificacion
	(campana_id, edad_minima, ingreso_mensual_minimo, monto_minimo, monto_maximo,
	 plazo_meses_minimo, plazo_meses_maximo, activo, alta)
SELECT id, 18, 2500.00, 3000.00, 95000.00, 3, 60, true, 1
FROM campana
WHERE nombre = 'Campaña Aliados 2026';

-- 10. Productos de interes de los clientes.
INSERT INTO lista_interes (cliente_id, producto_id, alta)
SELECT c.id, p.id, 1
FROM cliente c
JOIN producto p ON p.nombre = 'Camioneta comercial 4x4'
WHERE c.numero_documento = '71234567';

-- 11. Solicitudes de financiamiento.
INSERT INTO solicitud_financiamiento
	(cliente_id, producto_id, producto_financiamiento_id, campana_id,
	 monto_solicitado, moneda, plazo_meses, tasa_tipo_aplicada,
	 tasa_anual_aplicada, resultado_precalificacion, estado, alta, consentimiento_at)
SELECT c.id, p.id, pf.id, ca.id, 75000.00, 'PEN', 48,
	 pf.tipo_tasa, pf.tasa_anual, 'precalificado', 'precalificado', 1,
	 '2026-09-01 10:30:00-05'
FROM cliente c
JOIN producto p ON p.nombre = 'Camioneta comercial 4x4'
JOIN producto_financiamiento pf ON pf.producto_id = p.id
JOIN tipo_financiamiento tf ON tf.id = pf.tipo_financiamiento_id
JOIN campana ca ON ca.nombre = 'Campaña Aliados 2026'
WHERE c.numero_documento = '71234567'
  AND tf.codigo = 'VEHICULAR';

-- 12. Historial y derivacion bancaria de la solicitud.
INSERT INTO historial_solicitud
	(solicitud_id, estado_anterior, estado_nuevo, observacion, usuario_id, alta)
SELECT s.id, NULL, 'precalificado', 'Solicitud precalificada por el aliado', u.id, 1
FROM solicitud_financiamiento s
JOIN usuario u ON u.correo_electronico = 'ana@andina.pe'
JOIN cliente c ON c.id = s.cliente_id
WHERE c.numero_documento = '71234567';

INSERT INTO derivacion_banco
	(solicitud_id, codigo_externo, estado_respuesta_banco, respuesta_detalle, alta)
SELECT s.id, 'SOL-2026-0001', 'pendiente', '{"mensaje": "Solicitud enviada al banco"}'::jsonb, 1
FROM solicitud_financiamiento s
JOIN cliente c ON c.id = s.cliente_id
WHERE c.numero_documento = '71234567';




--------------------------------------------------------------------------
--PRUEBAS DE UPDATE Y DELETE
--------------------------------------------------------------------------
-------------------------------------
--UPDATE
-------------------------------------
--Se utilizará "borrado" logico:
UPDATE producto
SET alta = 0
WHERE id = 1; 
--[1]
-- Activar un aliado pendiente - OK
UPDATE aliado
SET estado = 'activo',
    actualizado_at = now()
WHERE id = 1
  AND estado = 'pendiente';
-- Activar un aliado pendiente - ERROR 
UPDATE aliado
SET estado = 'activos',
    actualizado_at = now()
WHERE id = 1
  AND estado = 'pendiente';

--[2]
SELECT * FROM usuario
-- Cambiar el rol de un usuario -- OK
UPDATE usuario
SET rol_id = 2,
    actualizado_at = now()
WHERE id = 1;
-- Cambiar el rol de un usuario -- ERROR
UPDATE usuario
SET rol_id = 6,
    actualizado_at = now()
WHERE id = 1;
/*
ERROR:  inserción o actualización en la tabla «usuario» viola la llave foránea «usuario_rol_id_fkey»
La llave (rol_id)=(6) no está presente en la tabla «rol».
*/

--[3]
-- Actualizar precio de producto (respetando CHECK precio >= 0) -- OK
UPDATE producto
SET precio_lista = 120.50,
    actualizado_at = now()
WHERE id = 1;
-- Actualizar precio de producto (respetando CHECK precio >= 0) -- ERROR
UPDATE producto
SET precio_lista = -20.50,
    actualizado_at = now()
WHERE id = 1;
/*
ERROR:  el nuevo registro para la relación «producto» viola la restricción «check» «producto_precio_lista_check»
La fila que falla contiene (1, 1, 1, Camioneta comercial 4x4, Vehiculo para actividades comerciales, -20.50, PEN, t, null, activo, 1, 2026-09-06 13:05:56.306143-05, 2026-09-06 13:20:09.745191-05). 
*/

--[4]
-- Modificar estado de campaña (respetando fecha_fin >= fecha_inicio) -- OK
UPDATE campana
SET estado = 'activa',
    fecha_inicio = now(),
    fecha_fin = now()  
WHERE id = 1;
-- Modificar estado de campaña (respetando fecha_fin >= fecha_inicio) -- ERROR
UPDATE campana
SET estado = 'activa',
    fecha_inicio = now(),
    fecha_fin = (now() - INTERVAL '1 day')
WHERE id = 1;
/*
ERROR:  el nuevo registro para la relación «campana» viola la restricción «check» «campana_check»
La fila que falla contiene (1, Campaña Aliados 2026, Condiciones especiales para aliados comerciales, 2026-09-06 13:25:29.52085-05, 2026-09-05 13:25:29.52085-05, activa, 1, 1, 2026-09-06 13:05:56.306143-05). 
*/

 --[5]
-- Cambiar resultado de precalificación en solicitud -- OK
UPDATE solicitud_financiamiento
SET resultado_precalificacion = 'precalificado',
    estado = 'en_evaluacion',
    actualizado_at = now()
WHERE id = 1;
-- Cambiar resultado de precalificación en solicitud -- ERROR
UPDATE solicitud_financiamiento
SET resultado_precalificacion = 'calificado',
    estado = 'pendiente_evaluacion',
    actualizado_at = now()
WHERE id = 1;
/*
ERROR:  la sintaxis de entrada no es válida para el enum resultado_precalificacion: «calificado»
LINE 3: SET resultado_precalificacion = 'calificado',
*/


-------------------------------------
--DELETE
-------------------------------------
-- Eliminar una categoría sin productos asociados
DELETE FROM categoria
WHERE id = 1
  AND EXISTS (
    SELECT 1 FROM producto WHERE categoria_id = 1
  );
/*
ERROR:  update or delete on table "categoria" violates RESTRICT setting of foreign key constraint "producto_categoria_id_fkey" on table "producto"
Key (id)=(1) is referenced from table "producto". 
*/

-- Eliminar un rol que no esté asignado a ningún usuario
DELETE FROM rol
WHERE id = 1
  AND EXISTS (
    SELECT 1 FROM usuario WHERE rol_id = 1
  );
/*
ERROR:  update or delete on table "rol" violates RESTRICT setting of foreign key constraint "usuario_rol_id_fkey" on table "usuario"
Key (id)=(1) is referenced from table "usuario". 
*/

-- Eliminar una campaña sin productos asociados
DELETE FROM campana
WHERE id = 1
  AND EXISTS (
    SELECT 1 FROM campana_producto WHERE campana_id = 1
  )
  AND EXISTS (
    SELECT 1 FROM regla_precalificacion WHERE campana_id = 1
  );
/*
ERROR:  update or delete on table "campana" violates RESTRICT setting of foreign key constraint "campana_producto_campana_id_fkey" on table "campana_producto"
Key (id)=(1) is referenced from table "campana_producto". 
*/

-- Eliminar un cliente sin solicitudes ni lista de interés
DELETE FROM cliente
WHERE id = 1
  AND EXISTS (
    SELECT 1 FROM solicitud_financiamiento WHERE cliente_id = 1
  )
  AND EXISTS (
    SELECT 1 FROM lista_interes WHERE cliente_id = 1
  );
/*
ERROR:  update or delete on table "cliente" violates RESTRICT setting of foreign key constraint "lista_interes_cliente_id_fkey" on table "lista_interes"
Key (id)=(1) is referenced from table "lista_interes". 
*/
