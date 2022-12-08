import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import EventService from '../../services/EventService';
import CategoryService from '../../services/CategoryService';
import { Button } from 'primereact/button';
import './../TableCrud.css';
import { Toast } from 'primereact/toast';
import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { OrganizationChart } from 'primereact/organizationchart';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import FileService from '../../services/FileService';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import ParticipantService from '../../services/ParticipantService';

const ListEventsComponent = () => {

    const [events, setEvents] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [weightCategory, setWeightCategory] = useState();
    const [genderCategory, setGenderCategory] = useState();
    const [typeCategory, setTypeCategory] = useState();
    const [weightTypeCategory, setWeightTypeCategory] = useState(false);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [modifyCategory, setModifyCategory] = useState(false);
    const [eventId, setEventId] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [eventDialog, setEventDialog] = useState(false);
    const [deleteEventDialog, setDeleteEventDialog] = useState(false);
    const history = useHistory();
    const toast = useRef(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [fillDialog, setFillDialog] = useState(null);
    const [competitorName, setCompetitorName] = useState('');
    const [competitorLastName, setCompetitorLastName] = useState('');
    const [competitorAddress, setCompetitorAddress] = useState('');
    const [competitorBloodType, setCompetitorBloodType] = useState();
    const [competitorCell, setCompetitorCell] = useState();
    const [competitorDojo, setCompetitorDojo] = useState('');
    const [competitorCountry, setCompetitorCountry] = useState();
    const [competitorCategory, setCompetitorCategory] = useState();
    const [optionsCategories, setOptionsCategories] = useState([]);
    const [viewCamera, setViewCamera] = useState(true);
    const [diagramTournament, setDiagramTournament] = useState([{
        label: '',
        expanded: true,
        children: [
            {
                label: '',
                expanded: true,
                children: [
                    {
                        label: ''
                    },
                    {
                        label: ''
                    }
                ]
            },
            {
                label: '',
                expanded: true,
                children: [
                    {
                        label: ''
                    },
                    {
                        label: ''
                    }
                ]
            }
        ]
    }]);
    const [visibleDiagram, setVisibleDiagram] = useState(false);
    const bloodTypeSelectItems = [
        { name: 'O Negativo', code: 'O-' },
        { name: 'O Positivo', code: 'O+' },
        { name: 'A Negativo', code: 'A-' },
        { name: 'A Positivo', code: 'A+' },
        { name: 'B Negativo', code: 'B-' },
        { name: 'B Positivo', code: 'B+' },
        { name: 'AB Negativo', code: 'AB-' },
        { name: 'AB Positivo', code: 'AB+' }
    ];
    const countries = [
        { name: 'Guatemala', code: 'GT' },
        { name: 'El Salvador', code: 'SV' },
        { name: 'Nicaragua', code: 'NI' },
        { name: 'Costa Rica', code: 'CR' },
        { name: 'Honduras', code: 'HN' },
        { name: 'Panama', code: 'PA' },
        { name: 'Belice', code: 'BE' }
    ];
    const typesCategoriesOptions = [
        { name: 'KUMITE', code: 'KUMITE' },
        { name: 'KATA', code: 'KATA' }
    ];
    const genderOptions = [
        { name: 'MALE', code: 'MALE' },
        { name: 'FEMALE', code: 'FEMALE' }
    ];

    let videoRef = useRef(null);
    let photoRef = useRef(null)

    useEffect(() => {
        getAllEvents();

    }, [])

    const getAllEvents = () => {

        EventService.getAllEvents().then((response) => {
            setEvents(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    const fillOptionsCategories = (id) => {
        let catOptions = [];
        CategoryService.getCategoriesByEvent(id).then((response) => {
            console.log(response);
            response.data.forEach(category => {
                if (category.type === 'KUMITE') {
                    catOptions.push({ name: category.weight, code: category.id });
                } else {
                    catOptions.push({ name: category.gender + ' ' + category.type, code: category.id });
                }
            });
        }).catch(error => {
            console.error(error);
        })

        setOptionsCategories(catOptions);
    }

    const openNew = () => {
        setEventId('');
        setSubmitted(false);
        setEventDialog(true);
        setDeleteEventDialog(false);
        setName('');
        setDate('');
        setCategories([]);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Agregar" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            </React.Fragment>
        )
    }

    const openNewCategory = () => {
        setCategoryDialog(true);
        setWeightCategory();
        setTypeCategory({ name: 'Kate', code: 'KATA' });
        setGenderCategory({ name: 'Masculino', code: 'MALE' });
        setModifyCategory(false);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEventDialog(false);
        setEventId('');
    }

    const saveOrUpdateEvent = () => {
        setSubmitted(true);
        if (name, date, categories) {
            const event = { name, dateRange: date, categories: categories }
            console.log(event);
            if (eventId) {
                EventService.updateEvent(eventId, event).then((response) => {
                    history.push('/event')
                    getAllEvents();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Registro De Evento Modificado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            } else {
                EventService.createEvent(event).then((response) => {
                    history.push('/event')
                    getAllEvents();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Registro De Evento Agregado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            }
            setEventId('');
            setSubmitted(false);
            setEventDialog(false);
            setDeleteEventDialog(false);
            setName('');
            setDate('');
        }
    }

    const eventDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={saveOrUpdateEvent} />
        </React.Fragment>
    );

    const hideCategoryDialog = () => {
        setCategoryDialog(false);
    }

    const saveOrUpdateCategory = () => {
        let aux = [];
        let extraChar = weightTypeCategory ? "+" : "-";
        console.log(weightCategory);
        let category = {
            type: typeCategory.code,
            gender: genderCategory.code,
            weight: (weightCategory !== undefined) ? extraChar + weightCategory : 'N/A'
        }

        categories.forEach((cat) => {
            console.log(cat);
            console.log(category);
            if (!(cat.type === category.type && cat.weight === category.weight && cat.gender === category.gender)) {
                aux.push(cat);
            }
        });
        aux.push(category);
        setCategories(aux);
        setCategoryDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Categoria Exitosa', life: 3000 });
    }

    const categoryDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideCategoryDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={saveOrUpdateCategory} />
        </React.Fragment>
    );

    const header = (
        <div className="table-header">
            <h5 className="p-mx-0 p-my-1">REGISTRO DE EVENTOS</h5>
            <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerCategories = (
        <div className="table-header">
            <h5 className="p-mx-0 p-my-1">CATEGORIAS</h5>
            <React.Fragment>
                <Button label="Agregar" icon="pi pi-plus" className="p-button" onClick={openNewCategory} style={{ width: '30%' }} />
            </React.Fragment>
            <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    function formatDate(date) {

        var fDate = date.split("T")[0];
        var dd = fDate.split("-")[2];
        var mm = fDate.split("-")[1];
        var yyyy = fDate.split("-")[0];

        return dd + "/" + mm + "/" + yyyy;

    }

    const initialDateBodyFormat = (rowData) => {
        return formatDate(rowData.initialDate);
    }

    const finalDateBodyFormat = (rowData) => {
        return formatDate(rowData.finalDate);
    }

    const setEditableEvent = (editableEvent) => {
        let dateArray = [];
        dateArray.push(new Date(editableEvent.initialDate));
        dateArray.push(new Date(editableEvent.finalDate));
        setDate(dateArray);
        setName(editableEvent.name);
        setEventId(editableEvent.id);
        CategoryService.getCategoriesByEvent(editableEvent.id).then((response) => {
            setCategories(response.data);
        }).catch(error => {
            console.error(error);
        })
        setEventDialog(true);
    }

    const deleteEvent = () => {
        EventService.deleteEvent(selectedEvent.id).then((response) => {
            getAllEvents();
            hideDeleteEventDialog();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Evento Eliminado', life: 3000 });
        }).catch(error => {
            console.error(error);
        })
    }

    const hideDeleteEventDialog = () => {
        setDeleteEventDialog(false);
    }

    const hideFillEventDialog = () => {
        setFillDialog(false);
    }

    const hideDiagramDialog = () => {
        setVisibleDiagram(false);
    }

    const hideDialogCategory = () => {
        setCategoryDialog(false);
        setEventDialog(true);
    }

    const confirmDeleteEvent = (eventDeleted) => {
        setDeleteEventDialog(true);
        setName(eventDeleted.name);
        setEventId(eventDeleted.id);
        setSelectedEvent(eventDeleted);
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

    const validateInformationBeforePhoto = () => {
        console.log(competitorName);
        if (!(competitorName || competitorLastName || competitorAddress || competitorCell || competitorDojo)) {
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

    const savePicture = () => {
        fetch(imageDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], competitorName + competitorLastName + '.png', { type: "image/png" })
                FileService.createFileImage(file, competitorName + competitorLastName).then((response) => {
                    console.debug(response.data);
                    window.location.reload(false);
                    toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded Success!' });
                }).catch(error => {
                    console.error(error);
                })
            })
    }

    const clearImage = () => {
        let photo = photoRef.current
        let ctx = photo.getContext('2d')
        ctx.clearRect(0, 0, photo.width, photo.height)
    }

    const optionUpload = () => {
        if (viewCamera) {
            setViewCamera(false);
        } else {
            getVideo();
            setViewCamera(true);
        }
    }

    const customUploader = async (event) => {
        // convert file to base64 encoded 
        if (validateInformationBeforePhoto()) {
            const file = event.files[0];
            FileService.createFileImage(file, competitorName + competitorName).then((response) => {
                console.debug(response.data);
                cleanInformation();
                addCompetitor();
                toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded Success!' });
            }).catch(error => {
                console.error(error);
            })
        }
    }

    const setFillEvent = (rowData) => {
        let today = new Date;
        let dateToCompare = new Date(rowData.finalDate);
        if ( dateToCompare< today) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Evento Finalizado.' });
        } else {
            setFillDialog(true);
            fillOptionsCategories(rowData.id);
            setEventId(rowData.id);
            setName(rowData.name);
            setVisibleDiagram(false);
            getVideo();
        }
    }

    const deleteEventDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideFillEventDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteEvent} />
        </React.Fragment>
    );

    const fillDiagram = (rowData) => {

    }

    const actionBody = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => setEditableEvent(rowData)} />
                <Button icon="pi pi-database" className="p-button-rounded" onClick={() => setFillEvent(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteEvent(rowData)} />
            </React.Fragment>
        );
    }

    const setEditableCategory = (editableCategory) => {
        setTypeCategory({ name: editableCategory.type, code: editableCategory.type });
        setGenderCategory({ name: editableCategory.gender, code: editableCategory.gender });
        if (editableCategory.type === 'KUMITE') {
            let weight = editableCategory.weight.substring(1, editableCategory.weight.length);
            setWeightCategory(weight);
            setWeightTypeCategory(editableCategory.weight.charAt(0) === '+');
        } else {
            setWeightCategory();
            setWeightTypeCategory(false);
        }
        setCategoryDialog(true);
        setModifyCategory(true);
    }

    const confirmDeleteCategory = (categoryDeleted) => {

    }

    const actionBodyCategories = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => setEditableCategory(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCategory(rowData)} />
            </React.Fragment>
        );
    }

    const addCompetitor = () => {
        let competitor = {
            name: competitorName,
            lastName: competitorLastName,
            address: competitorAddress,
            bloodType: competitorBloodType.code,
            phone: competitorCell,
            dojo: competitorDojo,
            country: competitorCountry.code,
            eventId: eventId,
            categoryId: competitorCategory.code
        }
        ParticipantService.createParticipant(competitor).then((response) => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competidor Agregado', life: 3000 });
            if (viewCamera) {
                savePicture();
            }
            cleanInformation();
            setFillDialog(false);
        }).catch(error => {
            console.error(error);
        })
    }

    const eventFillDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideFillEventDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={addCompetitor} />
        </React.Fragment>
    );

    const cleanInformation = () => {
        setCompetitorName('');
        setCompetitorLastName('');
        setCompetitorAddress('');
        setCompetitorBloodType();
        setCompetitorCell();
        setCompetitorDojo('');
        setCompetitorCountry();
    }

    const nodeTemplate = (node) => {
        if (node.type === "person") {
            return (
                <div>
                    <div className="node-header">{node.label}</div>
                    <div className="node-content">
                        <img src={`http://localhost:9898/api/file/${node.avatar}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} style={{ width: '32px' }} />
                        <div>{node.label}</div>
                    </div>
                </div>
            );
        }

        return node.label;
    }

    return (
        <div className="datatable-crud">
            <HeaderComponent />
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataTable value={events}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entrenadores" globalFilter={globalFilter} header={header}
                scrollable scrollHeight="400px">
                <Column field="name" header="EVENTO" sortable style={{ minWidth: '10rem' }}></Column>
                <Column field="initialDate" header="FECHA INICIAL" sortable style={{ minWidth: '12rem' }} body={initialDateBodyFormat}></Column>
                <Column field="finalDate" header="FECHA FINAL" sortable style={{ minWidth: '12rem' }} body={finalDateBodyFormat}></Column>
                <Column body={actionBody} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            <Dialog visible={eventDialog} style={{ width: '40%' }} header="Event Details" modal className="p-fluid" footer={eventDialogFooter} onHide={hideDialog}>

                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="p-field">
                                    <label htmlFor="name">Nombre del evento:</label>
                                    <InputText id="name" value={name} onChange={(t) => setName(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !name })} />
                                    {submitted && !name && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="p-field">
                                    <label>Fechas del evento:</label>
                                    <Calendar value={date} onChange={(e) => setDate(e.value)} selectionMode="range" showWeek />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <DataTable value={categories}
                                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entrenadores" globalFilter={globalFilter} header={headerCategories}
                                scrollable scrollHeight="400px">
                                <Column field="weight" header="PESO" sortable style={{ minWidth: '10rem' }}></Column>
                                <Column field="gender" header="GENERO" sortable style={{ minWidth: '10rem' }}></Column>
                                <Column field="type" header="TIPO" sortable style={{ minWidth: '10rem' }}></Column>
                                <Column body={actionBodyCategories} exportable={false} style={{ minWidth: '8rem' }}></Column>
                            </DataTable>
                        </tr>
                    </tbody>
                </table>
            </Dialog>
            <Dialog visible={deleteEventDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEventDialogFooter} onHide={hideDeleteEventDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {selectedEvent && <span> Esta seguro de borrar <b>{selectedEvent.name}</b> ? </span>}
                </div>
            </Dialog>
            <Dialog visible={fillDialog} style={{ width: '80%' }} header="Ingreso de Participantes" modal footer={eventFillDialogFooter} onHide={hideFillEventDialog}>
                <div style={{ width: '100%', padding: '5% 0 0', margin: 'auto' }}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <label htmlFor="competitorName">Nombre del participante: </label>
                                                </td>
                                                <td>
                                                    <InputText id="competitorName" value={competitorName} style={{ width: '100%' }} onChange={(t) => setCompetitorName(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !competitorName })} />
                                                    {submitted && !competitorName && <small className="p-error">Campo Requerido.</small>}
                                                </td>
                                                <td>
                                                    <label htmlFor="competitorLastName">Apellido del participante: </label>
                                                </td>
                                                <td>
                                                    <InputText id="competitorLastName" value={competitorLastName} style={{ width: '100%' }} onChange={(t) => setCompetitorLastName(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !competitorLastName })} />
                                                    {submitted && !competitorLastName && <small className="p-error">Campo Requerido.</small>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label htmlFor="competitorAddress">Direccion del participante: </label>
                                                </td>
                                                <td colSpan={3}>
                                                    <InputText id="competitorAddress" style={{ width: '100%' }} value={competitorAddress} onChange={(t) => setCompetitorAddress(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !competitorAddress })} />
                                                    {submitted && !competitorAddress && <small className="p-error">Campo Requerido.</small>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label htmlFor="competitorBloodType">Tipo De Sangre: </label>
                                                </td>
                                                <td>
                                                    <Dropdown id="competitorBloodType" value={competitorBloodType} options={bloodTypeSelectItems} onChange={(t) => setCompetitorBloodType(t.target.value)} optionLabel="name" placeholder="Seleccione tipo de sangre..." required autoFocus className={classNames({ 'p-invalid': submitted && !competitorBloodType })} />
                                                    {submitted && !competitorBloodType && <small className="p-error">Campo Requerido.</small>}
                                                </td>
                                                <td>
                                                    <label htmlFor="competitorCell">Telefono: </label>
                                                </td>
                                                <td>
                                                    <InputNumber id="competitorCell" value={competitorCell} onChange={(t) => setCompetitorCell(t.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !competitorCell })} useGrouping={false} />
                                                    {submitted && !competitorCell && <small className="p-error">Campo Requerido.</small>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label htmlFor="competitorDojo">Dojo: </label>
                                                </td>
                                                <td colSpan={3}>
                                                    <InputText id="competitorDojo" value={competitorDojo} style={{ width: '100%' }} onChange={(t) => setCompetitorDojo(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !competitorDojo })} />
                                                    {submitted && !competitorDojo && <small className="p-error">Campo Requerido.</small>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label htmlFor="competitorCountry">Pais: </label>
                                                </td>
                                                <td>
                                                    <Dropdown id="competitorCountry" value={competitorCountry} style={{ width: '100%' }} options={countries} onChange={(t) => setCompetitorCountry(t.target.value)} optionLabel="name" filter showClear filterBy="name" placeholder="Seleccione Pais" required autoFocus className={classNames({ 'p-invalid': submitted && !competitorCountry })} />
                                                    {submitted && !competitorCountry && <small className="p-error">Campo Requerido.</small>}
                                                </td>
                                                <td>
                                                    <label htmlFor="competitorCategory">Categoria: </label>
                                                </td>
                                                <td>
                                                    <Dropdown id="competitorCategory" value={competitorCategory} style={{ width: '100%' }} options={optionsCategories} onChange={(t) => setCompetitorCategory(t.target.value)} optionLabel="name" filter showClear filterBy="name" placeholder="Seleccione Categoria" required autoFocus className={classNames({ 'p-invalid': submitted && !competitorCategory })} />
                                                    {submitted && !competitorCategory && <small className="p-error">Campo Requerido.</small>}
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
                                                        <Image src={"http://localhost:9898/api/file/" + competitorName + competitorName} alt="Image" width="250" />
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
                        </tbody>
                    </table>
                </div>
            </Dialog >
            <Dialog visible={categoryDialog} style={{ width: '30%' }} header="Categoria" modal onHide={hideDialogCategory} footer={categoryDialogFooter}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="p-field">
                                    <label htmlFor="typeCategory">Tipo de Categoria: </label>
                                    <Dropdown id="typeCategory" value={typeCategory} options={typesCategoriesOptions} onChange={(t) => setTypeCategory(t.target.value)} optionLabel="name" placeholder="Seleccione tipo categoria..." required autoFocus className={classNames({ 'p-invalid': submitted && !typeCategory })} />
                                    {submitted && !typeCategory && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                            {typeCategory?.code === 'KUMITE' ? <td>
                                <label style={{ fontWeight: 'bold' }}>{weightTypeCategory ? 'Mas (+)' : 'Menos (-)'}</label>
                                <InputSwitch checked={weightTypeCategory} onChange={(e) => setWeightTypeCategory(e.value)} />
                            </td> : null}
                            {typeCategory?.code === 'KUMITE' ?
                                <td>
                                    <div className="p-field">
                                        <label htmlFor="weightCategory">Peso: </label>
                                        <InputText id="weightCategory" value={weightCategory} onChange={(t) => setWeightCategory(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !weightCategory })} />
                                        {submitted && !weightCategory && <small className="p-error">Campo Requerido.</small>}
                                    </div>
                                </td> : null}
                        </tr>
                        <tr>
                            <td>
                                <div className="p-field">
                                    <label htmlFor="typeCategory">Genero: </label>
                                    <Dropdown id="typeCategory" value={genderCategory} options={genderOptions} onChange={(t) => setGenderCategory(t.target.value)} optionLabel="name" placeholder="Seleccione genero..." required autoFocus className={classNames({ 'p-invalid': submitted && !genderCategory })} />
                                    {submitted && !genderCategory && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Dialog>
            <Dialog visible={visibleDiagram} style={{ width: '50%' }} header="Ingreso de Participantes" modal onHide={hideDiagramDialog}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <OrganizationChart value={diagramTournament} nodeTemplate={nodeTemplate}></OrganizationChart>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Dialog>
            <FooterComponent />
        </div >
    )

}
export default ListEventsComponent