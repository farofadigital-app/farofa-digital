import { CORTES } from '../dados/cortes';
import { RECEITAS } from '../dados/receitas';
import { normalizarBusca } from '../uteis/formatacao';

const RECOMENDACOES_INICIAIS = [
  'Qual receita rápida você recomenda?',
  'Como deixo o arroz soltinho?',
  'Como corto legumes em tiras?'
];
const PALAVRAS_IGNORADAS = new Set([
  'com', 'das', 'dos', 'de', 'da', 'do', 'e', 'em', 'na', 'no'
]);

const normalizar = texto => normalizarBusca(texto).trim();

function contarInteracoes(historico = []) {
  return historico.filter(item => item?.role === 'user').length;
}

function receitaPorNome(pergunta) {
  return RECEITAS
    .map(receita => {
      const palavras = normalizar(receita.nome)
        .split(/\s+/)
        .filter(palavra => palavra.length > 2 && !PALAVRAS_IGNORADAS.has(palavra));
      return {
        receita,
        acertos: palavras.filter(palavra => pergunta.includes(palavra)).length,
        total: palavras.length
      };
    })
    .filter(item => item.acertos > 0)
    .sort((a, b) => b.acertos - a.acertos || b.total - a.total)[0]?.receita;
}

function receitaRecomendada(pergunta, historico) {
  let candidatas = RECEITAS;
  if (/doce|sobremesa|sobremesas/.test(pergunta)) {
    candidatas = candidatas.filter(receita => /doce|sobremesa/.test(normalizar(receita.categoria)));
  } else if (/rapida|rapido|facil/.test(pergunta)) {
    candidatas = candidatas.filter(receita => (receita.tempoMinutos || Infinity) <= 45);
  } else if (/vegetarian|sem carne|vegana/.test(pergunta)) {
    candidatas = candidatas.filter(receita =>
      !(receita.ingredientes || []).some(ingrediente =>
        /carne|frango|peixe|camarao|linguica|bacon|presunto|costela/.test(normalizar(ingrediente))
      )
    );
  }
  if (candidatas.length === 0) candidatas = RECEITAS;
  return candidatas[contarInteracoes(historico) % candidatas.length];
}

function resumirPreparo(texto = '') {
  const primeiraEtapa = texto.match(/[^.!?]+[.!?]?/)?.[0]?.trim() || texto;
  if (primeiraEtapa.length <= 160) return primeiraEtapa;
  return `${primeiraEtapa.slice(0, 157).replace(/\s+\S*$/, '')}…`;
}

function formatarReceita(receita) {
  const ingredientes = (receita.ingredientes || []).slice(0, 4);
  const extra = (receita.ingredientes || []).length > ingredientes.length ? ' e outros' : '';
  return `${receita.nome} · ${receita.tempo} · ${receita.porcoes} porções.\nIngredientes: ${ingredientes.join(', ')}${extra}.\nPreparo: ${resumirPreparo(receita.modoPreparo)}`;
}

function responderReceita(receita, pergunta) {
  if (/ingrediente|lista|o que vai/.test(pergunta)) {
    return `${receita.nome} · ${receita.tempo}.\nIngredientes: ${(receita.ingredientes || []).slice(0, 6).join(', ')}${(receita.ingredientes || []).length > 6 ? ' e outros' : ''}.`;
  }
  if (/preparo|passo|como fazer|como preparo|como cozinhar/.test(pergunta)) {
    return `${receita.nome}: ${resumirPreparo(receita.modoPreparo)}`;
  }
  return formatarReceita(receita);
}

function buscarCorte(pergunta) {
  return CORTES.find(corte => pergunta.includes(normalizar(corte.nome)));
}

function responderConhecimentoLocal(mentor, texto, historico) {
  const pergunta = normalizar(texto);

  if (/recomend|sugest|ideia/.test(pergunta) && /receita|prato|comida|cozinhar/.test(pergunta)) {
    return `Que tal ${formatarReceita(receitaRecomendada(pergunta, historico))}`;
  }

  if (/farofa/.test(pergunta) && /solt|como fazer|como preparo|dica/.test(pergunta)) {
    return 'Refogue os temperos, junte a farinha aos poucos e mexa em fogo baixo até dourar. Acerte o sal no final.';
  }
  if (/arroz/.test(pergunta) && /solt|como fazer|como preparo|dica/.test(pergunta)) {
    return 'Refogue os grãos, adicione o líquido na proporção indicada pela receita e cozinhe em panela tampada, em fogo baixo. Descanse alguns minutos antes de soltar os grãos com um garfo.';
  }

  const receita = receitaPorNome(pergunta);
  if (receita) return responderReceita(receita, pergunta);

  const corte = buscarCorte(pergunta);
  if (corte) {
    const uso = corte.categoria === 'Frutas e vegetais'
      ? `Técnica: ${corte.tipo}.`
      : `${corte.categoria} · ${corte.parte} · maciez ${corte.maciez}/5.`;
    return `${corte.nome} — ${uso}\n${corte.usoIdeal} ${corte.dica}`;
  }

  if (/substitu|trocar|alternativ|nao tenho|sem ingrediente/.test(pergunta)) {
    return 'Qual ingrediente falta e em qual receita? Com esses dois detalhes, sugiro uma troca mais certeira.';
  }
  if (/frango cru|lavar frango|lavar carne/.test(pergunta)) {
    return 'Não lave frango nem outras carnes cruas: os respingos podem espalhar microrganismos pela pia e pelas superfícies. Cozinhe completamente e higienize as mãos, os utensílios e a bancada depois do contato.';
  }
  if (/seguranca|higien|contamin|carne crua|validade|conserv|geladeira|descongel/.test(pergunta)) {
    return 'Lave as mãos antes e depois de manipular alimentos. Separe carnes cruas dos alimentos prontos, higienize os utensílios e mantenha os perecíveis refrigerados. Não lave carnes cruas; cozinhe-as completamente.';
  }
  if (/cortar|corte|faca|julienne|brunoise|chiffonade|rodela|bastao|cubo/.test(pergunta)) {
    return 'Use uma tábua firme e mantenha os dedos recolhidos. Julienne são tiras finas; brunoise são cubinhos; rodelas são fatias transversais. Veja o guia em Receitas > Cortes.';
  }
  if (/veg|vegetarian|sem carne/.test(pergunta)) {
    return 'Feijão, lentilha, grão-de-bico, cogumelos ou tofu podem substituir a carne, conforme o prato. Qual receita você quer adaptar?';
  }
  if (/assar|frit|cozinh|ferver|temperatura|fogo|refog/.test(pergunta)) {
    return 'Fogo baixo cozinha devagar; fogo alto sela e doura rápido. Para assar, preaqueça o forno e siga o tempo indicado na receita.';
  }

  const sugestoes = RECEITAS.slice(0, 3).map(receita => receita.nome).join(', ');
  const convite = mentor === 'jose'
    ? 'Conte o que você tem na despensa e vamos pensar em um prato.'
    : 'Se me disser o ingrediente ou a etapa que está em dúvida, eu ajudo a encontrar um caminho.';
  return `Posso ajudar com receitas, ingredientes, cortes, preparo e higiene. Pergunte sobre ${sugestoes} ou escolha uma etapa para explorar. ${convite}`;
}

export async function responderMentorOffline(mentor, texto, historico = []) {
  const resposta = responderConhecimentoLocal(mentor, texto, historico);
  const indiceInteracao = contarInteracoes(historico) % 2;
  const abertura = mentor === 'jose'
    ? ['Vamos direto ao ponto:', 'Dica prática:'][indiceInteracao]
    : ['Claro, vamos por partes:', 'Com prazer:'][indiceInteracao];
  return `${abertura} ${resposta}`;
}

export function obterSugestoesOffline(texto, historico = []) {
  const pergunta = normalizar(texto);
  const receita = receitaPorNome(pergunta);
  const corte = buscarCorte(pergunta);
  let sugestoes;

  if (receita) {
    sugestoes = [
      `Quais ingredientes vão em ${receita.nome}?`,
      `Resuma o preparo de ${receita.nome}`,
      `Qual ingrediente posso substituir?`,
    ];
  } else if (corte) {
    sugestoes = [`Como preparo ${corte.nome}?`, 'Qual faca devo usar?', 'Como armazeno com segurança?'];
  } else if (/substitu|ingrediente/.test(pergunta)) {
    sugestoes = ['Quero adaptar uma receita', 'Como faço uma versão sem carne?', 'Me indique uma receita fácil'];
  } else if (/seguranca|higien|conserv|geladeira|descongel/.test(pergunta)) {
    sugestoes = ['Como higienizo frutas?', 'Como armazeno sobras?', 'Como sei se a carne está cozida?'];
  } else if (/cortar|corte|faca/.test(pergunta)) {
    sugestoes = ['Como faço julienne?', 'Como corto em cubinhos?', 'Me mostre cortes de vegetais'];
  } else if (/farofa|arroz|assar|frit|cozinh|fogo|temperatura/.test(pergunta)) {
    sugestoes = ['Me indique uma receita rápida', 'Como ajusto o tempero?', 'O que posso servir junto?'];
  } else {
    const inicio = contarInteracoes(historico) % RECOMENDACOES_INICIAIS.length;
    sugestoes = [
      RECOMENDACOES_INICIAIS[inicio],
      RECOMENDACOES_INICIAIS[(inicio + 1) % RECOMENDACOES_INICIAIS.length],
      'Como posso substituir um ingrediente?'
    ];
  }
  return sugestoes;
}
