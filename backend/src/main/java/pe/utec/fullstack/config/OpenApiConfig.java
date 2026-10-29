package pe.utec.fullstack.config;

import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    private static final String ESQUEMA_AUTORIZACION = "bearerAuth";

    @Bean
    OpenAPI applicationOpenAPI() {
        return new OpenAPI()
                .components(new Components().addSecuritySchemes(
                        ESQUEMA_AUTORIZACION,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }

    @Bean
    GlobalOpenApiCustomizer bearerSecurityForProtectedEndpoints() {
        return documentoApi -> documentoApi.getPaths().forEach((ruta, elementoRuta) -> {
            if (ruta.startsWith("/api/") && !ruta.startsWith("/api/auth/")) {
                elementoRuta.readOperationsMap().forEach((metodoHttp, operacion) -> {
                    boolean lecturaPublicaCatalogo = metodoHttp == PathItem.HttpMethod.GET
                            && (ruta.startsWith("/api/productos") || ruta.startsWith("/api/categorias"));
                    if (!lecturaPublicaCatalogo) {
                        operacion.addSecurityItem(new SecurityRequirement().addList(ESQUEMA_AUTORIZACION));
                    }
                });
            }
        });
    }
}
