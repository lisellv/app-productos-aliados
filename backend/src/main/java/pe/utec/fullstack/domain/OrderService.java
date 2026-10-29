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
import pe.utec.fullstack.repository.CartItemJpaEntity;
import pe.utec.fullstack.repository.CartItemJpaRepository;
import pe.utec.fullstack.repository.OrderItemJpaEntity;
import pe.utec.fullstack.repository.OrderItemJpaRepository;
import pe.utec.fullstack.repository.OrderJpaEntity;
import pe.utec.fullstack.repository.OrderJpaRepository;

@Service
@Transactional
public class OrderService {

    private final CartItemJpaRepository cartRepository;
    private final OrderJpaRepository orderRepository;
    private final OrderItemJpaRepository orderItemRepository;
    private final ProductoService productoService;

    public OrderService(
            CartItemJpaRepository cartRepository,
            OrderJpaRepository orderRepository,
            OrderItemJpaRepository orderItemRepository,
            ProductoService productoService) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productoService = productoService;
    }

    public OrderResponse createOrder(Integer userId) {
        List<CartItemJpaEntity> cartItems = cartRepository.findAllByUsuarioIdOrderById(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío.");
        }

        Map<Integer, Producto> productsById = productoService.obtenerActivosPorIds(
                cartItems.stream().map(CartItemJpaEntity::getProductoId).distinct().toList())
                .stream()
                .collect(Collectors.toMap(Producto::getId, Function.identity()));
        List<Producto> products = cartItems.stream()
                .map(item -> {
                    Producto product = productsById.get(item.getProductoId());
                    if (product == null) {
                        throw new EntityNotFoundException("Producto del carrito no disponible.");
                    }
                    return product;
                })
                .toList();
        List<String> currencies = products.stream()
                .map(product -> currency(product.getMoneda()))
                .distinct()
                .toList();
        if (currencies.size() != 1) {
            throw new IllegalArgumentException("El carrito debe contener productos de una sola moneda.");
        }

        BigDecimal total = BigDecimal.ZERO;
        for (int index = 0; index < cartItems.size(); index++) {
            total = total.add(products.get(index).getPrecioLista()
                    .multiply(BigDecimal.valueOf(cartItems.get(index).getQuantity())));
        }

        OffsetDateTime now = OffsetDateTime.now();
        OrderJpaEntity order = orderRepository.saveAndFlush(OrderJpaEntity.builder()
                .usuarioId(userId)
                .status(OrderStatus.PENDIENTE.name())
                .total(total)
                .currency(currencies.get(0))
                .creadoAt(now)
                .actualizadoAt(now)
                .build());

        List<OrderItemJpaEntity> orderItems = new ArrayList<>();
        for (int index = 0; index < cartItems.size(); index++) {
            CartItemJpaEntity cartItem = cartItems.get(index);
            Producto product = products.get(index);
            orderItems.add(OrderItemJpaEntity.builder()
                    .orderId(order.getId())
                    .productoId(product.getId())
                    .productName(product.getNombre())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(product.getPrecioLista())
                    .currency(currency(product.getMoneda()))
                    .build());
        }
        orderItemRepository.saveAll(orderItems);
        cartRepository.deleteAllByUsuarioId(userId);
        return toResponse(order, orderItems);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Integer userId) {
        return toResponses(orderRepository.findAllByUsuarioIdOrderByCreadoAtDesc(userId));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return toResponses(orderRepository.findAllByOrderByCreadoAtDesc());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Integer orderId) {
        OrderJpaEntity order = findOrder(orderId);
        return toResponse(order, orderItemRepository.findAllByOrderIdOrderById(orderId));
    }

    public OrderResponse updateStatus(Integer orderId, OrderStatus status) {
        OrderJpaEntity order = findOrder(orderId);
        order.setStatus(status.name());
        order.setActualizadoAt(OffsetDateTime.now());
        return toResponse(orderRepository.saveAndFlush(order),
                orderItemRepository.findAllByOrderIdOrderById(orderId));
    }

    private List<OrderResponse> toResponses(List<OrderJpaEntity> orders) {
        if (orders.isEmpty())
            return List.of();
        List<Integer> orderIds = orders.stream().map(OrderJpaEntity::getId).toList();
        Map<Integer, List<OrderItemJpaEntity>> itemsByOrder = orderItemRepository
                .findAllByOrderIdInOrderByOrderId(orderIds).stream()
                .collect(Collectors.groupingBy(OrderItemJpaEntity::getOrderId));
        return orders.stream()
                .map(order -> toResponse(order, itemsByOrder.getOrDefault(order.getId(), List.of())))
                .toList();
    }

    private OrderResponse toResponse(OrderJpaEntity order, List<OrderItemJpaEntity> items) {
        return new OrderResponse(
                order.getId(),
                order.getUsuarioId(),
                OrderStatus.valueOf(order.getStatus()),
                order.getTotal(),
                order.getCurrency(),
                order.getCreadoAt(),
                items.stream().map(this::toResponse).toList());
    }

    private OrderItemResponse toResponse(OrderItemJpaEntity item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProductoId(),
                item.getProductName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getCurrency());
    }

    private OrderJpaEntity findOrder(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Orden no encontrada: " + orderId));
    }

    private String currency(String currency) {
        return currency == null || currency.isBlank() ? "PEN" : currency;
    }
}
