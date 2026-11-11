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
    estilo: 'mentora acolhedora, olho clínico e técnica passo a passo',
    saudacao: nome => `Vem cá${nome ? `, ${nome}` : ''}, relaxa os ombros que cozinhar não é bicho de sete cabeças. Olha essa bancada, vamos organizar tudo primeiro!`,
    retorno: nome => `Que bom ter você de volta${nome ? `, ${nome}` : ''}! Vamos com calma, prestando atenção nos aromas e respeitando os ingredientes.`,
    sugestoes: [
      'Como organizo meu mise en place na bancada?',
      'Por que não devo lavar o frango na pia?',
      'Qual o ponto certo da cebola e do alho no refogado?'
    ]
  },
  jose: {
    nome: 'Chef José',
    emoji: '👨‍🍳',
    estilo: 'o dono da praça, agilidade e energia carioca contagiante',
    saudacao: nome => `Aí sim${nome ? `, ${nome}` : ''}! Chegou na hora certa, a praça é nossa e hoje você vai sair daqui sabendo bater ponto de corte e segurar panela sem medo!`,
    retorno: nome => `Chegou quem faltava${nome ? `, ${nome}` : ''}! Fogo aceso, bancada brilhando e navalha nos cortes. O que vamos mandar pra chapa hoje?`,
    sugestoes: [
      'Como selar carne sem soltar água na panela?',
      'O que significa saltear e deglaçar a panela?',
      'Como evitar queimaduras e acidentes com óleo e panelas quentes?'
    ]
  }
};

const DICAS = [
  {
    emoji: '🥣',
    titulo: 'Mise en Place (Tudo no Lugar)',
    texto: 'Antes de riscar o fósforo, corte, meça e separe tudo em potinhos na bancada. Quem organiza a praça primeiro, nunca queima o alho por distração!',
    pergunta: 'Como fazer um bom mise en place na bancada?'
  },
  {
    emoji: '🍳',
    titulo: 'Saltear vs. Cozinhar na Água',
    texto: 'Saltear vem do francês "pular": frigideira bem quente, pouca gordura e espaço entre os pedaços. Se amontoar carne fria, a panela esfria e ela ferve na própria água.',
    pergunta: 'Qual a diferença entre selar, saltear e cozinhar na própria água?'
  },
  {
    emoji: '🧅',
    titulo: 'Dourar vs. Queimar a Cebola',
    texto: 'A cebola entra antes do alho. Dourar carameliza os açúcares naturais e traz doçura. Passou do ponto e escureceu demais? Vira cinza e amarga a comida toda.',
    pergunta: 'Como saber o ponto exato da cebola e do alho no refogado?'
  },
  {
    emoji: '♨️',
    titulo: 'Banho-maria & Ponto de Fita',
    texto: 'Banho-maria cozinha em calor suave e indireto (abaixo de 100°C), ideal para pudins e chocolate. Já o ponto de fita é bater ovos e açúcar até criar dobras volumosas que não desmancham.',
    pergunta: 'Para que serve o banho-maria e o que é o ponto de fita na confeitaria?'
  },
  {
    emoji: '🍗',
    titulo: 'Frango Cru: Nunca na Pia!',
    texto: 'Água na pia espalha bactérias perigosas por até 1 metro ao redor. O que mata micro-organismos é a temperatura do fogo acima de 74°C, e nunca a água da torneira.',
    pergunta: 'Por que nunca se deve lavar frango cru na pia da cozinha?'
  },
  {
    emoji: '🧊',
    titulo: 'Descongelar com Segurança',
    texto: 'Nunca deixe carne descongelando o dia todo na bancada morna. Passe do congelador para a prateleira de baixo da geladeira na véspera: suco preservado e segurança total!',
    pergunta: 'Qual é o jeito correto e seguro de descongelar alimentos?'
  },
  {
    emoji: '🔪',
    titulo: 'Tábua Firme & Dedos em Garra',
    texto: 'Tábua solta é perigo: coloque um pano úmido por baixo para travar. Curve as pontas dos dedos para dentro ("mão de garra") e deslize a lâmina contra as juntas dos dedos.',
    pergunta: 'Como posicionar as mãos para cortar alimentos com segurança?'
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
    : 'Não foi possível concluir a operação. Tente novamente.';
}

export default function Mentor() {
  const navigation = useNavigation();
  const {
    mentorEscolhido, brasas, streak, ultimoAcesso, registrarAcessoDiario, dadosPerfil
  } = useApp();
  const nomeUsuario = dadosPerfil?.nome?.trim();
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
  const falaInicio = typeof (pontoFeito ? mentor.retorno : mentor.saudacao) === 'function'
    ? (pontoFeito ? mentor.retorno(nomeUsuario) : mentor.saudacao(nomeUsuario))
    : (pontoFeito ? mentor.retorno : mentor.saudacao);
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
          setErro(`O modelo local não respondeu (${mensagemErro(falha)}). Usei o guia offline.`);
          respostaFinal = await responderMentorOffline(mentorEscolhido, conteudo, anteriores);
        }
      } else {
        respostaFinal = await responderMentorOffline(mentorEscolhido, conteudo, anteriores);
      }
      const concluida = {
        ...resposta,
        content: respostaFinal || textoParcial || 'Não consegui formular uma resposta. Tente perguntar de outro jeito.',
        pendente: false
      };
      setMensagens(lista => {
        const atualizada = lista.map(item => (item.id === resposta.id ? concluida : item));
        salvar(CHAVES.CONVERSA_MENTOR, atualizada);
        return atualizada;
      });
    } catch (falha) {
      setErro(mensagemErro(falha));
      setMensagens(anteriores);
    } finally {
      setRespondendo(false);
    }
  };

  const limparConversa = async () => {
    setMensagens([]);
    await salvar(CHAVES.CONVERSA_MENTOR, []);
  };

  const perguntarSobre = dica => {
    setTela('conversa');
    setTimeout(() => enviar(dica.pergunta), 150);
  };

  const perguntarReceita = receita => {
    setTela('conversa');
    setTimeout(() => enviar(`Como preparo a receita de ${receita.nome}?`), 150);
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
              <Text style={estilos.saudacao}>
                {nomeUsuario ? `Olá, ${nomeUsuario}! Que bom ter você na cozinha.` : 'Olá! Que bom ter você na cozinha.'}
              </Text>
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
                onPress={() => setIndiceDica(atual => (atual + 1) % DICAS.length)}
                accessibilityRole="button"
              >
                <Text style={estilos.linkDica}>Ver outra dica</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => perguntarSobre(dicaDoDia)}
                accessibilityRole="button"
              >
                <Text style={estilos.linkDicaDestaque}>Perguntar ao mentor</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={estilos.secaoInicio}>
            <Text style={estilos.tituloSecao}>Mais dicas para cozinhar melhor</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={estilos.listaDicasHorizontal}
            >
              {DICAS.map((item, index) => (
                <TouchableOpacity
                  key={item.titulo}
                  style={[
                    estilos.cartaoDicaPequeno,
                    index === indiceDica && estilos.cartaoDicaAtivo
                  ]}
                  onPress={() => setIndiceDica(index)}
                  accessibilityRole="button"
                >
                  <Text style={estilos.tituloDicaPequeno}>
                    {item.emoji} {item.titulo}
                  </Text>
                  <Text style={estilos.textoDicaPequeno} numberOfLines={3}>
                    {item.texto}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {receitaDoDia ? (
            <View style={estilos.cartaoReceitaDestaque}>
              <View style={estilos.cabecalhoDestaque}>
                <Text style={estilos.rotuloDestaque}>RECEITA DO DIA</Text>
                <Text style={estilos.nivelDestaque}>⭐ Nível {receitaDoDia.nivel || 1}</Text>
              </View>
              <Text style={estilos.tituloReceitaDestaque}>{receitaDoDia.nome}</Text>
              <Text style={estilos.tempoReceitaDestaque}>
                ⏱️ {receitaDoDia.tempo} · 🍽️ {receitaDoDia.porcoes}
              </Text>
              <Text style={estilos.textoCartao} numberOfLines={2}>
                {receitaDoDia.modoPreparo}
              </Text>
              <View style={estilos.acoesReceitaDestaque}>
                <TouchableOpacity
                  style={estilos.botaoReceitaVer}
                  onPress={() => navigation.navigate('Cozinha')}
                  accessibilityRole="button"
                >
                  <Text style={estilos.textoBotaoReceitaVer}>Ver no livro</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={estilos.botaoReceitaPerguntar}
                  onPress={() => perguntarReceita(receitaDoDia)}
                  accessibilityRole="button"
                >
                  <Text style={estilos.textoBotaoReceitaPerguntar}>Tirar dúvidas com o mentor</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={estilos.secaoInicio}>
            <Text style={estilos.tituloSecao}>Continuar aprendendo</Text>
            <View style={estilos.gradeAtalhos}>
              {ATALHOS.map(item => (
                <TouchableOpacity
                  key={item.rota}
                  style={estilos.cartaoAtalho}
                  onPress={() => navigation.navigate(item.rota)}
                  accessibilityRole="button"
                >
                  <Text style={estilos.emojiAtalho}>{item.emoji}</Text>
                  <Text style={estilos.tituloAtalho}>{item.titulo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </TelaSegura>
    );
  }

  return (
    <TelaSegura>
      <KeyboardAvoidingView
        style={estilos.conteudo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => setTela('inicio')} style={estilos.botaoVoltar}>
            <Text style={estilos.textoBotaoVoltar}>← Início</Text>
          </TouchableOpacity>
          <View style={estilos.infoMentorCabecalho}>
            <Text style={estilos.emojiCabecalho}>{mentor.emoji}</Text>
            <Text style={estilos.nomeMentorCabecalho}>{mentor.nome}</Text>
          </View>
          <TouchableOpacity onPress={limparConversa} style={estilos.botaoLimpar}>
            <Text style={estilos.textoBotaoLimpar}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={listaRef}
          style={estilos.listaMensagens}
          contentContainerStyle={estilos.conteudoMensagens}
          onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
        >
          {mensagens.length === 0 ? (
            <View style={estilos.vazioContainer}>
              <Text style={estilos.emojiVazio}>{mentor.emoji}</Text>
              <Text style={estilos.textoVazio}>
                Pergunte qualquer coisa sobre culinária, ingredientes ou técnicas!
              </Text>
              <View style={estilos.sugestoesContainer}>
                {sugestoesIniciais.map((sug, i) => (
                  <TouchableOpacity
                    key={i}
                    style={estilos.botaoSugestao}
                    onPress={() => enviar(sug)}
                  >
                    <Text style={estilos.textoSugestao}>{sug}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            mensagens.map(msg => (
              <View
                key={msg.id}
                style={[
                  estilos.balaoMensagem,
                  msg.role === 'user' ? estilos.balaoUsuario : estilos.balaoAssistente
                ]}
              >
                <Text style={msg.role === 'user' ? estilos.textoMensagemUsuario : estilos.textoMensagemAssistente}>
                  {msg.content}
                </Text>
              </View>
            ))
          )}
          {respondendo && (
            <View style={estilos.carregandoContainer}>
              <ActivityIndicator color={CORES.destaque} size="small" />
              <Text style={estilos.textoCarregando}>{mentor.nome} está respondendo...</Text>
            </View>
          )}
        </ScrollView>

        <View style={estilos.areaEntrada}>
          <TextInput
            style={estilos.campoEntrada}
            placeholder={`Pergunte ao ${mentor.nome}...`}
            placeholderTextColor={CORES.textoSecundario}
            value={entrada}
            onChangeText={setEntrada}
            onSubmitEditing={() => enviar(entrada)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[estilos.botaoEnviar, (!entrada.trim() || respondendo) && estilos.botaoDesativado]}
            onPress={() => enviar(entrada)}
            disabled={!entrada.trim() || respondendo}
          >
            <Text style={estilos.textoBotaoEnviar}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  inicioConteudo: { padding: 16, paddingBottom: 32 },
  boasVindasInicio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda
  },
  emojiInicio: { fontSize: 42, marginRight: 14 },
  boasVindasTexto: { flex: 1 },
  saudacao: { color: CORES.texto, fontSize: 18, fontWeight: 'bold' },
  nomeInicio: { color: CORES.destaque, fontSize: 12, marginTop: 2, fontWeight: '600' },
  falaInicio: { color: CORES.textoSecundario, fontSize: 14, lineHeight: 20, marginTop: 4 },
  cartaoPonto: {
    backgroundColor: CORES.superficie,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda
  },
  pontoTexto: { marginBottom: 12 },
  tituloCartao: { color: CORES.texto, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  textoCartao: { color: CORES.textoSecundario, fontSize: 14, lineHeight: 20 },
  botaoPonto: {
    backgroundColor: CORES.destaque,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8
  },
  botaoPontoFeito: { backgroundColor: '#334155' },
  textoBotaoPonto: { color: '#0F172A', fontSize: 15, fontWeight: 'bold' },
  saldoBrasas: { color: CORES.destaque, fontSize: 13, fontWeight: 'bold', textAlign: 'right' },
  dicaDoDia: {
    backgroundColor: CORES.superficie,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda
  },
  rotuloDica: { color: CORES.destaque, fontSize: 11, fontWeight: 'bold', marginBottom: 6 },
  tituloDica: { color: CORES.texto, fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  acoesDica: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  linkDica: { color: CORES.textoSecundario, fontSize: 13, fontWeight: '600' },
  linkDicaDestaque: { color: CORES.destaque, fontSize: 13, fontWeight: 'bold' },
  secaoInicio: { marginBottom: 16 },
  tituloSecao: { color: CORES.texto, fontSize: 17, fontWeight: 'bold', marginBottom: 12 },
  listaDicasHorizontal: { gap: 12 },
  cartaoDicaPequeno: {
    width: 200,
    backgroundColor: CORES.superficie,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: CORES.borda
  },
  cartaoDicaAtivo: { borderColor: CORES.destaque },
  tituloDicaPequeno: { color: CORES.texto, fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  textoDicaPequeno: { color: CORES.textoSecundario, fontSize: 12, lineHeight: 18 },
  cartaoGuiaCortes: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoGuiaCortes: { flex: 1, paddingRight: 12 },
  tituloGuiaCortes: { color: CORES.destaque, fontSize: 15, fontWeight: 'bold' },
  subtituloGuiaCortes: { color: CORES.textoSecundario, fontSize: 12, marginTop: 2 },
  botaoAbrirCortes: {
    backgroundColor: CORES.destaque,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  textoBotaoAbrirCortes: { color: '#0F172A', fontSize: 12, fontWeight: 'bold' },
  cartaoReceitaDestaque: {
    backgroundColor: CORES.superficie,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda
  },
  cabecalhoDestaque: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rotuloDestaque: { color: CORES.destaque, fontSize: 11, fontWeight: 'bold' },
  nivelDestaque: { color: CORES.textoSecundario, fontSize: 12 },
  tituloReceitaDestaque: { color: CORES.texto, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  tempoReceitaDestaque: { color: CORES.textoSecundario, fontSize: 13, marginBottom: 8 },
  acoesReceitaDestaque: { flexDirection: 'row', gap: 10, marginTop: 12 },
  botaoReceitaVer: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  textoBotaoReceitaVer: { color: CORES.texto, fontSize: 13, fontWeight: 'bold' },
  botaoReceitaPerguntar: {
    flex: 1.4,
    backgroundColor: CORES.destaque,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  textoBotaoReceitaPerguntar: { color: '#0F172A', fontSize: 13, fontWeight: 'bold' },
  gradeAtalhos: { flexDirection: 'row', gap: 10 },
  cartaoAtalho: {
    flex: 1,
    backgroundColor: CORES.superficie,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.borda
  },
  emojiAtalho: { fontSize: 28, marginBottom: 6 },
  tituloAtalho: { color: CORES.texto, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  conteudo: { flex: 1, backgroundColor: CORES.fundo },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    backgroundColor: CORES.superficie
  },
  botaoVoltar: { padding: 6 },
  textoBotaoVoltar: { color: CORES.destaque, fontSize: 14, fontWeight: 'bold' },
  infoMentorCabecalho: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emojiCabecalho: { fontSize: 22 },
  nomeMentorCabecalho: { color: CORES.texto, fontSize: 16, fontWeight: 'bold' },
  botaoLimpar: { padding: 6 },
  textoBotaoLimpar: { color: CORES.textoSecundario, fontSize: 13 },
  listaMensagens: { flex: 1 },
  conteudoMensagens: { padding: 16, gap: 12 },
  balaoMensagem: { maxWidth: '82%', borderRadius: 14, padding: 12 },
  balaoUsuario: { alignSelf: 'flex-end', backgroundColor: '#1E3A8A' },
  balaoAssistente: { alignSelf: 'flex-start', backgroundColor: CORES.superficie, borderWidth: 1, borderColor: CORES.borda },
  textoMensagemUsuario: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 },
  textoMensagemAssistente: { color: CORES.texto, fontSize: 15, lineHeight: 22 },
  vazioContainer: { alignItems: 'center', paddingVertical: 30 },
  emojiVazio: { fontSize: 48, marginBottom: 12 },
  textoVazio: { color: CORES.textoSecundario, textAlign: 'center', fontSize: 15, marginBottom: 20 },
  sugestoesContainer: { gap: 10, width: '100%' },
  botaoSugestao: {
    backgroundColor: CORES.superficie,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda
  },
  textoSugestao: { color: CORES.texto, fontSize: 14, textAlign: 'center' },
  carregandoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10 },
  textoCarregando: { color: CORES.textoSecundario, fontSize: 13, fontStyle: 'italic' },
  areaEntrada: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
    backgroundColor: CORES.superficie,
    gap: 8
  },
  campoEntrada: {
    flex: 1,
    backgroundColor: CORES.fundo,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: CORES.texto,
    fontSize: 15,
    borderWidth: 1,
    borderColor: CORES.borda
  },
  botaoEnviar: {
    backgroundColor: CORES.destaque,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  botaoDesativado: { opacity: 0.5 },
  textoBotaoEnviar: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 }
});