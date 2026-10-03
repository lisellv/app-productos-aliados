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
public class Usuario {

    private Integer id;

    private Integer rolId;

    private Integer aliadoId;

    private String correoElectronico;

    private String passwordHash;

    private Boolean activo;

    private OffsetDateTime ultimoAccesoAt;

    private Short alta;

    private OffsetDateTime creadoAt;

    private OffsetDateTime actualizadoAt;
}
