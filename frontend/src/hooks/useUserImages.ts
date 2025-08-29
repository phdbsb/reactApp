import { useMemo } from "react";
import { useGetImagesQuery } from "@/api/endpoints/images";
import { UserData64 } from "@/api/endpoints/images/type";

export const useUserImages = (userIdImage: UserData64[] = []) => {
  const { data: imagesData = [], isLoading } = useGetImagesQuery(userIdImage, {
    skip: userIdImage.length === 0,
  });

  const imageMap = useMemo(() => {
    const map: Record<string, string> = {};
    imagesData.forEach((img: { userId: string; imageData: Blob }) => {
      map[img.userId] = URL.createObjectURL(img.imageData);
    });
    return map;
  }, [imagesData]);

  return { imageMap, isLoading };
};
