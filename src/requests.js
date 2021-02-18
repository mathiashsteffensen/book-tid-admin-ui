import axios from 'axios';
import dayjs from 'dayjs';

const API_URI =
    process.env.NODE_ENV === 'production'
        ? 'https://api.booktid.net'
        : 'http://localhost:4000';

const verifyApiKey = async (apiKey) => {
    if (!apiKey) return false;
    return await axios
        .get(API_URI + '/admin/auth/verify-key/' + apiKey)
        .then((res) => {
            if (res.status === 200 && res.data) return res.data;
            else return false;
        })
        .catch((err) => {
            return false;
        });
};

const confirmEmail = async (emailConfirmationKey) => {
    return await axios
        .get(`${API_URI}/admin/auth/confirm-signup/${emailConfirmationKey}`)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });
};

const resendConfirmationEmail = async (apiKey) => {
    return await axios
        .get(`${API_URI}/admin/auth/confirm-signup/resend/${apiKey}`)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });
};

const signup = (data) => {
    return new Promise((resolve, reject) => {
        axios
            .post(API_URI + '/admin/auth/signup/free', data)
            .then(async (res) => {
                let data = res.data;
                if (res.status === 200) {
                    resolve();
                } else if (data) {
                    reject(data.msg);
                } else {
                    reject();
                }
            })
            .catch((err) => {
                reject(err.response.data.msg);
            });
    });
};

const login = async (email, password) => {
    return await axios
        .post(API_URI + '/admin/auth/login', {
            email: email,
            password: password,
        })
        .then(async (res) => {
            if (!res) throw new Error('res undefined');
            let data = res.data;
            if (res.status === 200 && window) {
                localStorage.setItem('apiKey', data.apiKey);
                document.cookie = `apiKey=${data.apiKey}`;
                window.location.pathname = '/';
                return;
            } else {
                throw new Error(data.msg);
            }
        })
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });
};

const getCatsAndServices = async (apiKey, abortController) => {
    const categories = await axios
        .get(API_URI + `/admin/service/categories/${apiKey}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });

    const services = await axios
        .get(API_URI + `/admin/service/services/${apiKey}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });

    if (categories.length === 0)
        return [
            {
                category: {
                    name: 'Uden Kategori',
                },
                services: services,
            },
        ];
    else {
        let catsAndServices = categories.map((category) => {
            return {
                category: category,
                services: services.filter(
                    (service) => service.categoryName === category.name
                ),
            };
        });

        let usedServiceIDs = catsAndServices
            .map((catAndServices) =>
                catAndServices.services.map((service) => service._id)
            )
            .reduce((returnArray, currentArray) => {
                return returnArray.concat(currentArray);
            });

        catsAndServices.push({
            category: { name: 'Uden Kategori' },
            services: services.filter((service) => {
                return !usedServiceIDs.includes(service._id);
            }),
        });

        return catsAndServices;
    }
};

const createCategory = async (apiKey, abortController, categoryName) => {
    return await axios.post(
        API_URI + `/admin/service/create-category/${apiKey}`,
        {
            cancelToken: abortController.token,
            name: categoryName,
        }
    );
};

const updateCategory = async (
    apiKey,
    abortController,
    categoryName,
    categoryID
) => {
    return await axios.post(
        API_URI + `/admin/service/update-category/${apiKey}`,
        {
            cancelToken: abortController.token,
            name: categoryName,
            id: categoryID,
        }
    );
};

const deleteCategory = async (apiKey, categoryId) => {
    return await axios.delete(API_URI + `/admin/service/category/${apiKey}`, {
        data: {
            id: categoryId,
        },
    });
};

const getAllCalendars = async (apiKey, abortController) => {
    return await axios
        .get(API_URI + `/admin/calendar/all/${apiKey}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });
};

const createCalendar = async (apiKey) => {
    return await axios
        .post(API_URI + `/admin/calendar/create/${apiKey}`)
        .then((res) => res.data);
};

const deleteCalendar = async (apiKey, calendarID) => {
    return await axios
        .delete(API_URI + `/admin/calendar/${apiKey}`, {
            data: { calendarID: calendarID },
        })
        .then((res) => res.data);
};

const updateCalendar = async (apiKey, calendarID, updates) => {
    return await axios
        .post(API_URI + `/admin/calendar/update/${apiKey}`, {
            calendarID,
            new: updates,
        })
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });
};

const updateCalendarColors = async (
    apiKey,
    calendarID,
    onlineColor,
    standardColor
) => {
    return await updateCalendar(apiKey, calendarID, {
        onlineColor: onlineColor,
        standardColor: standardColor,
    });
};

const updateCalendarSchedule = async (apiKey, calendarID, schedule) => {
    return await updateCalendar(apiKey, calendarID, { schedule: schedule });
};

const updateAvatar = async (apiKey, calendarID, photoURL) => {
    return await updateCalendar(apiKey, calendarID, { pictureURL: photoURL });
};

const uploadAvatar = async (apiKey, calendarID, file) => {
    let formData = new FormData();
    formData.append('avatar', file);
    if (!file) throw new Error('Vælg venligst en fil')
    return await axios
        .post(
            API_URI + `/admin/calendar/upload-avatar/${apiKey}/${calendarID}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });
};

const getAvatars = async (apiKey, abortController) => {
    return await axios
        .get(API_URI + `/admin/calendar/avatars/${apiKey}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });
};

const deleteAvatar = async (apiKey, pictureURL) => {
    return await axios
        .delete(API_URI + `/admin/calendar/avatar/${apiKey}`, {
            data: { pictureURL: pictureURL },
        })
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data);
        });
};

const getMaxCalendars = async (apiKey, abortController) => {
    return await axios
        .get(API_URI + `/admin/calendar/max-allowed/${apiKey}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });
};

const createService = async (apiKey, data) => {
    return await axios.post(
        API_URI + `/admin/service/create-service/${apiKey}`,
        data
    );
};

const updateService = async (apiKey, updates, serviceId) => {
    return await axios
        .post(API_URI + `/admin/service/update-service/${apiKey}`, {
            serviceID: serviceId,
            new: updates,
        })
        .then((res) => res.data);
};

const deleteService = async (apiKey, serviceId) => {
    return await axios.delete(API_URI + `/admin/service/${apiKey}`, {
        data: {
            serviceID: serviceId,
        },
    });
};

const getBookingSettings = async (apiKey) =>
    await axios
        .get(API_URI + `/admin/settings/booking/${apiKey}`)
        .then((res) => res.data);

const updateBookingSettings = async (apiKey, settings) =>
    await axios.post(API_URI + `/admin/settings/booking/${apiKey}`, settings);

const getTotalCustomers = async (apiKey, abortController) =>
    await axios
        .get(API_URI + `/admin/customer/total/${apiKey}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });

const customerSearch = async (
    apiKey,
    searchTerm,
    offset,
    sortBy,
    limit,
    abortController
) =>
    await axios
        .get(
            API_URI +
                `/admin/customer/list/search/${apiKey}?searchTerm=${searchTerm}&offset=${offset}&sortBy=${sortBy}&limit=${limit}`,
            { cancelToken: abortController ? abortController.token : null }
        )
        .then((res) => res.data)
        .catch((err) => {
            console.log(err);
        });

const createCustomer = async (apiKey, customerData) =>
    await axios
        .post(API_URI + `/admin/customer/create/${apiKey}`, customerData)
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });

const deleteCustomer = async (apiKey, customerID) =>
    await axios.delete(API_URI + `/admin/customer/${apiKey}`, {
        data: { customerID: customerID },
    });

const updateCustomer = async (apiKey, customer, customerID) =>
    await axios
        .post(API_URI + `/admin/customer/update/${apiKey}`, {
            customerID: customerID,
            new: customer,
        })
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const getAppointmentsByDay = async (apiKey, date, abortController) =>
    await axios
        .get(API_URI + `/admin/appointment/on-day/${apiKey}/${date}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });

const getAppointmentsByWeek = async (apiKey, date, abortController) =>
    await axios
        .get(API_URI + `/admin/appointment/in-week/${apiKey}/${date}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });

const getAppointmentsByMonth = async (apiKey, date, abortController) =>
    await axios
        .get(API_URI + `/admin/appointment/in-month/${apiKey}/${date}`, {
            cancelToken: abortController.token,
        })
        .then((res) => res.data)
        .catch((err) => {
            if (axios.isCancel(err)) {
                throw new Error(err);
            } else throw new Error(err.response.data.msg);
        });

const getAppointmentsByCalendarMonth = async (
    apiKey,
    date,
    abortController
) => {
    return await Promise.all([
        // Gets appointments for the month itself
        getAppointmentsByMonth(apiKey, date, abortController),
        // Gets appointments for the 1 month before the month in view
        getAppointmentsByMonth(
            apiKey,
            dayjs(date).subtract(1, 'month').toJSON(),
            abortController
        ),
        // Gets appointments for the 1 month after the month in view
        getAppointmentsByMonth(
            apiKey,
            dayjs(date).add(1, 'month').toJSON(),
            abortController
        ),
    ]);
};

const createAppointment = async (
    apiKey,
    calendarID,
    customerID,
    service,
    startTime,
    endTime
) =>
    await axios
        .post(API_URI + `/admin/appointment/create/${apiKey}/${calendarID}`, {
            customerID,
            service,
            startTime,
            endTime,
        })
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const deleteAppointment = async (apiKey, appointmentID) =>
    await axios
        .delete(API_URI + `/admin/appointment/${apiKey}/${appointmentID}`)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const getProfileSettings = async (apiKey) =>
    await axios
        .get(API_URI + '/admin/settings/profile/' + apiKey)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const getProductsAndPrices = async () =>
    await axios
        .get(API_URI + '/admin/products/products-and-prices/')
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const getProduct = async (productID, apiKey) =>
    await axios
        .get(API_URI + `/admin/products/${productID}/${apiKey}`)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const getLatestInvoice = async (subscriptionId, apiKey) =>
    await axios
        .get(API_URI + `/admin/pay/latestInvoice/${subscriptionId}/${apiKey}`)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const createSubscription = async (
    customerId,
    paymentMethodId,
    priceId,
    quantity,
    apiKey
) => {
    return await axios
        .post(API_URI + `/admin/pay/create-subscription/${apiKey}`, {
            customerId,
            paymentMethodId,
            priceId,
            quantity,
        })
        .then((res) => res.data)
        .then((result) => {
            if (result.error) {
                // The card had an error when trying to attach it to a customer.
                throw new Error(result.error.message);
            }
            return result;
        })
        .then((result) => {
            return {
                paymentMethodId: paymentMethodId,
                priceId: priceId,
                subscription: result,
            };
        })
        .catch((err) => {
            throw new Error(err.response.data.error.message);
        });
};

const cancelSubscription = async (apiKey) =>
    await axios
        .post(API_URI + `/admin/pay/cancel-subscription/${apiKey}`)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const retryInvoiceWithNewPaymentMethod = (
    customerId,
    paymentMethodId,
    invoiceId,
    priceId,
    apiKey
) =>
    axios
        .post(API_URI + `/admin/pay/retry-invoice/${apiKey}`, {
            customerId: customerId,
            paymentMethodId: paymentMethodId,
            invoiceId: invoiceId,
        })
        .then((res) => res.data)
        .then((result) => {
            if (result.error) {
                // The card had an error when trying to attach it to a customer.
                throw new Error(result.error.message);
            }
            return result;
        })
        .then((result) => {
            // Normalize the result to contain the object returned by Stripe.
            // Add the additional details we need.
            return {
                invoice: result,
                paymentMethodId: paymentMethodId,
                priceId: priceId,
                isRetry: true,
            };
        })
        .catch((err) => {
            throw new Error(err.response.data.error);
        });

const onSubscriptionComplete = (apiKey) =>
    axios
        .post(API_URI + `/admin/pay/subscription-complete/${apiKey}`)
        .then((res) => res.data)
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });

const retrieveUpcomingInvoice = async (newPriceId, quantity, apiKey) => {
    return axios
        .post(API_URI + `/admin/pay/retrieve-upcoming-invoice/${apiKey}`, {
            newPriceId: newPriceId,
            quantity: quantity,
        })
        .then((response) => {
            return response.data;
        })
        .then((invoice) => {
            return invoice;
        });
};

const updateSubscription = async (priceId, quantity, apiKey) => {
    return axios
        .post(API_URI + '/admin/pay/update-subscription/' + apiKey, {
            newPriceId: priceId,
            quantity: quantity,
        })
        .then((response) => {
            return response.data;
        })
        .then((response) => {
            return response;
        });
};

const logout = () => {
    localStorage.removeItem('apiKey');
    document.cookie = 'apiKey=; Max-Age=-99999999;';
    location.reload();
};

const updateProfile = async (data, apiKey) => {
    return axios.post(API_URI + '/admin/settings/profile/' + apiKey, data)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw new Error(err.response.data.msg);
        });
}

const activateApp = async (app, apiKey) => (
    await axios.post(API_URI + '/admin/app-store/activate-app/' + apiKey, { app })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw new Error(err.response.data.msg);
        })
)

const deactivateApp = async (app, apiKey) => (
    await axios.post(API_URI + '/admin/app-store/deactivate-app/' + apiKey, { app })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            throw new Error(err.response.data.msg);
        })
)

export {
    login,
    signup,
    verifyApiKey,
    getCatsAndServices,
    createCategory,
    updateCategory,
    deleteCategory,
    createService,
    updateService,
    deleteService,
    createCalendar,
    deleteCalendar,
    getAllCalendars,
    updateCalendar,
    updateCalendarSchedule,
    updateCalendarColors,
    updateAvatar,
    deleteAvatar,
    getAvatars,
    uploadAvatar,
    getMaxCalendars,
    getBookingSettings,
    updateBookingSettings,
    getTotalCustomers,
    customerSearch,
    createCustomer,
    deleteCustomer,
    updateCustomer,
    getAppointmentsByDay,
    getAppointmentsByWeek,
    getAppointmentsByMonth,
    getAppointmentsByCalendarMonth,
    createAppointment,
    deleteAppointment,
    getProfileSettings,
    getProduct,
    getProductsAndPrices,
    getLatestInvoice,
    createSubscription,
    cancelSubscription,
    onSubscriptionComplete,
    retryInvoiceWithNewPaymentMethod,
    retrieveUpcomingInvoice,
    updateSubscription,
    logout,
    confirmEmail,
    resendConfirmationEmail,
    updateProfile,
    activateApp,
    deactivateApp
};
