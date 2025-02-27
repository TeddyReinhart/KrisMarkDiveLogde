export async function uploadImageToCloudinary(file) {
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dthtevlbx/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "My_Preset"; 

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return "";
  }
}
