import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import StudentService from './../../services/StudentService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import KyuService from '../../services/KyuService';
import ScheduleService from './../../services/ScheduleService'
import './../TableCrud.css';

const ListStudentComponent = () => {

    const [students, setStudents] = useState([]);
    const [kyus, setKyus] = useState([]);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [kyuId, setKyuId] = useState('');
    const [dpi, setDpi] = useState('');
    const [birth, setBirth] = useState('');
    const [id, setId] = useState(null);
    const [bloodType, setBloodType] = useState('');
    const [tutor, setTutor] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [studentDialog, setStudentDialog] = useState(false);
    const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const history = useHistory();
    const toast = useRef(null);

    useEffect(() => {
        getAllStudents();
    }, [])

    const getAllStudents = () => {

        StudentService.getAllStudents().then((response) => {
            setStudents(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    const getAllKyus = () => {
        KyuService.getAllKyus().then((response) => {
            setKyus(response.data)

        }).catch(error => {
            console.error(error);
        })
    }

    const getAllSchedules = () => {
        ScheduleService.getAllSchedules().then((response) => {
            setSchedules(response.data)
        }).catch(error => {
            console.error(error);
        })
    }

    const openNew = () => {
        setName('');
        setLastName('');
        setDpi('');
        setKyuId('');
        setBirth('');
        setBloodType('');
        setTutor('');
        setSchedules([]);
        setStudentDialog(true);
        setSubmitted(false);
    }

    const confirmDeleteStudent = (studentDeleted) => {
        setDeleteStudentDialog(true);
        setName(studentDeleted.name);
        setLastName(studentDeleted.lastName);
        setId(studentDeleted.id);
        setSelectedStudent(studentDeleted);
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
            <h5 className="p-mx-0 p-my-1">ALUMNOS</h5>
            <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const hideDialog = () => {
        setSubmitted(false);
        setStudentDialog(false);
        setId('');
    }

    const setEditableStudent = (editableStudent) => {
        getAllKyus();
        setName(editableStudent.name);
        setLastName(editableStudent.lastName);
        setDpi(editableStudent.dpi);
        setKyuId(editableStudent.kyuId);
        setBirth(editableStudent.birth);
        setBloodType(editableStudent.bloodType);
        setTutor(editableStudent.tutor);
        setStudentDialog(true);
    }

    const saveOrUpdateStudent = () => {
        setSubmitted(true);
        if (name && lastName && dpi && birth && kyuId && bloodType && tutor && schedules) {

            const student = { name, lastName, dpi, birth, bloodType, tutor, schedules, kyuId }
            if (id) {
                StudentService.updateStudent(id, student).then((response) => {
                    history.push('/student')
                    getAllStudents();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Alumno Modificado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            } else {
                StudentService.createStudent(student).then((response) => {
                    history.push('/student')
                    getAllStudents();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Alumno Agregado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            }
            setStudentDialog(false);
            setName('');
            setLastName('');
            setDpi('');
            setKyuId('');
            setBirth('');
            setBloodType('');
            setTutor('');
            setSchedules([]);
        }
    }

    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={saveOrUpdateStudent} />
        </React.Fragment>
    );

    const hideDeleteStudentDialog = () => {
        setDeleteStudentDialog(false);
    }

    const deleteStudent = () => {
        StudentService.deleteStudent(selectedStudent.id).then((response) => {
            getAllStudents();
            hideDeleteStudentDialog();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Alumno Eliminado', life: 3000 });
        }).catch(error => {
            console.error(error);
        })
    }

    const deleteStudentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteStudentDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteStudent} />
        </React.Fragment>
    );

    const actionBody = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => setEditableStudent(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteStudent(rowData)} />
            </React.Fragment>
        );
    }

    function formatDate(date) {

        var fDate = date.split("T")[0];
        var dd = fDate.split("-")[2];
        var mm = fDate.split("-")[1];
        var yyyy = fDate.split("-")[0];

        return dd + "/" + mm + "/" + yyyy;

    }

    const dateBodyFormat = (rowData) => {
        return formatDate(rowData.birth);
    }

    const monthNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }

    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
    }

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataTable value={students}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entrenadores" globalFilter={globalFilter} header={header}
                scrollable scrollHeight="400px">
                <Column field="name" header="NOMBRE" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="lastName" header="APELLIDO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="birth" header="FECHA NACIMIENTO" sortable style={{ minWidth: '10rem' }} body={dateBodyFormat}></Column>
                <Column field="dpi" header="DPI" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="kyu.kyu" header="GRADO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="bloodType" header="TIPO SANGRE" sortable style={{ minWidth: '7rem' }}></Column>
                <Column field="tutor" header="TUTOR" sortable style={{ minWidth: '12rem' }}></Column>
                <Column body={actionBody} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>
        </div>
    )
}
export default ListStudentComponent