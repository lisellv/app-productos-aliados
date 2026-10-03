package pe.utec.fullstack.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

// excluye passwordHash a propósito: nunca se expone por API
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponse {

    private Integer id;

    private Integer rolId;

    private Integer aliadoId;

    private String correoElectronico;

    private Boolean activo;

    private OffsetDateTime ultimoAccesoAt;

    private OffsetDateTime creadoAt;

    private OffsetDateTime actualizadoAt;
}
