import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Image } from 'primereact/image';
import LoginRegisterService from './../../services/LoginRegisterService';

const GymRegister = () => {

    const toast = useRef(null);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [manager, setManager] = useState("");
    const [latePayment, setLatePayment] = useState("");
    const history = useHistory();

    const register = () => {
        if (user && password && name && manager && address) {
            const gym = { address, name, manager, user, password, latePayment }
            LoginRegisterService.createGym(gym).then((response) => {
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'SUCCESS', detail: 'Usuario registrado.', life: 3000 });
                var millisecondsToWait = 3000;
                setTimeout(function () {
                    history.push('/');
                }, millisecondsToWait);
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Credenciales Invalidas", life: 3000 });
            })
        } else {
            toast.current.show({ severity: 'error', summary: 'ERROR', detail: "Ingrese todos los campos", life: 3000 });
        }
    }


    return (
        <div style={{ width: '360px', padding: '8% 0 0', margin: 'auto' }}>
            <div className="p-field p-grid" style={{ position: 'relative', width: '360px', margin: '0 auto 100px', padding: '45px', textAlign: 'center', boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)' }}>
                <Toast ref={toast} />
                <Image src="http://localhost:9898/api/file/shitokai" alt="Image" width="250" />
                <div className="p-field p-grid">
                    <div className="p-col">
                        <span className="p-float-label">
                            <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            <label htmlFor="name">Nombre</label>
                        </span>
                    </div>
                    <br />
                    <div className="p-col">
                        <span className="p-float-label">
                            <InputText id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            <label htmlFor="address">Direccion</label>
                        </span>
                    </div>
                    <br />
                    <div className="p-col">
                        <span className="p-float-label">
                            <InputText id="manager" value={manager} onChange={(e) => setManager(e.target.value)} />
                            <label htmlFor="manager">Encargado</label>
                        </span>
                    </div>
                    <br />
                    <div className="p-col">
                        <span className="p-float-label">
                            <InputText id="late_payment" value={latePayment} onChange={(e) => setLatePayment(e.target.value)} />
                            <label htmlFor="late_payment">Mora Mensual</label>
                        </span>
                    </div>
                    <br />
                    <div className="p-col">
                        <span className="p-float-label">
                            <InputText id="user" value={user} onChange={(e) => setUser(e.target.value)} />
                            <label htmlFor="user">Usuario</label>
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
                        <Button label="Registrar" icon="pi pi-check" onClick={register}></Button>
                    </div>
                    <br />
                </div>
            </div>
        </div >
    )
}
export default GymRegister