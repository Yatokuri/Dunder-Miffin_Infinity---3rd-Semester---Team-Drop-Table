import FetchOrders from "../components/FetchAllOrders.tsx";
import Footer from "../components/Footer.tsx";


function AllOrders() {
  return (
      <div>
          <h1 className="text-3xl font-bold">All Orders</h1>
          <FetchOrders />







          {/* Let the footer stay at the bottom of the page */}
          <Footer />
      </div>
  );
}

export default AllOrders;