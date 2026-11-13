# Roteiro do vídeo — rede do Posto Caminho Livre

**Duração alvo:** 5 a 6 minutos. O enunciado de Network não fixa um limite; confirmar com o professor.
**Objetivo:** mostrar cada serviço exigido funcionando (página 34 do enunciado).

## Antes de gravar

- [ ] Rode todos os testes uma vez antes de gravar. Assim o ARP e o DHCP já estão prontos e nenhum ping falha na gravação.
- [ ] Deixe os PCs, laptops e smartphones com IP (Fast Forward Time algumas vezes).
- [ ] Apague o e-mail de teste anterior, para que o envio na gravação apareça como novo.
- [ ] Rode `clear ip nat translation *` e `clear access-list counters` no R-POSTO, para os contadores começarem do zero.
- [ ] Aumente a fonte do CLI (Options → Preferences → Font) para ficar legível no vídeo.
- [ ] Grave a tela em 1080p (OBS ou Xbox Game Bar com Win+Alt+R).

## Cenas

### Cena 1 — Abertura (0:00–0:30)
**Tela:** topologia completa.
**Narração:**
> "Olá, somos o grupo OctoFlow. O Caminho Livre é um mapa colaborativo que mostra a quem anda a pé onde há calçada quebrada, degrau ou rua escura, e sugere uma rota que desvia desses problemas. Esta é a rede do Posto Caminho Livre, a base comunitária do projeto no entorno da FIAP Paulista. Nela, a equipe do posto trabalha numa rede isolada e o cidadão usa um Wi-Fi público para acessar o app, que roda na nuvem."

### Cena 2 — Arquitetura e requisitos (0:30–1:15)
**Tela:** passe o mouse por cada parte da topologia, de cima para baixo.
**Narração:**
> "Temos dois roteadores ligados por cabo serial: o R-ISP, do provedor, e o R-POSTO, que é o gateway do posto. Abaixo dele, um switch central se liga por fibra óptica a três switches de acesso, um para cada setor: equipe, servidores e cidadão. São três PCs da equipe, três servidores, três laptops e três smartphones conectados por Wi-Fi a um access point. Os cabos são UTP nos dispositivos, fibra entre os switches, serial entre os roteadores e wireless no Wi-Fi público."

### Cena 3 — Endereçamento e VLANs (1:15–1:50)
**Tela:** notas da topologia com as sub-redes; depois o CLI do SW-CORE com `show vlan brief` e `show interfaces trunk`.
**Narração:**
> "A rede interna usa 192.168.10.0/24 dividida com VLSM: um /25 para o Wi-Fi público, que tem mais usuários, dois /27 para a equipe e para os servidores, e um /28 para a gerência dos switches. Cada setor é uma VLAN. Os links de fibra são trunks 802.1Q que levam só as VLANs necessárias, e a VLAN nativa é a 999, sem nenhum dispositivo."

### Cena 4 — DHCP e Wi-Fi (1:50–2:30)
**Tela:** AP-CIDADAO → Config → Port 1 (mostrar WPA2-PSK e AES); NB-CIDADAO-01 → `ipconfig /all`; R-POSTO → `show ip dhcp binding`.
**Narração:**
> "O Wi-Fi público usa WPA2 com AES. Os laptops e smartphones recebem IP automaticamente: o DHCP fica no R-POSTO, com um pool para a equipe e outro para o cidadão. Aqui o laptop recebeu um endereço da VLAN 20, com gateway e DNS. No roteador, a tabela mostra todos os dispositivos que receberam IP."

### Cena 5 — Roteamento (2:30–3:05)
**Tela:** PC-EQUIPE-01 → `ping 192.168.10.162` e `tracert 198.51.100.10`; R-POSTO → `show ip route`.
**Narração:**
> "O roteamento entre VLANs é feito no R-POSTO com router-on-a-stick: o PC da equipe, na VLAN 10, alcança o servidor na VLAN 30. Para sair do posto, o roteador tem uma rota padrão para o provedor. O traceroute mostra o caminho até a nuvem: gateway do posto, roteador do provedor e servidor do app."

### Cena 6 — DNS e páginas web (3:05–3:45)
**Tela:** NB-CIDADAO-01 → navegador em `www.caminholivre.lan`; CEL-CIDADAO-01 → `app.caminholivre.lan`; PC-EQUIPE-01 → `mail.caminholivre.lan`.
**Narração:**
> "O servidor do posto faz o DNS da zona caminholivre.lan. Todos os servidores têm página própria: pelo nome, o cidadão abre a página do posto com a Ficha da CitizenTech e, pelo celular, abre o app na nuvem. A equipe abre a página do servidor de e-mail."

### Cena 7 — E-mail (3:45–4:15)
**Tela:** PC-EQUIPE-01 → Email → Compose para `equipe2@caminholivre.lan` → Send; PC-EQUIPE-02 → Email → Receive.
**Narração:**
> "O servidor de e-mail roda SMTP e POP3. Vou enviar uma mensagem do PC da equipe 1 para a equipe 2... e no PC da equipe 2 a mensagem chegou."

**Texto sugerido do e-mail:** assunto "Alerta confirmado na Alameda Santos"; corpo "Calçada quebrada confirmada por 3 pessoas. Encaminhar à zeladoria."

### Cena 8 — NAT (4:15–4:35)
**Tela:** R-POSTO → `show ip nat translations`.
**Narração:**
> "Todo o tráfego para a internet sai com o IP público da serial, usando PAT. Aqui estão as traduções dos acessos que acabamos de fazer."

### Cena 9 — Segurança (4:35–5:35)
**Tela, em sequência:**
1. NB-CIDADAO-01 → `ping` no IP do PC-EQUIPE-01 (falha) e navegador em `mail.caminholivre.lan` (falha).
2. R-POSTO → `show access-lists` (contadores do `deny`).
3. PC-EQUIPE-01 → `telnet 192.168.10.129` (recusado) e `ssh -l admin 192.168.10.129` (entra).
4. R-POSTO → `show interfaces serial0/0/0` (PPP, LCP Open).

**Narração:**
> "Agora a segurança. O Wi-Fi público é uma rede aberta, então uma ACL estendida no roteador só deixa o cidadão usar o DNS, a página do posto e a internet. Veja: o laptop do cidadão não consegue pingar o PC da equipe nem abrir o servidor de e-mail, e os contadores da ACL mostram os bloqueios. O roteador só aceita acesso remoto por SSH, e só a partir da rede da equipe: o Telnet é recusado e o SSH entra. As senhas ficam criptografadas, o login bloqueia após três tentativas erradas e o link serial com o provedor usa PPP com autenticação CHAP."

### Cena 10 — Encerramento (5:35–6:00)
**Tela:** topologia completa.
**Narração:**
> "A rede foi pensada para crescer: sobram blocos de endereços para novos setores, o switch central tem portas de fibra livres e outros postos podem repetir o mesmo modelo em outra faixa. Assim, o Caminho Livre chega a quem mais precisa dele. Obrigado!"
