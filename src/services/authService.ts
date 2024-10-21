export const validateAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  if (!accessToken || !userId) {
    // Se a validação falhar, redirecione o usuário para a página de login
    throw new Error(
      "Usuário não autenticado. Redirecionando para a página de login."
    );
  }
  return { accessToken, userId };
};
