import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa'

const footerLinks = {
  'Useful Links': ['Home', 'Explore Cars', 'Add Car', 'My Bookings'],
  Company: ['About Us', 'How It Works', 'Terms & Conditions', 'Privacy Policy'],
  Support: ['Contact Us', 'FAQs', 'Cancellation Policy', '24/7 Support'],
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-white">DriveFleet</p>
              <p className="text-sm text-slate-400">Car Rental</p>
            </div>
            <p className="text-sm text-slate-400">
              DriveFleet is your trusted partner for an amazing car rental
              experience.
            </p>
            <div className="flex items-center gap-3 text-slate-300">
              {[FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter].map(
                (Icon, index) => (
                  <div
                    key={`${Icon.displayName || 'icon'}-${index}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800"
                  >
                    <Icon size={14} />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-3">
                <p className="text-sm font-semibold text-white">{title}</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  {links.map((link) => (
                    <li key={link} className="hover:text-white">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Contact Us</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>+880 1234-567890</li>
                <li>support@drivefleet.com</li>
                <li>Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
          2026 DriveFleet. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
