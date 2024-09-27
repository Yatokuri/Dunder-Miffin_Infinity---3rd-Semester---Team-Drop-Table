import PageHeader from "../../components/PageHeader.tsx";
import ContactUs from "../../components/ContactUs.tsx";


function Contact() {
    return (
        <div>
            <PageHeader/>
            <h1 className="text-2xl font-bold">Contact us</h1>

            <ContactUs/>
        </div>
    );
}

export default Contact;