import { Link } from 'react-router-dom';
import { FiChevronDown, FiFileText, FiHelpCircle, FiMail } from 'react-icons/fi';

export default function TopBar() {
  return (
    <div className="w-full bg-dark text-white text-sm">
      <div className="container-max flex items-center justify-between py-3 gap-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span>ENGLISH</span>
            <FiChevronDown className="text-xs" />
          </div>
          <div className="flex items-center gap-1">
            <span>$ DOLLAR (US)</span>
            <FiChevronDown className="text-xs" />
          </div>
        </div>
        
        <div className="flex-1 text-center">
          <span className="font-medium">WELCOME TO OUR STORE!</span>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link to="/blog" className="flex items-center gap-1 hover:text-primary-300 transition-colors">
            <FiFileText className="text-sm" />
            <span>BLOG</span>
          </Link>
          <Link to="/support" className="flex items-center gap-1 hover:text-primary-300 transition-colors">
            <FiHelpCircle className="text-sm" />
            <span>FAQ</span>
          </Link>
          <Link to="/contact" className="flex items-center gap-1 hover:text-primary-300 transition-colors">
            <FiMail className="text-sm" />
            <span>CONTACT US</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
