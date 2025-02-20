import React, { Fragment, useDebugValue, useEffect, useState, useSyncExternalStore } from 'react';
import { Button, Col, Form, InputGroup, Row, Card, FormControl } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from '../service/InsertDataService';
import { getBranch, getToken, idUser, userLoggin } from '../config/Constant';
import { AUTH_SERVICE_LIST_USER, AUTH_SERVICE_LIST_USER_DETAIL, DOWNLOAD_FILES, FORM_SERVICE_UPDATE_DATA, GENERATED_NUMBER, UPLOAD_FILES, USER_SERVICE_USER_DETAIL } from '../config/ConfigUrl';
import { generateUniqueId } from '../service/GeneratedId';
import Select from 'react-select';
import LookupParamService from '../service/LookupParamService';
import LookupService from '../service/LookupService';
import UpdateStatusService from '../service/UpdateStatusService';
import axios from 'axios';
import UpdateDataService from '../service/UpdateDataService';
import DeleteDataService from '../service/DeleteDataService';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { FaCalendar } from 'react-icons/fa';
import UserService from '../service/UserService';

const AddPurchaseOrder = ({ 
  setIsAddingNewPurchaseOrder, 
  setIsEditingPurchaseOrder,
  isEditingPurchaseOrder,
  isAddingNewPurchaseOrder,
  selectedData,
  handleRefresh,
  duplicateFlag,
  setDuplicateFlag,
  setIsAddingNewDuplicatePurchaseOrder,
  index, 
  item  
}) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem('id');

  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [isAddFile, setIsAddFile] = useState(false);

  // PO Fields
  const [po_number, setPoNumber] = useState('');
  const [docRef,setDocRef] = useState(''); 

  const [order_date, setOrderDate] = useState(new Date().toISOString('en-GB').slice(0, 10));
  const [createdBy, setCreatedBy] = useState({id: null, userName:''});
  const [shipTo, setShipTo] = useState('PT. Abhimata Persada');
  const [shipToAddress, setShipToAddress] = useState('Menara Batavia, 5th Floor, DKI Jakarta, 10220, ID');
  const [billTo, setBillTo] = useState('PT. Abhihmata Persada');
  const [billToAddress, setBillToAddress] = useState('Menara Batavia, 5th Floor, DKI Jakarta, 10220, ID');
  const [termConditions, setTermConditions] = useState('');
  const [endToEnd,setEndToEnd] = useState('');
  const [PPNRoyaltyOptions, setPPNRoyaltyOptions] = useState([]);
  const [taxTypeIncludeOptions, setTaxTypeIncludeOptions] = useState([]);
  const [taxTypeExcludeOptions, setTaxTypExcludeeOptions] = useState([]);


  // PO Lookup
  const [projectOptions, setProjectOptions] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [PROptions, setPROptions] = useState([]);
  const [currency_id, setCurrencyId] = useState(61);
  const [to, setTo] = useState('');
  const [form_to_id, setFormToId] = useState('');
  const [vendor_id, setVendorId] = useState('');
  const [selectedTo, setSelectedTo] = useState(null);
  const [toAddress, setToAddress] = useState('');
  const [toAddressOptions, setToAddressOptions] = useState([]);
  const [selectedToAddress, setSelectedToAddress] = useState(null);
  const [contractNumberOption, setContractNumberOptions]= useState([]);
  const [fetchedPRDetail, setFetchedPRDetail] = useState([]);
  const [vendor, setVendor] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [currency, setCurrency] = useState('');
  const [isSubmited, setIsSubmited] = useState(false);
  const [allPROptions, setAllPROption] = useState([])

  const authToken = headers;

    const isDark = localStorage.getItem('darkmode')
    // console.log('isdarke', isDark)


  // Lookup Department
  const lookupDepartment = () => {
    LookupParamService.fetchLookupDataView("MSDT_FORMDPRT", authToken, branchId)
    .then(data => {

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );

      const options = transformedData.map(item => ({
        id: item.ID,
        value: item.NAME,
        label: item.NAME
      }));

      setDepartementOptions(options);

    }).catch(error => {
      console.error('Failed to fetch Department lookup:', error);
    });
  }


  // Lookup Tax Type
  const lookupTaxType = (selectedData) => {
    LookupParamService.fetchLookupDataView("MSDT_FORMTAX", authToken, branchId)
    .then(data => {

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );

      const Alloptions = transformedData.filter(item => item.TAX_TYPE === 'PPN').map(item => ({
        value: item.NAME,
        label: item.NAME,
        RATE: item.RATE,
        id: item.ID,
      }));

      const IncludeOptions = transformedData.filter(item => item.TAX_TYPE === 'PPN' && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === 'Purchase' || item.TAX_TYPE_USE === 'ALL') && item.ACTIVE === true).map(item => ({
        value: item.NAME,
        label: item.NAME,
        RATE: item.RATE,
        id: item.ID,
      }));
      setTaxTypeIncludeOptions(IncludeOptions);

      const ExcludeOptions = transformedData.filter(item => item.TAX_TYPE === 'PPN' && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === 'Purchase' || item.TAX_TYPE_USE === 'ALL') && item.ACTIVE === true).map(item => ({
        value: item.NAME,
        label: item.NAME,
        RATE: item.RATE,
        id: item.ID,
      }));
      setTaxTypExcludeeOptions(ExcludeOptions);

      const RoyaltyOption = transformedData.filter(item => item.ROYALTY === true).map(item => ({
        id: item.ID,
        value: item.NAME,
        label: item.NAME,
        RATE: item.RATE
      }));
      setPPNRoyaltyOptions(RoyaltyOption);


      if(selectedData){
        Alloptions.find(option => option.value === selectedData[0].TAX_PPN);
      }
    })
    .catch(error => {
      console.error('Failed to fetch Tax Type lookup:', error);
    });
  }


  // Lookup Vendor
  const lookupVendor = (selectedData) => {
    
    LookupParamService.fetchLookupDataView("MSDT_FORMCUST", authToken, branchId)
    .then(data => {

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );

      const options = transformedData.filter(item => item.ENTITY_TYPE === 'BOTH' || item.ENTITY_TYPE === 'Vendor').map(item => ({
        id: item.ID,
        value: item.NAME,
        label: item.NAME,
        vendAddress: item.ADDRESS
      }));
      setVendorOptions(options);

      const uniqueAddress = [...new Set(transformedData.map(item => item.ADDRESS))];
      const optionsForToAddress = uniqueAddress.map(address => ({
        value: address,
        label: address
      }));
      setToAddressOptions(optionsForToAddress);

      if(selectedData){
        // Vendor
        const selectVendor = options.find(option => option.id === selectedData[0].VENDOR_ID) || "";
        setSelectedVendor(selectVendor || null);
        setVendor(selectVendor.value);
        setVendorId(selectVendor.id)
        console.log('idven', selectedData)
        // To
        const selectTo = options.find(option => option.id === selectedData[0].VENDOR_ID) || "";
        setSelectedTo(selectTo || null);
        setTo(selectTo.value);
        setFormToId(selectTo.id)

        // To Address
        const selectToAddress = optionsForToAddress.find(option => option.value === selectedData[0].TO_ADDRESS) || "";
        setSelectedToAddress(selectToAddress || null);
        setToAddress(selectToAddress.value);
      }

    }).catch(error => {
      console.error('Failed to fetch vendor lookup:', error);
    });
  }


  // Lookup Project
  const lookupProject = () => {
    LookupParamService.fetchLookupDataView("MSDT_FORMPRJT", authToken, branchId)
    .then(data => {

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );

      const options = transformedData.map(item => ({
        id: item.ID,
        value: item.NAME,
        label: item.NAME,
        customer: item.CUSTOMER,
        project_contract_number: item.CONTRACT_NUMBER,
      }));

      const optionsCustomer = transformedData.map(item => ({
        id: item.CUSTOMER_ID,
        value: item.CUSTOMER,
        label: item.CUSTOMER,
      }))

      const contractNumOptions = transformedData.map(item=> ({
        id: item.ID,
        value: item.CONTRACT_NUMBER,
        label: item.CONTRACT_NUMBER,
        customer: item.CUSTOMER,
      }));

      setContractNumberOptions(contractNumOptions);
      setProjectOptions(options);
      setCustomerOptions(optionsCustomer);
    }).catch(error => {
      console.error('Failed to fetch project lookup:', error);
    });
  }

  // Lookup Product
  const lookupProduct = () => {
    LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
    .then(data => {

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );

      const options = transformedData.map(item => ({
        id: item.ID,
        value: item.NAME,
        label: item.NAME
      }));  
      setProductOptions(options);
    }).catch(error => {
      console.error('Failed to fetch product lookup:', error);
    });
  }

  // Lookup Currency
  const lookupCurrency = (selectedData) => {
    LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
    .then(data => {

      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );

      const options = transformedData.map(item => ({
        id: item.ID,
        value: item.CODE,
        label: item.CODE
      }));
      setCurrencyOptions(options);

      // Default Currency
      if(selectedData) {
        const selectCurrency = options.find(option => option.id === selectedData[0].CURRENCY_ID || "")
        setSelectedCurrency(selectCurrency || null)
        setCurrency(selectCurrency.value)
        setCurrencyId(selectCurrency.id);
      } else if(!selectedData){
        const defaultCurrency = options.find(option => option.id === 61)
        setSelectedCurrency(defaultCurrency)
        setCurrency(defaultCurrency.value)
        setCurrencyId(defaultCurrency.id)
      }
      console.log('isselceted', selectedData)
    }).catch(error => {
      console.error('Failed to fetch currency lookup:', error);
    }); 
  }

  // Lookup Pr
  const lookupPR = (selectedCurrency, selectedVendor) => {
    let prUrl = "PURC_FORMPUREQ&filterBy=STATUS&filterValue=APPROVED&operation=EQUAL";
    console.log(prUrl); 
    LookupService.fetchLookupData(prUrl, authToken, branchId)
    .then(data => {
      
      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );
      console.log('Transformed data:', transformedData);
      
      // Pureqd lookup
      // LookupParamService.fetchLookupDataView(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL&filterBy=CURRENCY_ID&filterValue=${selectCurrency}&operation=EQUAL`, authToken, branchId)

      const allOptionPr = transformedData.map(item => {
        return{
          id: item.ID,
          value: item.PR_NUMBER,
          label: item.PR_NUMBER
        }
      })
      setAllPROption(allOptionPr)

      const options = transformedData.filter(item => item.STATUS_REQUEST === 'PARTIAL_REQUESTED' || item.STATUS_REQUEST === 'IN_PROCESS').map(item => {
        const label = item.PR_NUMBER;
        if (label.startsWith('DRAFT')) {
          return null; // or you can return an empty object {}
        }
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

      const pureqdPromises = options.map(option => {
        return LookupParamService.fetchLookupDataView(
          `PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${option.value}&operation=EQUAL&filterBy=CURRENCY_ID&filterValue=${selectedCurrency || 61}&operation=EQUAL`, 
          authToken, 
          branchId
        ).then(pureqdData => {
          return {
            ...option,
            pureqdData: pureqdData.data.filter(item => item.status_detail === null)
          };
        });
      });

      return Promise.all(pureqdPromises);
    })
    .then(allPureqdData => {
      const validOptions = allPureqdData.filter(item => 
        item.pureqdData && Array.isArray(item.pureqdData) && item.pureqdData.length > 0
      );

      setPROptions(validOptions);
    }).catch(error => {
      console.error('Failed to fetch currency lookup:', error);
    });
  }


  // Lookup caller
  useEffect(() => {

    console.log('duplicated', duplicateFlag)
    if(selectedData) {
      const { ID, PO_NUMBER } = selectedData[0];
      // Set data awal dari selectedData

      console.log('id and pr number', ID, PO_NUMBER);
      if(duplicateFlag === false){
        setPoNumber(PO_NUMBER);
      }
      
      // console.log('deda', selectedData[0]);
      // const headers = { Authorization: `Bearer ${authToken}` };

      // Panggil API untuk mendapatkan data berdasarkan ID
      LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=PO_NUMBER&filterValue=${PO_NUMBER}&operation=EQUAL`, authToken, branchId)
      .then(response => {
        const data = response.data[0];
        console.log('Data:', data);
        setOrderDate(data.order_date);
        setDocRef(data.doc_reff);
        setShipTo(data.ship_to);
        setShipToAddress(data.ship_to_address);
        setBillTo(data.bill_to);
        setBillToAddress(data.bill_to_address);
        setTermConditions(data.term_conditions);
        setDescription(data.description);

        // const userCreated = axios.get(`${AUTH_SERVICE_LIST_USER_DETAIL}?id=${data.create_by_id}`, { headers });
        UserService.fetchUserData(data.create_by_id, authToken).then(response => {
          console.log('userf', response.userName)
          setCreatedBy({id: response.id, userName: response.userName})
        })
        
        // console.log('userf', userCreated)
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

        if(docRef === 'purchaseRequest'){
          const prDetailPromises = fetchedItems.map(item => {
          
            return LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${item.doc_reff_no}&operation=EQUAL`, authToken, branchId)
            .then(prResponse => {
              return prResponse.data || [];
            })
            .catch(error => {
              console.error(`Failed to load PR details for ${item.doc_reff_no}:`, error);
              return []; 
            });
          });
          console.log('prdetailpromise', prDetailPromises)

          Promise.all(prDetailPromises)
          .then(allFetchedPRDetails => {
            const flattenedPRDetails = allFetchedPRDetails.flat();
            const uniquePRDetails = Array.from(new Set(flattenedPRDetails.map(item => item.ID)))
            .map(id => flattenedPRDetails.find(item => item.ID === id));
            setFetchedPRDetail(uniquePRDetails);
          })
          .catch(error => {
              console.error('Failed to load all PR details:', error);
          });
        }
      })
      .catch(error => {
          console.error('Failed to load items:', error);
      });

      lookupVendor(selectedData);
      lookupCurrency(selectedData);
    } else {
      UserService.fetchUserData(sessionStorage.getItem('id'), authToken).then(response => {
        setCreatedBy({id: response.id, userName: response.userName})
      })
    }

    lookupPR();

    lookupCurrency(selectedData);
    
    lookupDepartment();

    lookupTaxType();

    lookupVendor();

    lookupProject();
      
    lookupProduct();
    
  }, []);


  // Vendor Handle
  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : '');
    setVendorId(selectedOption ? selectedOption.id  : '');

    if(selectedOption){
      // Autofill To
      setSelectedTo(selectedOption);
      setTo(selectedOption ? selectedOption.value : '');
      // Autofill To Address
      const toAddressOption = toAddressOptions.find((option) => option.value === selectedOption.vendAddress);
      setSelectedToAddress(toAddressOption);
      setToAddress(toAddressOption ? toAddressOption.value : '');
      setFormToId(selectedOption ? selectedOption.id : "")
    }else{
      setSelectedTo(null);
      setTo('');
      setSelectedToAddress(null);
      setToAddress('');
      setFormToId('')
    }
  }
  
  // To Handler untuk autofill address
  const handleToChange = (selectedOption) => {
    setSelectedTo(selectedOption);
    setTo(selectedOption ? selectedOption.value : '');
    setFormToId(selectedOption ? selectedOption.id : '');
    
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

  const defaultItems = {
    product_id: '',
    product_note: '', 
    quantity: 1, 
    unit_price: 0, 
    original_unit_price: 0, 
    total_price: 0, 
    type_of_vat: '',
    tax_ppn_rate: 0, 
    tax_ppn_amount: 0 , 
    tax_base: 0, 
    discount: 0,
    subTotal: 0,
    vat_included: false,
    new_unit_price: 0,
    doc_reff_no: '',
    project_contract_number: '',
    company:'PT. Abhimata Persada',
    requestor_id: parseInt(idUser),
    doc_source: '',
    order_id: '',
    customer_id: '',
    department_id: '',
    project_id: '',
    vendor_id: vendor_id,
    currency_id: currency_id,
  }
  
  // New Item List PR Handle
  const handlePRChange = (index, selectCurrency, selectedOption) => {
    console.log('currency', selectCurrency)
    if (selectedOption) {
      console.log('curr', selectedOption);
      // Lookup PR Detail
      LookupParamService.fetchLookupDataView(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
      .then(response => {

        const allItems = Array.isArray(response.data) ? response.data : []
        const fetchedItems = Array.isArray(response.data) ? response.data.filter(item => item.status_detail === null && item.currency_id === selectCurrency) : [];
        console.log('Itemd fetched:', response.data);
        // dynamicFormWidth(response.data[0].unit_price.toString()+5, index);

        // Lookup PR
        LookupParamService.fetchLookupDataView(`PURC_FORMPUREQ&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then(response => {
          const fetchedDatas = response.data || [];
          console.log('Items fetched:', fetchedDatas);

          const newItems = [...items];
          const newStored = [...items];

          const storedPRItems = allItems.map((item => {
            return {
              ...item,
            }
          }));
          storedPRItems.forEach((fetchedItem, i) => {
            newStored[index + i] = {
              ...newStored[index + i],
              ...fetchedItem,
            };
          });
          
          console.log('storedPRItems', newStored);
          setFetchedPRDetail(newStored);


          // Update fetched items with selected options
          const updatedFetchedItems = fetchedItems.map(item => {
            return {
              ...item,  
              doc_reff_no: item.pr_number,
              doc_source: item.doc_source,
              discount: item.discount || 0,
              currency: currency,
              currency_id: currency_id,
              requestor_id: parseInt(idUser),
            };
          });

          console.log('fetvhedf', fetchedItems);

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
       ...defaultItems
      };
      setItems(newItems); 
    }
  };
  console.log('pr stored', fetchedPRDetail);
  const handleOptionChange = (setter, stateSetter, selectedOption) => {
    setter(selectedOption);
    stateSetter(selectedOption ? selectedOption.value : '');
  };

  const generateUploadId = async (code) => {
    try {
      const uniqueNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken); // Updates state, if needed elsewhere in your component
      return uniqueNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error('Failed to generate Unique Number:', error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleAddItem = () => {
    setItems([...items, {...defaultItems}])
  }


  const handleItemChange = async (index, field, value) => {
    const newItems = [...items];
    
    // newItems[index].original_unit_price = newItems[index].unit_price || 0;

    console.log(index, field, value);


      if (field === 'file') {
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
            code: 'PUORD',
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

    else{
      newItems[index][field] = value;
    }

    // Itungan New Unit Price
    let pengkali = newItems[index].tax_ppn_rate/100;
      
    // Itungan Type of vat
    if (field === 'type_of_vat') {
      newItems[index].tax_ppn = '';
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      if (newItems[index].type_of_vat === 'exclude' && newItems[index].vat_included === true) {
        newItems[index].new_unit_price = newItems[index].new_unit_price - ((newItems[index].unit_price - newItems[index].discount) * (pengkali));
        newItems[index].vat_included = false; 
      }else if (newItems[index].type_of_vat === 'nonPPN') {
        newItems[index].tax_base = newItems[index].total_price;
      }else{
        newItems[index].new_unit_price = newItems[index].unit_price - newItems[index].discount;
      }
      newItems[index].total_price = Math.max((newItems[index].unit_price - newItems[index].discount), 0) * newItems[index].quantity;
    }

    // Itungan PPN

    // Reset field vat type dan ppn type ketika mengubah unit price dan quantity
    if( field === 'unit_price' || field === 'quantity') {
      newItems[index].type_of_vat = '';
      newItems[index].tax_ppn_rate= 0;
      newItems[index].tax_ppn = '';
      newItems[index].tax_base = 0; 
      newItems[index].tax_ppn_amount = 0;
      if(newItems[index].vat_included !== undefined) {
        newItems[index].vat_included = false;
      }
    }
    if (field === 'quantity' || field === 'unit_price' || field === 'discount') {
      newItems[index].total_price = newItems[index].quantity * Math.max((newItems[index].unit_price - newItems[index].discount),0); 
    }


    if (field === 'tax_ppn' || field === 'tax_ppn_rate') {
      if (newItems[index].type_of_vat === 'include'){
        newItems[index].new_unit_price = (newItems[index].unit_price - newItems[index].discount) + (newItems[index].unit_price * (pengkali));
        newItems[index].tax_base =  Math.round((newItems[index].unit_price - newItems[index].discount) / (1 + (newItems[index].tax_ppn_rate / 100)) * newItems[index].quantity);
        newItems[index].tax_ppn_amount = (newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100));
        newItems[index].vat_included = true;
      } else if (newItems[index].type_of_vat === "exclude" || newItems[index].type_of_vat === 'PPNRoyalty'){
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].total_price * (newItems[index].tax_ppn_rate/100));
        newItems[index].tax_base = (newItems[index].unit_price - newItems[index].discount) * newItems[index].quantity;
      }
      newItems[index].total_price = Math.max((newItems[index].unit_price - newItems[index].discount), 0) * newItems[index].quantity;
    }
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const itemToRemove = items[index];
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
    setSelectedItems(selectedItems.filter((i) => i !== index));

    console.log('items', itemToRemove);

    // Reset curency
    if(newItems.length === 0){
      console.log('lengt',selectedItems.length)
      setFetchedPRDetail([]);
      return;
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
      setSelectedItems([])
      setFetchedPRDetail([])
    } else {
      setSelectedItems(items.map((_, index) => index));
    }
  };

  const handleDeleteLast = () => {
    const newItems = items.slice(0, items.length - 1); // Create a new array excluding the last item
    setItems(newItems);
    setSelectedItems([]);
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

    const totalDiscount = items.reduce((total, item) => {
      const Discount = isNaN(item.discount) ? 0 : item.discount;
      return total + Discount;
    }, 0)

    // const subtotalBeforeDiscount = subTotal;

    // const subtotalAfterDiscount = subTotal - discount;

    const totalPPNAmount = items.reduce((total, item) => {
      const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : parseFloat(item.tax_ppn_amount);
      return total + taxPPNAmount;
    }, 0);
    
    const totalAmount  = Math.round(subTotal + totalPPNAmount);
    const validTotalAmount = isNaN(totalAmount) ? 0 : parseFloat(totalAmount);
    return { 
      totalDiscount,
      subTotal, 
      currency,
      totalPPNAmount: Math.floor(totalPPNAmount), 
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
    setOrderDate(order_date);
    setCreatedBy(createdBy.userName);
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
    setIsSubmited(false);
    setVendor('');
    setSelectedVendor(null);
    setCurrency(currencyOptions.find(option => option.value === 'IDR').value);
    setSelectedCurrency(currencyOptions.find(option => option.value === 'IDR'));
    setCurrencyId(currencyOptions.find(option => option.value === 'IDR').id);
    setVendorId('');
    setFormToId('');
  };

  console.log('currency', currency)
  
  const generatePrNumber = async (code) => {
    try {
      const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
      setEndToEnd(uniquePrNumber); 
      return uniquePrNumber; 
    } catch (error) {
      console.error('Failed to generate PR Number:', error);
      throw error;
    }
  };

  const fieldsToDelete = [
    'rwnum',
    'ID',
    'status',
    'id_trx',
    'pr_number',
    'original_unit_price',
    'new_unit_price',
    'vat_included',
    'subTotal',
    'request_id',
    'company_id',
    'currency',
    'requestor',
    'tax_ppn',
    'departement',
    'project',
    'customer',
    'vendor',
    'product'
  ];

  const storedToDelete = [
    'rwnum',
    'ID',
    'status',
    'id_trx',
    'original_unit_price',
    'type_of_vat',
    'tax_ppn',
    'tax_ppn_amount',
    'tax_ppn_rate',
    'subtotal',
    'subTotal',
    'tax_base',
    'discount',
    'vat_included',
    'new_unit_price',
    'requestor',
    'requestor_id',
    'product',
    'po_number',
    'currency',
    'customer',
    'company',
    'departement',
    'project',
    'vendor'
  ];

  const handleItemsInsert = async (po_number, duplicateFlag) => {
    for (const item of items) {
      let updatedItem;
      if(duplicateFlag){
        updatedItem = {
          doc_reff_no: item.doc_reff_no,
          doc_source: item.doc_source,
          requestor: item.requestor,
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
          type_of_vat: item.type_of_vat,
          tax_ppn: item.tax_ppn,
          tax_ppn_rate: item.tax_ppn_rate,
          tax_base: item.tax_base,
          id_upload: item.id_upload,
          po_number: po_number,
        };
      }else{
        updatedItem = { ...item, po_number};
      }
      await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
      console.log('Item posted successfully:', updatedItem);
    }
  }
  

  const generateGeneralInfo = (poNumber, endToEndId, statuspo) => {
    return {
      po_number: poNumber,
      doc_reff: docRef,
      status_po: statuspo,
      order_date: moment().format('YYYY-MM-DD'),
      description,
      total_amount: calculateTotalAmount().totalAmount,
      to_address: toAddress,
      ship_to: shipTo,
      ship_to_address: shipToAddress,
      bill_to: billTo,
      bill_to_address: billToAddress,
      subtotal: calculateTotalAmount().subTotal,
      total_amount_ppn: calculateTotalAmount().totalPPNAmount,
      term_conditions: termConditions,
      endtoendid: endToEndId,
      total_discount: calculateTotalAmount().totalDiscount,
      form_to_id,
      vendor_id,
      currency_id,
      create_by_id: createdBy.id || parseInt(idUser)
    };
  };


  // Item list post function
  async function postItems(items, IDforOrderID, po_number, fieldsToDelete, authToken, branchId) {
    for (const item of items) {
      const { rwnum, ID, status, id_trx, ...rest } = item;
      const updatedItem = {
        ...item,
        order_id: IDforOrderID,
        po_number,
        tax_ppn: item.tax_ppn,
      };
  
      fieldsToDelete.forEach(field => delete updatedItem[field]);
  
      try {
        const itemResponse = await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
        console.log('Item posted successfully:', itemResponse);
      } catch (error) {
        console.error('Error posting item:', error);
      }
    }
  }


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
        
        const checkDataResponse = await LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=po_number&filterValue=${po_number}&operation=EQUAL`, authToken, branchId);
        const existingData = checkDataResponse.data;
        console.log('sda', existingData[0]?.po_number);

        const generalInfo = generateGeneralInfo(po_number, endToEndId, selectedData ? selectedData[0].STATUS_PO : 'DRAFT');

        let response;

        if(selectedData && duplicateFlag === false) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUOR&column=id&value=${id}`, authToken, branchId);
        } else if (existingData && existingData.length > 0) {
          const ida = existingData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUOR&column=id&value=${ida}  `, authToken, branchId);
        }else{
          response = await InsertDataService.postData(generalInfo, "PUOR", authToken, branchId);
        }

        const getIDforOrderID = await LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=po_number&filterValue=${po_number}&operation=EQUAL`, authToken, branchId);
        const IDforOrderID = getIDforOrderID.data[0].ID;

        console.log('Data posted successfully:', response);
        
        if (response.message === "Update Data Successfully") {
          if(existingData && existingData.length > 0) {
            const poNum = existingData[0].po_number;
            const lookupResponse = await LookupService.fetchLookupData(
              `PURC_FORMPUORD&filterBy=po_number&filterValue=${poNum}&operation=EQUAL`,
              authToken,
              branchId
            );
      
            const ids = lookupResponse.data.map(item => item.ID); // Dapatkan semua ID dari respons array
            console.log('IDs to delete:', ids);
      
            // Delete each item based on fetched IDs
            for (const id of ids) {
              try {
                await DeleteDataService.postData(`column=id&value=${id}`, "PUORD", authToken, branchId);
                console.log('Item deleted successfully:', id);
              } catch (error) {
                console.error('Error deleting item:', id, error);
              }
            }
          }else{
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
          }

          // After deletion, insert updated items
          await postItems(items, IDforOrderID, po_number, fieldsToDelete, authToken, branchId);

          // Show success message and reset form
          messageAlertSwal('Success', response.message, 'success');
        }

        if (response.message === "insert Data Successfully") {
          // Panggil fungsi untuk post item ke puord
          await postItems(items, IDforOrderID, po_number, fieldsToDelete, authToken, branchId)
        }
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
          messageAlertSwal('Success', response.message, 'success');
          // resetForm();
        
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

        const generalInfo = generateGeneralInfo(po_number, endToEndId, 'IN_PROCESS') 

        console.log('Master', generalInfo);

        const poNumber = po_number;


        const check = await LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=PO_NUMBER&filterValue=${poNumber}&operation=EQUAL`, authToken, branchId)
        const datacek = check.data[0];
        console.log('Datasama:', datacek);
          
        let response;

        if(selectedData && duplicateFlag === false) {
          // Edit
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUOR&column=id&value=${id}`, authToken, branchId);
        }else if(datacek){
          // From save to submit
          response = await UpdateDataService.postData(generalInfo, `PUOR&column=id&value=${datacek.ID}`, authToken, branchId);
        }else{
          // Create new
          response = await InsertDataService.postData(generalInfo, "PUOR", authToken, branchId);
        }

        const getIDforOrderID = await LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=po_number&filterValue=${po_number}&operation=EQUAL`, authToken, branchId);
        const IDforOrderID = getIDforOrderID.data[0].ID;

        console.log('Data posted successfully:', response);

        if (response.message === "Update Data Successfully") {

          // Iterate over items array and attempt to delete each item
          if(datacek){
            const poNumber = datacek.po_number;
            const lookupResponse = await LookupService.fetchLookupData(
              `PURC_FORMPUORD&filterBy=po_number&filterValue=${poNumber}&operation=EQUAL`,
              authToken,
              branchId
            );
            const ids = lookupResponse.data.map(item => item.ID);
            console.log('iddtodelete', ids);

            for(const id of ids){
              try {
                await DeleteDataService.postData(`column=id&value=${id}`, "PUORD", authToken, branchId);
                console.log('Item deleted successfully:', id);
              } catch (error) {
                console.error('Error deleting item:', id, error);
              }
            }
          }else{
            for (const item of items) {
              if (item.ID) {
                const itemId = item.ID;
                try {
                  const  itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUORD", authToken, branchId);
                    console.log('Item deleted successfully:', itemResponse);
                } catch (error) {
                    console.error('Error deleting item:', itemId, error);
                }
              } else {
                console.log('No ID found, skipping delete for this item:', item);
              }
            }
          }

          // After deletion, insert updated items
          for (const item of items) {
            // Exclude rwnum, ID, status, and id_trx fields
            const { rwnum, ID, status, id_trx, ...rest } = item;

            const updatedItem = {
              ...rest,
              po_number,
              order_id: IDforOrderID,
            };

            fieldsToDelete.forEach(field => delete updatedItem[field]);

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
              console.log('Item inserted successfully:', itemResponse);
            } catch (error) {
              console.error('Error inserting item:', updatedItem, error);
            }

            if(docRef === 'purchaseRequest' || selectedData){
              const fetchCheckIsUsed = await LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=pr_number&filterValue=${item.doc_reff_no}&operation=EQUAL`, authToken, branchId);
              const checkIsUsedData = fetchCheckIsUsed.data;
              console.log('fetchedisuseddata', checkIsUsedData);

              const dels = fetchCheckIsUsed.data.map(item => item.ID);
              console.log('idtoChange', dels);  

              for (const del of dels) {
                try {
                  // Now, find the corresponding stored item to update/insert
                  const storedItem = fetchedPRDetail.find(item => item.ID === del);
                  
                  if (storedItem) {

                    // Delete the item first
                    await DeleteDataService.postData(`column=id&value=${del}`, "PUREQD", authToken, branchId);
                    console.log('Item deleted successfully:', del);

                    const { rwnum, ID, status, id_trx, ...stored } = storedItem;

                    console.log('storeditem', storedItem);
                    console.log('itemsa', item);

                    let statusDetail;
                    let ponumb;

                    const usedDataEntry = checkIsUsedData.find(entry => entry.ID === del);
                    console.log('usedDataEn', usedDataEntry)
                    if (usedDataEntry) {
                      if (usedDataEntry.status_detail === "USED") {
                          ponumb = usedDataEntry.order_id; 
                      }
                    }
                    
                    for (const item of fetchedPRDetail) { 
                      if(storedItem.status_detail === "USED"){
                        statusDetail = "USED";
                      };
                      if (storedItem.ID === item.ID) {
                        statusDetail = "USED";
                        ponumb = IDforOrderID;
                        break;
                      }
                    }
              
                    const updatedStoredItem = {
                      ...stored,
                      status_detail: statusDetail,
                      order_id: ponumb,
                    };
                    console.log('updatedstatus', updatedStoredItem.status_detail);
              
                    // Remove unwanted fields
                    storedToDelete.forEach(field => delete updatedStoredItem[field]);
              
                    // Insert the updated stored item
                    const storedItemResponse = await InsertDataService.postData(updatedStoredItem, "PUREQD", authToken, branchId);
                    console.log('Stored item posted successfully:', storedItemResponse);
                    
                  } else {
                    console.log('No corresponding stored item found for ID:', del);
                  }
              
                } catch (error) {
                  console.error('Error processing item:', del, error);
                }
              }

              if(docRef === 'purchaseRequest') {
                // Update Status PR Detail 
                const getPRList = await LookupService.fetchLookupData(`PURC_FORMPUREQ&filterBy=pr_number&filterValue=${item.doc_reff_no}&operation=EQUAL`, authToken, branchId);
                const prID = getPRList.data[0].ID;

                const checkNullStatus = await LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=pr_number&filterValue=${item.pr_number}&operation=EQUAL`, authToken, branchId);
                const nullStatusExists = checkNullStatus.data.some(entry => entry.status_detail === null);

                // Update Status
                const updatePrStatusData = {
                  status_request: nullStatusExists ? "PARTIAL_REQUESTED" : "REQUESTED",
                }

                const updatePRStatus = await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${prID}&branchId=${branchId}`, updatePrStatusData, {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  }
                });
                await updatePRStatus;
              }
            }
          }

          //Set status workflow VERIFIED
          LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
          .then(response => {
            const data = response.data[0];
            console.log('Data:', data);

            const requestData = {
              idTrx: data.ID, 
              status: "PENDING", 
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

          // Show success message and reset form
          messageAlertSwal('Success', response.message, 'success');
          setIsSubmited(true);
        }
      
        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const { rwnum, ID, status, id_trx, id_upload, ...rest } = item;
            const updatedItem = {
              ...rest,
              po_number,
              order_id: IDforOrderID,
              tax_ppn: item.tax_ppn,
              type_of_vat: item.type_of_vat
            };

            fieldsToDelete.forEach(field => delete updatedItem[field]);

            const itemResponse = await InsertDataService.postData(updatedItem, "PUORD", authToken, branchId);
            console.log('Item posted successfully:', itemResponse);
            
            if(docRef === 'purchaseRequest'){
              const fetchCheckIsUsed = await LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=pr_number&filterValue=${item.pr_number}&operation=EQUAL`, authToken, branchId);
              const checkIsUsedData = fetchCheckIsUsed.data;
              console.log('fetchedisuseddata', checkIsUsedData);

              const dels = fetchCheckIsUsed.data.map(item => item.ID);
              console.log('idtoChange', dels);

              for (const del of dels) {
                try {
                  // Now, find the corresponding stored item to update/insert
                  const storedItem = fetchedPRDetail.find(item => item.ID === del);
                  
                  if (storedItem) {

                    // Delete the item first
                    await DeleteDataService.postData(`column=id&value=${del}`, "PUREQD", authToken, branchId);
                    console.log('Item deleted successfully:', del);

                    const { rwnum, ID, status, id_trx, ...stored } = storedItem;

                    console.log('storeditem', storedItem);
                    console.log('itemsa', item);

                    let statusDetail;
                    let ponumb;

                    const usedDataEntry = checkIsUsedData.find(entry => entry.ID === del);

                    if (usedDataEntry) {
                        // If the status_detail is "USED", use the po_number from the used data
                        if (usedDataEntry.status_detail === "USED") {
                            ponumb = usedDataEntry.order_id; // Set ponumb from checkIsUsedData
                        }
                    }

                    for (const item of items) { 
                      if(storedItem.status_detail === "USED"){
                        statusDetail = "USED";
                      };
                      if (storedItem.ID === item.ID) {
                        statusDetail = "USED";
                        ponumb = IDforOrderID;
                        break; 
                      }
                    }
                    console.log('ponums',ponumb);

              
                    const updatedStoredItem = {
                      ...stored,
                      status_detail: statusDetail,
                      order_id: ponumb,
                    };
                    console.log('updatedstatus', updatedStoredItem.status_detail);
              
                    // Remove unwanted fields
                    storedToDelete.forEach(field => delete updatedStoredItem[field]);
              
                    // Insert the updated stored item
                    const storedItemResponse = await InsertDataService.postData(updatedStoredItem, "PUREQD", authToken, branchId);
                    console.log('Stored item posted successfully:', storedItemResponse);
                    
                  } else {
                    console.log('No corresponding stored item found for ID:', del);
                  }
              
                } catch (error) {
                  console.error('Error processing item:', del, error);
                }
              }

              // Update Status PR Detail 
              const getPRList = await LookupService.fetchLookupData(`PURC_FORMPUREQ&filterBy=pr_number&filterValue=${item.doc_reff_no}&operation=EQUAL`, authToken, branchId);
              const prID = getPRList.data[0].ID;
              console.log('PRid', prID);

              // Check if all of the status detail is used
              const checkNullStatus = await LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=pr_number&filterValue=${item.pr_number}&operation=EQUAL`, authToken, branchId);
              const nullStatusExists = checkNullStatus.data.some(entry => entry.status_detail === null);

              // Update PR Status
              const updatePrStatusData = {
                status_request: nullStatusExists ? "PARTIAL_REQUESTED" : "REQUESTED",
              }
                const updatePRStatus = await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${prID}&branchId=${branchId}`, updatePrStatusData, {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  }
                });
                await updatePRStatus;
              }
          }

          //Set status workflow VERIFIED
          LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
          .then(response => {
            const data = response.data[0];
            console.log('Data:', data);

            const requestData = {
              idTrx: data.ID, 
              status: "PENDING", 
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

          messageAlertSwal('Success', response.message, 'success');
          setIsSubmited(true);
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
    let requestCode;
    if(docRef === 'purchaseRequest'){
      requestCode = 'PUREQD';
    }else{
      requestCode = 'PUORD';
    }
    const request = {
      idTrx: endtoendid,
      code: requestCode,
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
  // const dynamicFormWidth = (value, index) => {
  //   const contentLength = value.length;
  //   const newWidth = Math.max(100, (contentLength + 5) * 8); 
  //   console.log('content', contentLength);
    
  //   setInputWidth((prevWidth) => {
  //     const newWidths = [...prevWidth];
  //     newWidths[index] = newWidth;
  //     return newWidths;
  //   });
  // }



  // Disabling used PR Number Logic
  const usedOptions = new Set(items.map(item => item.doc_reff_no)); 
  const optionsWithDisabled = PROptions.map(option => ({
    ...option,
    isDisabled: usedOptions.has(option.value) 
  }));

  const detailFormStyle = () => {
    return{
      border: 'none',
      background: 'transparent',
      color: '#000'
    }
  }

  const SubmitAndSaveButton = () => {
    if(isSubmited === true) {
      return(
        <Button
        onClick={resetForm}
        >
          <i className="fas fa-plus"></i> Add New
        </Button>
      )
    } else {
      return(
        <>
          <Button variant="primary" className='mr-2' onClick={handleSave}>
            <i className="fas fa-save"></i> {
              isEditingPurchaseOrder ? 'save Changes' : 'Save'
            }
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            <i className="fas fa-check"></i> {
              isEditingPurchaseOrder ? 'Submit Changes' : 'Submit'
            }
          </Button>
        </>
      )
    }
  }

  return (
    <Fragment>

      {isEditingPurchaseOrder || duplicateFlag ? 
        <></>
        :
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1>Add Purchase Order</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item">
                                <a href="/">Home</a>
                            </li>
                            <li className="breadcrumb-item active">
                                Add Purchase Order
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
      }

      <section className="content">

        <Row>
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>General Information</Card.Title>
                <div className="ml-auto">
                  {isEditingPurchaseOrder || duplicateFlag ?
                    <Button
                      variant="secondary"
                      className="mr-2"
                      onClick={() => {
                        handleRefresh();
                        if(duplicateFlag){
                          setIsAddingNewDuplicatePurchaseOrder(false);
                          setDuplicateFlag(false);
                        }else{
                          setIsAddingNewPurchaseOrder(false);
                        }
                      }}
                    >
                      <i className="fas fa-arrow-left"></i> Back
                    </Button>
                    :
                    <></>
                  }
                  
                    {SubmitAndSaveButton()}
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
                            setItems([])
                            setFetchedPRDetail([])
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
                          value={createdBy.userName}
                          onChange={(e) => setCreatedBy(e.target.id)}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formOrderDate">
                        <Form.Label>Order Date</Form.Label>
                        <div className='input-group'>
                          <DatePicker
                            selected={order_date}
                            onChange={(date) => setOrderDate(date)}
                            dateFormat="dd-MM-yyyy"
                            className='form-control'
                            placeholder='Select order date'
                          />
                          <FaCalendar style={{marginLeft:"-30px", zIndex: '2'}} className='my-auto'/>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId='formVendor'>
                        <Form.Label>Vendor</Form.Label>
                        <Select
                          id='vendor'
                          value={selectedVendor}
                          options={vendorOptions}
                          // onChange={handleVendorChange}
                          onChange={(selectedOption) => {
                            if(docRef === 'purchaseRequest') {
                              lookupPR(selectedCurrency ? selectedCurrency.value : '', selectedOption ? selectedOption.value : '' )
                            }
                            handleVendorChange(selectedOption)
                          }}
                          placeholder = "Vendor..."
                          isClearable
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
                          placeholder="To Address..."
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

                    <Col md={6}>
                      <Form.Group controlId='formCurrency'>
                        <Form.Label>Currency</Form.Label>
                        <Select
                          id='currency'
                          value={selectedCurrency}
                          options={currencyOptions}
                          onChange={(selectedOption) => {
                            lookupPR(selectedOption.id)
                            // handlePRChange(index, selectedOption ? selectedOption.id : 61)
                            handleOptionChange(setSelectedCurrency, setCurrency, selectedOption)
                            setCurrencyId(selectedOption ? selectedOption.id : '')
                            setItems([])
                            setFetchedPRDetail([])
                          }}
                          placeholder = "Currency..."
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
                      <>
                        <div
                          className="table-responsive pb-5"
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
                                <th>Product</th>
                                <th>Product Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Discount</th>
                                <th>Total Price</th>
                                <th>Type of VAT</th>
                                <th>Tax PPN Type</th>
                                <th>Tax PPN Rate</th>
                                <th>Tax Base</th>   
                                <th>Requestor</th>
                                <th>Project</th>
                                <th>Project Contract Number</th>
                                <th>Customer</th>
                                <th>Department</th>
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
                                          value={allPROptions.find(option => option.value === item.doc_reff_no)}
                                          options={optionsWithDisabled}
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, 'doc_reff_no', selectedOption ? selectedOption.value : null);
                                            handlePRChange(index, currency_id || 61, selectedOption)
                                          }} 
                                          isClearable
                                          required
                                          placeholder='Purchase Request...'
                                          styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                ...detailFormStyle()
                                            }),
                                          }}
                                        />
                                        :
                                        docRef === 'internalMemo' ?
                                          <Form.Control
                                            value={item.doc_reff_no}
                                            onChange={(e) => {
                                              handleItemChange(index, 'doc_reff_no', e.target.value);
                                            }}
                                            placeholder='internal Memo...'
                                            style={detailFormStyle()}
                                          />
                                        :
                                        docRef === 'customerContract' ?
                                          <Form.Control
                                            value={item.doc_reff_no}
                                            onChange={(e)=>{
                                              handleItemChange(index, 'doc_reff_no', e.target.value);
                                            }}
                                            placeholder='Customer Contract...'
                                            style={detailFormStyle()}
                                          />
                                          :
                                          <div className='mt-1' style={{fontSize: '0.7rem', color:'red', fontStyle:'italic'}}>*Choose Doc Reference first in general information</div>
                                      }
                                    </td>

                                    <td>
                                        { isAddFile ? 
                                        <div className='d-flex'>
                                          <Form.Control
                                            type='file'
                                            placeholder='Upload Document'
                                            onChange={(e)=> handleItemChange(index, 'file', e)}
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
                                                getFileDocument(item.id_upload)
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
                                          value={
                                            items[index].product_id ? 
                                              productOptions.find(option => option.id === items[index].product_id) 
                                            : 
                                              null
                                          }
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, 'product_id', selectedOption ? selectedOption.id : null);
                                          }}
                                          options={productOptions}
                                          isClearable
                                          placeholder="Select Product..."
                                          styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                ...detailFormStyle()
                                            }),
                                          }}
                                      />                                     
                                    </td>
                                    
                                    <td>
                                      <Form.Control
                                        id='panjangdinamis'
                                        type="text"
                                        value={item.product_note}
                                        onChange={(e) => handleItemChange(index, 'product_note', e.target.value)}
                                        style={detailFormStyle()}
                                        placeholder='Product Description...'
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => {
                                          handleItemChange(index, 'quantity', Math.max(0, parseFloat(e.target.value) || 1))
                                          // dynamicFormWidth(e.target.value, index)
                                        }}
                                        style={{
                                          // width: `${inputWidth[index] || 75}px`,
                                          ...detailFormStyle(),
                                          width: '75px',
                                        }}
                                      />
                                    </td>
                                    
                                    <td>
                                      {currency === 'IDR' ?
                                        <Form.Control
                                          id='panjangdinamis'
                                          className='text-right'
                                          type="text"
                                          value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString('en-US') : 0}
                                          onChange={(e) => {
                                            const newPrice = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                                            handleItemChange(index, 'unit_price',  newPrice);
                                          }}
                                          style={detailFormStyle()}
                                        />
                                      : 
                                        <Form.Control
                                          id='panjangdinamis'
                                          className="text-right"
                                          type="text"
                                          value={
                                            item.unit_price !== undefined && item.unit_price !== null
                                              ? item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2, useGrouping: false })
                                              : '0'
                                          }
                                          onChange={(e) => {
                                            const input = e.target.value;
                                            const sanitizedInput = input.replace(/[^0-9.]/g, '');
                                            handleItemChange(index, 'unit_price', sanitizedInput);
                                          }}
                                          onBlur={() => {
                                            const price = parseFloat(item.unit_price) || 0;
                                            handleItemChange(index, 'unit_price', price);
                                          }}
                                          style={detailFormStyle()}
                                        />
                                      }
                                    </td>

                                    <td>
                                      {currency === 'IDR' ? 
                                        <FormControl
                                          id='panjangdinamis'
                                          className='text-right'  
                                          type="text"
                                          value={item.discount !== undefined && item.discount !== null ? item.discount.toLocaleString('en-US') : 0}
                                          onChange={(e) => {
                                            const newDiscount = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                                            handleItemChange(index, 'discount', newDiscount)
                                          }}
                                          style={detailFormStyle()}
                                        />
                                      
                                      :
                                        <Form.Control
                                          id='panjangdinamis'
                                          className="text-right"
                                          type="text"
                                          value={
                                            item.discount !== undefined && item.discount !== null
                                              ? item.discount.toLocaleString('en-US', { minimumFractionDigits: 2, useGrouping: false })
                                              : 0
                                          }
                                          onChange={(e) => {
                                            const input = e.target.value;
                                            const sanitizedInput = input.replace(/[^0-9.]/g, '');
                                            handleItemChange(index, 'discount', sanitizedInput || 0);
                                          }}
                                          onBlur={() => {
                                            const price = parseFloat(item.discount) || 0;
                                            handleItemChange(index, 'discount', price);
                                          }}
                                          style={detailFormStyle()}
                                        />
                                      }
                                    </td>

                                    <td>
                                      <div className='mt-2'>
                                        {item.total_price.toLocaleString('en-US', { style: 'currency', currency: currency || 'USD'})}
                                      </div>
                                    </td>
                                  
                                    <td>
                                      <Form.Select
                                        id='panjangdinamis'
                                        value={
                                          items[index].type_of_vat || ''
                                        }
                                        style={detailFormStyle()}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'type_of_vat', selectedOption.target.value);
                                        }}
                                      >
                                        <option value="">Select VAT</option>
                                        {/* Add more options here */}
                                        <option value="include">Include</option>
                                        <option value="exclude">Exclude</option>
                                        <option value="nonPPN">Non PPN</option>
                                        { currency !== 'IDR' ?
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
                                            PPNRoyaltyOptions.find(option => option.id === item.tax_ppn_id) || null
                                          :
                                            items[index].type_of_vat === 'include' ? 
                                              taxTypeIncludeOptions.find(option => option.id === item.tax_ppn_id) || null
                                              :
                                              taxTypeExcludeOptions.find(option => option.id === item.tax_ppn_id) || null
                                        }
                                        options={items[index].type_of_vat === 'PPNRoyalty' ? PPNRoyaltyOptions : items[index].type_of_vat === 'include' ? taxTypeIncludeOptions : taxTypeExcludeOptions}
                                        placeholder="Select Tax Type"
                                        isClearable
                                        onChange={(selectedOption) => {
                                          if (selectedOption) {
                                            handleItemChange(index, 'tax_ppn_rate', parseFloat(selectedOption.RATE));
                                          } else {
                                            handleItemChange(index, 'tax_ppn_rate', 0);
                                          }
                                          handleItemChange(index, 'tax_ppn_id', selectedOption ? selectedOption.id : ''  );
                                        }}
                                        isDisabled={items[index].type_of_vat === 'nonPPN' || items[index].type_of_vat === ''}
                                        styles={{
                                          control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle()
                                          }),
                                        }}  
                                      />
                                    </td>
                                    
                                    <td>
                                      <Form.Control
                                        type='text'
                                        value={item.tax_ppn_rate || 0 + '%'}
                                        disabled
                                        style={{...detailFormStyle(), width: '80px'}}
                                      />
                                    </td>

                                    <td className=''>
                                      {currency === 'IDR' ?
                                        <Form.Control
                                          type='text'
                                          disabled
                                          style={{
                                            ...detailFormStyle(),
                                            textAlign: 'right',
                                            marginLeft: 'auto',  
                                            display: 'flex',
                                          }}
                                          value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base.toLocaleString('en-US') : 0}
                                          onChange={(e) => {
                                            const newTaxBase = Math.max(0, parseFloat(e.target.value.replace(/[^\d.-]/g, ''))) || 0;
                                            handleItemChange(index, 'tax_base', Math.max(0, newTaxBase));
                                          }}
                                        />
                                      :
                                        <Form.Control
                                          type='text'
                                          disabled
                                          style={{
                                            ...detailFormStyle(),
                                            textAlign: 'right',
                                            display: 'flex',
                                          }}
                                          value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base : 0}
                                          onChange={(e) => {
                                            handleItemChange(index, 'tax_base', Math.max(0, parseFloat(e.target.value) || 0))
                                          }}
                                        />
                                      }
                                    </td>

                                    <td>
                                      <Form.Control
                                        id='panjangdinamis'
                                        placeholder='Requestor...'
                                        value={
                                          createdBy.userName
                                        }
                                        onChange={(e) => {
                                          handleItemChange(index, 'requestor_id', e.target.id)
                                        }}
                                        style={detailFormStyle()}
                                        readOnly
                                      />
                                    </td>

                                    <td>
                                      <Select
                                        id="project"
                                        value={
                                          items[index].project_id ?
                                            projectOptions.find(option => option.id === item.project_id)
                                          :
                                            null
                                        }
                                        options={projectOptions}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'project_id', selectedOption ? selectedOption.id : null);
                                          if(selectedOption){
                                            handleItemChange(index, 'project_contract_number', selectedOption.project_contract_number);
                                            handleItemChange(index, 'customer_id', selectedOption.id);
                                          }else{
                                            handleItemChange(index, "project_contract_number", "");
                                            handleItemChange(index, "customer_id", ""); 
                                          }
                                        }}
                                        placeholder="Project..."
                                        isClearable 
                                        required
                                        styles={{
                                          control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle()
                                          }),
                                        }}
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
                                          if(selectedOption){
                                            handleItemChange(index, 'customer', selectedOption.customer);
                                          }else{
                                            handleItemChange(index, "customer", ""); 
                                          }
                                        }}
                                        placeholder='Project Contract Number...'
                                        required
                                        styles={{
                                          control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle()
                                          }),
                                        }}
                                      />
                                    </td>

                                    <td>
                                      <Select
                                        id='customer'
                                        value={
                                          items[index].customer_id ?
                                            customerOptions.find(option => option.id === item.customer_id)
                                          : 
                                            null
                                        }
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'customer_id', selectedOption ? selectedOption.id : null)
                                        }}
                                        options={customerOptions}
                                        placeholder='Customer...'
                                        isClearable
                                        required
                                        styles={{
                                          control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle()
                                          }),
                                        }}
                                      />
                                    </td>

                                    <td>
                                      <Select
                                        id='department'
                                        value={
                                          items[index].department_id ?
                                            departementOptions.find(option => option.id === items[index].department_id)
                                          :
                                            null
                                        }
                                        onChange={(selectedOption)  => {
                                          handleItemChange(index, 'department_id', selectedOption ? selectedOption.id : null)
                                        }}
                                        options={departementOptions}
                                        placeholder='Department...'
                                        isClearable
                                        required
                                        styles={{
                                          control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle()
                                          }),
                                        }}
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
                          </table>
                          <div className='pb-4'>
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
                              onClick={handleDeleteLast}
                              disabled={items.length === 0}
                            >
                              <i className="fas fa-trash"></i> Delete 
                            </Button>
                          </div>
                          {provided.placeholder}
                        </div>
                        <table className='table table-bordered' >
                          <tbody>
                            <tr className='text-right'>
                              <td colSpan="16">Subtotal:</td>
                              <td className='text-right col-3'>
                                <strong>
                                  {items.length > 0 
                                    ? calculateTotalAmount(items[0].currency).subTotal.toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: currency || 'IDR',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0 
                                    })
                                  : 
                                    new Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: currency || 'IDR', // Use 'currency' or fall back to 'IDR'
                                      minimumFractionDigits: 0, // No decimal places
                                      maximumFractionDigits: 0 
                                    }).format(0)
                                  }
                                </strong>
                              </td>
                            </tr>

                            <tr className='text-right'>
                              <td colSpan="16">Total Discount:</td>
                              <td className='text-right col-3'>
                                <strong>
                                  {items.length > 0 
                                    ? calculateTotalAmount(items[0].currency).totalDiscount.toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: currency || 'IDR',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0 
                                    })
                                  : 
                                    new Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: currency || 'IDR', // Use 'currency' or fall back to 'IDR'
                                      minimumFractionDigits: 0, // No decimal places
                                      maximumFractionDigits: 0 
                                    }).format(0)
                                  }
                                </strong>
                              </td>
                            </tr>

                            <tr className='text-right'>
                              <td colSpan="16">Total PPN:</td>
                              <td>
                                <Form.Control
                                  className='text-right'
                                  type='text'
                                  value={
                                    calculateTotalAmount().totalPPNAmount.toLocaleString('en-US') || 0
                                  }
                                  onChange={
                                    (e) => {
                                      const newItems = [...items];
                                      const totalPPNAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                                      newItems.forEach((item)=>{
                                        item.tax_ppn_amount= totalPPNAmount/newItems.length;
                                      });
                                  setItems(newItems); 
                                  }}
                                  style={{
                                    textAlign: 'right',
                                    marginLeft: 'auto',  
                                    display: 'flex',
                                  }}
                                />
                              </td>
                            </tr>

                            <tr className="text-right">
                              <td colSpan="16" >Total Amount:</td>
                              <td>
                                <strong>
                                  {items.length > 0 ?
                                    calculateTotalAmount(items[0].currency).totalAmount.toLocaleString('en-US', { 
                                      style: 'currency', 
                                      currency: currency || 'IDR' ,
                                      minimumFractionDigits: 0,  // No decimal places
                                      maximumFractionDigits: 0 
                                    })
                                  :
                                  new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: currency || 'IDR', // Use 'currency' or fall back to 'IDR'
                                    minimumFractionDigits: 0, // No decimal places
                                    maximumFractionDigits: 0 
                                    }).format(0)
                                  } 
                                </strong>
                              </td>
                            </tr>

                          </tbody>
                        </table>
                      </>
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
            {isEditingPurchaseOrder?
              <Button variant="secondary" className="mr-2"
              onClick={() => {
                handleRefresh();
                if(duplicateFlag){
                  setIsAddingNewDuplicatePurchaseOrder(false);
                  setDuplicateFlag(false);
                }else{
                  setIsAddingNewPurchaseOrder(false);
                }
              }}
              >
                <i className="fas fa-arrow-left"></i> Back
              </Button> 
              :
              <></>
            }
            {SubmitAndSaveButton()}
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