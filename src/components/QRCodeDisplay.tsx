import React, { useRef } from 'react';
import { Download, Copy, CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { toast } from 'sonner';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeDisplayProps {
  qrCodeImage?: string;
  qrData: string;
  title: string;
  description?: string;
  equipmentName?: string;
  available?: boolean;
  onClose?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeImage,
  qrData,
  title,
  description,
  equipmentName,
  available = true,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrData);
    setCopied(true);
    toast.success('QR code data copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    try {
      const canvas = qrRef.current?.querySelector('canvas');
      if (!canvas) {
        toast.error('QR code not found');
        return;
      }
      
      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate QR code image');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${qrData.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('QR code downloaded successfully!');
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const content = (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
            {equipmentName && (
              <p className="text-sm font-medium text-muted-foreground">
                Equipment: {equipmentName}
              </p>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Equipment Name and Status Banner */}
        {equipmentName && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                  Equipment Name
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {equipmentName}
                </h3>
              </div>
              <Badge 
                variant={available ? "default" : "destructive"}
                className={`text-sm px-3 py-1 ${
                  available 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {available ? '✓ Available' : '✗ Not Available'}
              </Badge>
            </div>
          </div>
        )}

        {/* QR Code Image */}
        <div ref={qrRef} className="flex flex-col items-center p-8 bg-white rounded-lg border-2 border-gray-200">
          <QRCodeCanvas
            value={qrData}
            size={256}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: '',
              x: undefined,
              y: undefined,
              height: 0,
              width: 0,
              excavate: false,
            }}
          />
          {/* Equipment Info Below QR */}
          {equipmentName && (
            <div className="mt-4 text-center space-y-1">
              <p className="text-sm font-bold text-gray-900">{equipmentName}</p>
              <Badge 
                variant={available ? "default" : "secondary"}
                className={`text-xs ${
                  available 
                    ? 'bg-green-100 text-green-800 border-green-300' 
                    : 'bg-gray-100 text-gray-800 border-gray-300'
                }`}
              >
                {available ? 'AVAILABLE' : 'NOT AVAILABLE'}
              </Badge>
            </div>
          )}
        </div>

        {/* QR Data */}
        <div className="space-y-2">
          <label className="text-sm font-medium">QR Code Data</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrData}
              readOnly
              className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              title="Copy QR data"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">
            How to use:
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Download or print this QR code</li>
            <li>Attach it to the equipment</li>
            <li>Users can scan it for check-in/check-out</li>
            <li>Track equipment availability in real-time</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );

  // If onClose is provided, wrap in modal
  if (onClose) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default QRCodeDisplay;
