import FetchOrders from "../components/FetchMyOrders.tsx";
import Footer from "../components/Footer.tsx";


function MyOrders() {
  return (
      <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <FetchOrders />






          {/* Let the footer stay at the bottom of the page */}
          <Footer />
      </div>
  );
}

export default MyOrders;