import FetchOrders from "../components/FetchMyOrders.tsx";


function MyOrders() {
  return (
      <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <FetchOrders />
          
          
      </div>
  );
}

export default MyOrders;