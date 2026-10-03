package pe.utec.fullstack.domain.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Cliente {

    private Integer id;

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
