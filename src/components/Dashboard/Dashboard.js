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

    useEffect(() => {

        getStudents();
        getTrainers();
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


    }, []);

    const getStudents = () => {
        StudentService.getStudentQuantity().then((response) => {

            setStudents(response.data);

        }).catch(error => {
            console.error(error);
        })
    }

    const getTrainers = () => {
        TrainerService.getTrainerQuantity().then((response) => {

            setTrainers(response.data);

        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <div className="datatable-crud">
            <HeaderComponent />
            <Chart type="polarArea" data={chartData} options={lightOptions} style={{ position: 'relative', width: '40%' }} />
            <FooterComponent />
        </div>
    )
}
export default Dashboard