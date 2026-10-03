package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.utec.fullstack.domain.business.TipoTasaInteres;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateSolicitudFinanciamientoRequest {

    @NotNull
    private Integer clienteId;

    @NotNull
    private Integer productoId;

    @NotNull
    private Integer productoFinanciamientoId;

    private Integer campanaId;

    @NotNull
    @DecimalMin(value = "0", inclusive = true)
    private BigDecimal montoSolicitado;

    @NotNull
    private Integer plazoMeses;

    @NotNull
    private TipoTasaInteres tasaTipoAplicada;

    @NotNull
    private BigDecimal tasaAnualAplicada;

    @NotNull
    private Boolean consentimiento;
}
