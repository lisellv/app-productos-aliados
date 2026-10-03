package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateDerivacionBancoRequest {

    private String codigoExterno;

    @NotBlank
    @Pattern(regexp = "^(pendiente|aprobado|rechazado|error)$")
    private String estadoRespuestaBanco;

    private String respuestaDetalle;
}
