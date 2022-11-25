import React from 'react'
import { Menubar } from 'primereact/menubar';

const HeaderStreaming = () => {
    const items = [
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

export default HeaderStreaming
