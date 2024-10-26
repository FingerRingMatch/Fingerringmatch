// hooks/useImageManagement.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/hooks/use-toast';

interface UploadedImage {
  id: string;
  imageUrl: string;
  createdAt: string;
  order: number;
}

interface UploadProgressCallback {
  (progress: number): void;
}

export const useImageManagement = () => {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  // Helper function to make authenticated requests
  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ) => {
    const token = await getIdToken();
    if (!token) throw new Error('Not authenticated');

    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // Fetch images on mount
  useEffect(() => {
    const fetchImages = async () => {
      if (!user) return;
      setLoading(true);
      
      try {
        const response = await makeAuthenticatedRequest('/api/images');
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error);
        
        console.log('Fetched images:', data.images); // Log fetched images
  
        const sortedImages = data.images.sort((a: UploadedImage, b: UploadedImage) => 
          (a.order ?? Infinity) - (b.order ?? Infinity) || 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setImages(sortedImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
        toast({
          variant: "destructive",
          title: "Error",
          description: err instanceof Error ? err.message : 'Failed to fetch images',
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchImages();
  }, [user]);
  
  const uploadImages = async (files: File[], onProgress?: UploadProgressCallback) => {
    if (!user) {
      setError('You must be logged in to upload images');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      // Simulate upload progress if no actual progress events are available
      let progressInterval: NodeJS.Timeout;
      if (onProgress) {
        let progress = 0;
        progressInterval = setInterval(() => {
          progress = Math.min(progress + 10, 90);
          onProgress(progress);
        }, 500);
      }
      
      const response = await makeAuthenticatedRequest('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (onProgress) {
        clearInterval(progressInterval!);
        onProgress(100);
      }

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      // Add new images with order values
      const newImages = data.images.map((img: UploadedImage, index: number) => ({
        ...img,
        order: images.length + index
      }));
      
      setImages(prev => [...prev, ...newImages]);
      
      toast({
        title: "Success",
        description: `Successfully uploaded ${files.length} image${files.length > 1 ? 's' : ''}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to upload images',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    setImageToDelete(imageId);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    setLoading(true);
    setError(null);

    try {
      const response = await makeAuthenticatedRequest(`/api/images/${imageToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setImages(prev => prev.filter(img => img.id !== imageToDelete));
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to delete image',
      });
    } finally {
      setLoading(false);
      setImageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setImageToDelete(null);
  };

  const reorderImages = async (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;

    try {
      // Create new array with reordered images
      const reorderedImages = Array.from(images);
      const [movedImage] = reorderedImages.splice(sourceIndex, 1);
      reorderedImages.splice(destinationIndex, 0, movedImage);

      // Update local state immediately for optimistic update
      setImages(reorderedImages);

      // Prepare the reorder data
      const reorderData = {
        imageId: movedImage.id,
        sourceIndex,
        destinationIndex
      };

      // Make API request to update order in the backend
      const response = await makeAuthenticatedRequest('/api/images/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reorderData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (err) {
      // Revert to original order if there's an error
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder images. Please try again.",
      });
      
      // Fetch images again to ensure correct order
      const response = await makeAuthenticatedRequest('/api/images');
      const data = await response.json();
      if (response.ok) {
        setImages(data.images);
      }
    }
  };

  return {
    images,
    loading,
    error,
    uploadImages,
    deleteImage,
    confirmDelete,
    cancelDelete,
    reorderImages,
    isDeleteDialogOpen: !!imageToDelete
  };
};