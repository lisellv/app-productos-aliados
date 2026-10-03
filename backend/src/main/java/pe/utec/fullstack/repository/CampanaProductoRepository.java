package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.CampanaProducto;


import java.util.List;
import java.util.Optional;

@Repository
public class CampanaProductoRepository {

    private final CampanaProductoJpaRepository campanaProductoJpaRepository;
    private final PersistenceMapper mapper;

    public CampanaProductoRepository(CampanaProductoJpaRepository campanaProductoJpaRepository,
                                              PersistenceMapper mapper) {
        this.campanaProductoJpaRepository = campanaProductoJpaRepository;
        this.mapper = mapper;
    }
    public CampanaProducto guardar(CampanaProducto campanaProducto) {
        return this.mapper.toDomain(
                this.campanaProductoJpaRepository.save(this.mapper.toEntity(campanaProducto))
        );
    }
    public Optional<CampanaProducto> buscarPorClave(Integer campanaId, Integer productoId) {
        return this.campanaProductoJpaRepository.findByCampanaIdAndProductoId(campanaId, productoId)
                .map(this.mapper::toDomain);
    }
    public List<CampanaProducto> listarActivos() {
        return this.campanaProductoJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
