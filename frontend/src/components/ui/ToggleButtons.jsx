import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

const environment = import.meta.env.VITE_ENVIRONMENT;
const baseUrl = environment === 'production'
  ? import.meta.env.VITE_BACKEND_URL
  : import.meta.env.VITE_DEVELOPMENT_BACKEND_URL;
const protocol = environment === 'production' ? 'https' : 'http';
const getFullUrl = (endpoint) => `${protocol}://${baseUrl}${endpoint}`;

export default function ToggleButtons({ subjectId, attended, missed, total, onUpdate, clickedButton, onButtonClick }) {
  const [currentState, setCurrentState] = useState({
    attended,
    missed,
    total,
    clickedButton
  });
  const navigate = useNavigate();
  useEffect(() => {
    setCurrentState({
      attended,
      missed,
      total,
      clickedButton
    });
  }, [attended, missed, total, clickedButton]);

  const handleButtonClick = async (buttonType) => {
    let { attended, missed, total, clickedButton } = currentState;

    if (clickedButton === buttonType) {
      switch (buttonType) {
        case 'attended':
          attended -= 1;
          break;
        case 'missed':
          missed -= 1;
          break;
        default:
          break;
      }
      clickedButton = null;
    } else {
      if (clickedButton) {
        switch (clickedButton) {
          case 'attended':
            attended -= 1;
            break;
          case 'missed':
            missed -= 1;
            break;
          default:
            break;
        }
      }
      switch (buttonType) {
        case 'attended':
          attended += 1;
          break;
        case 'missed':
          missed += 1;
          break;
        default:
          break;
      }
      clickedButton = buttonType;
    }

    total = attended + missed;

    setCurrentState({ attended, missed, total, clickedButton });

    handleAttendanceUpdate(attended, missed, total);
    onButtonClick(subjectId, clickedButton);
  };

  const handleAttendanceUpdate = async (newAttended, newMissed, newTotal) => {
    try {
      const response = await fetch(getFullUrl('/updateSubject'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          id: subjectId,
          attended: newAttended,
          missed: newMissed,
          total: newTotal
        }),
      });

      if (!response.ok) throw new Error(response.status);
      console.log("Successfully updated subject counts");
      onUpdate(subjectId, newAttended, newMissed, newTotal);
    } catch (error) {
      navigate('/error/' + error.message);
    }
  };

  return (
    <div className="flex flex-wrap justify-between gap-2 p-4">
      <Button
        {...(currentState.clickedButton !== 'attended' ? { variant: 'outline' } : {})}
        className="flex-1 min-w-[80px] md:min-w-[100px] lg:min-w-[120px]"
        onClick={() => handleButtonClick('attended')}
      >
        Attended
      </Button>

      <Button
        {...(currentState.clickedButton !== 'missed' ? { variant: 'outline' } : {})}
        className="flex-1 min-w-[80px] md:min-w-[100px] lg:min-w-[120px]"
        onClick={() => handleButtonClick('missed')}
      >
        Missed
      </Button>

      <Button
        {...(currentState.clickedButton !== 'noClass' ? { variant: 'outline' } : {})}
        className="flex-1 min-w-[80px] md:min-w-[100px] lg:min-w-[120px]"
        onClick={() => handleButtonClick('noClass')}
      >
        No Class
      </Button>
    </div>
  );
}
