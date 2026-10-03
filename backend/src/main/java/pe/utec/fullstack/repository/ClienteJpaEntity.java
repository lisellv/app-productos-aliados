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
import pe.utec.fullstack.domain.business.TipoDocumento;
import pe.utec.fullstack.domain.business.TipoPersona;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cliente")
public class ClienteJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_persona", nullable = false, columnDefinition = "tipo_persona")
    private TipoPersona tipoPersona;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false, columnDefinition = "tipo_documento")
    private TipoDocumento tipoDocumento;

    @Column(name = "numero_documento", nullable = false)
    private String numeroDocumento;

    private String nombres;

    private String apellidos;

    @Column(name = "razon_social")
    private String razonSocial;

    @Column(columnDefinition = "citext")
    private String correo;

    private String telefono;

    private Short alta;

    @Column(name = "creado_at")
    private OffsetDateTime creadoAt;

    @Column(name = "actualizado_at")
    private OffsetDateTime actualizadoAt;
}
