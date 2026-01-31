import React from 'react'

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
            <p>Copyright © {new Date().getFullYear()} - Powered By <a className='text-blue-600 font-semibold' href="https://esbatech.org" target='_blank'>EsbaTech</a></p>
        </aside>
    </footer>
  )
}

export default Footer
