--Productos activos de cada aliado y modalidades disponibles 
SELECT
	a.razon_social AS aliado,
	p.nombre AS producto,
	tf.nombre AS tipo_financiamiento,
	pf.tipo_tasa,
	pf.tasa_anual
FROM aliado a
INNER JOIN producto p ON p.aliado_id = a.id
INNER JOIN producto_financiamiento pf ON pf.producto_id = p.id
INNER JOIN tipo_financiamiento tf ON tf.id = pf.tipo_financiamiento_id
WHERE a.alta = 1
  AND p.alta = 1
  AND pf.alta = 1
  AND tf.alta = 1
ORDER BY a.razon_social, p.nombre
LIMIT 20; 

--Solicitudes en_evaluacion  
SELECT
	s.id,
	c.numero_documento,
	p.nombre AS producto,
	s.monto_solicitado,
	s.plazo_meses,
	s.creado_at,
	s.estado
FROM solicitud_financiamiento s
INNER JOIN cliente c ON c.id = s.cliente_id
INNER JOIN producto p ON p.id = s.producto_id
LEFT JOIN derivacion_banco db ON db.solicitud_id = s.id
WHERE s.alta = 1
  AND c.alta = 1
  AND p.alta = 1
  AND s.estado = 'en_evaluacion' 
ORDER BY s.creado_at DESC
LIMIT 20; 

-- Productos activos sin configuración de financiamiento (LEFT JOIN) 
SELECT
	p.id,
	p.nombre,
	a.razon_social AS aliado
FROM producto p
INNER JOIN aliado a ON a.id = p.aliado_id
LEFT JOIN producto_financiamiento pf
	ON pf.producto_id = p.id
   AND pf.alta = 1
WHERE p.alta = 1
  AND a.alta = 1
  AND pf.id IS NULL
ORDER BY a.razon_social, p.nombre; 

-- Solicitudes por tipo de financiamiento  
SELECT
	tf.nombre AS tipo_financiamiento,
	COUNT(s.id) AS cantidad_solicitudes,
	SUM(s.monto_solicitado) AS monto_total_solicitado,
	AVG(s.monto_solicitado) AS monto_promedio
FROM solicitud_financiamiento s
INNER JOIN producto_financiamiento pf
	ON pf.id = s.producto_financiamiento_id
INNER JOIN tipo_financiamiento tf
	ON tf.id = pf.tipo_financiamiento_id
WHERE s.alta = 1
  AND pf.alta = 1
  AND tf.alta = 1
GROUP BY tf.id, tf.nombre
ORDER BY monto_total_solicitado DESC; 