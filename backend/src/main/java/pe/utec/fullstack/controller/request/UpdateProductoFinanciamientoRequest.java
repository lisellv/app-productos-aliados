package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.utec.fullstack.domain.business.TipoTasaInteres;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProductoFinanciamientoRequest {

    @NotNull
    private TipoTasaInteres tipoTasa;

    @NotNull
    private BigDecimal tasaAnual;

    @NotNull
    private Integer plazoMinimoMeses;

    @NotNull
    private Integer plazoMaximoMeses;

    @NotNull
    private BigDecimal montoMinimo;

    @NotNull
    private BigDecimal montoMaximo;

    @NotNull
    private LocalDate vigenteDesde;

    private LocalDate vigenteHasta;

    private Boolean activo;
}
