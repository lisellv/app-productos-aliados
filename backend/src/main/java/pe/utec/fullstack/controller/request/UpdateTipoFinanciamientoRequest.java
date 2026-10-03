package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTipoFinanciamientoRequest {

    @NotBlank
    private String nombre;

    private String descripcion;

    private Boolean activo;
}
