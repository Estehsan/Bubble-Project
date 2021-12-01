export function passwordValidator(password) {
  if (!password) return "Le mot de passe est obligatoire."
  if (password.length < 6) return '6 caractères minimum'
  return ''
}
