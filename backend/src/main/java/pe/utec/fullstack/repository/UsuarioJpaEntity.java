package pe.utec.fullstack.repository;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuario")
public class UsuarioJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "rol_id", nullable = false)
    private Integer rolId;

    @Column(name = "aliado_id")
    private Integer aliadoId;

    @Column(name = "correo_electronico", nullable = false, unique = true, columnDefinition = "citext")
    private String correoElectronico;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private Boolean activo;

    @Column(name = "ultimo_acceso_at")
    private OffsetDateTime ultimoAccesoAt;

    private Short alta;

    @Column(name = "creado_at")
    private OffsetDateTime creadoAt;

    @Column(name = "actualizado_at")
    private OffsetDateTime actualizadoAt;
}
