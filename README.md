# 🔥 Farofa Digital

Aplicativo educativo e interativo sobre a culinária e a cultura gastronômica do Brasil.
Receitas e conteúdos do catálogo funcionam offline e ficam no próprio aparelho.

**Versão 3.11.3** · Expo SDK 58 · React Native 0.88

## O que já funciona

- **Mentores**: escolha entre Chef Ana e Chef José ao começar (o primeiro mentor é grátis, com bônus de boas-vindas em Brasas)
- **Brasas e níveis**: 10 níveis, de Aprendiz de Cozinha a Mestre Cuca, com barra de EXP
- **Acesso diário**: botão de check-in na tela inicial do Mentor, com bônus de Brasas por dia e por sequência
- **Sala do Saber (Quiz)**: perguntas variadas sobre pratos, técnicas, higiene e segurança, ciência dos alimentos, panificação, confeitaria, nutrição e cozinhas do mundo, com explicações e progresso sem repetição até concluir o banco
- **Interações**: animação de toque em botões e vibração de seleção nos apps móveis
- **Acessibilidade**: textos e campos ajustam a tipografia conforme a largura da tela e respeitam o tamanho de fonte configurado no aparelho
- **Minicozinha**: prepare receitas passo a passo, separe os ingredientes, ajuste o fogo ou forno, pratique movimentos de cozinha e avance no seu ritmo, sem cronômetro
- **Início / Mentor**: chefs com estilos próprios, check-in diário, dica rotativa, receita sugerida do dia, orientações ampliadas de corte, organização, higiene, conservação e aproveitamento, além de atalhos e conversa offline; no Android/iOS, também oferece modelo local
- **Cozinha do mundo**: receitas brasileiras e internacionais pesquisáveis por prato, país ou ingrediente, filtros por origem, favoritos, lista de compras e guia de cortes bovinos, suínos, aves, frutas e vegetais
- **Perfil**: carreira integrada ao perfil com todos os níveis, resumo de Brasas e sequência, histórico de ganhos e botão de resetar os dados

## Em desenvolvimento

- Mais receitas e ingredientes regionais

### Sala do Mentor (offline)

O guia offline funciona também na web e responde com dados locais de receitas, cortes, técnicas básicas e segurança alimentar. As sugestões acompanham o assunto da conversa, e Chef Ana e Chef José têm estilos de comunicação próprios. Ele não depende de conexão, mas tem respostas limitadas ao catálogo e às orientações incluídas no app.

No Android/iOS, é possível baixar o modelo Qwen 1.5B Q4_K_M (aproximadamente **1,12 GB**) para conversas mais abertas. O download inicial requer internet; depois, a inferência e as mensagens ficam no aparelho, sem envio a um serviço remoto. Como usa código nativo, requer um **development build** e não funciona no Expo Go. A aceleração por GPU é usada quando disponível; o desempenho depende do aparelho.

### Testes automatizados

Execute `npm test` na pasta do projeto. As suítes validam os dados e as regras do Quiz e da Minicozinha, incluindo etapas, ingredientes, calor, movimentos e recompensas.

### Aplicativo desktop para Windows

Na raiz do projeto, execute `npm --prefix desktop run build`. O processo exporta a versão web atual, substitui os arquivos gerados anteriormente e cria o instalador em `desktop/dist`.

## Estrutura do projeto

```text
farofa-digital/
├── app.json, package.json, babel.config.js, index.js, jest.config.js
├── assets/          tema.json e imagens (ícones, abertura)
├── android/         projeto nativo Android gerado/configurado pelo Expo
├── desktop/         versão de PC (Electron: main.js e prepare-web.js)
└── src/
    ├── App.js
    ├── componentes/ comuns, layout, progresso
    ├── dados/       conteúdo, regras do Quiz e da Minicozinha, testes
    ├── estados/     ContextoApp (Brasas, EXP, favoritos, compras)
    ├── navegacao/   Rotas
    ├── servicos/    armazenamento no aparelho
    ├── telas/       onboarding, aprendizado, mentor, perfil e receitas (inclui lista de compras)
    └── uteis/       constantes e formatação
```

## Economia do projeto e evolução da experiência

A prioridade é preservar a experiência atual do Farofa Digital: um jogo educativo, acolhedor e acessível, com conteúdo culinário, mentores, progressão e recursos que funcionam offline. A evolução deve aprofundar a imersão sem trocar essa base por uma solução que dependa de servidor ou conexão constante.

### Economia dentro do jogo

Brasas e EXP são recompensas virtuais de progressão; não representam dinheiro e não exigem compra para usar os recursos atuais.

| Ação atual | Recompensa |
| --- | --- |
| Escolher o primeiro mentor | 80 Brasas de boas-vindas |
| Bater ponto diário | 10 Brasas, mais bônus pela sequência de dias |
| Responder corretamente no Quiz | Brasas e EXP variam conforme a dificuldade; acertos em sequência aumentam a recompensa |
| Concluir uma receita na Minicozinha | 10 Brasas e 25 EXP |

O Perfil reúne saldo, nível, sequência e histórico de ganhos. Essa economia recompensa a participação e o aprendizado; futuras recompensas devem continuar claras, equilibradas e conquistáveis jogando, sem tornar pagamentos necessários para progredir.

### Custos e funcionamento atual

| Item | Como funciona no projeto |
| --- | --- |
| Aplicativo | Expo e React Native, com a mesma base para Android, iOS e web |
| Dados e progresso | Salvos localmente no aparelho; não há backend ou banco remoto exigido pelos recursos atuais |
| Mentor offline | Usa receitas e orientações incluídas no app; não exige tráfego de rede para responder |
| IA local opcional | No Android/iOS, o modelo pode ser baixado uma vez; requer internet no download e cerca de **1,12 GB** de armazenamento |
| Versão para PC | Empacotada com Electron |
| Equipamentos e HD externo | Computador/celular já disponíveis e HD de aproximadamente **R$ 150**, conforme informado pelo criador; não são custos auditados |
| Desenvolvimento e manutenção | Valores de mercado não foram medidos para este projeto; dependem do escopo, da distribuição e de eventual contratação |

O uso de ferramentas e bibliotecas não significa custo total zero: podem existir custos de equipamentos, distribuição, serviços opcionais e manutenção. O benefício confirmado pela arquitetura atual é evitar a necessidade de manter um servidor para as funções locais já implementadas. Não há percentuais medidos de economia de tempo ou código.

### Como melhorar a imersão mantendo a base atual

- **Manter o formato atual como padrão:** jogo educativo sem cobrança obrigatória, com conteúdo acessível e recursos principais funcionando offline.
- **Dar mais contexto às recompensas:** mostrar claramente o que cada atividade rende e como a sequência diária ajuda na progressão.
- **Aprofundar a jornada dos mentores:** ampliar falas, dicas e reconhecimento do progresso sem perder a personalidade da Chef Ana e do Chef José.
- **Conectar as atividades:** aproximar receitas, Quiz e Minicozinha com desafios e sugestões coerentes com o que a pessoa acabou de aprender.
- **Valorizar conquistas sem pressão:** celebrar níveis e marcos com feedback visual e mensagens, sem punição por pausas ou perda de progresso.
- **Crescer com o conteúdo local:** adicionar receitas regionais, desafios e explicações em `src/dados/`, mantendo a navegação existente e o uso offline sempre que possível.

Esses pontos são diretrizes para melhorias futuras; não indicam que funcionalidades ainda não implementadas já estejam disponíveis. A expansão deve ser gradual, testada com usuários e preservar acessibilidade, desempenho e segurança alimentar.

## Versões

O número segue o formato **maior.menor.correção**:

- correção de erro ou ajuste visual: sobe o último número (3.11.2 → 3.11.3)
- tela ou recurso novo: sobe o do meio (3.11.3 → 3.12.0)
- mudança grande: sobe o primeiro (3.12.0 → 4.0.0)

A versão precisa ser a mesma no `package.json`, no `app.json`, em `desktop/package.json` e neste arquivo.

## Tecnologias

React Native · Expo · React Navigation 7 · AsyncStorage · Expo Haptics · Electron (versão de PC)
