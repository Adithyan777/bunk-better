import React from 'react';
import { useParams } from 'react-router-dom';

export default function ErrorPage(props) {
    const {id: code} = useParams();
  let heading, message, bullets;

  // Set heading, message, and bullets based on the error code
  switch (code) {
    case '400':
      heading = 'Bad Request';
      message = "The server cannot or will not process the request due to an apparent client error";
      bullets = [
        "Ensure the credentials given are valid",
        "Ensure that all the required data is given in the request"
      ];
      break;
    case '401':
      heading = 'Unauthorized';
      message = "The request has not been applied because it lacks valid authentication credentials";
      bullets = [
        "Ensure you are logged in with proper credentials",
        "Check if your session has expired"
      ];
      break;
    case '403':
      heading = 'Forbidden';
      message = "The server understood the request but refuses to authorize it";
      bullets = [
        "Ensure you have the necessary permissions to access this resource",
        "Try logging in once more"
      ];
      break;
    case '404':
      heading = 'Page Not Found';
      message = "The page or resource you are looking for does not exist or has been moved";
      bullets = [
        "The URL may be misspelled or incorrect",
        "The user, subject or timetable you are trying to access is not found",
        "The page may have been moved or deleted",
        "There may be a problem with the server or network connection"
      ];
      break;
    case '500':
      heading = 'Internal Server Error';
      message = "The server encountered an unexpected condition that prevented it from fulfilling the request";
      bullets = [
        "Try again later",
        "Please raise an issue in GitHub if the problem persists"
      ];
      break;
    case '409':
        heading = 'Conflict';
        message = 'The server found a conflict with the current state of the target resource.';
        bullets = [
            "An account with the given email already exists",
            "Try with a new email instead"
        ];
        break;
    default:
      heading = 'An Error Occurred';
      message = "An unexpected error occurred while processing your request";
      bullets = [
        "Try again later",
        "Please raise an issue in GitHub if the problem persists"
      ];
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-2">{code}</h1>
          <h2 className="text-2xl font-semibold mb-4">{heading}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
            {bullets.map((bullet, index) => (
              <li key={index}>{" - " + bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
