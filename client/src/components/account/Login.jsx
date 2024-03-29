import React, { useState, useContext } from "react";

import { TextField, Box, Button, Typography, styled } from "@mui/material";

import { API } from "../../service/api";
import { DataContext } from "../../context/DataProvider";
import { useNavigate } from "react-router-dom";

const Component = styled(Box)(({ theme }) => ({
  width: "400px",
  margin: "auto",
  boxShadow: "5px 2px 5px 2px rgb(0 0 0/ 0.6)",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const Image = styled("img")({
  width: 100,
  display: "flex",
  margin: "auto",
  padding: "50px 0 0",
});

const Wrapper = styled(Box)`
  padding: 25px 35px;
  display: flex;
  flex: 1;
  overflow: auto;
  flex-direction: column;
  & > div,
  & > button,
  & > p {
    margin-top: 20px;
  }
`;

const LoginButton = styled(Button)`
  text-transform: none;
  background: #fb641b;
  color: #fff;
  height: 48px;
  border-radius: 2px;
`;

const SignupButton = styled(Button)`
  text-transform: none;
  background: #fff;
  color: #2874f0;
  height: 48px;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
`;

const Text = styled(Typography)`
  color: #878787;
  font-size: 12px;
`;

const Error = styled(Typography)`
  font-size: 10px;
  color: #ff6161;
  line-height: 0;
  margin-top: 10px;
  font-weight: 600;
`;

const loginInitialValues = {
  username: "",
  password: "",
};

const signupInitialValues = {
  name: "",
  username: "",
  password: "",
};
const Login = ({ isUserAuthenticated }) => {
  const navigate = useNavigate();
  const imageURL =
    "https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png";
  const [account, toggleAccount] = useState("login");
  const [signup, setSignup] = useState(signupInitialValues);
  const [error, showError] = useState("");
  const [login, setLogin] = useState(loginInitialValues);

  const { setAccount } = useContext(DataContext);

  const toggleSignup = () => {
    account === "signup" ? toggleAccount("login") : toggleAccount("signup");
  };

  const onInputChange = (e) => {
    console.log(e.target.name, e.target.value);
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const signupUser = async () => {
    let response = await API.userSignup(signup);
    if (response.isSuccess) {
      showError("");
      setSignup(signupInitialValues);
      toggleAccount("login");
    } else {
      showError("Something went wrong! please try again later");
    }
  };

  const onValueChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    let response = await API.userLogin(login);
    if (response.isSuccess) {
      showError("");

      sessionStorage.setItem(
        "accessToken",
        `Bearer ${response.data.accessToken}`
      );
      sessionStorage.setItem(
        "refreshToken",
        `Bearer ${response.data.refreshToken}`
      );

      setAccount({
        username: response.data.username,
        name: response.data.name,
      });
      isUserAuthenticated(true);
      navigate("/");
    } else {
      showError("Something went wrong! please try again later");
    }
  };

  return (
    <Component>
      <Box>
        <Image src={imageURL} alt="blog" />

        {account === "login" ? (
          <Wrapper>
            <TextField
              variant="standard"
              name="username"
              label="Enter Username"
              value={login.username}
              onChange={(e) => onValueChange(e)}
            />
            <TextField
              variant="standard"
              name="password"
              label="Enter Password"
              value={login.password}
              onChange={(e) => onValueChange(e)}
            />
            {error && <Error>{error}</Error>}
            <LoginButton variant="contained" onClick={() => loginUser()}>
              Login
            </LoginButton>
            <Text style={{ textAlign: "center" }}>OR</Text>
            <SignupButton
              style={{ marginBottom: 50 }}
              onClick={() => toggleSignup()}
            >
              Create an account
            </SignupButton>
          </Wrapper>
        ) : (
          <Wrapper>
            <TextField
              variant="standard"
              name="name"
              label="Enter Name"
              onChange={(e) => onInputChange(e)}
            />
            <TextField
              variant="standard"
              name="username"
              label="Enter Username"
              onChange={(e) => onInputChange(e)}
            />
            <TextField
              variant="standard"
              name="password"
              label="Enter Password"
              onChange={(e) => onInputChange(e)}
            />
            {error && <Error>{error}</Error>}

            <SignupButton onClick={() => signupUser()}>Signup</SignupButton>
            <Text style={{ textAlign: "center" }}>OR</Text>
            <LoginButton variant="contained" onClick={() => toggleSignup()}>
              Already have an account
            </LoginButton>
          </Wrapper>
        )}
      </Box>
    </Component>
  );
};

export default Login;
