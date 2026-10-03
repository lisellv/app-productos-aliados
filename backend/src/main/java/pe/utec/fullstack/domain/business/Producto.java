package pe.utec.fullstack.domain.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Producto {

    private Integer id;

    private Integer aliadoId;

    private Integer categoriaId;

    private String nombre;

    private String descripcion;

    private BigDecimal precioLista;

    @Builder.Default
    private String moneda = "PEN";

    private Boolean incluyeIgv;

    private String imagenUrl;

    private String estado;

    private Short alta;

    private OffsetDateTime creadoAt;

    private OffsetDateTime actualizadoAt;
}
