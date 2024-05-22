import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

function InsertSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [isZero,setIsZero] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${baseUrl}/subjects`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
        });

        if (!response.ok) {
          throw new Error(response.status);
        }

        const data = await response.json();
        if(data.length === 0) setIsZero(true);
        setSubjects(data.length ? data.map(subject => subject.subname) : ['']);
      } catch (error) {
        navigate('/error/' + error.message);
      }
    };

    fetchSubjects();
  }, []);

  const handleAddSubject = () => {
    setSubjects([...subjects, '']);
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectValues = subjects.filter(subject => subject.trim() !== '');

    try {
      const response = await fetch(`${baseUrl}/insertSubjects`, {
        method: isZero ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ "subjects": subjectValues }),
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();
      console.log('Submitted subjects: ', subjectValues);
      console.log("Success:", data);
      navigate('/home');
    } catch (error) {
      navigate('/error/' + error.message);
    }

    setSubjects(['']);
  };

  return (

    <>
      <Card className='m-40' >
        <CardHeader>
          <CardTitle>
            <h3 className="text-2xl font-bold">
              Add all your subjects here
            </h3>
          </CardTitle>
          {isZero ? (
              <CardDescription>You have added 0 subjects. Add some here.</CardDescription>):
              (<CardDescription>You have added some subjects. Add/Remove them here.</CardDescription>)
          }
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {subjects.map((subject, index) => (
            <div key={index} className="flex items-center">
              <Input
                placeholder="Subject name"
                value={subject}
                onChange={(e) => handleSubjectChange(index, e.target.value)}
                className="w-80"
              />
              {index === subjects.length - 1 && (
                <Button
                  size="icon"
                  onClick={handleAddSubject}
                  className="ml-5 rounded-full"
                >
                  +
                </Button>
              )}
              {index !== subjects.length - 1 && (
                <Button
                  size="icon"
                  onClick={() => handleRemoveSubject(index)}
                  className="ml-5 rounded-full"
                >
                  -
                </Button>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>
    </>
  );
}


export default InsertSubjects