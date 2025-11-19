import express from "express";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);

// Porta
const PORT = 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
