import ContactUs from "../../components/Pages/ContactUs.tsx";
import {Link} from "react-router-dom";


function Contact() {
    return (
        <div>

            <ContactUs/>

            <div className="flex justify-center mt-6 mb-4">
                <Link to={"/customer-service"} className="btn btn-primary text-lg sm:text-base">
                    Back to Customer Service
                </Link>
            </div>
        </div>
    );
}

export default Contact;