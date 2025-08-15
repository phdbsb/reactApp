import { useGetProfileImageQuery } from "@/api/endpoints/images";
import { Avatar, SxProps } from "@mui/material";
import { useMemo } from "react";

interface ImageProps {
  imagePath: string;
  sx: SxProps;
}

const UserImage = ({ imagePath, sx }: ImageProps) => {
  
  const { data: blob } = useGetProfileImageQuery(imagePath);

  const avatarUrl = useMemo(() => {
    return blob ? URL.createObjectURL(blob) : undefined;
  }, [blob]);

  return <Avatar src={avatarUrl} sx={sx} />;
  
};

export default UserImage;
