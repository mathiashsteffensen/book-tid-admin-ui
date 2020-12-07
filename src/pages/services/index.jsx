import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Category from '../../components/Category'
import Form from '../../components/forms/Form'
import Main from '../../components/Main'

import {Button} from '@material-ui/core'

import {getCatsAndServices} from '../../requests'


export default function Services() 
{
    // Change this state value to force an update
    const [shouldUpdate, setUpdate] = useState(true)

    const update = () =>
    {
        setUpdate(!shouldUpdate)
    }

    // Holds the category and services information
    const [catsAndServices, setCatsAndServices] = useState(undefined)

    // State for handling pop up forms
    const [showForm, setShowForm] = useState(false)
    const [formType, setFormType]  = useState('')
    const [formProps, setFormProps]  = useState('')

    const abortController = axios.CancelToken.source()

    let handleCreateCatForm = () =>
    {
        setFormType('create-category')
        setShowForm(true)
    }

    let handleUpdateCatForm = (category) =>
    {
        setFormType('update-category')
        setFormProps(category)
        setShowForm(true)
    }

    let handleCreateServiceForm = () =>
    {
        setFormType('create-service')
        setFormProps({categoryList: catsAndServices.map((catAndServices) => catAndServices.category)})
        setShowForm(true)
    }

    let handleUpdateServiceForm = (service) =>
    {
        setFormType('update-service')
        setFormProps({
            categoryList: catsAndServices.map((catAndServices) => catAndServices.category),
            initial: service
        })
        setShowForm(true)
    }

    let handleCloseForm = () =>
    {
        setShowForm(false)
        setFormType('')
        setFormProps({})
        update()
    }

    useEffect(() =>
    {
        let fetchCatsAndServices = async () =>
        {
            let response = await getCatsAndServices(localStorage.getItem('apiKey'), abortController).catch(err => console.log(err))
            setCatsAndServices(response)
        }

        fetchCatsAndServices()

        return () => {
            abortController.cancel()
        }
    }, [shouldUpdate])

    return (
        <Main
            title="Services og Kategorier"
            subtitle="Rediger i dine services og kategorier"
            CTAs={
                <div className="flex justify-evenly items-center">
                     <Button 
                        size="medium"
                        onClick={handleCreateCatForm}
                    >
                        Tilføj Kategori
                    </Button>
                    <Button 
                        size="medium"
                        color="primary"
                        onClick={handleCreateServiceForm}
                    >
                        Tilføj Service
                    </Button>
                </div>
            }
        >
            {catsAndServices ? catsAndServices.map((catAndServices, i) => <Category handleUpdateServiceForm={handleUpdateServiceForm} handleUpdateCatForm={handleUpdateCatForm} update={update} catAndServices={catAndServices} key={i} />) : null}

            {showForm ? <Form isOpen={showForm} handleClose={handleCloseForm} formType={formType} formProps={formProps} /> : null}

        </Main>
    )
}