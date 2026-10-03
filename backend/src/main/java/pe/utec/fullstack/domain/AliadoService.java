package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.Aliado;

import pe.utec.fullstack.repository.AliadoRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class AliadoService {

    private final AliadoRepository aliadoRepository;

    public AliadoService(AliadoRepository aliadoRepository) {
        this.aliadoRepository = aliadoRepository;
    }
    public Aliado crear(Aliado aliado) {
        aliado.setEstado("activo");
        aliado.setAlta((short) 1);
        aliado.setCreadoAt(OffsetDateTime.now());
        aliado.setActualizadoAt(OffsetDateTime.now());
        return this.aliadoRepository.guardar(aliado);
    }
    public Aliado obtenerPorId(Integer id) {
        return this.aliadoRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Aliado no encontrado: " + id));
    }
    public List<Aliado> listar() {
        return this.aliadoRepository.listarActivos();
    }
    public Aliado actualizar(Integer id, Aliado aliado) {
        Aliado existente = this.obtenerPorId(id);
        existente.setRazonSocial(aliado.getRazonSocial());
        existente.setContactoNombre(aliado.getContactoNombre());
        existente.setContactoCorreo(aliado.getContactoCorreo());
        existente.setContactoTelefono(aliado.getContactoTelefono());
        if (aliado.getEstado() != null) {
            existente.setEstado(aliado.getEstado());
        }
        existente.setActualizadoAt(OffsetDateTime.now());
        return this.aliadoRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        Aliado existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setActualizadoAt(OffsetDateTime.now());
        this.aliadoRepository.guardar(existente);
    }
}
