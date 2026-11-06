import { useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  Animated, Easing, Platform, ScrollView, StyleSheet, TouchableOpacity, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import BotaoPrincipal from '../../componentes/comuns/BotaoPrincipal';
import { useApp } from '../../estados/ContextoApp';
import { CORES, RAIO } from '../../uteis/constantes';
import {
  sortearPerguntas, acertou, multiplicadorCombo, calcularRecompensaAcerto
} from '../../dados/quiz';
import { PERGUNTAS_ANA } from '../../dados/perguntas_ana';
import { PERGUNTAS_JOSE } from '../../dados/perguntas_jose';

// ---------- Ajustes do jogo (mude aqui) ----------
const QTD_PERGUNTAS = 8;        // perguntas por rodada
const VIDAS_INICIAIS = 3;       // erros permitidos
const TEMPO_POR_PERGUNTA = 20;  // segundos; use 0 para desligar o cronômetro
// --------------------------------------------------

const NATIVO = Platform.OS !== 'web';
const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];
const DIFICULDADES = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' };

const MENTORES = {
  ana: {
    emoji: '👩‍🍳',
    nome: 'Chef Ana',
    perguntas: PERGUNTAS_ANA,
    falas: {
      certo: [
        'Isso aí! Você manda bem na cozinha!',
        'Perfeito! Mais uma para o seu caderno de receitas.',
        'Mandou bem! Continue assim.'
      ],
      combo: [
        'Você está pegando fogo! Que sequência!',
        'Isso é ponto de mestre cuca! N pare agora.'
      ],
      erro: [
        'Sem problema, errar faz parte de aprender.',
        'Quase! Leia a explicaç e guarde essa.',
        'Tudo bem, a gente aprende no fog.'
      ],
      tempo: [
        'O tempo voou! Respire e vá com calma na próxima.',
        'Acontece! Na próxima, confie no seu instinto.'
      ]
    }
  },
  jose: {
    emoji: '👨‍🍳',
    nome: 'Chef José',
    perguntas: PERGUNTAS_JOSE,
    falas: {
      certo: [
        'Show! Está afiado igual faca de açougueiro!',
        'Isso! Você conhece a cultura, hein?',
        'É isso aí, craque da cozinha!'
      ],
      combo: [
        'Sequência de respeito! O fogo está alto!',
        'Que combo! Assim você vira mestre rapidinho.'
      ],
      erro: [
        'Fica tranquilo, a próxima é sua.',
        'Essa pegou, mas agora você já sabe.',
        'Errou hoje, acerta amanhã. Bora!'
      ],
      tempo: [
        'O relógio correu! Bora com mais foco.',
        'Faltou tempo, mas sobra vontade. Vamos de novo!'
      ]
    }
  }
};

const sorteio = lista => lista[Math.floor(Math.random() * lista.length)];

function vibrar(acao) {
  try {
    Promise.resolve(acao()).catch(() => {});
  } catch (e) {
    // sem vibraç (navegador/PC): segue normalmente
  }
}

function escolherFala(falas, certo, tempoEsgotado, combo) {
  if (certo) return sorteio(combo >= 3 ? falas.combo : falas.certo);
  return sorteio(tempoEsgotado ? falas.tempo : falas.erro);
}

export default function Quiz() {
  const telaAtiva = useIsFocused();
  const { mentorEscolhido, adicionarBrasas, adicionarExp } = useApp();
  const mentor = MENTORES[mentorEscolhido] || MENTORES.ana;
  const banco = useMemo(() => mentor.perguntas || [], [mentor]);

  const [fase, setFase] = useState('inicio'); // inicio | jogando | fim | revisao
  const [perguntas, setPerguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [vidas, setVidas] = useState(VIDAS_INICIAIS);
  const [combo, setCombo] = useState(0);
  const [melhorCombo, setMelhorCombo] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [ganhoBrasas, setGanhoBrasas] = useState(0);
  const [ganhoExp, setGanhoExp] = useState(0);
  const [erros, setErros] = useState([]);
  const [fala, setFala] = useState('');
  const [ultimoGanho, setUltimoGanho] = useState(null);
  const [rodadaAcabou, setRodadaAcabou] = useState(false);
  const [motivoFim, setMotivoFim] = useState('completo');

  const tempo = useRef(new Animated.Value(1)).current;
  const entrada = useRef(new Animated.Value(0)).current;
  const tremer = useRef(new Animated.Value(0)).current;
  const pulso = useRef(new Animated.Value(1)).current;
  const flutuar = useRef(new Animated.Value(0)).current;
  const estrelas = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const travado = useRef(false);
  const premiado = useRef(false);
  const esgotar = useRef(() => {});

  // Cada pergunta entra com animaç e liga o cronômetro
  useEffect(() => {
    if (fase !== 'jogando' || !telaAtiva) return undefined;

    entrada.setValue(0);
    Animated.timing(entrada, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: NATIVO
    }).start();

    if (!TEMPO_POR_PERGUNTA) return undefined;
    tempo.setValue(1);
    Animated.timing(tempo, {
      toValue: 0,
      duration: TEMPO_POR_PERGUNTA * 1000,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(({ finished }) => {
      if (finished) esgotar.current();
    });
    return () => {
      tempo.stopAnimation();
      entrada.stopAnimation();
    };
  }, [fase, indice, telaAtiva]);

  // Estrelas pulam na tela de resultado
  useEffect(() => {
    if (fase !== 'fim') return;
    estrelas.forEach(e => e.setValue(0));
    Animated.stagger(
      220,
      estrelas.map(e =>
        Animated.spring(e, { toValue: 1, friction: 4, useNativeDriver: NATIVO })
      )
    ).start();
  }, [fase]);

  const iniciar = () => {
    const sorteadas = sortearPerguntas(banco, QTD_PERGUNTAS)
      .sort((a, b) => a.dificuldade - b.dificuldade); // do mais fácil ao mais difícil
    setPerguntas(sorteadas);
    setIndice(0);
    setEscolhida(null);
    setRespondida(false);
    setVidas(VIDAS_INICIAIS);
    setCombo(0);
    setMelhorCombo(0);
    setAcertos(0);
    setGanhoBrasas(0);
    setGanhoExp(0);
    setErros([]);
    setFala('');
    setUltimoGanho(null);
    setRodadaAcabou(false);
    setMotivoFim('completo');
    travado.current = false;
    premiado.current = false;
    setFase('jogando');
  };

  const animarAcerto = () => {
    pulso.setValue(1);
    Animated.sequence([
      Animated.timing(pulso, { toValue: 1.05, duration: 120, useNativeDriver: NATIVO }),
      Animated.timing(pulso, { toValue: 1, duration: 140, useNativeDriver: NATIVO })
    ]).start();
    flutuar.setValue(0);
    Animated.timing(flutuar, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: NATIVO
    }).start();
  };

  const animarErro = () => {
    tremer.setValue(0);
    Animated.sequence(
      [-10, 10, -8, 8, 0].map(v =>
        Animated.timing(tremer, { toValue: v, duration: 60, useNativeDriver: NATIVO })
      )
    ).start();
  };

  // alternativa === null significa que o tempo acabou
  const responder = alternativa => {
    if (travado.current || fase !== 'jogando') return;
    const p = perguntas[indice];
    if (!p) return;
    travado.current = true;
    tempo.stopAnimation();

    const certo = alternativa !== null && acertou(p, alternativa);
    const novoCombo = certo ? combo + 1 : 0;
    const recompensa = certo
      ? calcularRecompensaAcerto(p, novoCombo)
      : { multiplicador: 1, exp: 0, brasas: 0 };
    const { multiplicador: mult, exp, brasas } = recompensa;
    const novasVidas = certo ? vidas : vidas - 1;
    const novoAcertos = acertos + (certo ? 1 : 0);
    const totalExp = ganhoExp + exp;
    const totalBrasas = ganhoBrasas + brasas;
    const ultima = indice >= perguntas.length - 1;
    const acabou = ultima || novasVidas <= 0;

    setEscolhida(alternativa);
    setRespondida(true);
    setCombo(novoCombo);
    setMelhorCombo(m => Math.max(m, novoCombo));
    setAcertos(novoAcertos);
    setVidas(novasVidas);
    setGanhoExp(totalExp);
    setGanhoBrasas(totalBrasas);
    setUltimoGanho(certo ? { exp, brasas, mult } : null);
    setFala(escolherFala(mentor.falas, certo, alternativa === null, novoCombo));
    if (!certo) setErros(lista => [...lista, { pergunta: p, escolhida: alternativa }]);

    if (certo) {
      animarAcerto();
      vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
    } else {
      animarErro();
      vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
    }

    if (acabou) {
      setRodadaAcabou(true);
      setMotivoFim(novasVidas <= 0 ? 'vidas' : 'completo');
      // O prêmio da rodada é somado uma vez só, para o histórico do Perfil ficar limpo
      if (!premiado.current) {
        premiado.current = true;
        if (totalBrasas > 0) {
          adicionarBrasas(totalBrasas, `Quiz: ${novoAcertos}/${perguntas.length} acertos`);
        }
        if (totalExp > 0) adicionarExp(totalExp);
      }
    }
  };
  esgotar.current = () => responder(null);

  const escolherAlternativa = alternativa => {
    if (travado.current) return;
    vibrar(() => Haptics.selectionAsync());
    responder(alternativa);
  };

  const proxima = () => {
    if (rodadaAcabou) {
      setFase('fim');
      return;
    }
    travado.current = false;
    setEscolhida(null);
    setRespondida(false);
    setUltimoGanho(null);
    setFala('');
    setIndice(i => i + 1);
  };

  // ---------- Início ----------
  if (fase === 'inicio') {
    const total = Math.min(QTD_PERGUNTAS, banco.length);
    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.centroRolagem}>
          <Text style={estilos.emojiGrande}>🧠</Text>
          <Text style={estilos.titulo}>Sala do Saber</Text>
          {banco.length === 0 ? (
            <Text style={estilos.texto}>Ainda n há perguntas para {mentor.nome}.</Text>
          ) : (
            <>
              <Text style={estilos.texto}>
                {mentor.emoji} {mentor.nome} preparou {total} perguntas para você.
              </Text>

              <View style={estilos.regras}>
                <View style={estilos.regra}>
                  <Ionicons name="heart" size={20} color={CORES.erro} />
                  <Text style={estilos.textoRegra}>
                    Você tem {VIDAS_INICIAIS} vidas. Cada erro custa uma.
                  </Text>
                </View>
                {TEMPO_POR_PERGUNTA > 0 && (
                  <View style={estilos.regra}>
                    <Ionicons name="timer" size={20} color={CORES.destaque} />
                    <Text style={estilos.textoRegra}>
                      {TEMPO_POR_PERGUNTA} segundos por pergunta.
                    </Text>
                  </View>
                )}
                <View style={estilos.regra}>
                  <Ionicons name="flame" size={20} color={CORES.destaque} />
                  <Text style={estilos.textoRegra}>
                    Acertos seguidos viram combo e multiplicam seus prêmios.
                  </Text>
                </View>
                <View style={estilos.regra}>
                  <Ionicons name="trending-up" size={20} color={CORES.sucesso} />
                  <Text style={estilos.textoRegra}>
                    As perguntas v ficando mais difíceis.
                  </Text>
                </View>
              </View>

              <BotaoPrincipal titulo="Começar" onPress={iniciar} estilo={estilos.botaoLargo} />
            </>
          )}
        </ScrollView>
      </TelaSegura>
    );
  }

  // ---------- Resultado ----------
  if (fase === 'fim') {
    const total = perguntas.length;
    const nEstrelas = !total
      ? 0
      : acertos === total ? 3 : acertos / total >= 0.6 ? 2 : acertos > 0 ? 1 : 0;
    const titulo = motivoFim === 'vidas' ? 'Acabaram as vidas!' : 'Rodada completa!';
    const mensagem =
      nEstrelas === 3 ? 'Perfeito! Você mandou muito bem.'
      : nEstrelas === 2 ? 'Muito bem! Continue assim.'
      : 'Boa tentativa! Jogue de novo para melhorar.';

    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.centroRolagem}>
          <Text style={estilos.titulo}>{titulo}</Text>

          <View style={estilos.linhaEstrelas}>
            {[0, 1, 2].map(i => (
              <Animated.View key={i} style={{ transform: [{ scale: estrelas[i] }] }}>
                <Ionicons
                  name={i < nEstrelas ? 'star' : 'star-outline'}
                  size={52}
                  color={CORES.destaque}
                  style={estilos.estrela}
                />
              </Animated.View>
            ))}
          </View>

          <Text style={estilos.texto}>
            {mentor.emoji} {mensagem}
          </Text>

          <View style={estilos.cartaoResultado}>
            <View style={estilos.linhaResultado}>
              <Text style={estilos.rotulo}>Acertos</Text>
              <Text style={estilos.valor}>{acertos} de {total}</Text>
            </View>
            <View style={estilos.linhaResultado}>
              <Text style={estilos.rotulo}>Melhor sequência</Text>
              <Text style={estilos.valor}>🔥 {melhorCombo}</Text>
            </View>
            <View style={estilos.linhaResultado}>
              <Text style={estilos.rotulo}>Brasas ganhas</Text>
              <Text style={estilos.valor}>🔥 +{ganhoBrasas}</Text>
            </View>
            <View style={estilos.linhaResultado}>
              <Text style={estilos.rotulo}>EXP ganho</Text>
              <Text style={estilos.valor}>⭐ +{ganhoExp}</Text>
            </View>
          </View>

          <BotaoPrincipal titulo="Jogar de novo" onPress={iniciar} estilo={estilos.botaoLargo} />
          {erros.length > 0 && (
            <TouchableOpacity style={estilos.botaoSecundario} onPress={() => setFase('revisao')}>
              <Text style={estilos.textoBotaoSecundario}>
                Revisar o que errei ({erros.length})
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </TelaSegura>
    );
  }

  // ---------- Revis dos erros ----------
  if (fase === 'revisao') {
    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.tituloEsquerda}>O que errei</Text>
          <Text style={estilos.textoSecundario}>
            Ler com calma é a melhor forma de fixar. Da próxima vez, essas você acerta.
          </Text>
          {erros.map((e, i) => (
            <View key={`${e.pergunta.id}-${i}`} style={estilos.cartaoRevisao}>
              <Text style={estilos.perguntaRevisao}>{e.pergunta.pergunta}</Text>
              <Text style={estilos.respostaErrada}>
                Você respondeu: {e.escolhida === null ? 'tempo esgotado' : e.escolhida}
              </Text>
              <Text style={estilos.respostaCerta}>Certa: {e.pergunta.correta}</Text>
              <Text style={estilos.explicacao}>{e.pergunta.explicacao}</Text>
            </View>
          ))}
          <BotaoPrincipal titulo="Voltar" onPress={() => setFase('fim')} estilo={estilos.botaoLargo} />
        </ScrollView>
      </TelaSegura>
    );
  }

  // ---------- Jogando ----------
  const p = perguntas[indice];
  if (!p) return null;
  const certo = respondida && escolhida !== null && acertou(p, escolhida);
  const tempoEsgotado = respondida && escolhida === null;
  const mult = multiplicadorCombo(combo);

  const estadoAlternativa = alt => {
    if (!respondida) return null;
    if (alt === p.correta) return 'certa';
    if (alt === escolhida) return 'errada';
    return 'neutra';
  };

  return (
    <TelaSegura>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
      >
        <View style={estilos.barraTopo}>
          <View
            style={estilos.indicadorTopo}
            accessibilityLabel={`Pergunta ${indice + 1} de ${perguntas.length}`}
          >
            <Text style={estilos.rotuloIndicador}>Pergunta</Text>
            <Text style={estilos.valorIndicador}>{indice + 1} / {perguntas.length}</Text>
          </View>
          <View style={estilos.indicadorTopo}>
            <Text style={estilos.rotuloIndicador}>Vidas</Text>
            <View style={estilos.resumoVidas}>
              <Ionicons name="heart" size={16} color={CORES.erro} />
              <Text style={estilos.valorIndicador}>{vidas} / {VIDAS_INICIAIS}</Text>
            </View>
          </View>
          <View style={estilos.indicadorTopo}>
            <Text style={estilos.rotuloIndicador}>Combo</Text>
            <Text style={estilos.valorIndicador}>🔥 {combo}</Text>
            {combo >= 2 && (
              <Text style={estilos.multiplicadorIndicador}>x{mult}</Text>
            )}
          </View>
        </View>

        {TEMPO_POR_PERGUNTA > 0 && (
          <View style={estilos.fundoTempo}>
            <Animated.View
              style={[
                estilos.preenchimentoTempo,
                {
                  width: tempo.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  backgroundColor: tempo.interpolate({
                    inputRange: [0, 0.3, 1],
                    outputRange: [CORES.erro, CORES.destaque, CORES.sucesso]
                  })
                }
              ]}
            />
          </View>
        )}

        <Animated.View
          style={{
            opacity: entrada,
            transform: [
              { translateY: entrada.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
              { translateX: tremer },
              { scale: pulso }
            ]
          }}
        >
          <Text style={estilos.etiqueta}>
            {DIFICULDADES[p.dificuldade]} · {p.categoria}
          </Text>
          <Text style={estilos.pergunta}>{p.pergunta}</Text>

          {p.alternativas.map((alt, i) => {
            const estado = estadoAlternativa(alt);
            return (
              <TouchableOpacity
                key={alt}
                activeOpacity={0.8}
                disabled={respondida}
                onPress={() => escolherAlternativa(alt)}
                style={[
                  estilos.alternativa,
                  estado === 'certa' && estilos.alternativaCerta,
                  estado === 'errada' && estilos.alternativaErrada,
                  estado === 'neutra' && estilos.alternativaNeutra
                ]}
              >
                <View style={estilos.letra}>
                  <Text style={estilos.textoLetra}>{LETRAS[i]}</Text>
                </View>
                <Text style={estilos.alternativaTexto}>{alt}</Text>
                {estado === 'certa' && (
                  <Ionicons name="checkmark-circle" size={22} color={CORES.sucesso} />
                )}
                {estado === 'errada' && (
                  <Ionicons name="close-circle" size={22} color={CORES.erro} />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {respondida && ultimoGanho && (
          <Animated.Text
            style={[
              estilos.ganhoFlutuante,
              {
                opacity: flutuar.interpolate({
                  inputRange: [0, 0.15, 0.8, 1],
                  outputRange: [0, 1, 1, 0]
                }),
                transform: [
                  { translateY: flutuar.interpolate({ inputRange: [0, 1], outputRange: [0, -36] }) }
                ]
              }
            ]}
          >
            +{ultimoGanho.exp} EXP · +{ultimoGanho.brasas} 🔥
            {ultimoGanho.mult > 1 ? `  (combo x${ultimoGanho.mult})` : ''}
          </Animated.Text>
        )}

        {respondida && (
          <View style={estilos.areaFeedback}>
            <View style={estilos.balao}>
              <Text style={estilos.emojiMentor}>{mentor.emoji}</Text>
              <Text style={estilos.falaMentor}>{fala}</Text>
            </View>

            <View style={[estilos.feedback, certo ? estilos.feedbackCerto : estilos.feedbackErrado]}>
              <Text style={estilos.feedbackTitulo}>
                {certo ? 'Correto!' : tempoEsgotado ? 'O tempo acabou' : 'N foi dessa vez'}
              </Text>
              {!certo && (
                <Text style={estilos.feedbackTexto}>Resposta certa: {p.correta}</Text>
              )}
              <Text style={estilos.feedbackTexto}>{p.explicacao}</Text>
            </View>

            <BotaoPrincipal
              titulo={rodadaAcabou ? 'Ver resultado' : 'Próxima'}
              onPress={proxima}
              estilo={estilos.botaoLargo}
            />
          </View>
        )}
      </ScrollView>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingTop: 16, paddingBottom: 32 },
  centroRolagem: { alignItems: 'center', paddingTop: 32, paddingBottom: 32 },
  emojiGrande: { fontSize: 56, lineHeight: 72, marginBottom: 8 },
  titulo: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: 'bold',
    color: CORES.destaque,
    textAlign: 'center',
    marginBottom: 12
  },
  tituloEsquerda: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    color: CORES.destaque,
    marginBottom: 4
  },
  texto: {
    fontSize: 16,
    lineHeight: 24,
    color: CORES.texto,
    textAlign: 'center',
    marginBottom: 12
  },
  textoSecundario: {
    fontSize: 14,
    lineHeight: 22,
    color: CORES.textoSecundario,
    marginBottom: 16
  },
  botaoLargo: { alignSelf: 'stretch', marginTop: 16 },
  botaoSecundario: { alignItems: 'center', paddingVertical: 14 },
  textoBotaoSecundario: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 'bold',
    color: CORES.destaque
  },

  regras: {
    alignSelf: 'stretch',
    backgroundColor: CORES.superficie,
    borderRadius: 16,
    padding: 16,
    marginTop: 8
  },
  regra: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  textoRegra: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 21,
    color: CORES.texto
  },

  barraTopo: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    marginBottom: 12
  },
  indicadorTopo: {
    flex: 1,
    minWidth: 0,
    minHeight: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    paddingHorizontal: 6,
    paddingVertical: 6
  },
  rotuloIndicador: {
    fontSize: 11,
    lineHeight: 15,
    color: CORES.textoSecundario,
    textTransform: 'uppercase'
  },
  valorIndicador: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 'bold',
    color: CORES.texto
  },
  resumoVidas: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  multiplicadorIndicador: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: 'bold',
    color: CORES.destaque
  },

  fundoTempo: {
    height: 8,
    backgroundColor: CORES.superficie,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20
  },
  preenchimentoTempo: { height: '100%', borderRadius: 4 },

  etiqueta: {
    fontSize: 12,
    lineHeight: 18,
    color: CORES.textoSecundario,
    marginBottom: 6
  },
  pergunta: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 18
  },

  alternativa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12
  },
  alternativaCerta: {
    borderColor: CORES.sucesso,
    backgroundColor: 'rgba(16,185,129,0.15)'
  },
  alternativaErrada: {
    borderColor: CORES.erro,
    backgroundColor: 'rgba(239,68,68,0.15)'
  },
  alternativaNeutra: { opacity: 0.5 },
  letra: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: CORES.borda,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  textoLetra: { fontSize: 14, lineHeight: 20, fontWeight: 'bold', color: CORES.texto },
  alternativaTexto: { flex: 1, fontSize: 16, lineHeight: 24, color: CORES.texto },

  ganhoFlutuante: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: CORES.sucesso,
    marginTop: 4
  },

  areaFeedback: { marginTop: 4 },
  balao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderRadius: RAIO,
    padding: 12,
    marginBottom: 10
  },
  emojiMentor: { fontSize: 30, lineHeight: 40, marginRight: 10 },
  falaMentor: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: 'italic',
    color: CORES.texto
  },
  feedback: {
    borderRadius: RAIO,
    padding: 16,
    borderWidth: 1
  },
  feedbackCerto: {
    borderColor: CORES.sucesso,
    backgroundColor: 'rgba(16,185,129,0.1)'
  },
  feedbackErrado: {
    borderColor: CORES.erro,
    backgroundColor: 'rgba(239,68,68,0.1)'
  },
  feedbackTitulo: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 4
  },
  feedbackTexto: {
    fontSize: 14,
    lineHeight: 22,
    color: CORES.textoSecundario,
    marginTop: 2
  },

  linhaEstrelas: { flexDirection: 'row', marginBottom: 12 },
  estrela: { marginHorizontal: 4 },
  cartaoResultado: {
    alignSelf: 'stretch',
    backgroundColor: CORES.superficie,
    borderRadius: 16,
    padding: 20,
    marginTop: 8
  },
  linhaResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6
  },
  rotulo: { fontSize: 15, lineHeight: 22, color: CORES.textoSecundario },
  valor: { fontSize: 18, lineHeight: 26, fontWeight: 'bold', color: CORES.destaque },

  cartaoRevisao: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 12
  },
  perguntaRevisao: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 8
  },
  respostaErrada: { fontSize: 14, lineHeight: 22, color: CORES.erro },
  respostaCerta: { fontSize: 14, lineHeight: 22, fontWeight: 'bold', color: CORES.sucesso },
  explicacao: { fontSize: 14, lineHeight: 22, color: CORES.textoSecundario, marginTop: 6 }
});
