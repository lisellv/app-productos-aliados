package pe.utec.fullstack;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import pe.utec.fullstack.config.JwtService;
import pe.utec.fullstack.repository.EntidadRol;
import pe.utec.fullstack.repository.EntidadUsuario;
import pe.utec.fullstack.repository.RepositorioDatosRol;
import pe.utec.fullstack.repository.RepositorioDatosUsuario;

@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
class FullstackApplicationTests {
	@Autowired
	MockMvc mockMvc;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	RepositorioDatosRol rolRepository;

	@Autowired
	RepositorioDatosUsuario usuarioRepository;

	@Autowired
	JwtService jwtService;

	@Container
	static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

	@DynamicPropertySource
	static void configureDataSource(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", postgres::getJdbcUrl);
		registry.add("spring.datasource.username", postgres::getUsername);
		registry.add("spring.datasource.password", postgres::getPassword);
	}

	@Test
	void contextLoads() {
	}

	@Test
	void loginRejectsInvalidCredentialsWithUnauthorized() throws Exception {
		mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
				.post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"userName\":\"missing-user\",\"password\":\"wrong-password\"}"))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isUnauthorized())
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.code")
						.value("AUTH_01"));
	}

	@Test
	void loginReturnsJwtForValidCredentials() throws Exception {
		var now = OffsetDateTime.now();
		var role = rolRepository.saveAndFlush(EntidadRol.builder()
				.nombreRol("AUTH_TEST_ADMIN")
				.alta((short) 1)
				.creadoAt(now)
				.build());
		usuarioRepository.saveAndFlush(EntidadUsuario.builder()
				.rolId(role.getId())
				.correoElectronico("login-test@example.invalid")
				.passwordHash(passwordEncoder.encode("test-password"))
				.activo(true)
				.alta((short) 1)
				.creadoAt(now)
				.actualizadoAt(now)
				.build());

		var token = mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
				.post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"login-test@example.invalid\",\"password\":\"test-password\"}"))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
				.andExpect(
						org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.token").exists())
				.andReturn()
				.getResponse()
				.getContentAsString();

		var jwt = new com.fasterxml.jackson.databind.ObjectMapper().readTree(token).get("token").asText();
		org.junit.jupiter.api.Assertions.assertEquals(3, jwt.split("\\.").length);
	}

	@Test
	void publicRegistrationCreatesOnlyAUserAccount() throws Exception {
		String correoElectronico = "registro-" + UUID.randomUUID() + "@example.invalid";
		String password = "clave-segura-123";
		String solicitudRegistro = "{\"correoElectronico\":\"" + correoElectronico
				+ "\",\"password\":\"" + password + "\"}";

		mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
				.post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(solicitudRegistro))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isCreated());

		var respuestaLogin = mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
				.post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"userName\":\"" + correoElectronico + "\",\"password\":\"" + password + "\"}"))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();
		var token = new com.fasterxml.jackson.databind.ObjectMapper().readTree(respuestaLogin).get("token").asText();
		var roles = this.jwtService.extractRoles(token).stream()
				.map(org.springframework.security.core.GrantedAuthority::getAuthority)
				.toList();

		org.junit.jupiter.api.Assertions.assertTrue(roles.contains("ROLE_USUARIO"));
		org.junit.jupiter.api.Assertions.assertFalse(roles.contains("ROLE_ADMIN"));
		org.junit.jupiter.api.Assertions.assertFalse(roles.contains("ROLE_ALIADO"));
		mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
				.post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(solicitudRegistro))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isBadRequest());
	}

}
