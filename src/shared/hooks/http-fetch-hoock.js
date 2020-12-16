import React,{useState , useCallback , useRef, useEffect } from 'react';

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
        
                if(!response.ok){
                    throw new Error(responseData.message);
                }
        
                return responseData
            }catch(err){
                console.log(err);
                setError(err.message);
            }
            setIsLoading(false);
        }
    ,[]); 

    const cancleError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    },[]);

    return { isLoading , error, sendRequest , cancleError }

}
