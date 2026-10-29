package pe.utec.fullstack.controller.response;

import java.math.BigDecimal;

public record CartItemResponse(
        Integer id,
        Integer productId,
        String productName,
        String imageUrl,
        BigDecimal unitPrice,
        String currency,
        Integer quantity,
        BigDecimal subtotal) {
}
