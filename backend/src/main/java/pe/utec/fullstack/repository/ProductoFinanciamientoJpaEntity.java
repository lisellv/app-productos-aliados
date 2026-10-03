package pe.utec.fullstack.repository;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.utec.fullstack.domain.business.TipoTasaInteres;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "producto_financiamiento")
public class ProductoFinanciamientoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "producto_id", nullable = false)
    private Integer productoId;

    @Column(name = "tipo_financiamiento_id", nullable = false)
    private Integer tipoFinanciamientoId;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_tasa", nullable = false, columnDefinition = "tipo_tasa_interes")
    private TipoTasaInteres tipoTasa;

    @Column(name = "tasa_anual")
    private BigDecimal tasaAnual;

    @Column(name = "plazo_minimo_meses")
    private Integer plazoMinimoMeses;

    @Column(name = "plazo_maximo_meses")
    private Integer plazoMaximoMeses;

    @Column(name = "monto_minimo")
    private BigDecimal montoMinimo;

    @Column(name = "monto_maximo")
    private BigDecimal montoMaximo;

    @Column(name = "vigente_desde")
    private LocalDate vigenteDesde;

    @Column(name = "vigente_hasta")
    private LocalDate vigenteHasta;

    private Boolean activo;

    private Short alta;
}
