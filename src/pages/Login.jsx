import React from "react";
import AuthSwitch from "../components/ui/auth-switch";

const Login = ({ initialMode = "sign-in" }) => {
   return <AuthSwitch initialMode={initialMode} />;
};

export default Login;