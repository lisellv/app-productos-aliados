package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUsuarioRequest {

    @NotNull
    private Integer rolId;

    private Integer aliadoId;

    @Email
    private String correoElectronico;

    private Boolean activo;

    @Size(min = 8, max = 100)
    private String password;
}
