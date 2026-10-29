package pe.utec.fullstack.domain;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import pe.utec.fullstack.domain.business.Cliente;
import pe.utec.fullstack.domain.business.TipoDocumento;
import pe.utec.fullstack.domain.business.TipoPersona;
import pe.utec.fullstack.repository.ClienteRepository;

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

    public Cliente registrarOEncontrar(Cliente cliente) {
        return this.registrarOEncontrar(cliente, null);
    }

    public Cliente registrarOEncontrar(Cliente cliente, Integer usuarioId) {
        this.validarConsistenciaPersona(cliente);
        Optional<Cliente> perfilUsuario = usuarioId == null
                ? Optional.empty()
                : this.clienteRepository.buscarPorUsuarioId(usuarioId);
        if (perfilUsuario.isPresent()) {
            return perfilUsuario.get();
        }

        var existente = this.clienteRepository.buscarPorDocumento(
                cliente.getTipoDocumento(), cliente.getNumeroDocumento());
        if (existente.isPresent()) {
            Cliente clienteExistente = existente.get();
            if (!Objects.equals(clienteExistente.getAlta(), (short) 1)) {
                throw new IllegalArgumentException("El cliente asociado a este documento está inactivo");
            }
            if (usuarioId != null && clienteExistente.getUsuarioId() != null
                    && !Objects.equals(clienteExistente.getUsuarioId(), usuarioId)) {
                throw new IllegalArgumentException("Este documento ya está asociado a otra cuenta");
            }
            if (usuarioId != null && clienteExistente.getUsuarioId() == null) {
                clienteExistente.setUsuarioId(usuarioId);
                clienteExistente.setActualizadoAt(OffsetDateTime.now());
                return this.clienteRepository.guardar(clienteExistente);
            }
            return clienteExistente;
        }
        cliente.setUsuarioId(usuarioId);
        return this.crear(cliente);
    }

    public Optional<Cliente> buscarPorUsuarioId(Integer usuarioId) {
        return this.clienteRepository.buscarPorUsuarioId(usuarioId);
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
