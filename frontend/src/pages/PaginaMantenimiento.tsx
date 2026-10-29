import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { solicitarApi } from "../api/clienteHttp";
import { useAuth } from "../context/ContextoAutenticacion";

type ClaveEntidad =
  | "usuarios"
  | "roles"
  | "categorias"
  | "financiamiento"
  | "aliados"
  | "clientes"
  | "productos"
  | "campanas"
  | "reglas";
type DatosRegistro = Record<string, unknown>;

interface DefinicionCampo {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  source?: ClaveEntidad;
  options?: Array<[string, string]>;
}

interface DefinicionEntidad {
  key: ClaveEntidad;
  label: string;
  endpoint: string;
  fields: DefinicionCampo[];
}

const entidades: DefinicionEntidad[] = [
  {
    key: "usuarios",
    label: "Usuarios",
    endpoint: "/api/usuarios",
    fields: [
      {
        name: "correo",
        label: "Correo electrónico",
        type: "email",
        required: true,
      },
      {
        name: "password",
        label: "Contraseña",
        type: "password",
        required: true,
      },
      {
        name: "rolId",
        label: "Rol",
        type: "select",
        source: "roles",
        required: true,
      },
      {
        name: "aliadoId",
        label: "Aliado asociado",
        type: "select",
        source: "aliados",
      },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          ["true", "Activo"],
          ["false", "Inactivo"],
        ],
      },
    ],
  },
  {
    key: "roles",
    label: "Roles",
    endpoint: "/api/roles",
    fields: [{ name: "nombre", label: "Nombre del rol", required: true }],
  },
  {
    key: "categorias",
    label: "Categorías",
    endpoint: "/api/categorias",
    fields: [
      { name: "nombre", label: "Nombre", required: true },
      { name: "descripcion", label: "Descripción" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          ["true", "Activo"],
          ["false", "Inactivo"],
        ],
      },
    ],
  },
  {
    key: "financiamiento",
    label: "Tipos de financiamiento",
    endpoint: "/api/tipos-financiamiento",
    fields: [
      {
        name: "codigo",
        label: "Código",
        type: "select",
        options: [
          ["VEHICULAR", "VEHICULAR"],
          ["CAPITAL_TRABAJO", "CAPITAL_TRABAJO"],
        ],
        required: true,
      },
      { name: "nombre", label: "Nombre", required: true },
      { name: "descripcion", label: "Descripción" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          ["true", "Activo"],
          ["false", "Inactivo"],
        ],
      },
    ],
  },
  {
    key: "aliados",
    label: "Aliados",
    endpoint: "/api/aliados",
    fields: [
      { name: "razonSocial", label: "Razón social", required: true },
      { name: "numeroDocumento", label: "RUC", required: true },
      { name: "contactoNombre", label: "Contacto" },
      { name: "contactoCorreo", label: "Correo de contacto", type: "email" },
      { name: "contactoTelefono", label: "Teléfono de contacto", type: "tel" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          ["activo", "Activo"],
          ["inactivo", "Inactivo"],
        ],
      },
    ],
  },
  {
    key: "clientes",
    label: "Clientes",
    endpoint: "/api/clientes",
    fields: [
      {
        name: "tipoPersona",
        label: "Tipo de persona",
        type: "select",
        options: [
          ["NATURAL", "Natural"],
          ["JURIDICA", "Jurídica"],
        ],
        required: true,
      },
      {
        name: "tipoDocumento",
        label: "Tipo de documento",
        type: "select",
        options: [
          ["DNI", "DNI"],
          ["CE", "Carné de extranjería"],
          ["PASAPORTE", "Pasaporte"],
          ["RUC", "RUC"],
        ],
        required: true,
      },
      { name: "numeroDocumento", label: "Número de documento", required: true },
      { name: "nombres", label: "Nombres" },
      { name: "apellidos", label: "Apellidos" },
      { name: "razonSocial", label: "Razón social" },
      { name: "correo", label: "Correo electrónico", type: "email" },
      { name: "telefono", label: "Teléfono", type: "tel" },
    ],
  },
  {
    key: "productos",
    label: "Productos",
    endpoint: "/api/productos",
    fields: [
      {
        name: "aliadoId",
        label: "Aliado",
        type: "select",
        source: "aliados",
        required: true,
      },
      {
        name: "categoriaId",
        label: "Categoría",
        type: "select",
        source: "categorias",
      },
      { name: "nombre", label: "Nombre", required: true },
      { name: "descripcion", label: "Descripción" },
      {
        name: "precioLista",
        label: "Precio de lista",
        type: "number",
        required: true,
      },
      {
        name: "moneda",
        label: "Moneda",
        type: "select",
        options: [
          ["PEN", "PEN"],
          ["USD", "USD"],
        ],
        required: true,
      },
      {
        name: "incluyeIgv",
        label: "¿Incluye IGV?",
        type: "select",
        options: [
          ["true", "Sí"],
          ["false", "No"],
        ],
        required: true,
      },
      { name: "imagenUrl", label: "URL de imagen" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          ["activo", "Activo"],
          ["inactivo", "Inactivo"],
        ],
      },
    ],
  },
  {
    key: "campanas",
    label: "Campañas",
    endpoint: "/api/campanas",
    fields: [
      { name: "nombre", label: "Nombre", required: true },
      { name: "descripcion", label: "Descripción" },
      {
        name: "fechaInicio",
        label: "Fecha de inicio",
        type: "date",
        required: true,
      },
      { name: "fechaFin", label: "Fecha de fin", type: "date", required: true },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          ["activo", "Activo"],
          ["inactivo", "Inactivo"],
        ],
      },
    ],
  },
  {
    key: "reglas",
    label: "Reglas de precalificación",
    endpoint: "/api/reglas-precalificacion",
    fields: [
      {
        name: "campanaId",
        label: "Campaña",
        type: "select",
        source: "campanas",
        required: true,
      },
      {
        name: "edadMinima",
        label: "Edad mínima",
        type: "number",
        required: true,
      },
      {
        name: "edadMaxima",
        label: "Edad máxima",
        type: "number",
        required: true,
      },
      {
        name: "ingresoMinimo",
        label: "Ingreso mínimo",
        type: "number",
        required: true,
      },
      {
        name: "montoMinimo",
        label: "Monto mínimo",
        type: "number",
        required: true,
      },
      {
        name: "montoMaximo",
        label: "Monto máximo",
        type: "number",
        required: true,
      },
      {
        name: "plazoMinimoMeses",
        label: "Plazo mínimo (meses)",
        type: "number",
        required: true,
      },
      {
        name: "plazoMaximoMeses",
        label: "Plazo máximo (meses)",
        type: "number",
        required: true,
      },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          ["true", "Activo"],
          ["false", "Inactivo"],
        ],
      },
    ],
  },
];

const registrosVacios = (): Record<ClaveEntidad, DatosRegistro[]> => ({
  usuarios: [],
  roles: [],
  categorias: [],
  financiamiento: [],
  aliados: [],
  clientes: [],
  productos: [],
  campanas: [],
  reglas: [],
});
const textoDeValor = (valorEntrada: unknown) =>
  valorEntrada == null ? "" : String(valorEntrada);
const valorOpcional = (valorEntrada: unknown) =>
  textoDeValor(valorEntrada).trim() || null;

function valoresIniciales(
  entidad: DefinicionEntidad,
  registro?: DatosRegistro,
) {
  const valores: Record<string, string> = {};
  entidad.fields.forEach(({ name }) => {
    let valorCampo = registro?.[name];
    if (name === "correo" && registro)
      valorCampo = registro.correoElectronico ?? registro.correo;
    if (name === "estado" && registro)
      valorCampo = registro.activo ?? registro.estado;
    if (name === "nombre" && registro)
      valorCampo = registro.nombreRol ?? registro.nombre;
    if (name === "plazoMinimoMeses" && registro)
      valorCampo = registro.plazoMinimoMeses;
    if (name === "plazoMaximoMeses" && registro)
      valorCampo = registro.plazoMaximoMeses;
    if (name === "fechaInicio" && registro)
      valorCampo = textoDeValor(registro.fechaInicio).slice(0, 10);
    if (name === "fechaFin" && registro)
      valorCampo = textoDeValor(registro.fechaFin).slice(0, 10);
    valores[name] = name === "password" ? "" : textoDeValor(valorCampo);
  });
  return valores;
}

function construirCarga(
  clave: ClaveEntidad,
  valoresFormulario: Record<string, string>,
  esEdicion: boolean,
): DatosRegistro {
  const leerCampo = (name: string) => valoresFormulario[name]?.trim() || "";
  const descripcion = valorOpcional(valoresFormulario.descripcion);
  switch (clave) {
    case "usuarios":
      return {
        correoElectronico: leerCampo("correo"),
        rolId: Number(leerCampo("rolId")),
        aliadoId: leerCampo("aliadoId") ? Number(leerCampo("aliadoId")) : null,
        ...(leerCampo("password") ? { password: leerCampo("password") } : {}),
        ...(esEdicion ? { activo: leerCampo("estado") === "true" } : {}),
      };
    case "roles":
      return { nombreRol: leerCampo("nombre") };
    case "categorias":
      return {
        nombre: leerCampo("nombre"),
        descripcion: descripcion,
        ...(esEdicion ? { activo: leerCampo("estado") === "true" } : {}),
      };
    case "financiamiento":
      return {
        ...(esEdicion ? {} : { codigo: leerCampo("codigo") }),
        nombre: leerCampo("nombre"),
        descripcion: descripcion,
        ...(esEdicion ? { activo: leerCampo("estado") === "true" } : {}),
      };
    case "aliados":
      return {
        razonSocial: leerCampo("razonSocial"),
        ...(esEdicion ? {} : { numeroDocumento: leerCampo("numeroDocumento") }),
        contactoNombre: valorOpcional(valoresFormulario.contactoNombre),
        contactoCorreo: valorOpcional(valoresFormulario.contactoCorreo),
        contactoTelefono: valorOpcional(valoresFormulario.contactoTelefono),
        ...(esEdicion ? { estado: leerCampo("estado") } : {}),
      };
    case "clientes": {
      const esNatural = leerCampo("tipoPersona") === "NATURAL";
      return {
        tipoPersona: leerCampo("tipoPersona"),
        tipoDocumento: leerCampo("tipoDocumento"),
        numeroDocumento: leerCampo("numeroDocumento"),
        nombres: esNatural ? valorOpcional(valoresFormulario.nombres) : null,
        apellidos: esNatural
          ? valorOpcional(valoresFormulario.apellidos)
          : null,
        razonSocial: esNatural
          ? null
          : valorOpcional(valoresFormulario.razonSocial),
        correo: valorOpcional(valoresFormulario.correo),
        telefono: valorOpcional(valoresFormulario.telefono),
      };
    }
    case "productos":
      return {
        ...(esEdicion
          ? {}
          : {
              aliadoId: Number(leerCampo("aliadoId")),
              moneda: leerCampo("moneda"),
            }),
        categoriaId: leerCampo("categoriaId")
          ? Number(leerCampo("categoriaId"))
          : null,
        nombre: leerCampo("nombre"),
        descripcion: descripcion,
        precioLista: Number(leerCampo("precioLista")),
        incluyeIgv: leerCampo("incluyeIgv") === "true",
        imagenUrl: valorOpcional(valoresFormulario.imagenUrl),
        ...(esEdicion ? { estado: leerCampo("estado") } : {}),
      };
    case "campanas":
      return {
        nombre: leerCampo("nombre"),
        descripcion: descripcion,
        fechaInicio: leerCampo("fechaInicio"),
        fechaFin: leerCampo("fechaFin"),
        ...(esEdicion ? { estado: leerCampo("estado") } : {}),
      };
    case "reglas":
      return {
        edadMinima: Number(leerCampo("edadMinima")),
        edadMaxima: Number(leerCampo("edadMaxima")),
        ingresoMinimo: Number(leerCampo("ingresoMinimo")),
        montoMinimo: Number(leerCampo("montoMinimo")),
        montoMaximo: Number(leerCampo("montoMaximo")),
        plazoMinimoMeses: Number(leerCampo("plazoMinimoMeses")),
        plazoMaximoMeses: Number(leerCampo("plazoMaximoMeses")),
        ...(esEdicion
          ? { activo: leerCampo("estado") === "true" }
          : { campanaId: Number(leerCampo("campanaId")) }),
      };
  }
}

function mostrarRegistro(
  clave: ClaveEntidad,
  registro: DatosRegistro,
  datosPorEntidad: Record<ClaveEntidad, DatosRegistro[]>,
) {
  const buscarNombre = (
    claveLista: ClaveEntidad,
    identificador: unknown,
    campoNombre: string,
  ) =>
    datosPorEntidad[claveLista].find(
      (elemento) => String(elemento.id) === String(identificador),
    )?.[campoNombre] || `#${identificador ?? "—"}`;
  switch (clave) {
    case "usuarios":
      return [
        registro.correoElectronico || registro.correo,
        registro.creadoAt,
        buscarNombre("roles", registro.rolId, "nombreRol"),
      ];
    case "roles":
      return [
        registro.nombreRol,
        Number(registro.alta) === 1 ? "Activo" : "Inactivo",
      ];
    case "categorias":
      return [
        registro.nombre,
        registro.descripcion,
        registro.activo ? "Activo" : "Inactivo",
      ];
    case "financiamiento":
      return [
        registro.codigo,
        registro.nombre,
        registro.descripcion,
        registro.activo ? "Activo" : "Inactivo",
      ];
    case "aliados":
      return [
        registro.razonSocial,
        registro.numeroDocumento,
        registro.contactoNombre,
        registro.estado,
      ];
    case "clientes":
      return [
        registro.tipoPersona === "NATURAL" ? "Natural" : "Jurídica",
        `${registro.tipoDocumento || ""} ${registro.numeroDocumento || ""}`,
        registro.tipoPersona === "NATURAL"
          ? `${registro.nombres || ""} ${registro.apellidos || ""}`
          : registro.razonSocial,
        registro.correo,
        registro.telefono,
      ];
    case "productos":
      return [
        registro.nombre,
        buscarNombre("aliados", registro.aliadoId, "razonSocial"),
        buscarNombre("categorias", registro.categoriaId, "nombre"),
        `${registro.precioLista ?? "—"} ${registro.moneda || "PEN"}`,
        registro.estado,
      ];
    case "campanas":
      return [
        registro.nombre,
        registro.descripcion,
        `${registro.fechaInicio || "—"} - ${registro.fechaFin || "—"}`,
        registro.estado,
      ];
    case "reglas":
      return [
        buscarNombre("campanas", registro.campanaId, "nombre"),
        `${registro.edadMinima} - ${registro.edadMaxima}`,
        registro.ingresoMinimo,
        `${registro.montoMinimo} - ${registro.montoMaximo}`,
        `${registro.plazoMinimoMeses} - ${registro.plazoMaximoMeses}`,
      ];
  }
}

function etiquetasColumnas(clave: ClaveEntidad): string[] {
  switch (clave) {
    case "usuarios":
      return ["Correo", "Creado", "Rol"];
    case "roles":
      return ["Nombre", "Estado"];
    case "categorias":
      return ["Nombre", "Descripción", "Estado"];
    case "financiamiento":
      return ["Código", "Nombre", "Descripción", "Estado"];
    case "aliados":
      return ["Razón social", "RUC", "Contacto", "Estado"];
    case "clientes":
      return ["Tipo", "Documento", "Cliente", "Correo", "Teléfono"];
    case "productos":
      return ["Producto", "Aliado", "Categoría", "Precio", "Estado"];
    case "campanas":
      return ["Campaña", "Descripción", "Vigencia", "Estado"];
    case "reglas":
      return ["Campaña", "Edad", "Ingreso mínimo", "Monto", "Plazo"];
  }
}

export function MaintenancePage() {
  const { puedeAdministrar } = useAuth();
  const [claveActiva, setClaveActiva] = useState<ClaveEntidad>("usuarios");
  const [datos, setDatos] = useState(registrosVacios);
  const [valoresFormulario, setValoresFormulario] = useState<
    Record<string, string>
  >({});
  const [idEnEdicion, setIdEnEdicion] = useState<string | null>(null);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("Cargando datos...");
  const [guardando, setGuardando] = useState(false);
  const entidad = entidades.find(
    (definicion) => definicion.key === claveActiva,
  )!;

  async function cargarDatos() {
    const resultados = await Promise.all(
      entidades.map(async ({ key: claveEntidad, endpoint: rutaApi }) => {
        try {
          const registrosEntidad = await solicitarApi<DatosRegistro[]>(rutaApi);
          return [
            claveEntidad,
            Array.isArray(registrosEntidad) ? registrosEntidad : [],
          ] as const;
        } catch {
          return [claveEntidad, []] as const;
        }
      }),
    );
    setDatos(
      Object.fromEntries(resultados) as Record<ClaveEntidad, DatosRegistro[]>,
    );
    setMensaje("");
  }

  useEffect(() => {
    if (!puedeAdministrar) {
      setMensaje(
        "Inicia sesión con una cuenta autorizada para acceder a los mantenimientos.",
      );
      return;
    }
    cargarDatos().catch(() =>
      setMensaje("No se pudieron cargar los datos de mantenimiento."),
    );
  }, [puedeAdministrar]);

  function abrirFormulario(registro?: DatosRegistro) {
    setIdEnEdicion(registro ? String(registro.id) : null);
    setValoresFormulario(valoresIniciales(entidad, registro));
    setFormularioAbierto(true);
  }

  async function guardarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setGuardando(true);
    setMensaje("");
    try {
      const rutaApi = idEnEdicion
        ? `${entidad.endpoint}/${idEnEdicion}`
        : entidad.endpoint;
      await solicitarApi(rutaApi, {
        method: idEnEdicion ? "PUT" : "POST",
        cuerpo: JSON.stringify(
          construirCarga(claveActiva, valoresFormulario, Boolean(idEnEdicion)),
        ),
      });
      setFormularioAbierto(false);
      setIdEnEdicion(null);
      await cargarDatos();
    } catch (errorCapturado) {
      setMensaje(
        errorCapturado instanceof Error
          ? errorCapturado.message
          : "No se pudo guardar el registro.",
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarRegistro(idRegistro: unknown) {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try {
      await solicitarApi(`${entidad.endpoint}/${idRegistro}`, {
        method: "DELETE",
      });
      await cargarDatos();
    } catch (errorCapturado) {
      setMensaje(
        errorCapturado instanceof Error
          ? errorCapturado.message
          : "No se pudo eliminar el registro.",
      );
    }
  }

  if (!puedeAdministrar)
    return (
      <main className="admin-shell">
        <p role="status">{mensaje}</p>
        <Link to="/login">Iniciar sesión</Link>
      </main>
    );

  const registros = datos[claveActiva];
  const columnas = etiquetasColumnas(claveActiva);

  return (
    <main className="admin-shell">
      <div className="admin-body">
        <aside className="admin-sidebar" aria-label="Mantenimientos">
          <div className="admin-sidebar-label">Maestros</div>
          {entidades.map((definicion) => (
            <button
              key={definicion.key}
              type="button"
              className={`admin-nav-item${definicion.key === claveActiva ? " active" : ""}`}
              onClick={() => {
                setClaveActiva(definicion.key);
                setFormularioAbierto(false);
                setIdEnEdicion(null);
              }}
            >
              {definicion.label}
            </button>
          ))}
        </aside>
        <section className="admin-main">
          <div className="admin-panel-header">
            <h1>{entidad.label}</h1>
            <button
              className="admin-add-btn"
              type="button"
              onClick={() => abrirFormulario()}
            >
              + Nuevo
            </button>
          </div>
          {mensaje && <p role="status">{mensaje}</p>}
          {formularioAbierto && (
            <form className="admin-form open" onSubmit={guardarFormulario}>
              {entidad.fields
                .filter(
                  (campo) =>
                    !(
                      idEnEdicion &&
                      [
                        "codigo",
                        "numeroDocumento",
                        "aliadoId",
                        "campanaId",
                        "moneda",
                      ].includes(campo.name)
                    ),
                )
                .map((campo) => {
                  const esContrasena = campo.name === "password";
                  const esObligatorio = Boolean(
                    campo.required && (!esContrasena || !idEnEdicion),
                  );
                  return (
                    <label key={campo.name}>
                      {campo.label}
                      {campo.type === "select" ? (
                        <select
                          required={esObligatorio}
                          value={valoresFormulario[campo.name] || ""}
                          onChange={(evento) =>
                            setValoresFormulario((valoresActuales) => ({
                              ...valoresActuales,
                              [campo.name]: evento.target.value,
                            }))
                          }
                        >
                          <option value="">Selecciona una opción</option>
                          {(
                            campo.options ||
                            (campo.source
                              ? datos[campo.source].map(
                                  (registroOpcion) =>
                                    [
                                      String(registroOpcion.id),
                                      String(
                                        registroOpcion.nombreRol ||
                                          registroOpcion.razonSocial ||
                                          registroOpcion.nombre ||
                                          registroOpcion.id,
                                      ),
                                    ] as [string, string],
                                )
                              : [])
                          ).map(([valor, etiqueta]) => (
                            <option key={valor} value={valor}>
                              {etiqueta}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={campo.type || "text"}
                          min={campo.type === "number" ? 0 : undefined}
                          required={esObligatorio}
                          value={valoresFormulario[campo.name] || ""}
                          onChange={(evento) =>
                            setValoresFormulario((valoresActuales) => ({
                              ...valoresActuales,
                              [campo.name]: evento.target.value,
                            }))
                          }
                        />
                      )}
                    </label>
                  );
                })}
              <div className="admin-form-actions">
                <button
                  className="admin-form-cancel"
                  type="button"
                  onClick={() => setFormularioAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  className="admin-form-save"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : idEnEdicion
                      ? "Actualizar"
                      : "Guardar"}
                </button>
              </div>
            </form>
          )}
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  {columnas.map((encabezado, indice) => (
                    <th key={indice}>{encabezado}</th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.length === 0 && (
                  <tr>
                    <td colSpan={Math.max(columnas.length + 1, 2)}>
                      Sin registros.
                    </td>
                  </tr>
                )}
                {registros.map((registro) => (
                  <tr key={String(registro.id)}>
                    {mostrarRegistro(claveActiva, registro, datos).map(
                      (valorCelda, indice) => (
                        <td key={indice}>{textoDeValor(valorCelda) || "—"}</td>
                      ),
                    )}
                    <td className="admin-row-actions">
                      <button
                        className="admin-edit-btn"
                        type="button"
                        onClick={() => abrirFormulario(registro)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-delete-btn"
                        type="button"
                        onClick={() => eliminarRegistro(registro.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
