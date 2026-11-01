import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import TouchableOpacity from '../../componentes/comuns/BotaoInterativo';
import BarraNivel from '../../componentes/progresso/BarraNivel';
import { useApp } from '../../estados/ContextoApp';
import { CORES, RAIO } from '../../uteis/constantes';
import { NIVEIS } from '../../dados/niveis';

const MENTORES = {
  ana: { emoji: '👩‍🍳', nome: 'Chef Ana' },
  jose: { emoji: '👨‍🍳', nome: 'Chef José' }
};

function formatarData(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const dois = n => String(n).padStart(2, '0');
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function Perfil() {
  const { mentorEscolhido, brasas, exp, nivel, streak, historico, resetarApp } = useApp();
  const [confirmando, setConfirmando] = useState(false);
  const [erroReset, setErroReset] = useState('');

  const info = NIVEIS.find(n => n.nivel === nivel);
  const mentor = MENTORES[mentorEscolhido];

  const confirmarReset = async () => {
    setErroReset('');
    try {
      await resetarApp();
    } catch (erro) {
      setErroReset(
        erro instanceof Error
          ? `Não foi possível apagar os dados: ${erro.message}`
          : 'Não foi possível apagar os dados. Tente novamente.'
      );
    }
  };

  return (
    <TelaSegura>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
      >
        <View style={estilos.cartao}>
          {mentor && (
            <Text style={estilos.mentor}>
              {mentor.emoji} {mentor.nome}
            </Text>
          )}
          <Text style={estilos.nivelNome}>
            {info?.icone} {info?.nome}
          </Text>

          <View style={estilos.estatisticas}>
            <View style={estilos.estat}>
              <Text style={estilos.estatValor}>{brasas}</Text>
              <Text style={estilos.estatRotulo}>Brasas</Text>
            </View>
            <View style={estilos.estat}>
              <Text style={estilos.estatValor}>{nivel}</Text>
              <Text style={estilos.estatRotulo}>Nível</Text>
            </View>
            <View style={estilos.estat}>
              <Text style={estilos.estatValor}>{streak}</Text>
              <Text style={estilos.estatRotulo}>Dias seguidos</Text>
            </View>
          </View>

          <BarraNivel expAtual={exp} nivelAtual={nivel} />
        </View>

        <Text style={estilos.subtitulo}>Carreira · todos os níveis</Text>
        <View style={estilos.listaNiveis}>
          {NIVEIS.map(item => (
            <View
              key={item.nivel}
              style={[estilos.nivelLinha, item.nivel === nivel && estilos.nivelLinhaAtual]}
              accessibilityState={{ selected: item.nivel === nivel }}
            >
              <Text style={[estilos.nivelTexto, item.nivel === nivel && estilos.nivelTextoAtual]}>
                {item.icone} {item.nivel}. {item.nome}
                {item.nivel === nivel ? ' · Atual' : ''}
              </Text>
              <Text style={estilos.nivelExp}>{item.expNecessaria} EXP</Text>
            </View>
          ))}
        </View>

        <Text style={estilos.subtitulo}>Histórico de Brasas</Text>
        {historico.length === 0 ? (
          <Text style={estilos.vazio}>Nenhum ganho de Brasas ainda.</Text>
        ) : (
          historico.map((item, i) => (
            <View key={`${item.data}-${i}`} style={estilos.linha}>
              <View style={estilos.linhaInfo}>
                <Text style={estilos.motivo}>{item.motivo}</Text>
                <Text style={estilos.data}>{formatarData(item.data)}</Text>
              </View>
              <Text style={estilos.quantidade}>+{item.quantidade}</Text>
            </View>
          ))
        )}

        <View style={estilos.zonaPerigo}>
          {erroReset ? <Text style={estilos.erro}>{erroReset}</Text> : null}
          {confirmando && (
            <Text style={estilos.aviso}>
              Isso apaga Brasas, nível, favoritos e lista de compras, e volta para a
              escolha do mentor. Toque de novo para confirmar.
            </Text>
          )}
          <TouchableOpacity
            style={[estilos.botaoReset, confirmando && estilos.botaoResetAtivo]}
            activeOpacity={0.8}
            onPress={() => {
              if (confirmando) {
                confirmarReset();
              } else {
                setErroReset('');
                setConfirmando(true);
              }
            }}
          >
            <Text style={[estilos.botaoResetTexto, confirmando && estilos.botaoResetTextoAtivo]}>
              {confirmando ? 'Sim, apagar tudo' : 'Resetar todos os dados'}
            </Text>
          </TouchableOpacity>
          {confirmando && (
            <TouchableOpacity
              onPress={() => {
                setConfirmando(false);
                setErroReset('');
              }}
              style={estilos.cancelar}
            >
              <Text style={estilos.cancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  conteudo: { paddingTop: 16, paddingBottom: 32 },
  cartao: {
    backgroundColor: CORES.superficie,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24
  },
  mentor: {
    fontSize: 15,
    lineHeight: 22,
    color: CORES.textoSecundario,
    marginBottom: 4
  },
  nivelNome: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 16
  },
  estatisticas: { flexDirection: 'row', marginBottom: 8 },
  estat: { flex: 1, alignItems: 'center' },
  estatValor: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    color: CORES.destaque
  },
  estatRotulo: {
    fontSize: 12,
    lineHeight: 18,
    color: CORES.textoSecundario,
    textAlign: 'center'
  },
  subtitulo: {
    fontSize: 18,
    lineHeight: 26,
    color: CORES.texto,
    marginBottom: 12
  },
  listaNiveis: {
    backgroundColor: CORES.superficie,
    borderRadius: RAIO,
    paddingHorizontal: 12,
    marginBottom: 24
  },
  nivelLinha: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    paddingVertical: 8,
    paddingHorizontal: 6
  },
  nivelLinhaAtual: {
    backgroundColor: 'rgba(245,166,35,0.1)',
    borderRadius: 8
  },
  nivelTexto: { flex: 1, color: CORES.texto, fontSize: 14, lineHeight: 20 },
  nivelTextoAtual: { color: CORES.destaque, fontWeight: 'bold' },
  nivelExp: { marginLeft: 8, color: CORES.textoSecundario, fontSize: 12, lineHeight: 18 },
  vazio: {
    fontSize: 14,
    lineHeight: 22,
    color: CORES.textoSecundario,
    marginBottom: 12
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda
  },
  linhaInfo: { flex: 1, marginRight: 12 },
  motivo: { fontSize: 15, lineHeight: 22, color: CORES.texto },
  data: { fontSize: 12, lineHeight: 18, color: CORES.textoSecundario },
  quantidade: {
    flexShrink: 0,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    color: CORES.sucesso
  },
  zonaPerigo: { marginTop: 32 },
  aviso: {
    fontSize: 13,
    lineHeight: 20,
    color: CORES.textoSecundario,
    marginBottom: 12
  },
  erro: {
    fontSize: 14,
    lineHeight: 21,
    color: CORES.erro,
    marginBottom: 12
  },
  botaoReset: {
    borderWidth: 1,
    borderColor: CORES.erro,
    borderRadius: RAIO,
    paddingVertical: 14,
    alignItems: 'center'
  },
  botaoResetAtivo: { backgroundColor: CORES.erro },
  botaoResetTexto: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 'bold',
    color: CORES.erro
  },
  botaoResetTextoAtivo: { color: '#fff' },
  cancelar: { alignItems: 'center', paddingVertical: 12 },
  cancelarTexto: { fontSize: 14, lineHeight: 20, color: CORES.textoSecundario }
});
