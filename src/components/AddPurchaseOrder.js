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

  const AddPurchaseOrder = ({ setIsAddingNewPurchaseOrder, handleRefresh,index, item  }) => {
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
    const [request_date, setRequestDate] = useState(new Date().toISOString().slice(0, 10));
    const [company, setCompany] = useState('');
    const [order_date, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
    const [createdBy, setCreatedBy] = useState(userId);
    const [approveBy, setApproveBy] = useState('');
    const [shipTo, setShipTo] = useState('PT. Abhimata Persada');
    const [shipToAddress, setShipToAddress] = useState('Menara Batavia, 5th Floor, DKI Jakarta, 10220, ID');
    const [billTo, setBillTo] = useState('PT. Abhihmata Persada');
    const [billToAddress, setBillToAddress] = useState('Menara Batavia, 5th Floor, DKI Jakarta, 10220, ID');
    const [termConditions, setTermConditions] = useState('');

   

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
    const [to, setTo] = useState('');
    const [toOptions, setToOptions] = useState([]);
    const [selectedTo, setSelectedTo] = useState(null);
    const [toAddress, setToAddress] = useState('');
    const [toAddressOptions, setToAddressOptions] = useState([]);
    const [selectedToAddress, setSelectedToAddress] = useState(null);



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

        const options = transformedData.map(item => {
          const label = item.PR_NUMBER;
          if (label.startsWith('DRAFT')) {
            return null; // or you can return an empty object {}
          }
          return {
            value: item.PR_NUMBER,
            label: label.replace('DRAFT ', ''), // remove 'DRAFT ' from the label
            REQUESTOR: item.REQUESTOR,
            DEPARTEMENT: item.DEPARTEMENT,
            COMPANY: item.COMPANY,
            PROJECT: item.PROJECT,
            CUSTOMER: item.CUSTOMER,
            REQUESTDATE: item.REQUEST_DATE,
            VENDOR: item.VENDOR
          };
        }).filter(option => option !== null);
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

          const options = transformedData.filter(item => item.ENTITY_TYPE === 'BOTH' || item.ENTITY_TYPE === 'Vendor').map(item => ({
            value: item.NAME,
            label: item.NAME,
            vendAddress: item.ADDRESS
          }));
          setVendorOptions(options);

          const optionForTo = transformedData.map(item => ({
            value: item.NAME,
            label: item.NAME,
            vendAddress: item.ADDRESS
          }));
          setToOptions(optionForTo);

          const uniqueAddress = [...new Set(transformedData.map(item => item.ADDRESS))];
          const optionsForToAddress = uniqueAddress.map(address => ({
            value: address,
            label: address
          }));
          setToAddressOptions(optionsForToAddress);

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
            label: item.NAME,
            customer: item.CUSTOMER
          }));

          const optionsCustomer = transformedData.map(item => ({
            value: item.CUSTOMER,
            label: item.CUSTOMER
          }))

          setProjectOptions(options);
          setCustomerOptions(optionsCustomer);
        })
        .catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });


        // Lookup Customer
        // LookupParamService.fetchLookupData("MSDT_FORM", authToken, branchId)
        // .then(data => {
        //   console.log('Currency lookup data:', data);

        //   // Transform keys to uppercase directly in the received data
        //   const transformedData = data.data.map(item =>
        //     Object.keys(item).reduce((acc, key) => {
        //       acc[key.toUpperCase()] = item[key];
        //       return acc;
        //     }, {})
        //   );
        //   //console.log('Transformed data:', transformedData);

        //   const options = transformedData.map(item => ({
        //     value: item.NAME,
        //     label: item.NAME,
        //     address: item.ADDRESS
        //   }));
        //   setCustomerOptions(options);
        // })
        // .catch(error => {
        //   console.error('Failed to fetch currency lookup:', error);
        // });


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

    // Handler Project untuk autofill customer
    const handleProjectChange = (selectedOption) => {
      setSelectedProject(selectedOption);
      setProject(selectedOption ? selectedOption.value: '');

      if(selectedOption) {
        const customerProject = customerOptions.find((option) => option.value === selectedOption.customer);
        setSelectedCustomer(customerProject);
        setCustomer(customerProject ? customerProject : null);
      } else {
        setSelectedCustomer(null);
        setCustomer('');
      }
    }
    
    // To Handler untuk autofill address
    const handleToChange = (selectedOption) => {
      setSelectedTo(selectedOption);
      setTo(selectedOption ? selectedOption.value : '');
      
      // Autofill
      if(selectedOption) {
        const toAddressOption = toAddressOptions.find((option) => option.value === selectedOption.vendAddress);
        setSelectedToAddress(toAddressOption);
        setToAddress(toAddressOption ? toAddressOption.value : '');
      }else{
        setSelectedToAddress(null);
        setToAddress('');
      }
    }

    // Pr handler 
    const handlePRChange = (selectedOption) => {
      setSelectedDocRefNum(selectedOption);
      setDocRefNumber(selectedOption ? selectedOption.value : '');

      
      if (selectedOption) {

        const requestorOption = requestorOptions.find((option) => option.value === selectedOption.REQUESTOR);
        const departementOption = departementOptions.find((option) => option.value === selectedOption.DEPARTEMENT);
        const projectOption = projectOptions.find((option) => option.value === selectedOption.PROJECT);
        const customerOption = customerOptions.find((option) => option.value === selectedOption.CUSTOMER);
        const vendorOption = vendorOptions.find((option) => option.value === selectedOption.VENDOR);
        const ToOption = toOptions.find((option) => option.value === selectedOption.VENDOR);

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
        setSelectedVendor(vendorOption ? vendorOption : null);
        setVendor(selectedOption.VENDOR);
        setSelectedTo(ToOption ? ToOption : null);
        setTo(selectedOption.VENDOR);

        if (vendorOption) {
          const toOption = toOptions.find((option) => option.value === vendorOption.value);
          const toAddressOption = toAddressOptions.find((option) => option.value === vendorOption.vendAddress);
    
          setSelectedTo(toOption);
          setTo(toOption ? toOption.value : '');
          setSelectedToAddress(toAddressOption);
          setToAddress(toAddressOption ? toAddressOption.value : '');
        }
        // setShipTo(selectedOption.CUSTOMER ? selectedOption.CUSTOMER : '');
        // setShipToAddress(selectedOption.ADDRESS);

        // if (selectedOption.CUSTOMER) {
        //   const customer = customerOptions.find((option) => option.value === selectedOption.CUSTOMER);
        //   setShipToAddress(customer ? customer.address : '');
        // }

        // Lookup Purchase Request Item List
        LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then(response => {
          const fetchedItems = response.data || [];
          console.log('Items fetched:', fetchedItems);


          const resetItems = fetchedItems.map(item => ({
            ...item,
            original_unit_price: item.unit_price || 0,
            vat_included: false

          }));
          // Set fetched items to state
          setItems(resetItems);

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
        setRequestor('')
        setSelectedDepartement(null);
        setDepartement('');
        setSelectedProject(null);
        setProject('')
        setSelectedCustomer(null);
        setCustomer('');
        setSelectedProduct(null);
        setSelectedCurrency(null);
        setItems([]);
        setSelectedTaxType(null);
        setVendor('');
        setSelectedVendor(null);
        setTo('')
        setSelectedTo(null);
        setToAddress('');
        setSelectedToAddress(null);
      }
    }

    const handleOptionChange = (setter, stateSetter, selectedOption) => {
      setter(selectedOption);
      stateSetter(selectedOption ? selectedOption.value : '');
    };


    const handleAddItem = () => {
      setItems([...items, { 
        product: '', 
        product_note: '', 
        quantity: 1, 
        currency: 'IDR', 
        unit_price: 0, 
        original_unit_price: 0, 
        total_price: 0, 
        vat_type: '',
        tax_ppn_type: '', 
        tax_ppn_rate: 0, 
        tax_ppn_amount: 0 , 
        tax_base: 0, 
        discount: 0,
        subTotal: 0,
        vat_included: false,
        new_unit_price: 0,
      }]);
    };

    const handleItemChange = (index, field, value) => {
      const newItems = [...items];
      newItems[index][field] = value;
      // newItems[index].original_unit_price = newItems[index].unit_price || 0;

      console.log(index, field, value);

      // itungan lama

      // if (field === 'vat_type') {
      //   newItems[index].tax_ppn_type = '';
      //   newItems[index].tax_ppn_rate = 0;
      //   newItems[index].tax_base = 0;
        
      //   if (newItems[index].vat_type === 'include') {
      //     newItems[index].unit_price = newItems[index].unit_price + (newItems[index].unit_price * 0.1); 
      //     newItems[index].vat_included = true;
      //   } else if (value === 'exclude' && newItems[index].vat_included === true) {
      //     if (newItems[index].vat_included === true) {
      //       newItems[index].unit_price = Math.round(newItems[index].unit_price / 1.1);
      //       newItems[index].vat_included = false;
      //     }else if (value === ''){
      //       newItems[index].vat_included = true;
      //     }
      //   }
      //   newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
      // }


      // if (field === 'tax_ppn_type' || newItems[index].tax_ppn_rate ) {
      //   if (newItems[index].vat_type === 'include') {
      //     newItems[index].tax_base = Math.round(newItems[index].unit_price/((1+(newItems[index].tax_ppn_rate/100))*newItems[index].quantity)); 
      //   } else if (newItems[index].vat_type === 'exclude') {
      //     newItems[index].tax_base = Math.round(newItems[index].total_price); 
      //   }
      //   if (isNaN(newItems[index].tax_base)) {
      //     newItems[index].tax_base = 0;
      //   }
      // }

      // console.log('vat', newItems[index].vat_included);
      // console.log('vat', newItems[index].vat_type);
      // console.log('unir', newItems[index].unit_price);
      // console.log('tax', newItems[index].tax_base);
      // console.log('quant', newItems[index].quantity);

      // console.log('Updated tax_base:', newItems[index].tax_base);

      // if (field === 'tax_ppn_type' || field === 'unit_price' || field === 'tax_base'|| field === 'vat_type') {
      //   newItems[index].tax_ppn_amount = newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100);
      // }

      // if (field === 'unit_price' && !newItems[index].original_unit_price) {
      //     newItems[index].original_unit_price = Number(value);
      //   }


      // Itungan Baru

      // Reset field vat type dan ppn type ketika mengubah unit price dan quantity

      

      if( field === 'unit_price' || field === 'quantity') {
        newItems[index].vat_type = '';
        newItems[index].tax_ppn_type = '';
        newItems[index].tax_base = 0; 
        newItems[index].tax_ppn_amount = 0;
        if(newItems[index].vat_included !== undefined) {
          newItems[index].vat_included = false;
        }
      }
      if (field === 'quantity' || field === 'unit_price') {
        newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price; 
      }

      // Itungan New Unit Price
      let pengkali = newItems[index].tax_ppn_rate/100;

      if (field === 'tax_ppn_type' || field === 'tax_ppn_rate') {
        if (newItems[index].vat_type === 'include'){
          newItems[index].new_unit_price = newItems[index].unit_price + (newItems[index].unit_price * (pengkali));
          newItems[index].tax_base =  Math.round(newItems[index].unit_price / ((1 + (newItems[index].tax_ppn_rate / 100)) * newItems[index].quantity));
          newItems[index].tax_ppn_amount = Math.round(newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100));
          newItems[index].vat_included = true;
        } else if (newItems[index].vat_type === "exclude"){
          newItems[index].tax_ppn_amount = newItems[index].total_price * (newItems[index].tax_ppn_rate/100);
          newItems[index].tax_base = newItems[index].unit_price * newItems[index].quantity;
        }
        newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
      }
      
      if (field === 'vat_type') {
        newItems[index].tax_ppn_type = '';
        newItems[index].tax_ppn_rate = 0;
        newItems[index].tax_base = 0;
        newItems[index].tax_ppn_amount = 0;
        if (newItems[index].vat_type === 'exclude' && newItems[index].vat_included === true) {
          newItems[index].new_unit_price = newItems[index].new_unit_price - (newItems[index].unit_price * (pengkali));
          newItems[index].vat_included = false;

        }else{
          newItems[index].new_unit_price = newItems[index].unit_price;

        }
        newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
      }

      // Itungan Original Unit Price

      // let pengkali = newItems[index].tax_ppn_rate/100;

      // if (field === 'tax_ppn_type' || field === 'tax_ppn_rate') {
      //   if (newItems[index].vat_type === 'include'){
      //     newItems[index].unit_price = newItems[index].original_unit_price + (newItems[index].original_unit_price * (pengkali));
      //     newItems[index].tax_base = newItems[index].unit_price / ((1 + (newItems[index].tax_ppn_rate / 100)) * newItems[index].quantity);
      //     newItems[index].tax_ppn_amount = newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100);
      //     newItems[index].vat_included = true;
      //   } else if (newItems[index].vat_type === "exclude"){
      //     newItems[index].tax_ppn_amount = newItems[index].total_price * (newItems[index].tax_ppn_rate/100);
      //     newItems[index].tax_base = newItems[index].unit_price * newItems[index].quantity;
      //   }
      //   newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
      // }

      // if (field === 'vat_type') {
      //   newItems[index].tax_ppn_type = '';
      //   newItems[index].tax_ppn_rate = 0;
      //   newItems[index].tax_base = 0;
      //   newItems[index].tax_ppn_amount = 0;
      //   if (newItems[index].vat_type === 'exclude' && newItems[index].vat_included === true) {
      //     newItems[index].unit_price = newItems[index].unit_price - (newItems[index].original_unit_price * (pengkali));
      //     newItems[index].vat_included = false;

      //   }else{
      //     newItems[index].new_unit_price = newItems[index].unit_price;

      //   }
      //   newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
      // }

      console.log('new unit price', newItems[index].new_unit_price)
      console.log('original', newItems[index].tax_ppn_amount);
      console.log('unit', newItems[index].unit_price);
      console.log('pengkali', pengkali);  
      console.log('vatinc', newItems[index].vat_included);
      console.log('base', newItems[index].tax_base);
      console.log('vat', newItems[index].vat_type);

      // if (field === 'tax_type') {
      //   const selectedTaxType = taxTypeOptions.find(option => option.value === value);
      //   setPPNRate(selectedTaxType ? selectedTaxType.RATE : '');
      // }    

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
      const subTotal = items.reduce((total, item) => {
        const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
        return total + taxBase;
      }, 0);

      const totalPPNAmount = items.reduce((total, item) => {
        const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : parseFloat(item.tax_ppn_amount);
        return total + taxPPNAmount;
      }, 0);

      const totalAmount  =  subTotal + totalPPNAmount;
      const validTotalAmount = isNaN(totalAmount) ? 0 : parseFloat(totalAmount);
      return { subTotal, totalPPNAmount, totalAmount: validTotalAmount };
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
      setDocRef('');
      setDocRefNumber('');
      setProject('');
      setVendor('');
      setTitle('');
      setCustomer('');
      setSelectedCustomer(null);
      setRequestor('');
      setDepartement('');
      setSelectedPaymentTerm(null);
      setCompany('');
      setOrderDate(order_date);
      setPaymentTerm('');
      setCreatedBy(createdBy);
      setDescription('');
      setApproveBy('');
      setShipTo('');
      setShipToAddress('');
      setBillTo('');
      setBillToAddress('');
      

      setRequestDate('');
      
      setScheduleDate('');
      
      
    
      setItems([]);
      setSelectedItems([]);
      setSelectedRequestor(null);
      setSelectedDepartement(null);
      setSelectedVendor(null);
      setSelectedProject(null);
      setSelectedCurrency(null);
    };



    // Handle Save
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
          const generalInfo = {
            po_number,
            doc_reff: docRef,
            doc_reff_no: docRefNumber,
            project,
            vendor,
            status_po: 'DRAFT',
            customer,
            requestor,
            departement,
            company,
            order_date, // Converts to date format
            request_date,
            created_by: createdBy,
            description,
            total_amount: totalAmount,
            approved_by: approveBy,
            form_to: to,
            to_address: toAddress,
            ship_to: shipTo,
            ship_to_address: shipToAddress,
            bill_to: billTo,
            bill_to_address: billToAddress,
            total_tax_base: subTotal,
            total_amount_ppn: totalPPNAmount,
            term_conditions: termConditions,
          };

          console.log('Master', generalInfo);

          const response = await InsertDataService.postData(generalInfo, "PUOR", authToken, branchId);
          console.log('Data posted successfully:', response);

          if (response.message === "insert Data Successfully") {
            // Iterate over items array and post each item individually
            for (const item of items) {
              const { rwnum, ID, status, id_trx, ...rest } = item;
              const updatedItem = {
                ...item,
                po_number,
                tax_ppn: item.tax_ppn_type,
                type_of_vat: item.vat_type
              };

              delete updatedItem.rwnum; 
              delete updatedItem.ID;
              delete updatedItem.status;
              delete updatedItem.id_trx;
              delete updatedItem.pr_number;
              delete updatedItem.original_unit_price;
              delete updatedItem.new_unit_price;
              delete updatedItem.vat_type;
              delete updatedItem.tax_ppn_type;
              delete updatedItem.discount;
              delete updatedItem.vat_included;
              delete updatedItem.subTotal;


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


    // Hanlde Submit
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
          const { subTotal, totalPPNAmount, totalAmount} = calculateTotalAmount();
          // Save general information and description
          const generalInfo = {
            po_number,
            doc_reff: docRef,
            doc_reff_no: docRefNumber,
            project,
            vendor,
            status_po: 'IN_PROCESS',
            customer,
            requestor,
            departement,
            company,
            order_date, // Converts to date format
            request_date,
            created_by: createdBy,
            description,
            total_amount: totalAmount,
            approved_by: approveBy,
            form_to: to,
            to_address: toAddress,
            ship_to: shipTo,
            ship_to_address: shipToAddress,
            bill_to: billTo,
            bill_to_address: billToAddress,
            total_tax_base: subTotal,
            total_amount_ppn: totalPPNAmount,
            term_conditions: termConditions,
            
          };

          console.log('Master', generalInfo);

          const response = await InsertDataService.postData(generalInfo, "PUOR", authToken, branchId);
          console.log('Data posted successfully:', response);

          if (response.message === "insert Data Successfully") {
            // Iterate over items array and post each item individually
            for (const item of items) {
              const { rwnum, ID, status, id_trx, ...rest } = item;
              const updatedItem = {
                ...item,
                po_number,
                tax_ppn: item.tax_ppn_type,
                type_of_vat: item.vat_type
              };

              delete updatedItem.rwnum; 
              delete updatedItem.ID;
              delete updatedItem.status;
              delete updatedItem.id_trx;
              delete updatedItem.pr_number;
              delete updatedItem.original_unit_price;
              delete updatedItem.new_unit_price;
              delete updatedItem.vat_type;
              delete updatedItem.tax_ppn_type;
              delete updatedItem.discount;
              delete updatedItem.vat_included;
              delete updatedItem.subTotal;
              



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
                        setIsAddingNewPurchaseOrder(false);
                      }}
                    >
                      <i className="fas fa-arrow-left"></i> Back
                    </Button>
                    <Button variant="primary" className='mr-2' onClick={handleSave}>
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
                            value={selectedDocRefNum}
                            options={PROptions}
                            onChange={handlePRChange}
                            placeholder='Purhcase Request...'
                            isClearable
                            required
                          />
                          </Form.Group>
                        </Col>
                        : 
                         docRef === "internalMemo" ?
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Intrnal Memo Number</Form.Label>
                              <Form.Control
                                type='text'
                              />
                            </Form.Group>
                          </Col> 
                          :
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Customer Contract Number</Form.Label>
                              <Form.Control
                                type='text'
                              />
                            </Form.Group>
                          </Col>
                      }

                      <Col md={6}>
                      <Form.Group controlId='formFile'>
                        <Form.Label>File Document</Form.Label>
                        <Form.Control
                          type='file'
                          placeholder='Upload Document'
                        />
                      </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId='formCustomer'>
                          <Form.Label>Customer</Form.Label>
                          <Select
                            id='customer'
                            value={selectedCustomer}
                            onChange={(selectedOption) => {
                              handleOptionChange(setSelectedCustomer, setCustomer, selectedOption)
                            }}
                            options={customerOptions}
                            placeholder='Customer...'
                            isClearable
                            required
                            isDisabled = {docRef === 'purchaseRequest'}
                          />
                        </Form.Group>
                      </Col>
                      

                      {docRef === 'purchaseRequest' ?

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Requestor</Form.Label>
                            <Form.Control
                              value={requestor}
                              onChange={(e)=> setRequestor(e.target.value)}
                              disabled
                              required
                            />
                          </Form.Group>
                        </Col>
                      :
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
                      }

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
                        <Form.Group controlId="formProject">
                          <Form.Label>Project</Form.Label>
                          <Select
                            id="project"
                            value={selectedProject}
                            options={projectOptions}
                            // onChange={(selectedOption) => {
                            //   handleOptionChange(setSelectedProject, setProject, selectedOption);
                            // }}
                            onChange={handleProjectChange}
                            placeholder="Project..."
                            isClearable 
                            required
                            isDisabled = {docRef === 'purchaseRequest'}
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
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select
                            id='vendor'
                            value={selectedVendor}
                            options={vendorOptions}
                            onChange={(selectedOption) => {
                              handleOptionChange(setSelectedVendor, setVendor, selectedOption);
                              if(selectedOption){
                              const toOption = toOptions.find((option) => option.value === selectedOption.value);
                              const addressTo = toAddressOptions.find((option) => option.value === selectedOption.vendAddress);
                              setSelectedTo(toOption);
                              setTo(toOption ? toOption.value : null);
                              setSelectedToAddress(addressTo);
                              setToAddress(addressTo ? addressTo.value : null);
                              }else{
                                setSelectedTo(null);
                                setTo('');
                                setSelectedToAddress(null);
                                setToAddress('');
                              }
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
                        <Form.Group controlId='formTo'>
                          <Form.Label>To</Form.Label>
                          <Select
                            id='to'
                            value={selectedTo}
                            options={toOptions}
                            onChange={handleToChange}
                            placeholder = "To..."
                            isClearable
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group controlId='formToAddress'>
                          <Form.Label>To Address</Form.Label>
                          <Select
                            id='toAddress'
                            value={selectedToAddress}
                            options={toAddressOptions}
                            onChange={(selectedOption) => {
                              handleOptionChange(setSelectedToAddress, setToAddress, selectedOption);
                            }}
                            isClearable
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
                            disabled
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
                            disabled
                          />
                        </Form.Group>
                      </Col>


                      {

                      }

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
                                <th>Total Price</th>
                                <th>Type of VAT</th>
                                <th>Tax PPN Type</th>
                                <th>Tax PPN Rate</th>
                                <th>Tax PPN Amount</th>
                                <th>Tax Base</th>
                                
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
                                        type="Number"
                                        value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price : 0}
                                        onChange={(e) => {
                                          const newPrice = parseFloat(e.target.value) || 0;
                                          handleItemChange(index, 'unit_price',  newPrice);
                                          // if (item.unit_price !== undefined && item.unit_price !== null) {
                                          //   handleItemChange(index, 'original_unit_price', newPrice);
                                          // }else{
                                          //   handleItemChange(index, 'original_unit_price', item.unit_price);
                                          // }
                                        }}
                                      />
                                    </td>

                                    <td>{item.total_price.toLocaleString('en-US', { style: 'currency', currency: item.currency })}</td>
                                   
                                    <td>
                                      <Form.Select
                                        value={item.vat_type || ''}
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
                                        value={taxTypeOptions.find(option => option.value === item.tax_ppn_type) || null}
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
                                      {item.tax_ppn_amount ? parseFloat(item.tax_ppn_amount).toLocaleString('en-US', { style: 'currency', currency: item.currency }) : 'IDR 0.00'}
                                    </td>

                                    <td>
                                      <Form.Control
                                        type='text'
                                        disabled
                                        style={{textAlign: 'right'}}
                                        value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base : 0}
                                        onChange={(e) => handleItemChange(index, 'tax_base', Math.max(0, parseFloat(e.target.value) || 0))}
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
                                <td colSpan="11">Subtotal Before Discount:</td>
                                <td><strong>{calculateTotalAmount().subTotal.toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}</strong></td>
                              </tr>
                              <tr>
                                <td colSpan="11" className='text-right'>Discount:</td>
                                <td colSpan="1" className='text-right'>
                                  <Form.Control
                                    type='number'
                                  />
                                </td>
                              </tr>
                              <tr className='text-right'>
                                <td colSpan="11">Subtotal:</td>
                                <td>0.0</td>
                              </tr>
                              <tr className='text-right'>
                                <td colSpan="11">Total PPN:</td>
                                <td><strong>{calculateTotalAmount().totalPPNAmount.toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}</strong></td>
                              </tr>
                              <tr className="text-right">
                                <td colSpan="11" >Total Amount:</td>
                                <td><strong>{calculateTotalAmount().totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'IDR' })} </strong></td>
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

          <Row className='mt-4'>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Terms & Conditions</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={3}
                      placeholder='Enter Terms & Conditions'
                      onChange={(e)=>setTermConditions(e.target.value)}
                    />
                  </Form.Group>
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
                  setIsAddingNewPurchaseOrder(false);
                }}
              >
                <i className="fas fa-arrow-left"></i> Back
              </Button>
              <Button variant="primary" className='mr-2' onClick={handleSave}>
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

export default AddPurchaseOrder;