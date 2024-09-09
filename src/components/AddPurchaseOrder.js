  import React, { Fragment, useEffect, useState } from 'react';
  import { Button, Col, Form, InputGroup, Row, Card } from 'react-bootstrap';
  import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
  import Swal from 'sweetalert2';
  import { messageAlertSwal } from "../config/Swal";
  import InsertDataService from '../service/InsertDataService';
  import { getBranch, getToken, userLoggin } from '../config/Constant';
  import { GENERATED_NUMBER } from '../config/ConfigUrl';
  import { generateUniqueId } from '../service/GeneratedId';
  import Select from 'react-select';
  import LookupParamService from '../service/LookupParamService';
  import LookupService from '../service/LookupService';
  import CreatableSelect from 'react-select/creatable';

  const AddPurchaseOrder = ({ setIsAddingNewPurchaseRequest, handleRefresh,index, item  }) => {
    const headers = getToken();
    const branchId = getBranch();
    const userId = userLoggin();


    const [schedule_date, setScheduleDate] = useState('');
    const [requestor, setRequestor] = useState('');
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requestorOptions, setRequestorOptions] = useState([]);
    const [selectedRequestor, setSelectedRequestor] = useState(null);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // PO Fields
    const [title, setTitle] = useState('');
    const [po_number, setPoNumber] = useState('');
    const [docRef,setDocRef] = useState(''); 
    const [request_date, setRequestDate] = useState('');
    const [company, setCompany] = useState('');
    const [prNumber, setPrNumber] = useState('');
    const [order_date, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
    const [createdBy, setCreatedBy] = useState(userId);
    const [approveBy, setApproveBy] = useState('');
    const [shipTo, setShipTo] = useState('');
    const [shipToAddress, setShipToAddress] = useState('');
    const [billTo, setBillTo] = useState('');
    const [billToAddress, setBillToAddress] = useState('');

    // PO Lookup
    const [project, setProject] = useState('');
    const [projectOptions, setProjectOptions] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [departement, setDepartement] = useState('');
    const [departementOptions, setDepartementOptions] = useState([]);
    const [selectedDepartement, setSelectedDepartement] = useState(null);
    const [vendor, setVendor] = useState('');
    const [vendorOptions, setVendorOptions] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [customer, setCustomer] = useState('');
    const [customerOptions, setCustomerOptions] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [taxType, setTaxType] = useState('');
    const [taxTypeOptions, setTaxTypeOptions] = useState([]);
    const [selectedTaxType, setSelectedTaxType] = useState(null);
    const [paymentTerm, setPaymentTerm] = useState('');
    const [paymentTermOptions, setPaymentTermOptions] = useState([]);
    const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pr_number, setPR] = useState('');
    const [PROptions, setPROptions] = useState([]);
    const [selectedPR, setSelectedPR] = useState(null);
    const [PPNRate, setPPNRate] = useState('');



    const authToken = headers;

    // Lookup
    useEffect(() => {

    // Lookup Purchase Request
    LookupParamService.fetchLookupData("PURC_FORMPUREQ", authToken, branchId)
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
          value: item.PR_NUMBER,
          label: item.PR_NUMBER,
          REQUESTOR: item.REQUESTOR,
          DEPARTEMENT: item.DEPARTEMENT,
          COMPANY: item.COMPANY,
          PROJECT: item.PROJECT,
          CUSTOMER: item.CUSTOMER,
          REQUESTDATE: item.REQUEST_DATE
        }));
        setPROptions(options);
      })
      .catch(error => {
        console.error('Failed to fetch currency lookup:', error);
      });

      

      // Lookup Department
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


      
      // Lookup Requestor
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
        })
        .catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });


        // Lookup Tax Type
        LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId)
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

          const options = transformedData.filter(item => item.TAX_TYPE === 'PPN').map(item => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE
          }));
          setTaxTypeOptions(options);
        })
        .catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });


        // Lookup Currency
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


        // Lookup Vendor
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
          setVendorOptions(options);
        })
        .catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });


        // Lookup Project
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
        })
        .catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });


        // Lookup Customer
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
        })
        .catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });


        // Lookup Product
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


        // Lookup Payment Term
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
            value: item.NAME,
            label: item.NAME
          }));
          setPaymentTermOptions(options);
        })
        .catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });

       

        
    }, []);

    

    const handlePRChange = (selectedOption) => {
      setSelectedPR(selectedOption);
      setPR(selectedOption ? selectedOption.value : '');

      
      if (selectedOption) {
        const requestorOption = requestorOptions.find((option) => option.value === selectedOption.REQUESTOR);
        const departementOption = departementOptions.find((option) => option.value === selectedOption.DEPARTEMENT);
        const projectOption = projectOptions.find((option) => option.value === selectedOption.PROJECT);
        const customerOption = customerOptions.find((option) => option.value === selectedOption.CUSTOMER);
        setSelectedRequestor(requestorOption ? requestorOption : null);
        setRequestor(selectedOption.REQUESTOR);
        setSelectedDepartement(departementOption ? departementOption : null);
        setDepartement(selectedOption.DEPARTEMENT);
        setSelectedProject(projectOption ? projectOption : null);
        setProject(selectedOption.PROJECT);
        setSelectedCustomer(customerOption ? customerOption : null);
        setCustomer(selectedOption.CUSTOMER);
        setCompany(selectedOption.COMPANY ? selectedOption.COMPANY : '');
        setRequestDate(selectedOption.REQUESTDATE);


        // Lookup Purchase Request Item List
        LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then(response => {
          const fetchedItems = response.data || [];
          console.log('Items fetched:', fetchedItems);

          // Set fetched items to state
          setItems(fetchedItems);

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


      } else {
        setRequestDate('');
        setCompany('');
        setSelectedRequestor(null);
        setSelectedDepartement(null);
        setSelectedProject(null);
        setSelectedCustomer(null);
        setSelectedProduct(null);
        setSelectedCurrency(null);
        setItems([]);
      }
    }

    const handleOptionChange = (setter, stateSetter, selectedOption) => {
      setter(selectedOption);
      stateSetter(selectedOption ? selectedOption.value : '');
    };
   
    const handleAddItem = () => {
      setItems([...items, { product: '', product_note: '', quantity: 1, currency: 'IDR', unit_price: 0, originalUnitPrice: null, total_price: 0, tax_ppn_type: '', tax_ppn_rate: 0, tax_ppn_amount: 0 , tax_base: 0, discount: 0}]);
    };

    const handleItemChange = (index, field, value) => {
      const newItems = [...items];
      newItems[index][field] = value;

      console.log(index, field, value);

      if (field === 'quantity' || field === 'unit_price') {
        newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
      }

      if (field === 'tax_type') {
        const selectedTaxType = taxTypeOptions.find(option => option.value === value);
        setPPNRate(selectedTaxType ? selectedTaxType.RATE : '');
      }    

      if(field === 'vat_type') {
        let originalUnitPrice = newItems[index].unit_price;
        if (value === 'include') {
          newItems[index].unit_price = newItems[index].unit_price + (newItems[index].unit_price * 0.1)
          newItems[index].originalUnitPrice = originalUnitPrice;
          newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
          newItems[index].tax_base = newItems[index].total_amount - newItems[index].tax_ppn_amount;
        } else if (value === 'exclude') {
          newItems[index].unit_price = newItems[index].originalUnitPrice;
          newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
          newItems[index].tax_base = newItems[index].total_amount + newItems[index].tax_ppn_amount;
        }
      }
      
      // Total Amount
      if (PPNRate || field === 'total_price' || field === 'ppn_type') {
        newItems[index].tax_ppn_amount = newItems[index].total_price * PPNRate;
        console.log(newItems[index].tax_ppn_amount)
      } else {
        newItems[index].tax_ppn_amount = 0;
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
      setTitle('');
      setScheduleDate('');
      setRequestor('');
      setDepartement('');
      setVendor('');
      setProject('');
      setDescription('');
      setItems([]);
      setSelectedItems([]);
      setSelectedRequestor(null);
      setSelectedDepartement(null);
      setSelectedVendor(null);
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
          const generalInfo = {
            po_number,
            pr_number,
            project,
            vendor,
            title,
            order_date, // Converts to date format
            payment_term: paymentTerm,
            created_by: createdBy,
            description,
            total_amount,
            approved_by: approveBy
          };

          console.log('Master', generalInfo);

          const response = await InsertDataService.postData(generalInfo, "PUOR", authToken, branchId);
          console.log('Data posted successfully:', response);

          if (response.message === "insert Data Successfully") {
            // Iterate over items array and post each item individually
            for (const item of items) {
              const updatedItem = {
                ...item,
                po_number
              };

              delete updatedItem.rwnum; //Delete rwnum
              delete updatedItem.ID;
              delete updatedItem.pr_number;
              delete updatedItem.vat_type;
              delete updatedItem.originalUnitPrice;

              // apus klo db udh bener
              delete updatedItem.tax_ppn_rate;
              delete updatedItem.tax_ppn_type;

              const itemResponse = await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
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
    //   const generatePrNumber = async () => {
    //     try {
    //       const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=PR`, authToken);
    //       setPrNumber(uniquePrNumber);
    //     } catch (error) {
    //       console.error('Failed to generate PR Number:', error);
    //     }
    //   };

    //   generatePrNumber();
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
                        setIsAddingNewPurchaseRequest(false);
                      }}
                    >
                      <i className="fas fa-arrow-left"></i> Back
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
                        <Form.Group controlId='formPoNumber'>
                          <Form.Label>PO Number</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Enter PO Number'
                            value={po_number}
                            onChange={(e) => setPoNumber(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formTitle">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formDocRef">
                          <Form.Label>Doc. Reference</Form.Label>
                          <Form.Select
                            placeholder="Enter Document Number"
                            value={docRef}
                            onChange={(e) => setDocRef(e.target.value)}
                          >
                            <option value="">Select Document Reference</option>
                            {/* Add more options here */}
                            <option value="purchaseRequest">Purchase Request</option>
                            <option value="internalMemo">Internal Memo</option>
                            <option value="customerContract">Customer Contract</option>
                            {/* Add more options if needed */}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      { docRef === '' ? 
                        <></>
                      :
                        docRef === "purchaseRequest" ? 
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Purchase Request Number</Form.Label>
                            <Select 
                            value={selectedPR}
                            options={PROptions}
                            onChange={handlePRChange}
                            placeholder='Purhcase Request...'
                            isClearable
                            required
                          />
                          </Form.Group>
                        </Col>
                        : 
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Document Number</Form.Label>
                            <Form.Control
                              type='text'
                            />
                          </Form.Group>
                        </Col> 
                      }


                      <Col md={6}>
                        <Form.Group controlId='formCustomer'>
                          <Form.Label>Customer</Form.Label>
                          <Select
                            id='customer'
                            value={selectedCustomer}
                            options={customerOptions}
                            onChange={(selectedOption) => {
                              handleOptionChange(setSelectedCustomer, setCustomer, selectedOption);
                            }}
                            placeholder='Customer...'
                            isClearable
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formRequestor">
                          <Form.Label>Requestor</Form.Label>
                          <Select
                            id='requestor'
                            value={selectedRequestor}
                            onChange={(selectedOption) => {
                              handleOptionChange(setSelectedRequestor, setRequestor, selectedOption);
                            }}
                            options={requestorOptions}
                            placeholder='Requestor...'
                            isClearable
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formDepartment">
                          <Form.Label>Department</Form.Label>
                            <Select
                            id='department'
                            value={selectedDepartement}
                            onChange={(selectedOption)  => {
                              handleOptionChange(setSelectedDepartement, setDepartement, selectedOption);
                            }}
                            options={departementOptions}
                            placeholder='Department...'
                            isClearable
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formCompany">
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                      <Form.Group controlId="formProject">
                        <Form.Label>Project</Form.Label>
                        <Select
                          id="project"
                          value={selectedProject}
                          options={projectOptions}
                          onChange={(selectedOption) => {
                            handleOptionChange(setSelectedProject, setProject, selectedOption);
                          }}
                          placeholder="Project..."
                          isClearable 
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
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select
                            id='vendor'
                            value={selectedVendor}
                            options={vendorOptions}
                            onChange={(selectedOption) => {
                              handleOptionChange(setSelectedVendor, setVendor, selectedOption);
                            }}
                            isClearable
                            placeholder="Vendor..."
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formOrderDate">
                          <Form.Label>Order Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={order_date}
                            onChange={(e) => setOrderDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formPaymentTerm">
                          <Form.Label>Payment Term</Form.Label>
                          <Select
                            value={selectedPaymentTerm}
                            options={paymentTermOptions}
                            onChange={(selectedOption) => {
                              handleOptionChange(setSelectedPaymentTerm, setPaymentTerm, selectedOption);
                            }}
                            isClearable
                            placeholder='Payment Term...'
                            required 
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formCreatedBy">
                          <Form.Label>Created By</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Insert Created By'
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            disabled
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formApprovedBy">
                          <Form.Label>Approved By</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Insert Approved By'
                            value={approveBy}
                            onChange={(e) => setApproveBy(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId='formShipTo'>
                          <Form.Label>Ship To</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Insert Ship To'
                            value={shipTo}
                            onChange={(e) => setShipTo(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId='formShipToAddress'>
                          <Form.Label>Ship To Address</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Insert Ship To Address'
                            value={shipToAddress}
                            onChange={(e) => setShipToAddress(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId='formBillTo'>
                          <Form.Label>Bill To</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Insert Bill To'
                            value={billTo}
                            onChange={(e) => setBillTo(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId='formBillToAddress'>
                          <Form.Label>Bill To Address</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Insert Bill To Address'
                            value={billToAddress}
                            onChange={(e) => setBillToAddress(e.target.value)}
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
                        className='rounded-3'
                        variant="success"
                        size="sm"
                        onClick={handleAddItem}
                      >
                        <i className="fas fa-plus"></i> New Item
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ml-2 rounded-3"
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
                                <th>Type of VAT</th>
                                <th>Tax PPN Type</th>
                                <th>Tax PPN Rate</th>
                                <th>Tax PPN Amount</th>
                                <th>Tax Base</th>
                                <th>Total Price</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.length === 0 ? (
                                <tr>
                                  <td colSpan="13" className="text-center">No data available</td>
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
                                        onChange={(e) => handleItemChange(index, 'quantity', Math.max(0, parseFloat(e.target.value) || 0))}
                                      />
                                    </td>
                                    <td>
                                      <Select
                                        value={currencyOptions.find(option => option.value === item.currency)}
                                        onChange={(selectedOption) => {
                                          setSelectedCurrency(selectedOption);
                                          handleItemChange(index, 'currency', selectedOption ? selectedOption.value : 'IDR');
                                        }}
                                        options={currencyOptions}
                                        placeholder="Select Currency"
                                      />
                                    </td>
                                    <td>
                                      <Form.Control
                                        type="number"
                                        value={item.unit_price}
                                        onChange={(e) => handleItemChange(index, 'unit_price', Math.max(0, parseFloat(e.target.value) || 0))}
                                      />
                                    </td>
                                    <td>
                                      <Form.Select
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'vat_type', selectedOption.target.value);
                                        }}
                                      >
                                        <option value="">Select VAT</option>
                                        {/* Add more options here */}
                                        <option value="include">Include</option>
                                        <option value="exclude">Exclude</option>
                                      </Form.Select>
                                    </td>
                                    <td>
                                      <Select
                                        value={taxTypeOptions.find(option => option.value === item.tax_ppn_type)}
                                        options={taxTypeOptions}
                                        placeholder="Select Tax Type"
                                        isClearable
                                        onChange={(selectedOption) => {
                                          setSelectedTaxType(selectedOption);
                                          handleItemChange(index, 'tax_ppn_type', selectedOption ? selectedOption.value : '');
                                          if (selectedOption) {
                                            // setPPNRate(selectedOption.RATE); 
                                            handleItemChange(index, 'ppn_rate', selectedOption.RATE);
                                          } else {
                                            // setPPNRate(''); 
                                            handleItemChange(index, 'tax_ppn_rate', 0);
                                          }
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <Form.Control
                                        type='text'
                                        value={item.tax_ppn_rate}
                                        disabled
                                      />
                                    </td>
                                    <td>
                                      <Form.Control
                                        type='number'
                                        value={item.tax_ppn_amount}
                                        onChange={(e) => handleItemChange(index, 'tax_ppn_amount', parseFloat(e.target.value) || 0)}
                                      />
                                    </td>
                                    <td>
                                      <Form.Control
                                        type='number'
                                        value={item.tax_base}
                                        onChange={(e) => handleItemChange(index, 'tax_base', parseFloat(e.target.value) || 0)}
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
                                <th colSpan="11" className='text-right'>Discount:</th>
                                <th colSpan="1" className='text-right'>
                                  <Form.Control
                                    type='number'
                                  />
                                </th>
                              </tr>
                              <tr>
                                <td colSpan="11" className="text-right">Total Amount:</td>
                                <td><strong>{calculateTotalAmount().toLocaleString('en-US', { style: 'currency', currency: 'IDR' })} </strong></td>
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
                  setIsAddingNewPurchaseRequest(false);
                }}
              >
                <i className="fas fa-arrow-left"></i> Back
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

  export default AddPurchaseOrder;