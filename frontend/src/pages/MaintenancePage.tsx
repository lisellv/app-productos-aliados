import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

type EntityKey =
  | "usuarios"
  | "roles"
  | "categorias"
  | "financiamiento"
  | "aliados"
  | "clientes"
  | "productos"
  | "campanas"
  | "reglas";
type RecordData = Record<string, unknown>;

interface FieldDefinition {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  source?: EntityKey;
  options?: Array<[string, string]>;
}

interface EntityDefinition {
  key: EntityKey;
  label: string;
  endpoint: string;
  fields: FieldDefinition[];
}

const entities: EntityDefinition[] = [
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

const emptyRecords = (): Record<EntityKey, RecordData[]> => ({
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
const textValue = (value: unknown) => (value == null ? "" : String(value));
const optional = (value: unknown) => textValue(value).trim() || null;

function initialValues(entity: EntityDefinition, record?: RecordData) {
  const values: Record<string, string> = {};
  entity.fields.forEach(({ name }) => {
    let value = record?.[name];
    if (name === "correo" && record)
      value = record.correoElectronico ?? record.correo;
    if (name === "estado" && record) value = record.activo ?? record.estado;
    if (name === "nombre" && record) value = record.nombreRol ?? record.nombre;
    if (name === "plazoMinimoMeses" && record) value = record.plazoMinimoMeses;
    if (name === "plazoMaximoMeses" && record) value = record.plazoMaximoMeses;
    if (name === "fechaInicio" && record)
      value = textValue(record.fechaInicio).slice(0, 10);
    if (name === "fechaFin" && record)
      value = textValue(record.fechaFin).slice(0, 10);
    values[name] = name === "password" ? "" : textValue(value);
  });
  return values;
}

function buildPayload(
  key: EntityKey,
  values: Record<string, string>,
  editing: boolean,
): RecordData {
  const value = (name: string) => values[name]?.trim() || "";
  const description = optional(values.descripcion);
  switch (key) {
    case "usuarios":
      return {
        correoElectronico: value("correo"),
        rolId: Number(value("rolId")),
        aliadoId: value("aliadoId") ? Number(value("aliadoId")) : null,
        ...(value("password") ? { password: value("password") } : {}),
        ...(editing ? { activo: value("estado") === "true" } : {}),
      };
    case "roles":
      return { nombreRol: value("nombre") };
    case "categorias":
      return {
        nombre: value("nombre"),
        descripcion: description,
        ...(editing ? { activo: value("estado") === "true" } : {}),
      };
    case "financiamiento":
      return {
        ...(editing ? {} : { codigo: value("codigo") }),
        nombre: value("nombre"),
        descripcion: description,
        ...(editing ? { activo: value("estado") === "true" } : {}),
      };
    case "aliados":
      return {
        razonSocial: value("razonSocial"),
        ...(editing ? {} : { numeroDocumento: value("numeroDocumento") }),
        contactoNombre: optional(values.contactoNombre),
        contactoCorreo: optional(values.contactoCorreo),
        contactoTelefono: optional(values.contactoTelefono),
        ...(editing ? { estado: value("estado") } : {}),
      };
    case "clientes": {
      const natural = value("tipoPersona") === "NATURAL";
      return {
        tipoPersona: value("tipoPersona"),
        tipoDocumento: value("tipoDocumento"),
        numeroDocumento: value("numeroDocumento"),
        nombres: natural ? optional(values.nombres) : null,
        apellidos: natural ? optional(values.apellidos) : null,
        razonSocial: natural ? null : optional(values.razonSocial),
        correo: optional(values.correo),
        telefono: optional(values.telefono),
      };
    }
    case "productos":
      return {
        ...(editing
          ? {}
          : { aliadoId: Number(value("aliadoId")), moneda: value("moneda") }),
        categoriaId: value("categoriaId") ? Number(value("categoriaId")) : null,
        nombre: value("nombre"),
        descripcion: description,
        precioLista: Number(value("precioLista")),
        incluyeIgv: value("incluyeIgv") === "true",
        imagenUrl: optional(values.imagenUrl),
        ...(editing ? { estado: value("estado") } : {}),
      };
    case "campanas":
      return {
        nombre: value("nombre"),
        descripcion: description,
        fechaInicio: value("fechaInicio"),
        fechaFin: value("fechaFin"),
        ...(editing ? { estado: value("estado") } : {}),
      };
    case "reglas":
      return {
        edadMinima: Number(value("edadMinima")),
        edadMaxima: Number(value("edadMaxima")),
        ingresoMinimo: Number(value("ingresoMinimo")),
        montoMinimo: Number(value("montoMinimo")),
        montoMaximo: Number(value("montoMaximo")),
        plazoMinimoMeses: Number(value("plazoMinimoMeses")),
        plazoMaximoMeses: Number(value("plazoMaximoMeses")),
        ...(editing
          ? { activo: value("estado") === "true" }
          : { campanaId: Number(value("campanaId")) }),
      };
  }
}

function displayRecord(
  key: EntityKey,
  record: RecordData,
  data: Record<EntityKey, RecordData[]>,
) {
  const findName = (list: EntityKey, id: unknown, name: string) =>
    data[list].find((item) => String(item.id) === String(id))?.[name] ||
    `#${id ?? "—"}`;
  switch (key) {
    case "usuarios":
      return [
        record.correoElectronico || record.correo,
        record.creadoAt,
        findName("roles", record.rolId, "nombreRol"),
      ];
    case "roles":
      return [
        record.nombreRol,
        Number(record.alta) === 1 ? "Activo" : "Inactivo",
      ];
    case "categorias":
      return [
        record.nombre,
        record.descripcion,
        record.activo ? "Activo" : "Inactivo",
      ];
    case "financiamiento":
      return [
        record.codigo,
        record.nombre,
        record.descripcion,
        record.activo ? "Activo" : "Inactivo",
      ];
    case "aliados":
      return [
        record.razonSocial,
        record.numeroDocumento,
        record.contactoNombre,
        record.estado,
      ];
    case "clientes":
      return [
        record.tipoPersona === "NATURAL" ? "Natural" : "Jurídica",
        `${record.tipoDocumento || ""} ${record.numeroDocumento || ""}`,
        record.tipoPersona === "NATURAL"
          ? `${record.nombres || ""} ${record.apellidos || ""}`
          : record.razonSocial,
        record.correo,
        record.telefono,
      ];
    case "productos":
      return [
        record.nombre,
        findName("aliados", record.aliadoId, "razonSocial"),
        findName("categorias", record.categoriaId, "nombre"),
        `${record.precioLista ?? "—"} ${record.moneda || "PEN"}`,
        record.estado,
      ];
    case "campanas":
      return [
        record.nombre,
        record.descripcion,
        `${record.fechaInicio || "—"} - ${record.fechaFin || "—"}`,
        record.estado,
      ];
    case "reglas":
      return [
        findName("campanas", record.campanaId, "nombre"),
        `${record.edadMinima} - ${record.edadMaxima}`,
        record.ingresoMinimo,
        `${record.montoMinimo} - ${record.montoMaximo}`,
        `${record.plazoMinimoMeses} - ${record.plazoMaximoMeses}`,
      ];
  }
}

function columnLabels(key: EntityKey): string[] {
  switch (key) {
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
  const { canAccessManagement } = useAuth();
  const [activeKey, setActiveKey] = useState<EntityKey>("usuarios");
  const [data, setData] = useState(emptyRecords);
  const [values, setValues] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("Cargando datos...");
  const [saving, setSaving] = useState(false);
  const entity = entities.find((item) => item.key === activeKey)!;

  async function loadData() {
    const results = await Promise.all(
      entities.map(async ({ key, endpoint }) => {
        try {
          const rows = await apiRequest<RecordData[]>(endpoint);
          return [key, Array.isArray(rows) ? rows : []] as const;
        } catch {
          return [key, []] as const;
        }
      }),
    );
    setData(Object.fromEntries(results) as Record<EntityKey, RecordData[]>);
    setMessage("");
  }

  useEffect(() => {
    if (!canAccessManagement) {
      setMessage(
        "Inicia sesión con una cuenta autorizada para acceder a los mantenimientos.",
      );
      return;
    }
    loadData().catch(() =>
      setMessage("No se pudieron cargar los datos de mantenimiento."),
    );
  }, [canAccessManagement]);

  function openForm(record?: RecordData) {
    setEditingId(record ? String(record.id) : null);
    setValues(initialValues(entity, record));
    setFormOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const endpoint = editingId
        ? `${entity.endpoint}/${editingId}`
        : entity.endpoint;
      await apiRequest(endpoint, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(
          buildPayload(activeKey, values, Boolean(editingId)),
        ),
      });
      setFormOpen(false);
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el registro.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeRecord(id: unknown) {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try {
      await apiRequest(`${entity.endpoint}/${id}`, { method: "DELETE" });
      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el registro.",
      );
    }
  }

  if (!canAccessManagement)
    return (
      <main className="admin-shell">
        <p role="status">{message}</p>
        <Link to="/login">Iniciar sesión</Link>
      </main>
    );

  const records = data[activeKey];
  const columns = columnLabels(activeKey);

  return (
    <main className="admin-shell">
      <div className="admin-body">
        <aside className="admin-sidebar" aria-label="Mantenimientos">
          <div className="admin-sidebar-label">Maestros</div>
          {entities.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`admin-nav-item${item.key === activeKey ? " active" : ""}`}
              onClick={() => {
                setActiveKey(item.key);
                setFormOpen(false);
                setEditingId(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </aside>
        <section className="admin-main">
          <div className="admin-panel-header">
            <h1>{entity.label}</h1>
            <button
              className="admin-add-btn"
              type="button"
              onClick={() => openForm()}
            >
              + Nuevo
            </button>
          </div>
          {message && <p role="status">{message}</p>}
          {formOpen && (
            <form className="admin-form open" onSubmit={submit}>
              {entity.fields
                .filter(
                  (field) =>
                    !(
                      editingId &&
                      [
                        "codigo",
                        "numeroDocumento",
                        "aliadoId",
                        "campanaId",
                        "moneda",
                      ].includes(field.name)
                    ),
                )
                .map((field) => {
                  const isPassword = field.name === "password";
                  const isRequired = Boolean(
                    field.required && (!isPassword || !editingId),
                  );
                  return (
                    <label key={field.name}>
                      {field.label}
                      {field.type === "select" ? (
                        <select
                          required={isRequired}
                          value={values[field.name] || ""}
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                        >
                          <option value="">Selecciona una opción</option>
                          {(
                            field.options ||
                            (field.source
                              ? data[field.source].map(
                                  (record) =>
                                    [
                                      String(record.id),
                                      String(
                                        record.nombreRol ||
                                          record.razonSocial ||
                                          record.nombre ||
                                          record.id,
                                      ),
                                    ] as [string, string],
                                )
                              : [])
                          ).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          min={field.type === "number" ? 0 : undefined}
                          required={isRequired}
                          value={values[field.name] || ""}
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
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
                  onClick={() => setFormOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="admin-form-save"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Guardando..."
                    : editingId
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
                  {columns.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 && (
                  <tr>
                    <td colSpan={Math.max(columns.length + 1, 2)}>
                      Sin registros.
                    </td>
                  </tr>
                )}
                {records.map((record) => (
                  <tr key={String(record.id)}>
                    {displayRecord(activeKey, record, data).map(
                      (cell, index) => (
                        <td key={index}>{textValue(cell) || "—"}</td>
                      ),
                    )}
                    <td className="admin-row-actions">
                      <button
                        className="admin-edit-btn"
                        type="button"
                        onClick={() => openForm(record)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-delete-btn"
                        type="button"
                        onClick={() => removeRecord(record.id)}
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
