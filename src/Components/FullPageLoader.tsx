const FullPageLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FBFF]">
      {/* Spinner */}
      <div className="h-10 w-10 border-4 border-[#1090DF]/30 border-t-[#1090DF] rounded-full animate-spin mb-4" />

      {/* Text */}
      <p className="text-sm text-gray-500 animate-pulse">
        Checking authentication…
      </p>
    </div>
  );
};

export default FullPageLoader;
