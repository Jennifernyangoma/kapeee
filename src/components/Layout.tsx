
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";
import { useCart } from "../hooks/useCart";

const Layout = () => {
    const { isCartSidebarOpen, closeCartSidebar } = useCart();
    
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
            <CartSidebar isOpen={isCartSidebarOpen} onClose={closeCartSidebar} />
        </>
    )
}
export default Layout;