import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import StudentService from './../../services/StudentService';
import TrainerService from './../../services/TrainerService';

const Dashboard = () => {

    const [students, setStudents] = useState();
    const [trainers, setTrainers] = useState();
    const [chartData, setCharData] = useState();
    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    });

    const [basicData, setBasicData] = useState();

    useEffect(() => {
        getStudents();
        getTrainers();
        setBasicData({
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                {
                    label: 'Ingresos (Q)',
                    data: [1000,1500,2500,1500,3000,3000,3500,3000,1500,2000,2500,3000],
                    fill: true,
                    borderColor: '#66BB6A',
                    tension: .4
                },
                {
                    label: 'Ingresos Año Anterior (Q)',
                    data: [500,500,500,500,300,300,350,300,150,200,200,300],
                    fill: false,
                    borderDash: [5, 5],
                    tension: .4,
                    borderColor: '#66BB6A'
                }
            ]
        });
        setCharData({
            labels: ['Estudiantes', 'Entrenadores'],
            datasets: [
                {
                    data: [students, trainers],
                    backgroundColor: [
                        "#42A5F5",
                        "#66BB6A",
                    ],
                    hoverBackgroundColor: [
                        "#64B5F6",
                        "#81C784",
                    ]
                }
            ]
        });


    }, [students, trainers]);

    const getStudents = () => {
        StudentService.getStudentQuantity().then((response) => {
            console.log(response);
            setStudents(response.data);
            console.log("Students: " + response.date);
        }).catch(error => {
            console.error(error);
        })
    }

    const getTrainers = () => {
        TrainerService.getTrainerQuantity().then((response) => {

            setTrainers(response.data);
            console.log("Trainers: " + response.date);

        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <div className="datatable-crud">
            <HeaderComponent />
            <Chart type="polarArea" data={chartData} options={lightOptions} style={{ position: 'relative', width: '20%' }} />
            <Chart type="line" data={basicData} style={{ position: 'relative', width: '30%' }} />
            <FooterComponent />
        </div>
    )
}
export default Dashboard