import './Todolist.css'
import { useState } from 'react'

export default function Todolist() {
  const [tarefa, setTarefa] = useState('');
  const [lista, setLista] = useState([]);
  const [ordem, setOrdem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tarefa.trim() !== "") {    /* trim remove os espaços em branco no começo e fim */
      setLista([...lista, { nome: tarefa, status: "pendente" }]);
      setTarefa('');
    }
  };

  const handleStatusChange = (index, novoStatus) => {
    const novaLista = [...lista];
    novaLista[index].status = novoStatus;
    setLista(novaLista);
  };

  const listaOrdenada = lista.slice().sort((a, b) => {
    if (ordem === "crescente") return a.nome.localeCompare(b.nome);
    if (ordem === "decrescente") return b.nome.localeCompare(a.nome);
    return 0;
  });

  return (
    <div>
      <h2>Lista de Tarefas React</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="tarefa"
          value={tarefa}
          onChange={(e) => setTarefa(e.target.value)}
        />
        <input type="submit" value="Adicionar" />
      </form>

      <ul>
        {listaOrdenada.map((item, index) => (
          <li key={index}>
            <strong>{item.nome}</strong> - Status: {item.status} -
            
            <select
              value={item.status}
              onChange={(e) => handleStatusChange(index, e.target.value)}
            >
              <option value="concluida">concluída</option>
              <option value="pendente">pendente</option>
              <option value="não realizada">não realizada</option>
            </select>
          </li>
        ))}
      </ul>

      <select
        name="ordem"
        id="ordem"
        value={ordem}
        onChange={(e) => setOrdem(e.target.value)}
      >
        <option value="sem ordem">sem ordem</option>
        <option value="crescente">crescente</option>
        <option value="decrescente">decrescente</option>
      </select>

      <h2>suas tarefas estão em ordem {ordem}</h2>
    </div>
  );
}
