import React, { useEffect, useRef } from "react";

interface CarouselProps {
    text: string;
    imageSrc: string;
}

const Carousel: React.FC<CarouselProps> = ({ text, imageSrc }) => {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cards = document.querySelectorAll<HTMLDivElement>('.carousel-card');

        // Get the maximum height from the text areas
        const maxHeight = Array.from(cards).reduce((max, card) => {
            const cardText = card.querySelector<HTMLDivElement>('.text-area');
            return Math.max(max, cardText ? cardText.clientHeight : 0);
        }, 0);

        // Set all text areas to the maximum height
        cards.forEach(card => {
            const cardText = card.querySelector<HTMLDivElement>('.text-area');
            if (cardText) {
                cardText.style.height = `${maxHeight}px`;
            }
        });
    }, [text]);

    return (
        <div className="carousel-card flex flex-col items-center mb-5">
            <div className="card w-full max-w-xs md:max-w-md lg:max-w-lg shadow-lg rounded-lg overflow-hidden">
                <img
                    src={imageSrc}
                    className="w-full h-48 md:h-56 lg:h-64 object-cover"
                    alt="Carousel item"
                />
                <div ref={textRef} className="text-area p-4 flex-grow flex items-center justify-center text-center">
                    <h3 className="text-lg font-semibold">{text}</h3>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
