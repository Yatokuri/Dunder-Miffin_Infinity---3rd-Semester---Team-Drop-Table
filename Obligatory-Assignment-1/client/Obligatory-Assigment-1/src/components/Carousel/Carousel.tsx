import React from "react";

interface CarouselProps {
    text: string;
    imageSrc: string;
}

const Carousel: React.FC<CarouselProps> = ({ text, imageSrc }) => {
    return (
        <div className="carousel-container flex flex-col items-center">
            <div className="carousel rounded-box w-64" style={{ marginRight: '2rem', marginLeft: '2rem' }}>
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