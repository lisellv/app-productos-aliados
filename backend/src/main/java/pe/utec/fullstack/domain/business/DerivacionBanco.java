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
public class DerivacionBanco {

    private Integer id;

    private Integer solicitudId;

    private String codigoExterno;

    private OffsetDateTime derivadoAt;

    @Builder.Default
    private String estadoRespuestaBanco = "pendiente";

    private OffsetDateTime ultimaRespuestaAt;

    private String respuestaDetalle;

    private Short alta;
}
