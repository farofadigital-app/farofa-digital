import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import { CORTES } from '../../dados/cortes';
import { CORES, RAIO } from '../../uteis/constantes';

const CATEGORIAS = ['Todos', 'Bovinos', 'Aves', 'Suínos', 'Frutas e vegetais'];

function Pontos({ valor }) {
  return (
    <View style={estilos.pontos}>
      {[1, 2, 3, 4, 5].map(numero => (
        <View
          key={numero}
          style={[estilos.ponto, numero <= valor && estilos.pontoCheio]}
        />
      ))}
    </View>
  );
}

export default function Cortes() {
  const [categoria, setCategoria] = useState('Todos');
  const [aberto, setAberto] = useState(null);

  const lista = useMemo(
    () => CORTES.filter(corte => categoria === 'Todos' || corte.categoria === categoria),
    [categoria]
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={estilos.conteudo}
    >
      <Text style={estilos.titulo}>Guia de Cortes, Facas & Técnicas</Text>
      <Text style={estilos.descricao}>
        Aprenda a escolher o corte certo, a faca ideal, a tábua correta e as técnicas clássicas de cozinha.
      </Text>

      <View style={estilos.aviso}>
        <Text style={estilos.avisoTitulo}>🛡️ Boas Práticas & Segurança com Alimentos</Text>
        <Text style={estilos.avisoTexto}>
          • Use tábuas separadas para carnes cruas e alimentos prontos para evitar contaminação cruzada.
          • Não lave carnes cruas: a água espalha bactérias pela pia e bancada.
          • Mantenha as lâminas sempre afiadas: faca cega exige força e escorrega com facilidade.
          • Lave bem as mãos antes de iniciar e após manusear carnes.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.filtros}
        contentContainerStyle={estilos.filtrosConteudo}
      >
        {CATEGORIAS.map(opcao => (
          <TouchableOpacity
            key={opcao}
            style={[estilos.filtro, categoria === opcao && estilos.filtroAtivo]}
            onPress={() => {
              setCategoria(opcao);
              setAberto(null);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: categoria === opcao }}
          >
            <Text style={[estilos.textoFiltro, categoria === opcao && estilos.textoFiltroAtivo]}>
              {opcao}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {lista.map(corte => {
        const expandido = aberto === corte.id;
        return (
          <View key={corte.id} style={estilos.cartao}>
            <View style={estilos.cabecalhoCartao}>
              <Text style={estilos.nome}>{corte.nome}</Text>
              <Text style={estilos.badgeCategoria}>{corte.categoria}</Text>
            </View>

            <Text style={estilos.regiao}>
              {corte.categoria === 'Frutas e vegetais'
                ? corte.parte
                : `${corte.parte} · Dificuldade: ${corte.dificuldade}`}
            </Text>

            {corte.categoria !== 'Frutas e vegetais' && corte.maciez ? (
              <View style={estilos.linhaMaciez}>
                <Text style={estilos.rotulo}>Maciez:</Text>
                <Pontos valor={corte.maciez} />
                <Text style={estilos.gordura}>Gordura: {corte.gordura}</Text>
              </View>
            ) : null}

            <Text style={estilos.textoDescricao}>{corte.descricao}</Text>

            {/* Faca e Tabua recomendadas */}
            <View style={estilos.caixaUtensilios}>
              {corte.faca ? (
                <Text style={estilos.itemUtensilio}>
                  <Text style={estilos.rotuloUtensilio}>🔪 Faca ideal: </Text>
                  {corte.faca}
                </Text>
              ) : null}
              {corte.tabua ? (
                <Text style={estilos.itemUtensilio}>
                  <Text style={estilos.rotuloUtensilio}>🪵 Tábua indicada: </Text>
                  {corte.tabua}
                </Text>
              ) : null}
              {corte.metodo ? (
                <Text style={estilos.itemUtensilio}>
                  <Text style={estilos.rotuloUtensilio}>🔥 Método: </Text>
                  {corte.metodo}
                </Text>
              ) : null}
            </View>

            <Text style={estilos.subtitulo}>Uso ideal</Text>
            <Text style={estilos.texto}>{corte.usoIdeal}</Text>

            <TouchableOpacity
              style={estilos.botaoDica}
              onPress={() => setAberto(expandido ? null : corte.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandido }}
              accessibilityLabel={`${expandido ? 'Esconder' : 'Ver'} dica do Chef para ${corte.nome}`}
            >
              <Text style={estilos.textoBotaoDica}>
                {expandido ? '▲ Esconder dica do Chef' : '▼ Ver dica técnica do Chef'}
              </Text>
            </TouchableOpacity>

            {expandido ? (
              <View style={estilos.caixaDica}>
                <Text style={estilos.textoDica}>{corte.dica}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, paddingBottom: 40 },
  titulo: { fontSize: 24, lineHeight: 32, fontWeight: 'bold', color: CORES.destaque },
  descricao: {
    fontSize: 14,
    lineHeight: 21,
    color: CORES.textoSecundario,
    marginTop: 4,
    marginBottom: 14
  },
  aviso: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: RAIO,
    padding: 14,
    marginBottom: 16
  },
  avisoTitulo: {
    color: CORES.destaque,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    marginBottom: 6
  },
  avisoTexto: { color: CORES.textoSecundario, fontSize: 13, lineHeight: 20 },
  filtros: { flexGrow: 0, marginBottom: 14 },
  filtrosConteudo: { paddingRight: 8 },
  filtro: {
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8
  },
  filtroAtivo: { backgroundColor: CORES.destaque, borderColor: CORES.destaque },
  textoFiltro: { fontSize: 13, lineHeight: 18, color: CORES.texto },
  textoFiltroAtivo: { color: '#0F172A', fontWeight: 'bold' },
  cartao: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 14
  },
  cabecalhoCartao: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  nome: { fontSize: 18, lineHeight: 24, fontWeight: 'bold', color: CORES.texto, flex: 1, paddingRight: 8 },
  badgeCategoria: {
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    color: CORES.destaque,
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  regiao: { fontSize: 13, lineHeight: 19, color: CORES.destaque, marginBottom: 8 },
  linhaMaciez: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10
  },
  rotulo: { fontSize: 13, color: CORES.textoSecundario, marginRight: 8 },
  pontos: { flexDirection: 'row', marginRight: 14 },
  ponto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CORES.destaque,
    marginRight: 4
  },
  pontoCheio: { backgroundColor: CORES.destaque },
  gordura: { fontSize: 13, color: CORES.textoSecundario },
  textoDescricao: { fontSize: 14, lineHeight: 21, color: '#E2E8F0', marginBottom: 10 },
  caixaUtensilios: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  itemUtensilio: { fontSize: 13, lineHeight: 19, color: '#CBD5E1', marginVertical: 2 },
  rotuloUtensilio: { fontWeight: 'bold', color: CORES.destaque },
  subtitulo: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 6,
    marginBottom: 2
  },
  texto: { fontSize: 13, lineHeight: 20, color: CORES.textoSecundario },
  botaoDica: { alignSelf: 'flex-start', paddingVertical: 8, marginTop: 8 },
  textoBotaoDica: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 'bold',
    color: CORES.destaque
  },
  caixaDica: {
    backgroundColor: 'rgba(245, 166, 35, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: CORES.destaque,
    padding: 10,
    marginTop: 6,
    borderRadius: 4
  },
  textoDica: { fontSize: 13, lineHeight: 20, color: '#FDE68A' }
});
