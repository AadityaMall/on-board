const Landing = () => {
  return (
    <>
      <div className="flex flex-col  mt-[5vh]">
        <h1 className="mx-5 my-2 font-semibold text-2xl">
          Where would you like to get{" "}
          <span className="text-brandColor font-bold">OnBoard</span> today?
        </h1>
        <div className="md:w-[50vw] w-[90vw] mx-5 bg-white rounded-lg">
          <div className="bg-brandColor text-white rounded-lg">
            <h1 className="text-center py-[5px] font-medium text-md">
              Login/Signup to book flights
            </h1>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 bg-white text-black p-5">
              <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
                <h1 className="text-black text-sm">From</h1>
                <h1 className="font-semibold text-brandColor text-lg">CSMT</h1>
                <h1 className="text-black text-sm">BOMBAY</h1>
              </div>
              <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
                <h1 className="text-black text-sm">From</h1>
                <h1 className="font-semibold text-brandColor">CSMT</h1>
                <h1 className="text-black text-sm">BOMBAY</h1>
              </div>
              <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
                <h1 className="text-black text-sm">From</h1>
                <h1 className="font-semibold text-brandColor">CSMT</h1>
                <h1 className="text-black text-sm">BOMBAY</h1>
              </div>
            </div>
            <div className="flex bg-white justify-center text-black rounded-b-lg pb-5">
              <button className="py-1 px-5 my-2 rounded-full bg-[#BCC2CF] font-semibold">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
