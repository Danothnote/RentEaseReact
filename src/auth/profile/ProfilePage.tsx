import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { profileStrings } from "./strings/profileStrings";
import { colors } from "../../strings/colors";
import { AuthContext } from "../context/AuthContext";
import { ProfileItem } from "./components/ProfileItem";
import { useContext, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { uploadImageAndGetUrl } from "../../newFlat/services/imageUploadService";

export const ProfilePage = () => {
  const { user, deleteAccount, passwordReset } = useContext(AuthContext);
  const { updateDocument, loading, error, success } = useUpdateDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePassword = () => {
    passwordReset();
  };

  const handleFieldUpdateSuccess = (
    updatedFieldId: string,
    updatedValue: any
  ) => {
    if (!user) return;

    const updatedUser = { ...user };

    if (updatedFieldId === "birthday") {
      updatedUser.birthday = moment.isMoment(updatedValue)
        ? updatedValue
        : moment(updatedValue as string);
    } else {
      (updatedUser as any)[updatedFieldId] = updatedValue;
    }
  };

  const getUserValue = (fieldId: string) => {
    switch (fieldId) {
      case "username":
        return user?.username;
      case "firstName":
        return user?.firstName;
      case "lastName":
        return user?.lastName;
      case "birthday":
        return user?.birthday;
      case "email":
        return user?.email;
      default:
        return undefined;
    }
  };

  const handleEditAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadImageAndGetUrl(file, "profilePictures", user!.uid);
      const data = {profilePicture: url}
      await updateDocument("users", user!.uid, data);
    }
  };

  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        backgroundImage: `url(${profileStrings.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        minHeight: "93vh",
        textAlign: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.heroImageOverlay,
          zIndex: 1,
        },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 2,
          width: { xs: "70%" },
          maxWidth: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: colors.transparentWhite,
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold", color: colors.titleColor }}
        >
          {profileStrings.title}
        </Typography>

        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid
            sx={{
              xs: 12,
              sm: 6,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              mx: 3,
              my: 3,
              position: "relative",
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Avatar
              alt={user?.username}
              src={user?.profilePicture}
              sx={{
                width: "180px",
                height: "180px",
                bgcolor: colors.navbarBackground,
              }}
            ></Avatar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleEditAvatarClick}
              sx={{
                ml: 1,
                mb: 1,
                position: "absolute",
                bottom: -5,
                right: 15,
                bgcolor: colors.grey,
                ":hover": {
                  bgcolor: colors.transparentWhite,
                },
              }}
            >
              <EditIcon sx={{ color: colors.titleColor }} />
            </IconButton>
          </Grid>

          <Grid
            sx={{
              xs: 12,
              sm: 6,
              display: "flex",
              flexDirection: "column",
              mx: 3,
              my: 3,
            }}
          >
            {profileStrings.right.map((field) => (
              <ProfileItem
                key={field.id}
                field={field}
                currentValue={getUserValue(field.id!!)}
                userId={user?.uid || ""}
                onUpdateSuccess={handleFieldUpdateSuccess}
              />
            ))}
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              my: 2,
              mx: 2,
              color: colors.primaryButtonTextColor,
              backgroundColor: colors.primaryButtonBackground,
              "&:hover": {
                backgroundColor: colors.primaryButtonHover,
              },
            }}
            onClick={handlePassword}
          >
            {profileStrings.primaryButton}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              my: 2,
              mx: 2,
              borderWidth: colors.secondaryButtonBorderWidth,
              borderColor: colors.deleteButtonBorderColor,
              color: colors.deleteButtonTextColor,
              "&:hover": {
                backgroundColor: colors.deleteButtonBackgroundHover,
              },
            }}
            onClick={deleteAccount}
          >
            {profileStrings.secondaryButton}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
