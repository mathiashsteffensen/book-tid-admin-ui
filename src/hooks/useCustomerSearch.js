import useSWR from 'swr'

import {
    customerSearch,
} from '../requests';

export default function useCustomerSearch(apiKey, searchterm, sortBy, offset, limit) {
    return useSWR([apiKey, searchterm, sortBy, offset, limit], customerSearch)
}