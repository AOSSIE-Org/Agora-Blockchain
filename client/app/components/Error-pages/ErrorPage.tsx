import React from 'react';
import Link from 'next/link';
import { FaHome, FaRedoAlt } from 'react-icons/fa';

/**
 * ErrorPage Component
 * 
 * A customizable error page component that displays an error code, a message,
 * and provides an option for the user to either retry or navigate back to a 
 * specified page (typically the homepage).
 *
 * @param {number} [errorCode=404] - The error code to display. Defaults to 404 if not provided.
 * @param {string} [errorMessage="The page you're looking for doesn't exist or is unavailable."] - The error message to display. Defaults to a standard 404 message.
 * @param {string} [details] - Optional additional details to provide more context about the error.
 * @param {string} [redirectPath="/"] - The path to redirect the user to when clicking the redirect button. Defaults to "/" (home).
 * @param {string} [redirectLabel="Go to Homepage"] - The label for the redirect button. Defaults to "Go to Homepage".
 * @param {() => void} [onRetry] - An optional function that will be executed when the retry button is clicked. Useful for recoverable errors.
 * @param {string} [current_route="#"] - The current route to check if the user is on the homepage. Used to prevent redundant redirect button.
 * 
 * @returns {JSX.Element} - A functional component rendering the error page with potential retry and redirect actions.
 */
interface ErrorPageProps {
    errorCode?: number; // Optional error code, defaults to 404
    errorMessage?: string; // Optional error message
    details?: string; // Optional additional details (string)
    redirectPath?: string; // Redirect path, defaults to "/"
    redirectLabel?: string; // Label for redirect button, defaults to "Go to Homepage"
    onRetry?: () => void; // Optional retry handler for recoverable errors
    current_route?: string; // The current route to avoid redundant redirects
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    errorCode = 404, // Default error code
    errorMessage = "The page you're looking for doesn't exist or is unavailable.",
    details, // Optional detailed message
    redirectPath = "/", // Default redirect path
    redirectLabel = "Go to Homepage", // Label for the redirect button
    onRetry, // Optional retry handler for recoverable errors
    current_route = "#", // The current route to avoid redundant redirects
}) => {
    return (
        <div className="min-h-screen flex shadow-lg shadow-gray-500 flex-col items-center justify-center  px-6 py-12">
            <div className="max-w-3xl w-full flex flex-col md:flex-row items-center justify-center bg-white p-8 rounded-lg shadow-xl space-y-8 md:space-y-0">
                <div className="text-center md:text-left space-y-6">
                    {/* Display the error code */}
                    <h1 className="text-6xl font-bold text-red-600">{errorCode}</h1>

                    {/* Display the error message */}
                    <h2 className="text-3xl font-semibold text-gray-800">{errorMessage}</h2>

                    {/* Display optional details, if provided */}
                    {details && <p className="text-lg text-gray-500 mt-2">{details}</p>}

                    <div className="mt-6 flex justify-center md:justify-start space-x-6">
                        {/* Show a retry button if an onRetry handler is provided */}
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                            >
                                <FaRedoAlt className="mr-2 text-xl" />
                                Reload
                            </button>
                        )}

                        {/* Show the redirect button only if the current route is not the homepage */}
                        {current_route !== "/" && (
                            <Link
                                href={redirectPath}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                            >
                                <FaHome className="mr-2 text-xl" />
                                {redirectLabel}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mt-8 md:mt-0 md:w-1/2 text-center">
                    {/* Display an image related to the error */}
                    <img
                        src="/aossie.png" // Replace with your own image or dynamic source
                        alt={`${errorCode} Illustration`} // Alt text for the image, based on error code
                        className="w-full max-w-xs mx-auto md:max-w-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
