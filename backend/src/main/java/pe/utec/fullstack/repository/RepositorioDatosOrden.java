package pe.utec.fullstack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorioDatosOrden extends JpaRepository<EntidadOrden, Integer> {

    List<EntidadOrden> findAllByOrderByCreadoAtDesc();

    List<EntidadOrden> findAllByUsuarioIdOrderByCreadoAtDesc(Integer usuarioId);
}
