# Montagem no Packet Tracer 9.0.1 — passo a passo

Guia para montar o arquivo `caminho-livre-rede.pkt`. Siga a ordem: dispositivos → módulos → cabos → configs → servidores → Wi-Fi → testes.

> **Dica de tempo:** depois de ligar cabos ou colar configs, clique em **Fast Forward Time** (barra inferior, ao lado do relógio) duas ou três vezes. Isso acelera o spanning tree e o DHCP, que sem isso demoram uns 30 segundos.

## 1. Dispositivos

Arraste cada item da barra inferior e renomeie em **Config → Global → Display Name**.

| Display Name | Onde fica na paleta | Quantidade |
|---|---|---|
| R-POSTO, R-ISP | Network Devices → Routers → **2911** | 2 |
| SW-CORE, SW-EQUIPE, SW-SERVIDORES, SW-CIDADAO | Network Devices → Switches → **Switch-PT** | 4 |
| AP-CIDADAO | Network Devices → Wireless Devices → **AccessPoint-PT** | 1 |
| PC-EQUIPE-01, PC-EQUIPE-02, PC-EQUIPE-03 | End Devices → **PC** | 3 |
| SRV-POSTO, SRV-EMAIL, SRV-NUVEM | End Devices → **Server** | 3 |
| NB-CIDADAO-01, NB-CIDADAO-02, NB-CIDADAO-03 | End Devices → **Laptop** | 3 |
| CEL-CIDADAO-01, CEL-CIDADAO-02, CEL-CIDADAO-03 | End Devices → **Smartphone** | 3 |

Sugestão de layout (fica bom no print): provedor e nuvem no alto, R-POSTO no meio, SW-CORE abaixo dele e os três switches de acesso em linha embaixo, cada um com os seus dispositivos.

## 2. Módulos (aba Physical)

Sempre **desligue** o equipamento no botão de energia, arraste o módulo e **ligue de novo**.

| Equipamento | O que fazer | Porta que aparece |
|---|---|---|
| R-POSTO e R-ISP | Arrastar **HWIC-2T** para o primeiro slot HWIC vazio | `Serial0/0/0` e `Serial0/0/1` |
| SW-CORE | Remover os módulos de cobre dos **slots 1, 2 e 3** e colocar **PT-SWITCH-NM-1FGE** nos três | `GigabitEthernet1/1`, `2/1`, `3/1` (fibra) |
| SW-EQUIPE, SW-SERVIDORES, SW-CIDADAO | Remover o módulo de cobre do **slot 1** e colocar **PT-SWITCH-NM-1FGE** | `GigabitEthernet1/1` (fibra) |
| NB-CIDADAO-01 a 03 | Remover **PT-LAPTOP-NM-1CFE** e colocar **WPC300N** | `Wireless0` |

**Confira antes de seguir:** no CLI de cada switch, rode `show ip interface brief`. As portas de fibra precisam aparecer com os nomes da tabela, e as de cobre que sobraram como `FastEthernet0/1`, `2/1`, `3/1`, `4/1` e `5/1`. Se os nomes forem outros, me mande o print antes de colar as configs.

## 3. Cabos

| De | Porta | Para | Porta | Cabo |
|---|---|---|---|---|
| R-ISP | Se0/0/0 | R-POSTO | Se0/0/0 | **Serial DCE**: clique **primeiro no R-ISP** (o lado DCE fica nele) |
| R-ISP | G0/0 | SRV-NUVEM | FastEthernet0 | Copper Cross-Over |
| R-POSTO | G0/0 | SW-CORE | Fa0/1 | Copper Straight-Through |
| SW-CORE | Gi1/1 | SW-EQUIPE | Gi1/1 | **Fibra multimodo** |
| SW-CORE | Gi2/1 | SW-SERVIDORES | Gi1/1 | **Fibra multimodo** |
| SW-CORE | Gi3/1 | SW-CIDADAO | Gi1/1 | **Fibra multimodo** |
| SW-EQUIPE | Fa0/1, Fa2/1, Fa3/1 | PC-EQUIPE-01, 02, 03 | FastEthernet0 | Copper Straight-Through |
| SW-SERVIDORES | Fa0/1 | SRV-POSTO | FastEthernet0 | Copper Straight-Through |
| SW-SERVIDORES | Fa2/1 | SRV-EMAIL | FastEthernet0 | Copper Straight-Through |
| SW-CIDADAO | Fa0/1 | AP-CIDADAO | Port 0 | Copper Straight-Through |
| AP-CIDADAO | — | Laptops e smartphones | Wireless0 | Wireless (associa sozinho depois do passo 7) |

**Nomes das portas:** `Fa` = FastEthernet (cobre, 100 Mbps), `Gi` = GigabitEthernet (1 Gbps; nos switches, as portas dos módulos de fibra), `Se` = Serial. O número segue o formato slot/porta: `Fa0/1` é a porta 1 do slot 0, e `Gi1/1` é a porta 1 do módulo no slot 1.

**Fibra:** use **multimodo**, que é o tipo usado em distâncias curtas dentro de um prédio. Se a porta não aparecer na lista ao ligar o cabo, o módulo é monomodo: troque para fibra monomodo.

Para conferir o lado DCE: no R-ISP, rode `show controllers serial0/0/0`. Precisa aparecer `DCE`. Se aparecer `DTE`, refaça o cabo clicando primeiro no R-ISP.

## 4. Configs dos roteadores e switches

Para cada equipamento, abra **CLI**, responda `no` à pergunta do *initial configuration dialog* e cole o arquivo correspondente de `configs/` (Ctrl+V ou botão direito → Paste):

1. `R-ISP.txt`
2. `R-POSTO.txt`
3. `SW-CORE.txt`
4. `SW-EQUIPE.txt`, `SW-SERVIDORES.txt`, `SW-CIDADAO.txt`

Cole por blocos (os blocos são separados por linhas com `!`). Se aparecer `% Invalid input detected`, anote a linha e me mande: o Switch-PT não aceita alguns comandos dos switches Catalyst.

Depois de colar, o console passa a pedir a senha `CLconsole2026` e o `enable` pede `CLenable2026`.

Confira o link serial no R-POSTO com `show ip interface brief`: a `Serial0/0/0` precisa estar `up/up`. Se o protocolo ficar `down`, o problema é senha do CHAP ou clock rate.

## 5. Servidores

### SRV-POSTO (DNS + página da Ficha)
1. **Desktop → IP Configuration → Static:** IP `192.168.10.162`, máscara `255.255.255.224`, gateway `192.168.10.161`, DNS `192.168.10.162`.
2. **Services → HTTP:** HTTP e HTTPS em On. Em `index.html` clique **Edit**, apague o conteúdo e cole `servidores/posto.html`. Clique em Save.
3. **Services → DNS:** DNS Service On. Adicione os três registros do tipo **A Record**:

| Name | Address |
|---|---|
| www.caminholivre.local | 192.168.10.162 |
| mail.caminholivre.local | 192.168.10.163 |
| app.caminholivre.local | 198.51.100.10 |

4. Desligue (Off) os serviços que não usamos: DHCP, TFTP, FTP, EMAIL, SYSLOG, AAA, NTP e IoT.

### SRV-EMAIL (e-mail + página da equipe)
1. **IP Configuration → Static:** IP `192.168.10.163`, máscara `255.255.255.224`, gateway `192.168.10.161`, DNS `192.168.10.162`.
2. **Services → HTTP:** Edit no `index.html` e colar `servidores/email.html`.
3. **Services → EMAIL:** SMTP e POP3 em On. Domain Name: `caminholivre.local` → Set. Usuários (User Setup): `equipe1`, `equipe2` e `equipe3`, todos com senha `CLmail2026`.
4. Desligue DHCP, TFTP, FTP, DNS, SYSLOG, AAA, NTP e IoT.

### SRV-NUVEM (app na nuvem)
1. **IP Configuration → Static:** IP `198.51.100.10`, máscara `255.255.255.0`, gateway `198.51.100.1`.
2. **Services → HTTP:** Edit no `index.html` e colar `servidores/nuvem.html`.
3. Desligue DHCP, TFTP, FTP, DNS, EMAIL, SYSLOG, AAA, NTP e IoT.

## 6. Access Point (Wi-Fi público)

**AP-CIDADAO → Config → Port 1:**
- SSID: `CaminhoLivre-Publico`
- Authentication: **WPA2-PSK**
- PSK Pass Phrase: `CaminhoLivre2026`
- Encryption Type: **AES**

## 7. Dispositivos do cidadão (Wi-Fi)

Para cada **NB-CIDADAO** (Config → Wireless0) e cada **CEL-CIDADAO** (Config → Wireless0):
- SSID `CaminhoLivre-Publico`, WPA2-PSK, senha `CaminhoLivre2026`, AES.
- IP Configuration: **DHCP**.

Uma linha tracejada entre o dispositivo e o AP indica que ele se associou. Cada um precisa receber um IP a partir de `192.168.10.11`.

## 8. PCs da equipe

1. **Desktop → IP Configuration → DHCP** nos três PCs. O primeiro recebe `192.168.10.134`.
2. **Desktop → Email → Configure Mail**:

| PC | Your Name | Email Address | Incoming e Outgoing Mail Server | User Name | Password |
|---|---|---|---|---|---|
| PC-EQUIPE-01 | Equipe 1 | equipe1@caminholivre.local | mail.caminholivre.local | equipe1 | CLmail2026 |
| PC-EQUIPE-02 | Equipe 2 | equipe2@caminholivre.local | mail.caminholivre.local | equipe2 | CLmail2026 |
| PC-EQUIPE-03 | Equipe 3 | equipe3@caminholivre.local | mail.caminholivre.local | equipe3 | CLmail2026 |

## 9. Notas na topologia

Use a ferramenta **Place Note** (atalho N) para escrever, perto de cada switch de acesso, a VLAN e a sub-rede (ex.: "VLAN 10 · Equipe · 192.168.10.128/27"). Isso deixa o print da topologia autoexplicativo.

## 10. Testes e prints

Rode os testes da seção 9 do `RELATORIO.md` e salve um print de cada um. Antes de cada `ping`, rode-o uma vez: o primeiro pacote costuma falhar por causa do ARP.

## 11. Salvar

**File → Save As** em `\\wsl.localhost\Ubuntu\home\caion\personal\caminho-livre\network\caminho-livre-rede.pkt`. Se o Packet Tracer não aceitar esse caminho, salve em Downloads e me avise que eu copio.
