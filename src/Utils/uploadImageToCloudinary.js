export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "manage_rooms"); // Replace with your upload preset
  formData.append("cloud_name", "drrs8lvbl"); // Replace with your cloud name

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/drrs8lvbl/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
