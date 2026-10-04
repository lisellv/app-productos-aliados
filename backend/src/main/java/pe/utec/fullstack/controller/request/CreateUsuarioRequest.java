package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateUsuarioRequest {

    @NotNull
    @Positive(message = "rolId debe ser un ID válido mayor que cero.")
    private Integer rolId;

    private Integer aliadoId;

    @NotBlank
    @Email
    private String correoElectronico;

    @NotBlank
    @Size(min = 8, max = 100)
    private String password;
}
