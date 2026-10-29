package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.NotNull;
import pe.utec.fullstack.domain.business.OrderStatus;

public record UpdateOrderStatusRequest(@NotNull OrderStatus status) {
}
