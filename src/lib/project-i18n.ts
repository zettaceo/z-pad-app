type ProjectContent = {
  description: string;
  aiSummary: string;
  aiStrengths: string[];
  aiFlags: string[];
};

const PROJECT_TRANSLATIONS: Record<string, Record<string, ProjectContent>> = {
  'zetta-chain': {
    pt: {
      description: 'Blockchain de Camada 1 projetada para o ecossistema ZETTA. Finalidade sub-segundo, compatibilidade EVM e trilhos cripto-fiat nativos para adoção em massa.',
      aiSummary: 'ZETTA CHAIN demonstra fundamentos excepcionais em todas as dimensões de análise. Tokenomics sólidos com 70% de liquidez bloqueada, contrato auditado sem problemas críticos e equipe verificada.',
      aiStrengths: ['LP bloqueada por 100 anos', 'Auditado pela Cyberscope — 0 problemas críticos', 'Equipe verificada com 4+ anos de histórico on-chain', 'Proteção anti-bot', 'Tesouraria multi-sig'],
      aiFlags: [],
    },
    zh: {
      description: '专为ZETTA生态系统设计的Layer 1区块链。亚秒级终结性、EVM兼容性以及为大规模采用构建的原生加密法币通道。',
      aiSummary: 'ZETTA CHAIN在所有审查维度上均表现出卓越的基础实力。强劲的代币经济学、70%流动性锁定、零严重问题的审计合约以及经过验证的团队。',
      aiStrengths: ['100年LP锁定', 'Cyberscope审计 — 0个严重问题', '验证团队，4年以上链上历史', '防机器人保护', '多签名国库'],
      aiFlags: [],
    },
    es: {
      description: 'Blockchain de Capa 1 diseñada para el ecosistema ZETTA. Finalidad subsegundo, compatibilidad EVM y rieles cripto-fiat nativos para adopción masiva.',
      aiSummary: 'ZETTA CHAIN demuestra fundamentos excepcionales en todas las dimensiones de verificación. Tokenómica sólida con 70% de liquidez bloqueada, contrato auditado sin problemas críticos y equipo verificado.',
      aiStrengths: ['LP bloqueada 100 años', 'Auditado por Cyberscope — 0 problemas críticos', 'Equipo verificado con 4+ años de historial on-chain', 'Protección anti-bot', 'Tesorería multi-sig'],
      aiFlags: [],
    },
  },
  'ai-oracle': {
    pt: {
      description: 'Rede oracle de IA descentralizada para contratos inteligentes. Modelos GPT em tempo real na blockchain.',
      aiSummary: 'Projeto de infraestrutura de IA de nível superior. Auditoria Trail of Bits, equipe da Anthropic e OpenAI. A bonding curve garante um lançamento justo.',
      aiStrengths: ['Auditoria Trail of Bits (elite)', 'Equipe da Anthropic & OpenAI', 'Bonding curve (anti-bot)', '85% de liquidez', 'Zero pré-mineração'],
      aiFlags: [],
    },
    zh: {
      description: '面向智能合约的去中心化AI预言机网络。实时GPT级模型上链。',
      aiSummary: '顶级AI基础设施项目。Trail of Bits审计，团队来自Anthropic和OpenAI。联合曲线确保公平启动。',
      aiStrengths: ['Trail of Bits审计（精英级）', 'Anthropic & OpenAI团队成员', '联合曲线（防机器人）', '85%流动性', '零预挖'],
      aiFlags: [],
    },
    es: {
      description: 'Red oracle de IA descentralizada para contratos inteligentes. Modelos GPT en tiempo real en la cadena.',
      aiSummary: 'Proyecto de infraestructura de IA de primer nivel. Auditoría Trail of Bits, equipo de Anthropic y OpenAI. La curva de vinculación garantiza un lanzamiento justo.',
      aiStrengths: ['Auditoría Trail of Bits (élite)', 'Equipo de Anthropic & OpenAI', 'Curva de vinculación (anti-bot)', '85% de liquidez', 'Cero pre-minería'],
      aiFlags: [],
    },
  },
  'pixelverse': {
    pt: {
      description: 'MMORPG de mundo aberto Web3 com economia dos jogadores. Construído em uma L2 personalizada para jogos.',
      aiSummary: 'Projeto de jogos premium usando Liquidity Bootstrapping Pool para descoberta de preço justo. Comunidade forte (150k+).',
      aiStrengths: ['LBP (anti-baleia)', 'Equipe da Blizzard/Riot', 'Auditoria Cyberscope', '150k+ Discord'],
      aiFlags: [],
    },
    zh: {
      description: '拥有玩家经济的开放世界Web3 MMORPG。建立在定制游戏L2之上。',
      aiSummary: '高端游戏项目，使用流动性引导池实现公平价格发现。强大社区（150k+）。',
      aiStrengths: ['LBP（防巨鲸）', '来自暴雪/拳头的团队', 'Cyberscope审计', '150k+ Discord'],
      aiFlags: [],
    },
    es: {
      description: 'MMORPG de mundo abierto Web3 con economía de jugadores. Construido en una L2 de juegos personalizada.',
      aiSummary: 'Proyecto de gaming premium usando Liquidity Bootstrapping Pool para descubrimiento de precio justo. Fuerte comunidad (150k+).',
      aiStrengths: ['LBP (anti-ballena)', 'Equipo de Blizzard/Riot', 'Auditoría Cyberscope', '150k+ Discord'],
      aiFlags: [],
    },
  },
  'metavault': {
    pt: {
      description: 'Agregador de rendimento multi-chain com seleção de estratégia por IA e rebalanceamento automático.',
      aiSummary: 'Sólido protocolo de rendimento multi-chain com auditoria credível. Equipe com histórico moderado on-chain.',
      aiStrengths: ['Auditoria CertiK', 'Tokenomics claros', 'Demo do produto funcionando'],
      aiFlags: ['Alguns membros da equipe são anônimos'],
    },
    zh: {
      description: '多链收益聚合器，具有AI驱动的策略选择和自动再平衡。',
      aiSummary: '强大的多链收益协议，审计可信。团队链上历史中等。',
      aiStrengths: ['CertiK审计', '清晰的代币经济学', '可运行的产品演示'],
      aiFlags: ['部分团队成员匿名'],
    },
    es: {
      description: 'Agregador de rendimiento multi-cadena con selección de estrategia por IA y rebalanceo automático.',
      aiSummary: 'Sólido protocolo de rendimiento multi-cadena con auditoría creíble. El equipo tiene historial moderado on-chain.',
      aiStrengths: ['Auditoría CertiK', 'Tokenómica clara', 'Demo del producto funcional'],
      aiFlags: ['Algunos miembros del equipo son anónimos'],
    },
  },
  'nexgen-ai': {
    pt: {
      description: 'Análises on-chain com IA, sinais de trading e agentes autônomos.',
      aiSummary: 'Projeto de IA excepcional com auditoria PeckShield e equipe verificada do Google AI e OpenAI.',
      aiStrengths: ['Equipe do Google AI & OpenAI', 'Auditoria PeckShield', 'Reembolsável (DYCO)', '75% de liquidez'],
      aiFlags: ['Comunidade ainda modesta (<10k)'],
    },
    zh: {
      description: 'AI驱动的链上分析、交易信号和自主智能体。',
      aiSummary: '出色的AI项目，拥有PeckShield审计和来自Google AI及OpenAI的验证团队。',
      aiStrengths: ['Google AI & OpenAI团队成员', 'PeckShield审计', '可退款（DYCO）', '75%流动性'],
      aiFlags: ['社区规模仍较小（<10k）'],
    },
    es: {
      description: 'Análisis on-chain con IA, señales de trading y agentes autónomos.',
      aiSummary: 'Excepcional proyecto de IA con auditoría PeckShield y equipo verificado de Google AI y OpenAI.',
      aiStrengths: ['Equipo de Google AI & OpenAI', 'Auditoría PeckShield', 'Reembolsable (DYCO)', '75% de liquidez'],
      aiFlags: ['Comunidad aún modesta (<10k)'],
    },
  },
  'zettabridge': {
    pt: {
      description: 'Bridge cross-chain com transferências sub-minuto em 20+ redes. Nativo do ecossistema ZETTA.',
      aiSummary: 'Projeto premium lançando na ZETTA Chain com 80% de liquidez líder do setor.',
      aiStrengths: ['80% de liquidez (nível superior)', 'Integração ao ecossistema ZETTA', 'Reembolsável (DYCO)'],
      aiFlags: [],
    },
    zh: {
      description: '跨链桥，支持20+条链的分钟内转账。ZETTA生态系统原生项目。',
      aiSummary: '在ZETTA Chain上推出的高端项目，业界领先的80%流动性。',
      aiStrengths: ['80%流动性（顶级）', 'ZETTA生态系统集成', '可退款（DYCO）'],
      aiFlags: [],
    },
    es: {
      description: 'Bridge cross-chain con transferencias sub-minuto en 20+ redes. Nativo del ecosistema ZETTA.',
      aiSummary: 'Proyecto premium lanzándose en ZETTA Chain con el 80% de liquidez líder en la industria.',
      aiStrengths: ['80% de liquidez (nivel superior)', 'Integración al ecosistema ZETTA', 'Reembolsable (DYCO)'],
      aiFlags: [],
    },
  },
  'quantumdex': {
    pt: {
      description: 'Exchange descentralizada de próxima geração com proteção MEV e swaps sem slippage.',
      aiSummary: 'Base técnica sólida com auditoria Hacken. KYC da equipe não concluído — fator de risco significativo.',
      aiStrengths: ['Auditado pela Hacken', 'Plano de go-to-market claro'],
      aiFlags: ['KYC não concluído', 'Identidade da equipe parcialmente não verificada'],
    },
    zh: {
      description: '下一代去中心化交易所，具有MEV保护和零滑点交换。',
      aiSummary: '扎实的技术基础，Hacken审计。团队KYC未完成——重大风险因素。',
      aiStrengths: ['由Hacken审计', '清晰的市场推广计划'],
      aiFlags: ['KYC未完成', '团队身份部分未验证'],
    },
    es: {
      description: 'Exchange descentralizado de próxima generación con protección MEV y swaps sin deslizamiento.',
      aiSummary: 'Base técnica sólida con auditoría Hacken. KYC del equipo no completado — factor de riesgo significativo.',
      aiStrengths: ['Auditado por Hacken', 'Plan de go-to-market claro'],
      aiFlags: ['KYC no completado', 'Identidad del equipo parcialmente no verificada'],
    },
  },
  'solana-pay': {
    pt: {
      description: 'Infraestrutura de pagamento empresarial na Solana. Transações abaixo de um centavo para comerciantes.',
      aiSummary: 'Sólido protocolo de pagamento na Solana com auditoria Halborn.',
      aiStrengths: ['Auditoria Halborn', 'KYC verificado', 'Demos funcionando para comerciantes'],
      aiFlags: ['Mercado competitivo'],
    },
    zh: {
      description: 'Solana上的企业级支付基础设施。为商家提供亚美分交易。',
      aiSummary: 'Solana上稳固的支付协议，经Halborn审计。',
      aiStrengths: ['Halborn审计', 'KYC已验证', '商家演示运行中'],
      aiFlags: ['竞争激烈的市场'],
    },
    es: {
      description: 'Infraestructura de pago empresarial en Solana. Transacciones por debajo de un centavo para comerciantes.',
      aiSummary: 'Sólido protocolo de pago en Solana con auditoría Halborn.',
      aiStrengths: ['Auditoría Halborn', 'KYC verificado', 'Demos funcionales para comerciantes'],
      aiFlags: ['Mercado competitivo'],
    },
  },
  'base-lend': {
    pt: {
      description: 'Protocolo de empréstimo nativo da Base com rendimentos institucionais e mercados sem permissão.',
      aiSummary: 'Protocolo de empréstimo bem estruturado na Base com auditoria OpenZeppelin.',
      aiStrengths: ['Auditoria OpenZeppelin', 'Equipe verificada', 'Diferenciação clara na Base'],
      aiFlags: ['Cenário competitivo maduro'],
    },
    zh: {
      description: 'Base原生借贷协议，提供机构级收益和无许可市场。',
      aiSummary: 'Base上结构良好的借贷协议，经OpenZeppelin审计。',
      aiStrengths: ['OpenZeppelin审计', '已验证团队', '在Base上的清晰差异化'],
      aiFlags: ['成熟的竞争格局'],
    },
    es: {
      description: 'Protocolo de préstamos nativo de Base con rendimientos institucionales y mercados sin permisos.',
      aiSummary: 'Protocolo de préstamos bien estructurado en Base con auditoría OpenZeppelin.',
      aiStrengths: ['Auditoría OpenZeppelin', 'Equipo verificado', 'Clara diferenciación en Base'],
      aiFlags: ['Panorama competitivo maduro'],
    },
  },
  'cryptoshield': {
    pt: {
      description: 'Protocolo de seguro on-chain para posições DeFi.',
      aiSummary: 'Venda concluída com sucesso. Hard cap atingido.',
      aiStrengths: ['Hard cap atingido', 'Auditoria CertiK', '70% de liquidez bloqueada'],
      aiFlags: [],
    },
    zh: {
      description: 'DeFi仓位的链上保险协议。',
      aiSummary: '销售成功完成。硬顶已达到。',
      aiStrengths: ['硬顶已达到', 'CertiK审计', '70%流动性锁定'],
      aiFlags: [],
    },
    es: {
      description: 'Protocolo de seguros on-chain para posiciones DeFi.',
      aiSummary: 'Venta completada con éxito. Hard cap alcanzado.',
      aiStrengths: ['Hard cap alcanzado', 'Auditoría CertiK', '70% de liquidez bloqueada'],
      aiFlags: [],
    },
  },
};

export function getProjectContent(projectId: string, locale: string): ProjectContent | null {
  if (locale === 'en') return null;
  return PROJECT_TRANSLATIONS[projectId]?.[locale] ?? null;
}
