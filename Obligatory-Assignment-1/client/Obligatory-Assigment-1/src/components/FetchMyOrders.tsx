import { useEffect } from "react";
import { Api } from "../../Api.ts";
import { atom, useAtom } from "jotai";


export const MyApi = new Api({
    baseUrl: "http://localhost:5261/api/order",
});

export interface Order {
    id: number;
    CustomerId: number;
    status: string;
    DeliveryDate: number;
    OrderDate: number;
    TotalAmount: number;
}

export const orderAtom = atom<Order[]>([]);

function AddOrder() {
    const [orders, setOrders] = useAtom(orderAtom);

    useEffect(() => {
        MyApi.api.orderGetMyOrders()
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    return (
        <div>
            <h1>Products:</h1>
            <table border={1} className="table-lg">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Customer Id</th>
                    <th>Status</th>
                    <th>Total Amount</th>
                    <th>Order Date</th>
                    <th>Delivery Date</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.CustomerId}</td>
                            <td>{order.status}</td>
                            <td>{order.TotalAmount}</td>
                            <td>{order.OrderDate}</td>
                            <td>{order.DeliveryDate}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5}>No Orders found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default AddOrder;