package pe.utec.fullstack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import pe.utec.fullstack.controller.auth.UserInfoDetails;
import pe.utec.fullstack.controller.request.CreateAliadoRequest;
import pe.utec.fullstack.controller.request.CreateProductoRequest;
import pe.utec.fullstack.controller.request.UpdateAliadoRequest;
import pe.utec.fullstack.controller.request.UpdateProductoRequest;
import pe.utec.fullstack.controller.response.AliadoCatalogoResponse;
import pe.utec.fullstack.domain.AliadoService;
import pe.utec.fullstack.domain.ProductoService;
import pe.utec.fullstack.domain.UsuarioService;
import pe.utec.fullstack.domain.business.Aliado;
import pe.utec.fullstack.domain.business.Producto;
import pe.utec.fullstack.domain.business.Usuario;

@RestController
@RequestMapping("/api/aliados")
public class AliadoController {

    private final AliadoService aliadoService;
    private final UsuarioService usuarioService;
    private final ProductoService productoService;
    private final RequestMapper mapper;

    public AliadoController(AliadoService aliadoService, UsuarioService usuarioService,
            ProductoService productoService, RequestMapper mapper) {
        this.aliadoService = aliadoService;
        this.usuarioService = usuarioService;
        this.productoService = productoService;
        this.mapper = mapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Aliado> listar() {
        return this.aliadoService.listar();
    }

    @GetMapping("/catalogo")
    @ResponseStatus(HttpStatus.OK)
    public List<AliadoCatalogoResponse> listarCatalogo() {
        return this.aliadoService.listar().stream()
                .map(aliado -> new AliadoCatalogoResponse(aliado.getId(), aliado.getRazonSocial()))
                .toList();
    }

    @GetMapping("/mi-perfil")
    @ResponseStatus(HttpStatus.OK)
    public Aliado obtenerMiPerfil(Authentication autenticacion) {
        return this.aliadoService.obtenerPorId(obtenerAliadoId(autenticacion));
    }

    @GetMapping("/mi-perfil/productos")
    @ResponseStatus(HttpStatus.OK)
    public List<Producto> listarMisProductos(Authentication autenticacion) {
        return this.productoService.listarPorAliado(obtenerAliadoId(autenticacion));
    }

    @PostMapping("/mi-perfil/productos")
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crearMiProducto(@Valid @RequestBody CreateProductoRequest request,
            Authentication autenticacion) {
        Producto producto = this.mapper.toDomain(request);
        producto.setAliadoId(obtenerAliadoId(autenticacion));
        return this.productoService.crear(producto);
    }

    @PutMapping("/mi-perfil/productos/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Producto actualizarMiProducto(@PathVariable Integer id,
            @Valid @RequestBody UpdateProductoRequest request, Authentication autenticacion) {
        return this.productoService.actualizarPorAliado(id, obtenerAliadoId(autenticacion),
                this.mapper.toDomain(request));
    }

    @DeleteMapping("/mi-perfil/productos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarMiProducto(@PathVariable Integer id, Authentication autenticacion) {
        this.productoService.eliminarPorAliado(id, obtenerAliadoId(autenticacion));
    }

    private Integer obtenerAliadoId(Authentication autenticacion) {
        if (!(autenticacion.getPrincipal() instanceof UserInfoDetails detallesUsuario)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "La cuenta no tiene un aliado asociado.");
        }
        Usuario usuario = this.usuarioService.obtenerPorId(detallesUsuario.getId());
        if (usuario.getAliadoId() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "La cuenta no tiene un aliado asociado.");
        }
        return usuario.getAliadoId();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Aliado obtener(@PathVariable Integer id) {
        return this.aliadoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Aliado crear(@Valid @RequestBody CreateAliadoRequest request) {
        return this.aliadoService.crear(this.mapper.toDomain(request));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Aliado actualizar(@PathVariable Integer id, @Valid @RequestBody UpdateAliadoRequest request) {
        return this.aliadoService.actualizar(id, this.mapper.toDomain(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        this.aliadoService.eliminar(id);
    }
}
