# 🌐 Network Architect Solutions — Lau

**Disciplina:** Network Architect Solutions · **Entrega:** `.pkt` + PDF no Teams/Portal até 19/11, 23h55 (um envio por equipe)

## Conceito
Projetar no Packet Tracer a rede do **Posto Caminho Livre**, a base comunitária de zeladoria onde ficam a equipe, o Wi-Fi público para o cidadão e o servidor da solução com os sensores dos postes.

## Entregáveis
- [ ] Arquivo `.pkt`
- [ ] PDF com: Ficha da CitizenTech, topologia, plano de endereçamento, trechos de `show running-config` e prints dos testes

## Avaliação
| Critério | Peso |
|---|---|
| Arquitetura e endereçamento | 3 |
| Configuração | 3 |
| Segurança | 2 |
| Testes | 2 |

## Requisitos mínimos
### Endereçamento e VLANs
- [ ] Faixa `192.168.X.0/24` (X = número da equipe) dividida em pelo menos 3 sub-redes:

| VLAN | Setor | Sub-rede | Gateway |
|---|---|---|---|
| 10 | Equipe | *calcular* | |
| 20 | Cidadão (Wi-Fi público) | | |
| 30 | Servidores / Sensores | | |

- [ ] Trunk 802.1Q + **router-on-a-stick**

### Serviços
- [ ] DHCP com um pool por VLAN (excluindo gateway e servidor)
- [ ] NAT/PAT até um roteador provedor com servidor externo simulando a internet
- [ ] Servidor da solução com **DNS** e **HTTP** (página com a Ficha da CitizenTech), por exemplo `caminholivre.local`

### Segurança
- [ ] ACL estendida: o Wi-Fi do cidadão acessa **só HTTP e DNS** do servidor e a internet, **nada** da VLAN Equipe
- [ ] Roteador acessível **só por SSH**, com senhas e `enable secret`
- [ ] Wi-Fi com **WPA2**

### Testes (prints no PDF)
- [ ] Ping entre VLANs
- [ ] PC recebendo IP por DHCP
- [ ] Página abrindo pelo nome
- [ ] `show ip nat translations`
- [ ] Um acesso barrado pela ACL

## Ideia para a narrativa
Os "postes inteligentes" (sensores de luminosidade) ficam na VLAN Servidores/Sensores e reportam ao servidor quando a rua está escura, gerando automaticamente uma ocorrência de "rua sem iluminação".
