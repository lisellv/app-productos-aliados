package pe.utec.fullstack.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.persistence.EntityNotFoundException;
import pe.utec.fullstack.controller.request.AddCartItemRequest;
import pe.utec.fullstack.domain.business.Producto;
import pe.utec.fullstack.repository.EntidadArticuloCarrito;
import pe.utec.fullstack.repository.RepositorioDatosArticuloCarrito;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private RepositorioDatosArticuloCarrito cartRepository;

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private CartService cartService;

    @Test
    void addItemMergesQuantityForTheCurrentUser() {
        var product = Producto.builder()
                .id(15)
                .nombre("Equipo")
                .precioLista(new BigDecimal("12.50"))
                .moneda("PEN")
                .estado("activo")
                .alta((short) 1)
                .build();
        var item = EntidadArticuloCarrito.builder()
                .id(9)
                .usuarioId(4)
                .productoId(15)
                .quantity(2)
                .creadoAt(OffsetDateTime.now())
                .actualizadoAt(OffsetDateTime.now())
                .build();
        when(productoService.obtenerPorId(15)).thenReturn(product);
        when(cartRepository.findByUsuarioIdAndProductoId(4, 15)).thenReturn(Optional.of(item));
        when(cartRepository.saveAndFlush(any(EntidadArticuloCarrito.class))).thenAnswer(call -> call.getArgument(0));

        var response = cartService.addItem(4, new AddCartItemRequest(15, 3));

        assertEquals(5, response.quantity());
        assertEquals(new BigDecimal("62.50"), response.subtotal());
        verify(cartRepository).findByUsuarioIdAndProductoId(4, 15);
    }

    @Test
    void removeItemCannotDeleteAnotherUsersCartItem() {
        when(cartRepository.findByIdAndUsuarioId(9, 4)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> cartService.removeItem(4, 9));

        verify(cartRepository, never()).deleteByIdAndUsuarioId(any(), any());
    }
}
