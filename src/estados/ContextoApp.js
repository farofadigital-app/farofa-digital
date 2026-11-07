import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CHAVES, salvar, carregar, limparTudo } from '../servicos/armazenamento';
import { salvarPerfil, carregarPerfil } from '../servicos/perfilService';
import { NIVEIS } from '../dados/niveis';
import { formatarDataHoje } from '../uteis/formatacao';
import { BRASAS_DIARIAS, BRASAS_BOAS_VINDAS } from '../uteis/constantes';

const Contexto = createContext();
const LIMITE_HISTORICO = 30;

const novoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const registro = (quantidade, motivo) => ({
  data: new Date().toISOString(),
  quantidade,
  motivo
});

export function ProvedorApp({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [onboardingConcluido, setOnboardingConcluido] = useState(false);
  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const onboardingConcluidoRef = useRef(false);
  const [mentorEscolhido, setMentorEscolhido] = useState(null);
  const [brasas, setBrasas] = useState(0);
  const [exp, setExp] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [historico, setHistorico] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [itensCompra, setItensCompra] = useState([]);
  const [ultimoAcesso, setUltimoAcesso] = useState(null);
  const ultimoAcessoRef = useRef(null);
  const [streak, setStreak] = useState(0);
  const [dadosPerfil, setDadosPerfil] = useState({ nome: '', avatarUri: null });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const onboardingSalvo = (await carregar(CHAVES.ONBOARDING_CONCLUIDO)) || false;
        onboardingConcluidoRef.current = onboardingSalvo;
        setOnboardingConcluido(onboardingSalvo);
        setMentorEscolhido((await carregar(CHAVES.MENTOR_ESCOLHIDO)) || null);
        setBrasas((await carregar(CHAVES.BRASAS)) || 0);
        const progresso = await carregar(CHAVES.PROGRESSO);
        setExp(progresso?.exp || 0);
        setStreak(progresso?.streak || 0);
        setHistorico((await carregar(CHAVES.HISTORICO)) || []);
        setFavoritos((await carregar(CHAVES.FAVORITOS)) || []);
        setItensCompra((await carregar(CHAVES.COMPRAS)) || []);
        const acessoSalvo = (await carregar(CHAVES.ULTIMO_ACESSO)) || null;
        ultimoAcessoRef.current = acessoSalvo;
        setUltimoAcesso(acessoSalvo);

        const perfil = await carregarPerfil();
        setPerfilCompleto(perfil.perfilCompleto);
        setDadosPerfil({ nome: perfil.nome, avatarUri: perfil.avatarUri });
      } catch (erro) {
        console.warn('Erro ao carregar os dados salvos:', erro);
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (carregando) return;
    salvar(CHAVES.BRASAS, brasas);
    salvar(CHAVES.PROGRESSO, { exp, nivel, streak });
    salvar(CHAVES.HISTORICO, historico);
    salvar(CHAVES.FAVORITOS, favoritos);
    salvar(CHAVES.COMPRAS, itensCompra);
    salvar(CHAVES.ULTIMO_ACESSO, ultimoAcesso);
    salvar(CHAVES.MENTOR_ESCOLHIDO, mentorEscolhido);
    salvar(CHAVES.ONBOARDING_CONCLUIDO, onboardingConcluido);
  }, [
    brasas, exp, nivel, streak, historico, favoritos, itensCompra,
    ultimoAcesso, mentorEscolhido, onboardingConcluido, carregando
  ]);

  useEffect(() => {
    let novoNivel = 1;
    for (const info of NIVEIS) {
      if (exp >= info.expNecessaria) novoNivel = info.nivel;
    }
    setNivel(novoNivel);
  }, [exp]);

  const adicionarRegistro = (quantidade, motivo) => {
    setHistorico(h => [registro(quantidade, motivo), ...h].slice(0, LIMITE_HISTORICO));
  };

  const registrarAcessoDiario = () => {
    if (carregando) return false;
    const hoje = formatarDataHoje();
    if (ultimoAcessoRef.current === hoje || ultimoAcesso === hoje) return false;

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const novoStreak = ultimoAcesso === formatarDataHoje(ontem) ? streak + 1 : 1;
    const bonus = BRASAS_DIARIAS + Math.min(novoStreak * 2, 20);

    ultimoAcessoRef.current = hoje;
    setStreak(novoStreak);
    setUltimoAcesso(hoje);
    setBrasas(b => b + bonus);
    adicionarRegistro(bonus, 'Acesso diario');
    return true;
  };

  const escolherMentor = id => {
    if (carregando || onboardingConcluidoRef.current || !['ana', 'jose'].includes(id)) {
      return false;
    }
    onboardingConcluidoRef.current = true;
    setMentorEscolhido(id);
    setBrasas(b => b + BRASAS_BOAS_VINDAS);
    adicionarRegistro(BRASAS_BOAS_VINDAS, 'Bonus de boas-vindas');
    setOnboardingConcluido(true);
    return true;
  };

  const salvarPerfilCompleto = async (nome, avatarUri) => {
    const res = await salvarPerfil(nome, avatarUri);
    if (res.sucesso) {
      setPerfilCompleto(true);
      setDadosPerfil({ nome, avatarUri });
    }
    return res;
  };

  const adicionarBrasas = (quantidade, motivo) => {
    setBrasas(b => b + quantidade);
    adicionarRegistro(quantidade, motivo);
  };

  const adicionarExp = (quantidade) => setExp(e => e + quantidade);

  const alternarFavorito = (id) => {
    setFavoritos(lista =>
      lista.includes(id) ? lista.filter(f => f !== id) : [...lista, id]
    );
  };

  const adicionarItensCompra = (nomes) => {
    setItensCompra(lista => {
      const existentes = new Set(lista.map(i => i.nome.toLowerCase()));
      const novos = [];
      for (const bruto of nomes) {
        const nome = String(bruto).trim();
        if (!nome || existentes.has(nome.toLowerCase())) continue;
        existentes.add(nome.toLowerCase());
        novos.push({ id: novoId(), nome, comprado: false });
      }
      return novos.length ? [...lista, ...novos] : lista;
    });
  };

  const adicionarItemCompra = (nome) => adicionarItensCompra([nome]);

  const alternarItemCompra = (id) => {
    setItensCompra(lista =>
      lista.map(i => (i.id === id ? { ...i, comprado: !i.comprado } : i))
    );
  };

  const removerItemCompra = (id) => {
    setItensCompra(lista => lista.filter(i => i.id !== id));
  };

  const limparComprados = () => {
    setItensCompra(lista => lista.filter(i => !i.comprado));
  };

  const resetarApp = async () => {
    await limparTudo();
    onboardingConcluidoRef.current = false;
    setOnboardingConcluido(false);
    setPerfilCompleto(false);
    setDadosPerfil({ nome: '', avatarUri: null });
    setMentorEscolhido(null);
    setBrasas(0);
    setExp(0);
    setNivel(1);
    setHistorico([]);
    setFavoritos([]);
    setItensCompra([]);
    ultimoAcessoRef.current = null;
    setUltimoAcesso(null);
    setStreak(0);
  };

  return (
    <Contexto.Provider value={{
      carregando, onboardingConcluido, perfilCompleto,
      dadosPerfil,
      setOnboardingConcluido,
      mentorEscolhido, setMentorEscolhido, escolherMentor,
      salvarPerfilCompleto,
      brasas, exp, nivel, historico, favoritos, itensCompra, streak, ultimoAcesso,
      registrarAcessoDiario, adicionarBrasas, adicionarExp,
      alternarFavorito,
      adicionarItemCompra, adicionarItensCompra, alternarItemCompra,
      removerItemCompra, limparComprados,
      resetarApp
    }}>
      {children}
    </Contexto.Provider>
  );
}

export const useApp = () => useContext(Contexto);
