const WA = "https://wa.me/5521990393848";

export const whatsapp = {
  geral: `${WA}?text=Quero%20agendar%20minha%20primeira%20aula`,
  intermediario: `${WA}?text=Quero%20saber%20sobre%20o%20plano%20Intermedi%C3%A1rio`,
  premium: `${WA}?text=Quero%20saber%20sobre%20o%20plano%20Premium`,
  elite: `${WA}?text=Quero%20saber%20sobre%20o%20plano%20Elite`,
};

export const navLinks = [
  { href: "#metodo", label: "Método" },
  { href: "#resultados", label: "Resultados" },
  { href: "#planos", label: "Planos" },
  { href: "#duvidas", label: "Dúvidas" },
];

export const heroChips = ["Coach EA FC", "Verificado EA", "+3.500 alunos"];

export const proofMarquee = [
  "26,1 mil seguidores",
  "+3.500 alunos",
  "Verificado EA",
  "Alunos no Elite",
  "Top 200",
  "1ª Divisão",
  "Pra cima!",
];

export const stuckPoints = [
  {
    title: "Toma gol nos últimos 10 minutos",
    body: "O jogo está na mão e escapa no fim, sempre do mesmo jeito.",
  },
  {
    title: "Zagueiro \"some\" no contra-ataque",
    body: "Você troca de jogador tarde e a defesa fica aberta atrás.",
  },
  {
    title: "Só tem uma jogada",
    body: "Quando o adversário lê o seu ataque, acabou o repertório.",
  },
  {
    title: "Joga no ritmo do adversário",
    body: "Ele acelera, você acelera. Ele irrita, você perde a cabeça.",
  },
  {
    title: "Monta o time pelo overall",
    body: "Carta bonita no print, mas que não encaixa no seu jeito de jogar.",
  },
  {
    title: "Nunca revê as derrotas",
    body: "Sai da partida, entra na próxima e repete o mesmo erro.",
  },
];

export const weeks = [
  {
    week: "Semana 1",
    title: "Defesa manual",
    body: "Troca de jogador, jockey e bote no tempo certo.",
  },
  {
    week: "Semana 2",
    title: "Construção",
    body: "Passe mirado, corrida curva e tabela com corrida.",
  },
  {
    week: "Semana 3",
    title: "Bola parada e finalização",
    body: "Escanteio, falta e o chute certo para cada situação.",
  },
  {
    week: "Semana 4",
    title: "Simulação de Weekend League",
    body: "Blocos de jogos, pausas e revisão dos gols sofridos.",
  },
];

export const reasons = [
  {
    title: "Análise do SEU gameplay",
    body: "Nada de dica genérica. O Welington assiste às suas partidas e aponta onde você perde jogo.",
  },
  {
    title: "Ajuste de time e tática",
    body: "Formação, instruções e escolhas de jogadores que combinam com o seu estilo.",
  },
  {
    title: "Mentalidade e controle de tilt",
    body: "Como segurar a cabeça depois de um gol sofrido ou de uma sequência ruim.",
  },
  {
    title: "Rotina para a Weekend League",
    body: "Blocos de jogos, pausas e aquecimento para chegar inteiro no fim de semana.",
  },
  {
    title: "Acompanhamento no grupo de alunos",
    body: "Troca diária com quem está subindo junto com você, com o coach por perto.",
  },
  {
    title: "Resultado medido em divisão",
    body: "O objetivo é concreto: subir de divisão e chegar ao Elite.",
  },
];

export type Testimonial = {
  name: string;
  plan: string;
  badge?: string;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Diego L.",
    plan: "Aluno Premium",
    badge: "3 contas no Elite",
    text: "Depois que fiz aula com o Welington mudou muito. Fiquei entre os 2% do Elite. Uso 3 contas e as 3 estão no Elite hoje: fiz 12/3, 11/4 e 12/3.",
  },
  {
    name: "Robson P.",
    plan: "Aluno Elite",
    badge: "Evolução absurda",
    text: "Dinheiro bem gasto. Comecei no plano Intermediário e migrei pro Premium sem piscar os olhos. Na primeira aula já tive uma diferença absurda. Tivemos 5 encontros e meu nível de jogabilidade subiu absurdamente. Entre com a mente aberta e vai ver que você vai se transformar.",
  },
  {
    name: "@naelsongameseinformatica",
    plan: "Aluno",
    badge: "2ª div → Elite",
    text: "Eu nunca tinha passado da segunda divisão, hoje estou na ELITE.",
  },
  {
    name: "Alessandro M.",
    plan: "Aluno",
    badge: "Top 200",
    text: "Com umas aulas do Welington peguei top 200 e hoje tô no competitivo, campeonatos presenciais e tudo mais. Só fazer o que ele diz e ser persistente.",
  },
  {
    name: "Diego L.",
    plan: "Aluno Premium",
    text: "Não imaginei que eu pegaria o estilo de defender. Ninguém consegue marcar — agora eu consigo. Valeu mesmo! E pelo chute infalível.",
  },
  {
    name: "KaiQue M.",
    plan: "Aluno Elite",
    badge: "Rumo ao Elite",
    text: "Com 2 aulas o Elite está tão perto. Pra cimaaa!",
  },
  {
    name: "Roberto D.",
    plan: "Aluno Elite",
    text: "Ontem tive aula com ele. Meus volantes estão no campo todo agora. O homem tem as manhas.",
  },
  {
    name: "Peterson D.",
    plan: "Aluno EAFC",
    badge: "Nova divisão",
    text: "Eu estou ficando aquele adversário chato. O cara quita de raiva.",
  },
  {
    name: "Kassyon",
    plan: "Aluno",
    badge: "1ª Divisão",
    text: "1ª DIVISÃO! Vamos pra cima!",
  },
  {
    name: "@werterbonfim",
    plan: "Aluno",
    text: "Além de ser um monstro no FIFA, ele tem uma didática incrível pra ensinar! Aprendi muita coisa treinando com ele, e tô chegando lá!",
  },
  {
    name: "@roodfareston",
    plan: "Aluno",
    text: "Comprei, estou aprendendo, estou evoluindo. O homem é o cara, super recomendo.",
  },
];

export const prints = [
  { src: "/assets/prints/champions.webp", alt: "Troféu do Champions com 28 de 35 pontos", label: "Champions" },
  { src: "/assets/prints/nova-divisao.webp", alt: "Tela de nova divisão no Rivals", label: "Nova divisão" },
  { src: "/assets/prints/estatisticas.webp", alt: "Estatísticas de partida com vitória", label: "Estatísticas" },
  { src: "/assets/prints/divisao-rivals.webp", alt: "Tela do Division Rivals mostrando a subida", label: "Division Rivals" },
  { src: "/assets/prints/primeira-divisao.webp", alt: "Tela de nova divisão, rumo à 1ª", label: "1ª Divisão" },
  { src: "/assets/prints/time-montado.webp", alt: "Time montado no Ultimate Team", label: "Time ajustado" },
];

export const studentVideos = Array.from({ length: 9 }, (_, index) => {
  const id = String(index + 1).padStart(2, "0");
  return {
    id,
    src: `/assets/alunos/aluno-${id}.mp4`,
    poster: `/assets/alunos/aluno-${id}.webp`,
  };
});

export const notFor = [
  "Quem procura \"jogada secreta\" ou fórmula mágica",
  "Quem não aceita rever as próprias derrotas",
  "Quem culpa só o servidor e o delay",
  "Quem não vai treinar entre as aulas",
];

export const plans = [
  {
    name: "Intermediário",
    pitch: "Para sair do automático e arrumar a base.",
    items: [
      "Aulas individuais com análise do seu gameplay",
      "Defesa manual e construção desde o início",
      "Tarefas de treino para fazer entre as aulas",
      "Acesso ao grupo de alunos",
    ],
    href: whatsapp.intermediario,
    featured: false,
  },
  {
    name: "Premium",
    pitch: "O plano de 4 semanas completo, um fundamento por semana.",
    items: [
      "Mais encontros e acompanhamento mais de perto",
      "Plano de 4 semanas: defesa, construção, bola parada e WL",
      "Ajuste de time e tática para o seu estilo",
      "Revisão das suas derrotas entre as aulas",
    ],
    href: whatsapp.premium,
    featured: true,
  },
  {
    name: "Elite",
    pitch: "Para quem quer brigar pelo topo com rotina de competidor.",
    items: [
      "O nível máximo de acompanhamento",
      "Rotina de Weekend League com revisão de gols sofridos",
      "Mentalidade e controle de tilt sob pressão",
      "Prioridade no suporte do grupo de alunos",
    ],
    href: whatsapp.elite,
    featured: false,
  },
];

export const faqs = [
  {
    q: "Como funcionam as aulas?",
    a: "Call individual. O Welington analisa seu gameplay, mostra onde você está perdendo jogo e passa ajustes de defesa, ataque, time e tática para a semana seguinte.",
  },
  {
    q: "Serve para quem está na 3ª/4ª divisão?",
    a: "Sim. A maioria dos alunos chega travada no meio da tabela. O método começa pela base: defesa manual e leitura de jogo.",
  },
  {
    q: "Já funciona no FC 27?",
    a: "Sim. O FC 27 tirou poder da IA (fim do bote automático, passe que segue sua mira à risca, escanteio com controle na área). Quem estuda sai na frente, e o treino já é focado nessas mudanças.",
  },
  {
    q: "Preciso de um time caro?",
    a: "Não. No FC 27 o atributo base voltou a pesar mais que o PlayStyle. O foco é montar o time que joga do seu jeito, não o mais bonito no print.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Muitos alunos relatam diferença já na primeira aula. A evolução consistente vem com o plano de 4 semanas: uma semana por fundamento.",
  },
  {
    q: "Jogo no Xbox ou PC. Serve?",
    a: "Sim. A análise é de gameplay e decisão, e os comandos são passados para PlayStation e Xbox.",
  },
  {
    q: "Qual a diferença entre Intermediário, Premium e Elite?",
    a: "Muda a quantidade de aulas e o nível de acompanhamento. Chame no WhatsApp que o Welington indica o melhor plano para o seu momento.",
  },
  {
    q: "Como faço para começar?",
    a: "Clique em \"Agendar aula\", chame no WhatsApp e marque sua primeira análise.",
    cta: true,
  },
];
