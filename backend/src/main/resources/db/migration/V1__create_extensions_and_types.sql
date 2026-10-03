CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE tipo_documento AS ENUM ('DNI', 'CE', 'PASAPORTE', 'RUC');

CREATE TYPE tipo_persona AS ENUM ('NATURAL', 'JURIDICA');

CREATE TYPE tipo_tasa_interes AS ENUM ('TEA', 'TNA');

CREATE TYPE resultado_precalificacion AS ENUM ('pendiente', 'precalificado', 'no_precalificado');

CREATE TYPE estado_solicitud AS ENUM (
    'precalificado', 'no_precalificado', 'derivado', 'en_evaluacion',
    'aprobado', 'rechazado', 'cerrado', 'cancelado'
    );
