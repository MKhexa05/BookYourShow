import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="relative hidden md:flex flex-col bg-linear-to-bl from-blue-200 via-white  to-blue-200 px-14 py-12">
        {/* Logo */}
        <div className="flex items-start">
          <img
            src={"/cinema-logo.png"} // <-- update path
            alt="Cinemas Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Center Text */}
        <div className="flex flex-1 items-center">
          <div className="max-w-lg">
            <h1 className="text-4xl font-light text-[#0B3C5D] leading-tight">
              Welcome.
            </h1>

            <p className="mt-4 text-4xl italic font-light text-[#0B3C5D] leading-snug">
              Begin your cinematic adventure now with our ticketing platform!
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      {isRegister ? (
        <Register setIsRegister={setIsRegister} />
      ) : (
        <Login setIsRegister={setIsRegister} />
      )}
    </div>
  );
};

export default Auth;
