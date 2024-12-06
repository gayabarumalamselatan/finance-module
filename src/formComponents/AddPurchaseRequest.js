import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from '../service/InsertDataService';
import { getBranch, getToken, getIdUser } from '../config/Constant';
import { GENERATED_DUE_DATE, GENERATED_NUMBER, UPLOAD_FILES } from '../config/ConfigUrl';
import { generateUniqueId } from '../service/GeneratedId';
import Select from 'react-select';
import LookupParamService from '../service/LookupParamService';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import ActivityLogger from '../service/ActivityLogger';
import LookupService from '../service/LookupService';
import DeleteDataService from '../service/DeleteDataService';
import UpdateDataService from '../service/UpdateDataService';
import UpdateStatusService from '../service/UpdateStatusService';
import { dateFormat } from '../utils/DateFormat';
import CurrencyInput from 'react-currency-input-field';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { FaCalendarAlt } from 'react-icons/fa';
import '../css/DatePicker.css';
import { se } from 'date-fns/locale';
import moment from 'moment';

const AddPurchaseRequest = ({ setIsEditingPurchaseRequest, handleRefresh, selectedData, duplicateFlag, setIsAddingNewDuplicatePurchaseRequest }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem('userId');
  const idUser = sessionStorage.getItem('id');
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
  const [payment_term, setPaymentTerm] = useState('7 Weekday');
  const [status_request, setStatusRequest] = useState('Draft');
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState('');
  const [endtoendid, setEntoendid] = useState('');
  const [currency, setCurrency] = useState('IDR');
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
  const [buttonAfterSubmit, setButtonAfterSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createBy = sessionStorage.getItem('userId');


  const authToken = headers;
  useEffect(() => {
    const today = new Date(); // Ambil tanggal hari ini
    const formattedDate = dateFormat(today); // Format tanggal
    console.log('Formatted Date:', formattedDate); // Tampilkan di console
    setRequestDate(formattedDate); // Set state dengan tanggal yang diformat
  }, []);

  useEffect(() => {
    console.log('duplicateFlag', duplicateFlag);
    if (selectedData && duplicateFlag === false) {
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
          setScheduleDate(data.schedule_date);
          setDocReff(data.doc_reff);
          setRequestor(data.requestor);
          setCompany(data.company);
          setDescription(data.description);
          setStatusRequest(data.status_request);
          setPaymentTerm(data.payment_term);
          setEntoendid(data.endtoendid);
          setCurrency(data.currency);
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
                      option.value === currency
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
    } else if (selectedData && duplicateFlag === true) {

      generatePrNumber("DRAFT_PR");
      generateEndtoEndId("PURC");

      const prNumber = selectedData[0].PR_NUMBER;

      console.log('selectedData:', selectedData[0]);

      LookupService.fetchLookupData(`PURC_FORMPUREQ&filterBy=PR_NUMBER&filterValue=${prNumber}&operation=EQUAL`, authToken, branchId)
        .then(response => {
          const data = response.data[0];
          console.log('Data:', data);
          setRequestDate(data.request_date);
          setScheduleDate(data.schedule_date);
          setDocReff(data.doc_reff);
          setRequestor(data.requestor);
          setCompany(data.company);
          setDescription(data.description);
          setStatusRequest(data.status_request);
          setPaymentTerm(data.payment_term);
          setCurrency(data.currency);
        })
        .catch(error => {
          console.error('Failed to load purchase request data:', error);
        });
      LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${prNumber}&operation=EQUAL`, authToken, branchId)
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
                      option.value === currency
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

    } else {
      generatePrNumber("DRAFT_PR");

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
    }
  }, [selectedData, duplicateFlag]);

  const handleDepartementChange = (selectedOption, index) => {
    setSelectedDepartement(selectedOption); // Optional: If you need to use the selected option elsewhere
    const updatedItems = [...items]; // Copy the current items array

    // Update the specific item at the provided index
    updatedItems[index] = {
      ...updatedItems[index], // Copy the existing fields
      departement: selectedOption ? selectedOption.value : '' // Update the department field
    };

    setItems(updatedItems); // Set the updated items array in state
  };



  const handleProjectChange = (selectedOption, index) => {
    console.log(selectedOption);

    // Copy the items array
    const updatedItems = [...items];

    // Update the specific item at the provided index
    updatedItems[index] = {
      ...updatedItems[index], // Copy the existing fields
      project: selectedOption ? selectedOption.value : '', // Set the project
      project_contract_number: selectedOption ? selectedOption.project_contract_number : '', // Set project contract number
      customer: selectedOption ? selectedOption.customer : '' // Set the customer
    };

    // Update the items array in state
    setItems(updatedItems);

    // Optionally, update any other states related to selected project if needed
    setSelectedProject(selectedOption);
  };

  const handleVendorChange = (selectedOption, index) => {
    const updatedItems = [...items]; // Copy the items array
    updatedItems[index] = {
      ...updatedItems[index], // Copy the existing item fields
      vendor: selectedOption ? selectedOption.value : '' // Update the vendor field
    };
    setItems(updatedItems); // Set the new state
    setSelectedVendor(selectedOption); // Optionally update this if you need it elsewhere
  };

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
    setItems([...items, { doc_reff_no: '', doc_source: '', vendor: '', project: '', project_contract_number: '', customer: '', departement: '', product: '', product_note: '', quantity: '', unit_price: 0, total_price: 0, id_upload: '' }]);
  };

  const handleItemChange = async (index, field, value) => {
    const newItems = [...items];

    // Handle 'product' or 'currency' fields
    if (field === 'product' || field === 'currency') {
      newItems[index][field] = value ? value.value : null;
    }

    // Handle file input field
    else if (field === 'file') {
      const file = value.target.files[0]; // Get the uploaded file
      if (file) {
        try {
          // Generate the upload ID asynchronousl
          const id_upload = await generateUploadId("UPLOAD");

          // Store the file name and id_upload in the item
          newItems[index].doc_source = file.name;
          newItems[index].id_upload = id_upload;

          // Update the items state before uploading the file
          setItems(newItems);

          // Prepare upload request
          const request = {
            idTrx: id_upload,
            code: 'PUREQD',
          };

          const formData = new FormData();
          formData.append('request', JSON.stringify(request));
          formData.append('file', file);

          // Upload the file
          const uploadResponse = await axios.post(`${UPLOAD_FILES}`, formData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log('File uploaded successfully', uploadResponse.data);
        } catch (error) {
          console.error('File upload failed', error);
        }
      }
    }

    // Handle other fields
    else {
      newItems[index][field] = value;
    }

    // Calculate total price if the 'quantity' or 'unit_price' is updated
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].quantity = newItems[index].quantity || 1; // Default quantity to 1 if empty or 0
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }
    
    // Update the items state for all changes
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
    setDocReff('');
    setDescription('');
    setItems([]);
    setSelectedItems([]);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (schedule_date !== due_date && (!description || description.trim() === '')) {
      messageAlertSwal('Warning', 'Description is required !!!', 'warning');
      return;
    }

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
        const createBy = sessionStorage.getItem('userId');
        const total_amount = calculateTotalAmount();
        const endtoendid = await generateEndtoEndId("PURC");

        const generalInfo = {
          pr_number,
          request_date: moment().format('YYYY-MM-DD'),
          schedule_date,
          doc_no,
          doc_reff,
          requestor,
          payment_term,
          description,
          company,
          total_amount,
          status_request: 'DRAFT',
          due_date,
          endtoendid,
          currency
        };

        // Check if pr_number exists in API
        const lookupResponse = await LookupService.fetchLookupData(
          `PURC_FORMPUREQ&filterBy=pr_number&filterValue=${pr_number}&operation=EQUAL`,
          authToken,
          branchId
        );

        if (lookupResponse.data.length > 0) {
          // pr_number exists, handle as edit
          console.log("PR number exists, updating data...");
          const id = lookupResponse.data[0].ID;

          const response = await UpdateDataService.postData(generalInfo, `PUREQ&column=id&value=${id}`, authToken, branchId);
          console.log('Data updated successfully:', response);


          if (response.message === "Update Data Successfully") {
            await handleItemsUpdate(pr_number);
            messageAlertSwal('Success', response.message, 'success');
            // resetForm();
          }

        } else {
          // pr_number does not exist, handle as new save
          console.log("PR number does not exist, creating new data...");
          const response = await InsertDataService.postData(generalInfo, "PUREQ", authToken, branchId);
          console.log('Data posted successfully:', response);

          LookupService.fetchLookupData(`PURC_FORMPUREQ&filterBy=endtoendid&filterValue=${endtoendid}&operation=EQUAL`, authToken, branchId)
            .then(response => {
              const data = response.data[0];
              console.log('Data:', data);

              // Check if data exists
              const requestData = {
                idTrx: data.ID, // Menggunakan ID dari data terpilih
                status: "DRAFT", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
              };
              UpdateStatusService.postData(requestData, "PUREQ", authToken, branchId)
                .then(response => {
                  console.log('Data updated successfully:', response);
                })
                .catch(error => {
                  console.error('Failed to update data:', error);
                });

            })
            .catch(error => {
              console.error('Failed to load purchase request data:', error);
            });

          console.log('Data posted successfully:', response);

          if (response.message === "insert Data Successfully") {
            await handleItemsInsert(pr_number,duplicateFlag);
            messageAlertSwal('Success', response.message, 'success');
            // resetForm();
          }
        }

        // Log activity
        await ActivityLogger({
          userId: idUser,
          userName: createBy,
          action: 'SAVE',
          description: `Saved Purchase Request ${pr_number}`,
          entityName: 'PURC',
          entityId: endtoendid,
          status: 'SUCCESS',
          authToken,
          branchId
        });

      } catch (err) {
        console.error(err);
        await ActivityLogger({
          userId: idUser,
          userName: createBy,
          action: 'SAVE',
          description: `Failed to save Purchase Request ${pr_number}`,
          entityName: 'PURC',
          entityId: endtoendid,
          status: 'FAILED',
          authToken,
          branchId
        });
        messageAlertSwal('Error', err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Form submission was canceled.');
    }
  };

  const handleItemsUpdate = async (pr_number, newPrNumber) => {
    try {
      // Fetch the ID using the original pr_number
      const lookupResponse = await LookupService.fetchLookupData(
        `PURC_FORMPUREQD&filterBy=pr_number&filterValue=${pr_number}&operation=EQUAL`,
        authToken,
        branchId
      );

      const ids = lookupResponse.data.map(item => item.ID); // Get all IDs from response array
      console.log('IDs to delete:', ids);

      // Delete each item based on fetched IDs
      for (const id of ids) {
        try {
          await DeleteDataService.postData(`column=id&value=${id}`, "PUREQD", authToken, branchId);
          console.log('Item deleted successfully:', id);
        } catch (error) {
          console.error('Error deleting item:', id, error);
        }
      }

      // Insert updated items with newPrNumber if provided, otherwise use pr_number
      const updatedPrNumber = newPrNumber || pr_number;
      for (const item of items) {
        const { rwnum, ID, status, id_trx, ...rest } = item;
        const updatedItem = { ...rest, pr_number: updatedPrNumber };
        await InsertDataService.postData(updatedItem, "PUREQD", authToken, branchId);
        console.log('Item inserted successfully:', updatedItem);
      }

    } catch (error) {
      console.error('Error in handleItemsUpdate:', error);
    }
  };

  // Helper function for inserting new items
  const handleItemsInsert = async (pr_number, duplicateFlag) => {
    for (const item of items) {
      let updatedItem;

      if (duplicateFlag) {
        // Hanya menyertakan properti tertentu
        updatedItem = {
          doc_reff_no: item.doc_reff_no,
          doc_source: item.doc_source,
          vendor: item.vendor,
          project: item.project,
          project_contract_number: item.project_contract_number,
          customer: item.customer,
          departement: item.departement,
          product: item.product,
          product_note: item.product_note,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          id_upload: item.id_upload,
          pr_number: pr_number, // Tambahkan pr_number
        };
      } else {
        // Kirim seluruh item jika duplicateFlag false
        updatedItem = { ...item, pr_number };
      }

      await InsertDataService.postData(updatedItem, "PUREQD", authToken, branchId);

      // await InsertDataService.postData(updatedItem, "PUREQD", authToken, branchId);
      console.log('Item posted successfully:', updatedItem);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Form submitted:', pr_number);

    if (schedule_date !== due_date && (!description || description.trim() === '')) {
      messageAlertSwal('Warning', 'Description is required !!!', 'warning');
      return;
    }

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
        const total_amount = calculateTotalAmount();

        // Check if pr_number exists
        const lookupResponse = await LookupService.fetchLookupData(
          `PURC_FORMPUREQ&filterBy=pr_number&filterValue=${pr_number}&operation=EQUAL`,
          authToken,
          branchId
        );


        if (lookupResponse.data.length > 0) {
          // pr_number exists, handle as edit
          let newPrNumber = pr_number;
          if (pr_number.startsWith('DRAFT_PR')) {
            console.log("Draft PR number detected, generating a new PR number...");
            newPrNumber = await generatePrNumber('PR');
            console.log("New PR number generated:", newPrNumber);
            setPrNumber(newPrNumber);
          }

          console.log("PR number exists, updating data...", pr_number);

          const id = lookupResponse.data[0].ID;
          const generalInfo = {
            pr_number: newPrNumber,
            request_date: moment().format('YYYY-MM-DD'),
            schedule_date,
            doc_no,
            doc_reff,
            requestor,
            payment_term,
            description,
            company,
            total_amount,
            status_request: 'IN_PROCESS',
            due_date,
            endtoendid,
            currency
          };

          const response = await UpdateDataService.postData(generalInfo, `PUREQ&column=id&value=${id}`, authToken, branchId);

          const endtoendidLookupResponse = await LookupService.fetchLookupData(`PURC_FORMPUREQ&filterBy=endtoendid&filterValue=${endtoendid}&operation=EQUAL`, authToken, branchId);

          if (endtoendidLookupResponse.data[0]?.status === "DRAFT") {
            const requestData = {
              idTrx: endtoendidLookupResponse.data[0].ID,
              status: "PENDING",
            };
            await UpdateStatusService.postData(requestData, "PUREQ", authToken, branchId);
          }

          if (response.message === "Update Data Successfully") {
            await handleItemsUpdate(pr_number, newPrNumber);
            messageAlertSwal('Success', response.message, 'success');
          }
        } else {
          // pr_number does not exist, handle as new save

          let endtoendid = '';
          const newPrNumber = await generatePrNumber('PR');
          setPrNumber(newPrNumber);
          endtoendid = await generateEndtoEndId("PURC");

          const generalInfo = {
            pr_number: newPrNumber,
            request_date: moment().format('YYYY-MM-DD'),
            schedule_date,
            doc_no,
            doc_reff,
            requestor,
            payment_term,
            description,
            company,
            total_amount,
            status_request: 'IN_PROCESS',
            due_date,
            endtoendid,
            currency
          };

          const response = await InsertDataService.postData(generalInfo, "PUREQ", authToken, branchId);
          console.log('Duplicate Flag insert:', duplicateFlag);
          if (response.message === "insert Data Successfully") {
            await handleItemsInsert(newPrNumber, duplicateFlag);
            messageAlertSwal('Success', response.message, 'success');
          }
        }

        await ActivityLogger({
          userId: idUser,
          userName: sessionStorage.getItem('userId'),
          action: 'SUBMIT',
          description: `Submit Purchase Request`,
          entityName: 'PURC',
          entityId: endtoendid,
          status: 'SUCCESS',
          authToken,
          branchId
        });
        setIsSubmitted(true);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        await ActivityLogger({
          userId: idUser,
          userName: sessionStorage.getItem('userId'),
          action: 'SUBMIT',
          description: `Submit Purchase Request`,
          entityName: 'PURC',
          entityId: endtoendid,
          status: 'FAILED',
          authToken,
          branchId
        });
        messageAlertSwal('Error', err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Form submission was canceled.');
    }
  };

  const handleAddNew = () => {
    // Reset form or perform actions for adding a new purchase request
    setIsSubmitted(false);
    resetForm();
    // Optionally, clear form fields or reset any other state as needed
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

  const generateEndtoEndId = async (code) => {
    try {
      const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
      setEntoendid(uniquePrNumber); // Updates state, if needed elsewhere in your component
      return uniquePrNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error('Failed to generate PR Number:', error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const generateUploadId = async (code) => {
    try {
      const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken); // Updates state, if needed elsewhere in your component
      return uniquePrNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error('Failed to generate PR Number:', error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleEditSave = async (event) => {
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
          request_date: moment().format('YYYY-MM-DD'),
          schedule_date, // Converts to date format
          doc_no,
          doc_reff,
          requestor,
          payment_term,
          description,
          company,
          total_amount,
          status_request: 'DRAFT',
          due_date,
          endtoendid,
          currency
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
          // resetForm();
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


  const handleEditSubmit = async (event) => {
    event.preventDefault();
    console.log("Log", selectedData);


    // Show SweetAlert2 confirmation
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
        console.log('pr_number', pr_number);

        if (pr_number.slice(0, 2) !== 'PR') {
          pr_number = await generatePrNumber('PR');
        } else {
          pr_number 
        }

        const total_amount = calculateTotalAmount();
        // Save general information and description
        const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

        const generalInfo = {
          pr_number,
          request_date: moment().format('YYYY-MM-DD'),
          schedule_date, // Converts to date format
          doc_no,
          doc_reff,
          requestor,
          payment_term,
          description,
          company,
          total_amount,
          status_request: 'IN_PROCESS',
          due_date,
          endtoendid
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

          //Set status workflow VERIFIED
          LookupService.fetchLookupData(`PURC_FORMPUREQ&filterBy=endtoendid&filterValue=${endtoendid}&operation=EQUAL`, authToken, branchId)
            .then(response => {
              const data = response.data[0];
              console.log('Data:', data);

              // Check if data exists
              if (data.status === "DRAFT") {
                const requestData = {
                  idTrx: data.ID, // Menggunakan ID dari data terpilih
                  status: "PENDING", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
                };
                UpdateStatusService.postData(requestData, "PUREQ", authToken, branchId)
                  .then(response => {
                    console.log('Data updated successfully:', response);
                  })
                  .catch(error => {
                    console.error('Failed to update data:', error);
                  });
              }
            })
            .catch(error => {
              console.error('Failed to load purchase request data:', error);
            });

          // Show success message and reset form
          messageAlertSwal('Success', response.message, 'success');
          setIsSubmitted(true);
          // resetForm();
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

  const handleDateChange = (date) => {
    setScheduleDate(date);
  };


  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            {/* <div className="col-sm-6">
              <h1>{selectedData ? "Edit Purchase Request" : "Add Purchase Request"}</h1>
            </div> */}
          </div>
        </div>
      </section>


      <section className="content">

        <Row>
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>General Information</Card.Title>
                <div className="ml-auto">
                  {(setIsEditingPurchaseRequest || setIsAddingNewDuplicatePurchaseRequest) && (
                    <>
                      <Button
                        variant="secondary"
                        className="mr-2"
                        onClick={() => {
                          handleRefresh();
                          if (setIsEditingPurchaseRequest) {
                            setIsEditingPurchaseRequest(false);
                          } else if (setIsAddingNewDuplicatePurchaseRequest) {
                            setIsAddingNewDuplicatePurchaseRequest(false);
                          }
                        }}
                      >
                        <i className="fas fa-arrow-left"></i> Go Back
                      </Button>
                    </>
                  )}


                  {!isSubmitted ? (
                    <>
                      <Button
                        variant="primary"
                        className="mr-2"
                        onClick={setIsEditingPurchaseRequest ? handleEditSave : handleSave}
                      >
                        <i className="fas fa-save"></i> {setIsEditingPurchaseRequest ? 'Save Changes' : 'Save'}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={setIsEditingPurchaseRequest ? handleEditSubmit : handleSubmit}
                      >
                        <i className="fas fa-check"></i> {setIsEditingPurchaseRequest ? 'Submit Changes' : 'Submit'}
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" onClick={handleAddNew}>
                      <i className="fas fa-plus"></i> Add New
                    </Button>
                  )}
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
                          type="text"
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
                        <div className="input-group">
                          {/* Custom DatePicker with integrated icon */}
                          <DatePicker
                            selected={schedule_date}
                            onChange={handleDateChange}
                            dateFormat="dd-MM-yyyy" // Display date in dd-MM-yyyy format
                            className="form-control"
                            placeholderText="Select a date"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formCurrency">
                        <Form.Label>Currency</Form.Label>
                        <Select
                          value={currencyOptions.find(option => option.value === currency)}
                          onChange={(selectedOption) => setCurrency(selectedOption ? selectedOption.value : selectedOption)}
                          options={currencyOptions}
                          placeholder="Select currency"
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
                              <th>Document Reference Number</th>
                              <th>Document Reference Source</th>
                              <th>Vendor</th>
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Departement</th>
                              <th>Product</th>
                              <th>Product Description</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th>Total Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="14" className="text-center">No data available</td>
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
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Document Reference"
                                      value={item.doc_reff_no}
                                      onChange={(e) => handleItemChange(index, 'doc_reff_no', e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    {setIsEditingPurchaseRequest ? (
                                      <>
                                        {/* Display the document link and edit button when editing */}
                                        <a href={item.doc_source} target="_blank" rel="noopener noreferrer">
                                          {item.doc_source}
                                        </a>
                                        {/* <button
                                          type="button"
                                          onClick={() => handleEditClick(index)}
                                          style={{ marginLeft: '10px', border: 'none', background: 'transparent' }}
                                        >
                                          <i className="fa fa-edit" aria-hidden="true"></i>
                                        </button> */}
                                      </>
                                    ) : (
                                      // Display file input when not editing
                                      <Form.Control
                                        type="file"
                                        onChange={(e) => handleItemChange(index, 'file', e)}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <Select
                                      id={`vendor-${index}`} // unique id for each row
                                      value={vendorOptions.find(option => option.value === item.vendor)} // Set the selected value
                                      onChange={(selectedOption) => handleVendorChange(selectedOption, index)} // Pass the index to the handler
                                      options={vendorOptions}
                                      isClearable
                                      placeholder="Select..."
                                      required
                                    />
                                  </td>
                                  <td>
                                    <Select
                                      id={`project-${index}`} // Unique id for each project select
                                      value={projectOptions.find(option => option.value === item.project)} // Set selected value for project
                                      onChange={(selectedOption) => handleProjectChange(selectedOption, index)} // Pass the index to handler
                                      options={projectOptions}
                                      isClearable
                                      placeholder="Select a project..."
                                      required
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Project Contract Number"
                                      value={item.project_contract_number} // Bind to the specific item's field
                                      onChange={(e) => handleItemChange(index, 'project_contract_number', e.target.value)} // Update the project contract number
                                      disabled // Keep it disabled if you don't want it to be editable
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      value={item.customer} // Bind to the specific item's field
                                      onChange={(e) => handleItemChange(index, 'customer', e.target.value)} // Update the customer
                                      disabled // Keep it disabled if it should not be editable
                                    />
                                  </td>
                                  <td>
                                    <Select
                                      id={`departement-${index}`} // Unique id for each department select
                                      value={departementOptions.find(option => option.value === item.departement)} // Set the selected value for department
                                      onChange={(selectedOption) => handleDepartementChange(selectedOption, index)} // Pass the index to the handler
                                      options={departementOptions}
                                      isClearable
                                      placeholder="Select a department..."
                                      required
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
                                    {/* <Form.Control
                                      type="number"
                                      value={item.unit_price}
                                      onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                    /> */}
                                    <CurrencyInput
                                      id={`currency-input-${index}`}
                                      name="unit_price"
                                      className="form-control"
                                      value={item.unit_price || ''} // Empty string if undefined
                                      decimalsLimit={4} // IDR: No decimals, Others: 2 decimals
                                      onValueChange={(value) => {
                                        const numericValue = parseFloat(value) || 0; // Ensure numeric value
                                        handleItemChange(index, 'unit_price', numericValue);
                                      }}
                                      onFocus={() => {
                                        handleItemChange(index, 'unit_price', ''); // Kosongkan nilai saat fokus
                                      }} // Optional: Highlight text on focus
                                      style={{ width: '100%', textAlign: 'right' }}
                                    />
                                  </td>
                                  <td className="text-end">{item.total_price.toLocaleString('en-US', { currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
                              <td colSpan="12" className="text-right">Total Amount:</td>
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
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter notes..."
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
          {(setIsEditingPurchaseRequest || setIsAddingNewDuplicatePurchaseRequest) && (
                    <>
                      <Button
                        variant="secondary"
                        className="mr-2"
                        onClick={() => {
                          handleRefresh();
                          if (setIsEditingPurchaseRequest) {
                            setIsEditingPurchaseRequest(false);
                          } else if (setIsAddingNewDuplicatePurchaseRequest) {
                            setIsAddingNewDuplicatePurchaseRequest(false);
                          }
                        }}
                      >
                        <i className="fas fa-arrow-left"></i> Go Back
                      </Button>
                    </>
                  )}

            {!isSubmitted ? (
              <>
                <Button
                  variant="primary"
                  className="mr-2"
                  onClick={setIsEditingPurchaseRequest ? handleEditSave : handleSave}
                >
                  <i className="fas fa-save"></i> {setIsEditingPurchaseRequest ? 'Save Changes' : 'Save'}
                </Button>
                <Button
                  variant="primary"
                  onClick={setIsEditingPurchaseRequest ? handleEditSubmit : handleSubmit}
                >
                  <i className="fas fa-check"></i> {setIsEditingPurchaseRequest ? 'Submit Changes' : 'Submit'}
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={handleAddNew}>
                <i className="fas fa-plus"></i> Add New
              </Button>
            )}
          </Col>
        </Row>
      </section>

      {
        isLoading && (
          <div className="full-screen-overlay">
            <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
          </div>
        )
      }
    </Fragment >
  );
}

export default AddPurchaseRequest;