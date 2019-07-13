<div align="center">
    <img width="128px" src="https://i.imgur.com/CkYXj9u.png"><br>
</div>

# BeicinMusic - Simples Bot de Música
Um simples bot de música feito em **JavaScript** utilizando **NodeJS**.  
Criado com o intuito de ajudar criadores de **BotsDiscord** que não sabe por onde começar a criar um bot de música.

# Como Instalar:
#### Nota:
Caso você utilize a versão estável do **discord.js**, adquirida diretamente pelo **`npm`**, você deverá instalar em sua máquina a versão **estável** - [Clicando Aqui](https://github.com/beicin/BeicinMusic/tree/stable).
### Primeiro Passo:
Clone o repositório em sua máquina: `git clone https://github.com/beicin/BeicinMusic`
### Segundo Passo:
Feito o passo anterior, você precisa instalar as dependências do projeto.  
Em seu terminal, digite `npm install`.
### Terceiro Passo:
##### Você precisará de **duas** KEYS para que o projeto funcione.
Chaves | Onde Adquirir
------------ | -------------
Youtube Data v3 | [Clique Aqui](https://console.cloud.google.com/marketplace/details/google/youtube.googleapis.com)
Spotify | [Clique Aqui](https://developer.spotify.com/dashboard/applications)
### Quarto e último Passo:
#### Bom, se você fez os passos anteriores corretamente, vamos prosseguir!
Creio que já tenha pego o **token** de seu bot. Não pegou ? Não tem problema... [clique aqui]() pegue seu token e volte, eu estarei te esperando, rsrs.  

Agora só ligar seu bot! em sua linha de comando digite `node .`

__Edit__*: **Verifique se você colocou as variáveis corretamente em seu `.env`, não se apresse, dê uma última olhada no [exemplo](https://github.com/beicin/BeicinMusic/blob/master/.env.example) disponibilizado por mim mesmo.**
#### Pronto seu bot ficará **Online**!
## Setando os 'Managers':
### Se você chegou nesse tópico, é porque seu bot já está online. Porém deseja ter acesso ao **eval** e não sabe como....
#### Primeiramente você terá que localizar o arquivo `Client.js`.
* No arquivo localize: `this.managers`
* Se você localizou, o item será um *Array*
* Siga o passo abaixo.

##### No arquivo terá:
```javascript
constructor(options = {}) {
    super(options)
        this.prefix = 'bm!'
        this.managers = ['id1', 'id2'] // Esse é o item que você deve localizar!
        this.collection = Collection
    }
```

#### Agora adicione o seu **ID** no local especificado acima!
Obs: Você pode adicionar quantos **id** quiser. Mas seguindo um padrão ('id', 'id').

# Não conseguiu obter sucesso ?
#### Me chame no discord. Lá estarei te ajudando e tirando suas dúvidas 😃 - AvengerSuicide#0352.
### Antes de me mandar uma DM, por favor, tente refazer os passos.