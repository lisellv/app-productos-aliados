package pe.utec.fullstack.domain.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoFinanciamiento {

    private Integer id;

    private Integer productoId;

    private Integer tipoFinanciamientoId;

    private TipoTasaInteres tipoTasa;

    private BigDecimal tasaAnual;

    private Integer plazoMinimoMeses;

    private Integer plazoMaximoMeses;

    private BigDecimal montoMinimo;

    private BigDecimal montoMaximo;

    private LocalDate vigenteDesde;

    private LocalDate vigenteHasta;

    private Boolean activo;

    private Short alta;
}
