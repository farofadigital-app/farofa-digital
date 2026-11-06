import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated, Easing, Platform, ScrollView, StyleSheet, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import BotaoInterativo from '../../componentes/comuns/BotaoInterativo';
import BotaoPrincipal from '../../componentes/comuns/BotaoPrincipal';
import { RECEITAS } from '../../dados/receitas';
import {
  acaoManual, calcularRecompensaMinicozinha, configurarCalor, criarBancada,
  exigeAquecimento, extrairEtapas, zonaDoPonto
} from '../../dados/minicozinha';
import { useApp } from '../../estados/ContextoApp';
import { CORES, RAIO } from '../../uteis/constantes';

const NATIVO = Platform.OS !== 'web';

const MENTORES = {
  ana: {
    emoji: '👩‍🍳',
    falas: {
      certo: ['Isso! Ingrediente certo na bancada.', 'Muito bem, a receita agradece!', 'Boa escolha!'],
      intruso: ['Esse ingrediente n vai nessa receita. Leia de novo!', 'Hum, esse n é daqui. Tente outro.'],
      ponto: ['Ponto certinho! Você tem m de cozinheira.', 'Perfeito, é assim que se faz!'],
      erroPonto: ['Calma, observe e tente de novo.', 'Quase no ponto! Mais uma tentativa.'],
      acao: ['Que movimento bonito!', 'Assim mesmo, com capricho!'],
      fim: 'Prato pronto! Dá vontade de provar.'
    }
  },
  jose: {
    emoji: '👨‍🍳',
    falas: {
      certo: ['Show! Esse vai na panela mesmo.', 'É isso aí, craque!', 'Boa, tá afiado!'],
      intruso: ['Opa, esse n entra nessa receita!', 'Esse aí é de outro prato, hein?'],
      ponto: ['No ponto! Agora sim!', 'Acertou em cheio o fogo!'],
      erroPonto: ['Quase! Segura a m e tenta de novo.', 'Faz parte, de novo!'],
      acao: ['Mandou bem na pegada!', 'Isso! Ritmo bom.'],
      fim: 'Prato na mesa! Mandou bem demais.'
    }
  }
};

const sorteio = lista => lista[Math.floor(Math.random() * lista.length)];

function vibrar(acao) {
  if (!NATIVO) return;
  Promise.resolve()
    .then(acao)
    .catch(erro => console.warn('N foi possível reproduzir a vibraç do jogo:', erro));
}

function CartaoIngrediente({ item, estado, onPress }) {
  const escala = useRef(new Animated.Value(1)).current;
  const tremer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (estado === 'certo') {
      Animated.sequence([
        Animated.timing(escala, { toValue: 1.12, duration: 120, useNativeDriver: NATIVO }),
        Animated.spring(escala, { toValue: 1, friction: 5, useNativeDriver: NATIVO })
      ]).start();
    } else if (estado === 'errado') {
      Animated.sequence(
        [-8, 8, -6, 6, 0].map(valor =>
          Animated.timing(tremer, { toValue: valor, duration: 55, useNativeDriver: NATIVO })
        )
      ).start();
    }
  }, [estado, escala, tremer]);

  return (
    <Animated.View
      style={[estilos.celulaIngrediente, {
        transform: [{ translateX: tremer }, { scale: escala }]
      }]}
    >
      <BotaoInterativo
        style={[
          estilos.cartaoIngrediente,
          estado === 'certo' && estilos.ingredienteCerto,
          estado === 'errado' && estilos.ingredienteErrado
        ]}
        onPress={onPress}
        disabled={Boolean(estado)}
        feedbackHaptico={false}
        accessibilityRole="button"
        accessibilityLabel={`Ingrediente: ${item.nome}`}
        accessibilityState={{ selected: estado === 'certo', disabled: Boolean(estado) }}
      >
        <Text style={estilos.emojiIngrediente}>
          {estado === 'certo' ? '✅' : estado === 'errado' ? '❌' : '🥣'}
        </Text>
        <Text style={estilos.nomeIngrediente}>{item.nome}</Text>
      </BotaoInterativo>
    </Animated.View>
  );
}

function Medidor({ zona, duracao, aoParar }) {
  const posicao = useRef(new Animated.Value(0)).current;
  const parado = useRef(false);

  useEffect(() => {
    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(posicao, {
          toValue: 1,
          duration: duracao,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false
        }),
        Animated.timing(posicao, {
          toValue: 0,
          duration: duracao,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false
        })
      ])
    );
    animacao.start();
    return () => animacao.stop();
  }, [duracao, posicao]);

  const parar = () => {
    if (parado.current) return;
    parado.current = true;
    posicao.stopAnimation(valor => aoParar(valor >= zona.inicio && valor <= zona.fim));
  };

  return (
    <View>
      <View style={estilos.trilhoMedidor}>
        <View
          style={[
            estilos.zonaMedidor,
            {
              left: `${zona.inicio * 100}%`,
              width: `${(zona.fim - zona.inicio) * 100}%`
            }
          ]}
        />
        <Animated.View
          style={[
            estilos.marcadorMedidor,
            { left: posicao.interpolate({ inputRange: [0, 1], outputRange: ['0%', '98%'] }) }
          ]}
        />
      </View>
      <View style={estilos.rotulosMedidor}>
        {zona.rotulos.map(rotulo => (
          <Text key={rotulo} style={estilos.rotuloMedidor}>{rotulo}</Text>
        ))}
      </View>
      <BotaoInterativo
        style={estilos.botaoParar}
        onPress={parar}
        accessibilityRole="button"
        accessibilityLabel="Parar o marcador"
      >
        <Text style={estilos.textoBotaoParar}>PARAR AGORA</Text>
      </BotaoInterativo>
    </View>
  );
}

function AcaoRapida({ acao, aoConcluir }) {
  const [progresso, setProgresso] = useState(0);
  const progressoRef = useRef(0);
  const concluido = useRef(false);
  const pulso = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (concluido.current) return;
      progressoRef.current = Math.max(0, progressoRef.current - 0.04);
      setProgresso(progressoRef.current);
    }, 150);
    return () => clearInterval(intervalo);
  }, []);

  const tocar = () => {
    if (concluido.current) return;
    progressoRef.current = Math.min(1, progressoRef.current + 0.12);
    setProgresso(progressoRef.current);
    pulso.setValue(1);
    Animated.sequence([
      Animated.timing(pulso, { toValue: 1.18, duration: 70, useNativeDriver: NATIVO }),
      Animated.timing(pulso, { toValue: 1, duration: 90, useNativeDriver: NATIVO })
    ]).start();
    vibrar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

    if (progressoRef.current >= 1) {
      concluido.current = true;
      aoConcluir();
    }
  };

  return (
    <View style={estilos.areaAcao}>
      <Animated.Text style={[estilos.emojiAcao, { transform: [{ scale: pulso }] }]}>
        {acao.emoji}
      </Animated.Text>
      <Text style={estilos.acaoTitulo}>{acao.nome}</Text>
      <Text style={estilos.dica}>
        Toque rápido para {acao.verbo.toLowerCase()}. A barra desce se você parar!
      </Text>
      <View style={estilos.trilhoAcao}>
        <View style={[estilos.barraAcao, { width: `${Math.round(progresso * 100)}%` }]} />
      </View>
      <BotaoInterativo
        style={estilos.botaoAcao}
        onPress={tocar}
        feedbackHaptico={false}
        accessibilityRole="button"
        accessibilityLabel={`${acao.verbo} (toque várias vezes)`}
      >
        <Text style={estilos.textoBotaoAcao}>{acao.verbo.toUpperCase()}!</Text>
      </BotaoInterativo>
    </View>
  );
}

function Chama() {
  const escala = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(escala, { toValue: 1.18, duration: 380, useNativeDriver: NATIVO }),
        Animated.timing(escala, { toValue: 0.92, duration: 380, useNativeDriver: NATIVO })
      ])
    );
    animacao.start();
    return () => animacao.stop();
  }, [escala]);

  return <Animated.Text style={[estilos.chama, { transform: [{ scale: escala }] }]}>🔥</Animated.Text>;
}

function BalaoMentor({ mentor, fala }) {
  if (!fala) return null;

  return (
    <View style={estilos.balao}>
      <Text style={estilos.emojiMentor}>{mentor.emoji}</Text>
      <Text style={estilos.falaMentor}>{fala}</Text>
    </View>
  );
}

export default function MiniGame() {
  const { mentorEscolhido, adicionarBrasas, adicionarExp } = useApp();
  const mentor = MENTORES[mentorEscolhido] || MENTORES.ana;
  const premioRegistrado = useRef(false);
  const avancandoEtapa = useRef(false);
  const ingredientesResolvidos = useRef(new Set());
  const estrelasAnim = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  const [fase, setFase] = useState('inicio');
  const [receita, setReceita] = useState(null);
  const [bancada, setBancada] = useState([]);
  const [certosEscolhidos, setCertosEscolhidos] = useState([]);
  const [errados, setErrados] = useState([]);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [indiceDesafio, setIndiceDesafio] = useState(0);
  const [tentativa, setTentativa] = useState(0);
  const [etapaConcluida, setEtapaConcluida] = useState(false);
  const [precisao, setPrecisao] = useState(100);
  const [feedback, setFeedback] = useState('');
  const [feedbackErro, setFeedbackErro] = useState(false);
  const [fala, setFala] = useState('');
  const [premioFinal, setPremioFinal] = useState({ estrelas: 1, brasas: 0, exp: 0 });

  const etapas = useMemo(
    () => receita && typeof receita.modoPreparo === 'string' ? extrairEtapas(receita) : [],
    [receita]
  );
  const desafios = useMemo(() => {
    const instrucao = etapas[etapaAtual];
    if (!instrucao) return [];

    const lista = [];
    if (exigeAquecimento(instrucao)) lista.push('ponto');
    if (acaoManual(instrucao)) lista.push('acao');
    if (lista.length === 0) lista.push('simples');
    return lista;
  }, [etapas, etapaAtual]);

  useEffect(() => {
    if (fase !== 'resultado') return;

    estrelasAnim.forEach(estrela => estrela.setValue(0));
    Animated.stagger(
      220,
      estrelasAnim.map(estrela =>
        Animated.spring(estrela, { toValue: 1, friction: 4, useNativeDriver: NATIVO })
      )
    ).start();
  }, [fase, estrelasAnim]);

  const penalizar = valor => setPrecisao(atual => Math.max(0, atual - valor));

  const escolherReceita = item => {
    premioRegistrado.current = false;
    avancandoEtapa.current = false;
    ingredientesResolvidos.current.clear();
    setReceita(item);
    setBancada(criarBancada(item, RECEITAS));
    setCertosEscolhidos([]);
    setErrados([]);
    setEtapaAtual(0);
    setIndiceDesafio(0);
    setTentativa(0);
    setEtapaConcluida(false);
    setPrecisao(100);
    setFeedback('');
    setFeedbackErro(false);
    setFala('');
    setFase('ingredientes');
  };

  const voltarParaReceitas = () => {
    setFeedback('');
    setFala('');
    setFase('inicio');
  };

  const totalCertos = bancada.filter(item => item.certo).length;
  const bancadaPronta = totalCertos > 0 && certosEscolhidos.length === totalCertos;

  const tocarIngrediente = item => {
    if (ingredientesResolvidos.current.has(item.id)) return;
    ingredientesResolvidos.current.add(item.id);

    if (item.certo) {
      setCertosEscolhidos(lista => [...lista, item.id]);
      setFala(sorteio(mentor.falas.certo));
      setFeedbackErro(false);
      vibrar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
      return;
    }

    setErrados(lista => [...lista, item.id]);
    penalizar(8);
    setFala(sorteio(mentor.falas.intruso));
    setFeedbackErro(true);
    vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
  };

  const irParaFogao = () => {
    avancandoEtapa.current = false;
    setEtapaAtual(0);
    setIndiceDesafio(0);
    setTentativa(0);
    setEtapaConcluida(false);
    setFeedback('');
    setFala('');
    setFase('cozinha');
  };

  const finalizarPrato = () => {
    const premio = calcularRecompensaMinicozinha(precisao);
    if (!premioRegistrado.current) {
      premioRegistrado.current = true;
      adicionarBrasas(premio.brasas, `Minicozinha: ${receita.nome}`);
      adicionarExp(premio.exp);
    }
    setPremioFinal(premio);
    setFala(mentor.falas.fim);
    vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
    setFase('resultado');
  };

  const avancar = () => {
    if (fase !== 'cozinha' || avancandoEtapa.current) return;
    avancandoEtapa.current = true;

    if (etapaAtual >= etapas.length - 1) {
      finalizarPrato();
      return;
    }

    setEtapaAtual(indice => indice + 1);
    setIndiceDesafio(0);
    setTentativa(0);
    setEtapaConcluida(false);
    setFeedback('');
    setFeedbackErro(false);
  };

  useEffect(() => {
    if (fase === 'cozinha') avancandoEtapa.current = false;
  }, [etapaAtual, fase]);

  const concluirDesafio = fraseSucesso => {
    if (indiceDesafio < desafios.length - 1) {
      setIndiceDesafio(indice => indice + 1);
      setTentativa(0);
      setFeedback('Muito bem! Agora a próxima parte desta etapa.');
      setFeedbackErro(false);
      return;
    }

    setEtapaConcluida(true);
    setFala(fraseSucesso);
    setFeedback('Etapa concluída!');
    setFeedbackErro(false);
    vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  };

  const resultadoPonto = acertou => {
    if (acertou) {
      vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      concluirDesafio(sorteio(mentor.falas.ponto));
      return;
    }

    penalizar(10);
    setTentativa(valor => valor + 1);
    setFala(sorteio(mentor.falas.erroPonto));
    setFeedback('Fora do ponto! A zona verde ficou um pouco maior. Tente de novo.');
    setFeedbackErro(true);
    vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
  };

  if (fase === 'inicio') {
    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.emojiGrande}>🍳</Text>
          <Text style={estilos.titulo}>Minicozinha</Text>
          <View style={estilos.cartao}>
            <Text style={estilos.texto}>
              Escolha só os ingredientes certos (cuidado com os intrusos!), acerte o ponto do
              fogo ou do forno e faça os movimentos na hora certa.
            </Text>
            <Text style={estilos.dica}>
              Sem pressa: erros diminuem sua precis, que define as estrelas e a recompensa.
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
              <Text style={estilos.detalheReceita}>
                {item.regiao} · {item.tempo} · {item.dificuldade}
              </Text>
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
          <Text style={estilos.progresso}>{receita.regiao} · {receita.tempo}</Text>
          <Text style={estilos.titulo}>O que vai em {receita.nome}?</Text>
          <Text style={estilos.texto}>
            Toque nos ingredientes da receita. Alguns n pertencem a ela, e cada erro custa precis.
          </Text>
          <Text style={estilos.contador}>
            {certosEscolhidos.length} de {totalCertos} ingredientes certos · Precis {precisao}%
          </Text>
          <BotaoInterativo
            style={estilos.botaoVoltar}
            onPress={voltarParaReceitas}
            accessibilityRole="button"
          >
            <Text style={estilos.textoBotaoVoltar}>← Escolher outra receita</Text>
          </BotaoInterativo>
          <BalaoMentor mentor={mentor} fala={fala} />
          <View style={estilos.grade}>
            {bancada.map(item => {
              const estado = certosEscolhidos.includes(item.id)
                ? 'certo'
                : errados.includes(item.id) ? 'errado' : null;
              return (
                <CartaoIngrediente
                  key={item.id}
                  item={item}
                  estado={estado}
                  onPress={() => tocarIngrediente(item)}
                />
              );
            })}
          </View>
          {bancadaPronta ? (
            <BotaoPrincipal
              titulo="Tudo separado! Ir para o fog"
              onPress={irParaFogao}
              estilo={estilos.botaoLargo}
            />
          ) : null}
        </ScrollView>
      </TelaSegura>
    );
  }

  if (fase === 'cozinha') {
    if (!etapas.length) {
      return (
        <TelaSegura>
          <ScrollView contentContainerStyle={estilos.conteudo}>
            <Text style={estilos.titulo}>{receita.nome}</Text>
            <Text style={estilos.texto}>
              Esta receita ainda n tem o modo de preparo para o jogo.
            </Text>
            <BotaoPrincipal
              titulo="Escolher outra receita"
              onPress={voltarParaReceitas}
              estilo={estilos.botaoLargo}
            />
          </ScrollView>
        </TelaSegura>
      );
    }

    const instrucao = etapas[etapaAtual];
    const desafio = desafios[indiceDesafio];
    const calor = exigeAquecimento(instrucao) ? configurarCalor(instrucao) : null;
    const acao = acaoManual(instrucao);
    const progressoReceita = `${((etapaAtual + 1) / etapas.length) * 100}%`;
    const ehForno = calor?.equipamento === 'forno';

    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.progresso}>
            Etapa {etapaAtual + 1} de {etapas.length} · {receita.nome} · Precis {precisao}%
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
            accessibilityLabel="Progresso da receita"
            accessibilityValue={{ min: 1, max: etapas.length, now: etapaAtual + 1 }}
          >
            <View style={[estilos.barraReceita, { width: progressoReceita }]} />
          </View>
          <View style={estilos.instrucao}>
            <Text style={estilos.instrucaoLabel}>O que fazer agora</Text>
            <Text style={estilos.textoInstrucao}>{instrucao}</Text>
          </View>

          {!etapaConcluida && desafio === 'ponto' && calor ? (
            <View style={estilos.cartao}>
              <Text style={estilos.rotuloControle}>
                {ehForno
                  ? `Acerte a temperatura do forno: ${calor.alvo} °C`
                  : `Acerte a chama: fogo ${calor.alvo}`}
              </Text>
              {ehForno ? <Text style={estilos.chama}>♨️</Text> : <Chama />}
              <Text style={estilos.dicaTemperatura}>Pare o marcador dentro da zona verde.</Text>
              <Medidor
                key={`ponto-${etapaAtual}-${tentativa}`}
                zona={zonaDoPonto(calor, tentativa * 0.04)}
                duracao={ehForno ? 1500 : 1100}
                aoParar={resultadoPonto}
              />
            </View>
          ) : null}

          {!etapaConcluida && desafio === 'acao' && acao ? (
            <View style={estilos.cartao}>
              <AcaoRapida
                key={`acao-${etapaAtual}`}
                acao={acao}
                aoConcluir={() => concluirDesafio(sorteio(mentor.falas.acao))}
              />
            </View>
          ) : null}

          {!etapaConcluida && desafio === 'simples' ? (
            <View style={estilos.cartao}>
              <Text style={estilos.dica}>
                Etapa de bancada: leia com atenç e siga em frente.
              </Text>
              <BotaoPrincipal
                titulo={etapaAtual === etapas.length - 1 ? 'Servir o prato' : 'Feito! Próxima etapa'}
                onPress={avancar}
                estilo={estilos.botaoLargo}
              />
            </View>
          ) : null}

          <BalaoMentor mentor={mentor} fala={fala} />
          {feedback ? (
            <Text style={[estilos.feedback, feedbackErro && estilos.feedbackErro]}>
              {feedback}
            </Text>
          ) : null}
          {etapaConcluida ? (
            <BotaoPrincipal
              titulo={etapaAtual === etapas.length - 1 ? 'Servir o prato' : 'Próxima etapa'}
              onPress={avancar}
              estilo={estilos.botaoLargo}
            />
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
        <View style={estilos.linhaEstrelas}>
          {[0, 1, 2].map(indice => (
            <Animated.View
              key={indice}
              style={{ transform: [{ scale: estrelasAnim[indice] }] }}
            >
              <Ionicons
                name={indice < premioFinal.estrelas ? 'star' : 'star-outline'}
                size={48}
                color={CORES.destaque}
                style={estilos.estrela}
              />
            </Animated.View>
          ))}
        </View>
        <BalaoMentor mentor={mentor} fala={fala} />
        <View style={estilos.cartao}>
          <Text style={estilos.recompensa}>🔥 +{premioFinal.brasas} Brasas</Text>
          <Text style={estilos.recompensa}>⭐ +{premioFinal.exp} EXP</Text>
          <Text style={estilos.precisaoFinal}>
            Precis no preparo: {precisao}% · {precisao >= 90
              ? 'Muito bem!'
              : precisao >= 70 ? 'Bom trabalho!' : 'Continue praticando!'}
          </Text>
          <Text style={estilos.dica}>
            Confira o preparo completo na aba Receitas e siga as orientações de segurança alimentar.
          </Text>
        </View>
        <BotaoPrincipal
          titulo="Cozinhar de novo"
          onPress={() => escolherReceita(receita)}
          estilo={estilos.botaoLargo}
        />
        <BotaoInterativo
          style={estilos.botaoVoltar}
          onPress={() => setFase('inicio')}
          accessibilityRole="button"
        >
          <Text style={estilos.textoBotaoVoltar}>Escolher outra receita</Text>
        </BotaoInterativo>
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
  nomeReceita: { color: CORES.texto, fontSize: 16, lineHeight: 22, fontWeight: 'bold' },
  detalheReceita: { color: CORES.textoSecundario, fontSize: 12, lineHeight: 18, marginTop: 3 },
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
  contador: {
    color: CORES.destaque,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12
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
  textoBotaoVoltar: { color: CORES.destaque, fontSize: 14, lineHeight: 20, fontWeight: 'bold' },
  balao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderRadius: RAIO,
    padding: 12,
    marginBottom: 12
  },
  emojiMentor: { fontSize: 30, lineHeight: 40, marginRight: 10 },
  falaMentor: {
    flex: 1,
    color: CORES.texto,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: 'italic'
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8
  },
  celulaIngrediente: { width: '48%', marginBottom: 10 },
  cartaoIngrediente: {
    minHeight: 112,
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ingredienteCerto: {
    borderColor: CORES.sucesso,
    backgroundColor: 'rgba(16,185,129,0.15)'
  },
  ingredienteErrado: {
    borderColor: CORES.erro,
    backgroundColor: 'rgba(239,68,68,0.15)',
    opacity: 0.7
  },
  emojiIngrediente: { fontSize: 28, lineHeight: 36, marginBottom: 4 },
  nomeIngrediente: {
    color: CORES.texto,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  trilhoReceita: {
    height: 8,
    backgroundColor: CORES.superficie,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16
  },
  barraReceita: { height: '100%', backgroundColor: CORES.destaque, borderRadius: 4 },
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
  textoInstrucao: { color: CORES.texto, fontSize: 16, lineHeight: 24 },
  rotuloControle: {
    color: CORES.texto,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  chama: { fontSize: 40, lineHeight: 52, textAlign: 'center', marginVertical: 4 },
  dicaTemperatura: {
    color: CORES.textoSecundario,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 14
  },
  trilhoMedidor: {
    height: 34,
    backgroundColor: CORES.fundo,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: CORES.borda,
    overflow: 'hidden'
  },
  zonaMedidor: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(16,185,129,0.4)',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: CORES.sucesso
  },
  marcadorMedidor: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 8,
    borderRadius: 4,
    backgroundColor: CORES.destaque
  },
  rotulosMedidor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 14
  },
  rotuloMedidor: { color: CORES.textoSecundario, fontSize: 12, lineHeight: 18 },
  botaoParar: {
    backgroundColor: CORES.destaque,
    borderRadius: RAIO,
    paddingVertical: 14,
    alignItems: 'center'
  },
  textoBotaoParar: { color: '#000', fontSize: 16, lineHeight: 22, fontWeight: 'bold' },
  areaAcao: { alignItems: 'center' },
  emojiAcao: { fontSize: 56, lineHeight: 70 },
  acaoTitulo: {
    color: CORES.texto,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  trilhoAcao: {
    alignSelf: 'stretch',
    height: 16,
    backgroundColor: CORES.fundo,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 14
  },
  barraAcao: { height: '100%', backgroundColor: CORES.sucesso, borderRadius: 8 },
  botaoAcao: {
    alignSelf: 'stretch',
    backgroundColor: CORES.destaque,
    borderRadius: RAIO,
    paddingVertical: 18,
    alignItems: 'center'
  },
  textoBotaoAcao: { color: '#000', fontSize: 20, lineHeight: 28, fontWeight: 'bold' },
  feedback: {
    color: CORES.sucesso,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12
  },
  feedbackErro: { color: CORES.erro },
  linhaEstrelas: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  estrela: { marginHorizontal: 4 },
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
