package pe.utec.fullstack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import pe.utec.fullstack.domain.business.Producto;

@Repository
public class ProductoRepository {

    private final RepositorioDatosProducto productoJpaRepository;
    private final PersistenceMapper mapper;

    public ProductoRepository(RepositorioDatosProducto productoJpaRepository, PersistenceMapper mapper) {
        this.productoJpaRepository = productoJpaRepository;
        this.mapper = mapper;
    }

    public Producto guardar(Producto producto) {
        return this.mapper.toDomain(
                this.productoJpaRepository.saveAndFlush(this.mapper.toEntity(producto)));
    }

    public Optional<Producto> buscarPorId(Integer id) {
        return this.productoJpaRepository.findById(id).map(this.mapper::toDomain);
    }

    public Optional<Producto> buscarPorIdYAliado(Integer id, Integer aliadoId) {
        return this.productoJpaRepository.findByIdAndAliadoIdAndAlta(id, aliadoId, (short) 1)
                .map(this.mapper::toDomain);
    }

    public List<Producto> buscarActivosPorIds(List<Integer> ids) {
        if (ids.isEmpty())
            return List.of();
        return this.productoJpaRepository.findAllByIdInAndAltaAndEstado(ids, (short) 1, "activo").stream()
                .map(this.mapper::toDomain)
                .toList();
    }

    public List<Producto> listarActivos() {
        return this.productoJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }

    public List<Producto> listarPorAliado(Integer aliadoId) {
        return this.productoJpaRepository.findByAliadoIdAndAlta(aliadoId, (short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
