import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../features/auth/authSlice";
import { LogOut, Menu, X } from "lucide-react";
import Button from "./Button";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-[#121212] text-[#F5F5F5] px-4 sm:px-8 md:px-12 lg:px-24 py-4 md:py-6">
        <h1
          className="text-lg sm:text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          NILELINGU
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <a
            href="#research"
            className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
          >
            Research
          </a>
          <a
            href="#products"
            className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
          >
            Products
          </a>
          <a
            href="#safety"
            className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
          >
            Safety
          </a>
          <a
            href="#company"
            className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
          >
            Company
          </a>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <Button variant="primary" onClick={() => navigate("/translate")}>
            Try it now !
          </Button>

          {user && (
            <Button
              variant="text"
              size="sm"
              onClick={handleLogout}
              className="flex items-center text-[#F5F5F5] hover:text-[#BB86FC]"
            >
              <LogOut size={16} className="mr-1 text-[#BB86FC]" />
              Logout
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-[#F5F5F5] focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1E1E1E] px-4 py-6">
          <div className="flex flex-col space-y-6">
            <a
              href="#research"
              className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Research
            </a>
            <a
              href="#products"
              className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </a>
            <a
              href="#safety"
              className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Safety
            </a>
            <a
              href="#company"
              className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Company
            </a>

            <div className="pt-4 border-t border-[#333]">
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/translate");
                  setMobileMenuOpen(false);
                }}
                className="justify-center"
              >
                Try it now !
              </Button>

              {user && (
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center mt-4 text-[#F5F5F5] hover:text-[#BB86FC]"
                >
                  <LogOut size={16} className="mr-1 text-[#BB86FC]" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
