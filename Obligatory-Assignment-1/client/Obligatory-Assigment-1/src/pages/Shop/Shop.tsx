import {useAtom} from "jotai";
import {useEffect} from "react";
import {productsAtom} from "../Basket.tsx";
import {BasketAtom} from "../../atoms/BasketAtom.ts";
import {Api} from "../../../Api.ts";



export const MyApi = new Api();

function Shop() {
    
    
    const [products, setProducts] = useAtom(productsAtom);
    const [basket, setBasket] = useAtom(BasketAtom);

    const ShopCard = (props) => {
        return (
            <div className="card">
                <h2>{props.name}</h2>
                <p>{props.price}</p>
                <div>
                    <button className="btn btn-sm bg-green-600 text-white hover:bg-green-700 w-5 h-5" onClick={addToBasket}>+</button>
                    <p>{props.quantity}</p>
                    <button className="btn btn-sm bg-red-600 text-white hover:bg-red-700 w-5 h-5" onClick={removeFromBasket}>-</button>
                </div>
            </div>
        );
    }
    const addToBasket = () => {
        
    }
    
    const removeFromBasket = () => {
        
    }
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers(); // Fetch data
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData();
    }, [setProducts]);
    
    return (
      <div>
          <h1 className="text-3xl font-bold bg-center">Sales: Paper</h1>
          <h1 className="text-2xl font-bold bg-center">For all your administrative needs</h1>
          <div className="card-list">
              {products.map((item, index) => (
                  <ShopCard key={index} title={item.name} description={item.price} />
              ))}
          </div>
      </div>
  );
}

export default Shop;