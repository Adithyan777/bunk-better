import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const environment = import.meta.env.VITE_ENVIRONMENT;
const baseUrl = environment === 'production'
  ? import.meta.env.VITE_BACKEND_URL
  : import.meta.env.VITE_DEVELOPMENT_BACKEND_URL;
const protocol = environment === 'production' ? 'https' : 'http';
const getFullUrl = (endpoint) => `${protocol}://${baseUrl}${endpoint}`;

function EachDayTimeTable(props) {
  const [subjects, setSubjects] = useState([]);
  const [selects, setSelects] = useState([{ id: 1, selectedSubject: undefined }]);
  const [nextId, setNextId] = useState(2);
  const [isDefined,setIsDefined] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(getFullUrl('/subjects'), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });

        if (!response.ok) {
          throw new Error(response.status);
        }

        const data = await response.json();
        const formattedData = data.map(obj => ({ subname: obj.subname, id: obj._id }));
        setSubjects(formattedData);
        console.log("Success:", formattedData); 
      } catch (error) {
        navigate('/error/' + error.message);
        console.error("Error:", error); 
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchTimetable = async () => {
      try {
        const response = await fetch(getFullUrl('/subjectsByDay'), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
            day : props.day
          }
        });

        if (response.ok){
          setIsDefined(true);
          const data = await response.json();
          const fetchedSelects = data.map((item, index) => ({
            id: index + 1,
            selectedSubject: item._id
          }));
          setSelects(fetchedSelects);
          // console.log("Fetched selects: "+ fetchedSelects);
          setNextId(data.length + 1);
        }else if (response.status === 404) {
          setIsDefined(false);
          setSelects([{ id: 1, selectedSubject: undefined }]);
        }else if(!response.ok){
          throw Error(response.status);
        }
      } catch (error) {
        navigate('/error/' + error.message);
      }
      setIsLoading(false);
    };

    fetchTimetable();
  }, [props.day]);

  const handleAddSelect = () => {
    setSelects((prevSelects) => [
      ...prevSelects,
      { id: nextId, selectedSubject: undefined },
    ]);
    setNextId((prevId) => prevId + 1);
  };

  const handleRemoveSelect = (selectId) => {
    if (selects.length > 1) {
      setSelects((prevSelects) =>
        prevSelects.filter((select) => select.id !== selectId)
      );
    }
  };

  const handleSubjectSelect = (selectedSubject, selectId) => {
    setSelects((prevSelects) =>
      prevSelects.map((select) =>
        select.id === selectId ? { ...select, selectedSubject } : select
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedSubjects = selects.map((select) => select.selectedSubject).filter(Boolean);
    console.log(selectedSubjects);
    try {
      const response = await fetch(getFullUrl('/insertTimetable'), {
        method: isDefined ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ "timetable": { "day": props.day, "subjects": selectedSubjects } })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
      else{
        throw new Error(response.status);
      }
    } catch (error) {
      navigate('/error/' + error.message);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h3 className="text-2xl font-bold">
              {props.day}
            </h3>
          </CardTitle>
          {!isDefined ? (
              <CardDescription>You have not added any subjects for {props.day}. Add some here.</CardDescription>):
              (<CardDescription>You have added some subjects for {props.day}. Add/Remove them here.</CardDescription>)
          }
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ?
          (<p>Loading...</p>) :
          (
            selects.map((select, index) => (
              <div key={select.id} className="flex items-center space-x-2">
                <Select
                  value={select.selectedSubject}
                  onValueChange={(newValue) => handleSubjectSelect(newValue, select.id)}
                >
                  <SelectTrigger className="w-80">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.subname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {index === selects.length - 1 ? (
                  <Button
                    size="icon"
                    className="ml-2 align-items-center rounded-full"
                    onClick={handleAddSelect}
                  >
                    +
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    className="ml-2 align-items-center rounded-full"
                    onClick={() => handleRemoveSelect(select.id)}
                  >
                    -
                  </Button>
                )}
              </div>
            ))
        )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default EachDayTimeTable;
