import Rect,{useCallback,useState,useEffect} from "react";

let logoutTimer;

export const useAuth = () => {
    
    const [token , setToken] = useState();
    // Taken an extra state to update the tokenExpirationDate for automatic logout
    const [tokenExpirationDate , setTokenExpirationDate] = useState();
    // To maintain the userID comming from BACKEND 
    const [userId , setUserId ] = useState(null);


    // useCallback is Used to avoid RECREATION OF FUNCTION & to avoid INFINITE LOOPS
    const login = useCallback((uid, token , expirationDate) => {
        setToken(token);
        // useing the userID
        setUserId(uid);

        // Expiration time will be 1hour greater then current time
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

        setTokenExpirationDate(tokenExpirationDate);

        // To store the userData in the client's browser so that he can automatically loggedin
        localStorage.setItem(
        'userData',
        JSON.stringify({
            userId:uid, 
            token:token, 
            expiration:tokenExpirationDate.toISOString()
        })
        );
    },[])

    const logout = useCallback((uid) => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem("userData");
    },[]);

    // Used to automatically logedout the user when time expired 
    useEffect(() => {
        if(token && tokenExpirationDate){
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
        }else{
        clearTimeout(logoutTimer);
        }
    },[token,logout,tokenExpirationDate])

    // Used to automatically logedin the user
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));

        // Checking the expiration the of token & if it is not expired then only we logedin the user
        if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
        login(storedData.uid , storedData.token, new Date(storedData.expiration));
        }
    },[login]);

    return {token,userId,login,logout};
}