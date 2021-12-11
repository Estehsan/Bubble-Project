export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "L'adresse email est obligatoire."
  if (!re.test(email)) return "L'adresse email n'est pas valide"
  return ''
}
