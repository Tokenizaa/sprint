Autenticação
Autenticação utilizada OAuth2, necessita que você tenha um appId e um appSecret com os escopos de permissão que o endpoint necessita.

Acessando appId e appSecret
Seu appId e appSecret são fornecidos pelo o adminsitrador do sistema com os escopos especificos que você precisar.

Requisitando chave de acesso por Credenciais Próprias
Para requisitar a chave de acesso utilizando suas próprias credenciais, você deve enviar uma solicitação POST na URL:
https://allinbrasil.com.br/api/v1/auth/token
Com os parametros:

Parametro	Valor	Opcional
client_id	Seu appId	Não
client_secret	Seu appSecret	Não
grant_type	client_credentials	Não
code	Código de autorização do cliente MAIS INFORMAÇÕES	Sim
Caso você deseje obter um token de distribuidor sem utilizar o endpoint de autorização é possível utilizar o grand_type do tipo password. Para isso deve ser adicionado os parâmetros username com o usuário do distribuidor, password com a senha e scope (escopos solicitados separados por '+' ou espaço) na requisição. Obs: após 10 tentativas de autenticação com dados incorretos as tentativas para o usuário serão bloqueadas por uma hora.

Apos a solicitação você tera uma resposta json no modelo abaixo caso o grant_type seja do tipo client_credentials ou password:

{
    "access_token": "f53b762520c6faa9aabdae132eaa8ce9f5703a18",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": null
}
Então, todas as requisições que for enviadas na api você deverá enviar junto no cabeçalho da requisição o access_token, da seguinte forma:

Authorization: Bearer f53b762520c6faa9aabdae132eaa8ce9f5703a18
Exemplo PHP
Requisição de autenticação:

            
$request = new HttpRequest();
$request->setUrl('https://allinbrasil.com.br/api/v1/auth/token');
$request->setMethod(HTTP_METH_POST);

$request->setHeaders(array(
  'cache-control' => 'no-cache',
  'Connection' => 'keep-alive',
  'Content-Length' => '114',
  'Accept-Encoding' => 'gzip, deflate',
  'Host' => 'maxnivel.local',
  'Cache-Control' => 'no-cache',
  'Accept' => '*/*',
  'Authorization' => 'Bearer ee8d11881898f98b42def278e2fa84cdab14f835',
  'Content-Type' => 'application/x-www-form-urlencoded'
));

$request->setContentType('application/x-www-form-urlencoded');
$request->setPostFields(array(
  'client_id' => 'APPTESTE_7baebf2372',
  'client_secret' => '06ee142b1a038cbcf59ee49987c27394339e7da5',
  'grant_type' => 'client_credentials'
));

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
Resposta da requisição de autenticação:

{
    "access_token": "f151ec623701ec8ed5d200a83c2c89be5bf6d8a5",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": null
}


Exemplo de requisição na API para obter pedidos:
    
$request = new HttpRequest();
$request->setUrl('https://allinbrasil.com.br/api/v1/pedidos');
$request->setMethod(HTTP_METH_GET);

$request->setHeaders(array(
  'cache-control' => 'no-cache',
  'Connection' => 'keep-alive',
  'Accept-Encoding' => 'gzip, deflate',
  'Cache-Control' => 'no-cache',
  'Accept' => '*/*',
  'Authorization' => 'Bearer f151ec623701ec8ed5d200a83c2c89be5bf6d8a5',
  'Content-Type' => 'application/json'
));

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
Exemplo JavaScript
Requisição de autenticação:

            
var data = "client_id=APPTESTE_7baebf2372&client_secret=06ee142b1a038cbcf59ee49987c27394339e7da5&grant_type=client_credentials";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://allinbrasil.com.br/api/v1/auth/token");
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
Resposta da requisição de autenticação:

{
    "access_token": "f151ec623701ec8ed5d200a83c2c89be5bf6d8a5",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": null
}


Exemplo de requisição na API para obter pedidos:
    
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://allinbrasil.com.br/api/v1/pedidos");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "Bearer f151ec623701ec8ed5d200a83c2c89be5bf6d8a5");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "maxnivel.local");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Cookie", "PHPSESSID=e2caa728beba7531f40fe683a56893c6");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);