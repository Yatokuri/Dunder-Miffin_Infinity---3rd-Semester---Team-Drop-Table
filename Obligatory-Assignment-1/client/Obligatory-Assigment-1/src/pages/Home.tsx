import Carousel from "../components/Carousel.tsx";

function Home() {
    return (
        <div style={{ marginTop: '8rem' }}>
            <div>
                <h1 className="text-5xl font-bold text-center">Dunder Mifflin Infinity</h1>
                <h1 className="text-5xl font-bold text-center">One stop shop for all your paper needs.</h1>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem'}}>
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Go to shop</button>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '3rem',
                    gap: '1rem'
                }}
            >
                <Carousel text={"Any color of the rainbow"} />
                <Carousel text={"Made by Chinese children"} />
                <Carousel text={"All profits go to space"} />
                <Carousel text={"Improves productivity"} />
            </div>
        </div>
    );
}

export default Home;
