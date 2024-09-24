import FetchOrders from "../components/FetchAllOrders.tsx";


function AllOrders() {
  return (
      <div>
          <h1 className="text-3xl font-bold">All Orders</h1>
          <FetchOrders />
      </div>
  );
}

export default AllOrders;