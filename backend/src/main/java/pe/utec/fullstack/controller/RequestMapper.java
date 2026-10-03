package pe.utec.fullstack.controller;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import pe.utec.fullstack.controller.request.CreateAliadoRequest;
import pe.utec.fullstack.controller.request.CreateCampanaProductoRequest;
import pe.utec.fullstack.controller.request.CreateCampanaRequest;
import pe.utec.fullstack.controller.request.CreateCategoriaRequest;
import pe.utec.fullstack.controller.request.CreateClienteRequest;
import pe.utec.fullstack.controller.request.CreateDerivacionBancoRequest;
import pe.utec.fullstack.controller.request.CreateHistorialSolicitudRequest;
import pe.utec.fullstack.controller.request.CreateListaInteresRequest;
import pe.utec.fullstack.controller.request.CreateProductoFinanciamientoRequest;
import pe.utec.fullstack.controller.request.CreateProductoRequest;
import pe.utec.fullstack.controller.request.CreateReglaPrecalificacionRequest;
import pe.utec.fullstack.controller.request.CreateRolRequest;
import pe.utec.fullstack.controller.request.CreateSolicitudFinanciamientoRequest;
import pe.utec.fullstack.controller.request.CreateTipoFinanciamientoRequest;
import pe.utec.fullstack.controller.request.CreateUsuarioRequest;
import pe.utec.fullstack.controller.request.UpdateAliadoRequest;
import pe.utec.fullstack.controller.request.UpdateCampanaProductoRequest;
import pe.utec.fullstack.controller.request.UpdateCampanaRequest;
import pe.utec.fullstack.controller.request.UpdateCategoriaRequest;
import pe.utec.fullstack.controller.request.UpdateClienteRequest;
import pe.utec.fullstack.controller.request.UpdateDerivacionBancoRequest;
import pe.utec.fullstack.controller.request.UpdateProductoFinanciamientoRequest;
import pe.utec.fullstack.controller.request.UpdateProductoRequest;
import pe.utec.fullstack.controller.request.UpdateReglaPrecalificacionRequest;
import pe.utec.fullstack.controller.request.UpdateRolRequest;
import pe.utec.fullstack.controller.request.UpdateSolicitudFinanciamientoRequest;
import pe.utec.fullstack.controller.request.UpdateTipoFinanciamientoRequest;
import pe.utec.fullstack.controller.request.UpdateUsuarioRequest;
import pe.utec.fullstack.controller.request.UsuarioResponse;
import pe.utec.fullstack.domain.business.Aliado;
import pe.utec.fullstack.domain.business.Campana;
import pe.utec.fullstack.domain.business.CampanaProducto;
import pe.utec.fullstack.domain.business.Categoria;
import pe.utec.fullstack.domain.business.Cliente;
import pe.utec.fullstack.domain.business.DerivacionBanco;
import pe.utec.fullstack.domain.business.HistorialSolicitud;
import pe.utec.fullstack.domain.business.ListaInteres;
import pe.utec.fullstack.domain.business.Producto;
import pe.utec.fullstack.domain.business.ProductoFinanciamiento;
import pe.utec.fullstack.domain.business.ReglaPrecalificacion;
import pe.utec.fullstack.domain.business.Rol;
import pe.utec.fullstack.domain.business.SolicitudFinanciamiento;
import pe.utec.fullstack.domain.business.TipoFinanciamiento;
import pe.utec.fullstack.domain.business.Usuario;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RequestMapper {

    Aliado toDomain(CreateAliadoRequest request);

    Aliado toDomain(UpdateAliadoRequest request);

    CampanaProducto toDomain(CreateCampanaProductoRequest request);

    CampanaProducto toDomain(UpdateCampanaProductoRequest request);

    Campana toDomain(CreateCampanaRequest request);

    Campana toDomain(UpdateCampanaRequest request);

    Categoria toDomain(CreateCategoriaRequest request);

    Categoria toDomain(UpdateCategoriaRequest request);

    Cliente toDomain(CreateClienteRequest request);

    Cliente toDomain(UpdateClienteRequest request);

    DerivacionBanco toDomain(CreateDerivacionBancoRequest request);

    DerivacionBanco toDomain(UpdateDerivacionBancoRequest request);

    HistorialSolicitud toDomain(CreateHistorialSolicitudRequest request);

    ListaInteres toDomain(CreateListaInteresRequest request);

    ProductoFinanciamiento toDomain(CreateProductoFinanciamientoRequest request);

    ProductoFinanciamiento toDomain(UpdateProductoFinanciamientoRequest request);

    Producto toDomain(CreateProductoRequest request);

    Producto toDomain(UpdateProductoRequest request);

    ReglaPrecalificacion toDomain(CreateReglaPrecalificacionRequest request);

    ReglaPrecalificacion toDomain(UpdateReglaPrecalificacionRequest request);

    Rol toDomain(CreateRolRequest request);

    Rol toDomain(UpdateRolRequest request);

    @Mapping(target = "consentimientoAt", expression = "java(request.getConsentimiento() != null && request.getConsentimiento() ? java.time.OffsetDateTime.now() : null)")
    SolicitudFinanciamiento toDomain(CreateSolicitudFinanciamientoRequest request);

    SolicitudFinanciamiento toDomain(UpdateSolicitudFinanciamientoRequest request);

    TipoFinanciamiento toDomain(CreateTipoFinanciamientoRequest request);

    TipoFinanciamiento toDomain(UpdateTipoFinanciamientoRequest request);

    Usuario toDomain(CreateUsuarioRequest request);

    Usuario toDomain(UpdateUsuarioRequest request);

    UsuarioResponse toResponse(Usuario usuario);
}
