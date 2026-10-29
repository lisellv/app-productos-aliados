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

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@AuthenticationPrincipal UserInfoDetails user) {
        return orderService.createOrder(user.getId());
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(@AuthenticationPrincipal UserInfoDetails user) {
        return orderService.getMyOrders(user.getId());
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Integer id) {
        return orderService.getOrder(id);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateStatus(id, request.status());
    }
}
