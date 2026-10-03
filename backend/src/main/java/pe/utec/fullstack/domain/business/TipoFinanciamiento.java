package pe.utec.fullstack.domain.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TipoFinanciamiento {

    private Integer id;

    private String codigo;

    private String nombre;

    private String descripcion;

    private Boolean activo;

    private Short alta;
}
