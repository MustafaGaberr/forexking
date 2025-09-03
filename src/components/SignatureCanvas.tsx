
import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Eraser, Save, Pen } from 'lucide-react';
import { toast } from "sonner";

interface SignatureCanvasProps {
  onSave?: (signatureDataUrl: string) => void;
  label?: string;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ 
  onSave,
  label = "Your Signature" 
}) => {
  const sigPadRef = useRef<SignaturePad>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      setIsEmpty(true);
    }
  };

  const save = () => {
    if (sigPadRef.current && !isEmpty) {
      const dataURL = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
      if (onSave) {
        onSave(dataURL);
      }
      toast.success("Signature saved successfully");
    } else {
      toast.error("Please provide a signature before saving");
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <div className="border-2 border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 shadow-sm">
        <SignaturePad
          ref={sigPadRef}
          canvasProps={{
            className: "w-full h-40 bg-white dark:bg-gray-900 rounded-md",
          }}
          onBegin={handleBegin}
          penColor="rgba(16, 185, 129, 0.8)"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clear}
          className="flex items-center gap-1 border-gray-300 dark:border-gray-600"
        >
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
        <Button 
          size="sm" 
          onClick={save}
          className="flex items-center gap-1 bg-primary hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save Signature
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
