package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.DerivacionBanco;

import pe.utec.fullstack.repository.DerivacionBancoRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class DerivacionBancoService {

    private final DerivacionBancoRepository derivacionBancoRepository;

    public DerivacionBancoService(DerivacionBancoRepository derivacionBancoRepository) {
        this.derivacionBancoRepository = derivacionBancoRepository;
    }
    public DerivacionBanco crear(DerivacionBanco derivacionBanco) {
        if (this.derivacionBancoRepository.existePorSolicitud(derivacionBanco.getSolicitudId())) {
            throw new IllegalArgumentException("La solicitud ya tiene una derivación bancaria registrada");
        }
        derivacionBanco.setEstadoRespuestaBanco("pendiente");
        derivacionBanco.setDerivadoAt(OffsetDateTime.now());
        derivacionBanco.setAlta((short) 1);
        return this.derivacionBancoRepository.guardar(derivacionBanco);
    }
    public DerivacionBanco obtenerPorId(Integer id) {
        return this.derivacionBancoRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Derivación bancaria no encontrada: " + id));
    }
    public List<DerivacionBanco> listar() {
        return this.derivacionBancoRepository.listarActivos();
    }
    public DerivacionBanco actualizarRespuesta(Integer id, DerivacionBanco derivacionBanco) {
        DerivacionBanco existente = this.obtenerPorId(id);
        existente.setCodigoExterno(derivacionBanco.getCodigoExterno());
        existente.setEstadoRespuestaBanco(derivacionBanco.getEstadoRespuestaBanco());
        existente.setRespuestaDetalle(derivacionBanco.getRespuestaDetalle());
        existente.setUltimaRespuestaAt(OffsetDateTime.now());
        return this.derivacionBancoRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        DerivacionBanco existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        this.derivacionBancoRepository.guardar(existente);
    }
}
