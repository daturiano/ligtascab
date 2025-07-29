'use client';

import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

export default function CopyButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = id;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Copy command failed');
        }
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  return (
    <div className={`flex items-center gap-2`}>
      <span className="text-xs">{id.slice(0, 4).toUpperCase()}...</span>
      <button
        onClick={copyToClipboard}
        className="p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        title={copied ? 'Copied!' : 'Copy full ID'}
      >
        {copied ? (
          <Check size={12} className="text-green-500" />
        ) : (
          <Copy size={12} className="text-gray-500 hover:text-gray-700" />
        )}
      </button>
    </div>
  );
}
