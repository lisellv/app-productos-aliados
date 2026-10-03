package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.Email;
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
public class CreateAliadoRequest {

    @NotBlank
    @Pattern(regexp = "^[0-9]{11}$", message = "debe tener 11 dígitos")
    private String numeroDocumento;

    @NotBlank
    private String razonSocial;

    private String contactoNombre;

    @Email
    private String contactoCorreo;

    private String contactoTelefono;
}
