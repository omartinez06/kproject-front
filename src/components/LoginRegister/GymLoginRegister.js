import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Panel } from 'primereact/panel';
import LoginRegisterService from './../../services/LoginRegisterService';

const GymLoginRegister = () => {

    const toast = useRef(null);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const login = () => {
        if (user && password) {
            const login = { user, password }
            LoginRegisterService.login(login).then((response) => {
                history.push('/trainer')
                window.localStorage.setItem('token', `Bearer ${response.data.token}`);
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Credenciales Invalidas", life: 3000 });
            })
        }
    }


    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <Panel header="Iniciar Sesión">
                <div className="flex align-items-center justify-content-center">
                    <div className="grid card">
                        <div className="col-12">
                            <span className="p-float-label">
                                <InputText id="username" value={user} onChange={(e) => setUser(e.target.value)} />
                                <label htmlFor="username">Usuario</label>
                            </span>
                        </div>
                        <div className="col-12">
                            <span className="p-float-label">
                                <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
                                <label htmlFor="password">Contraseña</label>
                            </span>
                        </div>
                        <div className="col-5 flex align-items-center justify-content-center ">
                            <Button label="Login" icon="pi pi-check" onClick={login}></Button>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    )
}
export default GymLoginRegister