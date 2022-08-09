import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import PaymentService from './../../services/PaymentService';

const ListPaymentComponent = () => {

    const [payments, setPayments] = useState([]);

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

}
export default ListPaymentComponent