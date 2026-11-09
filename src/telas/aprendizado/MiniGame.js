import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import BotaoInterativo from '../../componentes/comuns/BotaoInterativo';
import BotaoPrincipal from '../../componentes/comuns/BotaoPrincipal';
import {
  acaoManual,
  calcularRecompensaMinicozinha,
  configurarCalor,
  criarBancada,
  exigeAquecimento,
  extrairEtapas,
  zonaDoPonto
} from '../../dados/minicozinha';
import { RECEITAS } from '../../dados/receitas';
import { useApp } from '../../estados/ContextoApp';
import { CORES, RAIO } from '../../uteis/constantes';

const NATIVO = Platform.OS !== 'web';

const MENTORES = {
  ana: {
    nome: 'Chef Ana',
    emoji: '👩‍🍳',
    humores: { padrao: '👩‍🍳', foco: '🧐', animada: '🤩', alerta: '🤔', orgulhosa: '🥰' },
    falas: {
      inicio: [
        'Olá! Separe os ingredientes com calma. Uma boa bancada garante o sucesso do prato.',
        'Mise en place pronto: arraste os ingredientes certos direto para a nossa panela!'
      ],
      arrasteCerto: [
        'Ingrediente perfeito na panela! A base do sabor está impecável.',
        'Muito bem! Organização na bancada é meio caminho andado.',
        'Excelente! Já sinto o aroma tomando conta da cozinha.'
      ],
      arrasteErro: [
        'Calma! Esse ingrediente não pertence a esta receita. Leia a lista com atenção.',
        'Cuidado com os intrusos! Isso alteraria o equilíbrio do prato tradicional.',
        'Não foi dessa vez. Respire fundo e escolha o ingrediente certo.'
      ],
      corteCerto: [
        'Corte limpo e uniforme! Assim tudo cozinha no mesmo tempo.',
        'Lâmina afiada e movimento firme! Técnica profissional.',
        'Muito bem! Dedos curvados para proteger e ritmo impecável.'
      ],
      corteRitmo: [
        'Mantenha o ritmo! Deslize a faca com firmeza pela guia.',
        'Perfeito! Fatias regulares valorizam a apresentação.'
      ],
      mexerCerto: [
        'Isso! Movimento circular constante para o calor penetrar por igual.',
        'Perfeito! Raspando as bordas e o fundo sem machucar os ingredientes.',
        'Ritmo maravilhoso! O molho está emulsionando como deve ser.'
      ],
      mexerParou: [
        'Atenção! Não pare de mexer, senão o fundo gruda e queima.',
        'Fogo ligado exige colher em movimento constante! Continue girando.'
      ],
      pontoOuro: [
        'PONTO DE OURO! Temperatura milimetricamente perfeita!',
        'Incrível! Selagem impecável no calor exato da técnica clássica.'
      ],
      pontoBom: [
        'No ponto certo! Agora sim o preparo vai brilhar.',
        'Acertou em cheio o calor! Vamos para a próxima etapa.'
      ],
      pontoErro: [
        'Passou um pouco da temperatura ideal. Observe o medidor com calma.',
        'O fogo desregulou! Respire e tente parar dentro da faixa verde.'
      ],
      comboAlto: [
        'Sequência brilhante! Você tem mão de chef de alta gastronomia!',
        'Uau! Cozinha em perfeita harmonia e ritmo impressionante!'
      ],
      fim3Estrelas: 'Prato magistral! Sabor, apresentação e técnica com três estrelas!',
      fim2Estrelas: 'Muito bem feito! Com mais um pouco de prática você alcança a perfeição.',
      fim1Estrela: 'Prato concluído! Continue praticando os gestos para dominar todos os pontos.'
    }
  },
  jose: {
    nome: 'Chef José',
    emoji: '👨‍🍳',
    humores: { padrao: '👨‍🍳', foco: '🤠', animada: '🔥', alerta: '🤨', orgulhosa: '💪' },
    falas: {
      inicio: [
        'Bora pro fogão! Cozinha brasileira é brasa, tempero e agilidade!',
        'Aquece a chapa que a fome é grande! Arraste os ingredientes pra panela!'
      ],
      arrasteCerto: [
        'Show de bola! Esse vai direto pro caldeirão!',
        'É isso aí, craque! Tá dominando a bancada!',
        'Boa jogada! O caldeirão já tá fervendo no capricho!'
      ],
      arrasteErro: [
        'Opa! Esse aí entrou de gaiato no navio, não vai nessa receita!',
        'Esse não, patrão! Vai estragar o tempero tradicional.',
        'Segura a empolgação! Escolhe o ingrediente certo do prato.'
      ],
      corteCerto: [
        'Corte afiado demais! Passou a lâmina com moral!',
        'No talento! Pedaços no capricho pra refogar rápido!',
        'Machado de cozinheiro! Mandou muito bem no corte!'
      ],
      corteRitmo: [
        'Passa a faca sem dó! Desliza com vontade!',
        'Ritmo forte, é assim que a cozinha não atrasa o serviço!'
      ],
      mexerCerto: [
        'Gira essa colher de pau! Faz a mágica acontecer na panela!',
        'No ritmo certo! Não deixa nada grudar no fundo!',
        'Sensacional! O refogado tá chiando do jeito que tem que ser!'
      ],
      mexerParou: [
        'Acorda o braço! Se parar de mexer, queima o fundo da panela!',
        'Mexe essa panela, guerreiro! O calor tá subindo!'
      ],
      pontoOuro: [
        'NO PONTO DE OURO! Que tiro certo, brasa viva!',
        'Golaço culinário! Cravou a temperatura na mosca!'
      ],
      pontoBom: [
        'Tá na chapa! Temperatura boa demais, segue o jogo!',
        'Fogo calibrado! Agora é só manter a pegada.'
      ],
      pontoErro: [
        'Quase queimou! Segura a mão e mira na marca verde.',
        'Passou do ponto, compadre! De olho no marcador!'
      ],
      comboAlto: [
        'FOGO TOTAL! Combo pegando fogo na cozinha!',
        'Tá voando baixo! Cozinha profissional pura aqui!'
      ],
      fim3Estrelas: 'Prato nota dez, padrão de festa com três estrelas no peito!',
      fim2Estrelas: 'Ficou show de bola! Só afinar mais os cortes e fica impecável.',
      fim1Estrela: 'Prato na mesa! Valeu a batalha, na próxima a gente busca as 3 estrelas!'
    }
  }
};

function sorteio(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return '';
  return lista[Math.floor(Math.random() * lista.length)];
}

function vibrar(acao) {
  if (!NATIVO) return;
  Promise.resolve().then(acao).catch(() => {});
}

function BalaoMentor({ mentor, humor = 'padrao', fala, combo = 0 }) {
  const escala = useRef(new Animated.Value(1)).current;
  const emojiExibido = mentor.humores[humor] || mentor.emoji;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(escala, { toValue: 1.15, duration: 90, useNativeDriver: NATIVO }),
      Animated.spring(escala, { toValue: 1, friction: 5, useNativeDriver: NATIVO })
    ]).start();
  }, [fala, humor, escala]);

  return (
    <View style={[estilos.balao, combo >= 3 && estilos.balaoCombo]}>
      <Animated.Text style={[estilos.emojiMentor, { transform: [{ scale: escala }] }]}>
        {emojiExibido}
      </Animated.Text>
      <View style={estilos.balaoTexto}>
        <Text style={estilos.nomeMentor}>{mentor.nome}</Text>
        <Text style={estilos.falaMentor}>{fala}</Text>
      </View>
    </View>
  );
}

function BadgeCombo({ combo }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (combo > 1) {
      anim.setValue(1.35);
      Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: NATIVO }).start();
    }
  }, [combo, anim]);

  if (combo <= 1) return null;

  return (
    <Animated.View style={[estilos.badgeCombo, { transform: [{ scale: anim }] }]}>
      <Text style={estilos.textoBadgeCombo}>
        🔥 COMBO x{combo} {combo >= 4 ? 'BRASA VIVA!' : ''}
      </Text>
    </Animated.View>
  );
}

function CartaoArrastavel({ item, estado, onDropNaPanela, onToque }) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const escala = useRef(new Animated.Value(1)).current;

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !estado,
      onMoveShouldSetPanResponder: (_, g) => !estado && (Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6),
      onPanResponderGrant: () => {
        Animated.spring(escala, { toValue: 1.12, friction: 5, useNativeDriver: false }).start();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        Animated.spring(escala, { toValue: 1, friction: 5, useNativeDriver: false }).start();
        if (g.dy > 60 || Math.abs(g.dx) > 120) {
          Animated.timing(pan, { toValue: { x: 0, y: 0 }, duration: 150, useNativeDriver: false }).start(() => {
            onDropNaPanela(item);
          });
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();
        }
      }
    });
  }, [estado, item, onDropNaPanela, pan, escala]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        estilos.celulaIngrediente,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: escala }] }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onToque(item)}
        disabled={Boolean(estado)}
        accessibilityRole="button"
        accessibilityLabel={`Ingrediente: ${item.nome}`}
        accessibilityState={{ disabled: Boolean(estado), selected: estado === 'certo' }}
        style={[
          estilos.cartaoIngrediente,
          estado === 'certo' && estilos.ingredienteCerto,
          estado === 'errado' && estilos.ingredienteErrado
        ]}
      >
        <Text style={estilos.emojiIngrediente}>
          {estado === 'certo' ? '✅' : estado === 'errado' ? '❌' : '🧂'}
        </Text>
        <Text style={estilos.nomeIngrediente}>{item.nome}</Text>
        <Text style={estilos.dicaArraste}>{estado ? (estado === 'certo' ? 'Na panela!' : 'Intruso!') : 'Arraste ou toque'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function TabuaDeCorte({ itemNome = 'Ingrediente', meta = 4, aoCompletar, aoAcertoCorte }) {
  const [cortes, setCortes] = useState(0);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const registrarCorte = useCallback(() => {
    setCortes(atual => {
      const novo = atual + 1;
      vibrar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

      flashAnim.setValue(1);
      Animated.timing(flashAnim, { toValue: 0, duration: 180, useNativeDriver: NATIVO }).start();

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 5, duration: 40, useNativeDriver: NATIVO }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 40, useNativeDriver: NATIVO }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: NATIVO })
      ]).start();

      aoAcertoCorte(novo);
      if (novo >= meta) setTimeout(aoCompletar, 250);
      return novo;
    });
  }, [meta, aoCompletar, aoAcertoCorte, flashAnim, shakeAnim]);

  const panResponder = useMemo(() => {
    let ultimoSwipe = 0;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const agora = Date.now();
        if (agora - ultimoSwipe < 200) return;
        if (Math.hypot(g.dx, g.dy) > 45) {
          ultimoSwipe = agora;
          registrarCorte();
        }
      }
    });
  }, [registrarCorte]);

  return (
    <View style={estilos.areaCorteContainer}>
      <Text style={estilos.rotuloGesto}>🔪 TÁBUA DE CORTE</Text>
      <Text style={estilos.instrucaoGesto}>Deslize o dedo pela linha para fatiar!</Text>

      <Animated.View {...panResponder.panHandlers} style={[estilos.tabuaMadeira, { transform: [{ translateX: shakeAnim }] }]}>
        <Animated.View pointerEvents="none" style={[estilos.flashLamina, { opacity: flashAnim }]} />
        <View style={estilos.alimentoTabua}>
          <Text style={estilos.emojiAlimento}>🧅</Text>
          <Text style={estilos.nomeAlimentoCorte}>{itemNome}</Text>
        </View>
        <View style={estilos.linhaGuiaCorte} />
        <View style={estilos.indicadorCortes}>
          <Text style={estilos.textoCortesFeitos}>Cortes: {cortes} de {meta}</Text>
          <View style={estilos.barraProgressoCorte}>
            <View style={[estilos.progressoCortePreenchido, { width: `${Math.min(100, (cortes / meta) * 100)}%` }]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function PanelaDeMexer({ aoCompletar, aoGirar, aoParar }) {
  const [voltas, setVoltas] = useState(0);
  const anguloRef = useRef(0);
  const voltasMeta = 6;
  const ultimoGiroRef = useRef(Date.now());
  const rotacaoColher = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - ultimoGiroRef.current > 1500) aoParar();
    }, 1000);
    return () => clearInterval(timer);
  }, [aoParar]);

  const panResponder = useMemo(() => {
    let ultimoAngulo = null;
    let acumuloGraus = 0;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const cx = 130;
        const cy = 130;
        const rad = Math.atan2(locationY - cy, locationX - cx);
        const graus = (rad * 180) / Math.PI;

        if (ultimoAngulo !== null) {
          let delta = graus - ultimoAngulo;
          if (delta > 180) delta -= 360;
          if (delta < -180) delta += 360;

          if (Math.abs(delta) > 4) {
            acumuloGraus += Math.abs(delta);
            ultimoGiroRef.current = Date.now();
            anguloRef.current = graus;
            rotacaoColher.setValue(graus);

            if (acumuloGraus >= 360) {
              acumuloGraus -= 360;
              vibrar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
              setVoltas(v => {
                const prox = v + 1;
                aoGirar(prox);
                if (prox >= voltasMeta) setTimeout(aoCompletar, 300);
                return prox;
              });
            }
          }
        }
        ultimoAngulo = graus;
      }
    });
  }, [aoCompletar, aoGirar, rotacaoColher]);

  const rotacaoInterpolada = rotacaoColher.interpolate({
    inputRange: [-180, 180],
    outputRange: ['-180deg', '180deg']
  });

  return (
    <View style={estilos.areaMexerContainer}>
      <Text style={estilos.rotuloGesto}>🥄 MEXER NA PANELA</Text>
      <Text style={estilos.instrucaoGesto}>Gire o dedo em círculos para mexer sem queimar!</Text>

      <View {...panResponder.panHandlers} style={estilos.corpoPanelaCircular}>
        <Text style={estilos.fumacaPanela}>♨️ ✨</Text>
        <Text style={estilos.alimentoCozinhando}>🥘</Text>
        <Animated.View pointerEvents="none" style={[estilos.colherMadeira, { transform: [{ rotate: rotacaoInterpolada }] }]}>
          <Text style={estilos.emojiColher}>🥄</Text>
        </Animated.View>
        <View style={estilos.rodapeMexer}>
          <Text style={estilos.textoVoltas}>Giro: {voltas} / {voltasMeta} voltas</Text>
          <View style={estilos.trilhoProgressoMexer}>
            <View style={[estilos.barraProgressoMexer, { width: `${Math.min(100, (voltas / voltasMeta) * 100)}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

function MedidorDePonto({ zona, duracao = 1800, aoParar }) {
  const posicao = useRef(new Animated.Value(0)).current;
  const loopAnim = useRef(null);

  useEffect(() => {
    loopAnim.current = Animated.loop(
      Animated.sequence([
        Animated.timing(posicao, { toValue: 1, duration: duracao, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(posicao, { toValue: 0, duration: duracao, easing: Easing.inOut(Easing.quad), useNativeDriver: false })
      ])
    );
    loopAnim.current.start();
    return () => loopAnim.current && loopAnim.current.stop();
  }, [duracao, posicao]);

  const parar = () => {
    if (loopAnim.current) loopAnim.current.stop();
    posicao.stopAnimation(valor => {
      const noPonto = valor >= zona.inicio && valor <= zona.fim;
      const meioZona = (zona.inicio + zona.fim) / 2;
      const ouro = noPonto && Math.abs(valor - meioZona) < 0.08;
      aoParar(noPonto, ouro);
    });
  };

  const deslocamento = posicao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '94%']
  });

  return (
    <View style={estilos.areaMedidor}>
      <View style={estilos.trilhoMedidor}>
        <View style={[estilos.zonaMedidor, { left: `${zona.inicio * 100}%`, width: `${(zona.fim - zona.inicio) * 100}%` }]} />
        <Animated.View style={[estilos.marcadorMedidor, { left: deslocamento }]} />
      </View>
      <View style={estilos.rotulosMedidor}>
        {zona.rotulos.map(rotulo => (
          <Text key={rotulo} style={estilos.rotuloMedidor}>{rotulo}</Text>
        ))}
      </View>
      <BotaoInterativo style={estilos.botaoParar} onPress={parar}>
        <Text style={estilos.textoBotaoParar}>PARAR NO PONTO!</Text>
      </BotaoInterativo>
    </View>
  );
}

export default function MiniGame() {
  const { mentorEscolhido, adicionarBrasas, adicionarExp, dadosPerfil } = useApp();
  const mentor = MENTORES[mentorEscolhido] || MENTORES.ana;
  const nomeJogador = dadosPerfil?.nome ? dadosPerfil.nome.trim() : '';

  const [receita, setReceita] = useState(null);
  const [fase, setFase] = useState('inicio');
  const [bancada, setBancada] = useState([]);
  const [certosEscolhidos, setCertosEscolhidos] = useState([]);
  const [errados, setErrados] = useState([]);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [precisao, setPrecisao] = useState(100);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [humorMentor, setHumorMentor] = useState('padrao');
  const [fala, setFala] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackErro, setFeedbackErro] = useState(false);
  const [premioFinal, setPremioFinal] = useState({ estrelas: 1, brasas: 0, exp: 0 });

  const estrelasAnim = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const panelaEscala = useRef(new Animated.Value(1)).current;

  const etapas = useMemo(
    () => receita && typeof receita.modoPreparo === 'string' ? extrairEtapas(receita) : [],
    [receita]
  );

  const penalizar = useCallback(pontos => {
    setPrecisao(atual => Math.max(0, atual - pontos));
    setCombo(0);
    setHumorMentor('alerta');
  }, []);

  const pontuarCombo = useCallback(() => {
    setCombo(c => {
      const novo = c + 1;
      setMaxCombo(m => Math.max(m, novo));
      if (novo >= 3) setHumorMentor('animada');
      return novo;
    });
  }, []);

  useEffect(() => {
    if (fase === 'vitoria') {
      estrelasAnim.forEach(e => e.setValue(0));
      Animated.stagger(150, estrelasAnim.map(e => Animated.spring(e, { toValue: 1, friction: 4, useNativeDriver: NATIVO }))).start();
    }
  }, [fase, estrelasAnim]);

  const escolherReceita = useCallback((item) => {
    setReceita(item);
    setBancada(criarBancada(item, RECEITAS));
    setCertosEscolhidos([]);
    setErrados([]);
    setEtapaAtual(0);
    setPrecisao(100);
    setCombo(0);
    setMaxCombo(0);
    setFase('bancada');
    setHumorMentor('padrao');
    setFeedback('');
    setFala(sorteio(mentor.falas.inicio));
  }, [mentor]);

  const totalCertos = useMemo(() => bancada.filter(item => item.certo).length, [bancada]);
  const bancadaPronta = totalCertos > 0 && certosEscolhidos.length === totalCertos;

  const processarIngrediente = useCallback((item) => {
    if (certosEscolhidos.includes(item.id) || errados.includes(item.id)) return;

    if (item.certo) {
      setCertosEscolhidos(lista => [...lista, item.id]);
      pontuarCombo();
      setHumorMentor('animada');
      setFala(sorteio(mentor.falas.arrasteCerto));
      vibrar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

      Animated.sequence([
        Animated.timing(panelaEscala, { toValue: 1.15, duration: 90, useNativeDriver: NATIVO }),
        Animated.spring(panelaEscala, { toValue: 1, friction: 5, useNativeDriver: NATIVO })
      ]).start();
    } else {
      setErrados(lista => [...lista, item.id]);
      penalizar(8);
      setHumorMentor('alerta');
      setFala(sorteio(mentor.falas.arrasteErro));
      vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
    }
  }, [certosEscolhidos, errados, mentor, penalizar, pontuarCombo, panelaEscala]);

  const irParaFogao = useCallback(() => {
    setFase('preparo');
    setEtapaAtual(0);
    setFeedback('');
    setHumorMentor('foco');
    setFala(`${nomeJogador ? `${nomeJogador}, ` : ''}tudo na bancada! Vamos começar o preparo no fogão.`);
  }, [nomeJogador]);

  const finalizarReceita = useCallback(() => {
    const base = calcularRecompensaMinicozinha(precisao);
    const final = {
      estrelas: base.estrelas,
      brasas: base.brasas + Math.floor(maxCombo * 2),
      exp: base.exp + Math.floor(maxCombo * 4)
    };

    adicionarBrasas(final.brasas, `Minicozinha: ${receita.nome}`);
    adicionarExp(final.exp);
    setPremioFinal(final);
    setFase('vitoria');

    if (final.estrelas === 3) {
      setHumorMentor('orgulhosa');
      setFala(mentor.falas.fim3Estrelas);
    } else if (final.estrelas === 2) {
      setHumorMentor('animada');
      setFala(mentor.falas.fim2Estrelas);
    } else {
      setHumorMentor('padrao');
      setFala(mentor.falas.fim1Estrela);
    }
    vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  }, [precisao, maxCombo, receita, adicionarBrasas, adicionarExp, mentor]);

  const avancarEtapa = useCallback(() => {
    if (etapaAtual >= etapas.length - 1) {
      finalizarReceita();
    } else {
      setEtapaAtual(i => i + 1);
      setFeedback('');
      setHumorMentor('foco');
    }
  }, [etapaAtual, etapas.length, finalizarReceita]);

  const aoAcertarCorte = useCallback((numero) => {
    pontuarCombo();
    if (numero % 2 === 0) {
      setHumorMentor('animada');
      setFala(sorteio(mentor.falas.corteCerto));
    }
  }, [mentor, pontuarCombo]);

  const aoAcertarGiroMexer = useCallback((voltas) => {
    pontuarCombo();
    if (voltas % 2 === 0) {
      setHumorMentor('animada');
      setFala(sorteio(mentor.falas.mexerCerto));
    }
  }, [mentor, pontuarCombo]);

  const aoPararDeMexer = useCallback(() => {
    setHumorMentor('alerta');
    setFala(sorteio(mentor.falas.mexerParou));
  }, [mentor]);

  const resultadoPonto = useCallback((noPonto, pontoDeOuro) => {
    if (pontoDeOuro) {
      pontuarCombo();
      setHumorMentor('orgulhosa');
      setFala(sorteio(mentor.falas.pontoOuro));
      setFeedback('🔥 PONTO DE OURO! Temperatura perfeita!');
      setFeedbackErro(false);
      vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
    } else if (noPonto) {
      pontuarCombo();
      setHumorMentor('animada');
      setFala(sorteio(mentor.falas.pontoBom));
      setFeedback('✅ Na temperatura certa! Próxima etapa liberada.');
      setFeedbackErro(false);
      vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
    } else {
      penalizar(10);
      setHumorMentor('alerta');
      setFala(sorteio(mentor.falas.pontoErro));
      setFeedback('⚠️ Fora do ponto! Tente parar dentro da zona verde.');
      setFeedbackErro(true);
      vibrar(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
    }
  }, [mentor, penalizar, pontuarCombo]);

  if (fase === 'inicio') {
    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.emojiGrande}>🍳</Text>
          <Text style={estilos.titulo}>Minicozinha Farofa</Text>
          <View style={estilos.cartao}>
            <Text style={estilos.texto}>
              Cozinhe na prática com gestos reais: arraste ingredientes para o caldeirão, fatie na tábua de corte e mexa no compasso certo da panela!
            </Text>
            <Text style={estilos.dica}>
              Mantenha o ritmo para acumular combos e multiplicar suas Brasas e EXP!
            </Text>
          </View>

          <Text style={estilos.subtitulo}>Escolha uma receita para começar</Text>
          {RECEITAS.map(item => {
            const rotulosDetalhe = [item.regiao, item.tempo, item.dificuldade].filter(Boolean);
            const detalheTexto = rotulosDetalhe.join(' · ');
            return (
              <BotaoInterativo
                key={item.id}
                style={estilos.cartaoReceita}
                onPress={() => escolherReceita(item)}
                accessibilityRole="button"
                accessibilityLabel={`Preparar ${item.nome}`}
              >
                <Text style={estilos.nomeReceita}>{item.nome}</Text>
                {detalheTexto ? <Text style={estilos.detalheReceita}>{detalheTexto}</Text> : null}
              </BotaoInterativo>
            );
          })}
        </ScrollView>
      </TelaSegura>
    );
  }

  if (fase === 'bancada') {
    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <View style={estilos.cabecalhoJogo}>
            <Text style={estilos.progresso}>{[receita.regiao, receita.tempo].filter(Boolean).join(' · ')}</Text>
            <BadgeCombo combo={combo} />
          </View>

          <Text style={estilos.titulo}>Bancada de {receita.nome}</Text>
          <Text style={estilos.texto}>Arraste os ingredientes corretos até a panela. Cuidado com os intrusos!</Text>
          <BalaoMentor mentor={mentor} humor={humorMentor} fala={fala} combo={combo} />

          <View style={estilos.areaPanelaCentral}>
            <Animated.View style={[estilos.panelaVisual, { transform: [{ scale: panelaEscala }] }]}>
              <Text style={estilos.emojiPanelaGrande}>🥘</Text>
              <Text style={estilos.textoPanelaCentral}>
                {certosEscolhidos.length} de {totalCertos} ingredientes no caldeirão
              </Text>
              <Text style={estilos.subtextoPanelaCentral}>
                {bancadaPronta ? 'Tudo certo! Siga para o fogão.' : 'Arraste um ingrediente até aqui ou toque nele.'}
              </Text>
            </Animated.View>
          </View>

          <View style={estilos.grade}>
            {bancada.map(item => {
              const estado = certosEscolhidos.includes(item.id) ? 'certo' : errados.includes(item.id) ? 'errado' : null;
              return (
                <CartaoArrastavel
                  key={item.id}
                  item={item}
                  estado={estado}
                  onDropNaPanela={processarIngrediente}
                  onToque={processarIngrediente}
                />
              );
            })}
          </View>

          {bancadaPronta ? (
            <BotaoPrincipal titulo="Tudo separado! Ir para o fogão 🔥" onPress={irParaFogao} estilo={estilos.botaoLargo} />
          ) : (
            <BotaoInterativo style={estilos.botaoVoltar} onPress={() => setFase('inicio')}>
              <Text style={estilos.textoBotaoVoltar}>← Escolher outra receita</Text>
            </BotaoInterativo>
          )}
        </ScrollView>
      </TelaSegura>
    );
  }

  if (fase === 'preparo') {
    const instrucao = etapas[etapaAtual] || '';
    const calor = exigeAquecimento(instrucao) ? configurarCalor(instrucao) : null;
    const acao = acaoManual(instrucao);
    const progressoReceita = `${((etapaAtual + 1) / etapas.length) * 100}%`;

    return (
      <TelaSegura>
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <View style={estilos.cabecalhoJogo}>
            <Text style={estilos.progresso}>Etapa {etapaAtual + 1} de {etapas.length} · Precisão {precisao}%</Text>
            <BadgeCombo combo={combo} />
          </View>

          <View style={estilos.trilhoReceita}>
            <View style={[estilos.barraReceita, { width: progressoReceita }]} />
          </View>

          <View style={estilos.instrucaoCard}>
            <Text style={estilos.instrucaoLabel}>Etapa da Receita</Text>
            <Text style={estilos.textoInstrucao}>{instrucao}</Text>
          </View>

          <BalaoMentor mentor={mentor} humor={humorMentor} fala={fala} combo={combo} />

          {acao && acao.verbo === 'Cortar' && (
            <TabuaDeCorte itemNome={receita.nome} meta={4} aoAcertoCorte={aoAcertarCorte} aoCompletar={avancarEtapa} />
          )}

          {acao && acao.verbo === 'Mexer' && (
            <PanelaDeMexer aoGirar={aoAcertarGiroMexer} aoParar={aoPararDeMexer} aoCompletar={avancarEtapa} />
          )}

          {calor && (
            <View style={estilos.cartaoCalor}>
              <Text style={estilos.rotuloControle}>
                {calor.equipamento === 'forno' ? `Forno a ${calor.alvo}°C` : `Fogo ${calor.alvo}`}
              </Text>
              <MedidorDePonto zona={zonaDoPonto(calor)} aoParar={resultadoPonto} />
            </View>
          )}

          {(!acao || (acao.verbo !== 'Cortar' && acao.verbo !== 'Mexer')) && !calor && (
            <View style={estilos.cartao}>
              <Text style={estilos.dica}>Etapa de bancada: leia com atenção e confirme a execução.</Text>
              <BotaoPrincipal
                titulo={etapaAtual === etapas.length - 1 ? 'Servir o prato 🥘' : 'Feito! Próxima etapa →'}
                onPress={avancarEtapa}
                estilo={estilos.botaoLargo}
              />
            </View>
          )}

          {feedback ? (
            <Text style={[estilos.feedback, feedbackErro && estilos.feedbackErro]}>{feedback}</Text>
          ) : null}

          {calor && feedback && !feedbackErro && (
            <BotaoPrincipal
              titulo={etapaAtual === etapas.length - 1 ? 'Servir o prato 🥘' : 'Continuar preparo →'}
              onPress={avancarEtapa}
              estilo={estilos.botaoLargo}
            />
          )}
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
            <Animated.View key={indice} style={{ transform: [{ scale: estrelasAnim[indice] }] }}>
              <Ionicons
                name={indice < premioFinal.estrelas ? 'star' : 'star-outline'}
                size={38}
                color={indice < premioFinal.estrelas ? CORES.destaque : CORES.textoSecundario}
                style={estilos.estrela}
              />
            </Animated.View>
          ))}
        </View>

        <BalaoMentor mentor={mentor} humor={humorMentor} fala={fala} combo={maxCombo} />

        <View style={estilos.cartaoResultado}>
          <Text style={estilos.recompensa}>🔥 +{premioFinal.brasas} Brasas</Text>
          <Text style={estilos.recompensa}>⭐ +{premioFinal.exp} EXP</Text>
          {maxCombo > 0 && (
            <Text style={estilos.destaqueComboFinal}>
              💥 Bônus de combo: +{Math.floor(maxCombo * 2)} Brasas e +{Math.floor(maxCombo * 4)} EXP (x{maxCombo})
            </Text>
          )}
          <Text style={estilos.precisaoFinal}>Precisão no preparo: {precisao}%</Text>
          <Text style={estilos.dica}>Confira a receita completa na aba Cozinha e pratique sempre com segurança!</Text>
        </View>

        <BotaoPrincipal titulo="Cozinhar novamente" onPress={() => escolherReceita(receita)} estilo={estilos.botaoLargo} />
        <BotaoInterativo style={estilos.botaoVoltar} onPress={() => setFase('inicio')}>
          <Text style={estilos.textoBotaoVoltar}>Escolher outra receita</Text>
        </BotaoInterativo>
      </ScrollView>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingTop: 20, paddingBottom: 40, paddingHorizontal: 16, flexGrow: 1 },
  cabecalhoJogo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  emojiGrande: { fontSize: 58, lineHeight: 70, textAlign: 'center', marginBottom: 6 },
  titulo: { color: CORES.texto, fontSize: 22, lineHeight: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  subtitulo: { color: CORES.texto, fontSize: 16, lineHeight: 22, fontWeight: 'bold', marginTop: 14, marginBottom: 10 },
  texto: { color: CORES.textoSecundario, fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 12 },
  progresso: { color: CORES.destaque, fontSize: 13, lineHeight: 18, fontWeight: 'bold' },
  dica: { color: CORES.textoSecundario, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 6 },

  cartao: { backgroundColor: CORES.superficie, borderRadius: RAIO, borderWidth: 1, borderColor: CORES.borda, padding: 14, marginBottom: 12 },
  cartaoReceita: { backgroundColor: CORES.superficie, borderRadius: RAIO, borderWidth: 1, borderColor: CORES.borda, padding: 14, marginBottom: 10 },
  nomeReceita: { color: CORES.texto, fontSize: 16, lineHeight: 22, fontWeight: 'bold' },
  detalheReceita: { color: CORES.textoSecundario, fontSize: 12, lineHeight: 18, marginTop: 4 },

  balao: { flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.superficie, borderRadius: RAIO, borderWidth: 1, borderColor: CORES.borda, padding: 12, marginBottom: 12 },
  balaoCombo: { borderColor: CORES.destaque, backgroundColor: 'rgba(245, 158, 11, 0.08)' },
  emojiMentor: { fontSize: 32, lineHeight: 40, marginRight: 10 },
  balaoTexto: { flex: 1 },
  nomeMentor: { color: CORES.destaque, fontSize: 12, lineHeight: 16, fontWeight: 'bold', textTransform: 'uppercase' },
  falaMentor: { color: CORES.texto, fontSize: 13, lineHeight: 19, fontStyle: 'italic', marginTop: 2 },

  badgeCombo: { backgroundColor: CORES.destaque, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  textoBadgeCombo: { color: '#000', fontSize: 12, lineHeight: 16, fontWeight: 'bold' },

  areaPanelaCentral: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  panelaVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 2,
    borderColor: CORES.destaque,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '90%'
  },
  emojiPanelaGrande: { fontSize: 44, lineHeight: 52 },
  textoPanelaCentral: { color: CORES.texto, fontSize: 15, lineHeight: 22, fontWeight: 'bold', marginTop: 4, textAlign: 'center', width: '100%' },
  subtextoPanelaCentral: { color: CORES.textoSecundario, fontSize: 12, lineHeight: 18, marginTop: 4, textAlign: 'center', width: '100%' },

  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 6, marginBottom: 10 },
  celulaIngrediente: { width: '48%', marginBottom: 10 },
  cartaoIngrediente: {
    minHeight: 100,
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ingredienteCerto: { borderColor: CORES.sucesso, backgroundColor: 'rgba(16,185,129,0.15)' },
  ingredienteErrado: { borderColor: CORES.erro, backgroundColor: 'rgba(239,68,68,0.15)' },
  emojiIngrediente: { fontSize: 26, lineHeight: 32, marginBottom: 2 },
  nomeIngrediente: { color: CORES.texto, fontSize: 13, lineHeight: 19, fontWeight: 'bold', textAlign: 'center', width: '100%' },
  dicaArraste: { color: CORES.textoSecundario, fontSize: 11, lineHeight: 16, marginTop: 4, textAlign: 'center' },

  areaCorteContainer: { backgroundColor: CORES.superficie, borderRadius: RAIO, borderWidth: 1, borderColor: CORES.borda, padding: 14, marginBottom: 14, alignItems: 'center' },
  rotuloGesto: { color: CORES.destaque, fontSize: 12, lineHeight: 16, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  instrucaoGesto: { color: CORES.texto, fontSize: 13, lineHeight: 18, marginBottom: 12, textAlign: 'center' },
  tabuaMadeira: {
    width: '100%',
    height: 180,
    backgroundColor: '#3b2512',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#5c3a1e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  flashLamina: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.45)' },
  alimentoTabua: { alignItems: 'center' },
  emojiAlimento: { fontSize: 50, lineHeight: 60 },
  nomeAlimentoCorte: { color: '#fef3c7', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  linhaGuiaCorte: { position: 'absolute', width: '80%', height: 2, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)', borderStyle: 'dashed' },
  indicadorCortes: { position: 'absolute', bottom: 8, width: '90%', alignItems: 'center' },
  textoCortesFeitos: { color: '#fef3c7', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  barraProgressoCorte: { width: '100%', height: 6, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 3, overflow: 'hidden' },
  progressoCortePreenchido: { height: '100%', backgroundColor: CORES.destaque },

  areaMexerContainer: { backgroundColor: CORES.superficie, borderRadius: RAIO, borderWidth: 1, borderColor: CORES.borda, padding: 14, marginBottom: 14, alignItems: 'center' },
  corpoPanelaCircular: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#1f2937',
    borderWidth: 8,
    borderColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  fumacaPanela: { position: 'absolute', top: 20, fontSize: 24 },
  alimentoCozinhando: { fontSize: 56, lineHeight: 68 },
  colherMadeira: { position: 'absolute', width: 140, height: 140, justifyContent: 'center', alignItems: 'center' },
  emojiColher: { fontSize: 44, transform: [{ translateY: -35 }] },
  rodapeMexer: { position: 'absolute', bottom: 14, width: '70%', alignItems: 'center' },
  textoVoltas: { color: CORES.texto, fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  trilhoProgressoMexer: { width: '100%', height: 6, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 3, overflow: 'hidden' },
  barraProgressoMexer: { height: '100%', backgroundColor: CORES.destaque },

  trilhoReceita: { height: 6, backgroundColor: CORES.superficie, borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  barraReceita: { height: '100%', backgroundColor: CORES.destaque },

  instrucaoCard: { backgroundColor: CORES.superficie, borderLeftWidth: 4, borderLeftColor: CORES.destaque, borderRadius: RAIO, padding: 12, marginBottom: 12 },
  instrucaoLabel: { color: CORES.destaque, fontSize: 11, lineHeight: 16, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  textoInstrucao: { color: CORES.texto, fontSize: 15, lineHeight: 22 },

  cartaoCalor: { backgroundColor: CORES.superficie, borderRadius: RAIO, borderWidth: 1, borderColor: CORES.borda, padding: 14, marginBottom: 12 },
  rotuloControle: { color: CORES.texto, fontSize: 14, lineHeight: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  areaMedidor: { alignItems: 'center' },
  trilhoMedidor: { width: '100%', height: 32, backgroundColor: CORES.fundo, borderRadius: 16, borderWidth: 1, borderColor: CORES.borda, overflow: 'hidden', position: 'relative' },
  zonaMedidor: { position: 'absolute', top: 0, bottom: 0, backgroundColor: 'rgba(16,185,129,0.35)', borderLeftWidth: 2, borderRightWidth: 2, borderColor: CORES.sucesso },
  marcadorMedidor: { position: 'absolute', top: 3, width: 14, height: 24, borderRadius: 4, backgroundColor: CORES.destaque },
  rotulosMedidor: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 6, marginBottom: 12 },
  rotuloMedidor: { color: CORES.textoSecundario, fontSize: 12 },
  botaoParar: { backgroundColor: CORES.destaque, borderRadius: RAIO, paddingVertical: 12, paddingHorizontal: 28, alignItems: 'center' },
  textoBotaoParar: { color: '#000', fontSize: 15, lineHeight: 20, fontWeight: 'bold' },

  botaoLargo: { alignSelf: 'stretch', marginTop: 6, marginBottom: 8 },
  botaoVoltar: { alignSelf: 'center', paddingVertical: 8, marginTop: 4 },
  textoBotaoVoltar: { color: CORES.destaque, fontSize: 14, lineHeight: 20, fontWeight: 'bold' },

  feedback: { color: CORES.sucesso, fontSize: 14, lineHeight: 20, textAlign: 'center', marginVertical: 8, fontWeight: 'bold' },
  feedbackErro: { color: CORES.erro },

  linhaEstrelas: { flexDirection: 'row', justifyContent: 'center', marginVertical: 12 },
  estrela: { marginHorizontal: 4 },
  cartaoResultado: { backgroundColor: CORES.superficie, borderRadius: RAIO, borderWidth: 1, borderColor: CORES.borda, padding: 16, alignItems: 'center', marginVertical: 10 },
  recompensa: { color: CORES.texto, fontSize: 18, lineHeight: 26, fontWeight: 'bold', marginVertical: 2 },
  destaqueComboFinal: { color: CORES.destaque, fontSize: 14, lineHeight: 21, fontWeight: 'bold', marginTop: 6, textAlign: 'center', width: '100%' },
  precisaoFinal: { color: CORES.destaque, fontSize: 14, lineHeight: 22, fontWeight: 'bold', marginTop: 8, textAlign: 'center', width: '100%' }
});