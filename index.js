// Declarando variaveis e mensagem de inicio

const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem-vindo ao Metapps";

let metas

const carregarMetas = async () => { 
    //Carrega o arquivo metas.json para usar o array criado dele como uma base de dados
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(error){
        metas = []
    }
}

const salvaMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2)) //Converte o arquivo em json para proceder com a escrita alem de configura o arquivo
}

// Menu parte cadastrar metas
const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta: "})

    if(meta.lenght == 0) { //Valida se o campo está vazio
        mensagem = "A meta não pode ser vazia"
        return
    }
//Faz adicionar novamente uma nova meta na variavel meta em adição
    metas.push(
        { value: meta, checked: false }
    ) 
    mensagem = "Meta cadastrado com sucesso!"
 }

// Menu parte listar metas
const listarMetas = async () => {
    if(metas.lenght == 0){
        mensagem = "Não existem metas!"
        return
    }
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => { //Aplica correção para as validações que não desmarcava
        m.checked = false
    })

    if(respastas.lenght == 0)
    {
        mensagem = "Nenhuma meta selecionada!"
        return
    }
// Para cada resposta ele faz a validação com a variavel meta e valida se bate os dois elementos pra retornas como true
    respostas.forEach((resposta) => { 
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    }) 

    mensagem = "Meta(s) marcadas como concluida(s)"
}

//Parte Menu Realizadas as metas - Validação
const metasRealizadas = async() => {
    if(metas.lenght == 0){
        mensagem = "Não existem metas!"
        return
    }
    const realizadas = metas.filter((meta) =>{
        return meta.checked
    })
    if(realizadas.lenght == 0){
        mensagem = "Não existem metas realizadas"
        return
    }
    await select({
        message: "Metas realizadas:" + realizadas.length,
        choices: [...realizadas] //cria uma lista de atividades realizadas
    })
}

const metasAbertas = async () => {
    if(metas.lenght == 0){
        mensagem = "Não existem metas!"
        return
    }
    const abertas = metas.filter((meta) =>{
        return meta.checked != true
        //Quando coloca a ! na frente Exemplo: return !meta.checked está invertendo o valor do Booleano no caso falso é igual a verdadeiro

    })
    if(abertas.lenght == 0){
        mensagem = "Não existem metas abertas"
        return
    }
    await select({
        message: "Metas abertas:" + abertas.lenght, //Mostra o total de metas em aberto
        choices: [...abertas]

    })
}

// Menu deletar uma meta
const deletarMetas = async () => {
    if(metas.lenght == 0){
        mensagem = "Não existem metas!"
        return
    }
    const metasDesmarcadas = metas.map((meta) => { //Devolve um novo array so que modificado
        return {value: meta.value, checked: false}
    })

    const itensADeletar = await checkbox({
        message: "Selecione um item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })
    if(itensADeletar.leght == 0){
        mensagem = "Nenhum item para deletar"
        return
    }
    //processo de exclusão
    itensADeletar.forEach((item) =>{
            metas = metas.filter((meta) =>{
                return meta.value != item
            })
    })
    mensagem = "Meta(s) deleta(s) com sucesso"
}

const mostrarMensagem = () => {
    console.clear(); //Faz a limpeza do texto
    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

// Inicio da aplicação o Start
const start = async () => {
    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select ({
            message: "Menu >",
            choices: [ //cria um array para as escolhas do Menus
                {
                    name: "Cadastra meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar netas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ] 
        })
        //Opções de retorno na tela
        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break   
            case "deletar":
                await deletarMetas()
                break   
            case "sair":
                console.log("Até a proxima")
                return  
    }}}

start()

























