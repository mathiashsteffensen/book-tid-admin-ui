import React from 'react'

import ReactModal from 'react-modal'
ReactModal.setAppElement('body')
import AddCategory from './AddCategory';
import UpdateCategory from './UpdateCategory'
import AddService from './AddService'
import UpdateService from './UpdateService';
import Avatar from './AvatarForm';
import ColorForm from './ColorForm';
import OpeningHours from './multipartforms/openinghours/OpeningHours'
import CreateCustomer from './CreateCustomer'
import UpdateCustomer from './UpdateCustomer'
import AddBooking from './AddBooking'

export default function Form({formType, formProps, isOpen, handleClose}) 
{
    if (formType)
    {
        var FormComponent;
        switch(formType)
        {
            case 'create-category':
                FormComponent = AddCategory
                break;
            case 'update-category':
                FormComponent = UpdateCategory
                break;
            case 'create-service':
                FormComponent = AddService
                break;
            case 'update-service':
                FormComponent = UpdateService
                break;
            case 'avatar':
                FormComponent = Avatar
                break;
            case 'color':
                FormComponent = ColorForm
                break;
            case 'opening-hours':
                FormComponent = OpeningHours
                break;
            case 'create-customer':
                FormComponent = CreateCustomer
                break;
            case 'update-customer':
                FormComponent = UpdateCustomer
                break;
            case 'create-booking':
                FormComponent = AddBooking
                break;
            default:
                break;
        }

        return (
            <ReactModal
                isOpen={isOpen}
                onRequestClose={handleClose}
                className="flex outline-none justify-center items-center lg:mx-48 mx-4"
                overlayClassName="popupOverlay"
            >
                
                <FormComponent closeForm={handleClose} formProps={formProps} />
            </ReactModal>
        )
    } else return <div></div>
    
}
