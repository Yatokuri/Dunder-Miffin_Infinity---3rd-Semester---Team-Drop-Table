import MyProfile from "../components/MyProfile.tsx";
import { authAtom } from "../atoms/LoginAtoms.ts";
import {useAtom} from "jotai/index";
import NoPermission from "./NoPermission.tsx";

function Profile() {
    const [authState] = useAtom(authAtom); // Subscribe to auth state

    // Check if user is logged in
    if (!authState.isLoggedIn) {
        return <NoPermission />; // Show NotFound if not logged in
    }

    return (
        <div>
            <h1 className="text-5xl font-bold">Profile</h1>

            <MyProfile/>
        </div>
    );
}

export default Profile;