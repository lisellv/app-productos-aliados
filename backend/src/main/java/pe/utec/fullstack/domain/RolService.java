package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.Rol;

import pe.utec.fullstack.repository.RolRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }
    public Rol crear(Rol rol) {
        rol.setAlta((short) 1);
        rol.setCreadoAt(OffsetDateTime.now());
        return this.rolRepository.guardar(rol);
    }
    public Rol obtenerPorId(Integer id) {
        return this.rolRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado: " + id));
    }
    public List<Rol> listar() {
        return this.rolRepository.listarActivos();
    }
    public Rol actualizar(Integer id, Rol rol) {
        Rol existente = this.obtenerPorId(id);
        existente.setNombreRol(rol.getNombreRol());
        return this.rolRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        Rol existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        this.rolRepository.guardar(existente);
    }
}
