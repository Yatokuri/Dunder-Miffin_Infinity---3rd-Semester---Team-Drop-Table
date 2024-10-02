import { useState, useEffect } from "react";
import {Api, Customer} from "../../Api.ts";
import {useAtom} from "jotai";
import {CustomerAtoms} from "../atoms/CustomerAtoms.ts";


export const MyApi = new Api();


function MyProfile() {

    const [toggleEditableProfile, setEditableProfile] = useState(false); // State for password visibility
    const [customer, setCustomer] = useAtom<Customer>(CustomerAtoms);
    
    const [state, setState] = useState({
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phoneNumber: customer.phone,
    });



    // Initialize the state when customer atom changes
    useEffect(() => {
        setState({
            name: customer.name,
            email: customer.email,
            address: customer.address,
            phoneNumber: customer.phone,
        });
    }, [customer]);


    const handleChange = e => {
        setState(prevState => ({
            ...prevState,[e.target.name]: e.target.value
        }))
    }


    let tempProfileName = "";
    let tempProfileAddress = "";
    let tempProfileEmail = "";
    let tempProfilePhoneNumber = "";


    // Function to toggle Profile page being editable
    const changeEditableProfile = () => {

        tempProfileName = customer.name;
        tempProfileAddress = customer.address;
        tempProfileEmail = customer.email;
        tempProfilePhoneNumber = customer.phone;
        
        if (!toggleEditableProfile) {
            setEditableProfile(true);
        }
    };

    // TODO Readd Async & updatedCustomer: Customer at a later point and bind it to the API
    const saveProfileChanges = () => {

        //await MyApi.api.customerUpdateCustomer(updatedCustomer.id, updatedCustomer);
        //setCustomer(updatedCustomer);

        setEditableProfile(false);
    }

    const cancelProfileChanges = () => {

        state.name = tempProfileName;
        state.address = tempProfileAddress;
        state.email = tempProfileEmail;
        state.phoneNumber = tempProfilePhoneNumber;
        setEditableProfile(false);
    }


    if (!toggleEditableProfile) {
        return (
            <>
                <div className="flex mt-5">
                    <p> Profile Name</p>
                </div>
                <div>
                    <input
                        className={`text-200 input`}
                        type="text"
                        name="name"
                        value={state.name}
                        readOnly={true}
                    />
                </div>
                <div className="flex mt-3">
                    <p> Email</p>
                </div>
                <div>
                    <input
                        className={`text-200 input`}
                        type="text"
                        name="email"
                        value={state.email}
                        readOnly={true}
                    />
                </div>
                <div className="flex mt-3">
                    <p> Address</p>
                </div>
                <div>
                    <input
                        className={`text-200 input`}
                        type="text"
                        name="address"
                        value={state.address}
                        readOnly={true}
                    />
                </div>
                <div className="flex mt-3">
                    <p> Phone Number</p>
                </div>
                <div>
                    <input
                        className={`text-200 input`}
                        type="text"
                        name="phoneNumber"
                        value={state.phoneNumber}
                        readOnly={true}
                    />
                </div>
                <div className="flex mt-5">
                    <button type="button" onClick={changeEditableProfile} className="text-white-200 bg-base-200 flex items-center">
                        Change Info
                    </button>
                </div>
            </>
        );
    }
    if (toggleEditableProfile) {
        return (
            <>
                <div className="flex mt-5">
                    <p> Profile Name</p>
                </div>
                <div>
                    <input
                        className={`text-200 input`}
                        type="text"
                        name="name"
                        value={state.name}
                        readOnly={false}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex mt-3">
                    <p> Email</p>
                </div>
                <div>
                    <input
                        className={`text-200 input`}
                        type="text"
                        name="email"
                        value={state.email}
                        readOnly={false}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex mt-3">
                    <p> Address</p>
                </div>
                <div>
                    <input
                        className={`text-200 input`}
                        type="text"
                        name="address"
                        value={state.address}
                        readOnly={false}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex mt-3">
                    <p> Phone Number</p>
                </div>
                <div>
                    <input
                        className={`text-200 input`}
                        type="text"
                        name="phoneNumber"
                        value={state.phoneNumber}
                        readOnly={false}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex mt-5">
                    // TODO Change this to be able to run with Async at a later date
                    <button type="button" onClick={saveProfileChanges}
                            className=" bg-base-200 flex items-center pr-2 mr-8">
                        Save Changes
                    </button>
                    <button type="button" onClick={cancelProfileChanges}
                            className="bg-base-200 flex items-center">
                        Cancel Changes
                    </button>
                </div>
            </>
        );
    }
}

export default MyProfile;