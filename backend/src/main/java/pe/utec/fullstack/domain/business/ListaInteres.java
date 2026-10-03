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
public class ListaInteres {

    private Integer id;

    private Integer clienteId;

    private Integer productoId;

    private OffsetDateTime creadoAt;

    private Short alta;
}
