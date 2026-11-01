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
      <Text style={estilos.titulo}>Guia de cortes e preparos</Text>
      <Text style={estilos.descricao}>
        Explore carnes, frutas e vegetais. A maciez indicada para carnes é uma referência geral.
      </Text>

      <View style={estilos.aviso}>
        <Text style={estilos.avisoTitulo}>Segurança com alimentos</Text>
        <Text style={estilos.avisoTexto}>
          Use tábuas e utensílios separados para carnes cruas e alimentos prontos.
          Não lave carnes cruas: os respingos podem espalhar microrganismos.
          Lave as mãos e higienize frutas e vegetais antes de cortar.
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
            <Text style={estilos.nome}>{corte.nome}</Text>
            <Text style={estilos.regiao}>
              {corte.categoria === 'Frutas e vegetais'
                ? corte.tipo
                : `${corte.parte} · Dificuldade: ${corte.dificuldade}`}
            </Text>

            {corte.categoria !== 'Frutas e vegetais' ? (
              <View style={estilos.linhaMaciez}>
                <Text style={estilos.rotulo}>Maciez</Text>
                <Pontos valor={corte.maciez} />
                <Text style={estilos.gordura}>Gordura: {corte.gordura}</Text>
              </View>
            ) : null}

            <Text style={estilos.texto}>{corte.descricao}</Text>
            <Text style={estilos.subtitulo}>Uso ideal</Text>
            <Text style={estilos.texto}>{corte.usoIdeal}</Text>

            <TouchableOpacity
              style={estilos.botaoDica}
              onPress={() => setAberto(expandido ? null : corte.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandido }}
              accessibilityLabel={`${expandido ? 'Esconder' : 'Ver'} dica de preparo de ${corte.nome}`}
            >
              <Text style={estilos.textoBotaoDica}>
                {expandido ? 'Esconder dica de preparo' : 'Ver dica de preparo'}
              </Text>
            </TouchableOpacity>

            {expandido ? (
              <View style={estilos.caixaDica}>
                <Text style={estilos.texto}>{corte.dica}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 24, lineHeight: 32, fontWeight: 'bold', color: CORES.destaque },
  descricao: {
    fontSize: 14,
    lineHeight: 21,
    color: CORES.textoSecundario,
    marginTop: 4,
    marginBottom: 14
  },
  aviso: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 14,
    marginBottom: 14
  },
  avisoTitulo: {
    color: CORES.texto,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    marginBottom: 4
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
  textoFiltroAtivo: { color: '#000', fontWeight: 'bold' },
  cartao: {
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO,
    padding: 16,
    marginBottom: 12
  },
  nome: { fontSize: 19, lineHeight: 26, fontWeight: 'bold', color: CORES.texto },
  regiao: { fontSize: 13, lineHeight: 19, color: CORES.destaque, marginTop: 2 },
  linhaMaciez: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 10
  },
  rotulo: { fontSize: 13, lineHeight: 19, color: CORES.textoSecundario, marginRight: 8 },
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
  gordura: { fontSize: 13, lineHeight: 19, color: CORES.textoSecundario },
  texto: { fontSize: 14, lineHeight: 22, color: CORES.textoSecundario },
  subtitulo: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 12,
    marginBottom: 2
  },
  botaoDica: { alignSelf: 'flex-start', paddingVertical: 10, marginTop: 4 },
  textoBotaoDica: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    color: CORES.destaque
  },
  caixaDica: {
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
    paddingTop: 10
  }
});
