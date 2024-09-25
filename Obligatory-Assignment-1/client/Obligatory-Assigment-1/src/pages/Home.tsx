import Carousel from "../components/Carousel/Carousel.tsx";
import CarouselPicture1 from "../components/Carousel/Carousel_Assets/CarouselPicture1.png";
import CarouselPicture2 from "../components/Carousel/Carousel_Assets/CarouselPicture2.png";
import CarouselPicture3 from "../components/Carousel/Carousel_Assets/CarouselPicture3.png";
import CarouselPicture4 from "../components/Carousel/Carousel_Assets/CarouselPicture4.png";


function Home() {
    return (
        <div className="mt-32">
            <div>
                <h1 className="text-5xl font-bold text-center">Dunder Mifflin Infinity</h1>
                <h1 className="text-5xl font-bold text-center">One stop shop for all your paper needs.</h1>
            </div>
            <div className="text-center mt-8">
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Go to shop</button>
            </div>
            <div className="flex justify-center items-center mt-12 gap-4">
                <Carousel text={"Any color of the rainbow"} imageSrc={CarouselPicture1} />
                <Carousel text={"Made by Chinese children"} imageSrc={CarouselPicture2} />
                <Carousel text={"All profits go to space"} imageSrc={CarouselPicture3} />
                <Carousel text={"Improves productivity"} imageSrc={CarouselPicture4} />
            </div>
        </div>
    );
}

export default Home;