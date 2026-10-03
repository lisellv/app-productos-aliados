package pe.utec.fullstack.repository;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "regla_precalificacion")
public class ReglaPrecalificacionJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "campana_id", nullable = false)
    private Integer campanaId;

    @Column(name = "edad_minima")
    private Integer edadMinima;

    @Column(name = "edad_maxima")
    private Integer edadMaxima;

    @Column(name = "ingreso_minimo")
    private BigDecimal ingresoMinimo;

    @Column(name = "monto_minimo")
    private BigDecimal montoMinimo;

    @Column(name = "monto_maximo")
    private BigDecimal montoMaximo;

    @Column(name = "plazo_minimo_meses")
    private Integer plazoMinimoMeses;

    @Column(name = "plazo_maximo_meses")
    private Integer plazoMaximoMeses;

    private Boolean activo;

    private Short alta;
}
