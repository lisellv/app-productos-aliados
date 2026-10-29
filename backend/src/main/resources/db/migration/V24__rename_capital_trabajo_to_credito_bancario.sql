UPDATE public.categoria
SET nombre = 'Crédito bancario'
WHERE nombre = 'Capital de trabajo';

UPDATE public.tipo_financiamiento
SET nombre = 'Crédito bancario'
WHERE codigo = 'CAPITAL_TRABAJO';

UPDATE public.producto
SET nombre = replace(nombre, 'Capital de trabajo', 'Crédito bancario'),
    descripcion = replace(descripcion, 'capital de trabajo', 'crédito bancario')
WHERE nombre LIKE 'Capital de trabajo%';