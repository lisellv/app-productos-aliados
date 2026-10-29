package pe.utec.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioDatosListaInteres extends JpaRepository<EntidadListaInteres, Integer> {

    List<EntidadListaInteres> findByAlta(Short alta);

    boolean existsByClienteIdAndProductoId(Integer clienteId, Integer productoId);
}
