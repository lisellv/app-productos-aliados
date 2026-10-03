package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateReglaPrecalificacionRequest {

    @NotNull
    private Integer edadMinima;

    @NotNull
    private Integer edadMaxima;

    @NotNull
    private BigDecimal ingresoMinimo;

    @NotNull
    private BigDecimal montoMinimo;

    @NotNull
    private BigDecimal montoMaximo;

    @NotNull
    private Integer plazoMinimoMeses;

    @NotNull
    private Integer plazoMaximoMeses;

    private Boolean activo;
}
