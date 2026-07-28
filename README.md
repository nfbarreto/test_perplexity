# Custóias Weather Extension

Repositório de testes de interação com Perplexity AI via GitHub MCP.

---

## 🌤️ Custóias Weather Extension

**Criado em:** 2026-07-28  
**Tecnologia:** Chrome Extension (Manifest V3) + Open-Meteo API (gratuita, sem API key)

### O que faz
Extensão para Google Chrome que mostra a previsão do tempo para **Custóias, Porto, Portugal** num painel popup, incluindo:
- Tempo **agora**
- Previsão de **manhã** e **tarde de hoje**
- Previsão de **manhã** e **tarde de amanhã**
- **Direção e força do vento** em cada período

### Estrutura
```
custóias-weather/
├── manifest.json       # Configuração da extensão (Manifest V3)
├── popup.html          # Interface do popup
├── popup.js            # Lógica: fetch Open-Meteo API + render
├── styles.css          # Estilos do painel
└── icons/
    └── icon.svg        # Ícone da extensão
```

### Como instalar
1. Abre o Chrome e vai a `chrome://extensions/`
2. Ativa o **Modo de programador** (canto superior direito)
3. Clica em **"Carregar sem compactação"**
4. Seleciona a pasta `custóias-weather/`
5. Clica no ícone da extensão na barra do Chrome

### API utilizada
- [Open-Meteo](https://open-meteo.com/) — gratuita, sem registo, sem API key
- Coordenadas: Custóias, Porto → `lat=41.1945, lon=-8.6499`
- Dados: temperatura, código meteorológico (WMO), velocidade e direção do vento
