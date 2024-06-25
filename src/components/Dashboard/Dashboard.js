import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import HeaderComponent from '../HeaderComponent';
import FooterComponent from '../FooterComponent';
import StudentService from './../../services/StudentService';
import TrainerService from './../../services/TrainerService';
import PaymentService from '../../services/PaymentService';
import { Card } from 'primereact/card';
import ScheduleService from '../../services/ScheduleService';

const Dashboard = () => {

    const [students, setStudents] = useState();
    const [trainers, setTrainers] = useState();
    const [chartData, setCharData] = useState();
    const [schedule, setSchedule] = useState();
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
    const [monthValue, setMonthValue] = useState([]);

    useEffect(() => {
        getPaymentReport();
        getStudents();
        getTrainers();
        getSchedules();
        setCharData({
            labels: ['Estudiantes', 'Entrenadores', 'Horarios'],
            datasets: [
                {
                    data: [students, trainers, schedule],
                    backgroundColor: [
                        "#42A5F5",
                        "#66BB6A",
                        "#F0FA0A"
                    ],
                    hoverBackgroundColor: [
                        "#64B5F6",
                        "#81C784",
                        "#A3FA0A"
                    ]
                }
            ]
        });
    }, [students, trainers, schedule]);

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

    const getPaymentReport = () => {

        PaymentService.getPaymentPerMonth().then((response) => {
            let dataLabel = [];
            let dataValues = [];
            for (let x = 0; x < response.data.length; x++) {
                dataLabel.push(response.data[x].month);
                dataValues.push(response.data[x].value);
            }

            setBasicData({
                labels: dataLabel,
                datasets: [
                    {
                        label: 'Ingresos (Q)',
                        data: dataValues,
                        fill: true,
                        borderColor: '#66BB6A',
                        tension: .4
                    }
                ]
            });
        }).catch(error => {
            console.error(error);
        })
    }

    const getSchedules = () => {
        ScheduleService.getStudentQuantity().then((response) => {

            setSchedule(response.data);
            console.log("Schedules: " + response.date);

        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <div className="datatable-crud">
            <HeaderComponent />
            <div className="grid">
                <div className="col-4" style={{ textAlign: 'center' }}>
                    <Card title="Estudiantes y Alumnos Totales" style={{ width: '25em' }}>
                        <Chart type="polarArea" data={chartData} options={lightOptions} />
                    </Card>
                </div>
                <div className="col-4" style={{ textAlign: 'center' }}>
                    <Card title="Ingresos Año Actual" style={{ width: '40em' }}>
                        <Chart type="line" data={basicData} />
                    </Card>
                </div>
            </div>
            <FooterComponent />
        </div>
    )
}
export default Dashboard