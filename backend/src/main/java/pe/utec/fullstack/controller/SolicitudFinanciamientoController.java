package pe.utec.fullstack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
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
import pe.utec.fullstack.controller.request.CreateSolicitudFinanciamientoRequest;
import pe.utec.fullstack.controller.request.UpdateSolicitudFinanciamientoRequest;
import pe.utec.fullstack.domain.SolicitudFinanciamientoService;
import pe.utec.fullstack.domain.business.SolicitudFinanciamiento;

@RestController
@RequestMapping("/api/solicitudes-financiamiento")
public class SolicitudFinanciamientoController {

    private final SolicitudFinanciamientoService solicitudFinanciamientoService;
    private final RequestMapper mapper;

    public SolicitudFinanciamientoController(SolicitudFinanciamientoService solicitudFinanciamientoService,
            RequestMapper mapper) {
        this.solicitudFinanciamientoService = solicitudFinanciamientoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<SolicitudFinanciamiento> listar(
            @AuthenticationPrincipal UserInfoDetails usuario,
            Authentication authentication) {
        boolean administrador = authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        return administrador
                ? this.solicitudFinanciamientoService.listar()
                : this.solicitudFinanciamientoService.listarDeUsuario(usuario.getId());
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SolicitudFinanciamiento obtener(@PathVariable Integer id) {
        return this.solicitudFinanciamientoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolicitudFinanciamiento crear(@Valid @RequestBody CreateSolicitudFinanciamientoRequest request,
            @AuthenticationPrincipal UserInfoDetails usuario) {
        return this.solicitudFinanciamientoService.crear(
                this.mapper.toDomain(request), usuario == null ? null : usuario.getId());
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SolicitudFinanciamiento actualizar(@PathVariable Integer id,
            @Valid @RequestBody UpdateSolicitudFinanciamientoRequest request) {
        return this.solicitudFinanciamientoService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.solicitudFinanciamientoService.eliminar(id);
    }
}
