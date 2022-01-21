import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom';
import KyuService from '../../services/KyuService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import './../TableCrud.css';

const ListKyuComponent = () => {

    const [kyus, setKyus] = useState([]);
    const [kyu, setKyu] = useState('');
    const [id, setId] = useState(null);
    const [kyuDialog, setKyuDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [deleteKyuDialog, setDeleteKyuDialog] = useState(false);
    const [selectedKyu, setSelectedKyu] = useState(null);
    const history = useHistory();
    const toast = useRef(null);

    useEffect(() => {

        getAllKyus();

        validateKyu();

    }, []);

    const validateKyu = () => {
        if (id) {
            KyuService.getKyuById(id).then((response) => {
                setKyu(response.data.kyu)
            }).catch(error => {
                console.error(error)
            })
        }
    }

    const getAllKyus = () => {
        KyuService.getAllKyus().then((response) => {

            setKyus(response.data)

        }).catch(error => {
            console.error(error);
        })
    }

    const openNew = () => {
        setKyu('');
        setSubmitted(false);
        setKyuDialog(true);
    }

    const confirmDeleteKyu = (kyu) => {
        setDeleteKyuDialog(true);
        setSelectedKyu(kyu);
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
            <h5 className="p-mx-0 p-my-1">GRADOS</h5>
            <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const hideDialog = () => {
        setSubmitted(false);
        setKyuDialog(false);
    }

    const setEditableKyu = (editableKyu) => {
        setKyu(editableKyu.kyu);
        setKyuDialog(true);
        setId(editableKyu.id);
    }

    const saveOrUpdateKyu = () => {
        setSubmitted(true);
        if (kyu.trim()) {
            const kyuFinal = { kyu }
            if (id) {
                KyuService.updateKyu(id, kyuFinal).then((response) => {
                    history.push('/kyu')
                    getAllKyus();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Grado Modificado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            }
            else {
                KyuService.createKyu(kyuFinal).then((response) => {
                    history.push('/kyu');
                    getAllKyus();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Grado Creado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            }
            setKyuDialog(false);
            setKyu('');
        }
    }

    const kyuDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={saveOrUpdateKyu} />
        </React.Fragment>
    );

    const hideDeleteKyuDialog = () => {
        setDeleteKyuDialog(false);
    }

    const deleteKyu = () => {
        KyuService.deleteKyu(selectedKyu.id).then((response) => {
            getAllKyus();
            hideDeleteKyuDialog();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Grado Eliminado', life: 3000 });
        }).catch(error => {
            console.error(error);
        })
    }

    const deleteKyuDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteKyuDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteKyu} />
        </React.Fragment>
    );

    const actionBody = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => setEditableKyu(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteKyu(rowData)} />
            </React.Fragment>
        );
    }

    return (
        <div className="datatable-crud">
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataTable value={kyus}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} kyus" globalFilter={globalFilter} header={header}
                scrollable scrollHeight="400px">
                <Column field="kyu" header="KYU" sortable style={{ minWidth: '12rem' }}></Column>
                <Column body={actionBody} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            <Dialog visible={kyuDialog} style={{ width: '450px' }} header="Kyu Details" modal className="p-fluid" footer={kyuDialogFooter} onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="kyu">Grado</label>
                    <InputText id="kyu" value={kyu} onChange={(k) => setKyu(k.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !kyu })} />
                    {submitted && !kyu && <small className="p-error">Kyu is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteKyuDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteKyuDialogFooter} onHide={hideDeleteKyuDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {selectedKyu && <span> Esta seguro de borrar <b>{selectedKyu.kyu}</b> ? </span>}
                </div>
            </Dialog>
        </div>
    )
}

export default ListKyuComponent