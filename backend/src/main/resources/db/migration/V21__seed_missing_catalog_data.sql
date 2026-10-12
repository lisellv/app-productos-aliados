-- Complete the V19 catalog when its admin-user guard skipped the seed.
INSERT INTO
    public.categoria (
        nombre,
        descripcion,
        activo,
        alta
    )
SELECT seed.nombre, seed.descripcion, true, 1
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
    ) AS seed (nombre, descripcion)
WHERE
    NOT EXISTS (
        SELECT 1
        FROM public.categoria existing
        WHERE
            existing.nombre = seed.nombre
    );

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

INSERT INTO
    public.tipo_financiamiento (codigo, nombre, alta)
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

INSERT INTO
    public.producto (
        aliado_id,
        categoria_id,
        nombre,
        descripcion,
        precio_lista,
        moneda,
        incluye_igv,
        imagen_url,
        estado,
        alta
    )
SELECT aliado.id, categoria.id, seed.nombre_producto, seed.descripcion, seed.precio_lista, 'PEN', true, seed.imagen_url, 'activo', 1
FROM (
        VALUES (
                '20600000001',
                'Inmuebles',
                'Local comercial',
                'Local comercial en zona de alto transito',
                320000.00,
                'img/productos/inmuebles/local_comercial.jpg'
            ),
            (
                '20600000001',
                'Inmuebles',
                'Local para bazar',
                'Local acondicionado para bazar',
                180000.00,
                'img/productos/inmuebles/local_bazar.jpg'
            ),
            (
                '20600000001',
                'Inmuebles',
                'Local para muebleria',
                'Local amplio para venta de muebles',
                240000.00,
                'img/productos/inmuebles/local_muebles.jpg'
            ),
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
            (
                '20600000003',
                'Capital de trabajo',
                'Capital de trabajo S/ 10,000',
                'Financiamiento de capital de trabajo por S/ 10,000',
                10000.00,
                'img/productos/financiamiento/capital_10000_soles.jpg'
            ),
            (
                '20600000003',
                'Capital de trabajo',
                'Capital de trabajo S/ 25,000',
                'Financiamiento de capital de trabajo por S/ 25,000',
                25000.00,
                'img/productos/financiamiento/capital_25000_soles.jpg'
            ),
            (
                '20600000004',
                'Capital de trabajo',
                'Capital de trabajo S/ 50,000',
                'Financiamiento de capital de trabajo por S/ 50,000',
                50000.00,
                'img/productos/financiamiento/capital_50000_soles.jpg'
            )
    ) AS seed (
        ruc_aliado,
        nombre_categoria,
        nombre_producto,
        descripcion,
        precio_lista,
        imagen_url
    )
    JOIN public.aliado aliado ON aliado.numero_documento = seed.ruc_aliado
    JOIN public.categoria categoria ON categoria.nombre = seed.nombre_categoria
WHERE
    NOT EXISTS (
        SELECT 1
        FROM public.producto existing
        WHERE
            existing.nombre = seed.nombre_producto
    );

INSERT INTO public.producto_financiamiento (
    producto_id, tipo_financiamiento_id, tipo_tasa, tasa_anual,
    plazo_minimo_meses, plazo_maximo_meses, monto_minimo, monto_maximo,
    vigente_desde, alta
)
SELECT producto.id, tipo.id, seed.tipo_tasa::tipo_tasa_interes, seed.tasa_anual,
       seed.plazo_minimo, seed.plazo_maximo, seed.monto_minimo, seed.monto_maximo,
       DATE '2026-01-01', 1
FROM (VALUES
    ('Camioneta comercial 4x4', 'VEHICULAR', 'TEA', 14.50, 12, 60, 10000.00, 95000.00),
    ('Moto de reparto', 'VEHICULAR', 'TEA', 16.00, 6, 36, 1000.00, 8500.00),
    ('Camion de carga', 'VEHICULAR', 'TEA', 13.50, 12, 72, 20000.00, 180000.00),
    ('Food truck equipado', 'VEHICULAR', 'TEA', 15.00, 12, 60, 15000.00, 120000.00),
    ('Carro cafeteria movil', 'VEHICULAR', 'TEA', 15.50, 6, 48, 5000.00, 45000.00),
    ('Local comercial', 'LINEA_CREDITO', 'TEA', 12.00, 24, 120, 50000.00, 320000.00),
    ('Local para bazar', 'LINEA_CREDITO', 'TEA', 12.50, 24, 120, 30000.00, 180000.00),
    ('Local para muebleria', 'LINEA_CREDITO', 'TEA', 12.50, 24, 120, 40000.00, 240000.00),
    ('Cafetera industrial', 'LINEA_CREDITO', 'TEA', 18.00, 6, 36, 1000.00, 6500.00),
    ('Horno industrial', 'LINEA_CREDITO', 'TEA', 18.00, 6, 36, 2000.00, 14000.00),
    ('Dispensador de bebidas', 'LINEA_CREDITO', 'TEA', 19.00, 3, 24, 500.00, 3200.00),
    ('Robot de cocina profesional', 'LINEA_CREDITO', 'TEA', 18.50, 6, 36, 1500.00, 9800.00),
    ('Capital de trabajo S/ 10,000', 'CAPITAL_TRABAJO', 'TNA', 22.00, 3, 18, 1000.00, 10000.00),
    ('Capital de trabajo S/ 25,000', 'CAPITAL_TRABAJO', 'TNA', 22.00, 3, 24, 3000.00, 25000.00),
    ('Capital de trabajo S/ 50,000', 'CAPITAL_TRABAJO', 'TNA', 21.00, 3, 36, 5000.00, 50000.00)
) AS seed(nombre_producto, codigo_tipo, tipo_tasa, tasa_anual, plazo_minimo, plazo_maximo, monto_minimo, monto_maximo)
JOIN public.producto producto ON producto.nombre = seed.nombre_producto
JOIN public.tipo_financiamiento tipo ON tipo.codigo = seed.codigo_tipo
WHERE NOT EXISTS (
    SELECT 1 FROM public.producto_financiamiento existing
    WHERE existing.producto_id = producto.id
      AND existing.tipo_financiamiento_id = tipo.id
);

UPDATE public.producto
SET
    imagen_url = CASE nombre
        WHEN 'Camioneta comercial 4x4' THEN 'img/productos/vehiculos/camion.jpg'
        WHEN 'Equipo de refrigeracion industrial' THEN 'img/productos/equipamiento/dispensador.jpg'
        WHEN 'Paquete de insumos comerciales' THEN 'img/productos/financiamiento/capital_10000_soles.jpg'
    END
WHERE (
        imagen_url IS NULL
        OR btrim (imagen_url) = ''
    )
    AND nombre IN (
        'Camioneta comercial 4x4',
        'Equipo de refrigeracion industrial',
        'Paquete de insumos comerciales'
    );
