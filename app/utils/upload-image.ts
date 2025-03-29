import { storage } from "../config/database";
import { v4 as uuidv4 } from "uuid"; // For generating unique filenames
import fs from "fs";
import { ServerStorage } from "../config/serverconfig";

export const uploadImageToFirebase = async (fileBuffer, destinationPath, mimeType) => {
  try {
    const bucket = ServerStorage;
    const file = bucket.file(destinationPath);

    // Upload the file
    await file.save(fileBuffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    // Make the file public
    await file.makePublic();

    // Generate a public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    throw new Error("Failed to upload image");
  }
};
