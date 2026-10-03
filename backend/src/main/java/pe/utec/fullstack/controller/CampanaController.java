package pe.utec.fullstack.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pe.utec.fullstack.domain.business.Campana;
import pe.utec.fullstack.domain.CampanaService;
import pe.utec.fullstack.controller.request.CreateCampanaRequest;
import pe.utec.fullstack.controller.request.UpdateCampanaRequest;
import pe.utec.fullstack.controller.auth.UserInfoDetails;

import java.util.List;

@RestController
@RequestMapping("/api/campanas")
public class CampanaController {

    private final CampanaService campanaService;
    private final RequestMapper mapper;

    public CampanaController(CampanaService campanaService, RequestMapper mapper) {
        this.campanaService = campanaService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Campana> listar() {
        return this.campanaService.listar();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Campana obtener(@PathVariable Integer id) {
        return this.campanaService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Campana crear(@Valid @RequestBody CreateCampanaRequest request,
            @AuthenticationPrincipal UserInfoDetails userDetails) {
        return this.campanaService.crear(this.mapper.toDomain(request), userDetails.getId());
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Campana actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateCampanaRequest request) {
        return this.campanaService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.campanaService.eliminar(id);
    }
}
