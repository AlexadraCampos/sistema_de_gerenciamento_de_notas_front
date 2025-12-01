import { useState, useEffect } from "react";
import Login from './pages/login.jsx';
import "./styles/app.css";



function App() {
  const [alunos, setAlunos] = useState([]);
  const [materias, setMaterias] = useState(["", "", "", "", ""]);
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    notas: ["", "", "", "", ""],
    frequencia: "",
  });
  const [estatisticas, setEstatisticas] = useState(null);
  const [alerta, setAlerta] = useState("");
  const [sucesso, setSucesso] = useState("");


  

  // Carregar alunos + disciplinas
  useEffect(() => {
    fetch("https://sistema-de-gerenciamento-de-notas-backend.onrender.com/alunos")
      .then((res) => res.json())
      .then((data) => {
        setAlunos(data.alunos);
        setMaterias(data.disciplinas);
      });
  }, []);

  // Atualizar campo do formulário
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Atualizar notas
  const handleNotaChange = (index, value) => {
    const novas = [...formData.notas];
    novas[index] = value;
    setFormData({ ...formData, notas: novas });
  };

  
  // Validar e enviar dados (PUT)
  const salvarAluno = () => {
    // Limpar mensagens anteriores
    setAlerta("");
    setSucesso("");

    // Validações
    if (!formData.nome.trim()) {
      setAlerta("⚠️ Por favor, preencha o nome do aluno!");
      return;
    }

    if (formData.notas.some((nota) => nota === "" || nota === null)) {
      setAlerta("⚠️ Por favor, preencha todas as 5 notas!");
      return;
    }

    if (formData.notas.some((nota) => Number(nota) < 0 || Number(nota) > 10)) {
      setAlerta("⚠️ As notas devem estar entre 0 e 10!");
      return;
    }

    if (formData.frequencia === "" || formData.frequencia === null) {
      setAlerta("⚠️ Por favor, preencha a frequência!");
      return;
    }

    if (Number(formData.frequencia) < 0 || Number(formData.frequencia) > 100) {
      setAlerta("⚠️ A frequência deve estar entre 0 e 100%!");
      return;
    }

    // Enviar dados
    fetch(`https://sistema-de-gerenciamento-de-notas-backend.onrender.com/alunos/${formData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: formData.nome,
        notas: formData.notas.map((n) => Number(n)),
        frequencia: Number(formData.frequencia),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSucesso("✅ Aluno salvo com sucesso!");

        setFormData({
          id: "",     
          nome: "",
          notas: ["", "", "", "", ""],
          frequencia: "",
        });
        
        // Recarregar lista de alunos
        fetch("https://sistema-de-gerenciamento-de-notas-backend.onrender.com/alunos")
          .then((res) => res.json())
          .then((data) => setAlunos(data.alunos));
      })
      .catch(() => setAlerta("❌ Erro ao salvar aluno!"));
  };

  // Carregar estatísticas
  const gerarEstatisticas = () => {
    setAlerta("");
    setSucesso("");

    fetch("https://sistema-de-gerenciamento-de-notas-backend.onrender.com/estatisticas")
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          setAlerta("⚠️ " + data.erro);
        } else {
          setEstatisticas(data);
        }
      })
      .catch(() => setAlerta("❌ Erro ao gerar estatísticas!"));
  };

  return (
    <div className="container">
      <h2>👤 Cadastrar Informações do Aluno</h2>

      {alerta && <div className="alerta">{alerta}</div>}
      {sucesso && <div className="sucesso">{sucesso}</div>}

      <label>ID do aluno:</label>
      <input
        type="number"
        name="id"
        value={formData.id}
        onChange={handleChange}
      />

      <label>Nome:</label>
      <input
        type="text"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        placeholder="Digite o nome do aluno"
      />

      <h3>Matérias e Notas</h3>

      <div className="lista-materias">
        {materias.map((materia, index) => (
          <div key={index} className="linha-materia">
            <span className="nome-materia">{materia}</span>

            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.notas[index]}
              onChange={(e) => handleNotaChange(index, e.target.value)}
              className="input-nota"
            />
          </div>
        ))}
      </div>

      <label>
        <h3>Frequência (%):</h3>
        <input
          type="number"
          name="frequencia"
          value={formData.frequencia}
          onChange={handleChange}
          placeholder="Digite a frequência (0-100)"
        />
      </label>  
      <button onClick={salvarAluno}>💾 Salvar Aluno</button>

      <hr />

      <h2>📊 Estatísticas</h2>
      <button onClick={gerarEstatisticas}>📈 Gerar Estatísticas</button>

      {estatisticas && (
        <div className="estatisticas">
          <h3>Geração final informações consolidadas:</h3>

          {/* Mostrar lista dos alunos no formato EXATO */}
          {alunos.map((a, i) => (
            <p key={i}>
              {a.nome} – {a.notas.join(" – ")} – {a.frequencia}%
            </p>
          ))}

          <p>
            <strong>Média da turma em cada disciplina:</strong>
            {estatisticas.media_por_disciplina
              .map((d) => d.media.toFixed(2))
              .join(" - ")}
          </p>

          <p>
            <strong>Lista de alunos com média acima da média da turma:</strong>
            {estatisticas.alunos_acima_media.length > 0
              ? estatisticas.alunos_acima_media.map((a) => a.nome).join(", ")
              : "Nenhum aluno acima da média"}
          </p>

          <p>
            <strong>Lista de alunos com frequência abaixo de 75%:</strong>
            {estatisticas.alunos_frequencia_baixa.length > 0
              ? estatisticas.alunos_frequencia_baixa
                  .map((a) => a.nome)
                  .join(", ")
              : "Nenhum aluno com frequência baixa"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
