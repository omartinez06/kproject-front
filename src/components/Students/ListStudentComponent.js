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
import './../TableCrud.css';

const ListStudentComponent = () => {

    const [students, setStudents] = useState([]);
    const [kyus, setKyus] = useState([]);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [kyuId, setKyuId] = useState('');
    const [dpi, setDpi] = useState('');
    const [birth, setBirth] = useState('');
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

}