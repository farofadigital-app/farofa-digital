# 🎮 Farofa Digital

> Aplicativo móvel educativo e interativo sobre a culinária e a rica cultura brasileira, desenvolvido com **React Native + Expo**. Funciona totalmente **offline** e conta com **sincronização online** opcional para renovação contínua de conteúdo.

---

## 🌟 Sobre o Aplicativo

O **Farofa Digital** transforma o aprendizado culinário em uma jornada dinâmica de gamificação. Ao lado dos mentores gastronômicos — **Chef Ana** (didática e técnica) e **Chef José** (enérgico e tradicional) —, o usuário acumula **Brasas** e **Pontos de Experiência (EXP)**, sobe de nível na carreira culinária e desbloqueia novos desafios e receitas.

---

## 🧩 Principais Módulos e Recursos

### 🎓 Academia Culinária (Hub Integrado)
Central de aprendizado que unifica os 3 pilares práticos e teóricos em abas de fácil acesso:

1. **🧠 Quiz do Saber**:
   - Banco com dezenas de perguntas desafiadoras por mentor, divididas em 4 alternativas com explicações didáticas.
   - **Modo Offline & Fallback Imediato**: jogue mesmo sem sinal de internet.
   - **Sincronização Online Automática**: suporte a download silencioso de novos bancos de perguntas via GitHub Pages.

2. **🍳 Minicozinha Interativa**:
   - Simulação prática de preparo de receitas brasileiras (Farofa Tradicional, Brigadeiro Gourmet, Moqueca Baiana, etc.).
   - **Gestos Reais de Cozinha**: deslize para cortar, mexa a panela em círculos e arraste ingredientes para o cozimento.
   - **Ponto de Fogo Dinâmico**: termômetro oscilante com janela de acerto e opção de nova tentativa sem travar a partida.
   - **Bancada e Insumos**: seleção de ingredientes por categoria, com detecção e penalidade para itens intrusos.
   - **Reações dos Chefs**: balão animado de diálogo com feedbacks vocais e táteis em tempo real.

3. **🔪 Guia Técnico de Cortes & Facas**:
   - Catálogo completo de 15 cortes clássicos organizados por categorias: **Bovinos**, **Suínos**, **Aves** e **Frutas & Vegetais**.
   - Indicação da lâmina ideal para cada preparo (Faca do Chef, Faca de Desossa, Cutelo, Faca de Ofício).
   - Recomendações técnicas de segurança e uso de tábuas de corte.

---

### 🍲 Cozinha do Mundo & Livro de Receitas
- **Receitas Regionais**: passo a passo detalhado com tempo de preparo, rendimento, nível de dificuldade e história do prato.
- **Lista de Compras Inteligente**: marque os ingredientes que você precisa comprar na feira ou supermercado.
- **Catálogo de Insumos Nacionais**: fichas informativas sobre farinhas, pimentas, ervas e castanhas típicas do Brasil.

---

### 👤 Perfil, Conquistas e Mentoria
- **Personalização**: escolha seu nome e avatar culinário.
- **Estatísticas de Carreira**: acompanhe seu nível, sequência de dias (streak), brasas acumuladas e histórico completo de partidas.
- **Mentoria com IA**: integração de suporte ao usuário com respostas gastronômicas rápidas e confiáveis.

---

## 📱 Layout Responsivo e Acessibilidade

- **Tema Escuro Oficial**: paleta contrastante com fundo azul-marinho profundo (`#0B1326`), âmbar dourado (`#FFB703`) e superfícies suaves.
- **Proteção contra Cortes de Texto**: dimensionamento com `maxFontSizeMultiplier` para evitar textos cortados em telas estreitas (320dp) ou com fontes ampliadas no Android.
- **Feedback Háptico**: vibrações suaves ao tocar em botões, acertar etapas e concluir desafios.

---

## 🚀 Integração Contínua e Build Automático (CI/CD)

O projeto possui fluxo automatizado com **GitHub Actions** (`.github/workflows/build-apk.yml`):

1. **Testes Automatizados (Jest)**: suíte completa com **92 testes** cobrindo integridade de dados, regras de negócio, gestos da minicozinha e renderização responsiva.
2. **Versionamento Duplo Automático**:
   - **`versionCode` (Interno)**: calculado como `1000 + run_number` para garantir que todo novo APK gerado substitua a versão anterior no aparelho sem necessidade de desinstalar.
   - **`version` (Visível)**: avança automaticamente a cada build no formato SemVer Patch (`3.14.<run_number>`).
3. **Geração do APK Release**: compilação nativa em container Ubuntu com Android SDK e Java 17, gerando o artefato standalone pronto para download.

---

## 📥 Como Baixar e Instalar o APK

1. Acesse a aba **[Actions do Repositório](https://github.com/farofadigital-app/farofa-digital/actions)**.
2. Clique no build mais recente que tiver o selo verde de concluído (**Gerar APK Android**).
3. Na seção **Artifacts** no final da página, baixe o arquivo **`FarofaDigital-APK-Jogo`**.
4. Descompacte o arquivo `.zip` e transfira o `.apk` para seu celular Android.
5. Abra o arquivo no aparelho e confirme a instalação (permitindo a instalação de fontes desconhecidas se solicitado).

---

<div align="center">
  <strong>Farofa Digital</strong> — Tradição, sabor e aprendizado na palma da mão! 🇧🇷🍲✨
</div>