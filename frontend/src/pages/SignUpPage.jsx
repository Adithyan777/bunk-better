import CustomFooter from "@/components/ui/CustomFooter";
import SignUpCard from "@/components/ui/SignUpCard"

function SignUpPage(){

    return(
        <>
            <div class="flex items-center justify-center h-screen">
            <div class="flex flex-col items-center justify-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Bunk Better
            </h1>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Helps you bunk better.
            </h2>
            </div>
                <SignUpCard/>
            </div>
            <CustomFooter></CustomFooter>
            
        </>
    )
}

export default SignUpPage;