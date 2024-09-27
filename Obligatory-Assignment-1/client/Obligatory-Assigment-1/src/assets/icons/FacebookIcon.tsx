import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

const FacebookIcon: React.FC<IconProps> = ({ className, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.7501 20V14.3761H8.71833V12.049H10.7501V10.2753C10.7501 8.25719 11.9449 7.14342 13.7719 7.14342C14.6472 7.14342 15.5629 7.30075 15.5629 7.30075V9.28153H14.5538C13.5593 9.28153 13.2499 9.90294 13.2499 10.5391V12.049H15.4684L15.1141 14.3761H13.2499V20C17.0745 19.3963 20 16.0663 20 12.0488C20 7.60358 16.4183 4 12 4C7.58172 4 4 7.60358 4 12.0488C4 16.0663 6.92552 19.3963 10.7501 20Z"
            fill="#1877F2"
        />
    </svg>
);

export default FacebookIcon;
