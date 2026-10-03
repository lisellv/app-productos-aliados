package pe.utec.fullstack.repository;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "derivacion_banco")
public class DerivacionBancoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "solicitud_id", nullable = false, unique = true)
    private Integer solicitudId;

    @Column(name = "codigo_externo", unique = true)
    private String codigoExterno;

    @Column(name = "derivado_at")
    private OffsetDateTime derivadoAt;

    @Column(name = "estado_respuesta_banco")
    private String estadoRespuestaBanco;

    @Column(name = "ultima_respuesta_at")
    private OffsetDateTime ultimaRespuestaAt;

    @Column(name = "respuesta_detalle")
    private String respuestaDetalle;

    private Short alta;
}
