Pedidos
Pedidos

V1
Endpoint do serviço
GETv1/pedidos
https://allinbrasil.com.br/api/v1/pedidos

Escopo necessário pedidos 

Sobre o serviço
Retorna os pedidos feitos na loja virtual por distribuidores da rede e clientes finais

Filtros aceitos
Os filtros são parâmetros passados no final do endpoint e são utilizados para filtrar dados

Exemplo de alguns filtros preenchidos

GET /pedidos?limit=100&page=1&select=pessoa_id,pessoa_nome&order_by=pessoa_nome.asc,pessoa_id.desc&id=987567 HTTP/1.1
Descrição das querystring
Querystring	Descrição	Opcional	Validação
limit	
Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página

Sim

- Inteiro(4) Unsigned

page	
Página que deseja visualizar da consulta realizada

Sim

- Inteiro(11) Unsigned

select	
Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf)

Sim

- String 65535 caracteres

order_by	
Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor)

Sim

- String 65535 caracteres

id	
Filtro de busca por Id

Sim

- Inteiro(11)

id__maior_igual	
Filtro de busca por Id | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(11)

id__menor_igual	
Filtro de busca por Id | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(11)

id__em	
Filtro de busca por Id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

distribuidor_indicador_id	
Filtro de busca por id do distribuidor indicador

Sim

- Inteiro(11)

distribuidor_indicador_id__maior_igual	
Filtro de busca por id do distribuidor indicador | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(11)

distribuidor_indicador_id__menor_igual	
Filtro de busca por id do distribuidor indicador | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(11)

distribuidor_indicador_id__em	
Filtro de busca por id do distribuidor indicador | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

distribuidor_comprador_id	
Filtro de busca por id do distribuidor comprador

Sim

- Inteiro(11)

distribuidor_comprador_id__maior_igual	
Filtro de busca por id do distribuidor comprador | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(11)

distribuidor_comprador_id__menor_igual	
Filtro de busca por id do distribuidor comprador | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(11)

distribuidor_comprador_id__em	
Filtro de busca por id do distribuidor comprador | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

loja_id	
Filtro de busca por id da loja

Sim

- Inteiro(11)

loja_id__maior_igual	
Filtro de busca por id da loja | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(11)

loja_id__menor_igual	
Filtro de busca por id da loja | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(11)

loja_id__em	
Filtro de busca por id da loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

loja_nome	
Filtro de busca por nome da loja

Sim

- String 64 caracteres

loja_nome__contem	
Filtro de busca por nome da loja | Valor do campo contem que o valor do parametro informado

Sim

- String 64 caracteres

loja_nome__em	
Filtro de busca por nome da loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_id	
Filtro de busca por id do cliente

Sim

- Inteiro(11) unsigne)

cliente_id__maior_igual	
Filtro de busca por id do cliente | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(11) unsigne)

cliente_id__menor_igual	
Filtro de busca por id do cliente | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(11) unsigne)

cliente_id__em	
Filtro de busca por id do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

tipo_id	
Filtro de busca por id do tipo de compra

Sim

- Inteiro(11)

tipo_id__maior_igual	
Filtro de busca por id do tipo de compra | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(11)

tipo_id__menor_igual	
Filtro de busca por id do tipo de compra | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(11)

tipo_id__em	
Filtro de busca por id do tipo de compra | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

tipo_chave	
Filtro de busca por chave do tipo de compra

Sim

- String 50 caracteres

tipo_chave__contem	
Filtro de busca por chave do tipo de compra | Valor do campo contem que o valor do parametro informado

Sim

- String 50 caracteres

tipo_chave__em	
Filtro de busca por chave do tipo de compra | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

tipo_nome	
Filtro de busca por nome do tipo de compra

Sim

- String 200 caracteres

tipo_nome__contem	
Filtro de busca por nome do tipo de compra | Valor do campo contem que o valor do parametro informado

Sim

- String 200 caracteres

tipo_nome__em	
Filtro de busca por nome do tipo de compra | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

tipo_descricao	
Filtro de busca por descrição do tipo de compra

Sim

- String 65535 caracteres

tipo_descricao__contem	
Filtro de busca por descrição do tipo de compra | Valor do campo contem que o valor do parametro informado

Sim

- String 65535 caracteres

tipo_descricao__em	
Filtro de busca por descrição do tipo de compra | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_nome	
Filtro de busca por nome do cliente

Sim

- String 32 caracteres

cliente_nome__contem	
Filtro de busca por nome do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 32 caracteres

cliente_nome__em	
Filtro de busca por nome do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_sobrenome	
Filtro de busca por sobrenome do cliente

Sim

- String 32 caracteres

cliente_sobrenome__contem	
Filtro de busca por sobrenome do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 32 caracteres

cliente_sobrenome__em	
Filtro de busca por sobrenome do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_email	
Filtro de busca por email do cliente

Sim

- String 96 caracteres

cliente_email__contem	
Filtro de busca por email do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 96 caracteres

cliente_email__em	
Filtro de busca por email do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_telefone	
Filtro de busca por telefone do cliente

Sim

- String 32 caracteres

cliente_telefone__contem	
Filtro de busca por telefone do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 32 caracteres

cliente_telefone__em	
Filtro de busca por telefone do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_rg	
Filtro de busca por RG do cliente

Sim

- String 50 caracteres

cliente_rg__contem	
Filtro de busca por RG do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 50 caracteres

cliente_rg__em	
Filtro de busca por RG do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_cpf	
Filtro de busca por cpf do cliente

Sim

- String 45 caracteres

cliente_cpf__contem	
Filtro de busca por cpf do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 45 caracteres

cliente_cpf__em	
Filtro de busca por cpf do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_cnpj	
Filtro de busca por cnpj do cliente

Sim

- String 200 caracteres

cliente_cnpj__contem	
Filtro de busca por cnpj do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 200 caracteres

cliente_cnpj__em	
Filtro de busca por cnpj do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_ie	
Filtro de busca por inscrição estadual do cliente

Sim

- String 50 caracteres

cliente_ie__contem	
Filtro de busca por inscrição estadual do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 50 caracteres

cliente_ie__em	
Filtro de busca por inscrição estadual do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

pagamento_confirmado	
Filtro de busca por confirmação do pagamento (\'1\' para pago e \'0\' para não pago)

Sim

- Inteiro(1)

pagamento_confirmado__maior_igual	
Filtro de busca por confirmação do pagamento (\'1\' para pago e \'0\' para não pago) | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(1)

pagamento_confirmado__menor_igual	
Filtro de busca por confirmação do pagamento (\'1\' para pago e \'0\' para não pago) | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(1)

pagamento_confirmado__em	
Filtro de busca por confirmação do pagamento (\'1\' para pago e \'0\' para não pago) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

comanda_impressao	
Filtro de busca por impressão da comanda (\'1\' para impresso e \'0\' para não impresso)

Sim

- Inteiro(1)

comanda_impressao__maior_igual	
Filtro de busca por impressão da comanda (\'1\' para impresso e \'0\' para não impresso) | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(1)

comanda_impressao__menor_igual	
Filtro de busca por impressão da comanda (\'1\' para impresso e \'0\' para não impresso) | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(1)

comanda_impressao__em	
Filtro de busca por impressão da comanda (\'1\' para impresso e \'0\' para não impresso) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

fatura_impressao	
Filtro de busca por impressão da fatura (\'1\' para impresso e \'0\' para não impresso)

Sim

- Inteiro(1)

fatura_impressao__maior_igual	
Filtro de busca por impressão da fatura (\'1\' para impresso e \'0\' para não impresso) | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(1)

fatura_impressao__menor_igual	
Filtro de busca por impressão da fatura (\'1\' para impresso e \'0\' para não impresso) | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(1)

fatura_impressao__em	
Filtro de busca por impressão da fatura (\'1\' para impresso e \'0\' para não impresso) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

necessita_frete	
Filtro de busca se necessita frete

Sim

- Inteiro(1)

necessita_frete__maior_igual	
Filtro de busca se necessita frete | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(1)

necessita_frete__menor_igual	
Filtro de busca se necessita frete | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(1)

necessita_frete__em	
Filtro de busca se necessita frete | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

data_pagamento	
Filtro de busca por data de pagamento

Sim

- Data no formato Y-m-d H:i:s

data_pagamento__maior_igual	
Filtro de busca por data de pagamento | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_pagamento__menor_igual	
Filtro de busca por data de pagamento | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_pagamento__contem	
Filtro de busca por data de pagamento | Valor do campo contem que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_pagamento__em	
Filtro de busca por data de pagamento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_logradouro	
Filtro de busca por logradouro do cliente

Sim

- String 128 caracteres

cliente_logradouro__contem	
Filtro de busca por logradouro do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 128 caracteres

cliente_logradouro__em	
Filtro de busca por logradouro do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_bairro	
Filtro de busca por bairro do cliente

Sim

- String 128 caracteres

cliente_bairro__contem	
Filtro de busca por bairro do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 128 caracteres

cliente_bairro__em	
Filtro de busca por bairro do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_cep	
Filtro de busca por cep do cliente

Sim

- String 10 caracteres

cliente_cep__contem	
Filtro de busca por cep do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 10 caracteres

cliente_cep__em	
Filtro de busca por cep do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_cidade	
Filtro de busca por cidade do cliente

Sim

- String 200 caracteres

cliente_cidade__contem	
Filtro de busca por cidade do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 200 caracteres

cliente_cidade__em	
Filtro de busca por cidade do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cliente_uf	
Filtro de busca unidade federativa do cliente

Sim

- String 32 caracteres

cliente_uf__contem	
Filtro de busca unidade federativa do cliente | Valor do campo contem que o valor do parametro informado

Sim

- String 32 caracteres

cliente_uf__em	
Filtro de busca unidade federativa do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

entrega_nome	
Filtro de busca nome da pessoa que irá receber a entrega

Sim

- String 32 caracteres

entrega_nome__contem	
Filtro de busca nome da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado

Sim

- String 32 caracteres

entrega_nome__em	
Filtro de busca nome da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

entrega_sobrenome	
Filtro de busca sobrenome da pessoa que irá receber a entrega

Sim

- String 32 caracteres

entrega_sobrenome__contem	
Filtro de busca sobrenome da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado

Sim

- String 32 caracteres

entrega_sobrenome__em	
Filtro de busca sobrenome da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

entrega_logradouro	
Filtro de busca logradouro da pessoa que irá receber a entrega

Sim

- String 128 caracteres

entrega_logradouro__contem	
Filtro de busca logradouro da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado

Sim

- String 128 caracteres

entrega_logradouro__em	
Filtro de busca logradouro da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

entrega_bairro	
Filtro de busca bairro da pessoa que irá receber a entrega

Sim

- String 128 caracteres

entrega_bairro__contem	
Filtro de busca bairro da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado

Sim

- String 128 caracteres

entrega_bairro__em	
Filtro de busca bairro da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

entrega_cep	
Filtro de busca cep da pessoa que irá receber a entrega

Sim

- String 10 caracteres

entrega_cep__contem	
Filtro de busca cep da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado

Sim

- String 10 caracteres

entrega_cep__em	
Filtro de busca cep da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

entrega_cidade	
Filtro de busca por cidade de entrega

Sim

- String 200 caracteres

entrega_cidade__contem	
Filtro de busca por cidade de entrega | Valor do campo contem que o valor do parametro informado

Sim

- String 200 caracteres

entrega_cidade__em	
Filtro de busca por cidade de entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

entrega_uf	
Filtro de busca unidade federativa da pessoa que irá receber a entrega

Sim

- String 32 caracteres

entrega_uf__contem	
Filtro de busca unidade federativa da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado

Sim

- String 32 caracteres

entrega_uf__em	
Filtro de busca unidade federativa da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

comentario	
Filtro de busca por comentario

Sim

- String 65535 caracteres

comentario__contem	
Filtro de busca por comentario | Valor do campo contem que o valor do parametro informado

Sim

- String 65535 caracteres

comentario__em	
Filtro de busca por comentario | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

valor_total	
Filtro de busca por valor total

Sim

- Double(15, 4)

valor_total__maior_igual	
Filtro de busca por valor total | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Double(15, 4)

valor_total__menor_igual	
Filtro de busca por valor total | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Double(15, 4)

valor_total__contem	
Filtro de busca por valor total | Valor do campo contem que o valor do parametro informado

Sim

- Double(15, 4)

valor_total__em	
Filtro de busca por valor total | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

status_id	
Filtro de busca por id do status

Sim

- Inteiro(11)

status_id__maior_igual	
Filtro de busca por id do status | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(11)

status_id__menor_igual	
Filtro de busca por id do status | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(11)

status_id__em	
Filtro de busca por id do status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

status	
Filtro de busca por status

Sim

- Inteiro(1)

status__maior_igual	
Filtro de busca por status | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(1)

status__menor_igual	
Filtro de busca por status | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(1)

status__em	
Filtro de busca por status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

status_descricao	
Filtro de busca por descrição do status

Sim

- String 64 caracteres

status_descricao__contem	
Filtro de busca por descrição do status | Valor do campo contem que o valor do parametro informado

Sim

- String 64 caracteres

status_descricao__em	
Filtro de busca por descrição do status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

moeda_codigo	
Filtro de busca por código ISO da moeda

Sim

- String 3 caracteres

moeda_codigo__contem	
Filtro de busca por código ISO da moeda | Valor do campo contem que o valor do parametro informado

Sim

- String 3 caracteres

moeda_codigo__em	
Filtro de busca por código ISO da moeda | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

data_adicionado	
Filtro de busca por data que o pedido foi adicionado

Sim

- Data no formato Y-m-d H:i:s

data_adicionado__maior_igual	
Filtro de busca por data que o pedido foi adicionado | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_adicionado__menor_igual	
Filtro de busca por data que o pedido foi adicionado | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_adicionado__contem	
Filtro de busca por data que o pedido foi adicionado | Valor do campo contem que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_adicionado__em	
Filtro de busca por data que o pedido foi adicionado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

data_modificado	
Filtro de busca por data que o pedido foi modificado

Sim

- Data no formato Y-m-d H:i:s

data_modificado__maior_igual	
Filtro de busca por data que o pedido foi modificado | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_modificado__menor_igual	
Filtro de busca por data que o pedido foi modificado | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_modificado__contem	
Filtro de busca por data que o pedido foi modificado | Valor do campo contem que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_modificado__em	
Filtro de busca por data que o pedido foi modificado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

loja_documento	
Filtro de busca para loja_documento

Sim

- String 65535 caracteres

loja_documento__contem	
Filtro de busca para loja_documento | Valor do campo contem que o valor do parametro informado

Sim

- String 65535 caracteres

loja_documento__em	
Filtro de busca para loja_documento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

cancelado	
Filtro de busca por pedidos que foram ou não cancelados (1 para sim, 0 para não)

Sim

- Inteiro(1)

cancelado__maior_igual	
Filtro de busca por pedidos que foram ou não cancelados (1 para sim, 0 para não) | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(1)

cancelado__menor_igual	
Filtro de busca por pedidos que foram ou não cancelados (1 para sim, 0 para não) | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(1)

cancelado__em	
Filtro de busca por pedidos que foram ou não cancelados (1 para sim, 0 para não) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

data_cancelamento	
Filtro de busca por data de cancelamento do pedido

Sim

- Data no formato Y-m-d H:i:s

data_cancelamento__maior_igual	
Filtro de busca por data de cancelamento do pedido | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_cancelamento__menor_igual	
Filtro de busca por data de cancelamento do pedido | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_cancelamento__contem	
Filtro de busca por data de cancelamento do pedido | Valor do campo contem que o valor do parametro informado

Sim

- Data no formato Y-m-d H:i:s

data_cancelamento__em	
Filtro de busca por data de cancelamento do pedido | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-

campos_personalizados	
Filtro de busca por campos personalizados dos pedidos, deve ser informado com array onde a posição é a chave do campo desejado e o valor é o valor do campo, exemplo: campos_personalizados[campo_1]=10

Sim

-

market_place	
Filtro de busca por pedidos de market place

Sim

- Inteiro(0)

market_place__maior_igual	
Filtro de busca por pedidos de market place | Valor do campo é maior ou igual que o valor do parametro informado

Sim

- Inteiro(0)

market_place__menor_igual	
Filtro de busca por pedidos de market place | Valor do campo é menor ou igual que o valor do parametro informado

Sim

- Inteiro(0)

market_place__em	
Filtro de busca por pedidos de market place | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"]

Sim

-


Resposta 200 OK
Exemplo de resposta gerada em caso de sucesso no consumo do serviço

HTTP/1.1 200 OK
Content-Type: application / json; charset = utf - 8

{
  "pedidos": [
    {
      "id": "24562",
      "distribuidor_indicador_id": "1243",
      "distribuidor_comprador_id": "987567",
      "loja_id": "0",
      "loja_nome": "Loja Virtual Padrão",
      "cliente_id": "12342",
      "tipo_id": "102",
      "tipo_chave": "cliente_inativo",
      "tipo_nome": "Comprando Ativação",
      "tipo_descricao": "Cliente comprando ativação",
      "cliente_nome": "Lindovaldo",
      "cliente_sobrenome": "Silva",
      "cliente_email": "lindovaldo_silva@provedor.com",
      "cliente_telefone": "62988556644",
      "cliente_tipo_pessoa_id": "1",
      "cliente_rg": "9856535",
      "cliente_cpf": "85566998542",
      "cliente_cnpj": "75985000136",
      "cliente_ie": "985693",
      "pagamento_confirmado": "1",
      "comanda_impressao": "0",
      "fatura_impressao": "1",
      "necessita_frete": "1",
      "data_pagamento": "2017-12-07 12:05:05",
      "cliente_logradouro": "Rua falsa 123",
      "cliente_bairro": "Guanabara",
      "cliente_cep": "74938120",
      "cliente_numero": "340",
      "cliente_complemento": "próximo ao shopping",
      "cliente_cidade": "Goiania",
      "cliente_uf": "Goias",
      "entrega_nome": "Osvaldete",
      "entrega_sobrenome": "Carvalho",
      "entrega_logradouro": "Rua fictícia 3211",
      "entrega_bairro": "Mansões Paraiso",
      "entrega_cep": "74986183",
      "entrega_numero": "340",
      "entrega_complemento": "próximo ao shopping",
      "entrega_cidade": "Goiania",
      "entrega_uf": "Goias",
      "valor_total": "157.8",
      "status_id": "3",
      "status_descricao": "Pagamento Confirmado",
      "moeda_codigo": "BRL",
      "data_adicionado": "2017-12-07 12:05:05",
      "data_modificado": "2017-12-07 12:05:05",
      "loja_documento": "12034723000190",
      "entrega_transportadora_codigo": "correios",
      "entrega_transportadora_nome": "Correios",
      "pagamento_metodo_descricao": "PagSeguro",
      "pagamento_metodo_codigo": "pagseguro",
      "comentario": "Comentário do pedido",
      "itens": [
        {
          "item_id": "153",
          "produto_id": "1565",
          "produto_descricao": "Chinelo Brocs",
          "produto_modelo": "chinelo_brocs_001",
          "quantidade": "3",
          "valor_unitario": "100.00",
          "valor_total": "200.00",
          "produto_opcoes": [
            {
              "pedido_produto_opcao_id": "1",
              "nome": "Cor",
              "valor": "Azul",
              "produto_opcao_id": "1",
              "produto_opcao_valor_id": "3",
              "produto_opcao_sku": "DB-DF-38127"
            }
          ]
        }
      ],
      "cancelado": "1",
      "data_cancelamento": "2017-12-07 12:05:05",
      "campos_personalizados": [
        {
          "nome": "Campo 1",
          "chave": "campo_1",
          "valor": "1.00",
          "valor_formatado": "1.00%"
        }
      ],
      "totais": [
        {
          "id": "1",
          "codigo": "total",
          "titulo": "Total",
          "valor": "10.00"
        }
      ]
    }
  ]
}
Descrição dos atributos que são retornados ao acessar o serviço
Atributo	Descrição	Tipo
pedidos[].id	
Id do pedido gerado na loja virtual

- Inteiro(11)

pedidos[].distribuidor_indicador_id	
Id do distribuidor que indicou ou divulgou a loja virtual através de seu link de divulgação para tornar possível identificação e comissionamento do divulgador, este campo deve ser usado apenas para clientes do tipo 'cliente_final'

- Inteiro(11)

- Distribuidor não existe

pedidos[].distribuidor_comprador_id	
Id do distribuidor que possui a conta do cliente relacionado que realizou a compra

- Inteiro(11)

- Distribuidor não existe

pedidos[].loja_id	
Id da loja virtual ou distribuidora que recebeu o pedido

- Inteiro(11)

pedidos[].loja_nome	
Nome da loja ou distribuidora que recebeu o pedido

- String 64 caracteres

pedidos[].cliente_id	
Id do cadastro na loja virtual do cliente que realizou a compra

- Inteiro(11) unsigne)

pedidos[].tipo_id	
Id do grupo de consumo ou tipo de compra, do pedido

- Inteiro(11)

pedidos[].tipo_chave	
Chave do tipo de grupo de consumo do pedido

- String 50 caracteres

pedidos[].tipo_nome	
Nome do tipo de grupo de consumo do pedido

- String 200 caracteres

pedidos[].tipo_descricao	
Descrição do tipo de grupo de consumo do pedido

- String 65535 caracteres

pedidos[].cliente_nome	
Nome do cliente que realizou o pedido

- String 32 caracteres

pedidos[].cliente_sobrenome	
Sobrenome do cliente

- String 32 caracteres

pedidos[].cliente_email	
Email do cliente

- String 96 caracteres

pedidos[].cliente_telefone	
Telefone do cliente

- String 32 caracteres

pedidos[].cliente_tipo_pessoa_id	
Id do Tipo de pessoa do cliente

pedidos[].cliente_rg	
Rg do cliente

- String 50 caracteres

pedidos[].cliente_cpf	
Cpf do cliente

- String 45 caracteres

pedidos[].cliente_cnpj	
Cnpj do cliente

- String 200 caracteres

pedidos[].cliente_ie	
Inscrição estadual do cliente

- String 50 caracteres

pedidos[].pagamento_confirmado	
Situação do pagamento do pedido ('1' para pago e '0' para não pago) - Caso seja informado valor '1', para pedido 'pago', após realizar a compra o sistema automaticamente irá efetuar seu pagamento e rodar todos gatilhos da baixa da compra.

- Inteiro(1)

pedidos[].comanda_impressao	
Representa se a comanda foi impressa ou não

- Inteiro(1)

pedidos[].fatura_impressao	
Representa se a fatura foi impressa ou não

- Inteiro(1)

pedidos[].necessita_frete	
Retorna se o pedido necessita de frete ou não

- Inteiro(1)

pedidos[].data_pagamento	
Data de pagamento do pedido

- Data no formato Y-m-d H:i:s

pedidos[].cliente_logradouro	
Logradouro do endereço do cliente

- String 128 caracteres

pedidos[].cliente_bairro	
Bairro do endereço do cliente

- String 128 caracteres

pedidos[].cliente_cep	
Cep ou codigo postal do cliente

- String 10 caracteres

pedidos[].cliente_numero	
Numero do endereço do cliente

pedidos[].cliente_complemento	
complemento do endereço do cliente

- String 65535 caracteres

pedidos[].cliente_cidade	
Cidade do endereço do cliente

- String 200 caracteres

pedidos[].cliente_uf	
Unidade federativa do endereço do cliente

- String 32 caracteres

pedidos[].entrega_nome	
Nome do recebedor da entrega

- String 32 caracteres

pedidos[].entrega_sobrenome	
Sobrenome do recebedor da entrega

- String 32 caracteres

pedidos[].entrega_logradouro	
Logradouro do endereço de entrega

- String 128 caracteres

pedidos[].entrega_bairro	
Bairro do endereço de entrega

- String 128 caracteres

pedidos[].entrega_cep	
Cep ou codigo postal do endereço de entrega

- String 10 caracteres

pedidos[].entrega_numero	
Numero do endereço de entrega

pedidos[].entrega_complemento	
Complemento do endereço de entrega

- String 65535 caracteres

pedidos[].entrega_cidade	
Cidade do endereço de entrega

- String 200 caracteres

pedidos[].entrega_uf	
Unidade federativa do endereço de entrega

- String 32 caracteres

pedidos[].valor_total	
Valor total do pedido

- Double(15, 4)

pedidos[].status_id	
Id do status do pedido

- Inteiro(11)

pedidos[].status_descricao	
Descrição do status do pedido

- String 64 caracteres

pedidos[].moeda_codigo	
Código ISO da moeda de pagamento

- String 3 caracteres

pedidos[].data_adicionado	
Data que o pedido foi adicionado

- Data no formato Y-m-d H:i:s

pedidos[].data_modificado	
Data em que o pedido foi modificado a ultima vez

- Data no formato Y-m-d H:i:s

pedidos[].loja_documento	
CNPJ da loja que emitiu o pedido

- String 65535 caracteres

pedidos[].entrega_transportadora_codigo	
Código da transportadora escolhida para entrega do pedido

- String 128 caracteres

pedidos[].entrega_transportadora_nome	
Nome da transportadora escolhida para entrega do pedido

- String 65535 caracteres

pedidos[].pagamento_metodo_descricao	
Nome do tipo de pagamento escolhido para o pedido

- String 128 caracteres

pedidos[].pagamento_metodo_codigo	
Código do tipo de pagamento escolhido para o pedido

- String 128 caracteres

pedidos[].comentario	
Comentário ou observação anexada ao pedido, caso o cliente tenha adicionado alguma observação / comentário ao pedido

- String 65535 caracteres

pedidos[].itens[].item_id	
Id do item

- Inteiro(10)

pedidos[].itens[].produto_id	
Id do produto

- Inteiro(10)

pedidos[].itens[].produto_descricao	
Descrição do produto

- String 255 caracteres

pedidos[].itens[].produto_modelo	
Modelo do produto

- String 255 caracteres

pedidos[].itens[].quantidade	
Quantidade do produto

- Inteiro(10)

pedidos[].itens[].valor_unitario	
Valor unitário do produto

- Double(15, 2)

pedidos[].itens[].valor_total	
Valor total do item

- Double(15, 2)

pedidos[].itens[].produto_opcoes[].pedido_produto_opcao_id	
Id do registro da opção no pedido

- Inteiro(10)

pedidos[].itens[].produto_opcoes[].nome	
Nome da opção

- String 255 caracteres

pedidos[].itens[].produto_opcoes[].valor	
Valor da opção

- String 255 caracteres

pedidos[].itens[].produto_opcoes[].produto_opcao_id	
Id da opção do produto

- Inteiro(10)

pedidos[].itens[].produto_opcoes[].produto_opcao_valor_id	
Id do valor da opção

- Inteiro(10)

pedidos[].itens[].produto_opcoes[].produto_opcao_sku	
SKU da opção do produto

- String 255 caracteres

pedidos[].cancelado	
Pedido foi cancelado (1 para sim, 0 para não)

- Inteiro(1)

pedidos[].data_cancelamento	
Data de cancelamento do pedido, caso o mesmo tenha sido cancelado

- Data no formato Y-m-d H:i:s

pedidos[].campos_personalizados[].nome	
Nome do tipo de campo

pedidos[].campos_personalizados[].chave	
Chave do tipo de campo

- String 128 caracteres

pedidos[].campos_personalizados[].valor	
Valor do campo

- String 65535 caracteres

pedidos[].campos_personalizados[].valor_formatado	
Valor do campo formatado

pedidos[].totais[].id	
Id

- Inteiro(13)

pedidos[].totais[].codigo	
Código do total

- String 65535 caracteres

pedidos[].totais[].titulo	
Título do total

- String 65535 caracteres

pedidos[].totais[].valor	
Valor do total

- Double(15, 4)

Resposta 4xx ou 5xx
Essa resposta é gerada em caso de erro no consumo do serviço

Consulte a sessão de erros para saber detalhadamente os erros que podem ser gerados na resposta e possíveis soluções