import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import BotaoInterativo from '../../componentes/comuns/BotaoInterativo';
import BotaoPrincipal from '../../componentes/comuns/BotaoPrincipal';
import { RECEITAS } from '../../dados/receitas';
import {
  acaoManual, configurarCalor, criarDesafioIngredientes, exigeAquecimento, extrairEtapas
} from '../../dados/minicozinha';
import { useApp } from '../../estados/ContextoApp';
import { CORES, RAIO } from '../../uteis/constantes';

export default function MiniGame() {
  const { adicionarBrasas, adicionarExp } = useApp();
  const premioRegistrado = useRef(false);
  const [fase, setFase] = useState('inicio');
  const [receita, setReceita] = useState(null);
  const [ingredientesDesafio, setIngredientesDesafio] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [nivelFogo, setNivelFogo] = useState('medio');
  const [temperaturaForno, setTemperaturaForno] = useState(180);
  const [acoesConcluidas, setAcoesConcluidas] = useState(0);
  const [precisao, setPrecisao] = useState(100);
  const [feedback, setFeedback] = useState('');
  const [feedbackErro, setFeedbackErro] = useState(false);
  const etapas = receita ? extrairEtapas(receita) : [];

  const voltarParaReceitas = () => {
    setAcoesConcluidas(0);
    setFeedback('');
    setFase('inicio');
  };

  const escolherReceita = item => {
    premioRegistrado.current = false;
    setReceita(item);
    setIngredientesDesafio(criarDesafioIngredientes(item));
    setSelecionados([]);
    setEtapaAtual(0);
    setNivelFogo('medio');
    setTemperaturaForno(180);
    setAcoesConcluidas(0);
    setPrecisao(100);
    setFeedback('');
    setFeedbackErro(false);
    setFase('ingredientes');
  };

  const alternarIngrediente = id => {
    setSelecionados(lista =>
      lista.includes(id) ? lista.filter(item => item !== id) : [...lista, id]
    );
    setFeedback('');
  };

  const conferirIngredientes = () => {
    const faltantes = ingredientesDesafio.filter(
      ingrediente => !selecionados.includes(ingrediente.id)
    );

    if (faltantes.length) {
      setFeedback(`Separe os ingredientes que faltam: ${faltantes.map(item => item.nome).join(', ')}.`);
      setFeedbackErro(true);
      return;
    }

    setAcoesConcluidas(0);
    setPrecisao(100);
    setFeedback('Tudo separado! Agora leve a panela ao fogo.');
    setFeedbackErro(false);
    setFase('cozinha');
  };

  const ajustarTemperaturaForno = variacao => {
    setTemperaturaForno(valor => Math.max(80, Math.min(250, valor + variacao)));
    setFeedback('');
  };

  const registrarAcao = () => {
    setAcoesConcluidas(atual => Math.min(3, atual + 1));
    setFeedback('');
  };

  const executarEtapa = () => {
    const instrucao = etapas[etapaAtual];
    const usaAquecimento = exigeAquecimento(instrucao);
    const calor = usaAquecimento ? configurarCalor(instrucao) : null;
    const calorCorreto = !usaAquecimento || (calor.equipamento === 'forno'
      ? temperaturaForno >= calor.minimo && temperaturaForno <= calor.maximo
      : nivelFogo === calor.alvo);
    const acao = acaoManual(instrucao);

    if (!calorCorreto) {
      setPrecisao(valor => Math.max(0, valor - 10));
      setFeedback(calor.equipamento === 'forno'
        ? temperaturaForno < calor.minimo
          ? 'O forno ainda está frio. Ajuste a temperatura antes de avançar.'
          : 'O forno está quente demais para esta etapa. Reduza a temperatura.'
        : `Ajuste o fogo para ${calor.alvo} antes de avançar.`);
      setFeedbackErro(true);
      return;
    }

    if (acao && acoesConcluidas < 3) {
      setFeedback(`Complete a ação: ${acao.nome.toLocaleLowerCase()} (${acoesConcluidas}/3).`);
      setFeedbackErro(false);
      return;
    }

    setFeedbackErro(false);
    if (etapaAtual === etapas.length - 1) {
      if (!premioRegistrado.current) {
        premioRegistrado.current = true;
        adicionarBrasas(10, `Minicozinha: ${receita.nome}`);
        adicionarExp(25);
      }
      setFeedback(`Prato pronto! Você ganhou 10 Brasas e 25 EXP.`);
      setFase('resultado');
      return;
    }

    setEtapaAtual(indice => indice + 1);
    setAcoesConcluidas(0);
    setFeedback('Etapa concluída! Continue seguindo o preparo da receita.');
  };

  const mudarFogo = nivel => {
    setNivelFogo(nivel);
    setFeedback('');
    setFeedbackErro(false);
  };

  if (fase === 'inicio') {
    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.emojiGrande}>🍳</Text>
          <Text style={estilos.titulo}>Minicozinha</Text>
          <View style={estilos.cartao}>
            <Text style={estilos.texto}>
              Prepare cada receita seguindo suas etapas: organize os ingredientes, escolha
              o fogo ou forno, faça os movimentos e avance quando a ação estiver certa.
            </Text>
            <Text style={estilos.dica}>
              Sem cronômetro: o jogo respeita seu ritmo e não substitui os cuidados da receita real.
            </Text>
          </View>
          <Text style={estilos.subtitulo}>Escolha o prato do desafio</Text>
          {RECEITAS.map(item => (
            <BotaoInterativo
              key={item.id}
              style={estilos.cartaoReceita}
              onPress={() => escolherReceita(item)}
              accessibilityRole="button"
              accessibilityLabel={`Preparar ${item.nome}, ${item.regiao}, ${item.tempo}`}
            >
              <Text style={estilos.nomeReceita}>{item.nome}</Text>
              <Text style={estilos.detalheReceita}>{item.regiao} · {item.tempo} · {item.dificuldade}</Text>
            </BotaoInterativo>
          ))}
        </ScrollView>
      </TelaSegura>
    );
  }

  if (fase === 'ingredientes') {
    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.progresso}>Receita · {receita.regiao} · {receita.tempo}</Text>
          <Text style={estilos.titulo}>O que vai em {receita.nome}?</Text>
          <Text style={estilos.texto}>
            Separe os ingredientes na bancada antes de começar. Cada item mostra a quantidade da receita.
          </Text>
          <Text style={estilos.contador}>
            Bancada: {selecionados.length} de {receita.ingredientes.length} itens separados
          </Text>
          <BotaoInterativo
            style={estilos.botaoVoltar}
            onPress={voltarParaReceitas}
            accessibilityRole="button"
          >
            <Text style={estilos.textoBotaoVoltar}>← Escolher outra receita</Text>
          </BotaoInterativo>
          <View style={estilos.grade}>
            {ingredientesDesafio.map(ingrediente => {
              const selecionado = selecionados.includes(ingrediente.id);
              return (
                <BotaoInterativo
                  key={ingrediente.id}
                  style={[estilos.cartaoIngrediente, selecionado && estilos.ingredienteSelecionado]}
                  onPress={() => alternarIngrediente(ingrediente.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionado }}
                >
                  <Text style={estilos.emojiIngrediente}>🥣</Text>
                  <Text style={estilos.nomeIngrediente}>{ingrediente.nome}</Text>
                  {selecionado && <Text style={estilos.marcadorSelecionado}>✓</Text>}
                </BotaoInterativo>
              );
            })}
          </View>
          <BotaoPrincipal
            titulo="Conferir ingredientes"
            onPress={conferirIngredientes}
            estilo={estilos.botaoLargo}
          />
          {feedback ? (
            <Text style={[estilos.feedback, feedbackErro && estilos.feedbackErro]}>
              {feedback}
            </Text>
          ) : null}
        </ScrollView>
      </TelaSegura>
    );
  }

  if (fase === 'cozinha') {
    const instrucao = etapas[etapaAtual];
    const usaAquecimento = exigeAquecimento(instrucao);
    const calor = usaAquecimento ? configurarCalor(instrucao) : null;
    const acao = acaoManual(instrucao);
    const progressoReceita = `${(etapaAtual / etapas.length) * 100}%`;

    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.progresso}>
            Etapa {etapaAtual + 1} de {etapas.length} · {receita.nome}
          </Text>
          <BotaoInterativo
            style={estilos.botaoVoltar}
            onPress={voltarParaReceitas}
            accessibilityRole="button"
          >
            <Text style={estilos.textoBotaoVoltar}>← Escolher outra receita</Text>
          </BotaoInterativo>
          <View
            style={estilos.trilhoReceita}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: etapas.length, now: etapaAtual }}
          >
            <View style={[estilos.barraReceita, { width: progressoReceita }]} />
          </View>
          <Text style={estilos.titulo}>
            {usaAquecimento
              ? calor.equipamento === 'forno' ? 'Prepare o forno' : 'Cuide do fogo'
              : acao ? acao.nome : 'Prepare a próxima etapa'}
          </Text>
          <View style={estilos.instrucao}>
            <Text style={estilos.instrucaoLabel}>O que fazer agora</Text>
            <Text style={estilos.textoInstrucao}>{instrucao}</Text>
          </View>

          <View style={estilos.travessa}>
            <Text style={estilos.travessaTitulo}>🧺 Ingredientes na bancada</Text>
            <Text style={estilos.conteudoPanela}>
              {receita.ingredientes.join(' · ')}
            </Text>
          </View>

          <View style={estilos.fogao}>
            <Text style={estilos.panela}>{usaAquecimento && calor.equipamento === 'forno' ? '♨️' : '🍳'}</Text>
            <Text style={estilos.conteudoPanela}>
              {usaAquecimento
                ? calor.equipamento === 'forno' ? 'Forno' : 'Panela no fogão'
                : 'Bancada de preparo'}
            </Text>
            {usaAquecimento && calor.equipamento === 'fogao'
              ? <Text style={estilos.chama}>{nivelFogo === 'alto' ? '🔥🔥🔥' : nivelFogo === 'medio' ? '🔥🔥' : '🔥'}</Text>
              : null}
          </View>

          {usaAquecimento ? (
            <View style={estilos.cartao}>
              <Text style={estilos.rotuloControle}>
                {calor.equipamento === 'forno' ? 'Temperatura do forno' : 'Intensidade da chama'}
              </Text>
              {calor.equipamento === 'forno' ? (
                <>
                  <Text style={estilos.valorTemperatura}>{temperaturaForno} °C</Text>
                  <Text style={estilos.dicaTemperatura}>
                    Receita pede {calor.alvo} °C (faixa de jogo: {calor.minimo}–{calor.maximo} °C)
                  </Text>
                  <View style={estilos.controlesTemperatura}>
                    <BotaoInterativo
                      style={estilos.botaoTemperatura}
                      onPress={() => ajustarTemperaturaForno(-10)}
                      accessibilityRole="button"
                      accessibilityLabel="Diminuir temperatura do forno em 10 graus"
                    >
                      <Text style={estilos.textoBotaoTemperatura}>− 10°</Text>
                    </BotaoInterativo>
                    <BotaoInterativo
                      style={estilos.botaoTemperatura}
                      onPress={() => ajustarTemperaturaForno(10)}
                      accessibilityRole="button"
                      accessibilityLabel="Aumentar temperatura do forno em 10 graus"
                    >
                      <Text style={estilos.textoBotaoTemperatura}>+ 10°</Text>
                    </BotaoInterativo>
                  </View>
                </>
              ) : (
                <>
                  <Text style={estilos.dicaTemperatura}>A receita pede fogo {calor.alvo}.</Text>
                  <View style={estilos.controlesFogo}>
                    {['baixo', 'medio', 'alto'].map(nivel => (
                      <BotaoInterativo
                        key={nivel}
                        style={[estilos.botaoFogo, nivelFogo === nivel && estilos.fogoSelecionado]}
                        onPress={() => mudarFogo(nivel)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: nivelFogo === nivel }}
                      >
                        <Text style={estilos.textoBotaoFogo}>
                          {nivel === 'baixo' ? 'Baixo' : nivel === 'medio' ? 'Médio' : 'Alto'}
                        </Text>
                      </BotaoInterativo>
                    ))}
                  </View>
                </>
              )}
            </View>
          ) : (
            <View style={estilos.cartao}>
              <Text style={estilos.dica}>Etapa de bancada: siga a instrução e avance quando terminar.</Text>
            </View>
          )}

          {acao ? (
            <View style={estilos.cartaoAcao}>
              <Text style={estilos.acaoTitulo}>{acao.emoji} {acao.nome}</Text>
              <Text style={estilos.dica}>Faça o movimento na bancada para marcar a ação.</Text>
              <View style={estilos.controlesAcao}>
                {[0, 1, 2].map(indice => (
                  <View
                    key={indice}
                    style={[estilos.marcadorAcao, indice < acoesConcluidas && estilos.marcadorAcaoFeito]}
                  />
                ))}
              </View>
              <Text style={estilos.progressoCozimento}>{acoesConcluidas} de 3 movimentos</Text>
              <BotaoInterativo
                style={estilos.botaoAcao}
                onPress={registrarAcao}
                disabled={acoesConcluidas >= 3}
                accessibilityRole="button"
                accessibilityLabel={`${acao.verbo}, movimento ${Math.min(acoesConcluidas + 1, 3)} de 3`}
              >
                <Text style={estilos.textoBotaoAcao}>{acao.verbo}</Text>
              </BotaoInterativo>
            </View>
          ) : null}

          <BotaoPrincipal
            titulo={etapaAtual === etapas.length - 1 ? 'Servir o prato' : 'Próxima etapa'}
            onPress={executarEtapa}
            estilo={estilos.botaoLargo}
          />
          {feedback ? (
            <Text style={[estilos.feedback, feedbackErro && estilos.feedbackErro]}>
              {feedback}
            </Text>
          ) : null}
        </ScrollView>
      </TelaSegura>
    );
  }

  return (
    <TelaSegura>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.emojiGrande}>🥘</Text>
        <Text style={estilos.titulo}>{receita.nome} pronto!</Text>
        <Text style={estilos.texto}>
          Você escolheu os ingredientes e percorreu as etapas da receita de {receita.regiao}.
        </Text>
        <View style={estilos.cartao}>
          <Text style={estilos.recompensa}>🔥 +10 Brasas</Text>
          <Text style={estilos.recompensa}>⭐ +25 EXP</Text>
          <Text style={estilos.precisaoFinal}>
            Precisão no preparo: {precisao}% · {precisao >= 90 ? 'Muito bem!' : precisao >= 70 ? 'Bom trabalho!' : 'Continue praticando!'}
          </Text>
          <Text style={estilos.dica}>
            Confira o preparo completo na aba Receitas e siga as orientações de segurança alimentar.
          </Text>
        </View>
        <BotaoPrincipal
          titulo="Escolher outra receita"
          onPress={() => setFase('inicio')}
          estilo={estilos.botaoLargo}
        />
      </ScrollView>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingTop: 24, paddingBottom: 36, flexGrow: 1 },
  emojiGrande: { fontSize: 64, lineHeight: 78, textAlign: 'center', marginBottom: 8 },
  titulo: {
    color: CORES.destaque,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12
  },
  subtitulo: {
    color: CORES.texto,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 10
  },
  cartaoReceita: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 14,
    marginBottom: 10
  },
  nomeReceita: {
    color: CORES.texto,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold'
  },
  detalheReceita: {
    color: CORES.textoSecundario,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
  },
  texto: {
    color: CORES.textoSecundario,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 16
  },
  progresso: {
    color: CORES.textoSecundario,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  trilhoReceita: {
    height: 8,
    backgroundColor: CORES.superficie,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16
  },
  barraReceita: {
    height: '100%',
    backgroundColor: CORES.destaque,
    borderRadius: 4
  },
  instrucao: {
    backgroundColor: CORES.superficie,
    borderLeftWidth: 4,
    borderLeftColor: CORES.destaque,
    borderRadius: RAIO,
    padding: 14,
    marginBottom: 14
  },
  instrucaoLabel: {
    color: CORES.destaque,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5
  },
  textoInstrucao: {
    color: CORES.texto,
    fontSize: 16,
    lineHeight: 24
  },
  cartao: {
    backgroundColor: CORES.superficie,
    borderRadius: RAIO,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 16,
    marginBottom: 16
  },
  dica: {
    color: CORES.textoSecundario,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12
  },
  botaoLargo: { alignSelf: 'stretch' },
  botaoVoltar: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 8 },
  textoBotaoVoltar: { color: CORES.destaque, fontSize: 14, fontWeight: 'bold' },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4
  },
  cartaoIngrediente: {
    width: '48%',
    minHeight: 124,
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ingredienteSelecionado: {
    borderColor: CORES.destaque,
    backgroundColor: 'rgba(245,166,35,0.12)'
  },
  emojiIngrediente: { fontSize: 28, lineHeight: 36, marginBottom: 4 },
  nomeIngrediente: {
    color: CORES.texto,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  marcadorSelecionado: {
    position: 'absolute',
    top: 5,
    right: 9,
    color: CORES.sucesso,
    fontWeight: 'bold',
    fontSize: 16
  },
  contador: {
    color: CORES.destaque,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12
  },
  travessa: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 12,
    marginBottom: 4
  },
  travessaTitulo: {
    color: CORES.texto,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  feedback: {
    color: CORES.sucesso,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8
  },
  feedbackErro: { color: CORES.erro },
  fogao: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 16,
    marginVertical: 12
  },
  panela: { fontSize: 62, lineHeight: 76 },
  conteudoPanela: {
    color: CORES.texto,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 4
  },
  chama: { fontSize: 20, lineHeight: 28, marginTop: 4 },
  rotuloControle: {
    color: CORES.texto,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  valorTemperatura: { color: CORES.destaque, fontSize: 20, lineHeight: 28, fontWeight: 'bold' },
  controlesFogo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
  },
  botaoFogo: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RAIO,
    backgroundColor: CORES.fundo,
    alignItems: 'center',
    marginHorizontal: 4
  },
  fogoSelecionado: {
    borderWidth: 2,
    borderColor: CORES.destaque,
    backgroundColor: 'rgba(245,166,35,0.12)'
  },
  textoBotaoFogo: { color: CORES.texto, fontSize: 14, fontWeight: 'bold' },
  cartaoAcao: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  acaoTitulo: {
    color: CORES.texto,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  controlesAcao: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4
  },
  marcadorAcao: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: CORES.fundo,
    borderWidth: 1,
    borderColor: CORES.borda,
    marginHorizontal: 6
  },
  marcadorAcaoFeito: {
    backgroundColor: CORES.sucesso,
    borderColor: CORES.sucesso
  },
  botaoAcao: {
    minWidth: 140,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RAIO,
    backgroundColor: CORES.destaque,
    alignItems: 'center',
    marginTop: 8
  },
  textoBotaoAcao: { color: CORES.fundo, fontSize: 15, fontWeight: 'bold' },
  progressoCozimento: {
    color: CORES.texto,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 6
  },
  dicaTemperatura: {
    color: CORES.textoSecundario,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8
  },
  controlesTemperatura: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12
  },
  botaoTemperatura: {
    minWidth: 76,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RAIO,
    backgroundColor: CORES.fundo,
    alignItems: 'center'
  },
  textoBotaoTemperatura: { color: CORES.texto, fontSize: 15, fontWeight: 'bold' },
  precisaoFinal: {
    color: CORES.texto,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  recompensa: {
    color: CORES.destaque,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4
  }
});
