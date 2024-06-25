import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom';
import ScheduleService from './../../services/ScheduleService'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import './../TableCrud.css';
import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';

const ListScheduleComponent = () => {

    const [schedules, setSchedules] = useState([]);
    const [schedule, setSchedule] = useState();
    const [daysArray, setDaysArray] = useState();
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');
    const [id, setId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [scheduleDialog, setScheduleDialog] = useState(false);
    const [deleteScheduleDialog, setDeleteScheduleDialog] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const history = useHistory();
    const toast = useRef(null);

    const daysSelectItems = [
        { label: 'Lunes', value: 'Lunes' },
        { label: 'Martes', value: 'Martes' },
        { label: 'Miercoles', value: 'Miercoles' },
        { label: 'Jueves', value: 'Jueves' },
        { label: 'Viernes', value: 'Viernes' },
        { label: 'Sabado', value: 'Sabado' },
        { label: 'Domingo', value: 'Domingo' }
    ];

    useEffect(() => {

        getAllSchedules();

    }, []);

    const getAllSchedules = () => {
        ScheduleService.getAllSchedules().then((response) => {
            setSchedules(response.data)
        }).catch(error => {
            console.error(error);
        })
    }

    const openNew = () => {
        setSchedule('');
        setDaysArray();
        setAgeMax('');
        setAgeMin('');
        setId(null);
        setSubmitted(false);
        setScheduleDialog(true);
    }

    const confirmDeleteSchedule = (deleteSchedule) => {
        setDeleteScheduleDialog(true);
        setSelectedSchedule(deleteSchedule);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Agregar" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            </React.Fragment>
        )
    }

    const header = (
        <div className="table-header">
            <h5 className="p-mx-0 p-my-1">HORARIOS</h5>
            <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const hideDialog = () => {
        setSubmitted(false);
        setScheduleDialog(false);
    }

    const setEditableSchedule = (editableSchedule) => {
        setSchedule(editableSchedule.schedule);
        let ages = editableSchedule.ageRange.split(" - ");
        setAgeMax(ages[1]);
        setAgeMin(ages[0]);
        let array = editableSchedule.days.split(',');
        setDaysArray(array);
        setScheduleDialog(true);
        setId(editableSchedule.id);
    }

    const saveOrUpdateSchedule = () => {
        setSubmitted(true);
        if (schedule && ageMin && ageMax) {
            if (ageMax > ageMin) {
                let ageRange = ageMin + ' - ' + ageMax;
                let days = daysArray.toString();
                const newSchedule = { schedule, days, ageRange }
                console.log(newSchedule);
                if (id) {
                    ScheduleService.updateSchedule(id, newSchedule).then((response) => {
                        history.push('/schedule');
                        getAllSchedules();
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Horario Modificado', life: 3000 });
                    }).catch(error => {
                        console.error(error);
                    })
                } else {
                    ScheduleService.createSchedule(newSchedule).then((response) => {
                        history.push('/schedule');
                        getAllSchedules();
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Horario Creado', life: 3000 });
                    }).catch(error => {
                        console.error(error);
                    })
                }
                setScheduleDialog(false);
                setSchedule('');
                setDaysArray();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Edades Invalidas', life: 3000 });
            }
        }
    }

    const scheduleDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={saveOrUpdateSchedule} />
        </React.Fragment>
    );

    const hideDeleteScheduleDialog = () => {
        setDeleteScheduleDialog(false);
    }

    const deleteSchedule = () => {
        ScheduleService.deleteSchedule(selectedSchedule.id).then((response) => {
            getAllSchedules();
            hideDeleteScheduleDialog();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Horario Eliminado', life: 3000 });
        }).catch(error => {
            console.error(error);
        })
    }

    const deleteScheduleDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteScheduleDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSchedule} />
        </React.Fragment>
    );

    const actionBody = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => setEditableSchedule(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteSchedule(rowData)} />
            </React.Fragment>
        );
    }

    return (
        <div className="datatable-crud">
            <HeaderComponent />
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>

            <DataTable value={schedules}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} horarios" globalFilter={globalFilter} header={header}
                scrollable scrollHeight="400px">
                <Column field="schedule" header="HORARIO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="days" header="DIAS" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="ageRange" header="RANGO EDAD" sortable style={{ minWidth: '12rem' }}></Column>
                <Column body={actionBody} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            <Dialog visible={scheduleDialog} style={{ width: '450px' }} header="Kyu Details" modal className="p-fluid" footer={scheduleDialogFooter} onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="schedule">Horario</label>
                    <InputText id="schedule" value={schedule} onChange={(t) => setSchedule(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !schedule })} />
                    {submitted && !schedule && <small className="p-error">Campo Requerido.</small>}
                </div>
                <br />
                <div className="p-field">
                    <label htmlFor="daysArray">Dias</label>
                    <MultiSelect id="daysArray" value={daysArray} options={daysSelectItems} onChange={(e) => setDaysArray(e.value)} optionLabel="label" placeholder="Seleccione Dias" maxSelectedLabels={5} required autoFocus className={classNames({ 'p-invalid': submitted && !daysArray })} />
                    {submitted && !daysArray && <small className="p-error">Campo Requerido.</small>}
                </div>
                <br />
                <div className="p-field">
                    <label htmlFor="days">Rango Edades</label>
                    <table>
                        <tbody>
                            <tr>
                                <td>Desde</td>
                                <td>
                                    <InputNumber inputId="vertical" value={ageMin} onValueChange={(e) => setAgeMin(e.value)} mode="decimal" showButtons buttonLayout="vertical" style={{ width: '4rem' }}
                                        decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" required autoFocus className={classNames({ 'p-invalid': submitted && !ageMin })} />
                                </td>
                                <td>Hasta</td>
                                <td>
                                    <InputNumber inputId="vertical" value={ageMax} onValueChange={(e) => setAgeMax(e.value)} mode="decimal" showButtons buttonLayout="vertical" style={{ width: '4rem' }}
                                        decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" required autoFocus className={classNames({ 'p-invalid': submitted && !ageMax })} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {submitted && !ageMin && !ageMax && <small className="p-error">Campo Requerido.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteScheduleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteScheduleDialogFooter} onHide={hideDeleteScheduleDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {selectedSchedule && <span> Esta seguro de borrar <b>{selectedSchedule.schedule}</b> ? </span>}
                </div>
            </Dialog>
            <FooterComponent />
        </div>
    )
}

export default ListScheduleComponent