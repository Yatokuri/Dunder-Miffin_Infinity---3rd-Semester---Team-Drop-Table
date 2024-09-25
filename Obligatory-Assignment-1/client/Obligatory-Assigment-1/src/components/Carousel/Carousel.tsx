import React from "react";

interface CarouselProps {
    text: string;
    imageSrc: string;
}

const Carousel: React.FC<CarouselProps> = ({ text, imageSrc }) => {
    return (
        <div className="carousel-container flex flex-col items-center mb-5">
            <div className="carousel rounded-box w-80 mr-32 ml-32">
                <div className="carousel-item w-full">
                    <img
                        src={imageSrc}
                        className="w-full"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
            </div>
            <p className="text-center mt-2">{text}</p>
        </div>
    );
};

export default Carousel;