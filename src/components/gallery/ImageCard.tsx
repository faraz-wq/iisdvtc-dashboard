import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Image } from "lucide-react";
import { GalleryImage } from "@/types/gallery";
import { useToast } from "@/components/ui/use-toast";

interface ImageCardProps {
  image: GalleryImage;
  onEdit: (image: GalleryImage) => void;
  onDelete: (id: string) => void;
}

const ImageCard = ({ image, onEdit, onDelete }: ImageCardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setIsLoading(true);
      try {
        if (image._id) {
          await onDelete(image._id);
          toast({
            title: "Success",
            description: "Image deleted successfully",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete image",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image.src ? (
          <img
            src={image.src}
            alt={image.alt || image.title}
            className="object-cover w-full h-full transition-all hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
            <Image className="w-12 h-12" />
          </div>
        )}
      </div>
      <CardContent className="flex-grow p-4">
        <h3 className="font-medium text-lg line-clamp-1">{image.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {image.description}
        </p>
        <div className="mt-2">
          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {image.category}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(image)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;