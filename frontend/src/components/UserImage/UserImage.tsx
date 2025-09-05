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

  // TODO daj takodje alt avataru i to nek bude korisnicko ime, ako nema profilnu pisace prvo pocetno slovo
  // TODO takodje mozes da das i boju, randomizuj to, npr niz od random boje napravi ovde i odaberi random izmedju tih boja, u zavisnosti od pocetnog slova
  return <Avatar alt={"Mihailo P"} src={avatarUrl} sx={sx} />;
};

export default UserImage;
