import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal';

import { State } from '../../../redux/store'
import { hideForm } from '../../../redux/slices/actions'
import { Appointment } from './Appointment';

const customStyles = {
    overlay: {
        zIndex: '20'
    },
    content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: 0,
        borderRadius: '7px'
    }
};

Modal.setAppElement('#__next')

export const FormProvider = ({ children }) => {
    const formState: State["form"] = useSelector((state: State) => state.form)
    console.log(formState);

    const dispatch = useDispatch()

    const closeForm = () => dispatch(hideForm())

    var FormComponent: React.FC<any> | undefined

    switch(formState.type) {
        case 'appointment':
            FormComponent = Appointment
        default:
    }
    
    return (
        <>
            {children}
            <Modal
                isOpen={formState.isOpen}
                onRequestClose={closeForm}
                contentLabel="Example Modal"
                style={customStyles}
            >
                { FormComponent && <FormComponent {...formState.props} /> }
            </Modal>
        </>
    )
}
