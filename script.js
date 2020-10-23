//Classes
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        //percorre todos os atributos do próprio objeto
        for(let i in this) {
            //acessa o valor do atributo na posição i
            if(this[i] == '' || this[i] == undefined || this[i] == null) {
                return false
            }
        }

        return true
    }

}

class BD {

    constructor() {
        let id = localStorage.getItem('id')

        if(id == null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoID() {
        let proxID = localStorage.getItem('id')
        return parseInt(proxID) + 1
    }

    gravar(d) {
        let id = this.getProximoID()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarRegistros() {
        let id = localStorage.getItem('id')
        let lista_despesas = Array()

        for(let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa == null) {
                continue
            }
            lista_despesas.push(despesa)
        }

        return lista_despesas
    }

    pesquisar(d) {
         
    }
}

let bd = new BD()

//Funções
function cadastrarDespesa() {
    let modal_title = document.getElementById('modal_title')
    let modal_header = document.getElementById('modal_header')
    let modal_body = document.getElementById('modal_body')
    let modal_button = document.getElementById('modal_button')

    modal_header.classList.remove('text-success', 'text-danger')
    modal_button.classList.remove('btn-success', 'btn-danger')
    
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    validacaoTotal(despesa, despesa.validarDados(), modal_title, modal_header, modal_body, modal_button)

}

function validacaoTotal(despesa, validacao, title, header, body, button) {

    if(validacao) {
        //bd.gravar(despesa)
        title.innerHTML = 'Sucesso'
        header.classList.add('text-success')
        body.innerHTML = 'Dados cadastrados com sucesso'
        button.classList.add('btn-success')
        $('#modalRegistraDespesa').modal('show')
        limparCampos()
    } else {
        title.innerHTML = 'Erro'
        header.classList.add('text-danger')
        body.innerHTML = 'Preencher todos os campos corretamente'
        button.classList.add('btn-danger')
        $('#modalRegistraDespesa').modal('show')
    }

}

function carregarListaDespesas() {
    let lista_despesas = bd.recuperarRegistros()
    let tabelaDespesas = document.getElementById('tabelaDespesas') //seleciona o tbody

    lista_despesas.forEach(function(d) {
        let linha = tabelaDespesas.insertRow() //insere linhas dentro do tbody (tr)

        //insere as colunas dentro da tr (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${("00" + d.mes).slice(-2)}/${d.ano}`

        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

    })
}

function limparCampos() {
    document.getElementById('ano').value = ""
    document.getElementById('mes').value = ""
    document.getElementById('dia').value = ""
    document.getElementById('tipo').value = ""
    document.getElementById('descricao').value = ""
    document.getElementById('valor').value = ""
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    bd.pesquisar(despesa)
}