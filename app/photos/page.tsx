// app/images/page.tsx
"use client";

import { ImagesUploader } from "@/components/images/ImagesUploader";
import { ImageGrid } from "@/components/images/ImageGrid";
import { Grid, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function ImagesPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 max-w-6xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Photo Gallery</h1>
          <p className="text-muted-foreground">
            Upload and organize your photos in one place
          </p>
        </div>

        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="grid w-full mx-auto grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="gallery" className="space-x-2">
              <Grid className="h-4 w-4" />
              <span>Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            <ImageGrid />
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardContent className="pt-6">
                <ImagesUploader />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}