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
public class Aliado {

    private Integer id;

    @Builder.Default
    private TipoDocumento tipoDocumento = TipoDocumento.RUC;

    private String numeroDocumento;

    private String razonSocial;

    private String contactoNombre;

    private String contactoCorreo;

    private String contactoTelefono;

    private String estado;

    private Short alta;

    private OffsetDateTime creadoAt;

    private OffsetDateTime actualizadoAt;
}
