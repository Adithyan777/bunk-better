import { useEffect, useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Progress } from "./progress";
import "@/App.css";
import { Button } from "./button";
import ToggleButtons from "./ToggleButtons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ExtraClass } from './extraClass';
import { useNavigate } from 'react-router-dom';

const getCurrentDay = () => {
  const date = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

const getCurrentLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export default function displaySubject() {
  const [subjects, setSubjects] = useState([]);
  const [clickedButtonState, setClickedButtonState] = useState({});
  const [today, setToday] = useState(getCurrentDay());
  const [currentDate, setCurrentDate] = useState(getCurrentLocalDate());
  const [editedAttended,setEditedAttended] = useState('');
  const [editedMissed,setEditedMissed] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState({});
  const [userData, setUserData] = useState({});
  const [noClass,setNoClass] = useState(0);
  const navigate = useNavigate();

  const handleDialogOpenChange = (subjectId, isOpen) => {
    setIsDialogOpen(prevState => ({
      ...prevState,
      [subjectId]: isOpen,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        const [subjectsResponse, userResponse] = await Promise.all([
          fetch(`${baseUrl}/subjectsByday`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "day": today
            }
          }),
          fetch(`${baseUrl}/userData`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          })
        ]);

        if (!subjectsResponse.ok || !userResponse.ok) {
          if(subjectsResponse.status === 404 && userResponse.ok){
              setNoClass(0);
              setSubjects([]);

              const fetchedUserData = await userResponse.json();
              setUserData(fetchedUserData);
              
          }else if(!subjectsResponse.ok){
            throw new Error(subjectsResponse.status);
          }else if(!userResponse.ok){
            throw new Error(userResponse.status);
          }   
        }else
        {
          const subjectsData = await subjectsResponse.json();
          const fetchedUserData = await userResponse.json();

          setSubjects(subjectsData);
          setNoClass(subjectsData.length);
          setUserData(fetchedUserData);
          const newClickedButtonState = {};

          subjectsData.forEach(subject => {
            if (subject.lastUpdated && subject.lastUpdated === currentDate) {
              newClickedButtonState[subject._id] = subject.lastChange;
            } else {
              newClickedButtonState[subject._id] = null;
            }
          });

          setClickedButtonState(newClickedButtonState);
          console.log("Fetched subjects:", subjectsData); // Debugging log
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchData();
  }, [today,currentDate]); // Run effect when today changes

  const updateSubjectCounts = (id, newAttended, newMissed, newTotal) => {
    setSubjects(prevSubjects => {
      return prevSubjects.map(subject =>
        subject._id === id
          ? { ...subject, noOfAttended: newAttended, noOfMissed: newMissed, totalClasses: newTotal }
          : subject
      );
    });
  };

  const updateClickedButtonState = (subjectId, clickedButton) => {
    setClickedButtonState(prevState => ({
      ...prevState,
      [subjectId]: clickedButton,
    }));
  };

  const handleSubmit = async (e, subjectId) => {
    e.preventDefault();

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${baseUrl}/updateSubject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          id: subjectId,
          attended: Number(editedAttended),
          missed: Number(editedMissed),
          total: Number(editedAttended) + Number(editedMissed)
        }),
      });

      if (!response.ok) throw new Error(response.status);

      const updatedSubject = await response.json();
      updateSubjectCounts(subjectId, updatedSubject.noOfAttended, updatedSubject.noOfMissed, updatedSubject.totalClasses);
      handleDialogOpenChange(subjectId,false);
    } catch (error) {
      navigate('/error/' + error.message)
    }
  };

  return (
    <>
    <Card className="m-5 flex-col">
    <div className='m-3'>
    {(Object.keys(userData).length !== 0)? (
              <CardTitle className="scroll border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                  Welcome {userData.firstName + " " + userData.lastName + "!"}  
              </CardTitle>):
              (<CardTitle className="scroll pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                  Loading ...
              </CardTitle>)
    }
    { noClass ? 
    (<>
    <CardDescription className="text-lg font-semibold">You have {noClass} lectures assigned today</CardDescription>
    <div className='flex justify-center	mx-3 my-4'>
    <ExtraClass updateSubjectCounts={updateSubjectCounts}/>
    </div>
    </>) :
    (<CardDescription className="text-lg font-semibold">You don't have any lectures assigned today</CardDescription>)
    }
    </div>
    <CardContent>
    <div className="flex justify-between flex-wrap mx-5">
      {subjects.map(subject => (
        <Card key={subject._id} className="w-full max-w-md mx-2 my-4">
          <CardHeader>
              <CardTitle className="flex justify-between">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  {subject.subname}
              </h3>
              <Dialog open={isDialogOpen[subject._id]} onOpenChange={(isOpen) => handleDialogOpenChange(subject._id, isOpen)}>
                <DialogTrigger>
                    <Button size="xs" variant="outline">edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={(e) => handleSubmit(e, subject._id)}>
                    <DialogHeader>
                      <DialogTitle>Edit subject</DialogTitle>
                      <DialogDescription>
                        Make changes to your {subject.subname} attendance here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="attended" className="text-right">
                            Attended
                          </Label>
                          <Input
                            id="editedAttended"
                            placeholder="no of attended"
                            className="col-span-3"
                            onChange={(e) => setEditedAttended(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="missed" className="text-right">
                          Missed
                        </Label>
                        <Input
                          id="editedMissed"
                          placeholder="no of missed"
                          className="col-span-3"
                          onChange={(e) => setEditedMissed(e.target.value)}
                        />
                        </div>
                      </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
              </form>
              </DialogContent>
            </Dialog>
            </CardTitle>
            <CardDescription className="flex justify-between">
              <small className="text-sm font-medium leading-none">{subject.noOfAttended} attended | {subject.noOfMissed} missed</small>
              <small className="text-sm font-medium leading-none">total classes: {subject.totalClasses}</small>
            </CardDescription>
          </CardHeader>
          <CardContent>
              <ToggleButtons 
                key={today}
                subjectId={subject._id} 
                attended={subject.noOfAttended} 
                missed={subject.noOfMissed} 
                total={subject.totalClasses} 
                onUpdate={updateSubjectCounts}
                clickedButton={clickedButtonState[subject._id] || null}
                onButtonClick={updateClickedButtonState}
              />
          </CardContent>
          <CardFooter className="progressAndMessage">
            {(() => {
              const attendancePercentage = Math.round(subject.noOfAttended / subject.totalClasses * 100);
              const canMiss = Math.abs(Math.floor(subject.noOfAttended / 3) - subject.noOfMissed);
              const needToAttend = (3 * subject.totalClasses) - (4 * subject.noOfAttended);

              return (
                <>
                  {attendancePercentage >= 75 ? (
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      You can miss {canMiss} lectures
                    </p>
                  ) : (
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      You need to attend {needToAttend} lectures more
                    </p>
                  )}
                  <br />
                  <Progress value={attendancePercentage} className="progressBar" />
                  <div className="text-lg font-semibold text-center" style={{ margin: '10px' }}>
                    {attendancePercentage}%
                  </div>
                </>
              );
            })()}
          </CardFooter>
        </Card>
      ))}
    </div>
    </CardContent>
    </Card>
    </>
  );
}
