package pe.utec.fullstack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderJpaRepository extends JpaRepository<OrderJpaEntity, Integer> {

    List<OrderJpaEntity> findAllByOrderByCreadoAtDesc();

    List<OrderJpaEntity> findAllByUsuarioIdOrderByCreadoAtDesc(Integer usuarioId);
}
