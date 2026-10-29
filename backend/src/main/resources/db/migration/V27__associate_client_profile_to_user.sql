ALTER TABLE public.cliente
ADD COLUMN usuario_id INTEGER REFERENCES public.usuario (id) ON DELETE SET NULL;

CREATE UNIQUE INDEX uq_cliente_usuario_activo ON public.cliente (usuario_id)
WHERE
    usuario_id IS NOT NULL
    AND alta = 1;

WITH
    clientes_con_correo_unico AS (
        SELECT LOWER(BTRIM (cliente.correo)) AS correo, MIN(cliente.id) AS cliente_id
        FROM public.cliente cliente
        WHERE
            cliente.alta = 1
            AND cliente.correo IS NOT NULL
        GROUP BY
            LOWER(BTRIM (cliente.correo))
        HAVING
            COUNT(*) = 1
    )
UPDATE public.cliente cliente
SET
    usuario_id = usuario.id
FROM
    public.usuario usuario
    JOIN public.rol rol ON rol.id = usuario.rol_id
    JOIN clientes_con_correo_unico perfil ON perfil.correo = LOWER(
        BTRIM (usuario.correo_electronico)
    )
WHERE
    cliente.id = perfil.cliente_id
    AND usuario.alta = 1
    AND usuario.activo = true
    AND LOWER(rol.nombre_rol) IN ('usuario', 'user')
    AND cliente.usuario_id IS NULL;
