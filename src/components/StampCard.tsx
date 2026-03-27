import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Stamp } from "../constants";

interface StampCardProps {
  stamp: Stamp;
  onDownload: (stamp: Stamp) => Promise<void>;
}

export default function StampCard({ stamp, onDownload }: StampCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      await onDownload(stamp);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={stamp.url}
          alt={stamp.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-t border-gray-50">
        <span className="text-sm font-medium text-gray-700 truncate mr-2">
          {stamp.title}
        </span>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-700 active:scale-90 disabled:bg-gray-400 transition-all shadow-lg"
          title="Download"
        >
          {isDownloading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Download size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
