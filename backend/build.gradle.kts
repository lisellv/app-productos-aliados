plugins {
	java
	id("org.springframework.boot") version "4.1.1"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "pe.utec.fullstack"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

val mapstructVersion = "1.7.0.Beta1"
val lombokVersion = "1.18.30"
val lombokMapstructBindingVersion = "0.2.0"
val jwtVersion = "0.13.0"

repositories {
	mavenCentral()
}

dependencies {

	implementation("io.jsonwebtoken:jjwt-api:${jwtVersion}")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:${jwtVersion}")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:${jwtVersion}")

	runtimeOnly("org.postgresql:postgresql")

	//runtimeOnly("com.microsoft.sqlserver:mssql-jdbc") si quisiera utilizar sql server
	//runtimeOnly("com.mysql:mysql-connector-j") si quisiera utilizar mysql
	//runtimeOnly("com.oracle.database.jdbc:ojdbc17") si quisiera utilizar oracle
	//runtimeOnly("org.mariadb.jdbc:mariadb-java-client") si quisiera utilizar mariadb
	//runtimeOnly("org.xerial:sqlite-jdbc") si quisiera utilizar sqlite

	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-flyway")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.0")
	implementation("org.flywaydb:flyway-database-postgresql")
	implementation("org.springframework.boot:spring-boot-starter-actuator")


	runtimeOnly("org.postgresql:postgresql")

	compileOnly("org.mapstruct:mapstruct:${mapstructVersion}")
	compileOnly("org.projectlombok:lombok:${lombokVersion}")
	annotationProcessor("org.mapstruct:mapstruct-processor:${mapstructVersion}")
	annotationProcessor("org.projectlombok:lombok:${lombokVersion}")
	annotationProcessor("org.projectlombok:lombok-mapstruct-binding:${lombokMapstructBindingVersion}")

	testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
	testImplementation("org.springframework.boot:spring-boot-starter-flyway-test")
	testImplementation("org.springframework.boot:spring-boot-starter-security-test")
	testImplementation("org.springframework.boot:spring-boot-starter-validation-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testImplementation("org.testcontainers:testcontainers-junit-jupiter")
	testImplementation("org.testcontainers:testcontainers-postgresql")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
