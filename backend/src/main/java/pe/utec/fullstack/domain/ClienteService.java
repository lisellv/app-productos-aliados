package pe.utec.fullstack.domain;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import pe.utec.fullstack.domain.business.Cliente;
import pe.utec.fullstack.domain.business.TipoDocumento;
import pe.utec.fullstack.domain.business.TipoPersona;

import pe.utec.fullstack.repository.ClienteRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Service
public class ClienteService {

    private static final Set<TipoDocumento> DOCUMENTOS_PERSONA_NATURAL = Set.of(
            TipoDocumento.DNI, TipoDocumento.CE, TipoDocumento.PASAPORTE);

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    public Cliente crear(Cliente cliente) {
        this.validarConsistenciaPersona(cliente);
        cliente.setAlta((short) 1);
        cliente.setCreadoAt(OffsetDateTime.now());
        cliente.setActualizadoAt(OffsetDateTime.now());
        return this.clienteRepository.guardar(cliente);
    }
    public Cliente obtenerPorId(Integer id) {
        return this.clienteRepository.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado: " + id));
    }
    public List<Cliente> listar() {
        return this.clienteRepository.listarActivos();
    }
    public Cliente actualizar(Integer id, Cliente cliente) {
        Cliente existente = this.obtenerPorId(id);
        existente.setTipoPersona(cliente.getTipoPersona());
        existente.setTipoDocumento(cliente.getTipoDocumento());
        existente.setNumeroDocumento(cliente.getNumeroDocumento());
        existente.setNombres(cliente.getNombres());
        existente.setApellidos(cliente.getApellidos());
        existente.setRazonSocial(cliente.getRazonSocial());
        existente.setCorreo(cliente.getCorreo());
        existente.setTelefono(cliente.getTelefono());
        this.validarConsistenciaPersona(existente);
        existente.setActualizadoAt(OffsetDateTime.now());
        return this.clienteRepository.guardar(existente);
    }
    public void eliminar(Integer id) {
        Cliente existente = this.obtenerPorId(id);
        existente.setAlta((short) 0);
        existente.setActualizadoAt(OffsetDateTime.now());
        this.clienteRepository.guardar(existente);
    }

    private void validarConsistenciaPersona(Cliente cliente) {
        if (cliente.getTipoPersona() == TipoPersona.NATURAL) {
            if (!DOCUMENTOS_PERSONA_NATURAL.contains(cliente.getTipoDocumento())
                    || cliente.getNombres() == null || cliente.getApellidos() == null
                    || cliente.getRazonSocial() != null) {
                throw new IllegalArgumentException(
                        "Persona NATURAL requiere DNI/CE/PASAPORTE, nombres y apellidos, y no debe tener razón social");
            }
        } else if (cliente.getTipoPersona() == TipoPersona.JURIDICA) {
            if (cliente.getTipoDocumento() != TipoDocumento.RUC
                    || cliente.getNumeroDocumento() == null || !cliente.getNumeroDocumento().matches("^[0-9]{11}$")
                    || cliente.getRazonSocial() == null
                    || cliente.getNombres() != null || cliente.getApellidos() != null) {
                throw new IllegalArgumentException(
                        "Persona JURIDICA requiere RUC de 11 dígitos y razón social, y no debe tener nombres/apellidos");
            }
        }
    }
}
