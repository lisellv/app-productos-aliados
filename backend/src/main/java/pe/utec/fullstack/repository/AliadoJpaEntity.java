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

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "aliado")
public class AliadoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", columnDefinition = "tipo_documento")
    private TipoDocumento tipoDocumento;

    @Column(name = "numero_documento", nullable = false, unique = true)
    private String numeroDocumento;

    @Column(name = "razon_social", nullable = false)
    private String razonSocial;

    @Column(name = "contacto_nombre")
    private String contactoNombre;

    @Column(name = "contacto_correo", columnDefinition = "citext")
    private String contactoCorreo;

    @Column(name = "contacto_telefono")
    private String contactoTelefono;

    private String estado;

    private Short alta;

    @Column(name = "creado_at")
    private OffsetDateTime creadoAt;

    @Column(name = "actualizado_at")
    private OffsetDateTime actualizadoAt;
}
