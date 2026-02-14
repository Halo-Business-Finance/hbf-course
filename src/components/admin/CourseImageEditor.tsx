import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/hooks/useCourses";
import { MediaSelector } from "./MediaSelector";

interface CourseImageEditorProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (courseId: string, imageBlob: Blob) => Promise<void>;
}

export function CourseImageEditor({ course, open, onOpenChange, onSave }: CourseImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  const drawImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = Math.min(600 / img.width, 400 / img.height);
    const w = img.width * scale;
    const h = img.height * scale;

    canvas.width = 600;
    canvas.height = 400;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 600, 400);
    ctx.drawImage(img, (600 - w) / 2, (400 - h) / 2, w, h);

    imageRef.current = img;
    setImageLoaded(true);
  }, []);

  const loadImageFromSrc = useCallback((src: string, crossOrigin = false) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.onload = () => drawImageToCanvas(img);
    img.src = src;
  }, [drawImageToCanvas]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) loadImageFromSrc(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMediaSelect = (imageUrl: string, mediaItem: any) => {
    loadImageFromSrc(imageUrl, true);
    toast({
      title: "Image Loaded",
      description: `"${mediaItem.original_name}" has been loaded into the editor.`,
    });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    imageRef.current = null;
    setImageLoaded(false);
    toast({ title: "Canvas Cleared", description: "All content has been removed." });
  };

  const handleReset = () => {
    if (imageRef.current) drawImageToCanvas(imageRef.current);
    toast({ title: "Image Reset", description: "Canvas has been reset to the original image." });
  };

  const handleSave = async () => {
    if (!canvasRef.current || !course) return;
    setIsLoading(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current!.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed"))), "image/png", 0.9);
      });
      if (onSave) await onSave(course.id, blob);
      toast({ title: "Image Saved", description: `Course image for "${course.title}" saved.` });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving image:", error);
      toast({ title: "Save Failed", description: "Failed to save the course image.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !course) return;
    const link = document.createElement("a");
    link.download = `${course.id}-image.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Image Downloaded", description: "Course image downloaded." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Course Image</DialogTitle>
          <DialogDescription>
            {course ? `Editing image for "${course.title}"` : "Course Image Editor"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 max-h-[70vh] overflow-hidden">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="media">Media Library</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Course Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Select an image from your media library.
                </div>
                <Button onClick={() => setShowMediaSelector(true)} className="w-full" variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Browse Media Library
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap border-b pb-4">
            <div className="flex gap-2 ml-auto">
              {imageLoaded && (
                <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
              )}
              <Button variant="outline" size="sm" onClick={handleClear}>
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex justify-center items-center bg-muted rounded-lg p-4 overflow-auto">
            <div className="border border-border rounded-lg shadow-lg bg-background">
              <canvas ref={canvasRef} width={600} height={400} className="max-w-full max-h-full" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Image"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <MediaSelector
        open={showMediaSelector}
        onOpenChange={setShowMediaSelector}
        onSelectImage={handleMediaSelect}
      />
    </Dialog>
  );
}
