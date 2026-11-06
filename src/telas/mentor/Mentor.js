import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TelaSegura from '../../componentes/layout/TelaSegura';
import TouchableOpacity from '../../componentes/comuns/BotaoInterativo';
import {
  CampoTextoResponsivo as TextInput, TextoResponsivo as Text
} from '../../componentes/comuns/TextoResponsivo';
import { CHAVES, carregar, salvar } from '../../servicos/armazenamento';
import { RECEITAS } from '../../dados/receitas';
import {
  cancelarDownloadMentor, prepararMentor, responderMentor,
  SUPORTA_IA_LOCAL, TAMANHO_MODELO_BYTES, verificarModeloBaixado
} from '../../servicos/mentorIA';
import {
  obterSugestoesOffline, responderMentorOffline
} from '../../servicos/mentorIA.offline';
import { useApp } from '../../estados/ContextoApp';
import { BRASAS_DIARIAS, CORES, RAIO } from '../../uteis/constantes';
import { formatarDataHoje } from '../../uteis/formatacao';

const MENTORES = {
  ana: {
    nome: 'Chef Ana',
    emoji: '👩‍🍳',
    estilo: 'explicações acolhedoras e passo a passo',
    saudacao: 'Vamos cozinhar com calma, uma etapa de cada vez.',
    retorno: 'Que bom ter você de volta! Vamos preparar algo gostoso?',
    sugestoes: [
      'Como faço uma farofa soltinha?',
      'Pode me explicar uma receita passo a passo?',
      'Como posso substituir um ingrediente?'
    ]
  },
  jose: {
    nome: 'Chef José',
    emoji: '👨‍🍳',
    estilo: 'sabores brasileiros e dicas práticas',
    saudacao: 'A cozinha está pronta. Vamos pôr a m na massa?',
    retorno: 'Bom ver você de novo! Qual sabor vamos explorar hoje?',
    sugestoes: [
      'Qual receita brasileira você recomenda?',
      'Como tempero uma carne sem exagerar no sal?',
      'Que corte é bom para cozinhar devagar?'
    ]
  }
};

const DICAS = [
  {
    emoji: '🔪',
    titulo: 'Corte seguro',
    texto: 'Estabilize a tábua com um pano úmido por baixo. Use uma faca afiada e mantenha as pontas dos dedos recolhidas, afastadas da lmina.',
    pergunta: 'Como corto legumes com segurança?'
  },
  {
    emoji: '🥘',
    titulo: 'Organizaç do preparo',
    texto: 'Leia a receita inteira, separe e meça os ingredientes e só ent aqueça a panela. Isso ajuda a evitar que algo queime enquanto você procura outro item.',
    pergunta: 'Como organizo o preparo de uma receita?'
  },
  {
    emoji: '🧼',
    titulo: 'Higiene',
    texto: 'Lave as ms e higienize a tábua e os utensílios. N lave carnes cruas: os respingos podem espalhar microrganismos. Separe-as dos alimentos prontos e lave frutas e vegetais em água corrente.',
    pergunta: 'Quais cuidados de higiene devo ter na cozinha?'
  },
  {
    emoji: '🌿',
    titulo: 'Aproveitamento integral',
    texto: 'Talos de couve e folhas de cenoura podem entrar em refogados ou caldos. Lave bem, retire partes danificadas e use apenas o que estiver fresco.',
    pergunta: 'Como aproveito talos e folhas na cozinha?'
  },
  {
    emoji: '🧂',
    titulo: 'Tempero equilibrado',
    texto: 'Ajuste o sal aos poucos e prove durante o preparo, quando for seguro. Ervas, alho, cebola, lim e especiarias também realçam o sabor.',
    pergunta: 'Como ajusto o tempero sem exagerar no sal?'
  },
  {
    emoji: '🔥',
    titulo: 'Controle do fogo',
    texto: 'Fogo alto doura rápido; fogo baixo cozinha por mais tempo. Se o alimento começar a escurecer antes de cozinhar por dentro, reduza o fogo.',
    pergunta: 'Como escolho a intensidade do fogo?'
  },
  {
    emoji: '🧊',
    titulo: 'Conservaç',
    texto: 'Guarde os alimentos perecíveis refrigerados, em recipientes limpos e fechados. Separe alimentos crus dos que já est prontos para consumo.',
    pergunta: 'Como guardo os alimentos com segurança?'
  }
];

const ATALHOS = [
  { rota: 'Cozinha', emoji: '🍲', titulo: 'Receitas e cortes' },
  { rota: 'Minicozinha', emoji: '🍳', titulo: 'Praticar no jogo' },
  { rota: 'Quiz', emoji: '🧠', titulo: 'Testar conhecimentos' }
];

const novoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function formatarTamanho(bytes) {
  return `${(bytes / 1e9).toFixed(2).replace('.', ',')} GB`;
}

function mensagemErro(erro) {
  return erro instanceof Error
    ? erro.message
    : 'N foi possível concluir a operaç. Tente novamente.';
}

export default function Mentor() {
  const navigation = useNavigation();
  const {
    mentorEscolhido, brasas, streak, ultimoAcesso, registrarAcessoDiario
  } = useApp();
  const mentor = MENTORES[mentorEscolhido] || MENTORES.ana;
  const sugestoesIniciais = mentor.sugestoes;
  const [tela, setTela] = useState('inicio');
  const [mensagens, setMensagens] = useState([]);
  const [modeloBaixado, setModeloBaixado] = useState(false);
  const [statusModelo, setStatusModelo] = useState(
    SUPORTA_IA_LOCAL ? 'verificando' : 'offline'
  );
  const [progresso, setProgresso] = useState(null);
  const [entrada, setEntrada] = useState('');
  const [respondendo, setRespondendo] = useState(false);
  const [erro, setErro] = useState('');
  const [indiceDica, setIndiceDica] = useState(new Date().getDate() % DICAS.length);
  const listaRef = useRef(null);
  const checkinExecutado = useRef(null);
  const hoje = formatarDataHoje();
  const pontoFeito = ultimoAcesso === hoje || checkinExecutado.current === hoje;
  const premioPonto = BRASAS_DIARIAS + Math.min((streak + 1) * 2, 20);
  const sequenciaAtual = pontoFeito && ultimoAcesso !== hoje ? streak + 1 : streak;
  const dicaDoDia = DICAS[indiceDica];
  const receitaDoDia = RECEITAS[new Date().getDate() % RECEITAS.length];
  const falaInicio = pontoFeito ? mentor.retorno : mentor.saudacao;
  const ultimaPergunta = [...mensagens].reverse().find(item => item.role === 'user')?.content;
  const sugestoesDinamicas = statusModelo === 'offline' && ultimaPergunta
    ? obterSugestoesOffline(ultimaPergunta, mensagens)
    : [];

  useEffect(() => {
    let ativo = true;
    carregar(CHAVES.CONVERSA_MENTOR).then(dados => {
      if (!ativo || !Array.isArray(dados)) return;
      setMensagens(
        dados.filter(item =>
          item
          && (item.role === 'user' || item.role === 'assistant')
          && typeof item.content === 'string'
        ).slice(-40)
      );
    });

    if (SUPORTA_IA_LOCAL) {
      verificarModeloBaixado()
        .then(existe => {
          if (ativo) {
            setModeloBaixado(existe);
            setStatusModelo(existe ? 'baixado' : 'offline');
          }
        })
        .catch(falha => {
          if (ativo) {
            setErro(mensagemErro(falha));
            setStatusModelo('offline');
          }
        });
    } else {
      setStatusModelo('offline');
    }

    return () => {
      ativo = false;
    };
  }, []);

  const preparar = async () => {
    setErro('');
    setProgresso(null);
    setStatusModelo('preparando');
    try {
      await prepararMentor(setProgresso);
      setModeloBaixado(true);
      setStatusModelo('pronto');
    } catch (falha) {
      if (mensagemErro(falha) === 'DOWNLOAD_CANCELADO') {
        setStatusModelo('ausente');
        setErro('Download cancelado. Você pode tentar novamente quando quiser.');
      } else {
        setStatusModelo('erro');
        setErro(mensagemErro(falha));
      }
    }
  };

  const cancelarDownload = async () => {
    setErro('');
    try {
      await cancelarDownloadMentor();
    } catch (falha) {
      setErro(mensagemErro(falha));
    }
  };

  const enviar = async texto => {
    const conteudo = texto.trim();
    if (!conteudo || respondendo || !['pronto', 'offline'].includes(statusModelo)) return;

    const pergunta = { id: novoId(), role: 'user', content: conteudo };
    const resposta = { id: novoId(), role: 'assistant', content: '', pendente: true };
    const anteriores = [...mensagens, pergunta].slice(-40);
    setMensagens([...anteriores, resposta]);
    setEntrada('');
    setRespondendo(true);
    setErro('');

    let textoParcial = '';
    try {
      let respostaFinal;
      if (statusModelo === 'pronto') {
        try {
          respostaFinal = await responderMentor(
            mentorEscolhido,
            anteriores,
            token => {
              textoParcial += token;
              setMensagens(lista => lista.map(item =>
                item.id === resposta.id ? { ...item, content: textoParcial } : item
              ));
            }
          );
        } catch (falha) {
          setStatusModelo('offline');
          setErro(`O modelo local n respondeu (${mensagemErro(falha)}). Usei o guia offline.`);
          respostaFinal = await responderMentorOffline(mentorEscolhido, conteudo, anteriores);
        }
      } else {
        respostaFinal = await responderMentorOffline(mentorEscolhido, conteudo, anteriores);
      }
      const concluida = {
        ...resposta,
        content: respostaFinal || textoParcial || 'N consegui formular uma resposta. Tente perguntar de outro jeito.',
        pendente: false
      };
      const atualizadas = [...anteriores, concluida].slice(-40);
      setMensagens(atualizadas);
      await salvar(CHAVES.CONVERSA_MENTOR, atualizadas);
    } catch (falha) {
      setMensagens(anteriores);
      await salvar(CHAVES.CONVERSA_MENTOR, anteriores);
      setErro(mensagemErro(falha));
    } finally {
      setRespondendo(false);
    }
  };

  const limparConversa = async () => {
    setMensagens([]);
    setErro('');
    await salvar(CHAVES.CONVERSA_MENTOR, []);
  };

  const abrirConversa = (pergunta = '') => {
    setEntrada(pergunta);
    setErro('');
    setTela('conversa');
  };

  const baterPonto = () => {
    if (checkinExecutado.current === hoje) return;
    if (registrarAcessoDiario()) checkinExecutado.current = hoje;
  };

  if (tela === 'inicio') {
    return (
      <TelaSegura>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estilos.inicioConteudo}
        >
          <View style={estilos.boasVindasInicio}>
            <Text style={estilos.emojiInicio}>{mentor.emoji}</Text>
            <View style={estilos.boasVindasTexto}>
              <Text style={estilos.saudacao}>Olá! Que bom ter você na cozinha.</Text>
              <Text style={estilos.nomeInicio}>{mentor.nome} · {mentor.estilo}</Text>
              <Text style={estilos.falaInicio}>{falaInicio}</Text>
            </View>
          </View>

          <View style={estilos.cartaoPonto}>
            <View style={estilos.pontoTexto}>
              <Text style={estilos.tituloCartao}>Seu ponto diário</Text>
              <Text style={estilos.textoCartao}>
                {pontoFeito
                  ? `Ponto registrado! Sequência: ${sequenciaAtual} ${sequenciaAtual === 1 ? 'dia' : 'dias'}.`
                  : `Registre sua visita e ganhe ${premioPonto} Brasas.`}
              </Text>
            </View>
            <TouchableOpacity
              style={[estilos.botaoPonto, pontoFeito && estilos.botaoPontoFeito]}
              onPress={baterPonto}
              disabled={pontoFeito}
              accessibilityRole="button"
              accessibilityState={{ disabled: pontoFeito, checked: pontoFeito }}
            >
              <Text style={estilos.textoBotaoPonto}>
                {pontoFeito ? '✓ Ponto batido' : '🔥 Bater ponto'}
              </Text>
            </TouchableOpacity>
            <Text style={estilos.saldoBrasas}>🔥 {brasas} Brasas</Text>
          </View>

          <View style={estilos.dicaDoDia}>
            <Text style={estilos.rotuloDica}>DICA {indiceDica + 1} DE {DICAS.length}</Text>
            <Text style={estilos.tituloDica}>
              {dicaDoDia.emoji} {dicaDoDia.titulo}
            </Text>
            <Text style={estilos.textoCartao}>{dicaDoDia.texto}</Text>
            <View style={estilos.acoesDica}>
              <TouchableOpacity
                style={estilos.botaoDica}
                onPress={() => setIndiceDica(indice => (indice + 1) % DICAS.length)}
                accessibilityRole="button"
                accessibilityLabel="Ver outra dica de cozinha"
              >
                <Text style={estilos.textoBotaoDica}>Ver outra dica</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={estilos.botaoPerguntaDica}
                onPress={() => abrirConversa(dicaDoDia.pergunta)}
                accessibilityRole="button"
              >
                <Text style={estilos.textoBotaoPergunta}>Perguntar ao mentor</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={estilos.tituloSecao}>Mais dicas para cozinhar melhor</Text>
          <View style={estilos.gradeDicas}>
            {DICAS.map(dica => (
              <View key={dica.titulo} style={estilos.cartaoDica}>
                <Text style={estilos.tituloDica}>
                  {dica.emoji} {dica.titulo}
                </Text>
                <Text style={estilos.textoDica}>{dica.texto}</Text>
                <TouchableOpacity
                  style={estilos.linkDica}
                  onPress={() => abrirConversa(dica.pergunta)}
                  accessibilityRole="button"
                  accessibilityLabel={`Perguntar ao mentor sobre ${dica.titulo}`}
                >
                  <Text style={estilos.textoLinkDica}>Tirar dúvida →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={estilos.receitaDoDia}>
            <Text style={estilos.rotuloDica}>SUGEST DO DIA</Text>
            <Text style={estilos.tituloReceita}>{receitaDoDia.nome}</Text>
            <Text style={estilos.metaReceita}>
              {receitaDoDia.regiao} · {receitaDoDia.tempo} · {receitaDoDia.porcoes} porções
            </Text>
            <Text style={estilos.textoCartao}>
              {receitaDoDia.dificuldade} · {receitaDoDia.categoria}
            </Text>
            <TouchableOpacity
              style={estilos.botaoReceita}
              onPress={() => navigation.navigate('Cozinha')}
              accessibilityRole="button"
            >
              <Text style={estilos.textoBotaoPergunta}>Explorar receitas e cortes</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={estilos.botaoConversar}
            onPress={() => abrirConversa()}
            accessibilityRole="button"
          >
            <Text style={estilos.textoBotaoConversar}>💬 Conversar com {mentor.nome}</Text>
            <Text style={estilos.legendaConversar}>
              Tire dúvidas de receitas, ingredientes e técnicas
            </Text>
          </TouchableOpacity>

          <Text style={estilos.tituloSecao}>Continue explorando</Text>
          <View style={estilos.gradeAtalhos}>
            {ATALHOS.map(atalho => (
              <TouchableOpacity
                key={atalho.rota}
                style={estilos.atalho}
                onPress={() => navigation.navigate(atalho.rota)}
                accessibilityRole="button"
              >
                <Text style={estilos.emojiAtalho}>{atalho.emoji}</Text>
                <Text style={estilos.textoAtalho}>{atalho.titulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </TelaSegura>
    );
  }

  if (tela === 'conversa' && !['pronto', 'offline'].includes(statusModelo)) {
    const baixando = progresso?.etapa === 'download';
    const percentual = baixando && progresso.total > 0
      ? Math.min(progresso.baixado / progresso.total, 1)
      : 0;

    return (
      <TelaSegura estilo={estilos.centralizar}>
        <TouchableOpacity
          style={estilos.voltarInicio}
          onPress={() => setTela('inicio')}
          accessibilityRole="button"
        >
          <Text style={estilos.textoBotaoOffline}>← Voltar ao início</Text>
        </TouchableOpacity>
        <Text style={estilos.emoji}>{mentor.emoji}</Text>
        <Text style={estilos.titulo}>Converse com {mentor.nome}</Text>
        <Text style={estilos.textoWeb}>
          O modelo Qwen roda no celular. Baixe uma vez para conversar depois, mesmo sem internet.
          Suas mensagens ficam no aparelho.
        </Text>
        {statusModelo === 'verificando' ? (
          <ActivityIndicator size="large" color={CORES.destaque} />
        ) : statusModelo === 'preparando' ? (
          <View style={estilos.progressoCaixa}>
            <ActivityIndicator size="large" color={CORES.destaque} />
            <Text style={estilos.textoProgresso}>
              {baixando
                ? `Baixando modelo: ${Math.round(percentual * 100)}%`
                : 'Carregando o modelo no aparelho…'}
            </Text>
            {baixando && (
              <>
                <View style={estilos.trilho}>
                  <View style={[estilos.barra, { width: `${percentual * 100}%` }]} />
                </View>
                <Text style={estilos.textoSecundario}>
                  {(progresso.baixado / 1e6).toFixed(0)} MB de{' '}
                  {(progresso.total / 1e6).toFixed(0)} MB. Recomendamos Wi-Fi.
                </Text>
                <TouchableOpacity style={estilos.botaoSecundario} onPress={cancelarDownload}>
                  <Text style={estilos.textoBotaoSecundario}>Cancelar download</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <>
            <View style={estilos.avisoModelo}>
              <Text style={estilos.textoAviso}>
                Download inicial: {formatarTamanho(TAMANHO_MODELO_BYTES)}.
                Verifique o espaço livre e prefira uma conex Wi-Fi.
              </Text>
            </View>
            <TouchableOpacity
              style={estilos.botaoPrincipal}
              onPress={preparar}
              accessibilityRole="button"
            >
              <Text style={estilos.textoBotaoPrincipal}>
                {modeloBaixado ? 'Carregar modelo' : 'Baixar e preparar mentor'}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {!['verificando', 'preparando'].includes(statusModelo) ? (
          <TouchableOpacity
            style={estilos.botaoSecundario}
            onPress={() => setStatusModelo('offline')}
            accessibilityRole="button"
          >
            <Text style={estilos.textoBotaoOffline}>Continuar com o guia offline</Text>
          </TouchableOpacity>
        ) : null}
        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
      </TelaSegura>
    );
  }

  return (
    <TelaSegura estilo={estilos.telaChat}>
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltarChat}
          onPress={() => setTela('inicio')}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao início"
        >
          <Text style={estilos.limparTexto}>Início</Text>
        </TouchableOpacity>
        <Text style={estilos.emojiPequeno}>{mentor.emoji}</Text>
        <View style={estilos.infoCabecalho}>
          <Text style={estilos.nomeMentor}>{mentor.nome}</Text>
          <Text style={estilos.estadoMentor}>
            {statusModelo === 'pronto'
              ? 'IA local · mensagens privadas'
              : 'Guia offline · catálogo e dicas'}
          </Text>
        </View>
        {SUPORTA_IA_LOCAL && statusModelo === 'offline' ? (
          <TouchableOpacity
            style={estilos.botaoBaixar}
            onPress={() => setStatusModelo('ausente')}
            accessibilityRole="button"
            accessibilityLabel="Preparar modelo de IA local"
          >
            <Text style={estilos.limparTexto}>Baixar IA</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={limparConversa}
          disabled={respondendo}
          accessibilityRole="button"
          accessibilityState={{ disabled: respondendo }}
          accessibilityLabel="Limpar conversa"
        >
          <Text style={estilos.limparTexto}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={estilos.conversa}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={listaRef}
          style={estilos.lista}
          contentContainerStyle={estilos.listaConteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
        >
          {mensagens.length === 0 ? (
            <View style={estilos.boasVindas}>
              <Text style={estilos.titulo}>O que vamos cozinhar?</Text>
              <Text style={estilos.textoSecundario}>
                Tire dúvidas de receitas, ingredientes ou técnicas com {mentor.nome}.
              </Text>
              {sugestoesIniciais.map(sugestao => (
                <TouchableOpacity
                  key={sugestao}
                  style={estilos.sugestao}
                  onPress={() => enviar(sugestao)}
                  disabled={respondendo}
                  accessibilityRole="button"
                >
                  <Text style={estilos.textoSugestao}>{sugestao}</Text>
                </TouchableOpacity>
              ))}
              {statusModelo === 'offline' ? (
                <Text style={estilos.textoSecundario}>
                  {SUPORTA_IA_LOCAL
                    ? 'Respostas locais baseadas no catálogo. Para respostas abertas, baixe o modelo no celular.'
                    : 'Respostas locais baseadas no catálogo; o modelo generativo está disponível nos apps Android e iOS.'}
                </Text>
              ) : null}
            </View>
          ) : mensagens.map(item => (
            <View
              key={item.id}
              style={[
                estilos.balao,
                item.role === 'user' ? estilos.balaoUsuario : estilos.balaoMentor
              ]}
            >
              <Text style={estilos.textoMensagem}>
                {item.pendente && !item.content ? 'Pensando…' : item.content}
              </Text>
            </View>
          ))}
          {!respondendo && sugestoesDinamicas.length > 0 ? (
            <View style={estilos.sugestoesDinamicas}>
              <Text style={estilos.rotuloSugestoes}>Próximo passo</Text>
              {sugestoesDinamicas.map(sugestao => (
                <TouchableOpacity
                  key={sugestao}
                  style={estilos.sugestaoRapida}
                  onPress={() => enviar(sugestao)}
                  accessibilityRole="button"
                >
                  <Text style={estilos.textoSugestao}>{sugestao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
          {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
        </ScrollView>

        <View style={estilos.compositor}>
          <TextInput
            style={estilos.campoMensagem}
            value={entrada}
            onChangeText={setEntrada}
            placeholder="Pergunte algo ao seu mentor"
            placeholderTextColor={CORES.textoSecundario}
            multiline
            maxLength={1000}
            editable={!respondendo}
            accessibilityLabel="Mensagem para o mentor"
          />
          <TouchableOpacity
            style={[estilos.botaoEnviar, (respondendo || !entrada.trim()) && estilos.botaoDesativado]}
            onPress={() => enviar(entrada)}
            disabled={respondendo || !entrada.trim()}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
          >
            <Text style={estilos.textoEnviar}>{respondendo ? '…' : 'Enviar'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  inicioConteudo: { paddingTop: 16, paddingBottom: 32 },
  boasVindasInicio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  emojiInicio: { fontSize: 42, lineHeight: 52, marginRight: 12 },
  boasVindasTexto: { flex: 1 },
  saudacao: {
    color: CORES.texto,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: 'bold'
  },
  nomeInicio: { color: CORES.textoSecundario, fontSize: 14, lineHeight: 21, marginTop: 2 },
  falaInicio: { color: CORES.texto, fontSize: 14, lineHeight: 21, marginTop: 6 },
  cartaoPonto: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.destaque,
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 14
  },
  pontoTexto: { marginBottom: 12 },
  tituloCartao: { color: CORES.texto, fontSize: 17, lineHeight: 24, fontWeight: 'bold' },
  textoCartao: { color: CORES.textoSecundario, fontSize: 14, lineHeight: 21, marginTop: 4 },
  botaoPonto: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CORES.destaque,
    borderRadius: RAIO,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  botaoPontoFeito: { backgroundColor: CORES.borda },
  textoBotaoPonto: { color: '#000', fontSize: 15, lineHeight: 21, fontWeight: 'bold' },
  saldoBrasas: {
    color: CORES.destaque,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right'
  },
  dicaDoDia: {
    backgroundColor: CORES.superficie,
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 22
  },
  acoesDica: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  botaoDica: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  textoBotaoDica: { color: CORES.textoSecundario, fontSize: 13, lineHeight: 19, fontWeight: 'bold' },
  botaoPerguntaDica: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  textoBotaoPergunta: { color: CORES.destaque, fontSize: 13, lineHeight: 19, fontWeight: 'bold' },
  rotuloDica: {
    color: CORES.destaque,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  tituloDica: { color: CORES.texto, fontSize: 16, lineHeight: 23, fontWeight: 'bold' },
  tituloSecao: {
    color: CORES.texto,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  gradeDicas: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5, marginBottom: 14 },
  cartaoDica: {
    flexGrow: 1,
    flexBasis: 220,
    backgroundColor: CORES.superficie,
    borderRadius: RAIO,
    padding: 12,
    margin: 4
  },
  textoDica: { color: CORES.textoSecundario, fontSize: 13, lineHeight: 19, marginTop: 4 },
  linkDica: { alignSelf: 'flex-start', minHeight: 40, justifyContent: 'center', marginTop: 4 },
  textoLinkDica: { color: CORES.destaque, fontSize: 13, lineHeight: 19, fontWeight: 'bold' },
  receitaDoDia: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 22
  },
  tituloReceita: {
    color: CORES.texto,
    fontSize: 19,
    lineHeight: 26,
    fontWeight: 'bold',
    marginTop: 4
  },
  metaReceita: { color: CORES.destaque, fontSize: 13, lineHeight: 19, marginTop: 4 },
  botaoReceita: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', marginTop: 6 },
  botaoConversar: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 22
  },
  textoBotaoConversar: { color: CORES.destaque, fontSize: 16, lineHeight: 23, fontWeight: 'bold' },
  legendaConversar: { color: CORES.textoSecundario, fontSize: 13, lineHeight: 19, marginTop: 4 },
  gradeAtalhos: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  atalho: {
    minWidth: 100,
    flex: 1,
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderRadius: RAIO,
    paddingVertical: 14,
    paddingHorizontal: 8,
    margin: 4
  },
  emojiAtalho: { fontSize: 24, lineHeight: 32 },
  textoAtalho: { color: CORES.texto, fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 4 },
  voltarInicio: { alignSelf: 'flex-start', paddingVertical: 10, marginBottom: 12 },
  botaoVoltarChat: { paddingVertical: 8, paddingRight: 12 },
  centralizar: { alignItems: 'center', justifyContent: 'center', paddingVertical: 28 },
  emoji: { fontSize: 56, lineHeight: 68, marginBottom: 8 },
  titulo: {
    fontSize: 23,
    lineHeight: 31,
    fontWeight: 'bold',
    color: CORES.destaque,
    textAlign: 'center',
    marginBottom: 10
  },
  textoWeb: {
    maxWidth: 420,
    fontSize: 15,
    lineHeight: 23,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginBottom: 20
  },
  avisoModelo: {
    maxWidth: 420,
    backgroundColor: CORES.superficie,
    borderRadius: RAIO,
    padding: 14,
    marginBottom: 12
  },
  textoAviso: { color: CORES.texto, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  botaoPrincipal: {
    alignSelf: 'stretch',
    maxWidth: 420,
    backgroundColor: CORES.destaque,
    borderRadius: RAIO,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center'
  },
  textoBotaoPrincipal: { color: '#000', fontSize: 15, lineHeight: 21, fontWeight: 'bold' },
  progressoCaixa: { alignItems: 'center', alignSelf: 'stretch', maxWidth: 420 },
  textoProgresso: {
    color: CORES.texto,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center'
  },
  trilho: {
    alignSelf: 'stretch',
    height: 10,
    borderRadius: 5,
    backgroundColor: CORES.borda,
    overflow: 'hidden',
    marginTop: 14
  },
  barra: { height: '100%', backgroundColor: CORES.destaque },
  textoSecundario: {
    color: CORES.textoSecundario,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8
  },
  botaoSecundario: { padding: 12, marginTop: 6 },
  textoBotaoSecundario: { color: CORES.erro, fontSize: 14, fontWeight: 'bold' },
  textoBotaoOffline: { color: CORES.destaque, fontSize: 14, fontWeight: 'bold' },
  erro: { alignSelf: 'stretch', color: CORES.erro, fontSize: 14, lineHeight: 21, marginTop: 12 },
  telaChat: { paddingHorizontal: 0 },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda
  },
  emojiPequeno: { fontSize: 28, lineHeight: 36, marginRight: 10 },
  infoCabecalho: { flex: 1 },
  botaoBaixar: { paddingHorizontal: 10, paddingVertical: 8 },
  nomeMentor: { color: CORES.texto, fontSize: 16, lineHeight: 22, fontWeight: 'bold' },
  estadoMentor: { color: CORES.textoSecundario, fontSize: 12, lineHeight: 18 },
  limparTexto: { color: CORES.destaque, fontSize: 13, fontWeight: 'bold' },
  conversa: { flex: 1 },
  lista: { flex: 1 },
  listaConteudo: { padding: 16, paddingBottom: 20, flexGrow: 1 },
  boasVindas: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 },
  sugestao: {
    alignSelf: 'stretch',
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 12,
    marginTop: 8
  },
  textoSugestao: { color: CORES.texto, fontSize: 14, lineHeight: 20 },
  sugestoesDinamicas: { alignSelf: 'stretch', marginTop: 4, marginBottom: 8 },
  rotuloSugestoes: {
    color: CORES.textoSecundario,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 2
  },
  sugestaoRapida: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6
  },
  balao: {
    maxWidth: '88%',
    borderRadius: RAIO,
    paddingVertical: 10,
    paddingHorizontal: 13,
    marginBottom: 10
  },
  balaoUsuario: { alignSelf: 'flex-end', backgroundColor: CORES.destaque },
  balaoMentor: { alignSelf: 'flex-start', backgroundColor: CORES.superficie },
  textoMensagem: { color: CORES.texto, fontSize: 15, lineHeight: 22 },
  compositor: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: CORES.borda
  },
  campoMensagem: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: CORES.texto,
    fontSize: 15,
    lineHeight: 21,
    marginRight: 8
  },
  botaoEnviar: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RAIO,
    backgroundColor: CORES.destaque,
    paddingHorizontal: 14
  },
  botaoDesativado: { opacity: 0.5 },
  textoEnviar: { color: '#000', fontWeight: 'bold', fontSize: 14 }
});
