package pe.utec.fullstack.domain.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HistorialSolicitud {

    private Integer id;

    private Integer solicitudId;

    private EstadoSolicitud estadoAnterior;

    private EstadoSolicitud estadoNuevo;

    private String observacion;

    private Integer usuarioId;

    private OffsetDateTime creadoAt;

    private Short alta;
}
