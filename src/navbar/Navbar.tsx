import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { colors } from "../strings/colors";
import {
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { navbarStrings } from "./strings/navbarStrings";
import { useNavigate } from "react-router";
import { AuthContext } from "../auth/context/AuthContext";
import { useContext, useState } from "react";
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onNavigate = (page: string) => {
    navigate(page);
  };

  const handleScrollToFooter = () => {
    const footerElement = document.getElementById(navbarStrings.pages[4].page);
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const NavButton = styled(Button)(({ theme }) => ({
    color: colors.yellowText,
    marginRight: theme.spacing(2),
    "&:hover": {
      color: colors.heroSecondaryButtonBorderHover,
    },
  }));

  // Lógica para para abrir/cerrar el Drawer
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const renderNavLinks = (isDrawer = false) => (
    <>
      <NavButton
        color="inherit"
        sx={{ minWidth: "fit-content" }}
        onClick={() => {
          onNavigate(navbarStrings.pages[0].page);
          if (isDrawer) setDrawerOpen(false);
        }}
      >
        {navbarStrings.pages[0].label}
      </NavButton>
      <NavButton
        color="inherit"
        sx={{ minWidth: "fit-content" }}
        onClick={() => {
          onNavigate(navbarStrings.pages[1].page);
          if (isDrawer) setDrawerOpen(false);
        }}
      >
        {navbarStrings.pages[1].label}
      </NavButton>
      {user ? (
        <NavButton
          color="inherit"
          sx={{ minWidth: "fit-content" }}
          onClick={() => {
            onNavigate(navbarStrings.pages[2].page);
            if (isDrawer) setDrawerOpen(false);
          }}
        >
          {navbarStrings.pages[2].label}
        </NavButton>
      ) : (
        <></>
      )}
      {user?.role === "admin" ? (
        <NavButton
          color="inherit"
          sx={{ minWidth: "fit-content" }}
          onClick={() => {
            onNavigate(navbarStrings.pages[3].page);
            if (isDrawer) setDrawerOpen(false);
          }}
        >
          {navbarStrings.pages[3].label}
        </NavButton>
      ) : (
        <></>
      )}
      <NavButton
        color="inherit"
        sx={{ minWidth: "fit-content" }}
        onClick={() => {
          handleScrollToFooter();
          if (isDrawer) setDrawerOpen(false);
        }}
      >
        {navbarStrings.pages[4].label}
      </NavButton>
      {user ? (
        <Tooltip title="Opciones de cuenta">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              {user.firstName ? (
                user.firstName[0].toUpperCase()
              ) : (
                <PersonIcon />
              )}
            </Avatar>
            <Typography
              variant="button"
              sx={{ ml: 1, color: colors.yellowText }}
            >
              {`${navbarStrings.greetings.label} ${user.firstName} ${user.lastName}`}
            </Typography>
          </IconButton>
        </Tooltip>
      ) : (
        <NavButton
          variant="outlined"
          onClick={() => {
            onNavigate("/login");
            if (isDrawer) setDrawerOpen(false);
          }}
          sx={{
            borderColor: colors.heroSecondaryButtonBorderColor,
            borderWidth: colors.heroSecondaryButtonBorderColor,
            "&:hover": {
              borderColor: colors.heroSecondaryButtonBorderHover,
              color: colors.heroSecondaryButtonBorderHover,
            },
          }}
        >
          {navbarStrings.loginButton.label}
        </NavButton>
      )}
    </>
  );

  // Lógica para el menú desplegable del usuario
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    logout();
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: colors.navbarBackground, px: "4%", overflow: "hidden" }}
    >
      <Toolbar>
        <Box
          sx={{
            flexGrow: {
              xs: 1,
              md: 0,
            },
            justifyContent: { xs: "center", md: "flex-start" },
            width: { xs: "auto", md: "100%" },
            display: "flex",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label={navbarStrings.pages[0].label}
            onClick={() => onNavigate(navbarStrings.pages[0].page)}
            sx={{ borderRadius: "0px", mr: {md: 12} }}
          >
            <img
              src={navbarStrings.logo.src}
              alt={navbarStrings.logo.alt}
              style={{ height: "40px", cursor: "pointer" }}
            />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            width: "100%",
          }}
        >
          {renderNavLinks()}
        </Box>

        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ ml: 2, display: { xs: "flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Menú desplegable del usuario */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: colors.navbarBackground,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: colors.navbarBackground,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            navigate(navbarStrings.profileLink.page);
          }}
          sx={{
            color: colors.yellowText,
            ":hover": { bgcolor: "#eeeeee15" },
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: colors.yellowText }} />
          </ListItemIcon>
          {navbarStrings.profileLink.label}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: colors.yellowText,
            ":hover": { bgcolor: "#eeeeee15" },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: colors.yellowText }} />
          </ListItemIcon>
          {navbarStrings.logoutButton.label}
        </MenuItem>
      </Menu>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: colors.navbarBackground,
            width: "250px",
          },
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navbarStrings.pages.map((page) => (
              <ListItem key={page.id} disablePadding>
                {page.id === "myFlatsLink" && !user ? null : (
                  <ListItemButton
                    onClick={() => {
                      if (page.id === "aboutUsLink") {
                        handleScrollToFooter();
                      } else {
                        onNavigate(page.page);
                        setDrawerOpen(false);
                      }
                    }}
                  >
                    <ListItemText
                      primary={page.label}
                      sx={{ color: colors.yellowText }}
                    />
                  </ListItemButton>
                )}
              </ListItem>
            ))}

            {user ? (
              <>
                <Divider sx={{ bgcolor: "rgba(255,255,255,0.12)" }} />
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(navbarStrings.profileLink.page);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{ width: 24, height: 24, bgcolor: "primary.main" }}
                      >
                        {user.firstName ? (
                          user.firstName[0].toUpperCase()
                        ) : (
                          <PersonIcon />
                        )}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={`${navbarStrings.greetings.label} ${user.firstName} ${user.lastName}`}
                      sx={{ color: colors.yellowText }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout
                        fontSize="small"
                        sx={{ color: colors.yellowText }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={navbarStrings.logoutButton.label}
                      sx={{ color: colors.yellowText }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <Divider sx={{ bgcolor: "rgba(255,255,255,0.12)" }} />
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onNavigate("/login");
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText
                      primary={navbarStrings.loginButton.label}
                      sx={{ color: colors.yellowText }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
