"use client";

import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";

interface Props {
  url: string;
  label?: string;
}

// Detect if URL is a direct file (PDF, ZIP, etc.) vs a web page
function isDirectFile(url: string): boolean {
  return /\.(pdf|zip|rar|doc|docx|ppt|pptx|jpg|jpeg|png|gif|webp|mp4|mov)(\?|$)/i.test(url);
}

// Detect if it's a Firebase Storage URL
function isFirebaseStorage(url: string): boolean {
  return url.includes("firebasestorage.googleapis.com") ||
         url.includes("firebasestorage.app");
}

// Detect if it's a Google Drive "view" link — convert to download
function getGoogleDriveDownloadUrl(url: string): string {
  // https://drive.google.com/file/d/FILE_ID/view → direct download
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

export default function MediaKitButton({ url, label = "Download Media Kit" }: Props) {
  const [downloading, setDownloading] = useState(false);

  // No URL set in CMS yet
  if (!url || url === "#" || url === "") {
    return (
      <button
        disabled
        className="btn-premium px-12 opacity-40 cursor-not-allowed inline-flex items-center gap-2"
      >
        <Download size={16} />
        {label}
      </button>
    );
  }

  const resolvedUrl = getGoogleDriveDownloadUrl(url);
  const directFile = isDirectFile(resolvedUrl) || isFirebaseStorage(resolvedUrl);

  async function handleDownload() {
    setDownloading(true);

    try {
      if (directFile) {
        // For Firebase Storage or direct file URLs: fetch as blob and trigger download
        const response = await fetch(resolvedUrl);
        if (!response.ok) throw new Error("Failed to fetch file");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        // Get filename from URL or use default
        const urlParts = resolvedUrl.split("/");
        const rawName = urlParts[urlParts.length - 1].split("?")[0];
        const fileName = rawName ? decodeURIComponent(rawName) : "media-kit.pdf";

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } else {
        // For web pages (Google Drive, Dropbox share links, etc.): open in new tab
        window.open(resolvedUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("[MediaKit] Download failed:", err);
      // Fallback: just open the URL
      window.open(resolvedUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="btn-premium px-12 disabled:opacity-70 disabled:cursor-wait inline-flex items-center gap-2"
    >
      {downloading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Preparing Download...
        </>
      ) : directFile ? (
        <>
          <Download size={16} />
          {label}
        </>
      ) : (
        <>
          <ExternalLink size={16} />
          {label}
        </>
      )}
    </button>
  );
}