/* ============================================================
   CLASSE TOAST - Sistema de Notificações
   ============================================================ */

// Classe responsável por exibir notificações temporárias (toasts)
// Suporta diferentes tipos: info, success, error, warning
class Toast {
  // Exibe uma notificação com tipo e duração específicos
  static show(message, type = "info", duration = 3000) {
    const toastElement = document.createElement("div");
    toastElement.className = `toast ${type}`;
    toastElement.textContent = message;
    document.body.appendChild(toastElement);

    // Define duração da notificação e remove do DOM após expirar
    setTimeout(() => {
      toastElement.classList.add("hide");
      setTimeout(() => {
        document.body.removeChild(toastElement);
      }, 300);
    }, duration);
  }

  // Método auxiliar para notificação de sucesso (verde)
  static success(message, duration = 3000) {
    this.show(message, "success", duration);
  }

  // Método auxiliar para notificação de erro (vermelho)
  static error(message, duration = 3000) {
    this.show(message, "error", duration);
  }

  // Método auxiliar para notificação de aviso (amarelo)
  static warning(message, duration = 3000) {
    this.show(message, "warning", duration);
  }
}
