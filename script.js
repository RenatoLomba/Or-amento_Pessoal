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

class Modal {

    constructor() {
        this.title
        this.header
        this.body
        this.button
    }

    criarModal() {
        this.title = document.getElementById('modal_title')
        this.header = document.getElementById('modal_header')
        this.body = document.getElementById('modal_body')
        this.button = document.getElementById('modal_button')
    }

    Sucesso() {
        this.header.classList.remove('text-success', 'text-danger')
        this.button.classList.remove('btn-success', 'btn-danger')
        this.title.innerHTML = 'Sucesso'
        this.header.classList.add('text-success')
        this.body.innerHTML = 'Dados cadastrados com sucesso'
        this.button.classList.add('btn-success')
        $('#modalRegistraDespesa').modal('show')
    }

    Erro(titulo, mensagem) {
        this.header.classList.remove('text-success', 'text-danger')
        this.button.classList.remove('btn-success', 'btn-danger')
        this.title.innerHTML = titulo
        this.header.classList.add('text-danger')
        this.body.innerHTML = mensagem
        this.button.classList.add('btn-danger')
        $('#modalRegistraDespesa').modal('show')
    }
}
let modal = new Modal()

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
            despesa.id = i
            lista_despesas.push(despesa)
        }

        return lista_despesas
    }

    pesquisar(d) {
        let despesas_filter = this.recuperarRegistros()
        modal.criarModal()
        
        if(d.ano != '') { despesas_filter = despesas_filter.filter(f => f.ano == d.ano) }
        if(d.mes != '') { despesas_filter = despesas_filter.filter(f => f.mes == d.mes) }
        if(d.dia != '') { despesas_filter = despesas_filter.filter(f => f.dia == d.dia) }
        if(d.tipo != '') { despesas_filter = despesas_filter.filter(f => f.tipo == d.tipo) }
        if(d.descricao != '') { despesas_filter = despesas_filter.filter(f => f.descricao == d.descricao) }
        if(d.valor != '') { despesas_filter = despesas_filter.filter(f => f.valor == d.valor) }

        if(despesas_filter == 0) {
            modal.Erro('Pesquisa concluída', 'Não foi encontrada nenhuma despesa com estes filtros...')
            return this.recuperarRegistros()
        } else {
            return despesas_filter
        }
        
    }

    remover(id) {
        localStorage.removeItem(id)
    }

}
let bd = new BD()

//Funções
function cadastrarDespesa() {
    
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    validacaoTotal(despesa, despesa.validarDados())

}

function validacaoTotal(despesa, validacao) {

    modal.criarModal()

    if(validacao) {
        bd.gravar(despesa)
        modal.Sucesso()
        limparCampos()
    } else {
        modal.Erro('Erro', 'Preencher todos os campos corretamente...')
    }

}

function listarTodasDespesas() {
    carregarListaDespesas(bd.recuperarRegistros())
}

function carregarListaDespesas(parametroBusca) {
    let lista_despesas = parametroBusca
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

        let btn = document.createElement("button")
        btn.className = "btn btn-danger"
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            bd.remover(d.id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)

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

function limparDespesas() {
    let lista_despesas = bd.recuperarRegistros()
    let tabelaDespesas = document.getElementById('tabelaDespesas')

    for(let i = 0; i < lista_despesas.length; i++) {
        tabelaDespesas.deleteRow(-1)
    }
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    limparDespesas()

    carregarListaDespesas(bd.pesquisar(despesa))
}