package pe.utec.fullstack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioDatosArticuloOrden extends JpaRepository<EntidadArticuloOrden, Integer> {

    List<EntidadArticuloOrden> findAllByOrderIdOrderById(Integer orderId);

    List<EntidadArticuloOrden> findAllByOrderIdInOrderByOrderId(List<Integer> orderIds);
}
