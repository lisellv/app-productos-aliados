package pe.utec.fullstack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
import pe.utec.fullstack.controller.request.UpdateOrderStatusRequest;
import pe.utec.fullstack.controller.response.OrderResponse;
import pe.utec.fullstack.domain.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService servicioOrden;

    public OrderController(OrderService servicioOrden) {
        this.servicioOrden = servicioOrden;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@AuthenticationPrincipal UserInfoDetails usuarioAutenticado) {
        return servicioOrden.createOrder(usuarioAutenticado.getId());
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(@AuthenticationPrincipal UserInfoDetails usuarioAutenticado) {
        return servicioOrden.getMyOrders(usuarioAutenticado.getId());
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return servicioOrden.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable("id") Integer idOrden) {
        return servicioOrden.getOrder(idOrden);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(
            @PathVariable("id") Integer idOrden,
            @Valid @RequestBody UpdateOrderStatusRequest solicitud) {
        return servicioOrden.updateStatus(idOrden, solicitud.status());
    }
}
