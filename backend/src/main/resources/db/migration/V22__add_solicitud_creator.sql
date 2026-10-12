ALTER TABLE public.solicitud_financiamiento
ADD COLUMN creado_por_usuario_id INTEGER REFERENCES public.usuario (id) ON DELETE SET NULL;

CREATE INDEX idx_solicitud_creado_por_usuario ON public.solicitud_financiamiento (creado_por_usuario_id);
