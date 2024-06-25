import React, { useState, useRef, useEffect } from 'react';
import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import TokenService from '../../services/TokenService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';


const StreamingAdmin = () => {

    const [url, setUrl] = useState("");
    const [token, setToken] = useState("");
    const toast = useRef(null);

    useEffect(() => {
        getTokenInfo();
    }, [])

    const getTokenInfo = () => {
        TokenService.getTokenInfo().then((response) => {
            console.log(response.data);
            setUrl(response.data.url);
            setToken(response.data);
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Error al obtener informacion del Token", life: 3000 });
        });
    }

    const generateToken = () => {
        TokenService.generateToken().then((response) => {
            console.log(response.data);
            toast.current.show({ severity: 'success', summary: 'TOKEN', detail: "Token Generado Exitosamente.", life: 3000 });
            setToken(response.data);
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Error to generate Token", life: 3000 });
        });
    }

    const saveTokenInfo = () => {
        if (url) {
            token.url = url;
            TokenService.saveTokenInfo(token).then((response) => {
                console.log(response.data);
                toast.current.show({ severity: 'success', summary: 'TOKEN', detail: "Token Guardado Exitosamente.", life: 3000 });
                setToken(response.data);
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Error al guardar Token", life: 3000 });
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Ingrese URL", life: 3000 });
        }
    }

    return (
        <div>
            <HeaderComponent />
            <div style={{ width: '360px', padding: '8% 0 0', margin: 'auto' }}>
                <div className="p-field p-grid" style={{ position: 'relative', width: '360px', margin: '0 auto 100px', padding: '45px', textAlign: 'center', boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)' }}>
                    <Toast ref={toast} />
                    <Image src="http://localhost:9898/api/file/shitokai" alt="Image" width="250" />
                    <div className="p-field p-grid">
                        <div className="p-col">
                            <span className="p-float-label">
                                <InputText id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                                <label htmlFor="url">Url de streaming</label>
                            </span>
                        </div>
                        <br />
                        <div className="p-col">
                            <Button label="Generar Token" className="p-button-link" onClick={generateToken} />
                        </div>
                        <br />
                        <div className="p-col">
                            <label>Token generado para evento: {token.token}</label>
                        </div>
                        <br />
                        <div className="p-col flex align-items-center justify-content-center">
                            <Button label="Guardar" className="p-button-success" onClick={saveTokenInfo} />
                        </div>
                        <br />
                    </div>
                </div>
            </div >
            <FooterComponent />
        </div>
    )
}
export default StreamingAdmin