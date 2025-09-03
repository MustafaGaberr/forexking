
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadDialog from './FileUploadDialog';
import { Upload } from 'lucide-react';

interface AddDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDeal: (deal: any) => void;
  onFileUpload?: (file: File) => void;
}

const AddDealDialog = ({ open, onOpenChange, onAddDeal, onFileUpload }: AddDealDialogProps) => {
  const [formData, setFormData] = useState({
    clientName: '',
    dealType: '',
    amount: '',
    profit: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDeal({
      ...formData,
      amount: parseFloat(formData.amount),
      profit: parseFloat(formData.profit),
    });
    setFormData({
      clientName: '',
      dealType: '',
      amount: '',
      profit: '',
      date: new Date().toISOString().split('T')[0],
    });
    onOpenChange(false);
  };

  const handleFileUpload = (file: File) => {
    if (onFileUpload) {
      onFileUpload(file);
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
            <DialogDescription>
              Add a new deal manually or upload daily deals file.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="upload">File Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dealType">Deal Type</Label>
                    <Input
                      id="dealType"
                      value={formData.dealType}
                      onChange={(e) => setFormData({...formData, dealType: e.target.value})}
                      placeholder="e.g., EUR/USD"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profit">Profit ($)</Label>
                    <Input
                      id="profit"
                      type="number"
                      value={formData.profit}
                      onChange={(e) => setFormData({...formData, profit: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Deal</Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="py-4">
                <div className="text-center space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Upload Daily Deals</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a file containing multiple deals at once
                    </p>
                    <Button 
                      onClick={() => setIsFileUploadOpen(true)}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <FileUploadDialog
        open={isFileUploadOpen}
        onOpenChange={setIsFileUploadOpen}
        onFileUpload={handleFileUpload}
      />
    </>
  );
};

export default AddDealDialog;
