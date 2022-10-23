import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
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
import './../TableCrud.css';
import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import PaymentService from './../../services/PaymentService';
import StudentService from './../../services/StudentService';
import { ToggleButton } from 'primereact/togglebutton';
import { InputNumber } from 'primereact/inputnumber';

const ListPaymentComponent = () => {

    const [payments, setPayments] = useState([]);
    const [id, setId] = useState(null);
    const [paymentDate, setPaymentDate] = useState('');
    const [depositTicket, setDepositTicket] = useState('');
    const [month, setMonth] = useState('');
    const [value, setValue] = useState(0);
    const [latePayment, setLatePayment] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [deletePaymentDialog, setDeletePaymentDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [globalFilter, setGlobalFilter] = useState(null);
    const [students, setStudents] = useState([]);
    const history = useHistory();
    const toast = useRef(null);

    const monthTypesSelectItems = [
        { label: 'ENERO', value: 'ENERO' },
        { label: 'FEBRERO', value: 'FEBRERO' },
        { label: 'MARZO', value: 'MARZO' },
        { label: 'ABRIL', value: 'ABRIL' },
        { label: 'MAYO', value: 'MAYO' },
        { label: 'JUNIO', value: 'JUNIO' },
        { label: 'JULIO', value: 'JULIO' },
        { label: 'AGOSTO', value: 'AGOSTO' },
        { label: 'SEPTIEMBRE', value: 'SEPTIEMBRE' },
        { label: 'OCTUBRE', value: 'OCTUBRE' },
        { label: 'NOVIEMBRE', value: 'NOVIEMBRE' },
        { label: 'DICIEMBRE', value: 'DICIEMBRE' }
    ];

    useEffect(() => {
        getAllPayments();
    }, [])

    const getAllPayments = () => {

        PaymentService.getAllPayments().then((response) => {
            setPayments(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    const getAllStudents = () => {

        StudentService.getAllStudents().then((response) => {
            setStudents(response.data);
        }).catch(error => {
            console.error(error);
        })
    }

    const openNew = () => {
        getAllStudents();
        setPaymentDate('');
        setDepositTicket('');
        setMonth('');
        setValue(0);
        setLatePayment(false);
        setStudentId('');
        setSubmitted(false);
        setPaymentDialog(true);
        setDeletePaymentDialog(false);
    }

    const confirmDeletePayment = (paymentDeleted) => {
        setDeletePaymentDialog(true);
        setMonth(paymentDeleted.month);
        setStudentId(paymentDeleted.studentId);
        setSelectedPayment(paymentDeleted);
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
            <h5 className="p-mx-0 p-my-1">REGISTRO DE PAGOS</h5>
            <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const hideDialog = () => {
        setSubmitted(false);
        setPaymentDialog(false);
        setId('');
    }

    const setEditablePayment = (editablePayment) => {
        getAllStudents();
        setPaymentDate(new Date(editablePayment.paymentDate));
        setDepositTicket(editablePayment.depositTicket);
        setMonth(editablePayment.month);
        setValue(editablePayment.value);
        setLatePayment(editablePayment.latePayment);
        setPaymentDialog(true);
        setStudentId(editablePayment.student.id);
        setId(editablePayment.id);
    }

    const saveOrUpdatePayment = () => {
        setSubmitted(true);
        if (paymentDate && depositTicket && month && value && studentId) {
            const payment = { paymentDate, depositTicket, month, latePayment, studentId, value }
            if (id) {
                PaymentService.updatePayment(id, payment).then((response) => {
                    history.push('/payment')
                    getAllPayments();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Registro De Pago Modificado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            } else {
                PaymentService.createPayment(payment).then((response) => {
                    history.push('/payment')
                    getAllPayments();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Registro De Pago Agregado', life: 3000 });
                }).catch(error => {
                    console.error(error);
                })
            }
            setPaymentDate('');
            setDepositTicket('');
            setMonth('');
            setValue(0);
            setLatePayment(false);
            setStudentId('');
            setSubmitted(false);
            setPaymentDialog(false);
            setDeletePaymentDialog(false);
        }
    }

    const paymentDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-text" onClick={saveOrUpdatePayment} />
        </React.Fragment>
    );

    const hideDeletePaymentDialog = () => {
        setDeletePaymentDialog(false);
    }

    const deletePayment = () => {
        PaymentService.deletePayment(selectedPayment.id).then((response) => {
            getAllPayments();
            hideDeletePaymentDialog();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Registro De Pago Eliminado', life: 3000 });
        }).catch(error => {
            console.error(error);
        })
    }

    const deletePaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePaymentDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePayment} />
        </React.Fragment>
    );

    const actionBody = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => setEditablePayment(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePayment(rowData)} />
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
        return formatDate(rowData.paymentDate);
    }

    const status = (rowData) => {
        if (rowData.latePayment === true) {
            return "MORA";
        } else {
            return "PUNTUAL";
        }
    }

    return (
        <div className="datatable-crud">
            <HeaderComponent />
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataTable value={payments}
                dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entrenadores" globalFilter={globalFilter} header={header}
                scrollable scrollHeight="400px">
                <Column field="paymentDate" header="FECHA DE PAGO" sortable style={{ minWidth: '10rem' }} body={dateBodyFormat}></Column>
                <Column field="depositTicket" header="ID DE COMPROBANTE" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="month" header="MES" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="value" header="VALOR DE CUOTA" sortable style={{ minWidth: '12rem' }}></Column>
                <Column body={status} header="PAGO TARDIO" sortable style={{ minWidth: '12rem' }}></Column>
                <Column body={actionBody} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            <Dialog visible={paymentDialog} style={{ width: '40%' }} header="Payment Details" modal className="p-fluid" footer={paymentDialogFooter} onHide={hideDialog}>

                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="p-field">
                                    <label htmlFor="student">Grado</label>
                                    <Dropdown id="student" optionLabel="name" optionValue="id" value={studentId} options={students} onChange={(t) => setStudentId(t.target.value)} placeholder="Seleccione estudiante..." required autoFocus className={classNames({ 'p-invalid': submitted && !studentId })} />
                                    {submitted && !studentId && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                            <td>
                                <div className="p-field p-col-12 p-md-4">
                                    <label htmlFor="paymentDate">Fecha De Pago</label>
                                    <Calendar id="paymentDate" value={paymentDate} onChange={(t) => setPaymentDate(t.value)} showButtonBar dateFormat="dd/mm/yy" required autoFocus className={classNames({ 'p-invalid': submitted && !paymentDate })} />
                                    {submitted && !paymentDate && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="p-field">
                                    <label htmlFor="depositTicket">No. Deposito | No. Transferencia</label>
                                    <InputText id="depositTicket" value={depositTicket} onChange={(t) => setDepositTicket(t.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !depositTicket })} />
                                    {submitted && !depositTicket && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                            <td>
                                <div className="p-field">
                                    <label htmlFor="month">Mes de Pago</label>
                                    <Dropdown value={month} options={monthTypesSelectItems} onChange={(t) => setMonth(t.target.value)} optionLabel="label" placeholder="Seleccione mes correspondiente al pago..." required autoFocus className={classNames({ 'p-invalid': submitted && !month })} />
                                    {submitted && !month && <small className="p-error">Campo Requerido.</small>}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="p-field">
                                    <label htmlFor="value">Valor Del Pago</label>
                                    <InputNumber inputId="value" value={value} onValueChange={(e) => setValue(e.value)} />
                                </div>
                            </td>
                            <td>
                                <div className="p-field">
                                    <ToggleButton checked={latePayment} onChange={(e) => setLatePayment(e.value)} onLabel="MORA" offLabel="PUNTUAL" onIcon="pi pi-times" offIcon="pi pi-check" style={{ width: '10em' }} aria-label="Confirmation" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Dialog>

            <Dialog visible={deletePaymentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePaymentDialogFooter} onHide={hideDeletePaymentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {selectedPayment && <span> Esta seguro de borrar el pago de  <b>{month}</b> del alumno con carnet <b>{studentId}</b> ? </span>}
                </div>
            </Dialog>
            <FooterComponent />
        </div>
    )

}
export default ListPaymentComponent