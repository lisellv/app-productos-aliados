package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAliadoRequest {

    private String razonSocial;

    private String contactoNombre;

    @Email
    private String contactoCorreo;

    private String contactoTelefono;

    @Pattern(regexp = "^(activo|inactivo)$")
    private String estado;
}
