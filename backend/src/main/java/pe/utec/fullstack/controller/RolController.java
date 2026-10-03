package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.Rol;
import pe.utec.fullstack.domain.RolService;
import pe.utec.fullstack.controller.request.CreateRolRequest;
import pe.utec.fullstack.controller.request.UpdateRolRequest;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final RolService rolService;
    private final RequestMapper mapper;

    public RolController(RolService rolService, RequestMapper mapper) {
        this.rolService = rolService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Rol> listar() {
        return this.rolService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Rol obtener(@PathVariable Integer id) {
        return this.rolService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Rol crear(@Valid @RequestBody CreateRolRequest request) {
        return this.rolService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Rol actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateRolRequest request) {
        return this.rolService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.rolService.eliminar(id);
    }
}
