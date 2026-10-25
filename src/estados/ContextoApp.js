import { createContext, useContext, useState, useEffect } from 'react';
import { CHAVES, salvar, carregar, limparTudo } from '../servicos/armazenamento';
import { NIVEIS } from '../dados/niveis';
import { formatarDataHoje } from '../uteis/formatacao';

const Contexto = createContext();

export function ProvedorApp({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [onboardingConcluido, setOnboardingConcluido] = useState(false);
  const [mentorEscolhido, setMentorEscolhido] = useState(null);
  const [brasas, setBrasas] = useState(0);
  const [exp, setExp] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [historico, setHistorico] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [itensCompra, setItensCompra] = useState([]);
  const [ultimoAcesso, setUltimoAcesso] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const carregarDados = async () => {
      setOnboardingConcluido(await carregar(CHAVES.ONBOARDING_CONCLUIDO) || false);
      setMentorEscolhido(await carregar(CHAVES.MENTOR_ESCOLHIDO) || null);
      setBrasas(await carregar(CHAVES.BRASAS) || 0);
      setExp(await carregar(CHAVES.PROGRESSO)?.exp || 0);
      setHistorico(await carregar(CHAVES.HISTORICO) || []);
      setFavoritos(await carregar(CHAVES.FAVORITOS) || []);
      setItensCompra(await carregar(CHAVES.COMPRAS) || []);
      setUltimoAcesso(await carregar(CHAVES.ULTIMO_ACESSO) || null);
      setCarregando(false);
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (carregando) return;
    salvar(CHAVES.BRASAS, brasas);
    salvar(CHAVES.PROGRESSO, { exp, nivel });
    salvar(CHAVES.HISTORICO, historico);
    salvar(CHAVES.FAVORITOS, favoritos);
    salvar(CHAVES.COMPRAS, itensCompra);
    salvar(CHAVES.ULTIMO_ACESSO, ultimoAcesso);
    salvar(CHAVES.MENTOR_ESCOLHIDO, mentorEscolhido);
    salvar(CHAVES.ONBOARDING_CONCLUIDO, onboardingConcluido);
  }, [brasas, exp, historico, favoritos, itensCompra, ultimoAcesso, mentorEscolhido, onboardingConcluido, carregando]);

  useEffect(() => {
    let novoNivel = 1;
    for (const info of NIVEIS) {
      if (exp >= info.expNecessaria) novoNivel = info.nivel;
    }
    setNivel(novoNivel);
  }, [exp]);

  const registrarAcessoDiario = () => {
    const hoje = formatarDataHoje();
    if (ultimoAcesso === hoje) return;

    const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);
    const dataOntem = formatarDataHoje(ontem);
    const novoStreak = ultimoAcesso === dataOntem ? streak + 1 : 1;

    setStreak(novoStreak);
    setUltimoAcesso(hoje);
    setBrasas(b => b + 10 + Math.min(novoStreak * 2, 20));
    setHistorico(h => [{ data: new Date().toISOString(), quantidade: 10 + Math.min(novoStreak * 2, 20), motivo: "Acesso diário" }, ...h].slice(0, 30));
  };

  const adicionarBrasas = (quantidade, motivo) => {
    setBrasas(b => b + quantidade);
    setHistorico(h => [{ data: new Date().toISOString(), quantidade, motivo }, ...h].slice(0, 30));
  };

  const adicionarExp = (quantidade) => setExp(e => e + quantidade);

  const alternarFavorito = (id) => {
    setFavoritos(lista =>
      lista.includes(id) ? lista.filter(f => f !== id) : [...lista, id]
    );
  };

  const adicionarItemCompra = (nome) => {
    if (!itensCompra.find(i => i.nome === nome)) {
      setItensCompra([...itensCompra, { id: Date.now(), nome, comprado: false }]);
    }
  };

  const alternarItemCompra = (id) => {
    setItensCompra(lista =>
      lista.map(i => i.id === id ? { ...i, comprado: !i.comprado } : i)
    );
  };

  const resetarApp = async () => {
    await limparTudo();
    setOnboardingConcluido(false);
    setMentorEscolhido(null);
    setBrasas(0); setExp(0); setNivel(1);
    setHistorico([]); setFavoritos([]); setItensCompra([]);
    setUltimoAcesso(null); setStreak(0);
  };

  return (
    <Contexto.Provider value={{
      carregando, onboardingConcluido, setOnboardingConcluido,
      mentorEscolhido, setMentorEscolhido,
      brasas, exp, nivel, historico, favoritos, itensCompra, streak,
      registrarAcessoDiario, adicionarBrasas, adicionarExp,
      alternarFavorito, adicionarItemCompra, alternarItemCompra,
      resetarApp
    }}>
      {children}
    </Contexto.Provider>
  );
}

export const useApp = () => useContext(Contexto);
