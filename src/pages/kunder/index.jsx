import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import {TextField} from '@material-ui/core'

import Main from '../../components/Main'
import Form from '../../components/forms/Form'
import CustomerList from '../../components/CustomerList/CustomerList'
import Pagination from '../../components/Pagination'
import CustomerSearch from '../../components/CustomerSearch'

import {getTotalCustomers, customerSearch, verifyApiKey} from '../../requests'

export default function Kunder(props) 
{
    const [state, setState] = useState({
            ...props,
            ...{
                limit: 10,
                offset: 0,
                sortBy: '+name',
                searchTerm: '',
                firstRender: true,
                pages: Math.ceil(props.totalCustomers/10),
                currentPage: 1
            }
    })

    const [shouldUpdate, setShouldUpdate] = useState(false)
    const update = () => setShouldUpdate(!shouldUpdate)

    const [shouldUpdateFetch, setShouldUpdateFetch] = useState(false)
    const updateFetch = () => setShouldUpdateFetch(!shouldUpdateFetch)

    const [showForm, setShowForm] = useState(false)
    const [formType, setFormType] = useState('')
    const [formProps, setFormProps] = useState({})

    const handleCloseForm = () =>
    {
        setShowForm(false)
        setFormProps({})
        setFormType('')
        updateFetch()
    }

    const handleCreateCustomerForm = () =>
    {
        setFormType('create-customer')
        setShowForm(true)
    }

    const handleUpdateCustomerForm = (customer) =>
    {
        setFormType('update-customer')
        setFormProps({
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            note: customer.note,
            customerID: customer._id
        })
        setShowForm(true)
    }

    const handleChange = (key, value) =>
    {
        let newState = state
        newState[key] = value
        newState.offset = 0
        newState.pages = Math.ceil(newState.totalCustomers/newState.limit)
        newState.currentPage = 1
        setState(newState)
        update()
    }

    const handleForwardPagination = () =>
    {
        let newState = state
        newState.offset += newState.limit
        newState.currentPage += 1
        setState(newState)
        update()
    }

    const handleBackwardPagination = () =>
    {
        let newState = state
        newState.offset -= newState.limit
        newState.currentPage -= 1
        setState(newState)
        update()
    }

    const fetchCustomers = async (abortController) =>
    {
        const apiKey = localStorage.getItem('apiKey')

        let totalCustomers = await getTotalCustomers(apiKey, abortController).catch((err) => console.log(err))

        let customerList = await customerSearch(apiKey, state.searchTerm, state.offset, state.sortBy, state.limit, abortController).catch((err) => console.log(err))
 
        let newState = state
        newState.totalCustomers = totalCustomers
        newState.customerList = customerList
        newState.pages = Math.ceil(totalCustomers/state.limit)

        setState(newState)
        update()
    }

    useEffect(() =>
    {
        if (!state.firstRender)
        {
            const abortController = axios.CancelToken.source()
            fetchCustomers(abortController).catch((err)  => console.log(err))
            return () => abortController.cancel()  
        } else 
        {
            let newState = state
            newState.firstRender = false
            setState(newState)
        }
    }, [state.limit, state.offset, state.sortBy, state.searchTerm, shouldUpdateFetch])

    return (
        <Main
            title="Kunder"
            subtitle="Søg i og rediger dine kunder"
            CTAs={
                <Button
                    onClick={handleCreateCustomerForm}
                    size="lg"
                >
                    Ny Kunde
                </Button>
            }
        >
            <div className=" w-11/12 bg-gray-100 rounded-xl shadow-md px-4 overflow-hidden flex flex-col justify-center items-center">
                <CustomerSearch
                    limit={state.limit}
                    sortBy={state.sortBy}
                    searchTerm={state.searchTerm}
                    handleChange={handleChange}
                /> 

                { (state.customerList && state.customerList.length > 0) 
                    ? <CustomerList 
                        data={state.customerList}
                        update={updateFetch}
                        handleUpdateCustomerForm={handleUpdateCustomerForm}
                        offset={state.offset} 
                    /> 
                    : <span><h5>Ingen kunder fundet</h5></span>
                }
                <div className="w-11/12 h-12 py-4">
                    <div className="float-left h-full flex items-center text-sm font-medium text-gray-800">
                        <p>Side {state.currentPage} af {state.pages}</p>
                    </div>
                    <div className="float-right h-full flex items-center">
                        <Pagination
                            disableNext={state.currentPage === state.pages}
                            disablePrevious={state.currentPage === 1}
                            next={handleForwardPagination}
                            previous={handleBackwardPagination}
                        />  
                    </div>  
                </div>
                
            </div>
            {showForm ? <Form isOpen={showForm} handleClose={handleCloseForm} formType={formType} formProps={formProps} /> : null}
        </Main>
    )
}

export async function getServerSideProps({req}) {
    const apiKey = req.cookies.apiKey

    const isValid = await verifyApiKey(apiKey).catch(err => console.log(err))

    if (isValid)
    {
        const abortController = axios.CancelToken.source()
        let totalCustomers = await getTotalCustomers(apiKey, abortController).catch((err) => console.log(err.message))

        let customerList = await customerSearch(apiKey, '', 0, '+name', 20, abortController).catch((err) => console.log(err.message))

        return {
            props: {
                valid: Boolean(isValid),
                user: isValid,
                customerList: customerList ? customerList : [],
                totalCustomers: totalCustomers ? totalCustomers : 0,
            }
        }
    } else return {
        redirect: {
            permanent: false,
            destination: '/login'
        }
    }

    
}