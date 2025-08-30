
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data.split(',')[1],
      mimeType,
    },
  };
};

export const describeImageStyle = async (base64Image: string): Promise<string> => {
  const mimeType = base64Image.match(/data:(.*);base64,/)?.[1] ?? 'image/jpeg';
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: "Describe the artistic style of this image in a detailed, vibrant, and evocative manner. Focus on color palette, lighting, composition, mood, and any discernible techniques (e.g., 'oil painting', 'photorealistic', 'watercolor', 'art deco'). This description will be used as a prompt for an image generation AI, so be specific and inspiring." }] },
  });

  return response.text;
};

export const generateStyledImage = async (prompt: string, styleDescription: string): Promise<string> => {
    const fullPrompt = `${styleDescription}. Create an image depicting: ${prompt}`;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } else {
        throw new Error("Image generation failed or returned no images.");
    }
};

export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
    const mimeType = base64Image.match(/data:(.*);base64,/)?.[1] ?? 'image/png';
    const imagePart = fileToGenerativePart(base64Image, mimeType);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("Image editing failed to return a new image.");
};
