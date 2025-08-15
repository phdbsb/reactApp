import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { UserDisplay } from "@/api/endpoints/user/types";
import { UserRole } from "@/api/endpoints/auth/types";
import styles from "./style.module.css";

type RoleCellProps = {
  user: UserDisplay;
  editedRole?: UserRole;
  onRoleChange: (newRole: UserRole) => void;
};

const RoleCell = ({ user, editedRole, onRoleChange }: RoleCellProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentRole = editedRole ?? user.role;

  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeRole = async (newRole: UserRole) => {
    if (newRole !== currentRole) {
      onRoleChange(newRole);
    }
    handleClose();
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        position: "relative",
        "&:hover .dropdown-icon": {
          opacity: 1,
        },
      }}
    >
      <Typography variant="body2" fontWeight={500}>
        {currentRole}
      </Typography>
      <IconButton
        size="small"
        onClick={handleOpen}
        className="dropdown-icon"
        sx={{
          padding: 0,
          opacity: 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <ArrowDropDownIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: "var(--table-row-hover)",
                }
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleChangeRole(UserRole.Student)}
          selected={currentRole === UserRole.Student}
        >
          Student
        </MenuItem>
        <MenuItem
          onClick={() => handleChangeRole(UserRole.Professor)}
          selected={currentRole === UserRole.Professor}
        >
          Professor
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default RoleCell;
