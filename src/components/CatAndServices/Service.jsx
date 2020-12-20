import React from 'react'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import CloseIcon from '@material-ui/icons/Close'

import ListGroup from 'react-bootstrap/ListGroup'

import {deleteService} from '../../requests'

export default function Service({service, update, handleUpdateForm}) 
{
    const handleDelete = () =>
    {
        let confirmed = window.confirm('Er du sikker på du vile slette denne service? Alle bookinger vil stadig være aktuelle')
        if (confirmed) deleteService(localStorage.getItem('apiKey'), service._id).then(() => update()).catch(err => console.log(err.response.data.msg))
    }

    return (
        <ListGroup.Item as="li" className="w-full py-1 rounded shadow-xs bg-gray-100 flex flex-col md:flex-row justify-between items-center">
            <h4 className="text-lg font-medium w-full text-center md:text-left md:w-1/4">{service.name}</h4>

            <p className="whitespace-no-wrap overflow-hidden mt-2 md:mt-0 w-full text-center md:text-left md:w-1/2 md:mx-6">{service.description}</p>

            <div className="flex py-2 justify-center md:justify-between items-center w-full md:w-1/4">
                <ButtonGroup>
                    <Button
                        variant="outline-secondary"
                        onClick={() => handleUpdateForm(service)}
                    >
                        Rediger
                    </Button>
                    <Button
                        variant="outline-danger"
                        onClick={handleDelete}
                    >
                        <CloseIcon className="text-red-700" />
                    </Button>  
                </ButtonGroup>
            </div>
        </ListGroup.Item>
    )
}
