import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

const GoogleIcon: React.FC<IconProps> = ({ className, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className={className}
        fill="none"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.2774 8.00008C3.2774 7.48044 3.3637 6.98225 3.51774 6.51498L0.821534 4.45605C0.296058 5.52297 0 6.72516 0 8.00008C0 9.2739 0.295694 10.4754 0.820441 11.5416L3.51519 9.47863C3.36261 9.01354 3.2774 8.51717 3.2774 8.00008Z"
            fill="#FBBC05"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.01117 3.27275C9.14005 3.27275 10.1597 3.67275 10.9608 4.3273L13.2914 2.00001C11.8712 0.763641 10.0504 0 8.01117 0C4.8452 0 2.12424 1.81056 0.821289 4.45603L3.51749 6.51495C4.13874 4.62912 5.90963 3.27275 8.01117 3.27275Z"
            fill="#FE584D"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.01117 12.7276C5.90963 12.7276 4.13874 11.3712 3.51749 9.48535L0.821289 11.5439C2.12424 14.1897 4.8452 16.0003 8.01117 16.0003C9.96522 16.0003 11.8308 15.3065 13.231 14.0065L10.6717 12.0279C9.94956 12.4828 9.04027 12.7276 8.01117 12.7276Z"
            fill="#34A853"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.659 7.99948C15.659 7.52675 15.5861 7.01765 15.4769 6.54492H8.01172V9.63585H12.3087C12.0939 10.6897 11.5091 11.4999 10.6722 12.0271L13.2315 14.0057C14.7023 12.6406 15.659 10.6071 15.659 7.99948Z"
            fill="#4285F4"
        />
    </svg>
);

export default GoogleIcon;
