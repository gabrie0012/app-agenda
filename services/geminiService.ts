
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async generateServiceDescription(serviceName: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva uma descrição profissional e persuasiva de até 3 frases para um serviço chamado: "${serviceName}".`,
      });
      return response.text?.trim() || "Descrição gerada automaticamente.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Erro ao gerar descrição.";
    }
  },

  async getAgendaSummary(appointments: any[]): Promise<string> {
    try {
      const prompt = `Resuma o dia de hoje com base nestes agendamentos: ${JSON.stringify(appointments)}. 
      Dê dicas de produtividade ou uma saudação encorajadora. Responda em Português de forma concisa.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.trim() || "Sem resumo disponível.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Não foi possível gerar o resumo da agenda.";
    }
  }
};
