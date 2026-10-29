package pe.utec.fullstack.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pe.utec.fullstack.controller.auth.UserInfoDetails;
import pe.utec.fullstack.controller.request.CreateClienteRequest;
import pe.utec.fullstack.controller.request.UpdateClienteRequest;
import pe.utec.fullstack.domain.ClienteService;
import pe.utec.fullstack.domain.business.Cliente;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final RequestMapper mapper;

    public ClienteController(ClienteService clienteService, RequestMapper mapper) {
        this.clienteService = clienteService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Cliente> listar() {
        return this.clienteService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Cliente obtener(@PathVariable Integer id) {
        return this.clienteService.obtenerPorId(id);
    }

    @GetMapping("/mi-perfil")
    public ResponseEntity<Cliente> obtenerMiPerfil(@AuthenticationPrincipal UserInfoDetails usuario) {
        return this.clienteService.buscarPorUsuarioId(usuario.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cliente crear(@Valid @RequestBody CreateClienteRequest request) {
        return this.clienteService.crear(this.mapper.toDomain(request));
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Integer> registrar(@Valid @RequestBody CreateClienteRequest request,
            @AuthenticationPrincipal UserInfoDetails usuario) {
        Cliente cliente = this.clienteService.registrarOEncontrar(
                this.mapper.toDomain(request), usuario == null ? null : usuario.getId());
        return Map.of("clienteId", cliente.getId());
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Cliente actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateClienteRequest request) {
        return this.clienteService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.clienteService.eliminar(id);
    }
}
