import Footer from "../components/Footer.tsx";
import AboutUs from "../components/AboutUs.tsx";


function About() {
  return (
      <div>
          <h1 className="text-3xl font-bold">Dunder Mifflin Infinity</h1>
          <h1 className="text-2xl font-bold">About us</h1>

          <AboutUs/>

          {/* Let the footer stay at the bottom of the page */}
          <Footer/>
      </div>
  );
}

export default About;