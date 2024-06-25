import React, { useState, useEffect } from 'react';
import HeaderStreaming from './Trainers/HeaderStreaming';
import axiosInstance from '../services/AxiosInstance';


const Streaming = () => {

    const [url, setUrl] = useState();

    useEffect(() => {
        getUrl();
    }, [])

    const executeServiceUrl = () => {
        return axiosInstance.get(`http://localhost:9898/api/token/url/${localStorage.getItem('tokenStreaming')}`);
    }

    const getUrl = () => {
        executeServiceUrl().then((response) => {
           setUrl(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <div>
            <HeaderStreaming />
            <div style={{ width: '360px', padding: '8% 0 0', margin: 'auto' }}>
                <div className="p-field p-grid" style={{ position: 'relative', textAlign: 'center' }}>
                    <iframe width="560" height="315" src={url} frameBorder="0" allowFullScreen></iframe>
                </div>
            </div >
        </div>
    )
}
export default Streaming