"use client";

import React, { useState, useEffect } from "react";
import { downloadGraphicAsPNG, downloadImageUrl } from "@/lib/downloadHelper";

interface DownloadableImageProps {
  children?: React.ReactNode;
  imageUrl?: string;
  emoji?: string;
  filename?: string;
  title?: string;
  subtitle?: string;
  fromColor?: string;
  toColor?: string;
  isCircle?: boolean;
  className?: string;
  buttonPosition?: "top-right" | "bottom-right" | "center" | "bottom-center";
  buttonText?: string;
  showAlways?: boolean;
  allowCustomUrl?: boolean;
  onImageUrlChange?: (newUrl: string) => void;
}

const SAMPLE_PRESET_IMAGES = [
  { name: "Delicious Biryani Feast", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" },
  { name: "Bengali Fish Curry", url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80" },
  { name: "Rich Curry Bowl", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80" },
  { name: "Artisan Sourdough", url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80" },
  { name: "Asian Noodle Bowl", url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80" },
  { name: "Healthy Vegan Bowl", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" },
  { name: "Friendly Chef portrait", url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80" },
];

export default function DownloadableImage({
  children,
  imageUrl,
  emoji = "🥘",
  filename = "food-picture.jpg",
  title,
  subtitle,
  fromColor = "#DCEBC8",
  toColor = "#8FB56C",
  isCircle = false,
  className = "",
  buttonPosition = "bottom-right",
  buttonText = "Download",
  showAlways = false,
  allowCustomUrl = true,
  onImageUrlChange,
}: DownloadableImageProps) {
  const [downloading, setDownloading] = useState(false);
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [imageError, setImageError] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Sync activeUrl if imageUrl prop changes
  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const currentUrl = customUrl || imageUrl;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setDownloading(true);
      setSaveMessage("Downloading...");
      if (currentUrl) {
        await downloadImageUrl(currentUrl, filename);
        setSaveMessage("Downloaded! ✓");
      } else {
        downloadGraphicAsPNG({
          filename,
          emoji,
          title,
          subtitle,
          fromColor,
          toColor,
          isCircle,
        });
        setSaveMessage("Saved PNG! ✓");
      }
    } catch (err) {
      console.error("Download failed:", err);
      setSaveMessage("Download Error");
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setSaveMessage(null);
      }, 2000);
    }
  };

  const applyNewUrl = (newUrl: string) => {
    const trimmed = newUrl.trim();
    if (trimmed) {
      setCustomUrl(trimmed);
      setImageError(false);
      if (onImageUrlChange) onImageUrlChange(trimmed);
    }
    setShowUrlModal(false);
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyNewUrl(customInput);
  };

  const getPosClasses = () => {
    switch (buttonPosition) {
      case "top-right":
        return "top-3 right-3";
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      case "bottom-center":
        return "bottom-3 left-1/2 -translate-x-1/2";
      case "bottom-right":
      default:
        return "bottom-3 right-3";
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* If customUrl was set by user, overlay custom image; otherwise render children */}
      {customUrl ? (
        <div className="w-full h-full min-h-[140px] relative overflow-hidden bg-sage-200">
          <img
            src={customUrl}
            alt={title || "Custom Food Picture"}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : currentUrl ? (
        !children ? (
          <div className="w-full h-full min-h-[140px] relative overflow-hidden bg-sage-200">
            <img
              src={currentUrl}
              alt={title || "Food Picture"}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          children
        )
      ) : (
        children
      )}

      {/* Error notification if custom image fails to load */}
      {imageError && (
        <div className="absolute top-2 left-2 z-20 px-2.5 py-1 bg-red-600 text-white rounded-md text-[10px] font-bold shadow-md">
          ⚠️ Invalid image URL
        </div>
      )}

      {/* Toast message notification on download */}
      {saveMessage && (
        <div className="absolute top-2 left-2 z-40 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-lg animate-bounce">
          {saveMessage}
        </div>
      )}

    </div>
  );
}
