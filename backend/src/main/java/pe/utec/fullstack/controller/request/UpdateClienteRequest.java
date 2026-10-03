package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.utec.fullstack.domain.business.TipoDocumento;
import pe.utec.fullstack.domain.business.TipoPersona;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateClienteRequest {

    @NotNull
    private TipoPersona tipoPersona;

    @NotNull
    private TipoDocumento tipoDocumento;

    @NotNull
    private String numeroDocumento;

    private String nombres;

    private String apellidos;

    private String razonSocial;

    @Email
    private String correo;

    private String telefono;
}
