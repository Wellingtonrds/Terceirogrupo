import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standard ESM relative paths fallback (safe for both CommonJS and ESM)
const _filename = typeof import.meta !== "undefined" && import.meta.url ? fileURLToPath(import.meta.url) : "";
const _dirname = _filename ? path.dirname(_filename) : "";

const app = express();
const portArgIndex = process.argv.indexOf("--port");
const argPort = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : undefined;
const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
const PORT = argPort || envPort || 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// API health endpoint for probes and dev server health verification
app.all(["/api/health", "/health"], (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Initialize Gemini SDK with telemetry User-Agent
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("System: Gemini SDK initialized successfully.");
  } else {
    console.warn("System WARNING: GEMINI_API_KEY is not defined. AI matching will be unavailable.");
  }
} catch (err) {
  console.error("System ERROR: Failed to initialize Gemini SDK:", err);
}

// REST route for matching natural user input with defined triggers
app.post("/api/gemini/analyze", async (req, res): Promise<any> => {
  const { input, triggers } = req.body;

  if (!input || typeof input !== "string") {
    return res.status(400).json({ error: "O campo 'input' é obrigatório e deve ser texto." });
  }

  // Fallback direct matching if Gemini API is not working or not configured yet
  const normalizedInput = input.trim().toLowerCase();
  
  if (!ai) {
    // If AI is offline, do a fuzzy direct fallback match
    console.log("System: Gemini API is offline. Performing fallback local keyword match.");
    
    // Find trigger that is contained in the input, or matches closely
    const matched = triggers?.find((t: any) => {
      const phrase = t.phrase?.trim().toLowerCase();
      return phrase && (normalizedInput.includes(phrase) || phrase.includes(normalizedInput));
    });

    return res.json({
      matchedTriggerId: matched ? matched.id : null,
      confidence: matched ? 1.0 : 0.0,
      response: matched 
        ? `[Modo de Contingência local] Conexão Neural estabelecida. Parâmetro "${matched.phrase}" acionado localmente.`
        : "O canal neural de IA está indisponível ou sem chave API. Digite ou fale exatamente uma frase programada para abrir o portal de vídeo correspondente."
    });
  }

  try {
    // Stringify triggers list with their IDs and trigger phrases
    const triggerScenarios = triggers?.map((t: any) => `ID: "${t.id}" | Frase de ativação: "${t.phrase}" | Descrição do Canal: "${t.description || 'Nenhuma'}"`).join("\n") || "Nenhum trigger configurado.";

    const systemInstruction = `Você é o "Guardião Neural do Assistente de Taiga".
Sua tarefa é classificar a fala/texto do usuário comparando-a de forma semântica com os gatilhos configurados sobre o Bioma da Taiga (Floresta Boreal).
Se o usuário disser algo que não se assemelhe a nenhum gatilho, você deve obrigatoriamente classificar como matchedTriggerId: null.

Triggers configurados pelo usuário na central (você só pode retornar o ID de um destes listados abaixo se a correspondência for muito clara e forte, ou null se não for):
${triggerScenarios}

INSTRUÇÕES E REGRAS:
1. Examine a fala/texto do usuário. Compare a intenção com os gatilhos cadastrados da Taiga. Atribua o matchedTriggerId correspondente se a confiança / similaridade for de pelo menos 0.70.
2. Se a similaridade for menor que 0.70 ou o assunto for totalmente alheio às perguntas da Taiga configuradas, retorne matchedTriggerId como null e confiança de 0.0.
3. Elabore uma mensagem clara e concisa em português para "response". Se um trigger foi ativado, comente brevemente sobre a ativação da transmissão do vídeo da Taiga. Se NÃO houver correspondência, indique com gentileza que o usuário pode perguntar sobre: Animais da Taiga, Como preservar a Taiga, Ameaças da Taiga, Taiga no futuro ou Bioma da Taiga.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Mensagem ou comando recebido do usuário: "${input}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedTriggerId: {
              type: Type.STRING,
              description: "O ID do trigger semântico correspondente. Caso nenhuma se assemelhe na intenção, retorne null."
            },
            confidence: {
              type: Type.NUMBER,
              description: "Pontuação de confiança de 0.0 a 1.0."
            },
            response: {
              type: Type.STRING,
              description: "Mensagem do Assistente de Taiga reagindo ao comando e orientando o usuário."
            }
          },
          required: ["matchedTriggerId", "confidence", "response"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    return res.json({
      matchedTriggerId: data.matchedTriggerId || null,
      confidence: data.confidence || 0,
      response: data.response || "Comando recebido nas frequências boreais. Transmitindo canal correspondente."
    });

  } catch (err: any) {
    console.error("System ERROR inside /api/gemini/analyze:", err);
    return res.status(500).json({
      matchedTriggerId: null,
      confidence: 0,
      response: "A comunicação de IA encontrou interferência nos ventos boreais. Comutando para sensores locais.",
      details: err.message
    });
  }
});

// Dedicated REST route for the interactive speaking assistant
app.post("/api/gemini/assistant", async (req, res): Promise<any> => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "O campo 'question' é obrigatório." });
  }

  if (!ai) {
    return res.json({
      answer: "Olá! Sou o Assistente de Taiga. Estou pronto para tirar dúvidas sobre o bioma boreal, sua fauna, flora e preservação ambiental."
    });
  }

  try {
    const systemInstruction = `Você é o "Assistente de Taiga", um especialista e guia inteligente sobre o bioma da Taiga (floresta boreal de coníferas do hemisfério norte).
Você tem conhecimento profundo sobre:
- Características do Bioma da Taiga (clima subártico, solos podzólicos, permafrost, coníferas como abetos e pinheiros).
- Animais da Taiga (lobos cinzentos, linces-boreais, ursos-pardos, alces, caribus, raposas do ártico).
- Como preservar a Taiga (combate ao desmatamento, proteção de bacias boreais, redução da queima de combustíveis fósseis).
- Ameaças da Taiga (incêndios florestais devastadores, exploração de madeira, derretimento do permafrost, mineração).
- O futuro da Taiga diante das mudanças climáticas globais.

Instruções:
1. Responda de forma clara, fascinante, didática e precisa em português brasileiro.
2. Seja conciso (máximo de 3 a 4 frases) para ser ideal tanto para leitura quanto para reprodução em áudio.
3. Transmita o tom solene, sereno e ecológico do ambiente boreal e das neves eternas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Pergunta do usuário: "${question}"`,
      config: {
        systemInstruction,
        maxOutputTokens: 300,
      }
    });

    const answerText = response.text?.trim() || "Análise concluída sobre o Bioma da Taiga.";
    return res.json({
      answer: answerText
    });

  } catch (err: any) {
    console.error("System ERROR inside /api/gemini/assistant:", err);
    return res.status(500).json({
      answer: "Interferência nas comunicações subárticas. Por favor, repita a pergunta sobre a Taiga.",
      details: err.message
    });
  }
});

// Dedicated REST route for Mobile Audio Recording Transcription via Gemini
app.post("/api/transcribe-audio", async (req, res): Promise<any> => {
  const { audioData, mimeType } = req.body;

  if (!audioData || typeof audioData !== "string") {
    return res.status(400).json({ error: "O campo 'audioData' (base64) é obrigatório." });
  }

  if (!ai) {
    return res.status(503).json({
      error: "O módulo neural de IA do servidor não está conectado. Ative a chave de API.",
      transcript: ""
    });
  }

  try {
    const cleanBase64 = audioData.includes(",") ? audioData.split(",")[1] : audioData;
    const finalMime = mimeType || "audio/webm";

    // Transcribe with gemini-2.5-flash which natively processes audio inputs
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: finalMime,
            data: cleanBase64,
          }
        },
        {
          text: "Você é um sistema transcritor de voz em português brasileiro (pt-BR). Transcreva com máxima precisão o que foi falado pelo usuário neste áudio. Retorne APENAS o texto da fala transcrita, sem introduções, sem formatações extras, sem aspas e sem pontuação desnecessária. Se não houver fala clara ou apenas ruído de fundo, retorne uma string vazia."
        }
      ]
    });

    const transcript = response.text?.trim() || "";
    return res.json({ transcript });
  } catch (err: any) {
    console.error("System ERROR inside /api/transcribe-audio:", err);
    return res.status(500).json({
      error: "Erro na transcrição de áudio via IA",
      details: err.message,
      transcript: ""
    });
  }
});

// Configure Vite middleware in development, or Static Files serving in Production
async function bootstrap() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("System: Vite Middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("System: Serving production static assets from: " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`System: EcoSphere Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
