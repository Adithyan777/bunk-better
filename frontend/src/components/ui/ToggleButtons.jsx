import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

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
      const response = await fetch(`${baseUrl}/updateSubject`, {
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
    <div className="w-full flex justify-around">
      <Button
        {...(currentState.clickedButton !== 'attended' ? { variant: 'outline' } : {})}
        className="buttons"
        onClick={() => handleButtonClick('attended')}
      >
        Attended
      </Button>

      <Button
        {...(currentState.clickedButton !== 'missed' ? { variant: 'outline' } : {})}
        className="buttons"
        onClick={() => handleButtonClick('missed')}
      >
        Missed
      </Button>

      <Button
        {...(currentState.clickedButton !== 'noClass' ? { variant: 'outline' } : {})}
        className="buttons"
        onClick={() => handleButtonClick('noClass')}
      >
        No Class
      </Button>
    </div>
  );
}
