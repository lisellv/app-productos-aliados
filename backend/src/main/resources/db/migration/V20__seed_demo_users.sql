-- Demo password for admin, usuario, and aliado accounts: admin (BCrypt).
DO $seed$
DECLARE
    demo_password_hash CONSTANT TEXT := '$2a$10$DdrAx4.cg0FtOJ6rftDGl.PWiHCcXh3hRe/dUIr7kPqLMP70Xsz7e';
BEGIN
    INSERT INTO public.rol (nombre_rol, alta)
    VALUES ('administrador', 1), ('aliado', 1), ('usuario', 1)
    ON CONFLICT (nombre_rol) DO UPDATE SET alta = 1;

    INSERT INTO public.aliado (
        tipo_documento,
        numero_documento,
        razon_social,
        contacto_nombre,
        contacto_correo,
        contacto_telefono,
        estado,
        alta
    )
    VALUES
        ('RUC', '20123456789', 'Comercial Andina S.A.C.', 'Ana Torres', 'ana@andina.pe', '+51987654321', 'activo', 1),
        ('RUC', '20456789123', 'Servicios del Pacifico S.A.C.', 'Carlos Rojas', 'carlos@pacifico.pe', '+51981234567', 'activo', 1)
    ON CONFLICT (numero_documento) DO UPDATE
    SET estado = 'activo', alta = 1;

    INSERT INTO public.usuario (
        rol_id,
        aliado_id,
        correo_electronico,
        password_hash,
        alta
    )
    SELECT r.id, a.id, demo.correo, demo_password_hash, 1
    FROM (
        VALUES
            ('administrador', 'admin@financiamiento.pe', NULL::VARCHAR),
            ('usuario', 'usuario@financiamiento.pe', NULL::VARCHAR),
            ('aliado', 'ana@andina.pe', '20123456789'),
            ('aliado', 'carlos@pacifico.pe', '20456789123')
    ) AS demo(nombre_rol, correo, numero_documento)
    JOIN public.rol r ON r.nombre_rol = demo.nombre_rol
    LEFT JOIN public.aliado a ON a.numero_documento = demo.numero_documento
    ON CONFLICT (correo_electronico) DO UPDATE
    SET rol_id = EXCLUDED.rol_id,
        aliado_id = EXCLUDED.aliado_id,
        password_hash = EXCLUDED.password_hash,
        alta = 1,
        activo = true;
END
$seed$;
