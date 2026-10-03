package pe.utec.fullstack.repository;

import org.springframework.stereotype.Repository;
import pe.utec.fullstack.domain.business.Campana;


import java.util.List;
import java.util.Optional;

@Repository
public class CampanaRepository {

    private final CampanaJpaRepository campanaJpaRepository;
    private final PersistenceMapper mapper;

    public CampanaRepository(CampanaJpaRepository campanaJpaRepository, PersistenceMapper mapper) {
        this.campanaJpaRepository = campanaJpaRepository;
        this.mapper = mapper;
    }
    public Campana guardar(Campana campana) {
        return this.mapper.toDomain(
                this.campanaJpaRepository.saveAndFlush(this.mapper.toEntity(campana))
        );
    }
    public Optional<Campana> buscarPorId(Integer id) {
        return this.campanaJpaRepository.findById(id).map(this.mapper::toDomain);
    }
    public List<Campana> listarActivas() {
        return this.campanaJpaRepository.findByAlta((short) 1).stream()
                .map(this.mapper::toDomain)
                .toList();
    }
}
