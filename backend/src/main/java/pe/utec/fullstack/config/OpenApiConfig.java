package pe.utec.fullstack.config;

import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_AUTH = "bearerAuth";

    @Bean
    OpenAPI applicationOpenAPI() {
        return new OpenAPI()
                .components(new Components().addSecuritySchemes(
                        BEARER_AUTH,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }

    @Bean
    GlobalOpenApiCustomizer bearerSecurityForProtectedEndpoints() {
        return openApi -> openApi.getPaths().forEach((path, pathItem) -> {
            if (path.startsWith("/api/") && !path.startsWith("/api/auth/")) {
                pathItem.readOperations().forEach(operation -> operation.addSecurityItem(
                        new SecurityRequirement().addList(BEARER_AUTH)));
            }
        });
    }
}
