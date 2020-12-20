import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Form from '../../components/forms/Form'
import Main from '../../components/Main'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import {getCatsAndServices} from '../../requests'
import CatAndServices from '../../components/CatAndServices/CatAndServices'


export default function Services() 
{
    // Change this state value to force an update
    const [shouldUpdate, setUpdate] = useState(true)
    const update = () => setUpdate(!shouldUpdate)

    // Holds the category and services information
    const [catsAndServices, setCatsAndServices] = useState(undefined)

    // State for handling pop up forms
    const [showForm, setShowForm] = useState(false)
    const [formType, setFormType]  = useState('')
    const [formProps, setFormProps]  = useState('')

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
        const abortController = axios.CancelToken.source()

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
                    <ButtonGroup>
                        <Button 
                            variant="outline-primary"
                            onClick={handleCreateCatForm}
                        >
                            Tilføj Kategori
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={handleCreateServiceForm}
                        >
                            Tilføj Service
                        </Button>
                    </ButtonGroup>
                    
                </div>
            }
        >
            <div className="w-11/12">
                {catsAndServices && catsAndServices.map((catAndServices, i) => (
                    <CatAndServices 
                        handleUpdateServiceForm={handleUpdateServiceForm} 
                        handleUpdateCatForm={handleUpdateCatForm} 
                        update={update} 
                        data={catAndServices} 
                        key={i} 
                    />
                ))}
            </div>
            
            

            {showForm ? <Form isOpen={showForm} handleClose={handleCloseForm} formType={formType} formProps={formProps} /> : null}

        </Main>
    )
}

//TODO: Add server side rendering for this page, fetch catsAndServices then to prevent blank page on load