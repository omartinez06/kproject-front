import React from 'react'
import { Menubar } from 'primereact/menubar';

const HeaderComponent = () => {
    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Mantenimiento',
                    icon: 'pi pi-fw pi-plus',
                    items: [
                        {
                            label: 'Equipo',
                            icon: 'pi pi-users',
                            items: [
                                {
                                    label: 'Entrenadores',
                                    icon: 'pi pi-users',
                                    command: () => { window.location.href = "/trainer" }
                                },
                                {
                                    label: 'Alumnos',
                                    icon: 'pi pi-users',
                                    command: () => { window.location.href = "/student" }
                                }
                            ]
                        },
                        {
                            label: 'Mantenimiento',
                            icon: 'pi pi-users',
                            items: [
                                {
                                    label: 'Grados',
                                    icon: 'pi pi-users',
                                    command: () => { window.location.href = "/kyu" }
                                },
                                {
                                    label: 'Horarios',
                                    icon: 'pi pi-users',
                                    command: () => { window.location.href = "/schedule" }
                                }
                            ]
                        },
                    ]
                }
            ]
        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                localStorage.removeItem('token');
                window.location = "/";
            }
        }
    ];

    return (
        <div>
            <header>
                <Menubar model={items} />
            </header>
        </div>
    )
}

export default HeaderComponent
