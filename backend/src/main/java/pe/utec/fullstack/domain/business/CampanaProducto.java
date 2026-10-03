package pe.utec.fullstack.domain.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CampanaProducto {

    private Integer campanaId;

    private Integer productoId;

    private String beneficio;

    private String condicionesComerciales;

    private Short alta;
}
