import {useState} from "react";
import {ProfilePageAtom} from "../atoms/ProfilePageAtoms.ts";


function MyProfile() {

    const [toggleEditableProfile, setEditableProfile] = useState(false); // State for password visibility

    const [state, setState] = useState({
        name: ProfilePageAtom,
        email: ProfilePageAtom,
        address: ProfilePageAtom,
        phoneNumber: ProfilePageAtom,
    });

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

        tempProfileName = state.name;
        tempProfileAddress = state.address;
        tempProfileEmail = state.email;
        tempProfilePhoneNumber = state.phoneNumber;
        
        if (!toggleEditableProfile) {
            setEditableProfile(true);
        }
    };

    const saveProfileChanges = () => {

        

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