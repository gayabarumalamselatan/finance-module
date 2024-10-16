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
import axios from 'axios';

const AddPurchaseRequest = ({ setIsAddingNewPurchaseRequest, handleRefresh, index, item }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem('userId')
  const [pr_number, setPrNumber] = useState('');
  const [request_date, setRequestDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [schedule_date, setScheduleDate] = useState('');
  const [doc_no, setDocNo] = useState('FRM.PTAP.PRC.21a-01');
  const [doc_reff, setDocReff] = useState('');
  const [doc_reff_no, setDocReffNo] = useState('');
  const [requestor, setRequestor] = useState(userId);
  const [departement, setDepartment] = useState('');
  const [company, setCompany] = useState('PT. Abhimata Persada');
  const [vendor, setVendor] = useState('');
  const [project, setProject] = useState('');
  const [project_contract_number, setProjectContractNumber] = useState('');
  const [payment_term, setPaymentTerm] = useState('');
  const [status_request, setStatusRequest] = useState('Draft');
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // const [customerOptions, setCustomerOptions] = useState([]);
  // const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState([]);


  const authToken = headers;

  useEffect(() => {

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
      })
      .catch(error => {
        console.error('Failed to fetch currency lookup:', error);
      });


    LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
      .then(data => {
        console.log('Project lookup data:', data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map(item =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        console.log('Transformed data project:', transformedData);

        const options = transformedData.map(item => ({
          value: item.NAME,
          label: item.NAME,
          project_contract_number: item.CONTRACT_NUMBER,
          customer: item.CUSTOMER
        }));
        setProjectOptions(options);
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
      })
      .catch(error => {
        console.error('Failed to fetch currency lookup:', error);
      });

    // LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
    //   .then(data => {
    //     console.log('Currency lookup data:', data);

    //     // Transform keys to uppercase directly in the received data
    //     const transformedData = data.data.map(item =>
    //       Object.keys(item).reduce((acc, key) => {
    //         acc[key.toUpperCase()] = item[key];
    //         return acc;
    //       }, {})
    //     );
    //     //console.log('Transformed data:', transformedData);

    //     const options = transformedData.map(item => ({
    //       value: item.NAME,
    //       label: item.NAME
    //     }));
    //     setCustomerOptions(options);
    //   })
    //   .catch(error => {
    //     console.error('Failed to fetch currency lookup:', error);
    //   });

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
        setVendorOptions(options);
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
      })
      .catch(error => {
        console.error('Failed to fetch currency lookup:', error);
      });
  }, []);

  // const handleRequestorChange = (selectedOption) => {
  //   setSelectedRequestor(selectedOption);
  //   setRequestor(selectedOption ? selectedOption.value : '');
  // };

  const handleDeppartementChange = (selectedOption) => {
    setSelectedDepartement(selectedOption);
    setDepartment(selectedOption ? selectedOption.value : '');
  };


  const handleProjectChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : '');
    setProjectContractNumber(selectedOption.project_contract_number);
    setCustomer(selectedOption ? selectedOption.customer : '');
  };

  // const handleCustomerChange = (selectedOption) => {
  //   setSelectedCustomer(selectedOption);
  //   setCustomer(selectedOption ? selectedOption.value : '');
  // }

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : '');
  }

  const handlePaymentTermChange = async (selectedOption) => {
    console.log('pay term select', selectedOption);
    console.log(request_date);
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : '');

    const payload = {
      date: request_date,
      count: selectedOption ? selectedOption.value : '',
      dateType: selectedOption ? selectedOption.dateType : ''
    };

    console.log(payload);
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
  
    } catch (error) {
      // Handle any errors
      console.error('Error calling API:', error);
    }
  }

  const handleAddItem = () => {
    setItems([...items, { product: '', product_note: '', quantity: '', currency: 'IDR', unit_price: 0, total_price: 0 }]);
  };

  // const handleItemChange = (index, field, value) => {
  //   const newItems = [...items];
  //   if (field === 'product' || field === 'currency') {
  //     newItems[index][field] = value ? value.value : null;
  //   } else {
  //     newItems[index][field] = value;
  //   }

  //   if (field === 'quantity' || field === 'unit_price') {
  //     newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
  //   }

  //   setItems(newItems);
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
    generatePrNumber("DRAFT_PR");
    setRequestDate('');
    setCustomer('');
    setScheduleDate('');
    setDocReff('');
    setDocReffNo('');
    setRequestor(userId);
    setDepartment('');
    setCompany('PT. Abhimata Persada');
    setProject('');
    setProjectContractNumber('');
    setDescription('');
    setItems([]);
    setSelectedItems([]);
    setSelectedDepartement(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    // setSelectedCustomer(null);
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
          doc_reff_no,
          requestor,
          departement,
          vendor,
          payment_term,
          company,
          project,
          description,
          total_amount,
          status_request: 'DRAFT',
          project_contract_number,
          due_date,
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
        const pr_number = await generatePrNumber("PR");

        console.log('pr_number', pr_number);

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
          doc_reff_no,
          requestor,
          departement,
          company,
          project,
          description,
          total_amount,
          status_request: 'IN_PROCESS',
          project_contract_number,
          due_date
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

  const generatePrNumber = async (code) => {
    try {
      const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
      setPrNumber(uniquePrNumber); // Updates state, if needed elsewhere in your component
      return uniquePrNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error('Failed to generate PR Number:', error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };


  useEffect(() => {

    generatePrNumber("DRAFT_PR");
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    setRequestDate(today);
  }, []);

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
                      setIsAddingNewPurchaseRequest(false);
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
                          onChange={(e) => setRequestor(e.target.value)}
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
                          disabled // Disable the input field
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formPaymentTerm">
                        <Form.Label>Payment Term</Form.Label>
                        <Select
                          id="paymentTerm"
                          value={selectedPaymentTerm}
                          onChange={handlePaymentTermChange}
                          options={paymentTermOptions}
                          isClearable
                          placeholder="Select..."
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
                    {/* <Col md={6}><Form.Group controlId="formRequestor">
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
                            setRequestorOptions((prevOptions) => [...prevOptions, newOption]);
                            setSelectedRequestor(newOption);
                          }}
                          required
                        />
                      </Form.Group>
                    </Col> */}

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

                    {/* <Col md={6}>
                      <Form.Group controlId="formCompany">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                          type="text"
                          // placeholder="Enter Document Number"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          disabled
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
                          placeholder="Enter Project Contact Number"
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
                                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
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
                                      style={{ width: '80px' }}
                                    />
                                  </td>
                                  <td>
                                    {/* <Form.Control
                                      type="number"
                                      value={item.unit_price}
                                      onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                    /> */}
                                    <Form.Control
                                      type="text"
                                      // value={item.unit_price === 0
                                      //   ? ''  // Show an empty input if the value is 0
                                      //   : item.currency === 'IDR'
                                      //     ? item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })  // Format for IDR without decimals
                                      //     : item.unit_price.toLocaleString('en-US')} // Format for non-IDR with 2 decimals
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

                                        console.log('Formatted value:', formattedValue);

                                        e.target.value = formattedValue;  // Set the formatted value in the input field

                                        handleItemChange(index, 'unit_price', value);  // Update state with the parsed value
                                      }}
                                      style={{ textAlign: 'right' }}
                                    />


                                  </td>
                                  <td className="text-end">{item.total_price.toLocaleString('en-US', { currency: item.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
                              <td className="text-end"><strong>{calculateTotalAmount().toLocaleString('en-US', { currency: 'IDR', minimumFractionDigits: 2, maximumFractionDigits: 2 })} </strong></td>
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


        <Row className="mt-5">
          <Col md={12} className="d-flex justify-content-end">
            <Button variant="secondary" className="mr-2"
              onClick={() => {
                handleRefresh();
                setIsAddingNewPurchaseRequest(false);
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

export default AddPurchaseRequest;