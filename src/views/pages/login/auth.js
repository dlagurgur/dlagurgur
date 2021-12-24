export function signIn({ company, token }) {
  const user = token;
  if (user === undefined) throw new Error()
  return user
}

export function tokenchk({ token }) {
  const user = token;
  if (user === undefined) throw new Error()
  return user
}