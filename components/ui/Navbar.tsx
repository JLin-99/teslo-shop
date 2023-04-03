import { useContext, useState } from "react";

import NextLink from "next/link";
import { useRouter } from "next/router";

import {
  Button,
  AppBar,
  Link,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Input,
  InputAdornment,
} from "@mui/material";
import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { UIContext } from "@/context";

export const Navbar = () => {
  const { asPath, push } = useRouter();
  const { toggleSideMenu } = useContext(UIContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (!searchTerm.trim().length) return;
    push(`/search/${searchTerm}`);
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Teslo</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box
          sx={{
            display: isSearchVisible ? "none" : { xs: "none", sm: "block" },
          }}
        >
          <NextLink href="/category/men" passHref legacyBehavior>
            <Link>
              <Button color={asPath === "/category/men" ? "primary" : "info"}>
                Men
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref legacyBehavior>
            <Link>
              <Button color={asPath === "/category/women" ? "primary" : "info"}>
                Women
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Link>
              <Button color={asPath === "/category/kid" ? "primary" : "info"}>
                Kids
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        {isSearchVisible ? (
          <Input
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
            className="fadeIn"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
            onBlur={() => setIsSearchVisible(false)}
            type="text"
            placeholder="Search..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            sx={{ display: { xs: "none", sm: "flex" } }}
            onClick={() => setIsSearchVisible(true)}
            className="fadeIn"
          >
            <SearchOutlined />
          </IconButton>
        )}

        <IconButton
          sx={{ display: { xs: "flex", sm: "none" } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
