import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { apiAliados } from "../api/aliadosApi";
import { apiCategorias } from "../api/categoriasApi";
import { useAuth } from "../context/ContextoAutenticacion";
import type { AliadoPerfil } from "../types/aliado";
import type { Category } from "../types/categoria";
import type { Product } from "../types/producto";

interface FormularioProducto {
  nombre: string;
  categoriaId: string;
  descripcion: string;
  precioLista: string;
  moneda: string;
  incluyeIgv: boolean;
  imagenUrl: string;
  estado: "activo" | "inactivo";
}

const formularioVacio: FormularioProducto = {
  nombre: "",
  categoriaId: "",
  descripcion: "",
  precioLista: "",
  moneda: "PEN",
  incluyeIgv: true,
  imagenUrl: "",
  estado: "activo",
};

function formatearPrecio(producto: Product) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: producto.moneda || "PEN",
  }).format(Number(producto.precioLista) || 0);
}

export function AllyPage() {
  const { esAliado } = useAuth();
  const [aliado, setAliado] = useState<AliadoPerfil | null>(null);
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [productoEditando, setProductoEditando] = useState<Product | null>(
    null,
  );
  const [formularioProducto, setFormularioProducto] =
    useState<FormularioProducto>(formularioVacio);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!esAliado) {
      setCargando(false);
      return;
    }
    let solicitudVigente = true;
    Promise.all([
      apiAliados.getMiPerfil(),
      apiAliados.getMisProductos(),
      apiCategorias.getAll().catch(() => [] as Category[]),
    ])
      .then(([perfil, productosAliado, categoriasDisponibles]) => {
        if (!solicitudVigente) return;
        setAliado(perfil);
        setProductos(productosAliado);
        setCategorias(categoriasDisponibles);
        setMensaje("");
      })
      .catch((errorCapturado: unknown) => {
        if (!solicitudVigente) return;
        setMensaje(
          errorCapturado instanceof Error
            ? errorCapturado.message
            : "No se pudo cargar la información del aliado.",
        );
      })
      .finally(() => {
        if (solicitudVigente) setCargando(false);
      });

    return () => {
      solicitudVigente = false;
    };
  }, [esAliado]);

  function cancelarEdicion() {
    setMostrarFormulario(false);
    setProductoEditando(null);
    setFormularioProducto(formularioVacio);
    setMensaje("");
  }

  function iniciarEdicion(producto: Product) {
    setProductoEditando(producto);
    setFormularioProducto({
      nombre: producto.nombre,
      categoriaId: producto.categoriaId ? String(producto.categoriaId) : "",
      descripcion: producto.descripcion || "",
      precioLista: String(producto.precioLista),
      moneda: producto.moneda || "PEN",
      incluyeIgv: Boolean(producto.incluyeIgv),
      imagenUrl: producto.imagenUrl || "",
      estado: producto.estado || "activo",
    });
    setMostrarFormulario(true);
    setMensaje("");
  }

  async function guardarProducto(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!aliado || guardando) return;
    setGuardando(true);
    setMensaje("");
    const datosProducto = {
      categoriaId: formularioProducto.categoriaId
        ? Number(formularioProducto.categoriaId)
        : null,
      nombre: formularioProducto.nombre.trim(),
      descripcion: formularioProducto.descripcion.trim(),
      precioLista: Number(formularioProducto.precioLista),
      incluyeIgv: formularioProducto.incluyeIgv,
      imagenUrl: formularioProducto.imagenUrl.trim(),
    };

    try {
      if (productoEditando) {
        await apiAliados.updateProducto(productoEditando.id, {
          ...datosProducto,
          estado: formularioProducto.estado,
        });
      } else {
        await apiAliados.createProducto({
          ...datosProducto,
          aliadoId: Number(aliado.id),
          moneda: formularioProducto.moneda,
        });
      }
      setProductos(await apiAliados.getMisProductos());
      cancelarEdicion();
      setMensaje(
        productoEditando ? "Producto actualizado." : "Producto creado.",
      );
    } catch (errorCapturado: unknown) {
      setMensaje(
        errorCapturado instanceof Error
          ? errorCapturado.message
          : "No se pudo guardar el producto.",
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarProducto(producto: Product) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
    setMensaje("");
    try {
      await apiAliados.removeProducto(producto.id);
      setProductos(await apiAliados.getMisProductos());
      setMensaje("Producto eliminado.");
    } catch (errorCapturado: unknown) {
      setMensaje(
        errorCapturado instanceof Error
          ? errorCapturado.message
          : "No se pudo eliminar el producto.",
      );
    }
  }

  if (!esAliado) return <Navigate to="/" replace />;

  return (
    <main className="ally-page">
      <div className="ally-page-inner">
        <div className="ally-page-heading">
          <div>
            <p className="ally-eyebrow">Portal del aliado</p>
            <h1>Mi aliado</h1>
            <p>Consulta tus datos y administra los productos de tu aliado.</p>
          </div>
          <Link className="ally-catalog-link" to="/products">
            Ver catálogo
          </Link>
        </div>

        {cargando && <p role="status">Cargando información del aliado...</p>}
        {mensaje && (
          <p className="ally-message" role="alert">
            {mensaje}
          </p>
        )}

        {!cargando && aliado && (
          <>
            <section
              className="ally-details"
              aria-labelledby="ally-details-title"
            >
              <div className="ally-section-heading">
                <h2 id="ally-details-title">Información del aliado</h2>
                <span
                  className={`ally-state ally-state--${aliado.estado || "activo"}`}
                >
                  {aliado.estado || "Activo"}
                </span>
              </div>
              <dl className="ally-info-grid">
                <div>
                  <dt>Razón social</dt>
                  <dd>{aliado.razonSocial}</dd>
                </div>
                <div>
                  <dt>{aliado.tipoDocumento || "RUC"}</dt>
                  <dd>{aliado.numeroDocumento || "—"}</dd>
                </div>
                <div>
                  <dt>Contacto</dt>
                  <dd>{aliado.contactoNombre || "—"}</dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>{aliado.contactoCorreo || "—"}</dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd>{aliado.contactoTelefono || "—"}</dd>
                </div>
              </dl>
            </section>

            <section
              className="ally-products"
              aria-labelledby="ally-products-title"
            >
              <div className="ally-section-heading">
                <h2 id="ally-products-title">Mis productos</h2>
                <span>{productos.length} productos</span>
              </div>
              <div className="ally-product-toolbar">
                <button
                  className="ally-add-product"
                  type="button"
                  onClick={() => {
                    setProductoEditando(null);
                    setFormularioProducto(formularioVacio);
                    setMostrarFormulario(true);
                    setMensaje("");
                  }}
                >
                  + Nuevo producto
                </button>
              </div>
              {mostrarFormulario && (
                <form className="ally-product-form" onSubmit={guardarProducto}>
                  <div className="ally-product-form-heading">
                    <h3>
                      {productoEditando ? "Editar producto" : "Nuevo producto"}
                    </h3>
                    <button type="button" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                  </div>
                  <div className="ally-product-form-grid">
                    <label>
                      Nombre
                      <input
                        required
                        value={formularioProducto.nombre}
                        onChange={(evento) =>
                          setFormularioProducto({
                            ...formularioProducto,
                            nombre: evento.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Categoría
                      <select
                        value={formularioProducto.categoriaId}
                        onChange={(evento) =>
                          setFormularioProducto({
                            ...formularioProducto,
                            categoriaId: evento.target.value,
                          })
                        }
                      >
                        <option value="">Sin categoría</option>
                        {categorias.map((categoria) => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="ally-product-form-wide">
                      Descripción
                      <textarea
                        rows={3}
                        value={formularioProducto.descripcion}
                        onChange={(evento) =>
                          setFormularioProducto({
                            ...formularioProducto,
                            descripcion: evento.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Precio
                      <input
                        required
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formularioProducto.precioLista}
                        onChange={(evento) =>
                          setFormularioProducto({
                            ...formularioProducto,
                            precioLista: evento.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Moneda
                      <select
                        disabled={Boolean(productoEditando)}
                        value={formularioProducto.moneda}
                        onChange={(evento) =>
                          setFormularioProducto({
                            ...formularioProducto,
                            moneda: evento.target.value,
                          })
                        }
                      >
                        <option value="PEN">PEN</option>
                        <option value="USD">USD</option>
                      </select>
                    </label>
                    <label className="ally-product-form-wide">
                      Imagen (URL)
                      <input
                        type="url"
                        value={formularioProducto.imagenUrl}
                        onChange={(evento) =>
                          setFormularioProducto({
                            ...formularioProducto,
                            imagenUrl: evento.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="ally-product-checkbox">
                      <input
                        type="checkbox"
                        checked={formularioProducto.incluyeIgv}
                        onChange={(evento) =>
                          setFormularioProducto({
                            ...formularioProducto,
                            incluyeIgv: evento.target.checked,
                          })
                        }
                      />
                      Incluye IGV
                    </label>
                    {productoEditando && (
                      <label>
                        Estado
                        <select
                          value={formularioProducto.estado}
                          onChange={(evento) =>
                            setFormularioProducto({
                              ...formularioProducto,
                              estado: evento.target.value as
                                | "activo"
                                | "inactivo",
                            })
                          }
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      </label>
                    )}
                  </div>
                  <button
                    className="ally-save-product"
                    type="submit"
                    disabled={guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar producto"}
                  </button>
                </form>
              )}
              <div className="ally-products-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion || "—"}</td>
                        <td>
                          {categorias.find(
                            (categoria) =>
                              String(categoria.id) ===
                              String(producto.categoriaId),
                          )?.nombre || "—"}
                        </td>
                        <td>{formatearPrecio(producto)}</td>
                        <td>{producto.estado || "Activo"}</td>
                        <td className="ally-product-actions">
                          <button
                            type="button"
                            onClick={() => iniciarEdicion(producto)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void eliminarProducto(producto)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {productos.length === 0 && (
                      <tr>
                        <td colSpan={6}>No tienes productos asociados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
