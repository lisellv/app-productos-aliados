package pe.utec.fullstack.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pe.utec.fullstack.domain.business.OrderStatus;
import pe.utec.fullstack.domain.business.Producto;
import pe.utec.fullstack.repository.EntidadArticuloCarrito;
import pe.utec.fullstack.repository.RepositorioDatosArticuloCarrito;
import pe.utec.fullstack.repository.RepositorioDatosArticuloOrden;
import pe.utec.fullstack.repository.EntidadOrden;
import pe.utec.fullstack.repository.RepositorioDatosOrden;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private RepositorioDatosArticuloCarrito cartRepository;

    @Mock
    private RepositorioDatosOrden orderRepository;

    @Mock
    private RepositorioDatosArticuloOrden orderItemRepository;

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrderStoresPriceSnapshotsAndClearsOwnersCart() {
        var cartItems = List.of(
                cartItem(10, 2),
                cartItem(11, 3));
        var products = List.of(
                product(10, "Herramienta", "20.00"),
                product(11, "Insumo", "5.50"));
        when(cartRepository.findAllByUsuarioIdOrderById(7)).thenReturn(cartItems);
        when(productoService.obtenerActivosPorIds(List.of(10, 11))).thenReturn(products);
        when(orderRepository.saveAndFlush(any(EntidadOrden.class))).thenAnswer(call -> {
            EntidadOrden order = call.getArgument(0);
            order.setId(88);
            return order;
        });
        when(orderItemRepository.saveAll(any())).thenAnswer(call -> call.getArgument(0));

        var response = orderService.createOrder(7);

        assertEquals(88, response.id());
        assertEquals(OrderStatus.PENDIENTE, response.status());
        assertEquals(new BigDecimal("56.50"), response.total());
        assertEquals("PEN", response.currency());
        assertEquals("Herramienta", response.items().get(0).productName());
        assertEquals(new BigDecimal("20.00"), response.items().get(0).unitPrice());
        verify(cartRepository).deleteAllByUsuarioId(7);
    }

    @Test
    void createOrderRejectsAnEmptyCartWithoutSaving() {
        when(cartRepository.findAllByUsuarioIdOrderById(7)).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> orderService.createOrder(7));

        verify(orderRepository, never()).saveAndFlush(any());
        verify(cartRepository, never()).deleteAllByUsuarioId(7);
    }

    private EntidadArticuloCarrito cartItem(int productId, int quantity) {
        return EntidadArticuloCarrito.builder()
                .id(productId)
                .usuarioId(7)
                .productoId(productId)
                .quantity(quantity)
                .creadoAt(OffsetDateTime.now())
                .actualizadoAt(OffsetDateTime.now())
                .build();
    }

    private Producto product(int id, String name, String price) {
        return Producto.builder()
                .id(id)
                .nombre(name)
                .precioLista(new BigDecimal(price))
                .moneda("PEN")
                .estado("activo")
                .alta((short) 1)
                .build();
    }
}
