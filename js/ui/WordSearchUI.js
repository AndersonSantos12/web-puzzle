/* ============================================================
   CLASSE WORDSEARCHUI - Gerenciamento da Interface
   ============================================================ */

// Gerencia toda a interação do usuário com a aplicação
// Responsável por renderização e eventos
class WordSearchUI {
  // Inicializa a interface, elementos DOM e listeners de eventos
  constructor() {
    this.initializeElements();       // Armazena referências aos elementos DOM
    this.attachEventListeners();    // Conecta handlers aos eventos
    this.currentPuzzle = null;      // Armazena o puzzle atual gerado
  }

  // Armazena referências a todos os elementos DOM necessários
  initializeElements() {
    // Elementos de entrada de dados
    this.wordInput = document.getElementById("wordInput");
    this.gridWidth = document.getElementById("gridWidth");
    this.gridHeight = document.getElementById("gridHeight");
    
    // Checkboxes de orientação
    this.horizontalCheck = document.getElementById("horizontal");
    this.verticalCheck = document.getElementById("vertical");
    this.diagonalCheck = document.getElementById("diagonal");
    this.reverseCheck = document.getElementById("reverse");
    this.showAnswerDefault = document.getElementById("showAnswerDefault");
    
    // Botões principais
    this.generateBtn = document.getElementById("generateBtn");
    this.clearBtn = document.getElementById("clearBtn");
    
    // Containers de saída
    this.puzzleContainer = document.getElementById("puzzleContainer");
    this.wordListContainer = document.getElementById("wordListContainer");
    this.wordList = document.getElementById("wordList");
    
    // Botões de ação
    this.actionButtons = document.getElementById("actionButtons");
    this.showAnswerBtn = document.getElementById("showAnswerBtn");
    this.exportImageBtn = document.getElementById("exportImageBtn");
    this.printBtn = document.getElementById("printBtn");
    
    // Elementos de impressão e título
    this.printTitle = document.getElementById("printTitle");
    this.puzzleTitle = document.getElementById("puzzleTitle");
    
    // Modal para entrada de título
    this.titleModal = document.getElementById("titleModal");
    this.titleInput = document.getElementById("titleInput");
    this.titleConfirmBtn = document.getElementById("titleConfirmBtn");
    this.titleCancelBtn = document.getElementById("titleCancelBtn");
    
    // Estado do gabarito
    this.answerVisible = false;
  }

  // Conecta handlers de eventos a todos os botões e elementos interativos
  attachEventListeners() {
    this.generateBtn.addEventListener("click", () => this.generatePuzzle());
    this.clearBtn.addEventListener("click", () => this.clearForm());
    this.showAnswerBtn.addEventListener("click", () => this.toggleAnswer());
    this.exportImageBtn.addEventListener("click", () => this.exportAsImage());
    this.printBtn.addEventListener("click", () => this.openTitleModal());
    
    // Handlers do modal de título
    this.titleConfirmBtn.addEventListener("click", () => this.confirmPrint());
    this.titleCancelBtn.addEventListener("click", () => this.closeTitleModal());
    // Permite pressionar Enter para confirmar
    this.titleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.confirmPrint();
    });
  }

  // Gera um novo caça-palavras baseado nas entradas do usuário
  generatePuzzle() {
    try {
      // Processa as palavras: separa por linha e remove espaços em branco
      const words = this.wordInput.value
        .split("\n")
        .filter((w) => w.trim())
        .map((w) => w.replace(/\s+/g, "")); // Remove espaços de palavras compostas

      // Valida se há palavras
      if (words.length === 0) {
        Toast.warning("Por favor, digite pelo menos uma palavra!");
        return;
      }

      // Obtém dimensões do grid
      const width = parseInt(this.gridWidth.value);
      const height = parseInt(this.gridHeight.value);

      // Monta objeto de opções de orientação
      const options = {
        horizontal: this.horizontalCheck.checked,
        vertical: this.verticalCheck.checked,
        diagonal: this.diagonalCheck.checked,
        reverse: this.reverseCheck.checked,
      };

      // Cria gerador e executa geração
      const generator = new WordSearchGenerator(width, height, words, options);
      const result = generator.generate();

      // Notifica sobre palavras que não couberam
      if (result.failedWords.length > 0) {
        const message = `Aviso: Não foi possível colocar: ${result.failedWords.join(
          ", "
        )}. Tente aumentar o tamanho!`;
        Toast.warning(message, 5000);
      } else {
        Toast.success("Caça-palavras gerado com sucesso!");
      }

      // Armazena puzzle e renderiza
      this.currentPuzzle = result;
      this.renderPuzzle(result);
      this.renderWordList(result.placedWords.map((p) => p.word));

      // Reseta estado do gabarito
      this.answerVisible = false;
      this.showAnswerBtn.textContent = "Mostrar Gabarito";
      this.clearHighlights();

      // Se opção "mostrar gabarito por padrão" está ativa, mostra gabarito
      if (this.showAnswerDefault.checked) {
        this.toggleAnswer();
      }

      // Mostra containers de saída
      this.wordListContainer.style.display = "block";
      this.actionButtons.style.display = "flex";
    } catch (error) {
      Toast.error("Erro: " + error.message);
    }
  }

  // Renderiza o grid do caça-palavras no container
  renderPuzzle(result) {
    const grid = result.grid;
    // Cria elemento container para o grid
    const gridElement = document.createElement("div");
    gridElement.className = "puzzle-grid";
    gridElement.style.gridTemplateColumns = `repeat(${grid[0].length}, 35px)`;

    // Cria cada célula com sua letra
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = document.createElement("div");
        cell.className = "puzzle-cell";
        cell.textContent = grid[row][col];
        // Armazena posição para referencias posteriores
        cell.dataset.row = row;
        cell.dataset.col = col;
        gridElement.appendChild(cell);
      }
    }

    // Substitui conteúdo anterior e adiciona novo grid
    this.puzzleContainer.innerHTML = "";
    this.puzzleContainer.appendChild(gridElement);
  }

  // Renderiza a lista de palavras para encontrar
  renderWordList(words) {
    this.wordList.innerHTML = "";
    words.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      this.wordList.appendChild(li);
    });
  }

  // Limpa o formulário e reseta valores padrão
  clearForm() {
    this.wordInput.value = "";
    this.gridWidth.value = 15;
    this.gridHeight.value = 15;
    // Restaura todas as orientações como selecionadas
    this.horizontalCheck.checked = true;
    this.verticalCheck.checked = true;
    this.diagonalCheck.checked = true;
    this.reverseCheck.checked = true;
  }

  // Reseta a exibição para o estado inicial
  resetPuzzle() {
    this.puzzleContainer.innerHTML =
      '<div class="placeholder"><p>👈 Configure as opções e clique em "Gerar Caça-Palavras"</p></div>';
    // Oculta containers de saída
    this.wordListContainer.style.display = "none";
    this.actionButtons.style.display = "none";
    // Limpa puzzle atual
    this.currentPuzzle = null;
    this.answerVisible = false;
  }

  // Alterna entre mostrar e ocultar o gabarito
  toggleAnswer() {
    if (!this.currentPuzzle) return;

    this.answerVisible = !this.answerVisible;

    if (this.answerVisible) {
      this.showAnswerBtn.textContent = "Ocultar Gabarito";
      this.highlightAnswers();  // Mostra resposta
    } else {
      this.showAnswerBtn.textContent = "Mostrar Gabarito";
      this.clearHighlights();  // Oculta resposta
    }
  }

  // Destaca as letras das palavras encontradas no grid
  highlightAnswers() {
    const cells = this.puzzleContainer.querySelectorAll(".puzzle-cell");

    // Remove destaque anterior
    cells.forEach((cell) => cell.classList.remove("answer"));

    // Adiciona destaque a cada posição das palavras colocadas
    this.currentPuzzle.placedWords.forEach((wordInfo) => {
      wordInfo.positions.forEach((pos) => {
        const cell = this.puzzleContainer.querySelector(
          `.puzzle-cell[data-row="${pos.row}"][data-col="${pos.col}"]`
        );
        if (cell) {
          cell.classList.add("answer");  // Adiciona classe de destaque
        }
      });
    });
  }

  // Remove o destaque de todas as células
  clearHighlights() {
    const cells = this.puzzleContainer.querySelectorAll(".puzzle-cell");
    cells.forEach((cell) => cell.classList.remove("answer"));
  }

  // Exporta o puzzle como arquivo PNG
  async exportAsImage() {
    if (!this.currentPuzzle) return;

    const puzzleGrid = this.puzzleContainer.querySelector(".puzzle-grid");
    if (!puzzleGrid) return;

    try {
      // Prepara o grid para captura
      puzzleGrid.style.transform = "scale(1)";
      puzzleGrid.style.transformOrigin = "top left";

      // Usa html2canvas para converter o grid em imagem
      const canvas = await html2canvas(puzzleGrid, {
        backgroundColor: "#f5f5f5",
        scale: 2,  // Dobra a resolução para melhor qualidade
        logging: false,
        width: puzzleGrid.offsetWidth,
        height: puzzleGrid.offsetHeight,
      });

      // Converte canvas para blob e inicia download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `caca-palavras-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      Toast.error("Erro ao exportar imagem: " + error.message);
    }
  }

  // Abre o modal para entrada do título de impressão
  openTitleModal() {
    this.titleInput.value = "Caça-Palavras";
    this.titleInput.focus();
    this.titleInput.select();  // Seleciona o texto para fácil edição
    this.titleModal.classList.add("active");
  }

  // Fecha o modal de título
  closeTitleModal() {
    this.titleModal.classList.remove("active");
  }

  // Confirma a impressão com o título fornecido
  confirmPrint() {
    const title = this.titleInput.value.trim();

    // Valida se há título
    if (!title) {
      Toast.warning("Digite um título!");
      return;
    }

    // Define o título no elemento e mostra
    this.puzzleTitle.textContent = title;
    this.printTitle.style.display = "block";
    this.closeTitleModal();

    // Aguarda renderização DOM antes de abrir diálogo de impressão
    setTimeout(() => {
      window.print();
    }, 100);
  }
}
