import { useState } from 'react';
import { Trash2, Loader2, Eye, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { useImageManagement } from '@/hooks/useImageManagement';
import { cn } from '@/lib/utils';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export function ImageGrid() {
  const { images, loading, error, deleteImage, reorderImages } = useImageManagement();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const handleDeleteClick = (imageId: string) => {
    setImageToDelete(imageId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    console.log(imageToDelete);
    if (imageToDelete) {
      await deleteImage(imageToDelete);
      
      setShowDeleteDialog(false);
      setImageToDelete(null);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return; // Dropped outside of the list

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Reorder images if the indices are different
    if (sourceIndex !== destinationIndex) {
      reorderImages(sourceIndex, destinationIndex);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading && images.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-sm mx-auto space-y-4">
          <div className="rounded-full bg-gray-100 p-4 w-16 h-16 mx-auto flex items-center justify-center">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold">No images yet</h3>
          <p className="text-gray-500">
            Upload your first image to get started with your photo gallery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "transition-transform",
                        snapshot.isDragging && "scale-105"
                      )}
                    >
                      <Card className="relative group hover:shadow-lg">
                        <CardContent className="p-2">
                          <div 
                            {...provided.dragHandleProps}
                            className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <GripVertical className="h-5 w-5 text-white drop-shadow-md" />
                          </div>
                          <div className="relative aspect-square">
                            <img
                              src={image.imageUrl}
                              alt="Uploaded"
                              className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteClick(image.id)}
                                className="h-9 w-9"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
