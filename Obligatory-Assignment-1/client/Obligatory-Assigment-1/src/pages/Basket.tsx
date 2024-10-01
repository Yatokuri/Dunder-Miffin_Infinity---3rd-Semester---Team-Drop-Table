import FetchBasket from "../components/FetchBasket.tsx";
import {Api} from "../../Api.ts";
import {atom} from "jotai/index";

interface Product {
    id: string;
    name: string;
    stock: number;
    price: number;
    discontinued: boolean;
}
interface Basket {
    product_id: number;
    quantity: number;
}

export const MyApi = new Api();
export const productsAtom = atom<Product[]>([]);
export const basketAtom = atom<Basket[]>([]);


function Basket() {
  return (
      <div>
          <h1 className="text-3xl font-bold">My Basket</h1>
          <FetchBasket />
          
      </div>
  );
}

export default Basket;