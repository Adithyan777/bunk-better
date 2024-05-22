import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export function ExtraClass(props) {

    // use the /updateAttendance route handler for the request
    // also get required props from parent component
    // copy isDialogue open state variable logic from parent component to close the dialog

    const [selectedSubject,setSelectedSubject] = useState(0);
    const [subs,setSubs] = useState([]);
    const [code,setCode] = useState(0);
    const [isLoading,setIsLoading] = useState(true); 
    const [isDialogOpen,setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      setIsLoading(true)
      const fetchSubjects = async () => {
        try {
          const response = await fetch(`${baseUrl}/subjects`, {
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
          setSubs(formattedData);
          console.log("Success:", formattedData); 
          setIsLoading(false);
        } catch (error) {
          navigate('/error/' + error.message);
        }
      };
  
      fetchSubjects();
    }, []);

    const handleSubjectSelect = (select)=>{
      setSelectedSubject(select);
      console.log(select);
    }

    const handleInputChange = (change)=>{
      setCode(change === 'attended' ? 1 : -1);
      console.log(change === 'attended' ? 1 : -1);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        if(selectedSubject && code){
            const response = await fetch(`${baseUrl}/updateAttendance`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
              "docID": selectedSubject,
              "code" : code
            }),
          });
  
          if (!response.ok) throw new Error(response.status);
    
          const updatedSubject = await response.json();
          props.updateSubjectCounts(updatedSubject._id, updatedSubject.noOfAttended, updatedSubject.noOfMissed, updatedSubject.totalClasses);
          console.log(updatedSubject);
          setIsDialogOpen(false);
          setCode(0);
          setSelectedSubject(0);
      }
      else{
        throw new Error("400");
      }
      } catch (error) {
        navigate('/error/' + error.message);
      }
    };


  return (
    <Dialog open={isDialogOpen} onOpenChange={(change)=> setIsDialogOpen(change)}>
      <DialogTrigger asChild>
        <Button>EXTRA CLASS +</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {isLoading ?
        (<p>Loading ...</p>):
        (<>
        <DialogHeader>
          <DialogTitle>Extra Class</DialogTitle>
          <DialogDescription>
            Add your extra class attendance here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subname" className="text-right">
              Subject
            </Label>
            <Select value={selectedSubject} onValueChange={(select) => handleSubjectSelect(select)} required={true}>
              <SelectTrigger className="w-[278px]">
                <SelectValue placeholder="Select a subject"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  {
                    subs.map((subject)=>(
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.subname}
                      </SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="my-3 flex justify-center items-center gap-10">
                    <Button 
                      {...(code !== 1 ? { variant: 'outline' } : {})}
                      onClick={()=>{handleInputChange('attended')}}>
                      Attended
                    </Button>
                    <Button 
                      {...(code !== -1 ? { variant: 'outline' } : {})}
                      onClick={()=>{handleInputChange('missed')}}>
                      Missed
                    </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={(e)=>{handleSubmit(e)}}>Save changes</Button>
        </DialogFooter>
        </>)}
      </DialogContent>
    </Dialog>
  )
}
 