import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import TrainerService from './../../services/TrainerService';
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
import './../TableCrud.css';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import FileService from '../../services/FileService';
import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';

const ListTrainerComponent = () => {

    const [trainers, setTrainers] = useState([]);
    const [kyus, setKyus] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [id, setId] = useState(null);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [kyuId, setKyuId] = useState('');
    const [dpi, setDpi] = useState('');
    const [birth, setBirth] = useState('');
    const [trainerDialog, setTrainerDialog] = useState(false);
    const [deleteTrainerDialog, setDeleteTrainerDialog] = useState(false);
    const history = useHistory();
    const toast = useRef(null);
    const [viewUpload, setViewUpload] = useState(false);

    useEffect(() => {
        getAllTrainers();
    }, [])

    const getAllTrainers = () => {
        TrainerService.getAllTrainers().then((response) => {

            setTrainers(response.data)

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

    const openNew = () => {
        setName('');
        setLastName('');
        setDpi('');
        setBirth('');
        setKyuId('');
        getAllKyus();
        setSubmitted(false);
        setTrainerDialog(true);
    }

    const confirmDeleteTrainer = (trainerDeleted) => {
        setDeleteTrainerDialog(true);
        setName(trainerDeleted.name);
        setLastName(trainerDeleted.lastName);
        setId(trainerDeleted.id);
        setSelectedTrainer(trainerDeleted);
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
            <h5 className="p-mx-0 p-my-1">ENTRENADORES</h5>
            <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const hideDialog = () => {
        setSubmitted(false);
        setTrainerDialog(false);
        setId('');
    }

    const setEditableTrainer = (editableTrainer) => {
        getAllKyus();
        setName(editableTrainer.name);
        setLastName(editableTrainer.lastName);
        setDpi(editableTrainer.dpi);
        setBirth(new Date(editableTrainer.birth));
        setKyuId(editableTrainer.kyu.id);
        setId(editableTrainer.id);
        setViewUpload(true);
        setTrainerDialog(true);
    }

    const saveOrUpdateTrainer = () => {
        setSubmitted(true);
        if (name && lastName && dpi && birth && kyuId) {
            const trainer = { name, lastName, kyuId, birth, dpi }
            if (id) {
                TrainerService.updateTrainer(id, trainer).then((response) => {
                    history.push('/trainer')
                    getAllTrainers();
                    setTrainerDialog(false);
                    setName('');
                    setLastName('');
                    setDpi('');
                    setBirth('');
                    setKyuId('');
                    setId('');
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Entrenador Modificado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            } else {
                TrainerService.createTrainer(trainer).then((response) => {
                    setViewUpload(true);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Entrenador Creado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            }
        }
    }

    const customUploader = async (event) => {
        // convert file to base64 encoded 
        const file = event.files[0];
        FileService.createFileImage(file, dpi).then((response) => {
            console.debug(response.data);
            history.push('/trainer');
            getAllTrainers();
            setTrainerDialog(false);
            setName('');
            setLastName('');
            setDpi('');
            setBirth('');
            setKyuId('');
            setId('');
            window.location.reload(false);
            toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded Success!' });
        }).catch(error => {
            console.error(error);
        })
    }

    const trainerDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={saveOrUpdateTrainer} />
        </React.Fragment>
    );

    const hideDeleteTrainerDialog = () => {
        setDeleteTrainerDialog(false);
    }

    const deleteTrainer = () => {
        TrainerService.deleteTrainer(selectedTrainer.id).then((response) => {
            getAllTrainers();
            hideDeleteTrainerDialog();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Entrenador Eliminado', life: 3000 });
        }).catch(error => {
            console.error(error);
        })
    }

    const deleteTrainerDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTrainerDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteTrainer} />
        </React.Fragment>
    );

    const actionBody = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => setEditableTrainer(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTrainer(rowData)} />
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
    
    const imageBodyTemplate = (rowData) => {
        return <img src={"http://localhost:9898/api/file/" + rowData.dpi} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="60%" className="product-image" />
    }

    return (
        <div className="datatable-crud">
            <HeaderComponent />
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataTable value={trainers}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entrenadores" globalFilter={globalFilter} header={header}
                scrollable scrollHeight="400px">
                <Column field="image" header="IMAGEN" body={imageBodyTemplate}></Column>
                <Column field="name" header="NOMBRE" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="lastName" header="APELLIDO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="birth" header="FECHA NACIMIENTO" sortable style={{ minWidth: '12rem' }} body={dateBodyFormat}></Column>
                <Column field="dpi" header="DPI" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="kyu.kyu" header="GRADO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column body={actionBody} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            <Dialog visible={trainerDialog} style={{ width: '50%' }} header="Trainer Details" modal className="p-fluid" footer={trainerDialogFooter} onHide={hideDialog}>
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
                                                    <label htmlFor="dpi">DPI</label>
                                                    <InputText id="dpi" value={dpi} onChange={(t) => setDpi(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !dpi })} />
                                                    {submitted && !dpi && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>
                                                <div className="p-field">
                                                    <label htmlFor="kyu">Grado</label>
                                                    <Dropdown id="kyu" optionLabel="kyu" optionValue="id" value={kyuId} options={kyus} onChange={(t) => setKyuId(t.target.value)} placeholder="Select Kyu..." required autoFocus className={classNames({ 'p-invalid': submitted && !kyuId })} />
                                                    {submitted && !kyuId && <small className="p-error">Campo Requerido.</small>}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                {viewUpload ?
                                    <div>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <Image src={"http://localhost:9898/api/file/" + dpi} alt="Image" width="250" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <FileUpload mode="basic" name="files[]" url="localhost:9898/api/file" accept=".jpg" maxFileSize={1000000} customUpload uploadHandler={customUploader} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    : null}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Dialog>

            <Dialog visible={deleteTrainerDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTrainerDialogFooter} onHide={hideDeleteTrainerDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {selectedTrainer && <span> Esta seguro de borrar a <b>{name} {lastName}</b> ? </span>}
                </div>
            </Dialog>
            <FooterComponent />
        </div>
    )

}

export default ListTrainerComponent