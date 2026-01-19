import { useState } from "react";
import { validateEmail } from "../utils/validateEmail";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";
import useUserAuth from "../hooks/useUserAuth";
import { validatePassword } from "../utils/validatePassword";
type RegisterProps = {
  setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

const Register = (props: RegisterProps) => {
  useUserAuth();

  const { setIsRegister } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!firstName) {
      setError("Write your first name");
      return;
    }
    if (!lastName) {
      setError("Write your last name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Write a valid email");
      return;
    }
    if (!validatePassword(password).isValid) {
      setError(`Write a strong password: ${validatePassword(password).errors}`);
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        firstName,
        lastName,
        email,
        password,
      });
      if (response.data) {
        console.log(response.data.message);
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
            <label className="block text-sm text-gray-600 mb-1">
              First name
            </label>

            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1090DF]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Last name
            </label>

            <input
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1090DF]"
            />
          </div>

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
            onClick={handleRegister}
          >
            {loading ? <p>Signing Up </p> : <p>Register</p>}
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-400">
            Already have an account ?{" "}
            <button
              onClick={() => {
                setIsRegister(false);
              }}
              className="text-[#1090DF] hover:underline hover:cursor-pointer"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
