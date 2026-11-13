# Plano de rede — Posto Caminho Livre (rascunho)

> Rascunho para a entrega de **Network Architect Solutions**. Onde aparece `X`, trocar pelo número da equipe (faixa `192.168.X.0/24` exigida no enunciado).
> Fonte dos requisitos: `docs/GS CitizenTech - 2ES Fev - FIAP 2026.pdf`, páginas 35 e 36.

## 1. Cenário

O **Posto Caminho Livre** é a base comunitária do projeto, perto da FIAP Paulista. No posto ficam:

- a **equipe** (voluntários do coletivo de bairro), que modera os alertas e acompanha a zeladoria;
- o **Wi-Fi público**, que o cidadão usa para abrir o Caminho Livre e registrar alertas;
- o **servidor da solução** (DNS + HTTP com a Ficha da CitizenTech) e os **sensores de luminosidade dos postes**, que avisam o servidor quando uma rua fica escura e geram um alerta da categoria "Rua escura".

## 2. Topologia

```
                         INTERNET SIMULADA
                 SRV-INTERNET 198.51.100.10/24
                              │
                       G0/1 198.51.100.1
                         ┌────────┐
                         │ R-ISP  │  (roteador do provedor)
                         └────────┘
                       G0/0 203.0.113.1/30
                              │  WAN 203.0.113.0/30
                       G0/1 203.0.113.2/30   (ip nat outside)
                         ┌────────┐
                         │R-POSTO │  router-on-a-stick, DHCP, NAT/PAT, ACL, SSH
                         └────────┘
                       G0/0 trunk 802.1Q (.10 .20 .30 .99)
                              │
                       G0/1 trunk
                         ┌─────────┐
                         │SW-POSTO │  2960, VLAN 10/20/30/99
                         └─────────┘
          Fa0/1-4 │            Fa0/5-8 │                 Fa0/9 │
          VLAN 10 │            VLAN 30 │                 VLAN 20
     PC-EQUIPE-01/02   SRV-CAMINHOLIVRE (.162)       AP-CIDADAO (WPA2)
                       SENSOR-POSTE-01/02              ))) NB-CIDADAO-01
                                                       ))) CEL-CIDADAO-01
```

## 3. Equipamentos

| Nome | Modelo no Packet Tracer | Função |
|---|---|---|
| R-POSTO | 2911 | Gateway das VLANs (router-on-a-stick), DHCP, NAT/PAT, ACL, SSH |
| R-ISP | 2911 | Roteador do provedor |
| SW-POSTO | 2960-24TT | Switch de acesso com as VLANs |
| AP-CIDADAO | AccessPoint-PT | Wi-Fi público com WPA2 |
| SRV-CAMINHOLIVRE | Server-PT | DNS + HTTP (página da Ficha) |
| SRV-INTERNET | Server-PT | Servidor externo que simula a internet |
| PC-EQUIPE-01, PC-EQUIPE-02 | PC-PT | Estações da equipe |
| NB-CIDADAO-01 | Laptop-PT com placa WPC300N | Cidadão no Wi-Fi |
| CEL-CIDADAO-01 | Smartphone-PT | Cidadão no Wi-Fi |
| SENSOR-POSTE-01, SENSOR-POSTE-02 | Dispositivo IoT (ou PC-PT renomeado) | Sensores de luminosidade |

> Com roteador ISR4331 em vez do 2911, as interfaces passam a ser `G0/0/0` e `G0/0/1`.

## 4. Plano de endereçamento (VLSM)

A faixa `192.168.X.0/24` foi dividida da maior demanda para a menor:

| VLAN | Setor | Hosts necessários | Máscara | Sub-rede | Hosts úteis | Gateway | Broadcast |
|---|---|---|---|---|---|---|---|
| 20 | Cidadão (Wi-Fi público) | até 120 | /25 (255.255.255.128) | 192.168.X.0 | .1 a .126 | 192.168.X.1 | 192.168.X.127 |
| 10 | Equipe | até 30 | /27 (255.255.255.224) | 192.168.X.128 | .129 a .158 | 192.168.X.129 | 192.168.X.159 |
| 30 | Servidores / Sensores | até 30 | /27 (255.255.255.224) | 192.168.X.160 | .161 a .190 | 192.168.X.161 | 192.168.X.191 |
| 99 | Gerência (switch) | até 14 | /28 (255.255.255.240) | 192.168.X.192 | .193 a .206 | 192.168.X.193 | 192.168.X.207 |
| — | Reserva para expansão | — | /28 + /27 | 192.168.X.208 e 192.168.X.224 | — | — | — |
| 999 | Nativa sem uso (segurança) | 0 | — | — | — | — | — |

Por que esses tamanhos: o Wi-Fi público recebe o maior bloco porque atende qualquer pessoa que passe pelo posto. A equipe é pequena. A VLAN de servidores comporta o servidor e até cerca de 28 sensores de poste.

### Links fora da faixa interna

| Link | Rede | Endereços |
|---|---|---|
| WAN R-POSTO ↔ R-ISP | 203.0.113.0/30 | R-ISP .1 · R-POSTO .2 |
| Internet simulada | 198.51.100.0/24 | R-ISP .1 · SRV-INTERNET .10 |

As duas redes externas usam faixas reservadas para documentação (RFC 5737), para não colidir com endereços reais.

### Endereços fixos

| Equipamento | Interface | IP | Máscara | Gateway |
|---|---|---|---|---|
| R-POSTO | G0/0.10 | 192.168.X.129 | /27 | — |
| R-POSTO | G0/0.20 | 192.168.X.1 | /25 | — |
| R-POSTO | G0/0.30 | 192.168.X.161 | /27 | — |
| R-POSTO | G0/0.99 | 192.168.X.193 | /28 | — |
| R-POSTO | G0/1 | 203.0.113.2 | /30 | 203.0.113.1 (rota padrão) |
| SW-POSTO | VLAN 99 | 192.168.X.194 | /28 | 192.168.X.193 |
| SRV-CAMINHOLIVRE | Fa0 | 192.168.X.162 | /27 | 192.168.X.161 |
| R-ISP | G0/0 | 203.0.113.1 | /30 | — |
| R-ISP | G0/1 | 198.51.100.1 | /24 | — |
| SRV-INTERNET | Fa0 | 198.51.100.10 | /24 | 198.51.100.1 |

## 5. Mapa de portas do SW-POSTO

| Porta | Modo | VLAN | Conectado a |
|---|---|---|---|
| G0/1 | trunk 802.1Q (nativa 999) | 10, 20, 30, 99, 999 | R-POSTO G0/0 |
| Fa0/1 a Fa0/4 | access | 10 | PCs da equipe |
| Fa0/5 a Fa0/8 | access | 30 | Servidor e sensores |
| Fa0/9 | access | 20 | AP-CIDADAO |
| Fa0/10 a Fa0/24, G0/2 | access, `shutdown` | 999 | Sem uso |

## 6. Serviços

### DHCP (no R-POSTO, um pool por VLAN)

| Pool | Rede | Gateway | DNS | Faixa excluída |
|---|---|---|---|---|
| CIDADAO | 192.168.X.0/25 | .1 | 192.168.X.162 | .1 a .5 |
| EQUIPE | 192.168.X.128/27 | .129 | 192.168.X.162 | .129 a .133 |
| SERVIDORES | 192.168.X.160/27 | .161 | 192.168.X.162 | .161 a .170 (gateway, servidor e reserva para fixos) |

### NAT/PAT

Todo o `192.168.X.0/24` sai pela G0/1 com o IP público 203.0.113.2 (`overload`). O R-ISP não precisa de rota para a rede interna.

### DNS e HTTP (SRV-CAMINHOLIVRE)

| Nome | Tipo | Endereço |
|---|---|---|
| caminholivre.local | A | 192.168.X.162 |
| internet.sim | A | 198.51.100.10 |

O HTTP do SRV-CAMINHOLIVRE serve a página com a **Ficha da CitizenTech**: colar `servidor/index.html` no `index.html` do serviço HTTP. O SRV-INTERNET serve `servidor/internet.html`. Os demais serviços dos servidores (FTP, e-mail, etc.) ficam desligados.

## 7. Segurança

| Requisito | Como foi atendido |
|---|---|
| Wi-Fi do cidadão acessa só HTTP e DNS do servidor e a internet | ACL estendida `ACL_CIDADAO`, de entrada na G0/0.20 |
| Wi-Fi do cidadão não acessa nada da VLAN Equipe | A mesma ACL nega toda a faixa interna `192.168.X.0/24` |
| Roteador só por SSH | `transport input ssh`, SSH versão 2, usuário local |
| Senhas e `enable secret` | `enable secret`, senha no console, `service password-encryption` |
| Wi-Fi com WPA2 | AP-CIDADAO com WPA2-PSK (AES) |
| Extra | ACL `10` na VTY: SSH só a partir das VLANs Equipe e Gerência |
| Extra | VLAN nativa 999 sem uso, portas livres desligadas, `switchport nonegotiate` no trunk |
| Extra | `login block-for` contra força bruta no SSH |

## 8. Testes (prints para o PDF)

| # | Teste | Onde | Resultado esperado |
|---|---|---|---|
| 1 | Ping entre VLANs | PC-EQUIPE-01 → 192.168.X.162 | Respostas (VLAN 10 → VLAN 30) |
| 2 | IP por DHCP | PC-EQUIPE-01 e NB-CIDADAO-01: `ipconfig /all` + `show ip dhcp binding` no R-POSTO | IP da faixa certa, gateway e DNS corretos |
| 3 | Página pelo nome | Navegador do NB-CIDADAO-01: `http://caminholivre.local` | Ficha da CitizenTech aberta |
| 4 | NAT | Navegar em `http://internet.sim` e rodar `show ip nat translations` | Traduções 192.168.X.x → 203.0.113.2 |
| 5 | Acesso barrado pela ACL | NB-CIDADAO-01: `ping` no IP do PC-EQUIPE-01 (o primeiro do DHCP é 192.168.X.134) + `show access-lists` no R-POSTO | Falha no ping e contador de `deny` subindo |
| 6 | Só SSH | PC-EQUIPE-01: `ssh -l admin 192.168.X.129` funciona; `telnet` é recusado | Acesso apenas por SSH |
| 7 | Conferência | `show vlan brief`, `show interfaces trunk`, `show ip interface brief` | VLANs e trunk ativos |

## 9. Estrutura do PDF

1. Capa: grupo OctoFlow, integrantes e RMs.
2. Ficha da CitizenTech.
3. Topologia (print do Packet Tracer).
4. Plano de endereçamento (seção 4) com a justificativa do VLSM.
5. Trechos de `show running-config` (R-POSTO, SW-POSTO e R-ISP).
6. Prints dos testes (seção 8).

## Pendências

- [ ] Número da equipe (`X`): trocar em `configs/` e neste plano.
- [ ] Montar a topologia no **Packet Tracer 9.0.1**, colar as configs e validar os testes da seção 8.
- [x] Ficha da CitizenTech: no início do `README.md` da raiz e em `servidor/index.html`.
