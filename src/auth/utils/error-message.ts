// ----------------------------------------------------------------------

export function getErrorMessage(error: unknown): string {
  // Caso o erro já seja uma instância de Error ou o objeto de erro do Axios que tratamos
  if (error instanceof Error || (typeof error === 'object' && error !== null && 'message' in error)) {
    return (error as any).message || 'Ocorreu um erro inesperado';
  }

  // Caso o erro seja apenas uma string direta
  if (typeof error === 'string') {
    return error;
  }

  // Fallback para objetos desconhecidos
  if (typeof error === 'object' && error !== null) {
    const errorMessage = (error as { message?: string }).message;
    if (typeof errorMessage === 'string') {
      return errorMessage;
    }
  }

  return `Erro desconhecido: ${error}`;
}