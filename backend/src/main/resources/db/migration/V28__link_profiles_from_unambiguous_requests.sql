WITH
    pares_usuario_cliente AS (
        SELECT DISTINCT
            solicitud.creado_por_usuario_id AS usuario_id,
            solicitud.cliente_id
        FROM
            public.solicitud_financiamiento solicitud
            JOIN public.usuario usuario ON usuario.id = solicitud.creado_por_usuario_id
            AND usuario.alta = 1
            AND usuario.activo = true
            JOIN public.rol rol ON rol.id = usuario.rol_id
            AND LOWER(rol.nombre_rol) IN ('usuario', 'user')
            JOIN public.cliente cliente ON cliente.id = solicitud.cliente_id
            AND cliente.alta = 1
        WHERE
            solicitud.alta = 1
            AND solicitud.creado_por_usuario_id IS NOT NULL
    ),
    cliente_unico_por_usuario AS (
        SELECT usuario_id, MIN(cliente_id) AS cliente_id
        FROM pares_usuario_cliente
        GROUP BY
            usuario_id
        HAVING
            COUNT(*) = 1
    ),
    usuario_unico_por_cliente AS (
        SELECT cliente_id, MIN(usuario_id) AS usuario_id
        FROM pares_usuario_cliente
        GROUP BY
            cliente_id
        HAVING
            COUNT(*) = 1
    ),
    vinculos_inequivocos AS (
        SELECT cliente_unico_por_usuario.usuario_id, cliente_unico_por_usuario.cliente_id
        FROM
            cliente_unico_por_usuario
            JOIN usuario_unico_por_cliente USING (usuario_id, cliente_id)
    )
UPDATE public.cliente cliente
SET
    usuario_id = vinculo.usuario_id
FROM vinculos_inequivocos vinculo
WHERE
    cliente.id = vinculo.cliente_id
    AND cliente.alta = 1
    AND cliente.usuario_id IS NULL
    AND NOT EXISTS (
        SELECT 1
        FROM public.cliente perfil_existente
        WHERE
            perfil_existente.usuario_id = vinculo.usuario_id
            AND perfil_existente.alta = 1
    );
