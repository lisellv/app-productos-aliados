package pe.utec.fullstack.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCampanaProductoRequest {

    private String beneficio;

    private String condicionesComerciales;
}
