import React from 'react'

import {IconButton, Button} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import {deleteCategory} from '../requests'
import axios from 'axios'
import Service from './Service'

export default function Category({catAndServices, update, handleUpdateCatForm, handleUpdateServiceForm}) 
{   
    const handleDelete = () =>
    {
        let confirmed = window.confirm('Er du sikker på du vile slette denne kategori? Alle services i kategorien flyttes til "Uden Kategori"')
        if (confirmed) deleteCategory(localStorage.getItem('apiKey'), catAndServices.category._id).then(() => update()).catch(err => console.log(err.response.data.msg))
    }

    return (
        
        <div className="w-10/12 mb-4 border-blue-300 shadow rounded flex flex-col justify-center items-center">
            <div className={catAndServices.category.name === 'Uden Kategori' ? "w-full bg-gray-200 py-2 px-4 rounded shadow-sm flex justify-between items-center" : "w-full px-4 bg-gray-200 rounded shadow-sm flex justify-between items-center"}>
                <h3 className="text-xl text-gray-900 font-medium">{catAndServices.category.name}</h3>

                {catAndServices.category.name !== 'Uden Kategori' ?
                <div>
                    <Button
                        color="primary"
                        onClick={() => handleUpdateCatForm(catAndServices.category)}
                    >
                        Rediger
                    </Button>
                    <IconButton
                        onClick={handleDelete}
                    >
                        <CloseIcon className="text-red-700" />
                    </IconButton>   
                </div> 
                 : null}
            </div>
            <div className="w-11/12">
                {catAndServices.services.length > 0 ? 
                catAndServices.services.map((service, i) => <Service handleUpdateForm={handleUpdateServiceForm} update={update} service={service} key={i} />) 
                : 
                <h4 className=" py-4 text-lg text-gray-900 text-center">
                    Ingen services i denne kategori
                </h4>
                }
            </div>
        </div>
    )
}
