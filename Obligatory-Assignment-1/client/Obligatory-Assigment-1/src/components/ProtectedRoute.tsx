import React from 'react';
import { useAtom } from 'jotai';
import { authAtom, checkAdminStatus } from '../atoms/LoginAtoms.ts';
import NoPermission from '../pages/Errors/NoPermission.tsx';

interface ProtectedAdminRouteProps {
    children: React.ReactNode; // The component to render if access is granted
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
    const [authState] = useAtom(authAtom);
    const isAdminUser = checkAdminStatus(authState);
    const isAdmin = authState.isLoggedIn && isAdminUser;

    // If not an admin, show NoPermission
    if (!isAdmin) {
        return <NoPermission />;
    }

    // If the user is an admin, return the children (the protected component)
    return <>{children}</>;
};

export default ProtectedAdminRoute;