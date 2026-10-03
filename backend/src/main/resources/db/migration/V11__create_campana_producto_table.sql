CREATE TABLE public.campana_producto (
    campana_id INTEGER NOT NULL REFERENCES public.campana (id) ON DELETE RESTRICT,
    producto_id INTEGER NOT NULL REFERENCES public.producto (id) ON DELETE RESTRICT,
    beneficio VARCHAR(255),
    condiciones_comerciales VARCHAR(500),
    alta SMALLINT NOT NULL DEFAULT 1 CHECK (alta IN (0, 1)),
    PRIMARY KEY (campana_id, producto_id)
);

CREATE INDEX idx_campana_producto_producto ON public.campana_producto (producto_id);
