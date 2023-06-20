
/* EXERCÍCIO VALIDADOR DE CPF'S

Este exercício tem como objetivo a criação de um algoritmo para verificar se um número de CPF informado é válido ou não. Primeiramente, precisamos entender a estrutura de um número de CPF e como ele é formado e validado;

Um número de CPF SEMPRE é composto por 11 dígitos, sendo que os dois últimos, separados por um traço, são chamados de "verificadores". Estes verificadores têm a função de validar os 9 primeiros dígitos e dizer se são criados seguindo a regra estipulada. Isto evita fraudes ou possíveis erros de digitação;

Os verificadores são criados com base nas fórmulas a seguir:

Verificador 1:

Primeiro, calculamos a seguinte soma: A*10 + B*9 + C*8 + D*7 + E*6 + F*5 + G*4 + H*3 + I*2, onde as letras de A a I correspondem aos primeiros números do CPF, da esquerda para a direita;

Em seguida, calculamos o RESTO da divisão deste somatório por 11;

Avaliamos o valor do resto: se for 0 ou 1, o valor do verificador será 0; se for maior ou igual a 2 e menor ou igual a 10, o valor do verificador será (11 - RESTO);

Verificador 2:

Faremos agora a soma incluindo o primeiro verificador, e começando com 11: A*11 + B*10 + C*9 + D*8 + E*7 + F*6 + G*5 + H*4 + I*3 + VERIFICADOR1*2;

Calculamos também o valor do RESTO da divisão da soma por 11 e fazemos a mesma avaliação do primeiro verificador, e chegamos ao valor do segundo verificador.

CONDIÇÕES PARA UM CPF SER VÁLIDO:

1) Os números de um CPF nunca podem ser iguais entre si, como por exemplo: 222.222.222-22;

2) Os dois dígitos verificadores devem ser condizentes com o resultado da fórmula criada.

*/

// ----------------------------------------------------------------------------------------------------------------//

// ALGORITMO (RESOLUÇÃO UTILIZANDO O MÉTODO "MAP" E LOOP "FOR" PARA DEFINIÇÃO DOS DÍGITOS VERIFICADORES)

// Primeiramente precisamos de uma Função Construtora que receberá como parâmetros uma string contendo os números do CPF a ser validado. Precisaremos também de métodos para fazer o tratamento da string, pré-validações, e cálculo dos dígitos verificadores, para então retornar se é um CPF válido ou não;


const formInput = document.getElementsByClassName('inputCpf')[0]
const btnAnalisar = document.querySelector('button.btn-analisar')
const btnLimpar = document.querySelector('button.btn-limpar')
let resposta = document.querySelector('div.resposta>p')
let cpfFormulario = ''

formInput.addEventListener('blur', arrumaFormulario)
formInput.addEventListener('focus', voltaFormulario)
btnLimpar.addEventListener('click', limpaFormulario)
btnAnalisar.addEventListener('click', criaCPF)

function arrumaFormulario() {
    formInput.value = formInput.value.replace(/\D+/g, '')
    formInput.value = formInput.value.slice(0, 3) + '.' + formInput.value.slice(3, 6) + '.' + formInput.value.slice(6, 9) + '-' + formInput.value.slice(9, 11)
    cpfFormulario = formInput.value
}

function voltaFormulario(){
    formInput.value = formInput.value.replace(/\D+/g, '')
}

function limpaFormulario(){
    formInput.value = ''
    cpfFormulario = ''
    resposta.innerHTML = 'Estamos analisando o CPF informado ...'
}

function criaCPF() {
    let cpf1 = new ValidaCPF(cpfFormulario) // Objeto criado através da Função ValidaCPF, com argumento "cpfFormulario" entrado manualmente;
    cpf1.valida()
}

function ValidaCPF(cpfFormulario) {

    Object.defineProperty(this, 'cpfLimpo', { // Criamos um método "cpfLimpo" para retirar todos caracteres que não sejam números da string obtida do formulário, e retornar uma nova string;
        get: function () { return cpfFormulario.replace(/\D+/g, '') }, // A expressão regular "/\D+/g" seleciona na string todo caracter que não é número;
        enumerable: true,
    })

    Object.defineProperty(this, 'cpfParcial', { // Método criado para retirar os dígitos verificadores da string obtida do formulário, retornando uma string com 9 dígitos;
        get: function () { return this.cpfLimpo.slice(0, -2) },
        enumerable: true
    })
}

ValidaCPF.prototype.valida = function () { // Método criado para fazer todas as verificações e retornar se o CPF é válido ou não;

    if (this.cpfLimpo === '') { // Caso não seja inserido nenhum valor no formulário ou seja do tipo "undefined";
        return resposta.innerHTML = 'É necessário informar um número de CPF.'
    } 
    if (this.cpfLimpo.length !== 11) { // Caso a string informada no formulário tenha menos que 11 caracteres;
        return resposta.innerHTML = 'O número do CPF deve conter 11 dígitos.'
    } 
    if (this.verificaSequencia() === true) { // Método criado para verificar se todos os dígitos do CPF são iguais entre si;
        return resposta.innerHTML = 'CPF inválido!'
    } 
    if (this.novoCPF() === this.cpfLimpo) {
        return resposta.innerHTML = 'CPF válido!'
    } else {}
        return resposta.innerHTML = 'CPF inválido!' 
        
    // Para verificar, finalmente, se o CPF é válido ou não, devemos comparar os valores obtidos para os dígitos verificadores 1 e 2 com os do CPF obtido do formulário. Para isso, basta comparar as duas strings, que devem ser idênticas;   
}

ValidaCPF.prototype.novoCPF = function () { // Método criado para retornar o CPF obtido através do cálculo dos dígitos verificadores;

    const digito1 = this.digito(this.cpfParcial) // A constante "digito1" vai receber o valor retornado do método "digito()", utilizando como argumento o valor da propriedade "cpfParcial";
    const digito2 = this.digito(this.cpfParcial + digito1) // O valor do segundo dígito verificador virá do mesmo método "digito()", porém dessa vez passaremos como argumento o valor da propriedade "cpfParcial" concatenado com o valor obtido da variável "digito1";
    const novoCPF = this.cpfParcial + digito1 + digito2

    return novoCPF
}

ValidaCPF.prototype.digito = function (cpfDigito) { // Método para calcular e retornar os dígitos verificadores;

    const cpfArrayString = Array.from(cpfDigito) // Transformando o argumento fornecido no método "valida()" em array
    const cpfArray = cpfArrayString.map(function (string) { return Number(string) }) // Transformando todos os caracteres do array recém criado de strings para numbers, afim de possibilitar os cálculos matemáticos, através do método "map". Este método percorre todo o array e executa uma função em cada elemento, e depois retorna um novo array modificado;

    let somatorio = Number('')

    for (let i = 0; i <= cpfArray.length - 1; i++) { // Laço para somar todos os valores, segundo a fórmula do CPF;
        somatorio = somatorio + (cpfArray[i]) * ((cpfArray.length + 1) - i)
    }

    const resto = (somatorio % 11)
    var digito = Number('')

    if (resto === 0 || resto === 1) {
        var digito = 0
    } else {
        var digito = (11 - resto)
    }

    return String(digito)
}

ValidaCPF.prototype.verificaSequencia = function () { // Método para verificar se todos os números do CPF são iguais entre si;
    const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length) // Utilizamos o método "repeat()" para repetir todos os caracteres da posição [0] de "cpfLimpo" e retornar um novo array. Em seguida, comparamos este array com a propriedade "cpfLimpo". Se forem iguais, o método retorna "true" e significa que todos os números do CPF são iguais entre si. Lembrete: basta um dígito do CPF ser diferente dos demais para este ser elegível como válido!;
    if (sequencia === this.cpfLimpo) {
        return true
    }
}


