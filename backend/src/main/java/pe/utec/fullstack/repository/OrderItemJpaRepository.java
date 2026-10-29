package pe.utec.fullstack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemJpaRepository extends JpaRepository<OrderItemJpaEntity, Integer> {

    List<OrderItemJpaEntity> findAllByOrderIdOrderById(Integer orderId);

    List<OrderItemJpaEntity> findAllByOrderIdInOrderByOrderId(List<Integer> orderIds);
}
