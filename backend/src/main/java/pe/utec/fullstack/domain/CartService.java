package pe.utec.fullstack.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import pe.utec.fullstack.controller.request.AddCartItemRequest;
import pe.utec.fullstack.controller.response.CartItemResponse;
import pe.utec.fullstack.domain.business.Producto;
import pe.utec.fullstack.repository.EntidadArticuloCarrito;
import pe.utec.fullstack.repository.RepositorioDatosArticuloCarrito;

@Service
@Transactional
public class CartService {

    private final RepositorioDatosArticuloCarrito repositorioCarrito;
    private final ProductoService servicioProducto;

    public CartService(RepositorioDatosArticuloCarrito repositorioCarrito, ProductoService servicioProducto) {
        this.repositorioCarrito = repositorioCarrito;
        this.servicioProducto = servicioProducto;
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(Integer idUsuario) {
        List<EntidadArticuloCarrito> articulos = repositorioCarrito.findAllByUsuarioIdOrderById(idUsuario);
        Map<Integer, Producto> productosPorId = servicioProducto.obtenerActivosPorIds(
                articulos.stream().map(EntidadArticuloCarrito::getProductoId).distinct().toList())
                .stream()
                .collect(Collectors.toMap(Producto::getId, Function.identity()));
        return articulos.stream()
                .map(articulo -> {
                    Producto producto = productosPorId.get(articulo.getProductoId());
                    if (producto == null) {
                        throw new EntityNotFoundException("Producto del carrito no disponible.");
                    }
                    return toResponse(articulo, producto);
                })
                .toList();
    }

    public CartItemResponse addItem(Integer idUsuario, AddCartItemRequest solicitud) {
        Producto producto = activeProduct(solicitud.productId());
        OffsetDateTime fechaActual = OffsetDateTime.now();
        EntidadArticuloCarrito articulo = repositorioCarrito
                .findByUsuarioIdAndProductoId(idUsuario, solicitud.productId())
                .orElseGet(() -> EntidadArticuloCarrito.builder()
                        .usuarioId(idUsuario)
                        .productoId(solicitud.productId())
                        .quantity(0)
                        .creadoAt(fechaActual)
                        .build());
        articulo.setQuantity(articulo.getQuantity() + solicitud.quantity());
        articulo.setActualizadoAt(fechaActual);
        return toResponse(repositorioCarrito.saveAndFlush(articulo), producto);
    }

    public CartItemResponse updateQuantity(Integer idUsuario, Integer idArticulo, Integer cantidad) {
        EntidadArticuloCarrito articulo = findOwnedItem(idUsuario, idArticulo);
        articulo.setQuantity(cantidad);
        articulo.setActualizadoAt(OffsetDateTime.now());
        return toResponse(repositorioCarrito.saveAndFlush(articulo));
    }

    public void removeItem(Integer idUsuario, Integer idArticulo) {
        findOwnedItem(idUsuario, idArticulo);
        repositorioCarrito.deleteByIdAndUsuarioId(idArticulo, idUsuario);
    }

    public void clearCart(Integer idUsuario) {
        repositorioCarrito.deleteAllByUsuarioId(idUsuario);
    }

    private EntidadArticuloCarrito findOwnedItem(Integer idUsuario, Integer idArticulo) {
        return repositorioCarrito.findByIdAndUsuarioId(idArticulo, idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Ítem de carrito no encontrado."));
    }

    private Producto activeProduct(Integer idProducto) {
        Producto producto = servicioProducto.obtenerPorId(idProducto);
        if (!"activo".equalsIgnoreCase(producto.getEstado()) || producto.getAlta() == null
                || producto.getAlta() != 1) {
            throw new EntityNotFoundException("Producto no disponible.");
        }
        return producto;
    }

    private CartItemResponse toResponse(EntidadArticuloCarrito articulo) {
        return toResponse(articulo, servicioProducto.obtenerPorId(articulo.getProductoId()));
    }

    private CartItemResponse toResponse(EntidadArticuloCarrito articulo, Producto producto) {
        BigDecimal subtotal = producto.getPrecioLista().multiply(BigDecimal.valueOf(articulo.getQuantity()));
        return new CartItemResponse(
                articulo.getId(),
                producto.getId(),
                producto.getNombre(),
                producto.getImagenUrl(),
                producto.getPrecioLista(),
                producto.getMoneda(),
                articulo.getQuantity(),
                subtotal);
    }
}
