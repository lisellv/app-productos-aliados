package pe.utec.fullstack.repository;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "campana")
public class CampanaJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    private String descripcion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    private String estado;

    @Column(name = "creado_por_id", nullable = false)
    private Integer creadoPorId;

    private Short alta;

    @Column(name = "creado_at")
    private OffsetDateTime creadoAt;

    @Column(name = "actualizado_at")
    private OffsetDateTime actualizadoAt;
}
