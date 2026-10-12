-- 1. Roles del sistema.
INSERT INTO
    public.rol (nombre_rol, alta)
VALUES ('administrador', 1),
    ('aliado', 1),
    ('usuario', 1) ON CONFLICT (nombre_rol) DO NOTHING;

DO $seed$
BEGIN
IF NOT EXISTS (
    SELECT 1 FROM public.usuario
    WHERE correo_electronico = 'admin@financiamiento.pe'
) THEN
-- 2. Categorias de productos.
INSERT INTO
    public.categoria (
        nombre,
        descripcion,
        activo,
        alta
    )
SELECT datos.nombre, datos.descripcion, true, 1
FROM (
        VALUES (
                'Inmuebles', 'Venta y alquiler de inmuebles'
            ), (
                'Equipamiento industrial', 'Equipos y bienes para empresas'
            ), (
                'Capital de trabajo', 'Financiamiento para operaciones del negocio'
            ), (
                'Automoviles', 'Automoviles, camiones y motos'
            )
    ) AS datos (nombre, descripcion)
WHERE
    NOT EXISTS (
        SELECT 1
        FROM public.categoria categoria_existente
        WHERE
            categoria_existente.nombre = datos.nombre
    );

-- 3. Aliados comerciales (RUC ficticio de 11 digitos, unico).
INSERT INTO
    public.aliado (
        tipo_documento,
        numero_documento,
        razon_social,
        contacto_nombre,
        contacto_correo,
        contacto_telefono,
        estado,
        alta
    )
VALUES (
        'RUC',
        '20600000001',
        'Remax Peru S.A.C.',
        'Contacto Remax',
        'contacto@remax.pe',
        '+51900000001',
        'activo',
        1
    ),
    (
        'RUC',
        '20600000002',
        'Ilumi Peru S.A.C.',
        'Contacto Ilumi',
        'contacto@ilumi.pe',
        '+51900000002',
        'activo',
        1
    ),
    (
        'RUC',
        '20600000003',
        'Banco A S.A.C.',
        'Contacto Banco A',
        'contacto@bancoa.pe',
        '+51900000003',
        'activo',
        1
    ),
    (
        'RUC',
        '20600000004',
        'Banco B S.A.C.',
        'Contacto Banco B',
        'contacto@bancob.pe',
        '+51900000004',
        'activo',
        1
    ),
    (
        'RUC',
        '20600000005',
        'Wiggo Peru S.A.C.',
        'Contacto Wiggo',
        'contacto@wiggo.pe',
        '+51900000005',
        'activo',
        1
    ) ON CONFLICT (numero_documento) DO NOTHING;

-- 4. Usuarios: un administrador y un usuario por aliado.
INSERT INTO
    public.usuario (
        rol_id,
        aliado_id,
        correo_electronico,
        password_hash,
        alta
    )
SELECT (
        SELECT id
        FROM rol
        WHERE
            nombre_rol = 'administrador'
    ), NULL, 'admin@financiamiento.pe', '$2a$10$DdrAx4.cg0FtOJ6rftDGl.PWiHCcXh3hRe/dUIr7kPqLMP70Xsz7e', 1 ON CONFLICT (correo_electronico) DO NOTHING;

INSERT INTO
    public.usuario (
        rol_id,
        aliado_id,
        correo_electronico,
        password_hash,
        alta
    )
SELECT (
        SELECT id
        FROM rol
        WHERE
            nombre_rol = 'aliado'
    ), a.id, datos.correo, '$2a$10$NQT24j0XYV97Vl3NcA1yeehNvLxNpvHRzEVubh4vDFWAiD2QvlPcC', 1
FROM (
        VALUES (
                '20600000001',
                'contacto@remax.pe'
            ),
            (
                '20600000002',
                'contacto@ilumi.pe'
            ),
            (
                '20600000003',
                'contacto@bancoa.pe'
            ),
            (
                '20600000004',
                'contacto@bancob.pe'
            ),
            (
                '20600000005',
                'contacto@wiggo.pe'
            )
    ) AS datos (ruc_aliado, correo)
    JOIN aliado a ON a.numero_documento = datos.ruc_aliado ON CONFLICT (correo_electronico) DO NOTHING;

-- ============================================================
-- 5. MAESTRO DE PRODUCTOS (uno por imagen) con imagen_url.
--    Mapeo aliado <-> categoria:
--      Inmuebles              -> Remax Peru      (20600000001)
--      Equipamiento industrial-> Ilumi Peru      (20600000002)
--      Capital de trabajo     -> Banco A / Banco B (20600000003 / 04)
--      Automoviles            -> Wiggo Peru      (20600000005)
-- ============================================================
INSERT INTO producto (
    aliado_id, categoria_id, nombre, descripcion,
    precio_lista, moneda, incluye_igv, imagen_url, estado, alta
)
SELECT a.id, c.id, datos.nombre_producto, datos.descripcion,
       datos.precio_lista, 'PEN', true, datos.imagen_url, 'activo', 1
FROM (VALUES
    -- INMUEBLES -> Remax
    ('20600000001', 'Inmuebles', 'Local comercial',      'Local comercial en zona de alto transito', 320000.00, 'img/productos/inmuebles/local_comercial.jpg'),
    ('20600000001', 'Inmuebles', 'Local para bazar',     'Local acondicionado para bazar',           180000.00, 'img/productos/inmuebles/local_bazar.jpg'),
    ('20600000001', 'Inmuebles', 'Local para muebleria', 'Local amplio para venta de muebles',       240000.00, 'img/productos/inmuebles/local_muebles.jpg'),

-- EQUIPAMIENTO INDUSTRIAL -> Ilumi
(
    '20600000002',
    'Equipamiento industrial',
    'Cafetera industrial',
    'Cafetera de alto rendimiento para negocio',
    6500.00,
    'img/productos/equipamiento/cafetera.jpg'
),
(
    '20600000002',
    'Equipamiento industrial',
    'Horno industrial',
    'Horno industrial para panaderia o restaurante',
    14000.00,
    'img/productos/equipamiento/horno.jpg'
),
(
    '20600000002',
    'Equipamiento industrial',
    'Dispensador de bebidas',
    'Dispensador refrigerado de bebidas',
    3200.00,
    'img/productos/equipamiento/dispensador.jpg'
),
(
    '20600000002',
    'Equipamiento industrial',
    'Robot de cocina profesional',
    'Robot de cocina multifuncion profesional',
    9800.00,
    'img/productos/equipamiento/robot_cocina.jpg'
),

-- AUTOMOVILES -> Wiggo
(
    '20600000005',
    'Automoviles',
    'Camioneta comercial 4x4',
    'Vehiculo para actividades comerciales',
    95000.00,
    'img/productos/vehiculos/camion.jpg'
),
(
    '20600000005',
    'Automoviles',
    'Moto de reparto',
    'Motocicleta para reparto urbano',
    8500.00,
    'img/productos/vehiculos/moto.jpg'
),
(
    '20600000005',
    'Automoviles',
    'Camion de carga',
    'Camion para transporte de mercaderia',
    180000.00,
    'img/productos/vehiculos/camion.jpg'
),
(
    '20600000005',
    'Automoviles',
    'Food truck equipado',
    'Food truck listo para operar',
    120000.00,
    'img/productos/vehiculos/foodtrack.jpg'
),
(
    '20600000005',
    'Automoviles',
    'Carro cafeteria movil',
    'Carro movil para venta de cafe',
    45000.00,
    'img/productos/vehiculos/carro_cafeteria.jpg'
),

-- CAPITAL DE TRABAJO -> Banco A y Banco B
('20600000003', 'Capital de trabajo', 'Capital de trabajo S/ 10,000', 'Financiamiento de capital de trabajo por S/ 10,000', 10000.00, 'img/productos/financiamiento/capital_10000_soles.jpg'),
    ('20600000003', 'Capital de trabajo', 'Capital de trabajo S/ 25,000', 'Financiamiento de capital de trabajo por S/ 25,000', 25000.00, 'img/productos/financiamiento/capital_25000_soles.jpg'),
    ('20600000004', 'Capital de trabajo', 'Capital de trabajo S/ 50,000', 'Financiamiento de capital de trabajo por S/ 50,000', 50000.00, 'img/productos/financiamiento/capital_50000_soles.jpg')
) AS datos(ruc_aliado, nombre_categoria, nombre_producto, descripcion, precio_lista, imagen_url)
JOIN aliado a    ON a.numero_documento = datos.ruc_aliado
JOIN categoria c ON c.nombre = datos.nombre_categoria;

-- 6. Tipos de financiamiento.
INSERT INTO
    tipo_financiamiento (codigo, nombre, alta)
VALUES (
        'VEHICULAR',
        'Financiamiento vehicular',
        1
    ),
    (
        'LINEA_CREDITO',
        'Linea de credito',
        1
    ),
    (
        'CAPITAL_TRABAJO',
        'Capital de trabajo',
        1
    ) ON CONFLICT (codigo) DO NOTHING;

-- 7. Tasas y condiciones por producto y tipo de financiamiento.
--    Un financiamiento por cada producto del maestro:
--      Automoviles              -> VEHICULAR       (TEA)
--      Inmuebles / Equipamiento -> LINEA_CREDITO   (TEA)
--      Capital de trabajo       -> CAPITAL_TRABAJO (TNA)
INSERT INTO producto_financiamiento
    (producto_id, tipo_financiamiento_id, tipo_tasa, tasa_anual,
     plazo_minimo_meses, plazo_maximo_meses, monto_minimo, monto_maximo,
     vigente_desde, alta)
SELECT p.id, tf.id, datos.tipo_tasa::tipo_tasa_interes, datos.tasa_anual,
     datos.plazo_minimo, datos.plazo_maximo, datos.monto_minimo, datos.monto_maximo,
     '2026-01-01 00:00:00-05', 1
FROM (VALUES
    -- AUTOMOVILES (VEHICULAR)
    ('Camioneta comercial 4x4',      'VEHICULAR',       'TEA', 14.50, 12, 60, 10000.00,  95000.00),
    ('Moto de reparto',              'VEHICULAR',       'TEA', 16.00,  6, 36,  1000.00,   8500.00),
    ('Camion de carga',              'VEHICULAR',       'TEA', 13.50, 12, 72, 20000.00, 180000.00),
    ('Food truck equipado',          'VEHICULAR',       'TEA', 15.00, 12, 60, 15000.00, 120000.00),
    ('Carro cafeteria movil',        'VEHICULAR',       'TEA', 15.50,  6, 48,  5000.00,  45000.00),

-- INMUEBLES (LINEA_CREDITO)
(
    'Local comercial',
    'LINEA_CREDITO',
    'TEA',
    12.00,
    24,
    120,
    50000.00,
    320000.00
),
(
    'Local para bazar',
    'LINEA_CREDITO',
    'TEA',
    12.50,
    24,
    120,
    30000.00,
    180000.00
),
(
    'Local para muebleria',
    'LINEA_CREDITO',
    'TEA',
    12.50,
    24,
    120,
    40000.00,
    240000.00
),

-- EQUIPAMIENTO INDUSTRIAL (LINEA_CREDITO)
(
    'Cafetera industrial',
    'LINEA_CREDITO',
    'TEA',
    18.00,
    6,
    36,
    1000.00,
    6500.00
),
(
    'Horno industrial',
    'LINEA_CREDITO',
    'TEA',
    18.00,
    6,
    36,
    2000.00,
    14000.00
),
(
    'Dispensador de bebidas',
    'LINEA_CREDITO',
    'TEA',
    19.00,
    3,
    24,
    500.00,
    3200.00
),
(
    'Robot de cocina profesional',
    'LINEA_CREDITO',
    'TEA',
    18.50,
    6,
    36,
    1500.00,
    9800.00
),

-- CAPITAL DE TRABAJO (CAPITAL_TRABAJO)
('Capital de trabajo S/ 10,000', 'CAPITAL_TRABAJO', 'TNA', 22.00,  3, 18,  1000.00,  10000.00),
    ('Capital de trabajo S/ 25,000', 'CAPITAL_TRABAJO', 'TNA', 22.00,  3, 24,  3000.00,  25000.00),
    ('Capital de trabajo S/ 50,000', 'CAPITAL_TRABAJO', 'TNA', 21.00,  3, 36,  5000.00,  50000.00)
) AS datos(nombre_producto, codigo_financiamiento, tipo_tasa, tasa_anual,
    plazo_minimo, plazo_maximo, monto_minimo, monto_maximo)
JOIN producto p ON p.nombre = datos.nombre_producto
JOIN tipo_financiamiento tf ON tf.codigo = datos.codigo_financiamiento;

-- 8. Clientes: una persona natural y una persona juridica.
INSERT INTO
    cliente (
        tipo_persona,
        tipo_documento,
        numero_documento,
        nombres,
        apellidos,
        correo,
        telefono,
        alta
    )
VALUES (
        'NATURAL',
        'DNI',
        '71234567',
        'Luis',
        'Quispe',
        'luis@example.pe',
        '+51976543210',
        1
    );

INSERT INTO
    cliente (
        tipo_persona,
        tipo_documento,
        numero_documento,
        razon_social,
        correo,
        telefono,
        alta
    )
VALUES (
        'JURIDICA',
        'RUC',
        '20678912345',
        'Panadería Sarita Sur S.A.C.',
        'panaderia.sarita@gmail.pe',
        '+51965432109',
        1
    );

-- 9. Campana comercial y productos asociados.
INSERT INTO
    campana (
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        estado,
        creado_por_id,
        alta
    )
VALUES (
        'Campana Aliados 2026',
        'Condiciones especiales para aliados comerciales',
        '2026-01-01 00:00:00-05',
        '2026-12-31 23:59:59-05',
        'activa',
        (
            SELECT u.id
            FROM usuario u
                JOIN rol r ON r.id = u.rol_id
            WHERE
                r.nombre_rol = 'administrador'
                AND u.correo_electronico = 'admin@financiamiento.pe'
        ),
        1
    );

-- Solo productos vehiculares (Automoviles) e industriales (Equipamiento industrial).
INSERT INTO
    campana_producto (
        campana_id,
        producto_id,
        beneficio,
        alta
    )
SELECT
    ca.id,
    p.id,
    CASE c.nombre
        WHEN 'Automoviles' THEN 'Tasa preferencial para productos vehiculares'
        WHEN 'Equipamiento industrial' THEN 'Tasa preferencial para equipamiento industrial'
    END,
    1
FROM
    campana ca
    JOIN producto p ON ca.nombre = 'Campana Aliados 2026'
    JOIN categoria c ON c.id = p.categoria_id
WHERE
    c.nombre IN (
        'Automoviles',
        'Equipamiento industrial'
    );

INSERT INTO
    regla_precalificacion (
        campana_id,
        edad_minima,
        edad_maxima,
        ingreso_minimo,
        monto_minimo,
        monto_maximo,
        plazo_minimo_meses,
        plazo_maximo_meses,
        activo,
        alta
    )
SELECT id, 18, 75, 2500.00, 3000.00, 95000.00, 3, 60, true, 1
FROM campana
WHERE
    nombre = 'Campana Aliados 2026';

-- 10. Productos de interes de los clientes.
--     Cliente natural (Luis, 71234567):   Camioneta comercial 4x4, Moto de reparto
--     Cliente juridico (Sarita, 20678912345): Horno industrial, Cafetera industrial
INSERT INTO
    lista_interes (cliente_id, producto_id, alta)
SELECT c.id, p.id, 1
FROM (
        VALUES (
                '71234567',
                'Camioneta comercial 4x4'
            ),
            ('71234567', 'Moto de reparto'),
            (
                '20678912345',
                'Horno industrial'
            ),
            (
                '20678912345',
                'Cafetera industrial'
            )
    ) AS datos (doc_cliente, nombre_producto)
    JOIN cliente c ON c.numero_documento = datos.doc_cliente
    JOIN producto p ON p.nombre = datos.nombre_producto;

-- 11. Solicitudes de financiamiento (2).
--     Luis   -> Camioneta comercial 4x4 (VEHICULAR)      : precalificado
--     Sarita -> Horno industrial        (LINEA_CREDITO)  : en_evaluacion
INSERT INTO
    solicitud_financiamiento (
        cliente_id, producto_id, producto_financiamiento_id, campana_id,
        monto_solicitado, moneda, plazo_meses, tasa_tipo_aplicada,
        tasa_anual_aplicada, resultado_precalificacion, estado, alta, consentimiento_at
    )
SELECT c.id, p.id, pf.id, ca.id,
       datos.monto_solicitado, 'PEN', datos.plazo_meses, pf.tipo_tasa, pf.tasa_anual,
       datos.resultado::resultado_precalificacion, datos.estado::estado_solicitud, 1,
       datos.consentimiento::timestamptz
FROM (VALUES
    ('71234567',    'Camioneta comercial 4x4', 75000.00, 48, 'precalificado', 'precalificado', '2026-09-01 10:30:00-05'),
    ('20678912345', 'Horno industrial',        12000.00, 24, 'precalificado', 'en_evaluacion', '2026-09-05 09:15:00-05')
) AS datos(doc_cliente, nombre_producto, monto_solicitado, plazo_meses, resultado, estado, consentimiento)
JOIN cliente c  ON c.numero_documento = datos.doc_cliente
JOIN producto p ON p.nombre = datos.nombre_producto
JOIN producto_financiamiento pf ON pf.producto_id = p.id
JOIN campana ca ON ca.nombre = 'Campana Aliados 2026';

-- 12. Historial de cada solicitud (una fila por solicitud),
--     firmado por el usuario del aliado dueño del producto.
INSERT INTO
    historial_solicitud (
        solicitud_id,
        estado_anterior,
        estado_nuevo,
        observacion,
        usuario_id,
        alta
    )
SELECT s.id, NULL, s.estado, 'Registro inicial de la solicitud por el aliado', u.id, 1
FROM
    solicitud_financiamiento s
    JOIN producto p ON p.id = s.producto_id
    JOIN usuario u ON u.aliado_id = p.aliado_id;

-- Derivacion bancaria solo para la solicitud vehicular de Luis.
INSERT INTO derivacion_banco
    (solicitud_id, codigo_externo, estado_respuesta_banco, respuesta_detalle, alta)
SELECT s.id, 'SOL-2026-0001', 'pendiente', '{"mensaje": "Solicitud enviada al banco"}'::jsonb, 1
FROM solicitud_financiamiento s
    JOIN cliente c  ON c.id = s.cliente_id
    JOIN producto p ON p.id = s.producto_id
WHERE c.numero_documento = '71234567'
    AND p.nombre = 'Camioneta comercial 4x4';

END IF;
END
$seed$;
