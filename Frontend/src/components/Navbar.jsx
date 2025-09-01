import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/login/loginSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.login.user);

  const handleLogout = () => {
    dispatch(logout()); // clears Redux + localStorage
    navigate("/"); // redirect to login
  };

  // base navigation
  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Service", href: "/deploy" },
  ];

  // only admins get the Onboarding link
  if (user?.role === "admin") {
    navigation.splice(1, 0, { name: "Onboarding", href: "/onboarding" });
  }

  return (
    <Disclosure
      as="nav"
      className="fixed inset-x-0 top-0 z-50 w-screen bg-gray-900/95 backdrop-blur-sm border-b border-white/5"
    >
      {({ open }) => (
        <>
          <div className="w-full px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <Bars3Icon
                    aria-hidden="true"
                    className={classNames(open ? "hidden" : "block", "h-6 w-6")}
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className={classNames(open ? "block" : "hidden", "h-6 w-6")}
                  />
                </DisclosureButton>
              </div>

              {/* Logo + Navigation */}
              <div className="flex flex-1 items-center justify-start gap-6">
                <div className="flex items-center">
                  <img
                    alt="Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>

                <div className="hidden sm:block">
                  <div className="flex space-x-3">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          "rounded-md px-3 py-2 text-sm font-medium",
                          item.href === window.location.pathname
                            ? "bg-gray-800 text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="relative rounded-full p-1 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>

                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex rounded-full focus:outline-none">
                    <img
                      alt="profile"
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${
                          user?.firstName || user?.name || "User"
                        }`
                      }
                      className="h-8 w-8 rounded-full bg-gray-800"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-50 focus:outline-none">
                    <MenuItem>
                      <div className="px-4 py-2 text-sm text-gray-300">
                        {user?.firstName || user?.name || "Guest"}
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <DisclosurePanel className="sm:hidden bg-gray-900 border-t border-white/5">
            <div className="space-y-1 px-4 pt-20 pb-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    item.href === window.location.pathname
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
