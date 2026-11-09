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

function corrigirRotuloHistorico(motivo) {
  const rotulosAntigos = {
    'Acesso diario': 'Acesso diário',
    'Bonus de boas-vindas': 'Bônus de boas-vindas',
    'Minicozinha: Feiioada Completa': 'Minicozinha: Feijoada Completa'
  };
  const texto = motivo || 'Atividade culinária';
  return rotulosAntigos[texto] || texto;
}

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

  const conquistas = [
    {
      id: 'perfil',
      icone: '🍳',
      titulo: 'Início da Jornada',
      descricao: 'Criou seu perfil de Chef no Farofa Digital',
      desbloqueada: Boolean(perfilCompleto || nome.trim())
    },
    {
      id: 'primeira_brasa',
      icone: '🔥',
      titulo: 'Primeira Chama',
      descricao: 'Acumulou suas primeiras brasas',
      desbloqueada: brasas > 0
    },
    {
      id: 'foco_diario',
      icone: '⚡',
      titulo: 'Chef Constante',
      descricao: '3 ou mais dias consecutivos de acesso',
      desbloqueada: streak >= 3
    },
    {
      id: 'nivel_2',
      icone: '👨‍🍳',
      titulo: 'Promoção na Cozinha',
      descricao: 'Subiu para o Nível 2 ou superior',
      desbloqueada: nivel >= 2
    },
    {
      id: 'favoritos',
      icone: '⭐',
      titulo: 'Caderno de Receitas',
      descricao: 'Favoritou pelo menos 1 receita',
      desbloqueada: favoritos.length >= 1
    },
    {
      id: 'veterano',
      icone: '🏆',
      titulo: 'Mestre Farofeiro',
      descricao: 'Conquistou 500 EXP ou mais',
      desbloqueada: exp >= 500
    }
  ];

  const totalDesbloqueadas = conquistas.filter(c => c.desbloqueada).length;

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      {/* CARD PRINCIPAL */}
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
          <TouchableOpacity style={estilos.botaoFoto} onPress={pegarFotoGaleria} activeOpacity={0.7}>
            <Text style={estilos.textoBotaoFoto}>🖼️ Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botaoFoto} onPress={pegarFotoCamera} activeOpacity={0.7}>
            <Text style={estilos.textoBotaoFoto}>📷 Câmera</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.grupoCampo}>
          <Text style={estilos.labelCampo}>Nome do Chef:</Text>
          <TextInput
            style={estilos.input}
            placeholder="Digite seu nome..."
            placeholderTextColor="#64748B"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />
        </View>

        {mensagemSucesso ? (
          <Text style={estilos.textoSucesso}>✓ {mensagemSucesso}</Text>
        ) : null}

        <TouchableOpacity
          style={[estilos.botaoSalvar, salvando && estilos.botaoDesativado]}
          onPress={salvar}
          disabled={salvando}
          activeOpacity={0.8}
        >
          {salvando ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text style={estilos.textoBotaoSalvar}>
              {perfilCompleto ? 'Salvar Perfil' : 'Salvar e Continuar'}
            </Text>
          )}
        </TouchableOpacity>

        {perfilCompleto && (
          <TouchableOpacity style={estilos.botaoSecundario} onPress={irParaInicio} activeOpacity={0.7}>
            <Text style={estilos.textoBotaoSecundario}>Ir para o Início (Mentor) →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* NÍVEIS E EXP */}
      <View style={estilos.card}>
        <View style={estilos.linhaNivelCabecalho}>
          <Text style={estilos.iconeNivel}>{infoNivel.icone || '🍳'}</Text>
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

      {/* ESTATÍSTICAS */}
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

      {/* CONQUISTAS */}
      <View style={estilos.card}>
        <View style={estilos.cabecalhoSecao}>
          <Text style={estilos.tituloSecao}>🏆 Conquistas do Chef</Text>
          <Text style={estilos.contadorConquistas}>{totalDesbloqueadas}/{conquistas.length}</Text>
        </View>

        <View style={estilos.listaConquistas}>
          {conquistas.map((item) => (
            <View
              key={item.id}
              style={[
                estilos.itemConquista,
                item.desbloqueada ? estilos.conquistaDesbloqueada : estilos.conquistaBloqueada
              ]}
            >
              <Text style={estilos.iconeConquista}>{item.icone}</Text>
              <View style={estilos.infoConquista}>
                <Text style={[estilos.tituloConquista, !item.desbloqueada && estilos.textoDesbotado]}>
                  {item.titulo}
                </Text>
                <Text style={estilos.descConquista}>{item.descricao}</Text>
              </View>
              <View style={[estilos.badgeStatus, item.desbloqueada ? estilos.badgeDesbloqueada : estilos.badgeBloqueada]}>
                <Text style={estilos.textoBadge}>{item.desbloqueada ? '✓ Desbloqueada' : '🔒 Bloqueada'}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* HISTÓRICO */}
      <View style={estilos.card}>
        <Text style={estilos.tituloSecao}>📜 Histórico de Atividades</Text>
        {historico && historico.length > 0 ? (
          historico.map((item, index) => (
            <View key={index} style={estilos.itemHistorico}>
              <View style={estilos.infoHistorico}>
                <Text style={estilos.motivoHistorico}>{corrigirRotuloHistorico(item.motivo)}</Text>
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
    backgroundColor: '#121826'
  },
  conteudo: {
    padding: 16,
    paddingBottom: 40
  },
  cardPrincipal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center'
  },
  subtituloPrincipal: {
    fontSize: 14,
    lineHeight: 20,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
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
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  textoBotaoFoto: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600'
  },
  grupoCampo: {
    marginBottom: 16
  },
  labelCampo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#F8FAFC'
  },
  textoSucesso: {
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12
  },
  botaoSalvar: {
    backgroundColor: '#F5A623',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4
  },
  botaoDesativado: {
    opacity: 0.6
  },
  textoBotaoSalvar: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold'
  },
  botaoSecundario: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 8
  },
  textoBotaoSecundario: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600'
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155'
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
    color: '#F8FAFC'
  },
  numeroNivel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600'
  },
  espacoBarra: {
    marginVertical: 4
  },
  proximoNivelTexto: {
    marginTop: 8,
    fontSize: 12,
    color: '#94A3B8',
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
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  iconeStat: {
    fontSize: 22,
    marginBottom: 4
  },
  valorStat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC'
  },
  rotuloStat: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  cabecalhoSecao: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#F8FAFC'
  },
  contadorConquistas: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F5A623',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155'
  },
  listaConquistas: {
    gap: 10
  },
  itemConquista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1
  },
  conquistaDesbloqueada: {
    borderColor: '#F5A623'
  },
  conquistaBloqueada: {
    borderColor: '#334155',
    opacity: 0.7
  },
  iconeConquista: {
    fontSize: 24,
    marginRight: 12
  },
  infoConquista: {
    flex: 1,
    minWidth: 150
  },
  tituloConquista: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC'
  },
  textoDesbotado: {
    color: '#94A3B8'
  },
  descConquista: {
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
    marginTop: 2,
    flexShrink: 1
  },
  badgeStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    marginLeft: 36
  },
  badgeDesbloqueada: {
    backgroundColor: 'rgba(245, 166, 35, 0.15)'
  },
  badgeBloqueada: {
    backgroundColor: 'rgba(51, 65, 85, 0.4)'
  },
  textoBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F8FAFC'
  },
  itemHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },
  infoHistorico: {
    flex: 1,
    paddingRight: 10
  },
  motivoHistorico: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC'
  },
  dataHistorico: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  quantidadeHistorico: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F5A623'
  },
  historicoVazio: {
    paddingVertical: 14,
    alignItems: 'center'
  },
  textoHistoricoVazio: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18
  }
});