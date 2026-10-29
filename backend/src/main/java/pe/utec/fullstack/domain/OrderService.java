package pe.utec.fullstack.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import pe.utec.fullstack.controller.response.OrderItemResponse;
import pe.utec.fullstack.controller.response.OrderResponse;
import pe.utec.fullstack.domain.business.OrderStatus;
import pe.utec.fullstack.domain.business.Producto;
import pe.utec.fullstack.repository.EntidadArticuloCarrito;
import pe.utec.fullstack.repository.RepositorioDatosArticuloCarrito;
import pe.utec.fullstack.repository.EntidadArticuloOrden;
import pe.utec.fullstack.repository.RepositorioDatosArticuloOrden;
import pe.utec.fullstack.repository.EntidadOrden;
import pe.utec.fullstack.repository.RepositorioDatosOrden;

@Service
@Transactional
public class OrderService {

    private final RepositorioDatosArticuloCarrito repositorioCarrito;
    private final RepositorioDatosOrden repositorioOrden;
    private final RepositorioDatosArticuloOrden repositorioArticuloOrden;
    private final ProductoService servicioProducto;

    public OrderService(
            RepositorioDatosArticuloCarrito repositorioCarrito,
            RepositorioDatosOrden repositorioOrden,
            RepositorioDatosArticuloOrden repositorioArticuloOrden,
            ProductoService servicioProducto) {
        this.repositorioCarrito = repositorioCarrito;
        this.repositorioOrden = repositorioOrden;
        this.repositorioArticuloOrden = repositorioArticuloOrden;
        this.servicioProducto = servicioProducto;
    }

    public OrderResponse createOrder(Integer idUsuario) {
        List<EntidadArticuloCarrito> articulosCarrito = repositorioCarrito.findAllByUsuarioIdOrderById(idUsuario);
        if (articulosCarrito.isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío.");
        }

        Map<Integer, Producto> productosPorId = servicioProducto.obtenerActivosPorIds(
                articulosCarrito.stream().map(EntidadArticuloCarrito::getProductoId).distinct().toList())
                .stream()
                .collect(Collectors.toMap(Producto::getId, Function.identity()));
        List<Producto> productos = articulosCarrito.stream()
                .map(articulo -> {
                    Producto producto = productosPorId.get(articulo.getProductoId());
                    if (producto == null) {
                        throw new EntityNotFoundException("Producto del carrito no disponible.");
                    }
                    return producto;
                })
                .toList();
        List<String> monedas = productos.stream()
                .map(producto -> normalizarMoneda(producto.getMoneda()))
                .distinct()
                .toList();
        if (monedas.size() != 1) {
            throw new IllegalArgumentException("El carrito debe contener productos de una sola moneda.");
        }

        BigDecimal total = BigDecimal.ZERO;
        for (int indice = 0; indice < articulosCarrito.size(); indice++) {
            total = total.add(productos.get(indice).getPrecioLista()
                    .multiply(BigDecimal.valueOf(articulosCarrito.get(indice).getQuantity())));
        }

        OffsetDateTime fechaActual = OffsetDateTime.now();
        EntidadOrden orden = repositorioOrden.saveAndFlush(EntidadOrden.builder()
                .usuarioId(idUsuario)
                .status(OrderStatus.PENDIENTE.name())
                .total(total)
                .currency(monedas.get(0))
                .creadoAt(fechaActual)
                .actualizadoAt(fechaActual)
                .build());

        List<EntidadArticuloOrden> articulosOrden = new ArrayList<>();
        for (int indice = 0; indice < articulosCarrito.size(); indice++) {
            EntidadArticuloCarrito articuloCarrito = articulosCarrito.get(indice);
            Producto producto = productos.get(indice);
            articulosOrden.add(EntidadArticuloOrden.builder()
                    .orderId(orden.getId())
                    .productoId(producto.getId())
                    .productName(producto.getNombre())
                    .quantity(articuloCarrito.getQuantity())
                    .unitPrice(producto.getPrecioLista())
                    .currency(normalizarMoneda(producto.getMoneda()))
                    .build());
        }
        repositorioArticuloOrden.saveAll(articulosOrden);
        repositorioCarrito.deleteAllByUsuarioId(idUsuario);
        return toResponse(orden, articulosOrden);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Integer idUsuario) {
        return toResponses(repositorioOrden.findAllByUsuarioIdOrderByCreadoAtDesc(idUsuario));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return toResponses(repositorioOrden.findAllByOrderByCreadoAtDesc());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Integer idOrden) {
        EntidadOrden orden = findOrder(idOrden);
        return toResponse(orden, repositorioArticuloOrden.findAllByOrderIdOrderById(idOrden));
    }

    public OrderResponse updateStatus(Integer idOrden, OrderStatus estado) {
        EntidadOrden orden = findOrder(idOrden);
        orden.setStatus(estado.name());
        orden.setActualizadoAt(OffsetDateTime.now());
        return toResponse(repositorioOrden.saveAndFlush(orden),
                repositorioArticuloOrden.findAllByOrderIdOrderById(idOrden));
    }

    private List<OrderResponse> toResponses(List<EntidadOrden> ordenes) {
        if (ordenes.isEmpty())
            return List.of();
        List<Integer> idsOrden = ordenes.stream().map(EntidadOrden::getId).toList();
        Map<Integer, List<EntidadArticuloOrden>> articulosPorOrden = repositorioArticuloOrden
                .findAllByOrderIdInOrderByOrderId(idsOrden).stream()
                .collect(Collectors.groupingBy(EntidadArticuloOrden::getOrderId));
        return ordenes.stream()
                .map(orden -> toResponse(orden, articulosPorOrden.getOrDefault(orden.getId(), List.of())))
                .toList();
    }

    private OrderResponse toResponse(EntidadOrden orden, List<EntidadArticuloOrden> articulos) {
        return new OrderResponse(
                orden.getId(),
                orden.getUsuarioId(),
                OrderStatus.valueOf(orden.getStatus()),
                orden.getTotal(),
                orden.getCurrency(),
                orden.getCreadoAt(),
                articulos.stream().map(this::toResponse).toList());
    }

    private OrderItemResponse toResponse(EntidadArticuloOrden articulo) {
        return new OrderItemResponse(
                articulo.getId(),
                articulo.getProductoId(),
                articulo.getProductName(),
                articulo.getQuantity(),
                articulo.getUnitPrice(),
                articulo.getCurrency());
    }

    private EntidadOrden findOrder(Integer idOrden) {
        return repositorioOrden.findById(idOrden)
                .orElseThrow(() -> new EntityNotFoundException("Orden no encontrada: " + idOrden));
    }

    private String normalizarMoneda(String moneda) {
        return moneda == null || moneda.isBlank() ? "PEN" : moneda;
    }
}
