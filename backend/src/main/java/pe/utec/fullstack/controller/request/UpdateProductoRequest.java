package pe.utec.fullstack.controller.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProductoRequest {

    private Integer categoriaId;

    @NotBlank
    private String nombre;

    private String descripcion;

    @NotNull
    @DecimalMin(value = "0", inclusive = true)
    private BigDecimal precioLista;

    private Boolean incluyeIgv;

    private String imagenUrl;

    @Pattern(regexp = "^(activo|inactivo)$")
    private String estado;
}
