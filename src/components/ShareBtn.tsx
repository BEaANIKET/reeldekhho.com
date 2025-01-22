import { useState, useEffect, useRef } from 'react';
import { Copy, Facebook, MessageCircle, Send, X } from 'lucide-react';

interface SharePopupProps {
    isOpen: boolean;
    onClose: () => void;
    reelId: number;
}

export default function ShareButton({ isOpen, onClose, reelId }: SharePopupProps) {
    const [showCopied, setShowCopied] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleCopyLink = async () => {
        const url = `${window.location.origin}/reels/${reelId}`;
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    const shareOptions = [
        {
            name: 'Copy link',
            icon: <Copy className="w-5 h-5" />,
            onClick: handleCopyLink,
        },
        {
            name: 'Share to WhatsApp',
            icon: <MessageCircle className="w-5 h-5" />,
            onClick: () => {
                const url = encodeURIComponent(`${window.location.origin}/reels/${reelId}`);
                window.open(`https://wa.me/?text=${url}`, '_blank');
            },
        },
        {
            name: 'Share to Facebook',
            icon: <Facebook className="w-5 h-5" />,
            onClick: () => {
                const url = encodeURIComponent(`${window.location.origin}/reels/${reelId}`);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
            },
        },
        {
            name: 'Share to Telegram',
            icon: <Send className="w-5 h-5" />,
            onClick: () => {
                const url = encodeURIComponent(`${window.location.origin}/reels/${reelId}`);
                window.open(`https://t.me/share/url?url=${url}`, '_blank');
            },
        },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div
                ref={popupRef}
                className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm overflow-hidden"
            >
                <div className="relative border-b dark:border-gray-700">
                    <h3 className="text-center py-4 font-semibold dark:text-white">
                        Share to
                    </h3>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    {shareOptions.map((option) => (
                        <button
                            key={option.name}
                            onClick={option.onClick}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <span className="text-gray-600 dark:text-gray-300">{option.icon}</span>
                            <span className="text-sm font-medium dark:text-white">{option.name}</span>
                        </button>
                    ))}
                </div>

                {showCopied && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm">
                        Link copied!
                    </div>
                )}
            </div>
        </div>
    );
}