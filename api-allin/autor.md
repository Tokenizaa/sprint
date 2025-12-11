Autorização
Quando utilizar autorização?
R: Quando você precisar acessar os dados de um distribuidor/usuário dentro do seu aplicativo então você pode solicitar ao distribuidor/usuário autorização de acesso.

Permissão utilizada OAuth2, necessita que o cliente permita acesso aos escopos em que sua APP possa buscar dados do próprio cliente

 Atenção:
A autorização só funciona para aplicativos com configurações que exigem essa autorização. O administrador do sistema deve habilitar estas configurações no módulo pelo painel administrativo.
Na configuração do aplicativo no sistema, as opções que exigem autorização são as que permitem acessar os dados dos usuários conforme citadas abaixo.

Permite acessar os dados de todos os usuários
Permite acessar os dados de usuários que autorizarem que seus dados sejam acessados
Como usar autorização?
1º passo) Requisitar acesso aos dados do cliente em determinados escopos
Para requisitar a chave de acesso utilizando suas proprias credenciais, você deve enviar uma solicitação GET na URL:
https://allinbrasil.com.br/api/v1/auth/authorization
Com os parametros:

Parametro	Valor
response_type	Tipo de resposta (DEVE ser enviada o valor 'code')
client_id	Seu client id
redirect_uri	Url na qual sera retornado os dados
scope	Escopos solicitados (Separados por '+' ou espaço)
state	String que será retornada no redirecionamento da url
elsl	Informar "1" para exigir que o usuário informe login e senha mesmo se já estiver logado no sistema (opcional).
Exemplo da url montada:
https://allinbrasil.com.br/api/v1/auth/authorization?response_type=code&client_id=ID_DO_CLIENTE&redirect_uri=http://meusite.com/minhaAplicacao&scope=pedidos+produtos&state=1525866663
2º passo) Distribuidor/usuário realiza o login e concede a autorização ao seu aplicativo
A url levará o cliente para a página de autorização e o distribuidor/usuário irá realizar o login e então conceder permissão ao seu aplicativo.

3º passo) Retorno
Após a autorização, será redirecionado para URL de redireciomento do seu aplicativo. A resposta da pagina será um requisição GET na url informada no redirect_uri com os sequintes parametros:

Parametro	Valor
code	Código de autorização do cliente
state	String enviada na solicitação de permissão
Exemplo da url montada:
http://meusite.com/minhaAplicacao?code=15cdec412102e9347d0f6ec1e12f3b5f620a5c2a&state=1525866663
4º passo) Solicitação do primeiro access_token e refresh_token
Agora, com o autorization code em mãos você poderá solicitar o access_token e refresh token.

Para requisitar você deve enviar uma solicitação POST na URL:
https://allinbrasil.com.br/api/v1/auth/token
Com os parametros:

Parametro	Valor	Opcional
client_id	Seu appId	Não
client_secret	Seu appSecret	Não
grant_type	authorization_code	Não
code	Código de autorização que você recebeu como resposta	Sim
Então, você irá receber a seguinte resposta:

{
    "access_token": "c33e34c7792c129696db6e08f50aa5368ad194f3",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": "pedidos",
    "refresh_token": "85cf0e78ed15fa2403f2ba312867ce19d168c431"
}
O importante dessa resposta são os campos:
access_token: É o token de acesso que você irá utilizar no HEAD das requisições para utilizar os endpoints.
refresh_token Serve para você solicitar novos access_token quando o access_token atual vencer. O refresh_token deve ser armazenado de forma segura em sua aplicação e usado para gerar novos access_token. Isso evita que vc precise solicitar autorização ao usuário quando utilizar o seu aplicativo.

5º passo) Solicitar novos access_token
Agora, com o refresh_token em mãos você poderá solicitar novos access_token.

Para requisitar você deve enviar uma solicitação POST na URL:
https://allinbrasil.com.br/api/v1/auth/token
Com os parametros:

Parametro	Valor	Opcional
client_id	Seu appId	Não
client_secret	Seu appSecret	Não
grant_type	refresh_token	Não
code	refresh_token que você recebeu no passo 4	Sim
Então, você irá recber a seguinte resposta:

{
    "access_token": "f53b762520c6faa9aabdae132eaa8ce9f5703a18",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": null
}