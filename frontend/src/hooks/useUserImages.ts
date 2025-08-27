// import { useMemo } from "react";
// import { useGetImagesQuery } from "@/api/endpoints/images";

// export const useUserImages = (userIdImage: { userId: string }[]) => {
//   const { data: imagesData = [], isLoading } = useGetImagesQuery(userIdImage, {
//     skip: userIdImage.length === 0,
//   });

//   const imageMap = useMemo(() => {
//     const map: Record<string, string> = {};
//     imagesData.forEach((img: { userId: string; imageData: Blob }) => {
//       map[img.userId] = URL.createObjectURL(img.imageData);
//     });
//     return map;
//   }, [imagesData]);

//   return { imageMap, isLoading };
// };
