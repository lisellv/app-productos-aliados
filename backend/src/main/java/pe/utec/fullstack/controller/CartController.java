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

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItemResponse> getCart(@AuthenticationPrincipal UserInfoDetails user) {
        return cartService.getCart(user.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartItemResponse addItem(
            @AuthenticationPrincipal UserInfoDetails user,
            @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(user.getId(), request);
    }

    @PutMapping("/{itemId}")
    public CartItemResponse updateQuantity(
            @AuthenticationPrincipal UserInfoDetails user,
            @PathVariable Integer itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateQuantity(user.getId(), itemId, request.quantity());
    }

    @DeleteMapping("/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@AuthenticationPrincipal UserInfoDetails user, @PathVariable Integer itemId) {
        cartService.removeItem(user.getId(), itemId);
    }
}
