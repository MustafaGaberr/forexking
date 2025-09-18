import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, RotateCw, ZoomIn, ZoomOut, FileText, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFViewerProps {
  pdfUrl?: string;
  title?: string;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  pdfUrl, 
  title = "PDF Document",
  className = ""
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [viewerType, setViewerType] = useState<'iframe' | 'object' | 'embed'>('iframe');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  // Fetch PDF as blob and create object URL
  const fetchPdfAsBlob = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfBlobUrl(blobUrl);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PDF');
      setLoading(false);
    }
  };

  // Load PDF when URL changes
  useEffect(() => {
    if (pdfUrl) {
      setViewerType('iframe');
      setPdfBlobUrl(null);
      setError(null);
    }
  }, [pdfUrl]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    if (viewerType === 'iframe') {
      setViewerType('object');
      setError(null);
    } else if (viewerType === 'object') {
      setViewerType('embed');
      setError(null);
    } else {
      setError('Failed to load PDF document');
      toast({
        title: "Error",
        description: "Failed to load PDF document",
        variant: "destructive",
      });
    }
  }

  const handleLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setViewerType('iframe');
    if (pdfUrl) {
      fetchPdfAsBlob(pdfUrl);
    }
  };

  if (!pdfUrl) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No PDF document available</p>
            <p className="text-sm text-muted-foreground">
              Please upload a PDF document from the Admin Dashboard
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full min-h-[600px] bg-gray-50 rounded-lg overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}
          
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <FileText className="h-16 w-16 text-destructive mb-4" />
              <p className="text-destructive mb-2">Failed to load PDF</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : (
            <div 
              className="w-full h-full min-h-[600px] border-0"
              style={{ 
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'top left'
              }}
            >
              {viewerType === 'iframe' && (
                <iframe
                  ref={iframeRef}
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=${Math.round(scale * 100)}`}
                  className="w-full h-full min-h-[600px] border-0"
                  onLoadStart={handleLoadStart}
                  onLoad={handleLoad}
                  onError={handleError}
                  title={title}
                />
              )}
              
              {viewerType === 'object' && (
                <object
                  data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=${Math.round(scale * 100)}`}
                  type="application/pdf"
                  className="w-full h-full min-h-[600px] border-0"
                  onLoadStart={handleLoadStart}
                  onLoad={handleLoad}
                  onError={handleError}
                >
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">PDF Viewer not supported</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your browser doesn't support PDF viewing with object tag.
                    </p>
                    <Button onClick={() => setViewerType('embed')} variant="outline">
                      Try Embed
                    </Button>
                  </div>
                </object>
              )}
              
              {viewerType === 'embed' && (
                <embed
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=${Math.round(scale * 100)}`}
                  type="application/pdf"
                  className="w-full h-full min-h-[600px] border-0"
                  onLoadStart={handleLoadStart}
                  onLoad={handleLoad}
                  onError={handleError}
                />
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Current viewer: {viewerType} | If PDF doesn't display properly:
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              onClick={() => setViewerType('iframe')}
              variant="outline"
              size="sm"
            >
              Try Iframe
            </Button>
            <Button
              onClick={() => setViewerType('object')}
              variant="outline"
              size="sm"
            >
              Try Object
            </Button>
            <Button
              onClick={() => setViewerType('embed')}
              variant="outline"
              size="sm"
            >
              Try Embed
            </Button>
            <Button
              onClick={() => window.open(pdfUrl, '_blank')}
              variant="outline"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;
