package pe.utec.fullstack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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
import pe.utec.fullstack.controller.request.CreateUsuarioRequest;
import pe.utec.fullstack.controller.request.UpdateUsuarioRequest;
import pe.utec.fullstack.controller.request.UsuarioResponse;
import pe.utec.fullstack.domain.UsuarioService;

@RestController
@RequestMapping({ "/api/usuarios", "/api/users" })
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final RequestMapper mapper;

    public UsuarioController(UsuarioService usuarioService, RequestMapper mapper) {
        this.usuarioService = usuarioService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UsuarioResponse> listar() {
        return this.usuarioService.listar().stream()
                .map(this.mapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResponse obtener(@PathVariable Integer id) {
        return this.mapper.toResponse(this.usuarioService.obtenerPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crear(@Valid @RequestBody CreateUsuarioRequest request) {
        return this.mapper.toResponse(
                this.usuarioService.crear(this.mapper.toDomain(request), request.getPassword()));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResponse actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateUsuarioRequest request) {
        return this.mapper.toResponse(
                this.usuarioService.actualizar(id, this.mapper.toDomain(request), request.getPassword()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.usuarioService.eliminar(id);
    }
}
