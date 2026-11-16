package br.com.caminholivre.config;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.com.caminholivre.repository.OcorrenciaRepository;

/** Todo dia às 3h: ABERTA vencida vira EXPIRADA. As leituras também expiram antes de listar, então o job é só faxina. */
@Component
public class ExpiracaoJob {

    private static final Logger log = LoggerFactory.getLogger(ExpiracaoJob.class);

    private final OcorrenciaRepository ocorrencias;

    public ExpiracaoJob(OcorrenciaRepository ocorrencias) {
        this.ocorrencias = ocorrencias;
    }

    @Scheduled(cron = "0 0 3 * * *", zone = "America/Sao_Paulo")
    @Transactional
    public void expirar() {
        log.info("Expiração diária: {} alerta(s) ABERTA viraram EXPIRADA", ocorrencias.expirarVencidas(LocalDateTime.now()));
    }
}
