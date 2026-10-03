package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.Cliente;
import pe.utec.fullstack.domain.ClienteService;
import pe.utec.fullstack.controller.request.CreateClienteRequest;
import pe.utec.fullstack.controller.request.UpdateClienteRequest;

import java.util.List;

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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cliente crear(@Valid @RequestBody CreateClienteRequest request) {
        return this.clienteService.crear(this.mapper.toDomain(request));
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
