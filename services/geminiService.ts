
import { GoogleGenAI, Type } from "@google/genai";

export const generateRoleplayScenario = async (topic: string, level: string) => {
  // Initializing GoogleGenAI with the API key from environment variable as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `베트남인 학습자를 위한 한국어 롤플레잉 시나리오를 만들어주세요. 
    주제: ${topic}
    레벨: ${level}
    
    출력 형식: JSON
    구성:
    - title: 시나리오 제목
    - context: 상황 설명 (한국어/베트남어)
    - characters: 등장인물 리스트
    - dialogue: 예시 대화 (5-8턴)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          context: { type: Type.STRING },
          characters: { type: Type.ARRAY, items: { type: Type.STRING } },
          dialogue: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                speaker: { type: Type.STRING },
                text: { type: Type.STRING },
                translation: { type: Type.STRING }
              }
            } 
          }
        },
        required: ["title", "context", "characters", "dialogue"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
