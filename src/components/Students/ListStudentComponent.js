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
import ScheduleService from './../../services/ScheduleService';
import FileService from '../../services/FileService';
import PaymentService from './../../services/PaymentService';
import './../TableCrud.css';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import { InputSwitch } from 'primereact/inputswitch';
import { Tag } from 'primereact/tag';
        

const ListStudentComponent = () => {

    const [students, setStudents] = useState([]);
    const [kyus, setKyus] = useState([]);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [kyuId, setKyuId] = useState('');
    const [email, setEmail] = useState('');
    const [birth, setBirth] = useState('');
    const [id, setId] = useState(null);
    const [bloodType, setBloodType] = useState('');
    const [tutor, setTutor] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [schedule, setSchedule] = useState('');
    const [studentDialog, setStudentDialog] = useState(false);
    const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const history = useHistory();
    const toast = useRef(null);
    const [quota, setQuota] = useState(0);
    const [applyLatePayment, setApplyLatePayment] = useState(false);
    const [viewCamera, setViewCamera] = useState(true);
    const [viewPayments, setViewPayments] = useState(false);
    const [payments, setPayments] = useState([]);
    const [license, setLicense] = useState('');
    const [inscription, setInscription] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [accountStatusDialog, setAccountStatusDialog] = useState(false); 

    const bloodTypeSelectItems = [
        { label: 'O Negativo', value: 'O-' },
        { label: 'O Positivo', value: 'O+' },
        { label: 'A Negativo', value: 'A-' },
        { label: 'A Positivo', value: 'A+' },
        { label: 'B Negativo', value: 'B-' },
        { label: 'B Positivo', value: 'B+' },
        { label: 'AB Negativo', value: 'AB-' },
        { label: 'AB Positivo', value: 'AB+' }
    ];

    let videoRef = useRef(null);
    let photoRef = useRef(null);

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

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({
                video: true
            })
            .then((stream) => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const getAllPayments = (studentId) => {

        PaymentService.getAllPayments().then((response) => {
            let paymentsData = [];
            for (let x = 0; x < response.data.length; x++) {
                if (response.data[x].student.id === studentId) {
                    paymentsData.push(response.data[x]);
                }
            }
            setPayments(paymentsData);
            console.log("Pagos del alumno: " + paymentsData);
        }).catch(error => {
            console.error(error);
        })
    }

    const openNew = () => {
        setName('');
        setLastName('');
        setEmail('');
        setLicense('');
        setKyuId('');
        setBirth('');
        setBloodType('');
        setTutor('');
        setSchedules([]);
        setSchedule('');
        getAllSchedules();
        getAllKyus();
        setStudentDialog(true);
        setSubmitted(false);
        setQuota(0);
        getVideo();
        setApplyLatePayment(false);
        setViewPayments(false);
        setInscription('');
    }

    const confirmDeleteStudent = (studentDeleted) => {
        setDeleteStudentDialog(true);
        setName(studentDeleted.name);
        setLastName(studentDeleted.lastName);
        setId(studentDeleted.id);
        setSelectedStudent(studentDeleted);
    }

    const confirmAccountStatusStudent = (student) => {
        setAccountStatusDialog(true);
        setId(student.id);
        setSelectedStudent(student);
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
        setAccountStatusDialog(false);
        setId('');
        setFrom('');
        setTo('');
        setPayments([]);
    }

    const setEditableStudent = (editableStudent) => {
        getAllKyus();
        getAllSchedules();
        setName(editableStudent.name);
        setLastName(editableStudent.lastName);
        setEmail(editableStudent.email);
        setKyuId(editableStudent.kyu.id);
        setBirth(new Date(editableStudent.birth));
        setBloodType(editableStudent.bloodType);
        setTutor(editableStudent.tutor);
        setSchedule(editableStudent.schedule.id);
        setId(editableStudent.id);
        setQuota(editableStudent.quota);
        setStudentDialog(true);
        setViewCamera(false);
        getAllPayments(editableStudent.id);
        setApplyLatePayment(editableStudent.applyLatePayment);
        setLicense(editableStudent.license);
        setViewPayments(true);
        setInscription(editableStudent.inscription);
    }

    const sendRecipt = (exportableRecipt) => {
        PaymentService.generateAndSendRecipt(exportableRecipt.id).then((response) => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Recibo enviado correctamente.', life: 3000 });
        }).catch(error => {
            console.error(error);
        })
    }

    const validateInformationBeforePhoto = () => {
        if (!(name || lastName || birth || email || tutor)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Llene toda la informacion antes de la foto', life: 3000 });
            return false;
        }

        return true;
    }

    let imageDataUrl = "";

    const takePicture = () => {
        if (validateInformationBeforePhoto()) {
            const width = 400
            const height = 300
            let video = videoRef.current
            let photo = photoRef.current
            photo.width = width
            photo.height = height
            let ctx = photo.getContext('2d')
            ctx.drawImage(video, 0, 0, width, height);
            let image_data_url = photo.toDataURL('image/png');

            // data url of the image
            console.log(image_data_url);
            imageDataUrl = image_data_url;
        }
    }

    const optionUpload = () => {
        if (viewCamera) {
            setViewCamera(false);
        } else {
            getVideo();
            setViewCamera(true);
        }
    }

    const savePicture = () => {
        fetch(imageDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], license + '.png', { type: "image/png" })
                FileService.createFileImage(file, license).then((response) => {
                    console.debug(response.data);
                    window.location.reload(false);
                    toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded Success!' });
                }).catch(error => {
                    console.error(error);
                })
            })
    }

    const saveOrUpdateStudent = () => {
        setSubmitted(true);
        if (name && lastName && email && birth && kyuId && bloodType && tutor && schedule && quota) {
            const student = { name, lastName, email, birth, bloodType, tutor, schedule, kyuId, quota, applyLatePayment, inscription}
            if (id) {
                StudentService.updateStudent(id, student).then((response) => {
                    if (viewCamera) {
                        savePicture();
                    }
                    history.push('/student')
                    getAllStudents();
                    setStudentDialog(false);
                    setName('');
                    setLastName('');
                    setEmail('');
                    setLicense('');
                    setKyuId('');
                    setBirth('');
                    setBloodType('');
                    setTutor('');
                    setSchedule('');
                    setQuota(0);
                    setInscription('');
                    setSchedules([]);
                    setApplyLatePayment(false);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Alumno Modificado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            } else {
                StudentService.createStudent(student).then((response) => {
                    if (viewCamera) {
                        savePicture();
                    }
                    history.push('/student')
                    getAllStudents();
                    setStudentDialog(false);
                    setName('');
                    setLastName('');
                    setEmail('');
                    setLicense('');
                    setKyuId('');
                    setBirth('');
                    setBloodType('');
                    setTutor('');
                    setSchedule('');
                    setQuota(0);
                    setInscription('');
                    setSchedules([]);
                    setApplyLatePayment(false);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Alumno Agregado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            }
        }
    }

    const generateAccountStatus = () => {
        setSubmitted(true);
        if (from && to && id) {
            const accountStatusObject = { from, to, id}
            StudentService.generateAccountStatus(accountStatusObject).then((response) => {
                history.push('/student')
                setFrom('');
                setTo('');
                hideDialog();
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Estado de Cuenta Generado', life: 3000 });
            }).catch(error => {
                console.error(error);
            })
        }
    }

    const customUploader = async (event) => {
        // convert file to base64 encoded 
        const file = event.files[0];
        FileService.createFileImage(file, license).then((response) => {
            console.debug(response.data);
            history.push('/student');
            getAllStudents();
            setStudentDialog(false);
            setName('');
            setLastName('');
            setEmail('');
            setLicense('');
            setKyuId('');
            setBirth('');
            setBloodType('');
            setTutor('');
            setSchedule('');
            setSchedules([]);
            setQuota(0);
            setInscription('');
            setApplyLatePayment(false);
            window.location.reload(false);
            toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded Success!' });
        }).catch(error => {
            console.error(error);
        })
    }

    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={saveOrUpdateStudent} />
        </React.Fragment>
    );

    const accountStatusDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={generateAccountStatus} />
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
                <Button icon="pi pi-file" className="p-button-rounded" onClick={() => confirmAccountStatusStudent(rowData)} />
            </React.Fragment>
        );
    }

    const paymentActionBody = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-wallet" className="p-button-rounded p-button" onClick={() => sendRecipt(rowData)}/>
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

    const clearImage = () => {
        let photo = photoRef.current
        let ctx = photo.getContext('2d')
        ctx.clearRect(0, 0, photo.width, photo.height)
    }

    const dateBodyFormat = (rowData) => {
        return formatDate(rowData.birth);
    }

    const getSeverity = (rowData) => {
        switch (rowData.status) {
            case "UP_TO_DATE":
                return 'success';

            case "DELIQUENT":
                return 'warning';

            case "PENDING":
                return 'info';

            default:
                return 'danger';
        }
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status === "UP_TO_DATE" ? "AL DIA" : rowData.status === "DELIQUENT" ? "EN MORA" : rowData.status === "PENDING" ? "PENDIENTE" : "INACTIVO"} severity={getSeverity(rowData)}></Tag>;
    }

    const dateBodyFormatPayment = (rowData) => {
        return formatDate(rowData.paymentDate);
    }

    const monthNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }

    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={"http://localhost:9898/api/file/" + rowData.license} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="60%" className="product-image" />
    }

    return (
        <div className="datatable-crud">
            <HeaderComponent />
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataTable value={students}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entrenadores" globalFilter={globalFilter} header={header}
                scrollable scrollHeight="400px">
                <Column field="image" header="IMAGEN" body={imageBodyTemplate}></Column>
                <Column field="license" header="CARNET" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="name" header="NOMBRE" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="lastName" header="APELLIDO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="birth" header="FECHA NACIMIENTO" sortable style={{ minWidth: '10rem' }} body={dateBodyFormat}></Column>
                <Column field="kyu.kyu" header="GRADO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="schedule.schedule" header="HORARIO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="status" header="ESTADO" sortable style={{ minWidth: '12rem' }} body={statusBodyTemplate}></Column>
                <Column body={actionBody} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            <Dialog visible={studentDialog} style={{ width: '60%' }} header="Student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={hideDialog}>

                <table>
                    <tbody>
                        <tr>
                            <td>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="p-field">
                                                    <label htmlFor="name">Nombre</label>
                                                    <InputText id="name" value={name} onChange={(t) => setName(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !name })} />
                                                    {submitted && !name && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="p-field">
                                                    <label htmlFor="lastName">Apellido</label>
                                                    <InputText id="lastName" value={lastName} onChange={(t) => setLastName(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !lastName })} />
                                                    {submitted && !lastName && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="birth">Fecha De Nacimiento</label>
                                                    <Calendar id="birth" value={birth} onChange={(t) => setBirth(t.value)} monthNavigator yearNavigator yearRange="1930:2030" dateFormat="dd/mm/yy"
                                                        monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !birth })} />
                                                    {submitted && !birth && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="p-field">
                                                    <label htmlFor="email">CORREO</label>
                                                    <InputText id="email" value={email} onChange={(t) => setEmail(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !email })} />
                                                    {submitted && !email && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>
                                                <div className="p-field">
                                                    <label htmlFor="tutor">Tutor</label>
                                                    <InputText id="tutor" value={tutor} onChange={(t) => setTutor(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !tutor })} />
                                                    {submitted && !tutor && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="p-field">
                                                    <label htmlFor="kyu">Grado</label>
                                                    <Dropdown id="kyu" optionLabel="kyu" optionValue="id" value={kyuId} options={kyus} onChange={(t) => setKyuId(t.target.value)} placeholder="Seleccione grado..." required autoFocus className={classNames({ 'p-invalid': submitted && !kyuId })} />
                                                    {submitted && !kyuId && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="p-field">
                                                    <label htmlFor="blodType">Tipo De Sangre</label>
                                                    <Dropdown value={bloodType} options={bloodTypeSelectItems} onChange={(t) => setBloodType(t.target.value)} optionLabel="label" placeholder="Seleccione tipo de sangre..." required autoFocus className={classNames({ 'p-invalid': submitted && !bloodType })} />
                                                    {submitted && !bloodType && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="p-field">
                                                    <label htmlFor="schedule">Horario</label>
                                                    <Dropdown id="schedule" optionLabel="schedule" optionValue="id" value={schedule} options={schedules} onChange={(e) => setSchedule(e.target.value)} placeholder="Seleccione Horario" maxSelectedLabels={5} required autoFocus className={classNames({ 'p-invalid': submitted && !schedule })} />
                                                    {submitted && !schedule && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="p-field">
                                                    <label htmlFor="quota">Cuota Mensual (Quetzalez)</label>
                                                    <InputText id="quota" value={quota} onChange={(t) => setQuota(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !quota })} />
                                                    {submitted && !quota && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label htmlFor="late_payment">Aplica a Mora</label>
                                            </td>
                                            <td>
                                                <InputSwitch checked={applyLatePayment} onChange={(e) => setApplyLatePayment(e.value)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="p-field">
                                                    <label htmlFor="inscription">Inscripcion (Quetzalez)</label>
                                                    <InputText id="inscription" value={inscription} onChange={(t) => setInscription(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !inscription })} />
                                                    {submitted && !inscription && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                {viewCamera ?
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <video style={{ width: '100%' }} ref={videoRef} className="container"></video>
                                                </td>
                                                <td>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <Button icon="pi pi-camera" className="p-button-rounded p-button-success" aria-label="Take Picture" onClick={takePicture} />
                                                                </td>
                                                                <td>
                                                                    <Button icon="pi pi-upload" className="p-button-rounded p-button-secondary" aria-label="Subir Imagen" onClick={optionUpload} />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <canvas style={{ width: '100%' }} className="container" ref={photoRef}></canvas>
                                                </td>
                                                <td>
                                                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger" aria-label="Cancel" onClick={clearImage} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    :
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Image src={"http://localhost:9898/api/file/" + license} alt="Image" width="250" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <FileUpload mode="basic" name="files[]" url="localhost:9898/api/file" accept=".jpg" maxFileSize={1000000} customUpload uploadHandler={customUploader} />
                                                            </td>
                                                            <td>
                                                                <Button icon="pi pi-camera" className="p-button-rounded p-button-secondary" aria-label="Tomar Fotografia" onClick={optionUpload} />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </tr>
                                        </tbody>
                                    </table>
                                }
                            </td>
                        </tr>
                        {viewPayments ?
                            <tr>
                                <td colSpan={3}>
                                    <DataTable value={payments}
                                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entrenadores" header="Pagos"
                                        scrollable scrollHeight="400px">
                                        <Column field="paymentDate" header="FECHA DE PAGO" sortable style={{ minWidth: '10rem' }} body={dateBodyFormatPayment}></Column>
                                        <Column field="depositTicket" header="ID DE COMPROBANTE" sortable style={{ minWidth: '12rem' }}></Column>
                                        <Column field="month" header="MES" sortable style={{ minWidth: '12rem' }}></Column>
                                        <Column field="value" header="VALOR DE CUOTA" sortable style={{ minWidth: '12rem' }}></Column>
                                        <Column body={(rowData) => rowData.latePayment ? 'MORA' : 'PUNTUAL'} header="PAGO TARDIO" sortable style={{ minWidth: '12rem' }}></Column>
                                        <Column body={paymentActionBody} exportable={false} style={{ minWidth: '8rem' }}></Column>
                                    </DataTable>
                                </td>
                            </tr>
                            :
                            null}
                    </tbody>
                </table>
            </Dialog>

            <Dialog visible={deleteStudentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteStudentDialogFooter} onHide={hideDeleteStudentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {selectedStudent && <span> Esta seguro de borrar <b>{name} {lastName}</b> ? </span>}
                </div>
            </Dialog>

            <Dialog visible={accountStatusDialog} style={{ width: '30%' }} header="Student Account Status" modal className="p-fluid" footer={accountStatusDialogFooter} onHide={hideDialog}>

                <table>
                <tbody>
                        <tr>
                            <td>
                                <div className="p-field">
                                    <label htmlFor="from">Desde</label>
                                    <Calendar id="from" value={from} onChange={(e) => setFrom(e.value)} />
                                    {submitted && !from && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                            <td>
                            <div className="p-field">
                                    <label htmlFor="to">Hasta</label>
                                    <Calendar id="to" value={to} onChange={(e) => setTo(e.value)} />
                                    {submitted && !to && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Dialog>
            <FooterComponent />
        </div>

        
    )
}
export default ListStudentComponent