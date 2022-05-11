import { useFormik, Formik, Form, Field } from "formik";
import * as yup from "yup";

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
import { makeSignUpCall } from "../../../utils";
const theme = createTheme();

const validationSchema = yup.object({
  firstName: yup
    .string("Enter your first name")
    .required("First name is required")
    .min(3, "Minimum 3 characters"),
  lastName: yup
    .string("Enter your last name")
    .required("Last name is required")
    .min(3, "Minimum 3 characters"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character. I am sorry guys LMAO."
    ),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const SignUp = () => {
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      password_confirm: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let user = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        password_confirm: values.password_confirm,
      };

      makeSignUpCall(user).then((jwt) => {
        if (jwt.status === 201) {
          document.cookie = `jwt=${jwt.data.data.token}`;
          document.cookie = `userId=${jwt.data.data.user._id}`;
          window.location = "/";
        } else {
          setError(jwt.response.data.message);
        }
      });
    },
  });

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
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <Box noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={formik.handleChange}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password_confirm"
                  label="Password Cofirm"
                  type="password"
                  id="password_confirm"
                  autoComplete="new-password"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password_confirm &&
                    Boolean(formik.errors.password_confirm)
                  }
                  helperText={
                    formik.touched.password_confirm &&
                    formik.errors.password_confirm
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={formik.handleSubmit}
            >
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  Already have an account? Sign in
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
