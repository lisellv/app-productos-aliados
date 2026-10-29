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
import pe.utec.fullstack.repository.CartItemJpaEntity;
import pe.utec.fullstack.repository.CartItemJpaRepository;

@Service
@Transactional
public class CartService {

    private final CartItemJpaRepository cartRepository;
    private final ProductoService productoService;

    public CartService(CartItemJpaRepository cartRepository, ProductoService productoService) {
        this.cartRepository = cartRepository;
        this.productoService = productoService;
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(Integer userId) {
        List<CartItemJpaEntity> items = cartRepository.findAllByUsuarioIdOrderById(userId);
        Map<Integer, Producto> products = productoService.obtenerActivosPorIds(
                items.stream().map(CartItemJpaEntity::getProductoId).distinct().toList())
                .stream()
                .collect(Collectors.toMap(Producto::getId, Function.identity()));
        return items.stream()
                .map(item -> {
                    Producto product = products.get(item.getProductoId());
                    if (product == null) {
                        throw new EntityNotFoundException("Producto del carrito no disponible.");
                    }
                    return toResponse(item, product);
                })
                .toList();
    }

    public CartItemResponse addItem(Integer userId, AddCartItemRequest request) {
        Producto product = activeProduct(request.productId());
        OffsetDateTime now = OffsetDateTime.now();
        CartItemJpaEntity item = cartRepository
                .findByUsuarioIdAndProductoId(userId, request.productId())
                .orElseGet(() -> CartItemJpaEntity.builder()
                        .usuarioId(userId)
                        .productoId(request.productId())
                        .quantity(0)
                        .creadoAt(now)
                        .build());
        item.setQuantity(item.getQuantity() + request.quantity());
        item.setActualizadoAt(now);
        return toResponse(cartRepository.saveAndFlush(item), product);
    }

    public CartItemResponse updateQuantity(Integer userId, Integer itemId, Integer quantity) {
        CartItemJpaEntity item = findOwnedItem(userId, itemId);
        item.setQuantity(quantity);
        item.setActualizadoAt(OffsetDateTime.now());
        return toResponse(cartRepository.saveAndFlush(item));
    }

    public void removeItem(Integer userId, Integer itemId) {
        findOwnedItem(userId, itemId);
        cartRepository.deleteByIdAndUsuarioId(itemId, userId);
    }

    public void clearCart(Integer userId) {
        cartRepository.deleteAllByUsuarioId(userId);
    }

    private CartItemJpaEntity findOwnedItem(Integer userId, Integer itemId) {
        return cartRepository.findByIdAndUsuarioId(itemId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Ítem de carrito no encontrado."));
    }

    private Producto activeProduct(Integer productId) {
        Producto product = productoService.obtenerPorId(productId);
        if (!"activo".equalsIgnoreCase(product.getEstado()) || product.getAlta() == null
                || product.getAlta() != 1) {
            throw new EntityNotFoundException("Producto no disponible.");
        }
        return product;
    }

    private CartItemResponse toResponse(CartItemJpaEntity item) {
        return toResponse(item, productoService.obtenerPorId(item.getProductoId()));
    }

    private CartItemResponse toResponse(CartItemJpaEntity item, Producto product) {
        BigDecimal subtotal = product.getPrecioLista().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(
                item.getId(),
                product.getId(),
                product.getNombre(),
                product.getImagenUrl(),
                product.getPrecioLista(),
                product.getMoneda(),
                item.getQuantity(),
                subtotal);
    }
}
