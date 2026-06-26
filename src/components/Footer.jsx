import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FiX } from 'react-icons/fi'

const usefulLinks = [
  { name: 'Home', path: '/' },
  { name: 'Explore Cars', path: '/explore-cars' },
  { name: 'Add Car', path: '/add-car' },
  { name: 'My Bookings', path: '/my-bookings' },
]

const modalLinks = {
  Company: ['About Us', 'How It Works', 'Terms & Conditions', 'Privacy Policy'],
  Support: ['FAQs', 'Cancellation Policy', '24/7 Support'],
}

const modalData = {
  'About Us': 'DriveFleet was founded with a simple vision: to revolutionize the car rental industry by building a transparent, user-friendly ecosystem.\n\nWe bridge the gap between car owners looking to monetize their vehicles and renters searching for reliable, affordable rides.\n\nWhether you need a compact car for a quick city errand or a premium SUV for a weekend getaway, DriveFleet ensures a seamless, secure, and premium experience every time.',

  'How It Works': '<strong>1. Sign Up & Explore:</strong>\nCreate a free account in seconds. Browse our extensive, real-time catalog of available vehicles tailored to your needs.\n\n<strong>2. Book with Confidence:</strong>\nSelect your desired dates, choose whether you need a professional driver, and confirm your booking instantly.\n\n<strong>3. Drive & Enjoy:</strong>\nPick up the car from the designated location and enjoy your trip. Once done, simply return the vehicle and leave a review!',

  'Terms & Conditions': '<strong>• Eligibility:</strong>\nAll renters must be at least 18 years old and possess a valid, government-issued driver\'s license.\n\n<strong>• Vehicle Care:</strong>\nVehicles must be returned in their original condition. Any damages, excessive dirt, or rule violations will be charged directly to the renter.\n\n<strong>• Usage Restrictions:</strong>\nCars rented through DriveFleet cannot be used for illegal activities, racing, or unauthorized commercial transport.',

  'Privacy Policy': 'At DriveFleet, safeguarding your personal data is our top priority.\n\n<strong>• Data Security:</strong>\nAll user profiles, payment information, and booking histories are heavily encrypted and securely stored.\n\n<strong>• No Third-Party Selling:</strong>\nWe strictly follow global data protection guidelines. Your information is never sold to or shared with unauthorized third-party advertisers.\n\n<strong>• Data Deletion:</strong>\nYou have the right to request full deletion of your account and personal data at any time.',

  'FAQs': '<strong>Q: Can I cancel my booking if my plans change?</strong>\nA: Absolutely! You can cancel any booking before the start date directly from your "My Bookings" dashboard.\n\n<strong>Q: Do I need to hire a driver?</strong>\nA: It\'s entirely up to you. During the checkout process, you can toggle the "Driver Needed" option based on your preference.\n\n<strong>Q: How do I list my own car?</strong>\nA: Simply navigate to the "Add Car" page, fill in your vehicle\'s details, upload a clear photo, and set your daily rate!',

  'Cancellation Policy': 'We understand that plans can change unexpectedly.\n\n<strong>• Free Cancellation:</strong>\nYou can cancel your booking completely free of charge up to 24 hours before your trip is scheduled to begin.\n\n<strong>• Late Cancellation Fees:</strong>\nCancellations made within 24 hours of the trip start time may incur a small administrative processing fee to compensate the car owner.\n\nRefunds are typically processed to your original payment method within 3-5 business days.',

  '24/7 Support': 'Our dedicated Customer Success team is available around the clock, 365 days a year.\n\nWhether you are facing a roadside emergency, need help extending a booking, or have a simple question about your account, we are here for you.\n\n<strong>• Email:</strong> support@drivefleet.com\n<strong>• Emergency Hotline:</strong> +880 1234-567890\n\nYour safety and satisfaction are guaranteed.'
}

function Footer() {
  const [selectedModal, setSelectedModal] = useState(null)

  return (
    <>
      <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-white">
                  Drive<span className="text-blue-400">Fleet</span>
                </p>
                <p className="text-sm text-slate-400">Car Rental</p>
              </div>
              <p className="text-sm text-slate-400">
                DriveFleet is your trusted partner for an amazing car rental
                experience.
              </p>
              <div className="flex items-center gap-3 text-slate-300">
                {[
                  { Icon: FaFacebookF, url: 'https://facebook.com' },
                  { Icon: FaInstagram, url: 'https://instagram.com' },
                  { Icon: FaLinkedinIn, url: 'https://linkedin.com' },
                  { Icon: FaXTwitter, url: 'https://x.com' }
                ].map(({ Icon, url }, index) => (
                  <a
                    key={`${Icon.displayName || 'icon'}-${index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 shadow-inner transition hover:bg-white/20 hover:text-white"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Useful Links (Routing) */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Useful Links</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  {usefulLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        onClick={(e) => {
                          if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return
                          window.scrollTo({ top: 0, behavior: 'instant' })
                        }}
                        className="transition hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company & Support Links (Modals) */}
              {Object.entries(modalLinks).map(([title, links]) => (
                <div key={title} className="space-y-3">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    {links.map((link) => (
                      <li key={link}>
                        <button
                          type="button"
                          onClick={() => setSelectedModal(link)}
                          className="text-left transition hover:text-white"
                        >
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Contact Us (Static) */}
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
          <div className="mt-10 border-t border-slate-800/80 pt-6 text-xs text-slate-500">
            2026 DriveFleet. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {selectedModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedModal(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">{selectedModal}</h3>
              <button
                onClick={() => setSelectedModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="p-6">
              <div
                className="whitespace-pre-line text-sm leading-relaxed text-slate-600 [&_strong]:font-semibold [&_strong]:text-slate-900"
                dangerouslySetInnerHTML={{ __html: modalData[selectedModal] || 'Information not available.' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Footer
