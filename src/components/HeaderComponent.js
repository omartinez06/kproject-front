import React from 'react'
import { Menubar } from 'primereact/menubar';

const HeaderComponent = () => {
    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-chart-line',
            command: () => {
                window.location = "/dashboard";
            }
        },
        {
            label: 'Mantenimiento',
            icon: 'pi pi-pencil',
            items: [
                {
                    label: 'Grados',
                    icon: 'pi pi-plus',
                    command: () => { window.location.href = "/kyu" }
                },
                {
                    label: 'Horarios',
                    icon: 'pi pi-calendar',
                    command: () => { window.location.href = "/schedule" }
                }
            ]
        },
        {
            label: 'Equipo',
            icon: 'pi pi-users',
            items: [
                {
                    label: 'Entrenadores',
                    icon: 'pi pi-user',
                    command: () => { window.location.href = "/trainer" }
                },
                {
                    label: 'Alumnos',
                    icon: 'pi pi-user',
                    command: () => { window.location.href = "/student" }
                }
            ]
        },
        {
            label: 'Administracion',
            icon: 'pi pi-money-bill',
            items: [
                {
                    label: 'Pagos',
                    icon: 'pi pi-paypal',
                    command: () => { window.location.href = "/payment" }
                },
                {
                    label: 'Eventos',
                    icon: 'pi pi-sitemap',
                    command: () => { window.location.href = "/event" }
                }
            ]
        },
        {
            label: 'Streaming',
            icon: 'pi pi-youtube',
            command: () => { window.location.href = "/streamingAdmin" }
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
