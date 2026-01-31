
import { GoogleGenAI } from "@google/genai";
import { IPData, SecurityRisk } from "../types";

export const getAIInsights = async (ipData: IPData, security: SecurityRisk): Promise<string> => {
  // Always use `const ai = new GoogleGenAI({apiKey: process.env.API_KEY});`.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Act as a senior cybersecurity analyst. Analyze the following IP intelligence data and provide a concise security summary (2-3 paragraphs) including:
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
    // Fix: Using 'gemini-3-flash-preview' for basic text task as per requirements
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    // Extracting text output correctly using .text property
    return response.text || "Unable to generate AI insights at this time.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Error connecting to AI intelligence module.";
  }
};
