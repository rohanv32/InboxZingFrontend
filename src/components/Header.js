// import React, { useState } from 'react';
// import { Dialog, DialogPanel } from '@headlessui/react';
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import { useUserContext } from './UserContext';

// const Header = ({ isLoggedIn, onLogout, onTabChange, onLogoClick }) => {  //Defining the header initially with the tabs available
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const { points } = useUserContext();

//   const navigation = isLoggedIn
//     ? [
//         { name: 'News Feed', onClick: () => onTabChange('NewsFeed') },
//         { name: 'Preferences', onClick: () => onTabChange('Preferences') },
//         { name: 'Delete Account', onClick: () => onTabChange('DeleteUser') },
//         { name: 'Profile', onClick: () => onTabChange('Profile') },
//         { name: 'Podcast', onClick: () => onTabChange('Podcast') },
//         { name: 'Logout', onClick: onLogout },
//       ]
//     : [];

//     return (
//       <div className="relative isolate bg-white">
//         <header className="fixed inset-x-0 top-0 z-50">
//           <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
//             {/* Logo Section */}
//             <div className="flex lg:flex-1 items-center">
//               <button onClick={onLogoClick} className="-m-1.5 p-1.5">
//                 <span className="sr-only">Inbox Zing</span>
//                 <h1 className="text-xl font-bold">Inbox Zing</h1>
//               </button>
//               {/* Points Display */}
//               {isLoggedIn && (
//                 <span className="ml-4 text-sm font-semibold text-gray-700">
//                   Points: <span className="text-gray-900">{points}</span>
//                 </span>
//               )}
//             </div>
  
//             {/* Mobile Menu Toggle */}
//             <div className="flex lg:hidden">
//               <button
//                 type="button"
//                 onClick={() => setMobileMenuOpen(true)}
//                 className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 <Bars3Icon aria-hidden="true" className="h-6 w-6" />
//               </button>
//             </div>
  
//             {/* Navigation for Large Screens */}
//             <div className="hidden lg:flex lg:gap-x-12">
//               {navigation.map((item) => (
//                 <button key={item.name} onClick={item.onClick} className="text-sm font-semibold text-gray-900">
//                   {item.name}
//                 </button>
//               ))}
//             </div>
//           </nav>
  
//           {/* Mobile Menu */}
//           <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
//             <div className="fixed inset-0 z-50" />
//             <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
//               <div className="flex items-center justify-between">
//                 <button onClick={onLogoClick} className="-m-1.5 p-1.5">
//                   <span className="sr-only">Inbox Zing</span>
//                   <h1 className="text-xl font-bold">Inbox Zing</h1>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="-m-2.5 rounded-md p-2.5 text-gray-700"
//                 >
//                   <span className="sr-only">Close menu</span>
//                   <XMarkIcon aria-hidden="true" className="h-6 w-6" />
//                 </button>
//               </div>
//               <div className="mt-6 flow-root">
//                 <div className="-my-6 divide-y divide-gray-500/10">
//                   <div className="space-y-2 py-6">
//                     {navigation.map((item) => (
//                       <button
//                         key={item.name}
//                         onClick={item.onClick}
//                         className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
//                       >
//                         {item.name}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </DialogPanel>
//           </Dialog>
//         </header>
  
//         {/* Background Element */}
//         <div
//           aria-hidden="true"
//           className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
//           style={{
//             pointerEvents: 'none',
//           }}
//         >
//           <div
//             style={{
//               clipPath:
//                 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
//             }}
//             className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
//           />
//         </div>
//       </div>
//    );
// };

// export default Header;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUserContext } from './UserContext';

const Header = ({ isLoggedIn, onLogout, onTabChange, onLogoClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { points } = useUserContext();

  const navigation = isLoggedIn
    ? [
        { name: 'News Feed', onClick: () => onTabChange('NewsFeed') },
        { name: 'Preferences', onClick: () => onTabChange('Preferences') },
        { name: 'Delete Account', onClick: () => onTabChange('DeleteUser') },
        { name: 'Profile', onClick: () => onTabChange('Profile') },
        { name: 'Podcast', onClick: () => onTabChange('Podcast') },
        { name: 'Logout', onClick: onLogout },
      ]
    : [];

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Adjust the threshold as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative isolate bg-white">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
        }`}
      >
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex lg:flex-1 items-center">
            <button onClick={onLogoClick} className="-m-1.5 p-1.5">
              <span className="sr-only">Inbox Zing</span>
              <h1 className="text-xl font-bold">Inbox Zing</h1>
            </button>
            {/* Points Display */}
            {isLoggedIn && (
              <span className="ml-4 text-sm font-semibold text-gray-700">
                Points: <span className="text-gray-900">{points}</span>
              </span>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation for Large Screens */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <button key={item.name} onClick={item.onClick} className="text-sm font-semibold text-gray-900">
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <button onClick={onLogoClick} className="-m-1.5 p-1.5">
                <span className="sr-only">Inbox Zing</span>
                <h1 className="text-xl font-bold">Inbox Zing</h1>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Background Element */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        style={{
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
};

export default Header;
