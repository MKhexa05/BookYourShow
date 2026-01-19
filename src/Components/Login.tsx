import React, { useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";
import { validateEmail } from "../utils/validateEmail";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUserAuth from "../hooks/useUserAuth";

type LoginProps = {
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = (props: LoginProps) => {
  useUserAuth()
  const { setIsRegister } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!validateEmail(email)) {
      setError("Write a valid email");
      return;
    }
    if (!password) {
      setError("Write a strong password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });
      const { accessToken } = response.data.data;
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        toast.success("Login Successful")
        // console.log(accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Something went wrong", error.response.data.message);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-md">
        <h4 className="text-2xl font-semibold text-gray-900 mb-8">
          Login to your account
        </h4>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>

            <input
              type="text"
              placeholder="balamia@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1090DF]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1090DF]"
            />
          </div>

          <div>
            <p className="block text-sm text-red-600 mb-1 ">{error}</p>
          </div>

          {/* Button */}
          <button
            className={`w-full rounded-md border border-[#1090DF] py-2 text-[#1090DF] font-medium hover:bg-[#1090DF] hover:text-white transition duration-200 hover:cursor-pointer ${
              loading ? "disabled" : ""
            }`}
            onClick={handleLogin}
          >
            {loading ? <p>Loging In </p> : <p>Login</p>}
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-400 ">
            Don't Have An Account?{" "}
            <button
              onClick={() => {
                setIsRegister(true);
              }}
              className="text-[#1090DF] hover:underline cursor-pointer"
            >
              Register Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
