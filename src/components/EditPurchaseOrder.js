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
import UpdateDataService from '../service/UpdateDataService';
import DeleteDataService from '../service/DeleteDataService';

const EditPurchaseOrder = ({ setIsEditingPurchaseOrder, handleRefresh, index, item, selectedData }) => {
    console.log('selectedData', selectedData);
    const headers = getToken();
    const branchId = getBranch();

    const [schedule_date, setScheduleDate] = useState('');
    const [doc_no, setDocNo] = useState('FRM.PTAP.PRC.21a-01');
    const [doc_reff, setDocReff] = useState('');
    const [requestor, setRequestor] = useState('');
    const [status_request, setStatusRequest] = useState('Draft');
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requestorOptions, setRequestorOptions] = useState([]);
    const [selectedRequestor, setSelectedRequestor] = useState(null);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);



       // PO Fields
       const [title, setTitle] = useState('');
       const [po_number, setPoNumber] = useState('');
       const [docRef,setDocRef] = useState(''); 
       const [request_date, setRequestDate] = useState('');
       const [company, setCompany] = useState('');
       const [prNumber, setPrNumber] = useState('');
       const [order_date, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
       const [createdBy, setCreatedBy] = useState('');
       const [approveBy, setApproveBy] = useState('');
       const [shipTo, setShipTo] = useState('');
       const [shipToAddress, setShipToAddress] = useState('');
       const [billTo, setBillTo] = useState('');
       const [billToAddress, setBillToAddress] = useState('');
       const [statusPo, setStatusPo] = useState('');
      
   
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
       const [PROptions, setPROptions] = useState([]);
       const [selectedPR, setSelectedPR] = useState(null);
       const [PPNRate, setPPNRate] = useState('');
       const [docRefNumber, setDocRefNumber] = useState('');
       const [selectedDocRefNum, setSelectedDocRefNum] = useState([]);

       const [vatIncluded, setVatIncluded] = useState(false);

    const authToken = headers;
    useEffect(() => {
        if (selectedData) {
            const { ID, PO_NUMBER } = selectedData[0];
            // Set data awal dari selectedData
            console.log('id and pr number', ID, PO_NUMBER);
            setPoNumber(PO_NUMBER);

            // Panggil API untuk mendapatkan data berdasarkan ID
            LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=PO_NUMBER&filterValue=${PO_NUMBER}&operation=EQUAL`, authToken, branchId)
                .then(response => {
                    const data = response.data[0];
                    console.log('Data:', data);
                    setTitle(data.title);
                    setRequestDate(data.request_date);
                    setCustomer(data.customer);
                    setScheduleDate(data.schedule_date);
                    setDocNo(data.doc_no);
                    setDocReff(data.doc_reff);
                    setRequestor(data.requestor);
                    setVendor(data.vendor)
                    setCompany(data.company);

                    setStatusPo(data.status_po);
                    setDepartement(data.departement);
                    setPaymentTerm(data.payment_term);
                    setDocRefNumber(data.doc_reference);
                    setApproveBy(data.approved_by);
                    setCreatedBy(data.created_by);
                    setProject(data.project);
                    setDescription(data.description);
                    setShipTo(data.ship_to);
                    setShipToAddress(data.ship_to_address);
                    setBillTo(data.bill_to);
                    setBillToAddress(data.bill_to_address);
                })
                .catch(error => {
                    console.error('Failed to load purchase request data:', error);
                });

            // Panggil API untuk mendapatkan item berdasarkan pr_number
            // LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${PR_NUMBER}&operation=EQUAL`, authToken, branchId)
            //     .then(response => {
            //         const fetchedItems = response.data || [];
            //         console.log('Items fetch:', fetchedItems);
            //         setItems(fetchedItems);
            //     })
            //     .catch(error => {
            //         console.error('Failed to load items:', error);
            //     });

            // Fetch items based on PR_NUMBER and set them to state
            LookupService.fetchLookupData(`PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${PO_NUMBER}&operation=EQUAL`, authToken, branchId)
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
                                const selectedTaxTypeOption = options.find(option => option.value === selectedData[0].TAX_PPN);
                                setSelectedTaxType(selectedTaxTypeOption || null);
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
                    const selectedRequestorOption = options.find(option => option.value === selectedData[0].REQUESTOR);
                    setSelectedRequestor(selectedRequestorOption || null);

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
                    // const selectedCurrencyOption = options.find(option => option.value === currency);
                    // setSelectedCurrency(selectedCurrencyOption || null);
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
                    const selectedDepartementOption = options.find(option => option.value === selectedData[0].DEPARTEMENT);
                    setSelectedDepartement(selectedDepartementOption || null);
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
                    const selectedProjectOption = options.find(option => option.value === selectedData[0].PROJECT);
                    setSelectedProject(selectedProjectOption || null);
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
                    console.log('Product :', options);
                    const selectedProductOption = options.find(option => option.value === selectedData[0].PRODUCT);
                    setSelectedProduct(selectedProductOption || null);
                })
                .catch(error => {
                    console.error('Failed to fetch currency lookup:', error);
                });



                // Lookup Vendor
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
        
                  const options = transformedData.filter(item => item.ENTITY_TYPE === 'BOTH').map(item => ({
                    value: item.NAME,
                    label: item.NAME
                  }));
                  setVendorOptions(options);
                  const selectedVendor = options.find(option => option.value === selectedData[0].VENDOR);
                  setSelectedVendor(selectedVendor || null);
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
                const selectedPaymentTerm = options.find(option => option.value === selectedData[0].PAYMENT_TERM);
                setSelectedPaymentTerm(selectedPaymentTerm || null);

                })
                .catch(error => {
                console.error('Failed to fetch currency lookup:', error);
                });



                //Lookup Customer 
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

    // const handleDeppartementChange = (selectedOption) => {
    //     setSelectedDepartement(selectedOption);
    //     setDepartment(selectedOption ? selectedOption.value : '');
    // };

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
        setItems([...items, { 
          product: '', 
          product_note: '', 
          quantity: 1, 
          currency: 'IDR', 
          unit_price: 0, 
          original_unit_price: 0, 
          total_price: 0, 
          tax_ppn_type: 0, 
          tax_ppn_rate: 0, 
          tax_ppn_amount: 0 , 
          tax_base: 0, 
          discount: 0,
          sub_total: 0, 
        }]);
      };
      const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
  
        console.log(index, field, value);
  
        if (field === 'vat_type') {
          if (value === 'include') {
            newItems[index].unit_price = newItems[index].unit_price + (newItems[index].unit_price * 0.1); 
            setVatIncluded(true);
            console.log(vatIncluded);
          } else if (value === 'exclude' && vatIncluded === true) {
            if (vatIncluded === true) {
              newItems[index].unit_price = Math.round(newItems[index].unit_price / 1.1);
              setVatIncluded(false);
              console.log(vatIncluded);
              
            }
          }
          newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
        }
  
        if (field === 'tax_ppn_type' || newItems[index].tax_ppn_rate) {
          if (newItems[index].vat_type === 'include' || field === 'tax_ppn_type') {
            let kali = 1+(newItems[index].tax_ppn_rate/100);
            let kalia = newItems[index].tax_ppn_rate/100;
            let taxbases = newItems[index].unit_price/(kali*newItems[index].quantity);
            console.log('taxbases', taxbases);  
            console.log('kalia', kalia);
            console.log('kali', kali);
            newItems[index].tax_base = Math.round(newItems[index].unit_price/((1+(newItems[index].tax_ppn_rate/100))*newItems[index].quantity)); 
            console.log('newunitprice', newItems[index].unit_price);
            console.log('newunppnrate', newItems[index].tax_ppn_rate);
            console.log('taxbase', newItems[index].tax_base);
            console.log('taxbase', newItems[index].vat_type);
          } else if (newItems[index].vat_type === 'exclude') {
            newItems[index].tax_base = newItems[index].unit_price * newItems[index].quantity; 
          }
        }
  
        if (field === 'tax_ppn_type' || field === 'unit_price') {
          console.log('log point1', newItems[index].tax_ppn_amount);
          newItems[index].tax_ppn_amount = newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100);
          console.log('log point2', newItems[index].tax_ppn_amount);
          console.log('log point3',newItems[index].tax_ppn_type);
          console.log('taxratee', newItems[index].tax_ppn_rate);
        }
  
        if (field === 'quantity' || field === 'unit_price') {
          newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
          
        }
  
        // if (field === 'tax_type') {
        //   const selectedTaxType = taxTypeOptions.find(option => option.value === value);
        //   setPPNRate(selectedTaxType ? selectedTaxType.RATE : '');
        // }    
  
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
        const subTotal = items.reduce((total, item) => total + item.tax_base, 0);
        const totalPPNAmount = items.reduce((total, item) => total + item.tax_ppn_amount, 0);
        console.log('totalPPN', totalPPNAmount);
        const totalAmount  =  items.reduce((total, item) => total + item.total_price, 0);
        return { subTotal, totalPPNAmount, totalAmount };
      };
  

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const newItems = [...items];
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setItems(newItems);
    };

    const resetForm = () => {
        setPoNumber('');
        setRequestDate('');
        setCustomer('');
        setScheduleDate('');
        setDocNo('');
        setDocReff('');
        setRequestor('');
        // setDepartment('');
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
                const { subTotal, totalPPNAmount, totalAmount} = calculateTotalAmount();
                // Save general information and description
                const createBy = sessionStorage.getItem('userId');
                const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

                const generalInfo = {
                    po_number,
                    doc_reference: docRefNumber,
                    project,
                    vendor,
                    status_po: statusPo,
                    title,
                    order_date, // Converts to date format
                    payment_term: paymentTerm,
                    created_by: createdBy,
                    description,
                    customer,
                    requestor,
                    departement,
                    company,
                    total_amount: totalAmount,
                    approved_by: approveBy,
                    ship_to: shipTo,
                    ship_to_address: shipToAddress,
                    bill_to: billTo,
                    bill_to_address: billToAddress,
                    total_tax_base: subTotal,
                    total_amount_ppn: totalPPNAmount,
                };

                console.log('Master', generalInfo);
                console.log('Items', items);

                //Update general information
                const response = await UpdateDataService.postData(generalInfo, `PUOR&column=id&value=${id}`, authToken, branchId);
                console.log('General data posted successfully:', response);

                if (response.message === "Update Data Successfully") {
                    // Iterate over items array and attempt to delete each item
                    for (const item of items) {
                        if (item.ID) {
                            const itemId = item.ID;
                            try {
                                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUORD", authToken, branchId);
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
                            po_number
                        };

                        try {
                            const itemResponse = await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
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
                setIsEditingPurchaseOrder(false);
                handleRefresh(); // Set loading state back to false after completion
            }
        } else {
            console.log('Form submission was canceled.');
        }
    };


    const handleSubmit = async (event) => {
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
                // Generate PR number
                const pr_number = await generatePrNumber();

                const total_amount = calculateTotalAmount();
                // Save general information and description
                const createBy = sessionStorage.getItem('userId');
                const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

                const { subTotal, totalPPNAmount, totalAmount} = calculateTotalAmount();

                const generalInfo = {
                    po_number,
                    doc_reference: docRefNumber,
                    project,
                    vendor,
                    status_po: 'IN_PROCESS',
                    title,
                    order_date, // Converts to date format
                    payment_term: paymentTerm,
                    created_by: createdBy,
                    description,
                    customer,
                    requestor,
                    departement,
                    company,
                    total_amount: totalAmount,
                    approved_by: approveBy,
                    ship_to: shipTo,
                    ship_to_address: shipToAddress,
                    bill_to: billTo,
                    bill_to_address: billToAddress,
                    total_tax_base: subTotal,
                    total_amount_ppn: totalPPNAmount,
                };

                console.log('Master', generalInfo);
                console.log('Items', items);

                //Update general information
                const response = await UpdateDataService.postData(generalInfo, `PUOR&column=id&value=${id}`, authToken, branchId);
                console.log('General data posted successfully:', response);

                if (response.message === "Update Data Successfully") {
                    // Iterate over items array and attempt to delete each item
                    for (const item of items) {
                        if (item.ID) {
                            const itemId = item.ID;
                            try {
                                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUORD", authToken, branchId);
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
                            po_number
                        };

                        try {
                            const itemResponse = await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
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
                setIsEditingPurchaseOrder(false);
                handleRefresh(); // Set loading state back to false after completion
            }
        } else {
            console.log('Form submission was canceled.');
        }
    };

    const handleOptionChange = (setter, stateSetter, selectedOption) => {
        setter(selectedOption);
        stateSetter(selectedOption ? selectedOption.value : '');
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
                                            setIsEditingPurchaseOrder(false);
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
                                                <Form.Label>PO. Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter No Request"
                                                    value={po_number}
                                                    onChange={(e) => setPoNumber(e.target.value)}
                                                    disabled
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
                                            <Form.Group>
                                                <Form.Label>Doc. Reference</Form.Label>
                                                <Form.Control
                                                    value={docRefNumber}
                                                    onChange={(e) => setDocRefNumber(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                         <Col md={6}>
                                            <Form.Group controlId='formCustomer'>
                                                <Form.Label>Customer</Form.Label>
                                                <Select
                                                    id='customer'
                                                    value={selectedCustomer}
                                                    options={customerOptions}
                                                    onChange={handleCustomerChange}
                                                    placeholder='Customer...'
                                                    isClearable
                                                    required
                                                    isDisabled = {docRef === 'purchaseRequest'}
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
                                                    isDisabled = {docRef === 'purchaseRequest'}
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
                                                    isDisabled = {docRef === 'purchaseRequest'}
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
                                                            <th>Type of VAT</th>
                                                            <th>Tax PPN Type</th>
                                                            <th>Tax PPN Rate</th>
                                                            <th>Tax PPN Amount</th>
                                                            <th>Tax Base </th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="12" className="text-center">No data available</td>
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
                                                                            type="number"
                                                                            value={item.unit_price}
                                                                            onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                                        />
                                                                    </td>
                                                                    <td>{item.total_price.toLocaleString('en-US', { style: 'currency', currency: item.currency })}</td>

                                                                    <td>
                                                                        <Form.Select
                                                                            value={item.type_of_vat || ''}
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
                                                                            value={taxTypeOptions.find(option => option.value === item.tax_ppn)}
                                                                            options={taxTypeOptions}
                                                                            placeholder="Select Tax Type"
                                                                            isClearable
                                                                            onChange={(selectedOption) => {
                                                                            setSelectedTaxType(selectedOption);
                                                                            if (selectedOption) {
                                                                                // setPPNRate(selectedOption.RATE); 
                                                                                handleItemChange(index, 'tax_ppn_rate', parseFloat(selectedOption.RATE));
                                                                            } else {
                                                                                // setPPNRate(''); 
                                                                                handleItemChange(index, 'tax_ppn_rate', 0);
                                                                            }
                                                                            handleItemChange(index, 'tax_ppn_type', selectedOption ? selectedOption.value : '');
                                                                            
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

                                                                    <td style={{textAlign: 'right'}}>
                                                                        {item.tax_ppn_amount ? item.tax_ppn_amount.toLocaleString('en-US', { style: 'currency', currency: item.currency }) : 'IDR 0.00'}
                                                                    </td>

                                                                    <td>
                                                                    <Form.Control
                                                                        type='text'
                                                                        disabled
                                                                        style={{textAlign: 'right'}}
                                                                        value={item.tax_base}
                                                                        onChange={(e) => handleItemChange(index, 'tax_base', parseFloat(e.target.value) || 0)}
                                                                    />
                                                                    </td>

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
                                                        <tr className='text-right'>
                                                            <td colSpan="11">Subtotal:</td>
                                                            <td><strong>{calculateTotalAmount().subTotal.toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}</strong></td>
                                                            <td/>
                                                        </tr>
                                                        <tr className='text-right'>
                                                            <td colSpan="11">Total PPN:</td>
                                                            <td><strong>{calculateTotalAmount().totalPPNAmount.toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}</strong></td>
                                                            <td/>
                                                        </tr>
                                                        <tr className="text-right">
                                                            <td colSpan="11">Total Amount:</td>
                                                            <td><strong>{calculateTotalAmount().totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'IDR' })} </strong></td>
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
                                setIsEditingPurchaseOrder(false);
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

export default EditPurchaseOrder;