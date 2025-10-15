const stepsData = [
  { icon: "/visa/upload.png", label: "Upload documents" },
  { icon: "/visa/approval.png", label: "Get approval" },
  { icon: "/visa/receive-visa.png", label: "Receive Visa" },
];

const StepsGetVisa = () => {
  return (
    <section className="w-full min-h-[60vh] flex items-center justify-center p-5">
      <div className="w-full max-w-[1400px] min-h-[360px] sm:min-h-auto bg-[#e1effa] rounded-[18px] p-4 sm:px-9 sm:py-8 lg:px-12 lg:pt-8 lg:pb-7 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row justify-between items-center sm:items-start mt-2 sm:mt-3">
        {/* Left Content */}
        <div className="flex-1 pr-0 sm:pr-10 text-center sm:text-left z-10">
          {/* Top Titles */}
          <div className="mb-3 sm:mb-4">
            <span className="block text-[29px] sm:text-[32px] font-semibold text-[#168AAA] leading-[1.1] mb-1 select-none">
              Get Visa in 3
            </span>
            <span className="block text-lg sm:text-[22px] font-light text-[#379BB4] tracking-wide leading-[1.1] select-none">
              simple steps
            </span>
          </div>

          {/* Main Heading/Subheading */}
          <div>
            <div className="text-[17px] sm:text-[21px] font-bold text-[#242E3D] mb-2.5 sm:mb-3.5 leading-[1.2]">
              Upload your Documents we take care of the Process
            </div>
            <p className="text-[15px] sm:text-lg font-normal text-[#5A6C7D] m-0 leading-[1.3]">
              get Visa in 24 Hours through express visa service
            </p>
          </div>
        </div>

        {/* Step Icons Top Right */}
        <div className="relative sm:absolute top-auto sm:top-5 right-auto sm:right-[60px] flex flex-row gap-3 sm:gap-5 mt-5 sm:mt-0 justify-center items-center flex-wrap sm:flex-nowrap w-full sm:w-auto z-[15]">
          {stepsData.map((step, idx) => (
            <div
              key={idx}
              className="w-20 h-20 rounded-[15px] flex flex-col items-center justify-center p-2.5 text-xs sm:text-[10px] text-[#5a6c7d] font-medium whitespace-pre-line text-center transition-transform duration-200 ease-in-out cursor-pointer select-none hover:scale-105"
            >
              <img
                src={step.icon}
                alt={`Step ${idx + 1}`}
                className="w-10 h-10 mb-1.5 object-contain select-none pointer-events-none"
                draggable={false}
              />
              {step.label}
            </div>
          ))}
        </div>

        {/* Bottom Right Image */}
        <div className="relative sm:absolute bottom-auto sm:bottom-0 right-auto sm:right-0 flex justify-center sm:justify-end mt-5 sm:mt-0 w-full sm:w-[200px] h-auto sm:h-[280px] pt-0 sm:pt-[100px] select-none z-[5]">
          <img
            src="/visa/img.png"
            alt="Character"
            className="w-[150px] sm:w-full h-auto sm:h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};

export default StepsGetVisa;
