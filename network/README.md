# 🌐 Network Architect Solutions — Caio

**Disciplina:** Network Architect Solutions · **Entrega:** arquivo do simulador + documentação no Teams até 19/11, 23h55 (um envio por equipe)
**Enunciado:** `docs/GS CitizenTech - 2ES Fev - FIAP 2026.pdf`, páginas 33 e 34 (versão enviada pelo professor de Network)

## Conceito
Projetar a infraestrutura de rede que permitiria à CitizenTech operar em um cenário real, considerando usuários, serviços e restrições locais. No nosso caso, a rede do **Posto Caminho Livre**: equipe isolada, Wi-Fi público para o cidadão, servidores do posto e acesso ao app na nuvem.

## Avaliação
| Critério | Peso |
|---|---|
| Arquitetura | 3 |
| Configuração e endereçamento | 3 |
| Segurança | 2 |
| Testes | 2 |

## Requisitos mínimos do `.pkt`
- [x] 2 roteadores com conexão serial
- [x] 4 switches com módulo de fibra óptica
- [x] 3 PCs
- [x] 3 servidores
- [x] 3 laptops com placa de rede wireless
- [x] 3 smartphones conectados via wireless
- [x] 1 Access Point (AP, e não roteador wireless)
- [x] Conexões com cabos UTP, fibra óptica e wireless
- [x] Página web personalizada em todos os servidores
- [x] E-mail enviado de um dispositivo para outro
- [x] DHCP funcionando em algum dispositivo
- [x] VLANs
- [x] Roteamento configurado

## Entregáveis
- [x] [`caminho-livre-rede.pkt`](caminho-livre-rede.pkt): topologia no Packet Tracer 9.0.1
- [x] [`Network_GS_CaminhoLivre.pdf`](Network_GS_CaminhoLivre.pdf): relatório com plano de endereçamento, configurações essenciais, explicação de cada serviço, testes de comunicação e registro das decisões
- [ ] Vídeo mostrando os serviços funcionando (link no relatório)

## Arquivos desta pasta
| Arquivo | Para que serve |
|---|---|
| [`RELATORIO.md`](RELATORIO.md) | Fonte do PDF do relatório |
| [`prints/`](prints/) | Prints dos testes usados no relatório |
| [`configs/`](configs/) | Configuração completa de cada roteador e switch |
| [`servidores/`](servidores/) | Páginas web dos três servidores |
