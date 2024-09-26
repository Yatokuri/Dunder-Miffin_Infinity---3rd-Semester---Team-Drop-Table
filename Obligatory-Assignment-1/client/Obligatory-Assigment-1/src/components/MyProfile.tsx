function MyProfile() {
    return (
        <>
            <div className="flex mt-5">
                <p> Possible profile picture here</p>
            </div>
            <div className="flex mt-5">
                <p> Profile Name</p>
            </div>
            <div>
                <p className="profileName"> PN</p>
            </div>
            <div className="flex mt-3">
                <p> Email</p>
            </div>
            <div>
                <p className="profileEmail"> EM</p>
            </div>
            <div className="flex mt-3">
                <p> Address</p>
            </div>
            <div>
                <p className="profileAddress"> AD</p>
            </div>
            <div className="flex mt-3">
                <p> Phone Number</p>
            </div>
            <div>
                <p className="profilePhoneNumber"> TLF</p>
            </div>
            <div className="flex mt-5">
                <button> Change info</button>
            </div>
        </>
    );
}

export default MyProfile;