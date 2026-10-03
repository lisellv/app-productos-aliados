package pe.utec.fullstack.domain.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudFinanciamiento {

    private Integer id;

    private Integer clienteId;

    private Integer productoId;

    private Integer productoFinanciamientoId;

    private Integer campanaId;

    private BigDecimal montoSolicitado;

    @Builder.Default
    private String moneda = "PEN";

    private Integer plazoMeses;

    private TipoTasaInteres tasaTipoAplicada;

    private BigDecimal tasaAnualAplicada;

    @Builder.Default
    private ResultadoPrecalificacion resultadoPrecalificacion = ResultadoPrecalificacion.pendiente;

    @Builder.Default
    private EstadoSolicitud estado = EstadoSolicitud.precalificado;

    private OffsetDateTime consentimientoAt;

    private Short alta;

    private OffsetDateTime creadoAt;

    private OffsetDateTime actualizadoAt;
}
