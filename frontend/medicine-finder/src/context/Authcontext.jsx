import { createContext,useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({children})=>{
    const [user,setuser]= useState(JSON.parse(localStorage.getItem("user"))||null);

    const [role, setrole] = useState(localStorage.getItem("role")||null);

    const [token, settoken] = useState(localStorage.getItem("token")||null);


    return (
        <AuthContext.Provider
        value={{
            user,setuser,role,setrole,token,settoken
        }}>{children}</AuthContext.Provider>
    )
}

export default AuthProvider;