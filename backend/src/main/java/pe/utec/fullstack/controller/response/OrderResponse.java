package pe.utec.fullstack.controller.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import pe.utec.fullstack.domain.business.OrderStatus;

public record OrderResponse(
        Integer id,
        Integer userId,
        OrderStatus status,
        BigDecimal total,
        String currency,
        OffsetDateTime createdAt,
        List<OrderItemResponse> items) {
}
