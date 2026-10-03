package pe.utec.fullstack.domain.business;

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
public class Campana {

    private Integer id;

    private String nombre;

    private String descripcion;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private String estado;

    private Integer creadoPorId;

    private Short alta;

    private OffsetDateTime creadoAt;

    private OffsetDateTime actualizadoAt;
}
