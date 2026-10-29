package pe.utec.fullstack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pe.utec.fullstack.controller.auth.UserInfoDetails;
import pe.utec.fullstack.controller.request.AddCartItemRequest;
import pe.utec.fullstack.controller.request.UpdateCartItemRequest;
import pe.utec.fullstack.controller.response.CartItemResponse;
import pe.utec.fullstack.domain.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService servicioCarrito;

    public CartController(CartService servicioCarrito) {
        this.servicioCarrito = servicioCarrito;
    }

    @GetMapping
    public List<CartItemResponse> getCart(@AuthenticationPrincipal UserInfoDetails usuarioAutenticado) {
        return servicioCarrito.getCart(usuarioAutenticado.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartItemResponse addItem(
            @AuthenticationPrincipal UserInfoDetails usuarioAutenticado,
            @Valid @RequestBody AddCartItemRequest solicitud) {
        return servicioCarrito.addItem(usuarioAutenticado.getId(), solicitud);
    }

    @PutMapping("/{itemId}")
    public CartItemResponse updateQuantity(
            @AuthenticationPrincipal UserInfoDetails usuarioAutenticado,
            @PathVariable("itemId") Integer idArticulo,
            @Valid @RequestBody UpdateCartItemRequest solicitud) {
        return servicioCarrito.updateQuantity(usuarioAutenticado.getId(), idArticulo, solicitud.quantity());
    }

    @DeleteMapping("/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(
            @AuthenticationPrincipal UserInfoDetails usuarioAutenticado,
            @PathVariable("itemId") Integer idArticulo) {
        servicioCarrito.removeItem(usuarioAutenticado.getId(), idArticulo);
    }
}
