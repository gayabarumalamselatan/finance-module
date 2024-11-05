import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from '../service/InsertDataService';
import { getBranch, getToken } from '../config/Constant';
import { GENERATED_DUE_DATE, GENERATED_NUMBER } from '../config/ConfigUrl';
import { generateUniqueId } from '../service/GeneratedId';
import Select from 'react-select';
import LookupParamService from '../service/LookupParamService';
import CreatableSelect from 'react-select/creatable';
import LookupService from '../service/LookupService';
import UpdateDataService from '../service/UpdateDataService';
import DeleteDataService from '../service/DeleteDataService';
import axios from 'axios';

const EditPurchaseRequest = ({ setIsEditingPurchaseRequest, handleRefresh, index, item, selectedData }) => {
    console.log('selectedData', selectedData);
    const headers = getToken();
    const branchId = getBranch();
    const [pr_number, setPrNumber] = useState('');
    const [request_date, setRequestDate] = useState('');
    const [customer, setCustomer] = useState('');
    const [schedule_date, setScheduleDate] = useState('');
    const [doc_no, setDocNo] = useState('FRM.PTAP.PRC.21a-01');
    const [doc_reff, setDocReff] = useState('');
    const [doc_reff_no, setDocReffNo] = useState('');
    const [requestor, setRequestor] = useState('');
    const [departement, setDepartment] = useState('');
    const [company, setCompany] = useState('');
    const [vendor, setVendor] = useState('');
    const [project, setProject] = useState('');
    const [payment_term, setPaymentTerm] = useState('7 Weekday');
    const [project_contract_number, setProjectContractNumber] = useState('');
    const [status_request, setStatusRequest] = useState('');
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState('');
    const [due_date, setDueDate] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requestorOptions, setRequestorOptions] = useState([]);
    const [selectedRequestor, setSelectedRequestor] = useState(null);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [departementOptions, setDepartementOptions] = useState([]);
    const [selectedDepartement, setSelectedDepartement] = useState(null);
    // const [companyOptions, setCompanyOptions] = useState([]);
    // const [selectedCompany, setSelectedCompany] = useState(null);
    const [projectOptions, setProjectOptions] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // const [customerOptions, setCustomerOptions] = useState([]);
    // const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    // const [paymentTermOptions, setPaymentTermOptions] = useState([]);
    // const [selectedPaymentTerm, setSelectedPaymentTerm] = useState([]);

    const authToken = headers;
    useEffect(() => {
        if (selectedData) {
            const { ID, PR_NUMBER } = selectedData[0];
            // Set data awal dari selectedData
            console.log('id and pr number', ID, PR_NUMBER);
            setPrNumber(PR_NUMBER);

            // Panggil API untuk mendapatkan data berdasarkan ID
            LookupService.fetchLookupData(`PURC_FORMPUREQ&filterBy=PR_NUMBER&filterValue=${PR_NUMBER}&operation=EQUAL`, authToken, branchId)
                .then(response => {
                    const data = response.data[0];
                    console.log('Data:', data);
                    setRequestDate(data.request_date);
                    setCustomer(data.customer);
                    setScheduleDate(data.schedule_date);
                    setDocNo(data.doc_no);
                    setDocReff(data.doc_reff);
                    setDocReffNo(data.doc_reff_no);
                    setRequestor(data.requestor);
                    setDepartment(data.departement);
                    setCompany(data.company);
                    setProject(data.project);
                    setProjectContractNumber(data.project_contract_number);
                    setDescription(data.description);
                    setStatusRequest(data.status_request);
                    setVendor(data.vendor);
                    setPaymentTerm(data.payment_term);
                    setDueDate(data.due_date);
                })
                .catch(error => {
                    console.error('Failed to load purchase request data:', error);
                });
            LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${PR_NUMBER}&operation=EQUAL`, authToken, branchId)
                .then(response => {
                    const fetchedItems = response.data || [];
                    console.log('Items fetched:', fetchedItems);

                    // Set fetched items to state
                    const sortedItems = fetchedItems.sort((a, b) => a.ID - b.ID);

                    console.log('Items fetched (after sorting):', sortedItems);
                    setItems(sortedItems);

                    // Fetch product lookup data
                    LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
                        .then(productData => {
                            console.log('Product lookup data:', productData);

                            // Transform and map product data to options
                            const transformedProductData = productData.data.map(item =>
                                Object.keys(item).reduce((acc, key) => {
                                    acc[key.toUpperCase()] = item[key];
                                    return acc;
                                }, {})
                            );

                            const productOptions = transformedProductData.map(item => ({
                                value: item.NAME,
                                label: item.NAME
                            }));

                            setProductOptions(productOptions); // Set product options to state

                            // Fetch currency lookup data
                            LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                                .then(currencyData => {
                                    console.log('Currency lookup data:', currencyData);

                                    // Transform and map currency data to options
                                    const transformedCurrencyData = currencyData.data.map(item =>
                                        Object.keys(item).reduce((acc, key) => {
                                            acc[key.toUpperCase()] = item[key];
                                            return acc;
                                        }, {})
                                    );

                                    const currencyOptions = transformedCurrencyData.map(item => ({
                                        value: item.CODE,
                                        label: item.CODE
                                    }));

                                    setCurrencyOptions(currencyOptions); // Set currency options to state

                                    // Update fetched items with selected options
                                    const updatedItems = fetchedItems.map(item => {
                                        const selectedProductOption = productOptions.find(option =>
                                            option.value === item.product
                                        );

                                        console.log('Selected product option:', selectedProductOption);

                                        const selectedCurrencyOption = currencyOptions.find(option =>
                                            option.value === item.currency
                                        );

                                        console.log('Selected currency option:', selectedCurrencyOption);
                                        setSelectedCurrency(selectedCurrencyOption);
                                        setSelectedProduct(selectedProductOption);
                                    });

                                    // Set the updated items with selected product and currency options to state
                                    setItems(fetchedItems);
                                })
                                .catch(error => {
                                    console.error('Failed to fetch currency lookup:', error);
                                });
                        })
                        .catch(error => {
                            console.error('Failed to fetch product lookup:', error);
                        });
                })
                .catch(error => {
                    console.error('Failed to load items:', error);
                });



            // Ambil data lookup untuk currency
            LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
                .then(data => {
                    console.log('Currency lookup data:', data);

                    // Transform keys to uppercase directly in the received data
                    const transformedData = data.data.map(item =>
                        Object.keys(item).reduce((acc, key) => {
                            acc[key.toUpperCase()] = item[key];
                            return acc;
                        }, {})
                    );
                    //console.log('Transformed data:', transformedData);

                    const options = transformedData.map(item => ({
                        value: item.NAME,
                        label: item.NAME
                    }));
                    setRequestorOptions(options);
                    const selectedRequestorOption = options.find(option => option.value === selectedData[0].REQUESTOR);
                    setSelectedRequestor(selectedRequestorOption || null);

                })
                .catch(error => {
                    console.error('Failed to fetch currency lookup:', error);
                });

            LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                .then(data => {
                    console.log('Currency lookup data:', data);

                    // Transform keys to uppercase directly in the received data
                    const transformedData = data.data.map(item =>
                        Object.keys(item).reduce((acc, key) => {
                            acc[key.toUpperCase()] = item[key];
                            return acc;
                        }, {})
                    );
                    //console.log('Transformed data:', transformedData);

                    const options = transformedData.map(item => ({
                        value: item.CODE,
                        label: item.CODE
                    }));
                    setCurrencyOptions(options);
                    // const selectedCurrencyOption = options.find(option => option.value === currency);
                    // setSelectedCurrency(selectedCurrencyOption || null);
                })
                .catch(error => {
                    console.error('Failed to fetch currency lookup:', error);
                });
            LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
                .then(data => {
                    console.log('Currency lookup data:', data);

                    // Transform keys to uppercase directly in the received data
                    const transformedData = data.data.map(item =>
                        Object.keys(item).reduce((acc, key) => {
                            acc[key.toUpperCase()] = item[key];
                            return acc;
                        }, {})
                    );
                    //console.log('Transformed data:', transformedData);

                    const options = transformedData.map(item => ({
                        value: item.NAME,
                        label: item.NAME
                    }));
                    setDepartementOptions(options);
                    const selectedDepartementOption = options.find(option => option.value === selectedData[0].DEPARTEMENT);
                    setSelectedDepartement(selectedDepartementOption || null);
                })
                .catch(error => {
                    console.error('Failed to fetch currency lookup:', error);
                });

            LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
                .then(data => {
                    console.log('Currency lookup data:', data);

                    // Transform keys to uppercase directly in the received data
                    const transformedData = data.data.map(item =>
                        Object.keys(item).reduce((acc, key) => {
                            acc[key.toUpperCase()] = item[key];
                            return acc;
                        }, {})
                    );
                    //console.log('Transformed data:', transformedData);

                    const options = transformedData.map(item => ({
                        value: item.NAME,
                        label: item.NAME,
                        project_contract_number: item.CONTRACT_NUMBER,
                        customer: item.CUSTOMER
                    }));
                    setProjectOptions(options);
                    const selectedProjectOption = options.find(option => option.value === selectedData[0].PROJECT);
                    setSelectedProject(selectedProjectOption || null);
                })
                .catch(error => {
                    console.error('Failed to fetch currency lookup:', error);
                });

            LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
                .then(data => {
                    console.log('Currency lookup data:', data);

                    // Transform keys to uppercase directly in the received data
                    const transformedData = data.data.map(item =>
                        Object.keys(item).reduce((acc, key) => {
                            acc[key.toUpperCase()] = item[key];
                            return acc;
                        }, {})
                    );
                    //console.log('Transformed data:', transformedData);

                    const options = transformedData.map(item => ({
                        value: item.NAME,
                        label: item.NAME
                    }));
                    setProductOptions(options);
                    console.log('Product :', options);
                    const selectedProductOption = options.find(option => option.value === selectedData[0].PRODUCT);
                    console.log('product : ', selectedProductOption);
                    setSelectedProduct(selectedProductOption || null);
                })
                .catch(error => {
                    console.error('Failed to fetch currency lookup:', error);
                });

            LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
                .then(data => {
                    console.log('Currency lookup data:', data);

                    // Transform keys to uppercase directly in the received data
                    const transformedData = data.data.map(item =>
                        Object.keys(item).reduce((acc, key) => {
                            acc[key.toUpperCase()] = item[key];
                            return acc;
                        }, {})
                    );
                    //console.log('Transformed data:', transformedData);
                    const filteredData = transformedData.filter(item =>
                        item.ENTITY_TYPE === 'BOTH' || item.ENTITY_TYPE === 'Vendor'
                    );

                    const options = filteredData.map(item => ({
                        value: item.NAME,
                        label: item.NAME
                    }));

                    console.log('Vendor ops :', options);


                    setVendorOptions(options);

                    const selectedVendorOption = options.find(option => option.value === selectedData[0].VENDOR);
                    console.log('Vendor :', selectedVendorOption);
                    setSelectedVendor(selectedVendorOption || null);
                })
                .catch(error => {
                    console.error('Failed to fetch currency lookup:', error);
                });



            LookupParamService.fetchLookupData("MSDT_FORMPYTM", authToken, branchId)
                .then(data => {
                    console.log('Currency lookup data:', data);

                    // Transform keys to uppercase directly in the received data
                    const transformedData = data.data.map(item =>
                        Object.keys(item).reduce((acc, key) => {
                            acc[key.toUpperCase()] = item[key];
                            return acc;
                        }, {})
                    );
                    //console.log('Transformed data:', transformedData);

                    const options = transformedData.map(item => ({
                        value: item.COUNT,
                        label: item.NAME,
                        dateType: item.DATE_TYPE
                    }));
                    setPaymentTermOptions(options);
                    console.log('Payment Term :', options);
                    const selectedPaymentTermOption = options.find(option => option.value === selectedData[0].PAYMENT_TERM);
                    console.log('Payment Term :', selectedPaymentTermOption);
                    setSelectedPaymentTerm(selectedPaymentTermOption || null);
                })
                .catch(error => {
                    console.error('Failed to fetch currency lookup:', error);
                });
        }
    }, [selectedData]);


    const handleRequestorChange = (selectedOption) => {
        setSelectedRequestor(selectedOption);
        setRequestor(selectedOption ? selectedOption.value : '');
    };

    const handleDeppartementChange = (selectedOption) => {
        setSelectedDepartement(selectedOption);
        setDepartment(selectedOption ? selectedOption.value : '');
    };

    const handleProjectChange = (selectedOption) => {
        //console.log(selectedOption);
        setSelectedProject(selectedOption);
        setProject(selectedOption ? selectedOption.value : '');
        setProjectContractNumber(selectedOption.project_contract_number);
        setCustomer(selectedOption.customer);
    };

    // const handleCustomerChange = (selectedOption) => {
    //     setSelectedCustomer(selectedOption);
    //     setCustomer(selectedOption ? selectedOption.value : '');
    // }

    const handleVendorChange = (selectedOption) => {
        setSelectedVendor(selectedOption);
        setVendor(selectedOption ? selectedOption.value : '');
    }

    const fetchPaymentTermData = async (data) => {
        console.log('Fetching payment term data', data);
        console.log('Request date:', request_date);
        const today = new Date().toISOString().split('T')[0];

        const payload = {
            date: today,
            count: data ? data.value : '',
            dateType: data ? data.dateType : ''
        };

        console.log('Payload:', payload);

        try {
            // Hit the API with the required data and Bearer token in the headers
            const response = await axios.post(`${GENERATED_DUE_DATE}`, payload, {
                headers: {
                    Authorization: `Bearer ${headers}`
                }
            });

            // Process the response if needed
            console.log('API response:', response.data.dueDate);
            setDueDate(response.data.dueDate);
            setScheduleDate(response.data.dueDate);

        } catch (error) {
            // Handle any errors
            console.error('Error calling API:', error);
        }
    };

    useEffect(() => {
        // Hardcoded payment term to simulate a selected option
        const hardcodedPaymentTerm = {
            value: '7',
            dateType: 'Weekday' // Example date type
        };

        // Call the API when the component loads
        fetchPaymentTermData(hardcodedPaymentTerm);
    }, []);
    const handleAddItem = () => {
        setItems([...items, { product: '', product_note: '', quantity: '', currency: 'IDR', unit_price: 0, total_price: 0 }]);
    };

    // const handleItemChange = (index, field, value) => {
    //     const newItems = [...items];
    //     if (field === 'product' || field === 'currency') {
    //         newItems[index][field] = value ? value.value : null;
    //     } else {
    //         newItems[index][field] = value;
    //     }

    //     if (field === 'quantity' || field === 'unit_price') {
    //         newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    //     }

    //     setItems(newItems);
    // };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];

        if (field === 'product' || field === 'currency') {
            newItems[index][field] = value ? value.value : null;
        } else {
            newItems[index][field] = value;
        }

        // if (field === 'quantity' || field === 'unit_price') {
        //   newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
        // }
        if (field === 'quantity' || field === 'unit_price') {
            // Check if quantity is 0 and set it to 1
            if (newItems[index].quantity === 0 || newItems[index].quantity === '') {
                newItems[index].quantity = 1;
            }

            // Calculate total price
            newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
        }

        setItems(newItems);
    };

    const handleDeleteItem = async (index) => {
        // Get the item to be deleted based on the index
        const itemToDelete = items[index];

        if (itemToDelete && itemToDelete.ID) {
            try {
                // Call the Delete API for the item using the ID
                const itemId = itemToDelete.ID;
                const deleteResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUREQD", authToken, branchId);
                console.log('Item deleted from API successfully:', deleteResponse);

                // Proceed to update local state only if API call was successful
                const newItems = items.filter((item, i) => i !== index);
                setItems(newItems);
                setSelectedItems(selectedItems.filter((i) => i !== index));
            } catch (error) {
                console.error('Error deleting item from API:', error);
                // Optionally, you can display an error message to the user here
            }
        } else {
            // If the item doesn't have an ID, simply remove it from local state
            const newItems = items.filter((item, i) => i !== index);
            setItems(newItems);
            setSelectedItems(selectedItems.filter((i) => i !== index));
            console.log('Item removed locally, no ID found.');
        }
    };


    const handleSelectItem = (index) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(selectedItems.filter((i) => i !== index));
        } else {
            setSelectedItems([...selectedItems, index]);
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map((_, index) => index));
        }
    };

    const handleDeleteSelected = () => {
        const newItems = items.filter((_, index) => !selectedItems.includes(index));
        setItems(newItems);
        setSelectedItems([]);
    };

    const calculateTotalAmount = () => {
        return items.reduce((total, item) => total + item.total_price, 0);
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const newItems = [...items];
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setItems(newItems);
    };

    const resetForm = () => {
        setPrNumber('');
        setRequestDate('');
        setCustomer('');
        setScheduleDate('');
        setDocNo('');
        setDocReff('');
        setDocReffNo('');
        setRequestor('');
        setDepartment('');
        setCompany('PT. Abhimata Persada');
        setProject('');
        setProjectContractNumber('');
        setDescription('');
        setItems([]);
        setSelectedItems([]);
        setSelectedRequestor(null);
        setSelectedDepartement(null);
        setSelectedProject(null);
        setSelectedCurrency(null);
    };



    const generatePrNumber = async () => {
        try {
            const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=PR`, authToken);
            return uniquePrNumber;
        } catch (error) {
            console.error('Failed to generate PR Number:', error);
            throw error; // Rethrow the error to be caught in handleSave
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();

        if (schedule_date !== due_date && (!description || description.trim() === '')) {
            messageAlertSwal('Warning', 'Description is required !!!', 'warning');
            return; // Exit the function if validation fails
        }

        // Show SweetAlert2 confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save the Purchase Request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save It!',
            cancelButtonText: 'No, Cancel!',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                console.log('Status: ', status_request);
                const total_amount = calculateTotalAmount();
                // Save general information and description
                const createBy = sessionStorage.getItem('userId');
                const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

                const generalInfo = {
                    pr_number,
                    request_date, // Converts to date format
                    customer,
                    schedule_date, // Converts to date format
                    doc_no,
                    doc_reff,
                    doc_reff_no,
                    requestor,
                    departement,
                    company,
                    project,
                    vendor,
                    payment_term,
                    project_contract_number,
                    description,
                    total_amount,
                    status_request,
                    due_date
                };

                console.log('Master', generalInfo);
                console.log('Items', items);

                //Update general information
                const response = await UpdateDataService.postData(generalInfo, `PUREQ&column=id&value=${id}`, authToken, branchId);
                console.log('General data posted successfully:', response);

                if (response.message === "Update Data Successfully") {
                    // Iterate over items array and attempt to delete each item
                    for (const item of items) {
                        if (item.ID) {
                            const itemId = item.ID;
                            try {
                                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUREQD", authToken, branchId);
                                console.log('Item deleted successfully:', itemResponse);
                            } catch (error) {
                                console.error('Error deleting item:', itemId, error);
                            }
                        } else {
                            console.log('No ID found, skipping delete for this item:', item);
                        }
                    }

                    // After deletion, insert updated items
                    for (const item of items) {
                        // Exclude rwnum, ID, status, and id_trx fields
                        const { rwnum, ID, status, id_trx, ...rest } = item;

                        const updatedItem = {
                            ...rest,
                            pr_number
                        };

                        try {
                            const itemResponse = await InsertDataService.postData(updatedItem, "PUREQD", authToken, branchId);
                            console.log('Item inserted successfully:', itemResponse);
                        } catch (error) {
                            console.error('Error inserting item:', updatedItem, error);
                        }
                    }

                    // Show success message and reset form
                    messageAlertSwal('Success', response.message, 'success');
                    resetForm();
                }

            } catch (err) {
                console.error(err);
                setIsLoading(false);
                messageAlertSwal('Error', err.message, 'error');
            } finally {
                setIsLoading(false);
                setIsEditingPurchaseRequest(false);
                handleRefresh(); // Set loading state back to false after completion
            }
        } else {
            console.log('Form submission was canceled.');
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (schedule_date !== due_date && (!description || description.trim() === '')) {
            messageAlertSwal('Warning', 'Description is required !!!', 'warning');
            return; // Exit the function if validation fails
        }
        // Show SweetAlert2 confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to submit the Purchase Request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Submit It!',
            cancelButtonText: 'No, Cancel!',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                // Generate PR number
                let pr_number = selectedData[0].PR_NUMBER;

                if (pr_number.slice(0, 2) !== 'PR') {
                    pr_number = await generatePrNumber();
                } else {
                    pr_number
                }

                const total_amount = calculateTotalAmount();
                // Save general information and description
                const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

                const generalInfo = {
                    pr_number,
                    request_date, // Converts to date format
                    customer,
                    schedule_date, // Converts to date format
                    doc_no,
                    doc_reff,
                    doc_reff_no,
                    requestor,
                    departement,
                    company,
                    project,
                    vendor,
                    payment_term,
                    project_contract_number,
                    description,
                    total_amount,
                    status_request: "IN_PROCESS",
                    due_date
                };

                console.log('Master', generalInfo);
                console.log('Items', items);

                //Update general information
                const response = await UpdateDataService.postData(generalInfo, `PUREQ&column=id&value=${id}`, authToken, branchId);
                console.log('General data posted successfully:', response);

                if (response.message === "Update Data Successfully") {
                    // Iterate over items array and attempt to delete each item
                    for (const item of items) {
                        if (item.ID) {
                            const itemId = item.ID;
                            try {
                                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUREQD", authToken, branchId);
                                console.log('Item deleted successfully:', itemResponse);
                            } catch (error) {
                                console.error('Error deleting item:', itemId, error);
                            }
                        } else {
                            console.log('No ID found, skipping delete for this item:', item);
                        }
                    }

                    // After deletion, insert updated items
                    for (const item of items) {
                        // Exclude rwnum, ID, status, and id_trx fields
                        const { rwnum, ID, status, id_trx, ...rest } = item;

                        const updatedItem = {
                            ...rest,
                            pr_number
                        };

                        try {
                            const itemResponse = await InsertDataService.postData(updatedItem, "PUREQD", authToken, branchId);
                            console.log('Item inserted successfully:', itemResponse);
                        } catch (error) {
                            console.error('Error inserting item:', updatedItem, error);
                        }
                    }

                    // Show success message and reset form
                    messageAlertSwal('Success', response.message, 'success');
                    resetForm();
                }

            } catch (err) {
                console.error(err);
                setIsLoading(false);
                messageAlertSwal('Error', err.message, 'error');
            } finally {
                setIsLoading(false);
                setIsEditingPurchaseRequest(false);
                handleRefresh(); // Set loading state back to false after completion
            }
        } else {
            console.log('Form submission was canceled.');
        }
    };



    return (
        <Fragment>

            <section className="content">

                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title>General Information</Card.Title>
                                <div className="ml-auto">
                                    <Button variant="secondary" className="mr-2"
                                        onClick={() => {
                                            handleRefresh();
                                            setIsEditingPurchaseRequest(false);
                                        }}
                                    >
                                        <i className="fas fa-arrow-left"></i> Go Back
                                    </Button>
                                    <Button variant="primary" className="mr-2" onClick={handleSave}>
                                        <i className="fas fa-save"></i> Save
                                    </Button>
                                    <Button variant="primary" onClick={handleSubmit}>
                                        <i className="fas fa-check"></i> Submit
                                    </Button>
                                </div>
                            </Card.Header>

                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId="formPrNumber">
                                                <Form.Label>PR. Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter No Request"
                                                    value={pr_number}
                                                    onChange={(e) => setPrNumber(e.target.value)}
                                                    disabled
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>


                                        <Col md={6}>
                                            <Form.Group controlId="formDocNo">
                                                <Form.Label>Doc. No</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Document Number"
                                                    value={doc_no}
                                                    onChange={(e) => setDocNo(e.target.value)}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formDocReff">
                                                <Form.Label>Doc. Reference</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Document Reference"
                                                    value={doc_reff}
                                                    onChange={(e) => setDocReff(e.target.value)}

                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formDocReffNo">
                                                <Form.Label>Doc. Reference No</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Document Reference"
                                                    value={doc_reff_no}
                                                    onChange={(e) => setDocReffNo(e.target.value)}

                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formRequestor">
                                                <Form.Label>Requestor</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    // placeholder="Enter Document Number"
                                                    value={requestor}
                                                    onChange={(e) => setDocNo(e.target.value)}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formRequestDate">
                                                <Form.Label>Request Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={request_date}
                                                    onChange={(e) => setRequestDate(e.target.value)}
                                                    required
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formPaymentTerm">
                                                <Form.Label>Payment Term</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={payment_term}
                                                    onChange={(e) => setPaymentTerm(e.target.value)}
                                                    disabled
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formScheduleDate">
                                                <Form.Label>Schedule Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={schedule_date}
                                                    onChange={(e) => setScheduleDate(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>

                                        

                                        <Col md={6}>
                                            <Form.Group controlId="formDepartment">
                                                <Form.Label>Departement</Form.Label>
                                                <Select
                                                    id="departement"
                                                    value={selectedDepartement}
                                                    onChange={handleDeppartementChange}
                                                    options={departementOptions}
                                                    isClearable
                                                    placeholder="Select..."
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* <Col md={6}>
                                            <Form.Group controlId="formCompany">
                                                <Form.Label>Company</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={company}
                                                    onChange={(e) => setCompany(e.target.value)}
                                                    disabled
                                                    required
                                                />
                                            </Form.Group>
                                        </Col> */}
                                        <Col md={6}>
                                            <Form.Group controlId="formVendor">
                                                <Form.Label>Vendor</Form.Label>
                                                <Select
                                                    id="vendor"
                                                    value={selectedVendor}
                                                    onChange={handleVendorChange}
                                                    options={vendorOptions}
                                                    isClearable
                                                    placeholder="Select..."
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        {/* <Col md={6}>
                                            <Form.Group controlId="formCustomer">
                                                <Form.Label>Customer</Form.Label>
                                                <Select
                                                    id="customer"
                                                    value={selectedCustomer}
                                                    onChange={handleCustomerChange}
                                                    options={customerOptions}
                                                    isClearable
                                                    placeholder="Select..."
                                                    required
                                                />
                                            </Form.Group>
                                        </Col> */}
                                        <Col md={6}>
                                            <Form.Group controlId="formProject">
                                                <Form.Label>Project</Form.Label>
                                                <Select
                                                    id="project"
                                                    value={selectedProject}
                                                    onChange={handleProjectChange}
                                                    options={projectOptions}
                                                    isClearable
                                                    placeholder="Select..."
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="formCustomer">
                                                <Form.Label>Customer</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Customer"
                                                    value={customer}
                                                    onChange={(e) => setCustomer(e.target.value)}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="formProjectContactNumber">
                                                <Form.Label>Project Contact No.</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Document Number"
                                                    value={project_contract_number}
                                                    onChange={(e) => setProjectContractNumber(e.target.value)}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="formStatusRequest">
                                                <Form.Label>Status Request</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={status_request}
                                                    onChange={(e) => setStatusRequest(e.target.value)}
                                                    disabled
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Card.Title>Item List</Card.Title>
                                    <div>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={handleAddItem}
                                        >
                                            <i className="fas fa-plus"></i> New Item
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ml-2"
                                            onClick={handleDeleteSelected}
                                            disabled={selectedItems.length === 0}
                                        >
                                            <i className="fas fa-trash"></i> Delete Selected
                                        </Button>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Droppable droppableId="items">
                                        {(provided) => (
                                            <div
                                                className="table-responsive"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={handleSelectAll}
                                                                    checked={selectedItems.length === items.length && items.length > 0}
                                                                />
                                                            </th>
                                                            <th>Product</th>
                                                            <th>Product Description</th>
                                                            <th>Quantity</th>
                                                            <th>Currency</th>
                                                            <th>Unit Price</th>
                                                            <th>Total Price</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="7" className="text-center">No data available</td>
                                                            </tr>
                                                        ) : (
                                                            items.map((item, index) => (
                                                                <tr key={index} className={selectedItems.includes(index) ? 'table-active' : ''}>

                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedItems.includes(index)}
                                                                            onChange={() => handleSelectItem(index)}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Select
                                                                            value={productOptions.find(option => option.value === item.product)}
                                                                            onChange={(selectedOption) => handleItemChange(index, 'product', selectedOption)}
                                                                            options={productOptions}
                                                                            isClearable
                                                                            placeholder="Select product"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={item.product_note}
                                                                            onChange={(e) => handleItemChange(index, 'product_note', e.target.value)}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            type="number"
                                                                            value={item.quantity}
                                                                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                                            style={{ width: '80px' }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Select
                                                                            value={currencyOptions.find(option => option.value === item.currency)}
                                                                            onChange={(selectedOption) => handleItemChange(index, 'currency', selectedOption)}
                                                                            options={currencyOptions}
                                                                            isClearable
                                                                            placeholder="Select currency"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={item.unit_price === 0
                                                                                ? ''  // Show an empty input if the value is 0
                                                                                : item.currency === 'IDR'
                                                                                    ? item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })  // Format for IDR without decimals
                                                                                    : item.unit_price.toLocaleString('en-US')} // Format for non-IDR with 2 decimals
                                                                            onChange={(e) => {
                                                                                const rawValue = e.target.value.replace(/,/g, '');  // Remove commas to get raw number
                                                                                const value = parseFloat(rawValue);

                                                                                if (!isNaN(value)) {
                                                                                    handleItemChange(index, 'unit_price', value);  // Update state with raw numeric value
                                                                                } else if (rawValue === '') {
                                                                                    handleItemChange(index, 'unit_price', 0);  // Set value to 0 if input is cleared
                                                                                }
                                                                            }}
                                                                            onBlur={(e) => {
                                                                                const rawValue = e.target.value.replace(/,/g, '');  // Remove commas to get raw number
                                                                                let value = parseFloat(rawValue) || 0;

                                                                                let formattedValue;
                                                                                if (item.currency === 'IDR') {
                                                                                    // For IDR: Format without decimals
                                                                                    formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                                                                                } else {
                                                                                    // For non-IDR: Ensure there are 2 decimal places
                                                                                    formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                                                }

                                                                                e.target.value = formattedValue;  // Set the formatted value in the input field

                                                                                handleItemChange(index, 'unit_price', value);  // Update state with the parsed value
                                                                            }}
                                                                            style={{ textAlign: 'right' }}
                                                                        />
                                                                    </td>
                                                                    <td>{item.total_price.toLocaleString('en-US', { style: 'currency', currency: item.currency })}</td>
                                                                    <td>
                                                                        <Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            onClick={() => handleDeleteItem(index)}
                                                                        >
                                                                            <i className="fas fa-trash"></i>
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan="6" className="text-right">Total Amount:</td>
                                                            <td><strong>{calculateTotalAmount().toLocaleString('en-US', { style: 'currency', currency: 'IDR' })} </strong></td>
                                                            <td></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>

                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
                <Row className="mt-4">
                    <Col md={12}>
                        <Card>
                            <Card.Body>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}

                                    // Add state and event handling logic as needed
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


                <Row className="mt-4">
                    <Col md={12} className="d-flex justify-content-end">
                        <Button variant="secondary" className="mr-2"
                            onClick={() => {
                                handleRefresh();
                                setIsEditingPurchaseRequest(false);
                            }}
                        >
                            <i className="fas fa-arrow-left"></i> Go Back
                        </Button>
                        <Button variant="primary" className="mr-2" onClick={handleSave}>
                            <i className="fas fa-save"></i> Save
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            <i className="fas fa-check"></i> Submit
                        </Button>
                    </Col>
                </Row>
            </section>

            {isLoading && (
                <div className="full-screen-overlay">
                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                </div>
            )}
        </Fragment>
    );
}

export default EditPurchaseRequest;
