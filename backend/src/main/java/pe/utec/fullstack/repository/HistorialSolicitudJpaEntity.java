package pe.utec.fullstack.repository;

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

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "historial_solicitud")
public class HistorialSolicitudJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "solicitud_id", nullable = false)
    private Integer solicitudId;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior", columnDefinition = "estado_solicitud")
    private EstadoSolicitud estadoAnterior;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false, columnDefinition = "estado_solicitud")
    private EstadoSolicitud estadoNuevo;

    private String observacion;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @Column(name = "creado_at")
    private OffsetDateTime creadoAt;

    private Short alta;
}
