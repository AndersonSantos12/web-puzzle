/* ============================================================
   CLASSE WORDSEARCHGENERATOR - Geração do Caça-Palavras
   ============================================================ */

// Classe principal responsável por gerar o caça-palavras
// Gerencia o grid, colocação de palavras e preenchimento
class WordSearchGenerator {
  // Inicializa o gerador com dimensões, palavras e opções de orientação
  constructor(width, height, words, options) {
    this.width = width;                         // Largura do grid
    this.height = height;                       // Altura do grid
    // Processa palavras: converte para maiúsculas e remove vazias
    this.words = words
      .map((w) => w.toUpperCase().trim())
      .filter((w) => w.length > 0);
    this.options = options;                     // Opções de orientação (horizontal, vertical, etc)
    this.grid = [];                             // Grid 2D que armazena as letras
    this.placedWords = [];                      // Array com palavras colocadas e suas posições
    this.directions = this.getDirections();    // Calcula direções permitidas baseado nas opções
  }

  // Determina quais direções são permitidas baseado nas opções do usuário
  // dx e dy definem o incremento em cada posição ao colocar uma letra
  getDirections() {
    const dirs = [];

    // Horizontal: move para a direita
    if (this.options.horizontal) {
      dirs.push({ dx: 1, dy: 0, name: "horizontal" });
    }

    // Vertical: move para baixo
    if (this.options.vertical) {
      dirs.push({ dx: 0, dy: 1, name: "vertical" });
    }

    // Diagonal: duas variações (direita-baixo e direita-cima)
    if (this.options.diagonal) {
      dirs.push({ dx: 1, dy: 1, name: "diagonal" });  // Direita-baixo
      dirs.push({ dx: 1, dy: -1, name: "diagonal" }); // Direita-cima
    }

    // Orientações reversas: palavras de trás para frente
    if (this.options.reverse) {
      if (this.options.horizontal) {
        dirs.push({ dx: -1, dy: 0, name: "horizontal-reverso" }); // Esquerda
      }
      if (this.options.vertical) {
        dirs.push({ dx: 0, dy: -1, name: "vertical-reverso" }); // Cima
      }
      if (this.options.diagonal) {
        dirs.push({ dx: -1, dy: -1, name: "diagonal-reverso" }); // Esquerda-cima
        dirs.push({ dx: -1, dy: 1, name: "diagonal-reverso" });  // Esquerda-baixo
      }
    }

    return dirs;
  }

  // Cria um grid vazio com dimensões especificadas
  initializeGrid() {
    this.grid = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(""));
  }

  // Verifica se uma palavra pode ser colocada em uma posição e direção
  // Retorna true se não há conflitos ou sobreposição inválida
  canPlaceWord(word, row, col, direction) {
    const { dx, dy } = direction;

    // Verifica cada letra da palavra
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dy * i;
      const newCol = col + dx * i;

      // Rejeita se a posição está fora dos limites do grid
      if (
        newRow < 0 ||
        newRow >= this.height ||
        newCol < 0 ||
        newCol >= this.width
      ) {
        return false;
      }

      // Rejeita se há conflito: célula ocupada com letra diferente
      const cellValue = this.grid[newRow][newCol];
      if (cellValue !== "" && cellValue !== word[i]) {
        return false;
      }
    }

    return true; // Nenhum conflito encontrado
  }

  // Coloca uma palavra no grid e registra suas posições
  // Armazena informações para exibição de gabarito
  placeWord(word, row, col, direction) {
    const { dx, dy } = direction;
    const positions = [];  // Array com coordenadas de cada letra

    // Insere cada letra da palavra no grid
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dy * i;
      const newCol = col + dx * i;
      this.grid[newRow][newCol] = word[i];
      positions.push({ row: newRow, col: newCol });
    }

    // Registra a palavra para uso posterior (gabarito)
    this.placedWords.push({
      word,
      positions,
      direction: direction.name,
    });
  }

  // Tenta colocar uma palavra no grid
  // Usa diferentes estratégias baseado no tamanho da palavra
  tryPlaceWord(word) {
    const maxAttempts = 100;
    const maxDimension = Math.max(this.width, this.height);
    // Palavras grandes (>30% do grid) usam busca mais eficiente
    const isLargeWord = word.length > maxDimension * 0.3;

    if (isLargeWord) {
      // Para palavras grandes, faz busca exaustiva em todas as posições
      return this.tryPlaceWordLarge(word);
    } else {
      // Para palavras pequenas, tenta posições aleatórias (mais rápido)
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const direction =
          this.directions[Math.floor(Math.random() * this.directions.length)];
        const row = Math.floor(Math.random() * this.height);
        const col = Math.floor(Math.random() * this.width);

        // Se conseguir colocar, registra e retorna sucesso
        if (this.canPlaceWord(word, row, col, direction)) {
          this.placeWord(word, row, col, direction);
          return true;
        }
      }
      return false; // Não conseguiu após todos os tentativas
    }
  }

  // Busca exaustiva para colocar palavras grandes
  // Testa todas as posições e direções de forma embaralhada
  tryPlaceWordLarge(word) {
    // Embaralha as direções para maior variabilidade
    const shuffledDirections = [...this.directions].sort(
      () => Math.random() - 0.5
    );

    // Tenta cada direção
    for (const direction of shuffledDirections) {
      // Cria array com todas as posições possíveis do grid
      const positions = [];
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          positions.push({ row, col });
        }
      }

      // Embaralha as posições para maior aleatoriedade
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // Tenta colocar em cada posição embaralhada
      for (const { row, col } of positions) {
        if (this.canPlaceWord(word, row, col, direction)) {
          this.placeWord(word, row, col, direction);
          return true;
        }
      }
    }

    return false; // Não conseguiu colocar em nenhuma posição
  }

  // Preenche as células vazias do grid com letras aleatórias
  // Inclui acentuação se houver palavras com caracteres especiais
  fillEmptyCells() {
    const baseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const accentedLetters = "ÀÁÂÃÇÉÊÍÓÔÕÚ";

    // Detecta se há palavras com acentuação ou cedilha
    const hasSpecialChars = this.placedWords.some((wordInfo) =>
      /[ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ]/.test(wordInfo.word)
    );

    // Preenche cada célula vazia
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (this.grid[row][col] === "") {
          // Se há caracteres especiais, 8% chance de adicionar acentuação
          if (hasSpecialChars && Math.random() < 0.08) {
            this.grid[row][col] =
              accentedLetters[
                Math.floor(Math.random() * accentedLetters.length)
              ];
          } else {
            // Caso contrário, usa letra normal
            this.grid[row][col] =
              baseLetters[Math.floor(Math.random() * baseLetters.length)];
          }
        }
      }
    }
  }

  // Executa todo o processo de geração do caça-palavras
  // Retorna grid, palavras colocadas e palavras que não couberam
  generate() {
    this.initializeGrid();
    this.placedWords = [];

    // Valida se pelo menos uma orientação foi selecionada
    if (this.directions.length === 0) {
      throw new Error("Selecione pelo menos uma orientação!");
    }

    // Ordena palavras por tamanho descendente (maiores primeiro)
    // Isso melhora a probabilidade de colocar todas as palavras
    const sortedWords = [...this.words].sort((a, b) => b.length - a.length);

    const failedWords = [];  // Palavras que não conseguiram ser colocadas

    // Tenta colocar cada palavra
    for (const word of sortedWords) {
      if (!this.tryPlaceWord(word)) {
        failedWords.push(word);
      }
    }

    // Preenche células vazias com letras aleatórias
    this.fillEmptyCells();

    // Retorna resultado completo
    return {
      grid: this.grid,
      placedWords: this.placedWords,
      failedWords,
    };
  }
}
