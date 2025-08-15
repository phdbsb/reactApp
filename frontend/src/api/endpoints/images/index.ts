import { baseApi } from "@/api";
import { ImageUrl, UserData64, UserImagesBlob } from "./type";

export const imageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileImage: builder.query<Blob, string>({
      query: (imagePath) => ({
        url: `images?imagePath=${encodeURIComponent(imagePath)}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["ProfileImages"],
    }),

    getImages: builder.query<UserImagesBlob[], UserData64[]>({
      query: (imagePaths) => ({
        url: "/images/get-images",
        method: "POST",
        body: imagePaths,
        responseHandler: async (response) => {
          const data: UserData64[] = await response.json();
          return data.map((item) => {
            const byteChars = atob(item.imageData);
            const byteNums = new Array(byteChars.length)
              .fill(0)
              .map((_, i) => byteChars.charCodeAt(i));
            const byteArray = new Uint8Array(byteNums);
            const blob = new Blob([byteArray], { type: "image/jpeg" });
            return { userId: item.userId, imageData: blob };
          });
        },
      }),
      providesTags: ["UserIdImg"],
    }),

    uploadProfileImage: builder.mutation<ImageUrl, FormData>({
      query: (formData) => ({
        url: "/images/upload-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ProfileImages", "CurrentUser"],
    }),

    deleteProfileImage: builder.mutation<void, void>({
      query: () => ({
        url: "/images/delete-image",
        method: "DELETE",
      }),
      invalidatesTags: ["ProfileImages", "CurrentUser"],
    }),
  }),
});

export const {
  useGetProfileImageQuery,
  useGetImagesQuery,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
} = imageApi;
