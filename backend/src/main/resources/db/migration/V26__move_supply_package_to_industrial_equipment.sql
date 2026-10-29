UPDATE public.producto AS producto
SET
    categoria_id = categoria.id
FROM public.categoria AS categoria
WHERE
    producto.nombre = 'Paquete de insumos comerciales'
    AND categoria.nombre = 'Equipamiento industrial'
    AND producto.categoria_id IS DISTINCT
FROM categoria.id;
