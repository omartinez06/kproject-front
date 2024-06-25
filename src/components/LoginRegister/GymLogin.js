import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Image } from 'primereact/image';
import LoginRegisterService from './../../services/LoginRegisterService';
import TokenService from '../../services/TokenService';


const GymLoginRegister = () => {

    const toast = useRef(null);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const [token, setToken] = useState("");
    const [viewTokenInfo, setViewTokenInfo] = useState("");

    const login = () => {
        if (user && password) {
            const login = { user, password }
            LoginRegisterService.login(login).then((response) => {
                history.push('/dashboard')
                window.localStorage.setItem('token', `Bearer ${response.data.token}`);
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Credenciales Invalidas", life: 3000 });
            })
        }
    }

    const register = () => {
        history.push("/register")
    }

    const enterWithToken = () => {
        setViewTokenInfo(true);
    }

    const validateToken = () => {
        if (token) {
            TokenService.isAvailableEvent().then((response) => {
                if (response.data) {
                    TokenService.validateToken(token).then((resp) => {
                        if (resp.data) {
                            window.localStorage.setItem('tokenStreaming', `${token}`);
                            history.push("/streaming")
                        } else {
                            toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Token invalido", life: 3000 });
                        }
                    })
                } else {
                    toast.current.show({ severity: 'error', summary: 'ERROR', detail: "No hay eventos activos", life: 3000 });
                }
            })
        }
    }

    return (
        <div style={{ width: '360px', padding: '8% 0 0', margin: 'auto' }}>
            <div className="p-field p-grid" style={{ position: 'relative', width: '360px', margin: '0 auto 100px', padding: '45px', textAlign: 'center', boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)' }}>
                <Toast ref={toast} />
                <Image src="http://localhost:9898/api/file/shitokai" alt="Image" width="250" />
                {viewTokenInfo ?
                    <div className="p-col">
                        <span className="p-float-label">
                            <InputText id="token" value={token} onChange={(e) => setToken(e.target.value)} />
                            <label htmlFor="token">Token</label>
                        </span>
                        <div className="p-col flex align-items-center justify-content-center">
                            <Button label="Validar Token" className="p-button-link" onClick={validateToken} />
                        </div>
                        <div className="p-col flex align-items-center justify-content-center">
                            <Button className="pi pi-step-backward" onClick={() => setViewTokenInfo(false)} />
                        </div>
                    </div>
                    :
                    <div>
                        <div className="p-col">
                            <span className="p-float-label">
                                <InputText id="username" value={user} onChange={(e) => setUser(e.target.value)} />
                                <label htmlFor="username">Usuario</label>
                            </span>
                        </div>
                        <br />
                        <div className="p-col">
                            <span className="p-float-label">
                                <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
                                <label htmlFor="password">Contraseña</label>
                            </span>
                        </div>
                        <br />
                        <div className="p-col flex align-items-center justify-content-center">
                            <Button label="Login" icon="pi pi-check" onClick={login}></Button>
                        </div>
                        <br />
                        <div className="p-col flex align-items-center justify-content-center">
                            <Button label="Registrate" className="p-button-link" onClick={register} />
                        </div>
                        <div className="p-col flex align-items-center justify-content-center">
                            <Button label="Entrar con token" className="p-button-link" onClick={enterWithToken} />
                        </div>
                    </div>
                }
            </div>
        </div >
    )
}
export default GymLoginRegister