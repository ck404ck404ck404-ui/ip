
import { GoogleGenAI } from "@google/genai";
import { IPData, SecurityRisk, Language } from "../types";

export const getAIInsights = async (ipData: IPData, security: SecurityRisk, lang: Language = 'en'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageInstruction = lang === 'bn' 
    ? "Please provide the analysis in Bengali (বাংলা ভাষা)." 
    : "Please provide the analysis in English.";

  const prompt = `
    Act as a senior cybersecurity analyst. Analyze the following IP intelligence data and provide a concise security summary (2-3 paragraphs).
    ${languageInstruction}
    
    Include:
    1. Geopolitical context of the location (${ipData.city}, ${ipData.country_name}).
    2. Network analysis for ${ipData.org} (ASN: ${ipData.asn}).
    3. Potential risks based on a risk score of ${security.risk_score}/100 and threat level ${security.threat_level}.
    4. Actionable recommendations for a user interacting with this IP.

    Data:
    - IP: ${ipData.ip}
    - ISP/Org: ${ipData.org}
    - Security: Hosting=${security.is_hosting}, VPN=${security.is_vpn}, Proxy=${security.is_proxy}
    - Location: Lat ${ipData.latitude}, Long ${ipData.longitude}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || (lang === 'bn' ? "তথ্য পাওয়া যায়নি।" : "Unable to generate AI insights.");
  } catch (error) {
    console.error("AI Insight Error:", error);
    return lang === 'bn' ? "AI সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে।" : "Error connecting to AI intelligence module.";
  }
};
