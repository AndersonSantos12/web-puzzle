# Gerador de Caça-Palavras 🧩

Uma aplicação web moderna e responsiva para criar caça-palavras personalizados com múltiplas opções de orientação, exportação e impressão.

## 📁 Estrutura do Projeto

```
Site-Gerador-Cruzadinha/
├── index.html                 # Arquivo principal HTML
├── css/
│   └── style.css             # Estilos completos com responsividade
├── js/
│   ├── main.js               # Ponto de entrada da aplicação
│   ├── classes/
│   │   ├── Toast.js          # Sistema de notificações
│   │   └── WordSearchGenerator.js  # Lógica de geração do puzzle
│   └── ui/
│       └── WordSearchUI.js    # Gerenciador da interface
└── README.md                 # Esta documentação

```

## 🎯 Arquitetura

O projeto foi refatorado para seguir uma estrutura modular e bem organizada:

### **index.html**
Arquivo HTML principal que contém a estrutura do DOM e referencia todos os recursos necessários (CSS, bibliotecas externas e scripts).

### **css/style.css**
Stylesheet completo com:
- Reset e estilos globais
- Layout responsivo (desktop, tablet, mobile)
- Componentes (botões, cards, inputs, modals)
- Animações e transições
- Suporte para impressão

### **js/classes/Toast.js**
Classe responsável pelo sistema de notificações:
- `Toast.show()` - Exibe notificação genérica
- `Toast.success()` - Notificação de sucesso
- `Toast.error()` - Notificação de erro
- `Toast.warning()` - Notificação de aviso

### **js/classes/WordSearchGenerator.js**
Classe principal para geração de caça-palavras:
- `constructor()` - Inicializa o gerador
- `getDirections()` - Define orientações permitidas
- `initializeGrid()` - Cria grid vazio
- `canPlaceWord()` - Valida colocação de palavra
- `placeWord()` - Insere palavra no grid
- `tryPlaceWord()` - Tenta colocar palavra aleatoriamente
- `tryPlaceWordLarge()` - Busca exaustiva para palavras grandes
- `fillEmptyCells()` - Preenche células vazias com letras aleatórias
- `generate()` - Executa todo o processo

### **js/ui/WordSearchUI.js**
Gerenciador da interface do usuário:
- `initializeElements()` - Armazena referências DOM
- `attachEventListeners()` - Conecta handlers de eventos
- `generatePuzzle()` - Gera novo puzzle
- `renderPuzzle()` - Renderiza o grid
- `renderWordList()` - Renderiza lista de palavras
- `toggleAnswer()` - Alterna visibilidade do gabarito
- `exportAsImage()` - Exporta como PNG
- `openTitleModal()` - Abre modal de título
- `confirmPrint()` - Prepara para impressão

### **js/main.js**
Arquivo de inicialização que cria a instância de `WordSearchUI` quando o DOM está pronto.

## ✨ Recursos

- ✅ Geração de caça-palavras personalizados
- ✅ Múltiplas orientações (horizontal, vertical, diagonal, reversa)
- ✅ Tamanho customizável da grade
- ✅ Visualização de gabarito
- ✅ Exportação como imagem PNG
- ✅ Impressão com título customizável
- ✅ Design responsivo (desktop, tablet, mobile)
- ✅ Notificações visuais (Toast)
- ✅ Suporte a caracteres especiais (acentuação)
- ✅ Interface intuitiva e moderna

## 🚀 Como Usar

1. Abra `index.html` em um navegador web moderno
2. Digite as palavras que deseja (uma por linha)
3. Configure o tamanho da grade (largura e altura)
4. Selecione as orientações desejadas
5. Clique em "Gerar Caça-Palavras"
6. Use os botões para:
   - **Gabarito**: Mostrar/ocultar resposta
   - **Exportar**: Baixar como PNG
   - **Imprimir**: Imprimir com título customizado

## 🎨 Recursos de Design

- **Cores**: Paleta moderna com gradientes azuis e verdes
- **Tipografia**: Inter (fallback para system fonts)
- **Animações**: Transições suaves em elementos interativos
- **Responsividade**: Breakpoints em 1024px, 768px e 480px

## 📦 Dependências

- [Font Awesome 6.4.0](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css) - Ícones
- [HTML2Canvas 1.4.1](https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js) - Exportação de imagens

Ambas as dependências são carregadas via CDN.

## 🔧 Desenvolvimento

Para adicionar novas funcionalidades:

1. **Novas Classes**: Crie um arquivo em `js/classes/`
2. **UI Components**: Adicione em `js/ui/`
3. **Estilos**: Modifique `css/style.css` com comentários explicativos
4. **Inicialização**: Atualize `js/main.js` se necessário

## 📱 Compatibilidade

- ✅ Chrome/Edge (versões recentes)
- ✅ Firefox (versões recentes)
- ✅ Safari (versões recentes)
- ✅ Navegadores mobile (iOS Safari, Chrome Mobile)

## 📝 Notas

- O projeto possui comentários detalhados em todos os arquivos
- Código refatorado seguindo boas práticas de modularização
- Fácil manutenção e extensão futura
