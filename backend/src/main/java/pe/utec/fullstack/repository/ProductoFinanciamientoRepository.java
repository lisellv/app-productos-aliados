package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.ProductoFinanciamiento;


import java.util.List;
import java.util.Optional;

@Repository
public class ProductoFinanciamientoRepository {

    private final ProductoFinanciamientoJpaRepository productoFinanciamientoJpaRepository;
    private final PersistenceMapper mapper;

    public ProductoFinanciamientoRepository(ProductoFinanciamientoJpaRepository productoFinanciamientoJpaRepository,
                                                     PersistenceMapper mapper) {
        this.productoFinanciamientoJpaRepository = productoFinanciamientoJpaRepository;
        this.mapper = mapper;
    }
    public ProductoFinanciamiento guardar(ProductoFinanciamiento productoFinanciamiento) {
        return this.mapper.toDomain(
                this.productoFinanciamientoJpaRepository.saveAndFlush(this.mapper.toEntity(productoFinanciamiento))
        );
    }
    public Optional<ProductoFinanciamiento> buscarPorId(Integer id) {
        return this.productoFinanciamientoJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<ProductoFinanciamiento> listarActivos() {
        return this.productoFinanciamientoJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
