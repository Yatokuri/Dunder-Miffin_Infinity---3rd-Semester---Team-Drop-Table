import ContactUs from "../../components/ContactUs.tsx";
import {Link} from "react-router-dom";


function Contact() {
    return (
        <div>

            <ContactUs/>


            <div className="flex justify-center">
                    <Link  to={"/customer-service"}
                           className="btn btn-primary">
                        Back to Customer Service
                    </Link>
            </div>
        </div>
    );
}

export default Contact;