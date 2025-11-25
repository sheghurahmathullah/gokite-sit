const socialIcons = {
  facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="24px"
      height="24px"
      viewBox="0 0 48 48"
    >
      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
      <path
        fill="#fff"
        d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
      ></path>
    </svg>
  ),
  twitter: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="18px"
      height="18px"
      viewBox="0 0 50 50"
    >
      <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
    </svg>
  ),
  linkedin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="24px"
      height="24px"
      viewBox="0 0 48 48"
    >
      <path
        fill="#0288D1"
        d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
      ></path>
      <path
        fill="#FFF"
        d="M12,19h5v17h-5V19z M16.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12 c1.521,0,2.458,1.08,2.486,2.499C17,15.887,16.035,17,16.485,17z M39,36h-5v-9.099c0-2.198-0.814-3.699-2.763-3.699 C30.009,23.201,29,24.508,29,26.601V36h-5V19h5v2.616C29.721,20.5,30.85,19,33.738,19C37.229,19,39,21.477,39,26.9V36z"
      ></path>
    </svg>
  ),
};

const Footer = () => {
  return (
    <footer
      className="w-full px-6 lg:px-12 py-6 mt-20 border-t-2"
      style={{
        backgroundColor: "#C8E5ED",
        borderTopColor: "#A0D4E0",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Contact */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <a href="/master-landing-page">
                <img
                  src="/gokite.png"
                  alt="GoKite"
                  className="h-16 cursor-pointer"
                />
              </a>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Contact our Travel agent
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Monday-Friday (9:00 am - 5:00 pm)
            </p>
            <p className="text-sm font-semibold text-gray-900">
              +91 7620370639
            </p>
            <p className="text-sm text-gray-700 mt-3">
              Email : support@gokite.com
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.facebook.com/gokitetravelandtours/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center hover:bg-white/70 transition-colors"
              >
                {socialIcons.facebook}
              </a>
              <a
                href="https://x.com/Gokitetravel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center hover:bg-white/70 transition-colors"
              >
                {socialIcons.twitter}
              </a>
              <a
                href="https://www.linkedin.com/company/gokitetravelandtours/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center hover:bg-white/70 transition-colors"
              >
                {socialIcons.linkedin}
              </a>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/flights"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Flight Booking
                </a>
              </li>
              <li>
                <a
                  href="/visa-landing-page"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Visa
                </a>
              </li>
              <li>
                <a
                  href="/activities"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Activities
                </a>
              </li>
              <li>
                <a
                  href="/holiday-home-page"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Holidays
                </a>
              </li>
              <li>
                <a
                  href="/hotels"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Hotel
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about-us"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Terms & Condition
                </a>
              </li>
            </ul>
          </div>

          {/* Empty column for layout */}
          <div></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
