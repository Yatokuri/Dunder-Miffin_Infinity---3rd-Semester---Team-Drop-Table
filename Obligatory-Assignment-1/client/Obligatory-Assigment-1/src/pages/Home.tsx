import AddProduct from "../components/AddProduct.tsx";
import Footer from "../components/Footer.tsx";


function Home() {
  return (
      <div>
          <h1 className="text-3xl font-bold">Home</h1>
          <AddProduct />




          {/* Let the footer stay at the bottom of the page */}
          <Footer />
      </div>
  );
}

export default Home;