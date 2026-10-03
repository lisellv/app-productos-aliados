package pe.utec.fullstack.repository;

import jakarta.persistence.*;
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
@Entity
@Table(name = "producto")
public class ProductoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "aliado_id", nullable = false)
    private Integer aliadoId;

    @Column(name = "categoria_id")
    private Integer categoriaId;

    private String nombre;

    private String descripcion;

    @Column(name = "precio_lista")
    private BigDecimal precioLista;

    private String moneda;

    @Column(name = "incluye_igv")
    private Boolean incluyeIgv;

    @Column(name = "imagen_url")
    private String imagenUrl;

    private String estado;

    private Short alta;

    @Column(name = "creado_at")
    private OffsetDateTime creadoAt;

    @Column(name = "actualizado_at")
    private OffsetDateTime actualizadoAt;
}
