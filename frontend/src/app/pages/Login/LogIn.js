import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Logo } from "../../../images/Logo";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme();

export const LogIn = () => {
  const [error, setError] = useState(null);

  const logInCall = async (user) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        user
      );
      console.log(response)
      return response;
    } catch (error) {
      return error;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userInput = new FormData(event.currentTarget);

    let user = {
      email: userInput.get("email"),
      password: userInput.get("password"),
    };

    logInCall(user).then((jwt) => {
      if (jwt.status === 200) {
        document.cookie = `jwt=${jwt.data.data.token}`;
        document.cookie = `userId=${jwt.data.data.user._id}`;
        window.location = "/";
      } else {
        setError(jwt.response.data.message);
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link href="/" variant="body2">
            <Avatar
              style={{
                background: "white",
                borderRadius: "0px",
                width: "45px",
                height: "45px",
              }}
            >
              <Logo />
            </Avatar>
          </Link>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
                    window.location.href = "/signup";
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Typography variant="body2" style={{ color: "red" }} align="center">
          {error}
        </Typography>
      </Container>
    </ThemeProvider>
  );
};
