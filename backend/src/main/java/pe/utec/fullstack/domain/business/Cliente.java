package pe.utec.fullstack.domain.business;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Cliente {

    private Integer id;

    private Integer usuarioId;

    private TipoPersona tipoPersona;

    private TipoDocumento tipoDocumento;

    private String numeroDocumento;

    private String nombres;

    private String apellidos;

    private String razonSocial;

    private String correo;

    private String telefono;

    private Short alta;

    private OffsetDateTime creadoAt;

    private OffsetDateTime actualizadoAt;
}
