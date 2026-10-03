package pe.utec.fullstack.repository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CampanaProductoId implements Serializable {

    private Integer campanaId;

    private Integer productoId;
}
