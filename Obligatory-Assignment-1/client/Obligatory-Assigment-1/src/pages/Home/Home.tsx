import Carousel from "../../components/Carousel/Carousel.tsx";
import CarouselPicture1 from "../../components/Carousel/Carousel_Assets/CarouselPicture1.png";
import CarouselPicture2 from "../../components/Carousel/Carousel_Assets/CarouselPicture2.png";
import CarouselPicture3 from "../../components/Carousel/Carousel_Assets/CarouselPicture3.png";
import CarouselPicture4 from "../../components/Carousel/Carousel_Assets/CarouselPicture4.png";

function Home() {
    return (
        <div className="mt-16 px-4 md:px-8 lg:px-16 text-black">
            <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
                    Dunder Mifflin Infinity
                </h1>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-2">
                    One stop shop for all your paper needs.
                </h2>
            </div>
            <div className="text-center mt-8">
                <button className="btn btn-primary btn-md lg:btn-lg text-white transition duration-200">
                    Go to shop
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                <Carousel text={"Any color of the rainbow"} imageSrc={CarouselPicture1} />
                <Carousel text={"Made by Chinese children"} imageSrc={CarouselPicture2} />
                <Carousel text={"All profits go to space"} imageSrc={CarouselPicture3} />
                <Carousel text={"Improves productivity"} imageSrc={CarouselPicture4} />
            </div>
        </div>
    );
}

export default Home;
