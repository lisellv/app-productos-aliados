package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.utec.fullstack.domain.business.EstadoSolicitud;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateHistorialSolicitudRequest {

    @NotNull
    private Integer solicitudId;

    private EstadoSolicitud estadoAnterior;

    @NotNull
    private EstadoSolicitud estadoNuevo;

    private String observacion;

    @NotNull
    private Integer usuarioId;
}
