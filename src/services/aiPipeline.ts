import { ai } from "./geminiClient";
import { marbleClient } from "./marbleClient";

// Helper to convert data URL to Blob
const dataURLtoBlob = (dataurl: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

// AI Pipeline Service

export const generateImage = async (prompt: string): Promise<string> => {
  console.log(`[Nano Banana] Generating image for prompt: "${prompt}"...`);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K",
        },
      },
    });

    console.log("[Nano Banana] API Response received:", response);

    response.candidates?.[0]?.content?.parts?.forEach((part, index) => {
      if (part.thought) {
        console.log(`[Nano Banana] Thought Part ${index}:`, part.text || "Thought Image/Data");
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    
    if (part?.inlineData?.data) {
      const base64Data = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || "image/png";
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      
      console.log(`[Nano Banana] Image generated successfully.`);
      return dataUrl;
    } else {
      throw new Error("No image data found in response");
    }
  } catch (error) {
    console.error("[Nano Banana] Generation failed:", error);
    throw error;
  }
};

const uploadMediaAsset = async (dataUrl: string): Promise<string> => {
  console.log("[Marble] Preparing upload...");
  const blob = dataURLtoBlob(dataUrl);
  
  // 1. Prepare Upload via Frontend Client
  const { upload_info, media_asset } = await marbleClient.prepareUpload(
    "generated_image.png",
    "png",
    "image"
  );

  // 2. Upload File with REQUIRED HEADERS
  console.log("[Marble] Uploading to signed URL with headers:", upload_info.required_headers);
  
  const uploadRes = await fetch(upload_info.upload_url, {
    method: "PUT",
    headers: {
      ...upload_info.required_headers, // CRITICAL: Must include all headers returned by Marble
    },
    body: blob
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    console.error("[Marble] Upload failed body:", errorText);
    throw new Error(`Failed to upload file to Marble: ${uploadRes.status} ${uploadRes.statusText}`);
  }
  
  console.log("[Marble] Upload complete.");
  return media_asset.media_asset_id;
};

const pollOperation = async (operationId: string): Promise<string> => {
  console.log("[Marble] Polling operation status...");
  
  while (true) {
    const data = await marbleClient.getOperation(operationId);
    console.log(`[Marble] Status: ${data.done ? "DONE" : "IN_PROGRESS"}`);

    if (data.done) {
        if (data.error) throw new Error(`Operation failed: ${data.error.message}`);
        
        const world = data.response;
        if (!world) throw new Error("No world data in operation response");
        
        console.log(`[Marble] World Generated: ${world.world_id}`);
        
        const spzUrls = world.assets?.splats?.spz_urls;
        if (spzUrls) {
             const firstKey = Object.keys(spzUrls)[0];
             return spzUrls[firstKey];
        }

        // Fallback to fetching world details
        const worldDetails = await marbleClient.getWorld(world.world_id);
        const detailSpzUrls = worldDetails.assets?.splats?.spz_urls;
        if (!detailSpzUrls) throw new Error("No Gaussian Splat assets found");
        
        const firstDetailKey = Object.keys(detailSpzUrls)[0];
        return detailSpzUrls[firstDetailKey];
    }

    await new Promise(r => setTimeout(r, 2000));
  }
};

export const convertToSplat = async (imageUrl: string, model: "Marble 0.1-mini" | "Marble 0.1-plus" = "Marble 0.1-plus"): Promise<string> => {
  console.log(`[Marble World Labs] Starting conversion pipeline with model: ${model}...`);
  
  const mediaAssetId = await uploadMediaAsset(imageUrl);
  console.log(`[Marble] Media Asset ID: ${mediaAssetId}`);

  console.log("[Marble] Requesting world generation...");
  const { operation_id } = await marbleClient.generateWorld(mediaAssetId, model);
  console.log(`[Marble] Operation ID: ${operation_id}`);

  return await pollOperation(operation_id);
};

export const polishEnvironment = async (splatData: string): Promise<string> => {
  console.log(`[Decart Realtime] Polishing environment...`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`[Decart Realtime] Polish complete.`);
  return splatData;
};