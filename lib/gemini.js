import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGemini({
  system = "",
  prompt,
  images = [],
}) {
  // API Key check
  if (!process.env.GEMINI_API_KEY) {
    console.log("❌ API KEY ERROR: GEMINI_API_KEY .env.local file mein nahi mili!");
    return { success: false, error: "API Key missing in .env.local" };
  }

  // Gemini API Client initialize karein
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Future-proof fallback models list
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro"
  ];

  const visionModelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro"
  ];

  const modelsList = images.length > 0 ? visionModelsToTry : modelsToTry;

  let lastError = null;

  for (const currentModel of modelsList) {
    try {
      const aiModel = genAI.getGenerativeModel({ model: currentModel });

      const content = [];
      
      if (system) {
        content.push(`System Instruction:\n${system}\n\nUser Request:\n${prompt}`);
      } else {
        content.push(prompt);
      }

      images.forEach((b64) => {
        // Gemini ko sirf raw base64 chahiye hota hai, isliye prefix hatai
        const mimeType = b64.match(/data:(.*?);base64,/)?.[1] || "image/jpeg";
        // Ye sabse safe tarika hai prefix hatane ka
        const cleanB64 = b64.includes("base64,") ? b64.split("base64,")[1] : b64;
        content.push({
          inlineData: {
            data: cleanB64,
            mimeType: mimeType,
          },
        });
      });

      const result = await aiModel.generateContent(content);
      const response = await result.response;
      let raw = response.text();

      raw = raw.replace(/```json|```/g, "").trim();

      return { success: true, data: JSON.parse(raw) };
    } catch (error) {
      lastError = error;
      const errMsg = error.message || "";
      
      console.log(`❌ GEMINI ERROR (${currentModel}):`, errMsg);

      // Clear Error Logging
      if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("403")) {
        return { success: false, error: "GEMINI API KEY INVALID HAI. Kripya nayi key .env.local me daal kar server restart karein!" };
      } 
      else if (errMsg.includes("404") && currentModel === modelsList[modelsList.length - 1]) {
        return { success: false, error: "Gemini API Key kaam kar rahi hai, par 'Generative Language API' on nahi hai. Kripya Google Cloud Console me is API ko enable karein!" };
      }
      else if (errMsg.includes("404") || errMsg.includes("not found")) {
        console.log(`⚠️ MODEL ERROR: Model '${currentModel}' is API key par available nahi hai. Next fallback try kar rahe hain...`);
        continue;
      } 
      else if (errMsg.includes("429") || errMsg.includes("Quota") || errMsg.includes("Too Many Requests")) {
        console.log(`⚠️ QUOTA EXCEEDED: Model '${currentModel}' ki limit khatam ho gayi hai. Lighter model try kar rahe hain...`);
        continue; // Limit cross ho gayi, agla sasta model try karo
      }
      else {
        console.log(`❌ UNKNOWN ERROR (Model: ${currentModel}):`, errMsg);
        break; // Koi aur issue hai toh break
      }
    }
  }

  console.error("\n❌ Gemini API All Fallbacks Failed:", lastError?.message);
  return { success: false, error: lastError?.message || "All models failed" };
}