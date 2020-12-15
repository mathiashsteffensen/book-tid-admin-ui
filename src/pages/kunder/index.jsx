import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Button, TextField} from '@material-ui/core'

import Main from '../../components/Main'
import Form from '../../components/forms/Form'
import CustomerRow from '../../components/CustomerRow'
import {getTotalCustomers, customerSearch} from '../../requests'
import LabelledSelect from '../../components/forms/inputs/LabelledSelect'
import Pagination from '../../components/Pagination'

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
        console.log(totalCustomers, customerList)
        let newState = state
        newState.totalCustomers = totalCustomers
        newState.customerList = customerList

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
                    variant="contained"
                    color="primary"
                    onClick={handleCreateCustomerForm}
                >
                    Ny Kunde
                </Button>
            }
        >
            <div className=" w-11/12 rounded-xl pb-2 overflow-hidden flex flex-col justify-center items-center border-gray-200 border-2">
                <div className="w-full bg-gray-200 p-4">
                    <div className="grid grid-cols-8">
                        <div className="col-span-4 sm:col-span-2 sm:block flex justify-center items-center">
                            <LabelledSelect
                                onChange={(e) => handleChange('limit', e.target.value)}
                                value={state.limit}
                                label="Vis:"
                                options={[{value: 5, text: '5'}, {value: 10, text: '10'}, {value: 20, text: '20'}, {value: 50, text: '50'}]}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-2 sm:block flex justify-center items-center">
                            <LabelledSelect
                                onChange={(e) => handleChange('sortBy', e.target.value)}
                                value={state.sortBy}
                                label="Sorter efter:"
                                options={[{value: '+name', text: 'Navn (A-Z)'}, {value: '-name', text: 'Navn (Z-A)'}, {value: '+email', text: 'E-Mail (A-Z)'}, {value: '-email', text: 'E-Mail (Z-A)'}]}
                            />
                        </div>

                        <div className="col-span-8 mt-4 sm:mt-0 sm:col-span-4 my-auto sm:block flex justify-center items-center">
                            <TextField
                                size="small" 
                                variant="outlined"
                                label="Søg:"
                                onChange={(e) => handleChange('searchTerm', e.target.value)}
                                value={state.searchTerm}
                            />
                        </div>
                    </div>
                </div>  

                <div className="w-11/12 flex flex-col justify-center items-center my-4 divide-y-2 divide-blue-200">
                    { (state.customerList && state.customerList.length > 0) 
                        ? state.customerList.map((customer, i) => <CustomerRow handleUpdateCustomerForm={handleUpdateCustomerForm} update={updateFetch} index={i+1} key={customer._id} customer={customer} />) 
                        : <span><h5>Ingen kunder fundet</h5></span>
                    }
                </div>
                <div className="w-11/12 h-12">
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
    let apiKey = req.cookies.apiKey
    console.log(apiKey)
    const abortController = axios.CancelToken.source()
    let totalCustomers = await getTotalCustomers(apiKey, abortController).catch((err) => console.log(err.message))

    let customerList = await customerSearch(apiKey, '', 0, '+name', 20, abortController).catch((err) => console.log(err.message))

    return {
      props: {
          customerList: customerList ? customerList : [],
          totalCustomers: totalCustomers ? totalCustomers : 0,
      },
    }
}