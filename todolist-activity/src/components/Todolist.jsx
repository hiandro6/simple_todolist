import "./Todolist.css";
import { useState } from "react";

export default function Listar() {
  const [tarefa, setTarefa] = useState("");
  const [lista, setLista] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tarefa) {
      return;
    }

    //tarefa agora passa a ser um objeto. Com isso adiconamos o status e o seu id (função para gerar aleatória)
    const novaTarefa = {
      id: Math.floor(Math.random() * 10000),
      texto: tarefa,
      status: false,
      prioridade: "a-definir",
    };

    setLista([...lista, novaTarefa]);
    setTarefa("");
  };

  //função para alterar o status da tarefa. Aqui optamos por trabalhar com dois estados: concluída ou não.
  const handleToggle = (id) => {
    
    setLista(
      lista.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  //função mais 'complexa'. Aqui vamo reposicionar a tarefa no array lista de forma incremental.
  const handleMove = (id, direcao) => {
    //o método finIndex retorna o index do elemento que satisfaz alguma condição. Aqui estamos utilizando para
    //retornar o index do elemento que tem o id igual ao que foi passado para a função handleMove.
    //Perceba que aqui o index é diferente do id.

    const indice = lista.findIndex((item) => item.id === id);

    //condições extraordinárias

    if (
      (indice === 0 && direcao === "subir") ||
      (indice === lista.length - 1 && direcao === "descer")
    ) {
      return;
    }

    const novaLista = [...lista]; //copia da lista original
    //splice modifica array, removendo ou inserindo elemento. Ele retorna o array modificado. Aqui está sendo removido 1 elementos na posição indice.
    //esse elemento removido é a saída de splice em forma de um novo array. A notação [0] é utilizada para indicar o primeiro elemento do array de retorno.
    //Por fim, itemMovido irá armazenar o elemento que precisa ser movido.
    const itemMovido = novaLista.splice(indice, 1)[0];

    //veririca em que sentido deve ser movido o item e faz o incremento ou decremento do seu indice.
    const novoIndice = direcao === "subir" ? indice - 1 : indice + 1;

    //reposicionamento do elemento. Na posição novoIndice, remove-se 0 elementos e adiciona itemMovido
    novaLista.splice(novoIndice, 0, itemMovido);

    setLista(novaLista);
  };

  const handleClear = () => {
    if (lista.length === 0) {
      return;
    } else {
      let r = confirm("Ao confirmar, todas as tarefas serão removidas. Deseja continuar?");
      if (r) {
        setLista([]);
      }
  }
  };

  const deletarTarefa = (id) => {
    const r = window.confirm("Você deseja apagar essa tarefa?");
    if (r) {
      const novaLista = lista.filter((item) => item.id !== id);
      setLista(novaLista);
    } else { return; }
  };

  const changePrioridade = (id, novaPrioridade) => {
    const novaLista = lista.map((item) =>
      item.id === id ? { ...item, prioridade: novaPrioridade } : item
    );
    setLista(novaLista);
  };

  const changeFiltro = (filtroSelecionado) => {
    setFiltro(filtroSelecionado);
  };

  const listaFiltrada = lista.filter(
    (
      item /* faz o teste para cada item, se passar no teste a função retorna true e o item é mantido na nova lista, se retornar false o item é descartado*/
    ) => (filtro === "todas" ? true : item.prioridade === filtro)
  );

  return (
    <div className="todo">
      <h1>Lista de Tarefas</h1>
      <div className="line"></div>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            onChange={(e) => setTarefa(e.target.value)}
            value={tarefa}
            placeholder="Adicione uma tarefa"
          />
        </label>

        <input type="submit" value="Adicionar" className="task" />
      </form>

      <button onClick={handleClear} className="reset">Reset</button>

      <div className="filtro">
        <h3>Filtrar tarefas:</h3>
        <select
          name="select-filtrar"
          id="select-filtrar"
          onChange={(e) => changeFiltro(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="baixa-prioridade">Baixa prioridade</option>
          <option value="média-prioridade"> Média prioridade</option>
          <option value="alta-prioridade"> Alta prioridade</option>
        </select>
      </div>

      <ul className="filtro">
        {listaFiltrada.map((item, index) => (
          <li
            key={item.id}
            className={`${item.prioridade} ${item.status ? "concluida" : ""}`}
          >
            <div className="controles-ordem">
              <button
                onClick={() => handleMove(item.id, "subir")}
                disabled={index === 0} // Desabilita o botão se for o primeiro item
                title="Mover para cima"
              >
                ↑
              </button>
              <button
                onClick={() => handleMove(item.id, "descer")}
                disabled={index === lista.length - 1} // Desabilita se for o último
                title=" Mover para baixo"
              >
                ↓
              </button>
            </div>
            <span className="titulo">{item.texto}</span>
            <button onClick={() => handleToggle(item.id)}>
              {item.status ? "Desmarcar" : "Concluir"}
            </button>
            <button onClick={() => deletarTarefa(item.id)} id="botao-deletar">
              Apagar
            </button>
            <span>Prioridade:</span>
            <select
              name="select-prioridade"
              id="select-prioridade"
              value={item.prioridade}
              onChange={(e) => changePrioridade(item.id, e.target.value)}
            >
              
              <option value="a-definir">Não definida</option>
              <option value="baixa-prioridade">Baixa prioridade</option>
              <option value="média-prioridade">Média prioridade</option>
              <option value="alta-prioridade">Alta prioridade</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
