import { useMemo, useState } from 'react';
import {
  ScrollView, StyleSheet, View
} from 'react-native';
import {
  CampoTextoResponsivo as TextInput, TextoResponsivo as Text
} from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import TouchableOpacity from '../../componentes/comuns/BotaoInterativo';
import { RECEITAS } from '../../dados/receitas';
import { INSUMOS_REGIONAIS } from '../../dados/insumos';
import { useApp } from '../../estados/ContextoApp';
import { CORES, RAIO } from '../../uteis/constantes';
import { normalizarBusca } from '../../uteis/formatacao';
import Cortes from './Cortes';

const ABAS = [
  { id: 'receitas', titulo: 'Receitas' },
  { id: 'lista', titulo: 'Lista' },
  { id: 'cortes', titulo: 'Cortes' }
];

export default function Cozinha() {
  const {
    favoritos, alternarFavorito, adicionarItensCompra, itensCompra,
    adicionarItemCompra, alternarItemCompra, removerItemCompra, limparComprados
  } = useApp();
  const [aba, setAba] = useState('receitas');
  const [busca, setBusca] = useState('');
  const [origemSelecionada, setOrigemSelecionada] = useState('Todas');
  const [receitaAberta, setReceitaAberta] = useState(null);
  const [novoItem, setNovoItem] = useState('');

  const origens = useMemo(
    () => ['Todas', ...new Set(RECEITAS.map(receita => receita.regiao))],
    []
  );

  const receitasFiltradas = useMemo(() => {
    const consulta = normalizarBusca(busca.trim());
    return RECEITAS.filter(receita =>
      (origemSelecionada === 'Todas' || receita.regiao === origemSelecionada)
      && (
        !consulta
        || [receita.nome, receita.categoria, receita.regiao, ...(receita.ingredientes || [])]
          .some(valor => normalizarBusca(valor).includes(consulta))
      )
    );
  }, [busca, origemSelecionada]);

  const adicionarItem = () => {
    adicionarItemCompra(novoItem);
    setNovoItem('');
  };

  const pendentes = itensCompra.filter(item => !item.comprado).length;
  const temComprados = itensCompra.some(item => item.comprado);

  return (
    <TelaSegura estilo={estilos.tela}>
      <View style={estilos.abas}>
        {ABAS.map(opcao => (
          <TouchableOpacity
            key={opcao.id}
            style={[estilos.aba, aba === opcao.id && estilos.abaAtiva]}
            onPress={() => setAba(opcao.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: aba === opcao.id }}
          >
            <Text style={[estilos.textoAba, aba === opcao.id && estilos.textoAbaAtiva]}>
              {opcao.titulo}
              {opcao.id === 'lista' && itensCompra.length > 0 ? ` (${itensCompra.length})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {aba === 'cortes' ? (
        <Cortes />
      ) : aba === 'receitas' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={estilos.conteudo}
        >
          <Text style={estilos.titulo}>Receitas do Brasil e do mundo</Text>
          <Text style={estilos.descricao}>
            Explore pratos de diferentes países, pesquise ingredientes e monte sua lista de compras.
          </Text>
          <TextInput
            style={estilos.input}
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar prato, país ou ingrediente"
            placeholderTextColor={CORES.textoSecundario}
            accessibilityLabel="Buscar receitas por prato, país ou ingrediente"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={estilos.filtros}
            contentContainerStyle={estilos.filtrosConteudo}
          >
            {origens.map(origem => (
              <TouchableOpacity
                key={origem}
                style={[
                  estilos.filtroOrigem,
                  origemSelecionada === origem && estilos.filtroOrigemAtivo
                ]}
                onPress={() => setOrigemSelecionada(origem)}
                accessibilityRole="button"
                accessibilityState={{ selected: origemSelecionada === origem }}
              >
                <Text
                  style={[
                    estilos.textoFiltroOrigem,
                    origemSelecionada === origem && estilos.textoFiltroOrigemAtivo
                  ]}
                >
                  {origem}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {receitasFiltradas.length === 0 ? (
            <Text style={estilos.vazio}>
              Nenhuma receita encontrada. Tente outro prato, país ou ingrediente.
            </Text>
          ) : receitasFiltradas.map(receita => {
            const aberta = receitaAberta === receita.id;
            const favorita = favoritos.includes(receita.id);
            return (
              <View key={receita.id} style={estilos.cartao}>
                <View style={estilos.topoCartao}>
                  <View style={estilos.infoReceita}>
                    <Text style={estilos.nomeReceita}>{receita.nome}</Text>
                    <Text style={estilos.regiao}>{receita.regiao} · {receita.categoria}</Text>
                  </View>
                  <TouchableOpacity
                    style={estilos.botaoFavorito}
                    onPress={() => alternarFavorito(receita.id)}
                    accessibilityRole="button"
                    accessibilityLabel={favorita
                      ? `Remover ${receita.nome} dos favoritos`
                      : `Adicionar ${receita.nome} aos favoritos`}
                  >
                    <Text style={[estilos.estrela, favorita && estilos.estrelaAtiva]}>
                      {favorita ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={estilos.detalhes}>
                  {receita.tempo} · {receita.dificuldade} · {receita.porcoes} porções
                </Text>

                <TouchableOpacity
                  style={estilos.botaoAbrir}
                  onPress={() => setReceitaAberta(aberta ? null : receita.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${aberta ? 'Fechar' : 'Ver'} receita ${receita.nome}`}
                >
                  <Text style={estilos.textoBotaoAbrir}>
                    {aberta ? 'Fechar receita' : 'Ver ingredientes e preparo'}
                  </Text>
                </TouchableOpacity>

                {aberta && (
                  <View style={estilos.detalhesReceita}>
                    <Text style={estilos.subtitulo}>Ingredientes</Text>
                    {receita.ingredientes.map((ingrediente, indice) => (
                      <Text key={`${receita.id}-${indice}`} style={estilos.ingrediente}>
                        {'•  '}{ingrediente}
                      </Text>
                    ))}
                    <Text style={[estilos.subtitulo, estilos.subtituloPreparo]}>Modo de preparo</Text>
                    <Text style={estilos.preparo}>{receita.modoPreparo}</Text>
                    <TouchableOpacity
                      style={estilos.botaoPrincipal}
                      onPress={() => {
                        adicionarItensCompra(receita.ingredientes);
                        setAba('lista');
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Adicionar ingredientes de ${receita.nome} à lista de compras`}
                    >
                      <Text style={estilos.textoBotaoPrincipal}>Adicionar ingredientes à lista</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : aba === 'lista' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={estilos.conteudo}
        >
          <Text style={estilos.titulo}>Lista de compras</Text>
          <Text style={estilos.descricao}>
            {pendentes > 0
              ? `${pendentes} ${pendentes === 1 ? 'item pendente' : 'itens pendentes'}`
              : itensCompra.length > 0 ? 'Tudo comprado!' : 'Adicione ingredientes de uma receita ou escreva um item.'}
          </Text>

          <View style={estilos.linhaAdd}>
            <TextInput
              style={[estilos.input, estilos.inputLista]}
              value={novoItem}
              onChangeText={setNovoItem}
              placeholder="Adicionar item à lista"
              placeholderTextColor={CORES.textoSecundario}
              onSubmitEditing={adicionarItem}
              returnKeyType="done"
              accessibilityLabel="Novo item da lista de compras"
            />
            <TouchableOpacity
              style={estilos.botaoAdd}
              activeOpacity={0.8}
              onPress={adicionarItem}
              accessibilityRole="button"
              accessibilityLabel="Adicionar item à lista"
            >
              <Text style={estilos.sinalAdd}>+</Text>
            </TouchableOpacity>
          </View>

          {itensCompra.map(item => (
            <View key={item.id} style={estilos.linhaItem}>
              <TouchableOpacity
                style={estilos.toqueItem}
                onPress={() => alternarItemCompra(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.comprado
                  ? `Desmarcar ${item.nome} como comprado`
                  : `Marcar ${item.nome} como comprado`}
              >
                <Text style={[estilos.marcadorItem, item.comprado && estilos.marcadorComprado]}>
                  {item.comprado ? '✓' : '○'}
                </Text>
                <Text style={[estilos.nomeItem, item.comprado && estilos.nomeComprado]}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removerItemCompra(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remover ${item.nome}`}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={estilos.removerItem}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          {temComprados && (
            <TouchableOpacity
              style={estilos.limpar}
              onPress={limparComprados}
              accessibilityRole="button"
            >
              <Text style={estilos.textoLimpar}>Limpar itens comprados</Text>
            </TouchableOpacity>
          )}

          <Text style={estilos.subtituloRegional}>Ingredientes regionais</Text>
          <Text style={estilos.descricaoRegional}>
            Escolha um ingrediente brasileiro para adicionar à lista.
          </Text>
          {(INSUMOS_REGIONAIS || []).map(insumo => {
            const naLista = itensCompra.some(
              item => item.nome.toLocaleLowerCase() === insumo.nome.toLocaleLowerCase()
            );
            return (
              <View key={insumo.id} style={estilos.cartaoRegional}>
                <View style={estilos.infoReceita}>
                  <Text style={estilos.nomeReceita}>{insumo.nome}</Text>
                  <Text style={estilos.regiao}>{insumo.regiao}</Text>
                  <Text style={estilos.descricaoRegional}>{insumo.descricao}</Text>
                </View>
                <TouchableOpacity
                  style={[estilos.botaoRegional, naLista && estilos.botaoRegionalAdicionado]}
                  disabled={naLista}
                  onPress={() => adicionarItemCompra(insumo.nome)}
                  accessibilityRole="button"
                  accessibilityLabel={naLista
                    ? `${insumo.nome} já está na lista`
                    : `Adicionar ${insumo.nome} à lista`}
                >
                  <Text style={[estilos.textoRegional, naLista && estilos.textoRegionalAdicionado]}>
                    {naLista ? 'Na lista' : '+ Adicionar'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : null}
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  tela: { paddingHorizontal: 0 },
  abas: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: RAIO
  },
  abaAtiva: { backgroundColor: CORES.destaque },
  textoAba: { color: CORES.textoSecundario, fontSize: 14, fontWeight: 'bold' },
  textoAbaAtiva: { color: '#000' },
  conteudo: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 24, lineHeight: 32, fontWeight: 'bold', color: CORES.destaque },
  descricao: {
    fontSize: 14,
    lineHeight: 21,
    color: CORES.textoSecundario,
    marginTop: 4,
    marginBottom: 14
  },
  input: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: CORES.texto,
    marginBottom: 14
  },
  filtros: { flexGrow: 0, marginBottom: 14 },
  filtrosConteudo: { paddingRight: 8 },
  filtroOrigem: {
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginRight: 8
  },
  filtroOrigemAtivo: { backgroundColor: CORES.destaque, borderColor: CORES.destaque },
  textoFiltroOrigem: { fontSize: 13, lineHeight: 18, color: CORES.texto },
  textoFiltroOrigemAtivo: { color: '#000', fontWeight: 'bold' },
  inputLista: { flex: 1, marginBottom: 0, marginRight: 10 },
  cartao: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 12
  },
  topoCartao: { flexDirection: 'row', alignItems: 'flex-start' },
  infoReceita: { flex: 1, marginRight: 8 },
  nomeReceita: { fontSize: 17, lineHeight: 24, fontWeight: 'bold', color: CORES.texto },
  regiao: { fontSize: 13, lineHeight: 19, color: CORES.destaque, marginTop: 2 },
  botaoFavorito: { paddingHorizontal: 6, paddingVertical: 2 },
  estrela: { fontSize: 26, lineHeight: 30, color: CORES.textoSecundario },
  estrelaAtiva: { color: CORES.destaque },
  detalhes: { fontSize: 13, lineHeight: 19, color: CORES.textoSecundario, marginTop: 8 },
  botaoAbrir: { alignSelf: 'flex-start', paddingVertical: 10 },
  textoBotaoAbrir: { fontSize: 14, lineHeight: 20, fontWeight: 'bold', color: CORES.destaque },
  detalhesReceita: { borderTopWidth: 1, borderTopColor: CORES.borda, paddingTop: 12 },
  subtitulo: { fontSize: 16, lineHeight: 23, fontWeight: 'bold', color: CORES.texto },
  ingrediente: { fontSize: 14, lineHeight: 21, color: CORES.textoSecundario, marginTop: 4 },
  subtituloPreparo: { marginTop: 16, marginBottom: 6 },
  preparo: { fontSize: 14, lineHeight: 22, color: CORES.textoSecundario },
  botaoPrincipal: {
    backgroundColor: CORES.destaque,
    borderRadius: RAIO,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 14
  },
  textoBotaoPrincipal: { color: '#000', fontSize: 14, lineHeight: 20, fontWeight: 'bold' },
  vazio: { color: CORES.textoSecundario, textAlign: 'center', marginTop: 24, lineHeight: 22 },
  linhaAdd: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  botaoAdd: {
    width: 48,
    height: 48,
    borderRadius: RAIO,
    backgroundColor: CORES.destaque,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sinalAdd: { fontSize: 28, lineHeight: 32, color: '#000', fontWeight: 'bold' },
  linhaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda
  },
  toqueItem: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  marcadorItem: { width: 26, textAlign: 'center', fontSize: 22, color: CORES.textoSecundario },
  marcadorComprado: { color: CORES.sucesso },
  nomeItem: { flex: 1, marginLeft: 10, fontSize: 15, lineHeight: 22, color: CORES.texto },
  nomeComprado: { textDecorationLine: 'line-through', color: CORES.textoSecundario },
  removerItem: { fontSize: 24, lineHeight: 28, color: CORES.textoSecundario },
  limpar: { alignItems: 'center', paddingVertical: 16 },
  textoLimpar: { fontSize: 14, lineHeight: 20, fontWeight: 'bold', color: CORES.destaque },
  subtituloRegional: {
    fontSize: 19,
    lineHeight: 27,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 24
  },
  descricaoRegional: { fontSize: 13, lineHeight: 20, color: CORES.textoSecundario, marginTop: 4 },
  cartaoRegional: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 14,
    marginTop: 10
  },
  botaoRegional: {
    backgroundColor: CORES.destaque,
    borderRadius: RAIO,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  botaoRegionalAdicionado: { backgroundColor: 'rgba(16,185,129,0.15)' },
  textoRegional: { color: '#000', fontSize: 12, lineHeight: 18, fontWeight: 'bold' },
  textoRegionalAdicionado: { color: CORES.sucesso }
});
