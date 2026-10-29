UPDATE public.producto AS producto
SET
    categoria_id = categoria.id
FROM public.categoria AS categoria
WHERE
    producto.nombre = 'Equipo de refrigeracion industrial'
    AND categoria.nombre = 'Equipamiento industrial'
    AND producto.categoria_id IS DISTINCT
FROM categoria.id;
