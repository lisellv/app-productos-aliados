package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemJpaRepository extends JpaRepository<CartItemJpaEntity, Integer> {

    List<CartItemJpaEntity> findAllByUsuarioIdOrderById(Integer usuarioId);

    Optional<CartItemJpaEntity> findByUsuarioIdAndProductoId(Integer usuarioId, Integer productoId);

    Optional<CartItemJpaEntity> findByIdAndUsuarioId(Integer id, Integer usuarioId);

    void deleteByIdAndUsuarioId(Integer id, Integer usuarioId);

    void deleteAllByUsuarioId(Integer usuarioId);
}
