package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.UsuarioService;
import pe.utec.fullstack.controller.request.CreateUsuarioRequest;
import pe.utec.fullstack.controller.request.UpdateUsuarioRequest;
import pe.utec.fullstack.controller.request.UsuarioResponse;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
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
                this.usuarioService.crear(this.mapper.toDomain(request), request.getPassword())
        );
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResponse actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateUsuarioRequest request) {
        return this.mapper.toResponse(
                this.usuarioService.actualizar(id, this.mapper.toDomain(request), request.getPassword())
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.usuarioService.eliminar(id);
    }
}
