
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { CloudUpload, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/web3";

export default function FileUpload() {
  const { selectedWallets } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const hasSelectedWallets = selectedWallets.length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !hasSelectedWallets) return;
    
    setIsUploading(true);
    
    try {
      for (const wallet of selectedWallets) {
        toast.loading(`Uploading file to 0G Storage using wallet ${wallet.address.slice(0, 6)}...`);
        
        const result = await uploadFile(wallet.privateKey, selectedFile);
        
        if (result.success) {
          toast.success(`File successfully uploaded! TX: ${result.txHash.slice(0, 10)}...`);
        } else {
          toast.error("Upload failed.");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Upload</h1>
          <p className="text-muted-foreground">Upload files to 0G decentralized storage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Upload a file to the 0G decentralized storage network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <div className="border-2 border-dashed border-border/50 rounded-md p-6 mt-2">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <CloudUpload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : "Drag and drop a file, or click to browse"}
                  </p>
                  <input
                    id="file"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              disabled={!selectedFile || !hasSelectedWallets || isUploading}
              onClick={handleUpload}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload to 0G Storage"}
            </Button>
            
            {!hasSelectedWallets && (
              <p className="text-sm text-center text-amber-400">
                Please select at least one wallet first
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              How to use the 0G Storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-4">
              <p>
                0G Storage is a decentralized file storage system on the Newton Testnet.
                Files uploaded to the network are stored across the network's nodes.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Steps to upload:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Select the wallet(s) you want to upload from</li>
                  <li>Choose a file from your computer</li>
                  <li>Click the upload button</li>
                  <li>Wait for the transaction to be confirmed</li>
                  <li>Your file will be available through the 0G Storage network</li>
                </ol>
              </div>
              
              <p className="text-amber-400">
                Note: Each upload consumes a small amount of A0GI tokens as gas fee
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
