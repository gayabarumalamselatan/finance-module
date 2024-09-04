import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from '../service/InsertDataService';
import { getBranch, getToken } from '../config/Constant';
import { GENERATED_NUMBER } from '../config/ConfigUrl';
import { generateUniqueId } from '../service/GeneratedId';
import Select from 'react-select';
import LookupParamService from '../service/LookupParamService';
import CreatableSelect from 'react-select/creatable';
import LookupService from '../service/LookupService';

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
    const [requestor, setRequestor] = useState('');
    const [departement, setDepartment] = useState('');
    const [company, setCompany] = useState('');
    const [project, setProject] = useState('');
    const [status_request, setStatusRequest] = useState('Draft');
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requestorOptions, setRequestorOptions] = useState([]);
    const [selectedRequestor, setSelectedRequestor] = useState(null);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [departementOptions, setDepartementOptions] = useState([]);
    const [selectedDepartement, setSelectedDepartement] = useState(null);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [projectOptions, setProjectOptions] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

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
                    setRequestor(data.requestor);
                    setDepartment(data.departement);
                    setCompany(data.company);
                    setProject(data.project);
                    setDescription(data.description);
                })
                .catch(error => {
                    console.error('Failed to load purchase request data:', error);
                });

            // Panggil API untuk mendapatkan item berdasarkan pr_number
            LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${PR_NUMBER}&operation=EQUAL`, authToken, branchId)
                .then(response => {
                    setItems(response.data || []);
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

            LookupParamService.fetchLookupData("MSDT_FORMVNDR", authToken, branchId)
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
                    setCompanyOptions(options);
                    const selectedCompanyOption = options.find(option => option.value === selectedData[0].COMPANY);
                    setSelectedCompany(selectedCompanyOption || null);
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
                        label: item.NAME
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
                    const selectedProductOption = options.find(option => option.value === selectedData[0].PRODUCT);
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

                    const options = transformedData.map(item => ({
                        value: item.NAME,
                        label: item.NAME
                    }));
                    setCustomerOptions(options);
                    console.log('Customer :', customer);
                    const selectedCustomerOption = options.find(option => option.value === selectedData[0].CUSTOMER);
                    setSelectedCustomer(selectedCustomerOption || null);
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

    const handleCompanyChange = (selectedOption) => {
        setSelectedCompany(selectedOption);
        setCompany(selectedOption ? selectedOption.value : '');
    };

    const handleProjectChange = (selectedOption) => {
        setSelectedProject(selectedOption);
        setProject(selectedOption ? selectedOption.value : '');
    };

    const handleCustomerChange = (selectedOption) => {
        setSelectedCustomer(selectedOption);
        setCustomer(selectedOption ? selectedOption.value : '');
    }

    const handleAddItem = () => {
        setItems([...items, { product: '', product_note: '', quantity: 0, currency: 'IDR', unit_price: 0, total_price: 0 }]);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        console.log(index, field, value);

        if (field === 'quantity' || field === 'unit_price') {
            newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
        }

        setItems(newItems);
    };

    const handleDeleteItem = (index) => {
        const newItems = items.filter((item, i) => i !== index);
        setItems(newItems);
        setSelectedItems(selectedItems.filter((i) => i !== index));
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
        setRequestor('');
        setDepartment('');
        setCompany('');
        setProject('');
        setDescription('');
        setItems([]);
        setSelectedItems([]);
        setSelectedRequestor(null);
        setSelectedDepartement(null);
        setSelectedCompany(null);
        setSelectedProject(null);
        setSelectedCurrency(null);
    };



    const handleSave = async (event) => {
        event.preventDefault();

        // Show SweetAlert2 confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save the Purchase Request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                const total_amount = calculateTotalAmount();
                // Save general information and description
                const createBy = sessionStorage.getItem('userId');
                const generalInfo = {
                    pr_number,
                    request_date, // Converts to date format
                    customer,
                    schedule_date, // Converts to date format
                    doc_no,
                    doc_reff,
                    requestor,
                    departement,
                    company,
                    project,
                    description,
                    total_amount,
                    create_by: createBy
                };

                console.log('Master', generalInfo);

                const response = await InsertDataService.postData(generalInfo, "PUREQ", authToken, branchId);
                console.log('Data posted successfully:', response);

                if (response.message === "insert Data Successfully") {
                    // Iterate over items array and post each item individually
                    for (const item of items) {
                        const updatedItem = {
                            ...item,
                            pr_number
                        };

                        const itemResponse = await InsertDataService.postData(updatedItem, "PUREQD", authToken, branchId);
                        console.log('Item posted successfully:', itemResponse);
                    }

                    messageAlertSwal('Success', response.message, 'success');
                    resetForm();
                }
            } catch (err) {
                console.error(err);
                setIsLoading(false);
                messageAlertSwal('Error', err.message, 'error');
            } finally {
                setIsLoading(false); // Set loading state back to false after completion
            }
        } else {
            console.log('Form submission was canceled.');
        }
    };

    // useEffect(() => {
    //     const generatePrNumber = async () => {
    //         try {
    //             const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=DRAFT_PR`, authToken);
    //             setPrNumber(uniquePrNumber);
    //         } catch (error) {
    //             console.error('Failed to generate PR Number:', error);
    //         }
    //     };

    //     generatePrNumber();
    // }, []);

    return (
        <Fragment>

            <section className="content">

                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title>General Information</Card.Title>
                                <div className="ml-auto">
                                    <Button
                                        variant="secondary"
                                        className="mr-2"
                                        onClick={() => {
                                            handleRefresh();
                                            setIsEditingPurchaseRequest(false);
                                        }}
                                    >
                                        <i className="fas fa-times"></i> Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleSave}>
                                        <i className="fas fa-save"></i> Save
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
                                            <Form.Group controlId="formRequestor">
                                                <Form.Label>Requestor</Form.Label>
                                                <CreatableSelect
                                                    id="requestor"
                                                    value={selectedRequestor}
                                                    onChange={handleRequestorChange}
                                                    options={requestorOptions}
                                                    isClearable
                                                    placeholder="Select or type to create..."
                                                    onCreateOption={(inputValue) => {
                                                        const newOption = { value: inputValue, label: inputValue };
                                                        setRequestorOptions(prevOptions => [...prevOptions, newOption]);
                                                        setSelectedRequestor(newOption);
                                                    }}
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

                                        <Col md={6}>
                                            <Form.Group controlId="formCompany">
                                                <Form.Label>Company</Form.Label>
                                                <Select
                                                    id="company"
                                                    value={selectedCompany}
                                                    onChange={handleCompanyChange}
                                                    options={companyOptions}
                                                    isClearable
                                                    placeholder="Select..."
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>

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
                                            <Form.Group controlId="formRequestDate">
                                                <Form.Label>Request Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={request_date}
                                                    onChange={(e) => setRequestDate(e.target.value)}
                                                    required
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
                                                            <th>Notes</th>
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
                                                                            value={selectedProduct}
                                                                            onChange={(selectedOption) => {
                                                                                setSelectedProduct(selectedOption);
                                                                                handleItemChange(index, 'product', selectedOption ? selectedOption.value : null);
                                                                            }}
                                                                            options={productOptions}
                                                                            isClearable
                                                                            placeholder="Select Product..."
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
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Select
                                                                            value={selectedCurrency}
                                                                            onChange={(selectedOption) => {
                                                                                setSelectedCurrency(selectedOption);
                                                                                handleItemChange(index, 'currency', selectedOption ? selectedOption.value : null);
                                                                            }}
                                                                            options={currencyOptions}
                                                                            isClearable
                                                                            placeholder="Select Currency"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            type="number"
                                                                            value={item.unit_price}
                                                                            onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
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
                            <i className="fas fa-times"></i> Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            <i className="fas fa-save"></i> Save
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
