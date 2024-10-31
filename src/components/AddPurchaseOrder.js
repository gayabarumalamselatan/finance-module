  import React, { Fragment, useEffect, useState } from 'react';
  import { Button, Col, Form, InputGroup, Row, Card } from 'react-bootstrap';
  import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
  import Swal from 'sweetalert2';
  import { messageAlertSwal } from "../config/Swal";
  import InsertDataService from '../service/InsertDataService';
  import { getBranch, getToken, userLoggin } from '../config/Constant';
  import { DOWNLOAD_FILES, FORM_SERVICE_UPDATE_DATA, GENERATED_NUMBER, UPLOAD_FILES } from '../config/ConfigUrl';
  import { generateUniqueId } from '../service/GeneratedId';
  import Select from 'react-select';
  import LookupParamService from '../service/LookupParamService';
  import LookupService from '../service/LookupService';
  import UpdateStatusService from '../service/UpdateStatusService';
  import CreatableSelect from 'react-select/creatable';
  import axios from 'axios';
import UpdateDataService from '../service/UpdateDataService';
import DeleteDataService from '../service/DeleteDataService';

  const AddPurchaseOrder = ({ 
    setIsAddingNewPurchaseOrder, 
    setIsEditingPurchaseOrder,
    selectedData,
    handleRefresh,
    index, 
    item  
  }) => {
    const headers = getToken();
    const branchId = getBranch();
    const userId = userLoggin();

    const [items, setItems] = useState([]);
    const [description, setDescription] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // PO Fields
    const [po_number, setPoNumber] = useState('');
    const [docRef,setDocRef] = useState(''); 
    const [request_date, setRequestDate] = useState(new Date().toISOString().slice(0, 10));
 
    const [order_date, setOrderDate] = useState(new Date().toISOString('en-GB').slice(0, 10));
    const [createdBy, setCreatedBy] = useState(userId);
    const [approveBy, setApproveBy] = useState('');
    const [shipTo, setShipTo] = useState('PT. Abhimata Persada');
    const [shipToAddress, setShipToAddress] = useState('Menara Batavia, 5th Floor, DKI Jakarta, 10220, ID');
    const [billTo, setBillTo] = useState('PT. Abhihmata Persada');
    const [billToAddress, setBillToAddress] = useState('Menara Batavia, 5th Floor, DKI Jakarta, 10220, ID');
    const [termConditions, setTermConditions] = useState('');
    const [endToEnd,setEndToEnd] = useState('');
    const [idPr, setIdPr] = useState(''); 
    const [discount, setDiscount] = useState(0);
    const [formattedDiscount, setFormattedDiscount] = useState('IDR 0.00');
    const [statusPo, setStatusPo] = useState('');
    const [PPNRoyaltyOptions, setPPNRoyaltyOptions] = useState([]);
    

    // PO Lookup
    const [projectOptions, setProjectOptions] = useState([]);
    const [departementOptions, setDepartementOptions] = useState([]);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [taxTypeOptions, setTaxTypeOptions] = useState([]);
    const [selectedTaxType, setSelectedTaxType] = useState(null);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [PROptions, setPROptions] = useState([]);
    const [docRefNumber, setDocRefNumber] = useState('');
    const [to, setTo] = useState('');
    const [toOptions, setToOptions] = useState([]);
    const [selectedTo, setSelectedTo] = useState(null);
    const [toAddress, setToAddress] = useState('');
    const [toAddressOptions, setToAddressOptions] = useState([]);
    const [selectedToAddress, setSelectedToAddress] = useState(null);
    const [contractNumberOption, setContractNumberOptions]= useState([]);
    const [file, setFile] = useState(null);

    // Dynamic Form Field Width
    const [inputWidth, setInputWidth] = useState(Array(items.length).fill(0));

    const authToken = headers;

    // Lookup
    useEffect(() => {
      if(selectedData) {
        const { ID, PO_NUMBER } = selectedData[0];
        // Set data awal dari selectedData
        console.log('id and pr number', ID, PO_NUMBER);
        setPoNumber(PO_NUMBER);

        console.log('deda', selectedData[0]);

        // Panggil API untuk mendapatkan data berdasarkan ID
        LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=PO_NUMBER&filterValue=${PO_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then(response => {
          const data = response.data[0];
          console.log('Data:', data);
          setOrderDate(data.order_date);
          setCreatedBy(data.created_by);
          setDocRef(data.doc_reff);
          setShipTo(data.ship_to);
          setShipToAddress(data.ship_to_address);
          setBillTo(data.bill_to);
          setBillToAddress(data.bill_to_address);
          setDiscount(data.discount);
          setTermConditions(data.term_conditions);
          setDescription(data.description);
        }).catch(error => {
          console.error('Failed to load purchase request data:', error);
        });

        // Lookup Puord
        LookupService.fetchLookupData(`PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${PO_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then(response => {
          const fetchedItems = response.data || [];
          console.log('Items fetchedda:', fetchedItems);
        
          setItems(fetchedItems.map(item => ({
            ...item,
          })));
          
          })
        .catch(error => {
            console.error('Failed to load items:', error);
        });

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
        }).catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });

        // Lookup vendor to dan to address
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
          const selectTo = optionForTo.find(option => option.value === selectedData[0].FORM_TO);
          setSelectedTo(selectTo || null);
          setTo(selectTo.value);

          const uniqueAddress = [...new Set(transformedData.map(item => item.ADDRESS))];
          const optionsForToAddress = uniqueAddress.map(address => ({
            value: address,
            label: address
          }));

          setToAddressOptions(optionsForToAddress);
          const selectToAddress = optionsForToAddress.find(option => option.value === selectedData[0].TO_ADDRESS);
          setSelectedToAddress(selectToAddress || null);
          setToAddress(selectToAddress.value);
        }).catch(error => {
          console.error('Failed to fetch currency lookup:', error);
        });
      }



      // Lookup Purchase Request
      LookupParamService.fetchLookupData("PURC_FORMPUREQ&showAll=YES&filterBy=STATUS&filterValue=APPROVED&operation=EQUAL&&filterBy=STATUS_REQUEST&filterValue=IN_PROCESS&operation=EQUAL", authToken, branchId)
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
          // if (label.startsWith('DRAFT')) {
          //   return null; // or you can return an empty object {}
          // }
          return {
            value: item.PR_NUMBER,
            label: label.replace('DRAFT ', ''), // remove 'DRAFT ' from the label
            DEPARTEMENT: item.DEPARTEMENT,
            COMPANY: item.COMPANY,
            PROJECT: item.PROJECT,
            CUSTOMER: item.CUSTOMER,
            REQUESTDATE: item.REQUEST_DATE,
            VENDOR: item.VENDOR,
            ENDTOENDID: item.ENDTOENDID,
            ID: item.ID,
            REQUESTOR: item.REQUESTOR,
          };
        }).filter(option => option !== null);

        setPROptions(options);

      }).catch(error => {
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

      }).catch(error => {
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

        const RoyaltyOption = transformedData.filter(item => item.TAX_TYPE === 'PPN Royalty').map(item => ({
          value: item.NAME,
          label: item.NAME,
          RATE: item.RATE
        }));
        setPPNRoyaltyOptions(RoyaltyOption);
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
      }).catch(error => {
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

      }).catch(error => {
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

        const contractNumOptions = transformedData.map(item=> ({
          value: item.CONTRACT_NUMBER,
          label: item.CONTRACT_NUMBER,
        }));

        setContractNumberOptions(contractNumOptions);
        setProjectOptions(options);
        setCustomerOptions(optionsCustomer);
      }).catch(error => {
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
      }).catch(error => {
        console.error('Failed to fetch currency lookup:', error);
      });

        
    }, []);


    
    
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


    // New Item List PR Handle
    const handlePRChange = (index, selectedOption) => {
      if (selectedOption) {
        // Lookup PR Detail
        LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then(response => {
          const fetchedItems = response.data || [];
          console.log('Items fetched:', fetchedItems);

          // Lookup PR
          LookupService.fetchLookupData(`PURC_FORMPUREQ&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
          .then(response => {
            const fetchedDatas = response.data || [];
            console.log('Items fetched:', fetchedDatas);
          
            // Fetch product lookup data
            LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
            .then(productData => {
              console.log('Product lookup data:', productData);

              // Transform and map product data to options
              const transformedProductData = productData.data.map(item => Object.keys(item).reduce((acc, key) => {
                acc[key.toUpperCase()] = item[key];
                return acc;
              }, {}));

              const productOptions = transformedProductData.map(item => ({
                  value: item.NAME,
                  label: item.NAME
              }));

              setProductOptions(productOptions);
            }).catch(error => {
              console.error('Error fetching product lookup data:', error);
            });
            

            // Fetch currency lookup data
            LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
            .then(currencyData => {
              console.log('Currency lookup data:', currencyData);

              // Transform and map currency data to options
              const transformedCurrencyData = currencyData.data.map(item => Object.keys(item).reduce((acc, key) => {
                acc[key.toUpperCase()] = item[key];
                return acc;
              }, {}));

              const currencyOptions = transformedCurrencyData.map(item => ({
                  value: item.CODE,
                  label: item.CODE
              }));

              setCurrencyOptions(currencyOptions); // Set currency options to state
            }).catch(error=>{
              console.error('Error fetching currency lookup data:', error);
            });

            const newItems = [...items];
            // Update fetched items with selected options
            const updatedFetchedItems = fetchedItems.map(item => {
              return {
                ...item,
                doc_reff_no: item.pr_number,
                doc_source: item.doc_source,
              };
            });

            updatedFetchedItems.forEach((fetchedItem, i) => {
                newItems[index + i] = {
                ...newItems[index + i],
                ...fetchedItem,
              };
            });

            fetchedDatas.forEach((fetchedData) => {
              newItems.forEach((item, i) => {
                if (item.doc_reff_no === fetchedData.pr_number) {
                  newItems[i] = {
                    ...newItems[i],
                    requestor: fetchedData.requestor,
                  };
                }
              });
            });

            const companyValue = 'PT. Abhimata Persada'; 
            newItems.forEach((item, i) => {
              if (item.doc_reff_no === selectedOption.value) {
                newItems[i].company = companyValue; // Set company for matching items
              }
            });

            // Set the updated items to state
            setItems(newItems);
          }).catch(error => {
            console.error('Failed to fetch PR Items', error);
          });
        }).catch(error => {
          console.error('Failed to load items:', error);
        });
      }else{
          
          const newItems = [...items];
          newItems[index] = {
            ...newItems[index],
            product: '', 
            product_note: '', 
            quantity: 1, 
            currency: 'IDR', 
            unit_price: 0, 
            original_unit_price: 0, 
            total_price: 0, 
            type_of_vat: '',
            tax_ppn: '', 
            tax_ppn_rate: 0, 
            tax_ppn_amount: 0 , 
            tax_base: 0, 
            discount: 0,
            subTotal: 0,
            vat_included: false,
            new_unit_price: 0,
            doc_reff_no: '',
            vendor: '',
            project: '',
            customer: '',
            departement: '',
            project_contract_number: '',
            company:'PT. Abhimata Persada',
            requestor: '',
          };
          setItems(newItems); // Update state with reset selections
        }
    };


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
        type_of_vat: '',
        tax_ppn: '', 
        tax_ppn_rate: 0, 
        tax_ppn_amount: 0 , 
        tax_base: 0, 
        discount: 0,
        subTotal: 0,
        vat_included: false,
        new_unit_price: 0,
        doc_reff_no: '',
        vendor: '',
        project: '',
        customer: '',
        departement: '',
        project_contract_number: '',
        company:'PT. Abhimata Persada',
        requestor: '',
        doc_source: '',
      }]);
    };

    const handleItemChange = (index, field, value) => {
      const newItems = [...items];
      newItems[index][field] = value;
      // newItems[index].original_unit_price = newItems[index].unit_price || 0;

      console.log(index, field, value);

      // Itungan PPN

      // Reset field vat type dan ppn type ketika mengubah unit price dan quantity
      if( field === 'unit_price' || field === 'quantity') {
        newItems[index].type_of_vat = '';
        newItems[index].tax_ppn_rate= '';
        setDiscount(0);
        setFormattedDiscount(0);
        newItems[index].tax_ppn = '';
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

      if (field === 'tax_ppn' || field === 'tax_ppn_rate') {
        if (newItems[index].type_of_vat === 'include'){
          newItems[index].new_unit_price = newItems[index].unit_price + (newItems[index].unit_price * (pengkali));
          newItems[index].tax_base =  Math.round(newItems[index].unit_price / ((1 + (newItems[index].tax_ppn_rate / 100)) * newItems[index].quantity));
          newItems[index].tax_ppn_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100));
          newItems[index].vat_included = true;
        } else if (newItems[index].type_of_vat === "exclude" || newItems[index].type_of_vat === 'PPNRoyalty'){
          newItems[index].tax_ppn_amount = Math.floor(newItems[index].total_price * (newItems[index].tax_ppn_rate/100));
          newItems[index].tax_base = newItems[index].unit_price * newItems[index].quantity;
        }
        newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
      }
      
      // Itungan Type of vat
      if (field === 'type_of_vat') {
        newItems[index].tax_ppn = '';
        newItems[index].tax_ppn_rate = 0;
        newItems[index].tax_base = 0;
        newItems[index].tax_ppn_amount = 0;
        if (newItems[index].type_of_vat === 'exclude' && newItems[index].vat_included === true) {
          newItems[index].new_unit_price = newItems[index].new_unit_price - (newItems[index].unit_price * (pengkali));
          newItems[index].vat_included = false; 
        }else if (newItems[index].type_of_vat === 'nonPPN') {
          newItems[index].tax_base = newItems[index].total_price;
        }else{
          newItems[index].new_unit_price = newItems[index].unit_price;
        }
        newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
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

    const calculateTotalAmount = (currency = 'IDR') => {
      const subTotal = items.reduce((total, item) => {
        const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
        return total + taxBase;
      }, 0);

      const subtotalBeforeDiscount = subTotal

      const subtotalAfterDiscount = subTotal - discount;

      const totalPPNAmount = items.reduce((total, item) => {
        const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : parseFloat(item.tax_ppn_amount);
        return total + taxPPNAmount;
      }, 0);

      const hasRoyalty = items.some(item => item.type_of_vat === 'PPNRoyalty');

      const totalAmount  = hasRoyalty ? subtotalAfterDiscount : subtotalAfterDiscount + totalPPNAmount;
      const validTotalAmount = isNaN(totalAmount) ? 0 : parseFloat(totalAmount);
      return { 
        subTotal, 
        currency,
        subtotalBeforeDiscount,  
        subtotalAfterDiscount, 
        totalPPNAmount, 
        totalAmount: validTotalAmount 
      };
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
      setOrderDate(order_date);
      setCreatedBy(createdBy);
      setDescription('');
      setShipTo('PT. Abhimata Persada');
      setShipToAddress('Menara Batavia, 5th Floor, DKI Jakarta, 10220, ID');
      setBillTo('PT. Abhimata Persada');
      setBillToAddress('Menara Batavia, 5th Floor, DKI Jakarta, 10220, ID');
      setTo('');
      setSelectedTo(null);
      setToAddress('');
      setTermConditions('');
      setSelectedToAddress(null);
      setItems([]);
      setSelectedItems([]);
      setEndToEnd('');
    };

   
    const generatePrNumber = async (code) => {
      try {
        const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
        setEndToEnd(uniquePrNumber); // Updates state, if needed elsewhere in your component
        return uniquePrNumber; // Return the generated PR number for further use
      } catch (error) {
        console.error('Failed to generate PR Number:', error);
        throw error; // Rethrow the error for proper handling in the calling function
      }
    };

    // Handle Save
    const handleSave = async (event) => {
      event.preventDefault();

      if (!po_number) {
        messageAlertSwal('Error', 'PO Number Cant Be Empty', 'error');
        return; 
      }

      // Show SweetAlert2 confirmation
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to save the Purchase Request?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        try {

          let endToEndId;
          // const endToEndId = await handleEndToEnd();
          if (!endToEnd) {
            // Call generate function if endtoendId is empty or null
            endToEndId = await generatePrNumber("PURC");
          } else {
            // Do something else if endtoendId is not empty
            endToEndId = endToEnd;
            console.log("endtoendId is not empty");
          }
          

          const { subtotalAfterDiscount, totalPPNAmount, subtotalBeforeDiscount, totalAmount} = calculateTotalAmount();

          console.log('statuspo', statusPo);
          
          const generalInfo = {
            po_number,
            doc_reff: docRef,
            status_po: selectedData ? selectedData[0].STATUS_PO : 'DRAFT',
            order_date, 
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
            total_after_discount: subtotalAfterDiscount,
            total_before_discount: subtotalBeforeDiscount,
            total_amount_ppn: totalPPNAmount,
            term_conditions: termConditions,
            endtoendid: endToEndId,
            discount
          };

          console.log('Master', generalInfo);

          let response;

          if(selectedData) {
            const id = selectedData[0].ID;
            response = await UpdateDataService.postData(generalInfo, `PUOR&column=id&value=${id}`, authToken, branchId);
          }else{
            response = await InsertDataService.postData(generalInfo, "PUOR", authToken, branchId);
          }

          console.log('Data posted successfully:', response);

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

                delete updatedItem.rwnum; 
                delete updatedItem.ID;
                delete updatedItem.status;
                delete updatedItem.id_trx;
                delete updatedItem.pr_number;
                delete updatedItem.original_unit_price;
                delete updatedItem.new_unit_price;
                delete updatedItem.discount;
                delete updatedItem.vat_included;
                delete updatedItem.subTotal;

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
            handleRefresh();
            setIsAddingNewPurchaseOrder(false);
        }

          if (response.message === "insert Data Successfully") {
            // Iterate over items array and post each item individually
            for (const item of items) {
              const { rwnum, ID, status, id_trx, ...rest } = item;
              const updatedItem = {
                ...item,
                po_number,
                tax_ppn: item.tax_ppn,
              };
              delete updatedItem.rwnum; 
              delete updatedItem.ID;
              delete updatedItem.status;
              delete updatedItem.id_trx;
              delete updatedItem.pr_number;
              delete updatedItem.original_unit_price;
              delete updatedItem.new_unit_price;
              delete updatedItem.discount;
              delete updatedItem.vat_included;
              delete updatedItem.subTotal;


              const itemResponse = await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
              console.log('Item posted successfully:', itemResponse);

              
              // const file = fileInput.files[0];

              // Upload  File Logic
              // const request = {
              //   idTrx: endToEndId,
              //   code: 'PUOR',
              // };
              
              // const formData = new FormData();
              // formData.append('request', JSON.stringify(request));
              // formData.append('file', file); 
              
              // if(file) {
              //   const uploadResponse = await axios.post(UPLOAD_FILES, formData, {
              //     headers: {
              //       Authorization: `Bearer ${authToken}`,
              //       'Content-Type': 'multipart/form-data',
              //     },
              //   });
                
              //   if (uploadResponse.ok) {
              //     console.log('File uploaded successfully');
              //   } else {
              //     console.error('Error uploading file:', uploadResponse.status);
              //   }
              // }

              //Set status workflow VERIFIED
              LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
              .then(response => {
                const data = response.data[0];
                console.log('Data:', data);

                const requestData = {
                  idTrx: data.ID, 
                  status: "DRAFT", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
                };
                UpdateStatusService.postData(requestData, "PUOR", authToken, branchId)
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

      if (!po_number) {
        messageAlertSwal('Error', 'PO Number Cant Be Empty', 'error');
        return; 
      }
      
      // Show SweetAlert2 confirmation
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to Submit the Purchase Request?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        try {

          let endToEndId;
          // const endToEndId = await handleEndToEnd();
          if (!endToEnd) {
            // Call generate function if endtoendId is empty or null
            endToEndId = await generatePrNumber("PURC");
            
          } else {
            // Do something else if endtoendId is not empty
            endToEndId = endToEnd;
            console.log("endtoendId is not empty");
          }

          const { subtotalAfterDiscount, subtotalBeforeDiscount, totalPPNAmount, totalAmount} = calculateTotalAmount();
          // Save general information and description
          const generalInfo = {
            po_number,
            doc_reff: docRef,
            status_po: 'IN_PROCESS',
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
            total_after_discount: subtotalAfterDiscount,
            total_before_discount: subtotalBeforeDiscount,
            total_amount_ppn: totalPPNAmount,
            term_conditions: termConditions,
            endtoendid: endToEndId,
            discount
          };

          console.log('Master', generalInfo);

          let response;

          if(selectedData) {
            const id = selectedData[0].ID;
            response = await UpdateDataService.postData(generalInfo, `PUOR&column=id&value=${id}`, authToken, branchId);
          }else{
            response = await InsertDataService.postData(generalInfo, "PUOR", authToken, branchId);
          }

          console.log('Data posted successfully:', response);

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

              delete updatedItem.rwnum; 
              delete updatedItem.ID;
              delete updatedItem.status;
              delete updatedItem.id_trx;
              delete updatedItem.pr_number;
              delete updatedItem.original_unit_price;
              delete updatedItem.new_unit_price;
              delete updatedItem.discount;
              delete updatedItem.vat_included;
              delete updatedItem.subTotal;

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
            handleRefresh();
            setIsAddingNewPurchaseOrder(false);
            }
        
          if (response.message === "insert Data Successfully") {
            // Iterate over items array and post each item individually
            for (const item of items) {
              const { rwnum, ID, status, id_trx, id_upload, ...rest } = item;
              const updatedItem = {
                ...rest,
                po_number,
                tax_ppn: item.tax_ppn,
                type_of_vat: item.type_of_vat
              };

              delete updatedItem.rwnum; 
              delete updatedItem.ID;
              delete updatedItem.status;
              delete updatedItem.id_trx;
              delete updatedItem.pr_number;
              delete updatedItem.original_unit_price;
              delete updatedItem.new_unit_price;
              delete updatedItem.discount;
              delete updatedItem.vat_included;
              delete updatedItem.subTotal;

              const itemResponse = await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
              console.log('Item posted successfully:', itemResponse);
              // Update Status

              const updatePrStatusData = {
                status_request: "ORDERED",
              }

              if(idPr){
                const updatePRStatus = await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}`, updatePrStatusData, {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  }
                });
                await updatePRStatus;
              };
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


    // Get File Document
    const getFileDocument = async (endtoendid) => {
      const request = {
        idTrx: '2910202400024',
        code: 'PUREQD',
      };
      
      const formData = new FormData();
      formData.append('request', JSON.stringify(request));
      console.log('asd', authToken);
      try {
        const getFileResponse = await axios.get(`${DOWNLOAD_FILES}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: request,
          responseType: 'blob'
        })  
        const blob = new Blob([getFileResponse.data], {type: getFileResponse.headers['content-type'] || 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const contentDisposition = getFileResponse.headers['content-disposition'];
        const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'download.pdf';

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };


    //Dynamic Form With 
    const dynamicFormWidth = (value, index) => {
      const contentLength = value.length;
      const newWidth = Math.max(100, (contentLength + 5) * 8); 
      console.log('content', contentLength);
      
      setInputWidth((prevWidth) => {
        const newWidths = [...prevWidth];
        newWidths[index] = newWidth;
        return newWidths;
      });
    }

    const [isAddFile, setIsAddFile] = useState(false);

    const handleAddFile = () => {
      setIsAddFile(true);
    }


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
                            onChange={(e) => {
                              setDocRef(e.target.value);
                            }}
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
                        <Form.Group controlId='formTo'>
                          <Form.Label>To</Form.Label>
                          <Select
                            id='to'
                            value={selectedTo}
                            options={vendorOptions}
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
                                {docRef === 'internalMemo' ? 
                                    <th>Internal Memo Number</th>
                                  :
                                    docRef === 'customerContract' ? 
                                      <th>Customer Contract Number</th>
                                    :
                                      docRef === 'purchaseRequest' ?
                                        <th>Purchase Request Number</th>
                                      :
                                        <th>Select Doc Ref</th>
                                }
                                <th>Document Source</th>
                                <th>Vendor</th>
                                <th>Company</th>
                                <th>Project</th>
                                <th>Project Contract Number</th>
                                <th>Requestor</th>
                                <th>Customer</th>
                                <th>Department</th>
                                <th>Product</th>
                                <th>Product Description</th>
                                <th>Quantity</th>
                                <th>Currency</th>
                                <th>Unit Price</th>
                                <th>Total Price</th>
                                <th>Type of VAT</th>
                                <th>Tax PPN Type</th>
                                <th>Tax PPN Rate</th>
                                {/* <th>Tax PPN Amount</th> */}
                                <th>Tax Base</th>   
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.length === 0 ? (
                                <tr>
                                  <td colSpan="21" className="text-center">No data available</td>
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
                                      {docRef === 'purchaseRequest' ? 
                                        <Select 
                                          value={PROptions.find(option => option.value === item.doc_reff_no)}
                                          options={PROptions}
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, 'doc_reff_no', selectedOption ? selectedOption.value : null);
                                            handlePRChange(index, selectedOption)
                                          }} 
                                          isClearable
                                          required
                                          placeholder='Purchase Request...'
                                        />
                                        :
                                        docRef === 'internalMemo' ?
                                          <Form.Control
                                            value={item.doc_reff_no}
                                            onChange={(e) => {
                                              handleItemChange(index, 'doc_reff_no', e.target.value);
                                            }}
                                            placeholder='internal Memo...'
                                          />
                                        :
                                        docRef === 'customerContract' ?
                                          <Form.Control
                                            value={item.doc_reff_no}
                                            onChange={(e)=>{
                                              handleItemChange(index, 'doc_reff_no', e.target.value);
                                            }}
                                            placeholder='Customer Contract...'
                                          />
                                          :
                                          <span>Choose Doc Ref</span>
                                      }
                                    </td>

                                    <td>
                                        { isAddFile ? 
                                        <div className='d-flex'>
                                          <Form.Control
                                            type='file'
                                            placeholder='Upload Document'
                                            onChange={(e) => setFile(e.target.files[0])}
                                            disabled // Ilangin kalo upload dh jalan
                                          />
                                          <button className='btn btn-danger ms-2' onClick={() => setIsAddFile(false)}>
                                            <i className='fa fa-times'/>
                                          </button>
                                        </div>
                                         
                                        :
                                        <div>
                                          {item.doc_source ?
                                            <a 
                                              href='#' 
                                              className='me-2' 
                                              onClick={(e)=>{
                                                e.preventDefault();
                                                getFileDocument(item.endtoendid)
                                              }}
                                            >
                                              {item.doc_source}
                                            </a>
                                            :
                                            <span className='me-2'>No Data</span>
                                          }
                                          <button className='btn btn-success'onClick={() => setIsAddFile(true)}>
                                            <i className='fa fa-edit'/>
                                          </button>
                                        </div>
                                        }
                                    </td>

                                    <td>
                                      <Select
                                        id='vendor'
                                        value={
                                          items[index].vendor ?
                                            vendorOptions.find(option => option.value === item.vendor)
                                          :
                                            null
                                        }
                                        options={vendorOptions}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'vendor', selectedOption ? selectedOption.value : null)
                                        }}
                                        isClearable
                                        placeholder="Vendor..."
                                        required
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        id='company'
                                        value={item.company}
                                        placeholder='Company'
                                        onChange={(e)=>handleItemChange(index, 'company', e.target.value)}
                                      />
                                    </td>

                                    <td>
                                      <Select
                                        id="project"
                                        value={
                                          items[index].project ?
                                            projectOptions.find(option => option.value === item.project)
                                          :
                                            null
                                        }
                                        options={projectOptions}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'project', selectedOption ? selectedOption.value : null)
                                        }}
                                        placeholder="Project..."
                                        isClearable 
                                        required
                                      />
                                    </td>

                                    <td>
                                      <Select
                                        id='projectContractNumber'
                                        value={
                                          items[index].project_contract_number ?
                                            contractNumberOption.find(option => option.value === item.project_contract_number)
                                          :
                                            null  
                                        }
                                        options={contractNumberOption}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'project_contract_number', selectedOption ? selectedOption.value : null);
                                        }}
                                        placeholder='Project Contract Number...'
                                        isClearable
                                        required
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        id='requestor'
                                        placeholder='Requestor'
                                        value={item.requestor}
                                        onChange={(e) => handleItemChange(index, 'requestor', e.target.value)}
                                      />
                                    </td>

                                    <td>
                                      <Select
                                        id='customer'
                                        value={
                                          items[index].customer ?
                                            customerOptions.find(option => option.value === item.customer)
                                          : 
                                            null
                                        }
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'customer', selectedOption ? selectedOption.value : null)
                                        }}
                                        options={customerOptions}
                                        placeholder='Customer...'
                                        isClearable
                                        required
                                      />
                                    </td>

                                    <td>
                                      <Select
                                        id='department'
                                        value={
                                          items[index].departement ?
                                            departementOptions.find(option => option.value === items[index].departement)
                                          :
                                            null
                                        }
                                        onChange={(selectedOption)  => {
                                          handleItemChange(index, 'departement', selectedOption ? selectedOption.value : null)
                                        }}
                                        options={departementOptions}
                                        placeholder='Department...'
                                        isClearable
                                        required
                                      />
                                    </td>
                                    
                                    <td>
                                      <Select
                                          value={
                                            items[index].product ? 
                                              productOptions.find(option => option.value === items[index].product) 
                                            : 
                                              null
                                          }
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
                                        onChange={(e) => handleItemChange(index, 'quantity', Math.max(0, parseFloat(e.target.value) || 1))}
                                        style={{width: '75px'}}
                                      />
                                    </td>
                                    
                                    <td>
                                      <Select
                                        value={currencyOptions.find(option => option.value === item.currency)}
                                        onChange={(selectedOption) => {
                                          // setSelectedCurrency(selectedOption);
                                          handleItemChange(index, 'currency', selectedOption ? selectedOption.value : 'IDR');
                                        }}
                                        options={currencyOptions}
                                        placeholder="Select Currency"
                                      />
                                    </td>
                                    
                                    <td>
                                      {item.currency === 'IDR' ?
                                        <Form.Control
                                          className='text-right'
                                          type="text"
                                          value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString('en-US') : 0}
                                          onChange={(e) => {
                                            const newPrice = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                                            dynamicFormWidth(e.target.value || item.unit_price , index);
                                            handleItemChange(index, 'unit_price',  newPrice);
                                          }}
                                          style={{
                                            width: `${inputWidth[index] || 100}px`,
                                          }}
                                        />
                                      : 
                                        <Form.Control
                                          className="text-right"
                                          type="text"
                                          value={
                                            item.unit_price !== undefined && item.unit_price !== null
                                              ? item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2, useGrouping: false })
                                              : '0'
                                          }
                                          onChange={(e) => {
                                            dynamicFormWidth(e, index);
                                            const input = e.target.value;
                                            const sanitizedInput = input.replace(/[^0-9.]/g, '');
                                            handleItemChange(index, 'unit_price', sanitizedInput);
                                          }}
                                          onBlur={() => {
                                            const price = parseFloat(item.unit_price) || 0;
                                            handleItemChange(index, 'unit_price', price);
                                          }}
                                          style={{
                                            width: `${inputWidth[index] || 100}px`,
                                          }}
                                        />
                                      }
                                    </td>

                                    <td>{item.total_price.toLocaleString('en-US', { style: 'currency', currency: item.currency })}</td>
                                   
                                    <td>
                                      <Form.Select
                                        value={
                                          items[index].type_of_vat || ''
                                        }
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'type_of_vat', selectedOption.target.value);
                                        }}
                                      >
                                        <option value="">Select VAT</option>
                                        {/* Add more options here */}
                                        <option value="include">Include</option>
                                        <option value="exclude">Exclude</option>
                                        <option value="nonPPN">Non PPN</option>
                                        { items[index].currency !== 'IDR' ?
                                          <option value="PPNRoyalty">PPN Royalty</option>
                                          :
                                          <></>
                                        }
                                      </Form.Select>
                                    </td>

                                    <td>
                                      <Select
                                        value={
                                          items[index].type_of_vat === 'PPNRoyalty' ?
                                            PPNRoyaltyOptions.find(option => option.value === item.tax_ppn)
                                          :
                                            taxTypeOptions.find(option => option.value === item.tax_ppn) || null
                                        }
                                        options={items[index].type_of_vat === 'PPNRoyalty' ? PPNRoyaltyOptions : taxTypeOptions}
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
                                          handleItemChange(index, 'tax_ppn', selectedOption ? selectedOption.value : ''  );
                                        }}
                                        isDisabled={items[index].type_of_vat === 'nonPPN'}
                                      />
                                    </td>
                                    
                                    <td>
                                      <Form.Control
                                        type='text'
                                        value={item.tax_ppn_rate + '%'}
                                        disabled
                                        style={{width: '80px'}}
                                      />
                                    </td>

                                    <td className=''>
                                      {item.currency === 'IDR' ?
                                        <Form.Control
                                          type='text'
                                          disabled
                                          style={{
                                            textAlign: 'right',
                                            width: `${inputWidth[index] || 100}px`,
                                            marginLeft: 'auto',  
                                            display: 'flex',
                                          }}
                                          value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base.toLocaleString('en-US') : 0}
                                          onChange={(e) => {
                                            const newTaxBase = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                                            handleItemChange(index, 'tax_base', Math.max(0, newTaxBase));
                                            dynamicFormWidth(e, index);
                                          }}
                                        />
                                      :
                                        <Form.Control
                                          type='text'
                                          disabled
                                          style={{
                                            textAlign: 'right',
                                            width: `${inputWidth[index] || 100}px`,
                                            marginLeft: 'auto',  
                                            display: 'flex',
                                          }}
                                          value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base : 0}
                                          onChange={(e) => {
                                            handleItemChange(index, 'tax_base', Math.max(0, parseFloat(e.target.value) || 0))
                                            dynamicFormWidth(e, index)
                                          }}
                                        />
                                      }
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
                                <td colSpan="19">Subtotal Before Discount:</td>
                                <td>
                                  <strong>
                                    {items.length > 0 
                                      ? calculateTotalAmount(items[0].currency).subTotal.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: items[0].currency || 'IDR'
                                      })
                                      : 'IDR 0.00'}
                                  </strong>
                                </td>
                              </tr>
                              <tr className='text-right'>
                                <td colSpan="19">Discount:</td>
                                <td>
                                  <Form.Control
                                    className='text-right'
                                    type="text"
                                    value={discount !== undefined && discount !== null ? discount.toLocaleString('en-US') : 0}
                                    onChange={(e) => {
                                      const newDiscount = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                                      setDiscount(newDiscount);
                                      dynamicFormWidth(e, index);
                                      
                                    }}
                                    style={{
                                      textAlign: 'right',
                                      width: `${inputWidth[index] || 100}px`,
                                      marginLeft: 'auto',  
                                      display: 'flex',
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr className='text-right'>
                                <td colSpan="19">Subtotal:</td>
                                <td>
                                  <strong>
                                    {items.length > 0 ? 
                                      calculateTotalAmount(items[0].currency).subtotalAfterDiscount.toLocaleString('en-US', { 
                                        style: 'currency', 
                                        currency: items[0].currency || 'IDR'
                                      })
                                    : 
                                      'IDR 0.00'
                                    }
                                  </strong>
                                </td>
                              </tr>
                              <tr className='text-right'>
                                <td colSpan="19">Total PPN:</td>
                                <td>
                                  <Form.Control
                                    className='text-right'
                                    type='text'
                                    value={
                                      calculateTotalAmount().totalPPNAmount.toLocaleString('en-US') || 0
                                    }
                                    onChange={
                                      (e) => {
                                        dynamicFormWidth(e, index);
                                        const newItems = [...items];
                                        const totalPPNAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                                        newItems.forEach((item)=>{
                                          item.tax_ppn_amount= totalPPNAmount/newItems.length;
                                        });
                                     setItems(newItems); 
                                    }}
                                    style={{
                                      textAlign: 'right',
                                      width: `${inputWidth[index] || 100}px`,
                                      marginLeft: 'auto',  
                                      display: 'flex',
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr className="text-right">
                                <td colSpan="19" >Total Amount:</td>
                                <td>
                                  <strong>
                                    {items.length > 0 ?
                                      calculateTotalAmount(items[0].currency).totalAmount.toLocaleString('en-US', { 
                                        style: 'currency', 
                                        currency: items[0].currency || 'IDR' 
                                      })
                                    :
                                      'IDR 0.00'
                                    } 
                                  </strong>
                                </td>
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
                      value={termConditions}
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
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter Notes"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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