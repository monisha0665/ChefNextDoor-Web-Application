/**
 * Utility functions for downloading real images and rendering graphic downloads
 */

/**
 * Downloads an image file directly to the user's computer from a remote or local URL
 */
export async function downloadImageUrl(url: string, filename: string = "food-picture.jpg") {
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Attempt 1: Fetch as Blob (works for Unsplash, Supabase, same-origin, CORS-enabled assets)
  try {
    const response = await fetch(url);
    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = cleanFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      return;
    }
  } catch (err) {
    console.warn("Direct fetch failed for URL, attempting Canvas draw fallback...", err);
  }

  // Attempt 2: HTML5 Canvas draw & export (works for images loaded into DOM)
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      setTimeout(() => reject(new Error("Timeout loading image")), 5000);
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 800;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = cleanFilename.endsWith(".jpg") || cleanFilename.endsWith(".png") ? cleanFilename : `${cleanFilename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  } catch (canvasErr) {
    console.warn("Canvas export blocked, triggering direct download link:", canvasErr);
  }

  // Attempt 3: Direct anchor download link
  const link = document.createElement("a");
  link.href = url;
  link.download = cleanFilename;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Renders an emoji/graphic icon onto an HD canvas with styled background gradient
 * and triggers a PNG image download.
 */
export function downloadGraphicAsPNG({
  filename = "chefnextdoor-picture.png",
  emoji = "🥘",
  title = "ChefNextDoor",
  subtitle = "Homemade with love",
  fromColor = "#DCEBC8", // sage-200
  toColor = "#8FB56C",   // sage-400
  isCircle = true,
}: {
  filename?: string;
  emoji?: string;
  title?: string;
  subtitle?: string;
  fromColor?: string;
  toColor?: string;
  isCircle?: boolean;
}) {
  const canvas = document.createElement("canvas");
  const size = 800;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, fromColor);
  gradient.addColorStop(1, toColor);

  ctx.fillStyle = gradient;
  if (isCircle) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, size, size);
  }

  // Draw Emoji
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "260px sans-serif";
  ctx.fillText(emoji, size / 2, size / 2 - (title ? 40 : 0));

  // Optional Title Text overlay
  if (title) {
    ctx.fillStyle = "#24361F"; // sage-900
    ctx.font = "bold 44px system-ui, sans-serif";
    ctx.fillText(title, size / 2, size - 140);
  }

  if (subtitle) {
    ctx.fillStyle = "#3E5C33"; // sage-700
    ctx.font = "32px system-ui, sans-serif";
    ctx.fillText(subtitle, size / 2, size - 85);
  }

  // Convert to PNG data URL and trigger download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
