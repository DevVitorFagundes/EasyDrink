import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

// Lista fixa de usuários
const usuarios = [
  { id: 1, email: "user@teste.com", senha: "123456", nome: "Usuário Teste" }
];

export const login = (req, res) => {
  const { email, senha } = req.body;

  const user = usuarios.find(
    (u) => u.email === email && u.senha === senha
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return res.json({
    message: "Login realizado com sucesso!",
    user: { id: user.id, email: user.email, nome: user.nome },
    token
  });
};
