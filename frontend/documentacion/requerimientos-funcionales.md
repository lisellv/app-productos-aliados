# Requerimientos funcionales

## Tabla de contenido

- [1. Nombre y alcance del proyecto](#1-nombre-y-alcance-del-proyecto)
  - [Incluido en el alcance](#incluido-en-el-alcance)
  - [Fuera del alcance](#fuera-del-alcance)
- [2. Objetivos](#2-objetivos)
  - [2.1. Justificación](#21-justificación)
- [3. Actores y permisos](#3-actores-y-permisos)
- [4. Requerimientos funcionales](#4-requerimientos-funcionales)
  - [RF-01. Autenticación y autorización](#rf-01-autenticación-y-autorización)
  - [RF-02. Gestión de maestros](#rf-02-gestión-de-maestros)
  - [RF-03. Gestión de aliados](#rf-03-gestión-de-aliados)
  - [RF-04. Gestión de productos](#rf-04-gestión-de-productos)
  - [RF-05. Configuración de financiamiento](#rf-05-configuración-de-financiamiento)
  - [RF-06. Gestión de campañas](#rf-06-gestión-de-campañas)
  - [RF-07. Registro de clientes](#rf-07-registro-de-clientes)
  - [RF-08. Lista de interés](#rf-08-lista-de-interés)
  - [RF-09. Creación de solicitudes](#rf-09-creación-de-solicitudes)
  - [RF-10. Precalificación](#rf-10-precalificación)
  - [RF-11. Consentimiento](#rf-11-consentimiento)
  - [RF-12. Derivación bancaria](#rf-12-derivación-bancaria)
  - [RF-13. Estados e historial](#rf-13-estados-e-historial)
  - [RF-14. Consultas](#rf-14-consultas)
  - [RF-15. Validación operativa](#rf-15-validacion-operativa)
  - [RF-16. Respuesta de precalificación](#rf-16-respuesta-de-precalificación)
- [5. Historias de usuario generales](#5-historias-de-usuario-generales)
  - [HU-01. Inicio de sesión del administrador](#hu-01-inicio-de-sesión-del-administrador)
  - [HU-02. Gestión del catálogo por el aliado](#hu-02-gestión-del-catálogo-por-el-aliado)
  - [HU-03. Configuración de campañas](#hu-03-configuración-de-campañas)
  - [HU-04. Registro de cliente](#hu-04-registro-de-cliente)
  - [HU-05. Consulta de modalidad y condiciones](#hu-05-consulta-de-modalidad-y-condiciones)
  - [HU-06. Precalificación de una solicitud](#hu-06-precalificación-de-una-solicitud)
  - [HU-07. Autorización del cliente](#hu-07-autorización-del-cliente)
  - [HU-08. Derivación al banco](#hu-08-derivación-al-banco)
  - [HU-09. Seguimiento de solicitudes](#hu-09-seguimiento-de-solicitudes)
  - [HU-10. Consulta restringida del aliado](#hu-10-consulta-restringida-del-aliado)
- [6. Reglas de negocio](#6-reglas-de-negocio)
- [7. Flujo funcional principal](#7-flujo-funcional-principal)

## 1. Nombre y alcance del proyecto

**Plataforma de productos de aliados y financiamiento bancario**

La plataforma está dirigida principalmente a aliados comerciales. Permite publicar productos, registrar clientes y oportunidades de financiamiento, ejecutar una precalificación inicial y derivar al banco las solicitudes que cumplen las condiciones definidas.

El administrador configura los maestros, aliados, campañas, catálogo y reglas de precalificación. El cliente es el titular de la solicitud, pero no necesita una cuenta autenticada en la plataforma.

### Incluido en el alcance

- Gestión de usuarios, roles, aliados, categorías y productos.
- Gestión de campañas, beneficios y condiciones comerciales.
- Configuración de modalidades de financiamiento vehicular y capital de trabajo.
- Configuración de tasas, montos, plazos y vigencias por producto y modalidad.
- Registro de clientes naturales y jurídicos.
- Registro, precalificación y seguimiento de solicitudes de financiamiento.
- Gestión de lista de interés de productos.
- Autorización para el tratamiento y derivación de datos personales.
- Derivación de solicitudes al banco y registro de sus respuestas.
- Historial de estados y trazabilidad de las solicitudes.

### Fuera del alcance

- Autenticación independiente del cliente.
- Aprobación final del crédito por parte de la plataforma.
- Desembolso del financiamiento.
- Reemplazo de los sistemas internos de evaluación del banco.

## 2. Objetivos

- Facilitar a los aliados la publicación de productos y el registro de oportunidades.
- Reducir el tiempo de registro, precalificación y derivación de solicitudes.
- Entregar al banco solicitudes estructuradas y autorizadas.
- Mantener condiciones, tasas y estados con trazabilidad histórica.
- Permitir al administrador consultar y controlar la operación completa.

## 2.1. Justificación

La plataforma centraliza el catálogo, el registro de clientes y la validación inicial de oportunidades de financiamiento. Esto permite reducir tiempos y errores administrativos, mejorar la conversión de campañas, entregar condiciones claras al cliente y enviar al banco solicitudes estructuradas para su evaluación.

## 3. Actores y permisos

| Actor         | Descripción                                                      | Permisos principales                                                                                               |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Administrador | Responsable de la configuración y supervisión de la plataforma.  | Gestionar maestros, aliados, campañas, reglas, catálogo y consultar todas las solicitudes.                         |
| Aliado        | Usuario comercial que ofrece productos y registra oportunidades. | Gestionar sus datos y productos, registrar clientes y solicitudes, y consultar únicamente sus oportunidades.       |
| Cliente       | Titular de una solicitud de financiamiento.                      | Proporcionar información y autorizar el tratamiento y la derivación de sus datos; no requiere usuario autenticado. |
| Banco         | Sistema externo receptor de solicitudes derivadas.               | Recibir solicitudes y devolver el estado o respuesta de evaluación.                                                |

Un usuario aliado debe estar asociado a un aliado. Un usuario administrador no debe estar asociado a un aliado.

## 4. Requerimientos funcionales

### RF-01. Autenticación y autorización

El sistema debe permitir el inicio de sesión seguro de usuarios internos y restringir cada operación según el rol asignado.

### RF-02. Gestión de maestros

El administrador debe poder gestionar roles, categorías, estados, tipos de financiamiento y reglas de precalificación.

### RF-03. Gestión de aliados

El administrador debe poder registrar, actualizar, activar e inactivar aliados y sus datos de contacto.

### RF-04. Gestión de productos

El aliado debe poder registrar y actualizar sus productos, precios, beneficios, condiciones comerciales y categoría. El administrador debe poder consultar y gestionar el catálogo general.

### RF-05. Configuración de financiamiento

El administrador o usuario autorizado debe poder asociar a cada producto una o más modalidades de financiamiento, con tasa, monto mínimo y máximo, plazo mínimo y máximo y vigencia.

Las modalidades admitidas son `VEHICULAR` y `CAPITAL_TRABAJO`.

### RF-06. Gestión de campañas

El administrador debe poder crear campañas, definir su vigencia, asociar productos, registrar beneficios y configurar sus condiciones comerciales.

### RF-07. Registro de clientes

El aliado debe poder registrar o seleccionar un cliente persona natural o jurídica.

- Persona natural: DNI, CE o pasaporte, nombres y apellidos.
- Persona jurídica: RUC de 11 dígitos y razón social.
- La combinación de tipo y número de documento debe ser única.

### RF-08. Lista de interés

El cliente debe poder guardar productos en una lista de interés y evitar duplicar el mismo producto en su lista.

### RF-09. Creación de solicitudes

El aliado debe poder crear una solicitud en representación del cliente, seleccionando producto, modalidad, monto y plazo.

La solicitud debe conservar la tasa y el tipo de tasa aplicados en el momento de su creación.

### RF-10. Precalificación

El sistema debe validar las reglas de precalificación antes de derivar la solicitud. Debe considerar, según corresponda, edad, ingresos, monto, plazo, campaña y condiciones vigentes del producto.

El sistema debe mostrar el resultado de la precalificación y no debe derivar solicitudes que no cumplan las condiciones iniciales.

### RF-11. Consentimiento

El sistema debe registrar la autorización del cliente para el tratamiento de sus datos y su derivación al banco, incluyendo fecha y hora.

### RF-12. Derivación bancaria

El sistema debe derivar al banco las solicitudes precalificadas que cuenten con consentimiento, registrar el código externo y conservar la respuesta recibida.

### RF-13. Estados e historial

El sistema debe controlar los estados de la solicitud y registrar cada cambio en un historial. Como mínimo, debe soportar `precalificado`, `no_precalificado`, `derivado`, `en_evaluacion`, `aprobado`, `rechazado`, `cerrado` y `cancelado`.

### RF-14. Consultas

- El administrador debe consultar todas las solicitudes, estados, historiales y derivaciones.
- El aliado debe consultar solo las solicitudes asociadas a sus productos.
- Las consultas operativas deben mostrar únicamente registros activos.

### RF-15. Validación operativa

El sistema debe validar la vigencia y existencia de clientes, productos, aliados, campañas y configuraciones de financiamiento antes de permitir una operación. Los montos deben ser positivos, los plazos válidos y las relaciones deben apuntar a registros activos.

### RF-16. Respuesta de precalificación

Cuando el cliente califique, el sistema debe mostrar el producto, las condiciones y los beneficios disponibles. Cuando no califique, debe mostrar un mensaje claro y detener el flujo antes de la derivación bancaria.

## 5. Historias de usuario generales

### HU-01. Inicio de sesión del administrador

**Como** administrador, **quiero** iniciar sesión de forma segura, **para** administrar la configuración y supervisar la operación.

**Criterios de aceptación:**

- El usuario debe autenticarse con credenciales válidas.
- Las credenciales inválidas no deben permitir el acceso.
- El usuario autenticado debe acceder solo a funciones de administrador.

### HU-02. Gestión del catálogo por el aliado

**Como** aliado, **quiero** registrar y actualizar mis productos, **para** ofrecerlos a mis clientes.

**Criterios de aceptación:**

- El aliado solo puede modificar productos asociados a su aliado.
- Puede registrar precio, categoría, beneficios y condiciones.
- Un producto inactivo no debe aparecer en el catálogo operativo.

### HU-03. Configuración de campañas

**Como** administrador, **quiero** configurar campañas y asociar productos, **para** publicar condiciones comerciales vigentes.

**Criterios de aceptación:**

- La campaña tiene fechas de inicio y fin válidas.
- Solo se muestran productos asociados y activos.
- La campaña puede incluir beneficios y condiciones comerciales.

### HU-04. Registro de cliente

**Como** aliado, **quiero** registrar o seleccionar un cliente, **para** iniciar una oportunidad de financiamiento.

**Criterios de aceptación:**

- Se valida el tipo de persona y el formato del documento.
- No se permiten clientes duplicados por tipo y número de documento.
- Se solicitan nombres y apellidos para personas naturales y razón social para personas jurídicas.

### HU-05. Consulta de modalidad y condiciones

**Como** aliado, **quiero** seleccionar una modalidad, monto y plazo disponibles, **para** preparar una solicitud válida.

**Criterios de aceptación:**

- Solo se muestran modalidades activas y vigentes para el producto.
- El monto y el plazo deben estar dentro de los rangos configurados.
- Las modalidades disponibles son vehicular y capital de trabajo.

### HU-06. Precalificación de una solicitud

**Como** aliado, **quiero** conocer si una solicitud cumple las reglas iniciales, **para** decidir si puede continuar al banco.

**Criterios de aceptación:**

- El sistema ejecuta las reglas antes de derivar.
- Una solicitud no precalificada no se deriva al banco.
- El resultado queda registrado en la solicitud.

### HU-07. Autorización del cliente

**Como** cliente, **quiero** autorizar el tratamiento y envío de mis datos, **para** continuar con la evaluación bancaria.

**Criterios de aceptación:**

- La derivación requiere consentimiento.
- Se registra la fecha y hora del consentimiento.
- Sin consentimiento, la solicitud no se deriva.

### HU-08. Derivación al banco

**Como** aliado, **quiero** enviar al banco una solicitud precalificada y autorizada, **para** que sea evaluada.

**Criterios de aceptación:**

- La solicitud enviada contiene cliente, producto, modalidad, monto, plazo y tasa aplicada.
- Se registra la fecha de derivación y el código externo cuando el banco lo devuelve.
- Se conserva la respuesta del banco.

### HU-09. Seguimiento de solicitudes

**Como** administrador, **quiero** consultar el estado y el historial de las solicitudes, **para** supervisar toda la operación.

**Criterios de aceptación:**

- Se visualiza el estado actual.
- Se visualizan los cambios de estado en orden cronológico.
- El administrador puede consultar solicitudes de cualquier aliado.

### HU-10. Consulta restringida del aliado

**Como** aliado, **quiero** consultar mis solicitudes, **para** dar seguimiento a mis oportunidades sin acceder a información de otros aliados.

**Criterios de aceptación:**

- Solo se muestran solicitudes de productos pertenecientes al aliado autenticado.
- No se permite consultar solicitudes de otro aliado modificando filtros o identificadores.

## 6. Reglas de negocio

- No se realiza borrado físico; los registros se inactivan.
- Las operaciones sobre datos personales deben respetar la Ley N.° 29733 y su reglamento.
- La precalificación debe ejecutarse antes de la derivación.
- La tasa aplicada debe conservarse aunque la tasa vigente del producto cambie posteriormente.
- La creación de la solicitud, su primer estado y la derivación deben ejecutarse de forma transaccional cuando corresponda.
- El administrador tiene visibilidad global; el aliado tiene visibilidad limitada a sus productos.

## 7. Flujo funcional principal

1. El aliado registra o selecciona al cliente.
2. Selecciona el producto, la modalidad, el monto y el plazo.
3. El sistema valida las condiciones y ejecuta la precalificación.
4. El sistema muestra el resultado, las condiciones y los beneficios cuando corresponda.
5. El cliente autoriza el tratamiento y la derivación de sus datos.
6. El sistema registra la solicitud, la tasa aplicada y el primer estado.
7. Si corresponde, el sistema deriva la solicitud al banco y registra su respuesta.
