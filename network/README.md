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
- [ ] 2 roteadores com conexão serial
- [ ] 4 switches com módulo de fibra óptica
- [ ] 3 PCs
- [ ] 3 servidores
- [ ] 3 laptops com placa de rede wireless
- [ ] 3 smartphones conectados via wireless
- [ ] 1 Access Point (AP, e não roteador wireless)
- [ ] Conexões com cabos UTP, fibra óptica e wireless
- [ ] Página web personalizada em todos os servidores
- [ ] E-mail enviado de um dispositivo para outro
- [ ] DHCP funcionando em algum dispositivo
- [ ] VLANs
- [ ] Roteamento configurado

## Entregáveis
- [ ] `caminho-livre-rede.pkt`: topologia no Packet Tracer
- [ ] Relatório em PDF (`RELATORIO.md` com os prints): plano de endereçamento, configurações essenciais, explicação de cada serviço, testes de comunicação e registro das decisões
- [ ] Vídeo mostrando os serviços funcionando (`ROTEIRO-VIDEO.md`)

## Arquivos desta pasta
| Arquivo | Para que serve |
|---|---|
| [`MONTAGEM.md`](MONTAGEM.md) | Passo a passo para montar a rede no Packet Tracer 9.0.1 |
| [`configs/`](configs/) | Comandos de cada roteador e switch, prontos para colar no CLI |
| [`servidores/`](servidores/) | Páginas web dos três servidores |
| [`RELATORIO.md`](RELATORIO.md) | Relatório da entrega (vira o PDF) |
| [`ROTEIRO-VIDEO.md`](ROTEIRO-VIDEO.md) | Roteiro e narração do vídeo |
