import AboutUs from "../components/AboutUs.tsx";
import PageHeader from "../components/PageHeader.tsx";


function About() {
    return (
        <div>
            <PageHeader/>
            <h1 className="text-2xl font-bold">About us</h1>

            <AboutUs/>
        </div>
    );
}

export default About;