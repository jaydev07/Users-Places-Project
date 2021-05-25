import {useState , useCallback , useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading , setIsLoading] = useState(false);
    const [error , setError] = useState();

    // This will store it in an array when component is RERENDERED
    const activeHttpRequests = useRef([]);

    const sendRequest =  useCallback(
        async (url , method='GET', headers={}, body = null ) => {

            // Whenever the component is switched the REQUEST SHOULD ABORT 
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);

            try{
                setIsLoading(true);
                const response = await fetch(url , {
                    method,
                    headers,
                    body,
                    signal: httpAbortCtrl.signal
                });
        
                const responseData = await response.json();

                activeHttpRequests.current = activeHttpRequests.current.filter(
                    reqCtrl => reqCtrl !== httpAbortCtrl
                )
        
                if(!response.ok ){
                    setError(responseData.message);
                    //throw new Error(responseData.message);
                }
                setIsLoading(false);
                return responseData
            }catch(err){
                setIsLoading(false);
                console.log(err);
                setError(err.message);
                throw err;
            }
            
        }
    ,[]); 

    const clearError = () => {
        setError(null);
    }

    // Used whoen the components are changed & cancle th request
    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    },[]);

    return { isLoading , error, sendRequest , clearError }

}
