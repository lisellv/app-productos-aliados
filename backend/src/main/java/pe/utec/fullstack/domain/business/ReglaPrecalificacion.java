package pe.utec.fullstack.domain.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReglaPrecalificacion {

    private Integer id;

    private Integer campanaId;

    private Integer edadMinima;

    private Integer edadMaxima;

    private BigDecimal ingresoMinimo;

    private BigDecimal montoMinimo;

    private BigDecimal montoMaximo;

    private Integer plazoMinimoMeses;

    private Integer plazoMaximoMeses;

    private Boolean activo;

    private Short alta;
}
