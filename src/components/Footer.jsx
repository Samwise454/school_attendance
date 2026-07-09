import React, { useState, useEffect } from 'react';

const Footer = () => {
  // const triggerLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         // Success!
  //         console.log("Latitude:", position.coords.latitude);
  //         console.log("Longitude:", position.coords.longitude);
  //       },
  //       (error) => {
  //         // User denied permission or other error
  //         console.error("Error Code:", error.code, "Message:", error.message);
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // }

  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
            {/* <button onClick={triggerLocation} className='btn btn-primary'>
              Get Location
            </button> */}
            <p>Copyright © {new Date().getFullYear()} - Powered By <a className='text-blue-600 font-semibold' href="https://esbatech.org" target='_blank'>EsbaTech</a></p>
        </aside>
    </footer>
  )
}

export default Footer
