package br.com.caminholivre;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CaminholivreApplication {

	public static void main(String[] args) {
		// O Render roda em UTC; datas de registro/expiração e a "hora" da rota são de São Paulo
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
		SpringApplication.run(CaminholivreApplication.class, args);
	}

}
