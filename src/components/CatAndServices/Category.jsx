import React from 'react'

import CloseIcon from '@material-ui/icons/Close'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import {deleteCategory} from '../../requests'

export default function Category({data, update, handleUpdateCatForm, children}) 
{   
    const handleDelete = () =>
    {
        let confirmed = window.confirm('Er du sikker på du vile slette denne kategori? Alle services i kategorien flyttes til "Uden Kategori"')
        if (confirmed) deleteCategory(localStorage.getItem('apiKey'), data._id).then(update).catch(err => console.log(err.response.data.msg))
    }

    return (
        
        <div className="w-full mb-4 bg-gray-200 shadow-md rounded flex flex-col justify-center items-center">
            <div className="w-full h-12 p-4 flex justify-between items-center">
                <h3 className="text-xl text-gray-900 font-medium">{data.name}</h3>

                {data.name !== 'Uden Kategori' &&
                    <ButtonGroup>
                        <Button
                            variant="outline-secondary"
                            onClick={() => handleUpdateCatForm(data)}
                        >
                            Rediger
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="outline-danger"
                        >
                            <CloseIcon className="text-red-700" />
                        </Button>   
                    </ButtonGroup> 
                }
            </div>
            <div className="w-11/12 pb-4">
                {children}
            </div>
        </div>
    )
}
