import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import styles from "./style.module.css";
import {
  useDeleteProfileImageMutation,
  useGetProfileImageQuery,
  useUploadProfileImageMutation,
} from "@/api/endpoints/images";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setUser } from "@/store/features/authSlice";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { t } from "i18next";
import { useUpdateUserInfoMutation } from "@/api/endpoints/user";
import UserImage from "../UserImage/UserImage";

const ProfileSettings = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const [uploadProfileImage] = useUploadProfileImageMutation();
  const [deleteProfileImage] = useDeleteProfileImageMutation();

  console.log(user?.imagePath);

  const [updateUserInfo] = useUpdateUserInfoMutation();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");

  const [confirmDialog, setConfirmDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isChanged = useMemo(() => {
    return (
      firstName !== (user?.firstName ?? "") ||
      lastName !== (user?.lastName ?? "")
    );
  }, [firstName, lastName, user]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadProfileImage(formData).unwrap();
      const { imageUrl } = response;

      if (user) {
        dispatch(
          setUser({
            ...user,
            imagePath: imageUrl,
          })
        );
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfileImage().unwrap();
      setConfirmDialog(false);
      if (user) {
        dispatch(
          setUser({
            ...user,
            imagePath: null,
          })
        );
      }
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleCancel = () => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUserInfo({
        firstName,
        lastName,
      }).unwrap();
      dispatch(setUser(updatedUser));
    } catch (err) {
      console.error("Error updating user info: ", err);
    }
  };

  return (
    <div className={styles["profile-settings"]}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Divider sx={{ width: "100%", mb: 4 }} />

      <div className={styles["profile-row"]}>
        <UserImage
          imagePath={user?.imagePath ?? ""}
          sx={{ width: 100, height: 100 }}
        />
        <div className={styles["profile-buttons"]}>
          <button
            className={styles["button-delete"]}
            onClick={() => setConfirmDialog(true)}
            disabled={!user?.imagePath}
          >
            Delete picture
          </button>

          <label htmlFor="upload-photo">
            <input
              accept="image/*"
              id="upload-photo"
              type="file"
              hidden
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <div className={styles["button-save"]}>Upload new picture</div>
          </label>
        </div>
      </div>

      <Typography
        variant="h6"
        alignSelf="flex-start"
        gutterBottom
        sx={{ marginBottom: 3 }}
      >
        Full Name
      </Typography>
      <div className={styles["profile-fullName"]}>
        <TextField
          label="First Name"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          slotProps={{ input: { sx: { fontSize: "15px", height: "45px" } } }}
        />
        <TextField
          label="Last Name"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          slotProps={{ input: { sx: { fontSize: "15px", height: "45px" } } }}
        />
      </div>

      <Divider sx={{ width: "100%", mb: 4 }} />

      <Typography variant="h6" alignSelf="flex-start" gutterBottom>
        Email
      </Typography>
      <div className={styles["profile-email-status"]}>
        <TextField
          value={user?.email ?? ""}
          fullWidth
          disabled
          slotProps={{ input: { sx: { fontSize: "15px", height: "45px" } } }}
        />
      </div>

      <Divider sx={{ width: "100%", mb: 4 }} />

      <Typography variant="h6" alignSelf="flex-start" gutterBottom>
        Status
      </Typography>
      <div className={styles["profile-email-status"]}>
        <TextField
          value={user?.role ?? ""}
          fullWidth
          disabled
          slotProps={{ input: { sx: { fontSize: "15px", height: "45px" } } }}
        />
      </div>

      <Divider sx={{ width: "100%", mb: 4 }} />

      <div className={styles["profile-buttons"]}>
        <button
          className={styles["button-delete"]}
          onClick={handleCancel}
          disabled={!isChanged}
        >
          Cancel
        </button>
        <button
          className={styles["button-save"]}
          onClick={handleSave}
          disabled={!isChanged}
        >
          Save
        </button>
      </div>

      {confirmDialog && (
        <ConfirmDialog
          title={t("dialog.deletePictureTitle")}
          message={t("dialog.deletePicture")}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
