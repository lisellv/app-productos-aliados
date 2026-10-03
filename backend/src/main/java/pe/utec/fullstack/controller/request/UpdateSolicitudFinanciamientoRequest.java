package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.utec.fullstack.domain.business.EstadoSolicitud;
import pe.utec.fullstack.domain.business.ResultadoPrecalificacion;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateSolicitudFinanciamientoRequest {

    @NotNull
    private EstadoSolicitud estado;

    private ResultadoPrecalificacion resultadoPrecalificacion;
}
