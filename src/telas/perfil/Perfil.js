import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../estados/ContextoApp';
import AvatarPerfil from '../../componentes/AvatarPerfil';
import BarraNivel from '../../componentes/progresso/BarraNivel';
import { NIVEIS } from '../../dados/niveis';
import { escolherFotoGaleria, tirarFotoCamera } from '../../servicos/perfilService';

export default function Perfil() {
  const {
    dadosPerfil,
    salvarPerfilCompleto,
    brasas = 0,
    exp = 0,
    nivel = 1,
    historico = [],
    favoritos = [],
    streak = 0,
    perfilCompleto
  } = useApp();

  const navegacao = useNavigation();
  const [nome, setNome] = useState(dadosPerfil?.nome || '');
  const [fotoUri, setFotoUri] = useState(dadosPerfil?.avatarUri || null);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    if (dadosPerfil?.nome) setNome(dadosPerfil.nome);
    if (dadosPerfil?.avatarUri) setFotoUri(dadosPerfil.avatarUri);
  }, [dadosPerfil]);

  const infoNivel = NIVEIS.find(n => n.nivel === nivel) || NIVEIS[0];
  const proximoNivel = NIVEIS.find(n => n.nivel === nivel + 1);

  const pegarFotoGaleria = async () => {
    try {
      const res = await escolherFotoGaleria();
      if (res?.sucesso && res?.uri) {
        setFotoUri(res.uri);
      } else if (res?.mensagem) {
        Alert.alert('Foto', res.mensagem);
      }
    } catch (e) {
      console.warn('Erro ao pegar foto:', e);
    }
  };

  const pegarFotoCamera = async () => {
    try {
      const res = await tirarFotoCamera();
      if (res?.sucesso && res?.uri) {
        setFotoUri(res.uri);
      } else if (res?.mensagem) {
        Alert.alert('Câmera', res.mensagem);
      }
    } catch (e) {
      console.warn('Erro ao abrir câmera:', e);
    }
  };

  const salvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Por favor, digite o seu nome para o perfil.');
      return;
    }
    setSalvando(true);
    setMensagemSucesso('');
    try {
      await salvarPerfilCompleto(nome.trim(), fotoUri);
      setMensagemSucesso('Perfil salvo com sucesso!');
      setTimeout(() => setMensagemSucesso(''), 3000);

      if (navegacao?.navigate) {
        try {
          navegacao.navigate('Mentor');
        } catch (_) {}
      }
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const irParaInicio = () => {
    if (navegacao?.navigate) {
      try {
        navegacao.navigate('Mentor');
      } catch (_) {
        if (navegacao.canGoBack()) navegacao.goBack();
      }
    }
  };

  const formatarData = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch (_) {
      return '';
    }
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      {/* CARD PRINCIPAL: FOTO, NOME E SALVAR */}
      <View style={estilos.cardPrincipal}>
        <Text style={estilos.tituloPrincipal}>
          {perfilCompleto ? 'Meu Perfil' : 'Crie seu Perfil'}
        </Text>
        <Text style={estilos.subtituloPrincipal}>
          {perfilCompleto
            ? 'Personalize suas informações e acompanhe sua evolução'
            : 'Configure seu nome e avatar para começar sua jornada culinária'}
        </Text>

        <View style={estilos.avatarContainer}>
          <AvatarPerfil uri={fotoUri} tamanho={110} />
        </View>

        <View style={estilos.botoesFotoLinha}>
          <TouchableOpacity style={estilos.botaoFoto} onPress={pegarFotoGaleria}>
            <Text style={estilos.textoBotaoFoto}>🖼️ Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botaoFoto} onPress={pegarFotoCamera}>
            <Text style={estilos.textoBotaoFoto}>📷 Câmera</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.grupoCampo}>
          <Text style={estilos.labelCampo}>Nome do Chef:</Text>
          <TextInput
            style={estilos.input}
            placeholder="Digite seu nome..."
            placeholderTextColor="#A0826D"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />
        </View>

        {mensagemSucesso ? (
          <Text style={estilos.textoSucesso}>✅ {mensagemSucesso}</Text>
        ) : null}

        <TouchableOpacity
          style={[estilos.botaoSalvar, salvando && estilos.botaoDesativado]}
          onPress={salvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={estilos.textoBotaoSalvar}>
              {perfilCompleto ? 'Salvar Alterações' : 'Salvar e Continuar'}
            </Text>
          )}
        </TouchableOpacity>

        {perfilCompleto && (
          <TouchableOpacity style={estilos.botaoSecundario} onPress={irParaInicio}>
            <Text style={estilos.textoBotaoSecundario}>Ir para o Início (Mentor) →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SISTEMA DE NÍVEIS E PROGRESSO DE EXP */}
      <View style={estilos.card}>
        <View style={estilos.linhaNivelCabecalho}>
          <Text style={estilos.iconeNivel}>{infoNivel.icone || '🌱'}</Text>
          <View style={estilos.infoNivelTexto}>
            <Text style={estilos.nomeNivel}>{infoNivel.nome}</Text>
            <Text style={estilos.numeroNivel}>Nível {nivel}</Text>
          </View>
        </View>

        <View style={estilos.espacoBarra}>
          <BarraNivel expAtual={exp} nivelAtual={nivel} />
        </View>

        {proximoNivel && (
          <Text style={estilos.proximoNivelTexto}>
            Próximo: {proximoNivel.icone} {proximoNivel.nome} ({proximoNivel.expNecessaria} EXP)
          </Text>
        )}
      </View>

      {/* CARDS DE ESTATÍSTICAS */}
      <View style={estilos.linhaEstatisticas}>
        <View style={estilos.cardStat}>
          <Text style={estilos.iconeStat}>🔥</Text>
          <Text style={estilos.valorStat}>{brasas}</Text>
          <Text style={estilos.rotuloStat}>Brasas</Text>
        </View>

        <View style={estilos.cardStat}>
          <Text style={estilos.iconeStat}>⚡</Text>
          <Text style={estilos.valorStat}>{streak}</Text>
          <Text style={estilos.rotuloStat}>Dias Seguidos</Text>
        </View>

        <View style={estilos.cardStat}>
          <Text style={estilos.iconeStat}>🍲</Text>
          <Text style={estilos.valorStat}>{favoritos.length}</Text>
          <Text style={estilos.rotuloStat}>Favoritos</Text>
        </View>
      </View>

      {/* SISTEMA DE HISTÓRICO DE ATIVIDADES */}
      <View style={estilos.card}>
        <Text style={estilos.tituloSecao}>📜 Histórico de Atividades</Text>
        {historico && historico.length > 0 ? (
          historico.map((item, index) => (
            <View key={index} style={estilos.itemHistorico}>
              <View style={estilos.infoHistorico}>
                <Text style={estilos.motivoHistorico}>{item.motivo || 'Atividade culinária'}</Text>
                <Text style={estilos.dataHistorico}>{formatarData(item.data)}</Text>
              </View>
              <Text style={estilos.quantidadeHistorico}>
                {item.quantidade >= 0 ? `+${item.quantidade}` : item.quantidade} 🔥
              </Text>
            </View>
          ))
        ) : (
          <View style={estilos.historicoVazio}>
            <Text style={estilos.textoHistoricoVazio}>
              Nenhuma atividade recente registrada ainda. Conclua receitas, jogos ou acesse diariamente para acumular brasas!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0'
  },
  conteudo: {
    padding: 16,
    paddingBottom: 40
  },
  cardPrincipal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0E0D0'
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C3D2E',
    textAlign: 'center'
  },
  subtituloPrincipal: {
    fontSize: 14,
    color: '#8B5A2B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  botoesFotoLinha: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16
  },
  botaoFoto: {
    backgroundColor: '#FDF4EB',
    borderWidth: 1,
    borderColor: '#D4A040',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  textoBotaoFoto: {
    color: '#8B5A2B',
    fontSize: 14,
    fontWeight: '600'
  },
  grupoCampo: {
    marginBottom: 16
  },
  labelCampo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5C3D2E',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#D4A040',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#5C3D2E'
  },
  textoSucesso: {
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12
  },
  botaoSalvar: {
    backgroundColor: '#CD6800',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4
  },
  botaoDesativado: {
    opacity: 0.7
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  botaoSecundario: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8
  },
  textoBotaoSecundario: {
    color: '#8B5A2B',
    fontSize: 14,
    fontWeight: '600'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0E0D0'
  },
  linhaNivelCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  iconeNivel: {
    fontSize: 34,
    marginRight: 12
  },
  infoNivelTexto: {
    flex: 1
  },
  nomeNivel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C3D2E'
  },
  numeroNivel: {
    fontSize: 13,
    color: '#8B5A2B',
    fontWeight: '600'
  },
  espacoBarra: {
    marginVertical: 4
  },
  proximoNivelTexto: {
    marginTop: 8,
    fontSize: 12,
    color: '#A0826D',
    fontStyle: 'italic'
  },
  linhaEstatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16
  },
  cardStat: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E0D0',
    elevation: 1
  },
  iconeStat: {
    fontSize: 22,
    marginBottom: 4
  },
  valorStat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C3D2E'
  },
  rotuloStat: {
    fontSize: 11,
    color: '#8B5A2B',
    marginTop: 2
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5C3D2E',
    marginBottom: 12
  },
  itemHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EBE0'
  },
  infoHistorico: {
    flex: 1,
    paddingRight: 10
  },
  motivoHistorico: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C3D2E'
  },
  dataHistorico: {
    fontSize: 11,
    color: '#A0826D',
    marginTop: 2
  },
  quantidadeHistorico: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#CD6800'
  },
  historicoVazio: {
    paddingVertical: 14,
    alignItems: 'center'
  },
  textoHistoricoVazio: {
    color: '#A0826D',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18
  }
});