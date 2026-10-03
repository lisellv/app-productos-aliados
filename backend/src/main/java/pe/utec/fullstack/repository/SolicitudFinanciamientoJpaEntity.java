package pe.utec.fullstack.repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.utec.fullstack.domain.business.EstadoSolicitud;
import pe.utec.fullstack.domain.business.ResultadoPrecalificacion;
import pe.utec.fullstack.domain.business.TipoTasaInteres;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "solicitud_financiamiento")
public class SolicitudFinanciamientoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cliente_id", nullable = false)
    private Integer clienteId;

    @Column(name = "producto_id", nullable = false)
    private Integer productoId;

    @Column(name = "producto_financiamiento_id", nullable = false)
    private Integer productoFinanciamientoId;

    @Column(name = "campana_id")
    private Integer campanaId;

    @Column(name = "monto_solicitado")
    private BigDecimal montoSolicitado;

    private String moneda;

    @Column(name = "plazo_meses")
    private Integer plazoMeses;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "tasa_tipo_aplicada", nullable = false, columnDefinition = "tipo_tasa_interes")
    private TipoTasaInteres tasaTipoAplicada;

    @Column(name = "tasa_anual_aplicada")
    private BigDecimal tasaAnualAplicada;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_precalificacion", nullable = false, columnDefinition = "resultado_precalificacion")
    private ResultadoPrecalificacion resultadoPrecalificacion;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "estado_solicitud")
    private EstadoSolicitud estado;

    @Column(name = "consentimiento_at", nullable = false)
    private OffsetDateTime consentimientoAt;

    private Short alta;

    @Column(name = "creado_at")
    private OffsetDateTime creadoAt;

    @Column(name = "actualizado_at")
    private OffsetDateTime actualizadoAt;
}
