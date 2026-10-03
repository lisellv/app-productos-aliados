package pe.utec.fullstack.repository;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "campana_producto")
@IdClass(CampanaProductoId.class)
public class CampanaProductoJpaEntity {

    @Id
    @Column(name = "campana_id")
    private Integer campanaId;

    @Id
    @Column(name = "producto_id")
    private Integer productoId;

    private String beneficio;

    @Column(name = "condiciones_comerciales")
    private String condicionesComerciales;

    private Short alta;
}
