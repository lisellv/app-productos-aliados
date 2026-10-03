package pe.utec.fullstack;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pe.utec.fullstack.repository.RolJpaEntity;
import pe.utec.fullstack.repository.RolJpaRepository;
import pe.utec.fullstack.repository.UsuarioJpaEntity;
import pe.utec.fullstack.repository.UsuarioJpaRepository;

import java.time.OffsetDateTime;

@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
class FullstackApplicationTests {
	@Autowired
	MockMvc mockMvc;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	RolJpaRepository rolRepository;

	@Autowired
	UsuarioJpaRepository usuarioRepository;

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
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.code").value("AUTH_01"));
	}

	@Test
	void loginReturnsJwtForValidCredentials() throws Exception {
		var now = OffsetDateTime.now();
		var role = rolRepository.saveAndFlush(RolJpaEntity.builder()
				.nombreRol("AUTH_TEST_ADMIN")
				.alta((short) 1)
				.creadoAt(now)
				.build());
		usuarioRepository.saveAndFlush(UsuarioJpaEntity.builder()
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
					.content("{\"userName\":\"login-test@example.invalid\",\"password\":\"test-password\"}"))
				.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();

		org.junit.jupiter.api.Assertions.assertEquals(3, token.split("\\.").length);
	}

}
