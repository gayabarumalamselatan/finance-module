import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Card, CardBody, CardHeader } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from "../service/InsertDataService";
import { getBranch, getToken } from "../config/Constant";
import { GENERATED_NUMBER } from "../config/ConfigUrl";
import { generateUniqueId } from "../service/GeneratedId";
import Select from "react-select";
import LookupParamService from "../service/LookupParamService";
import LookupService from "../service/LookupService";
import CreatableSelect from "react-select/creatable";
import axios from "axios";


const AddPettyCash = ({ setIsAddingNewPettyCash, handleRefresh, index, item, selectedData }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem("userId");

  // general info
  const [payment_source, setPaymentSource] = useState("");
  const [paid_to, setPaidTo] = useState("");
  const [doc_reff, setDocReff] = useState("");
  const [doc_reff_no, setDocReffNo] = useState("");
  const [voucher_number, setVoucherNumber] = useState("")
  const [status, setStatus] = useState("DRAFT");
  const [voucher_date, setVoucherDate] = useState("");
  const [total_amount, setTotalAmount] = useState("");
  const [exchange_rate, setExchangeRate] = useState("");

  // detail item
  const [coa, setCoa] = useState("");
  const [description, setDescription] = useState("");
  const [invoice_number, setInvoiceNumber] = useState("");
  // const [total_amount, setTotalAmount] = useState("");
  const [db_cr, setDbCr] = useState("");
  const [type_of_vat, setTypeOfVat] = useState("");
  const [tax_ppn, setTax_ppn] = useState("");
  const [tax_ppn_amount, setTaxPpnAmount] = useState("");
  const [tax_ppn_rate, setTaxPpn_rate] = useState("");
  const [tax_pph_2, setTaxPph2] = useState("");
  const [tax_pph_rate_2, setTaxPphRate2] = useState("");
  const [tax_pph_amount,setTaxPphAmount] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState("");
  const [amount_paid, setAmountPaid] = useState("");
  const [tax_pph, setTaxPph] = useState("");
  const [tax_pph_rate, setTaxPphRate] =useState("");
  const [amount, setAmount] =useState("");
  

  const [purchase_invoice_number, setPurchaseInvoiceNumber] =useState("");
  const [amount_in_idr, setAmountInIdr] =useState("");
  const [emlpoyee, setEmployee] =useState("");
  const [customer, setCustomer] =useState("");
  const [purchase_invoice_date, setPurchaseInvoiceDate] =useState("");
  const [vendor, setVendor] =useState("");
  const [project_contract_number, setProjectContractNumber] =useState("");
  const [allvendoroptions, setAllVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [prNumberOptions, setPrNumberOptions] = useState([]);
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [selectedPoNumber, setSelectedPoNumber] = useState(null);
  const [poNumberOptions, setPoNumberOptions] = useState([]);
  const [doc_reference, setDocReference] = useState("");
  const [selectedbothvendor, setSelectedBothVendor] = useState([]);
  const [ID, setID] = useState("");
  const [title, setTitle] = useState("");
  const [endToEnd, setEndToEnd] = useState("");
  const [vatType, setVatType] = useState(null);
  const [idPr, setIdPr] = useState("");
  const [idPo, setIdPo] = useState("");
  const [tax_invoice_number, setTaxInvoiceNumber] = useState("");
  const [selectedExchangeRate, setSelectedExchangeRate] = useState("");
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [tax_pph_type_option, setTax_Pph_Type_Option] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [selectedTaxPphType, setSelectedTaxPphType] = useState(null);
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState([]);

 
  





  // const [pph1, setPph1] = useState("");
  // const [totalAmountPph1, setTotalAmountPph1] = useState("");
  // const [pph2, setPph2] = useState("");
  // const [totalAmountPph2, setTotalAmountPph2] = useState("");
  // const [totalAmountPaid, setTotalAmountPaid] = useState("");
  // const [project, setProject] = useState("");
  // const [department, setDepartment] = useState("");
  // const [taxCode, setTaxCode] = useState("");
  // const [totalAmountDpp, setTotalAmountDpp] = useState("");
  // const [taxAmount, setTaxAmount] = useState("");

  const [coaOptions, setCoaOptions] = useState([]);
  const [dr_crOptions, setDrCrOptions] = useState([]);
  const [typeOfVat_options, setTypeOfVatOptions] = useState([]);
  const [pph1_options, setPph1Options] = useState([]);
  const [pph2_options, setPph2Options] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  // const [department_options, setDepartmentOptions] = useState([]);
  const [doc_reffOptions, setDocRefftOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [exchangerateOptions, setExchangeRateOptions] = useState([]);
  
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  // const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrNumber, setSelectedPrNumber] = useState(null);
  const [amountOptions, setAmountOptions] = useState([]);
  const [selectedCoa, setSelectedCoa] = useState(null);
  
  const authToken = headers;

  useEffect(() => {
    const generateInitialVoucherNumber = async () => {
      const generatedVoucherNumber = await generateVoucherNumber("DRAFT_VOUC"); // Adjust the code as needed

      setVoucherNumber(generatedVoucherNumber);
    };

    generateInitialVoucherNumber();
  }, []);

  
  useEffect(() => {
    // Ambil data lookup untuk currency
    // MSDT_FORMEMPL adalah nama table yang menyimpan data lookup untuk currency
    // authToken dan branchId digunakan untuk mengirimkan token otorisasi dan kode cabang ke server
    // LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
    //   .then((data) => {
    //     console.log("Currency lookup data:", data);

    //     // Transform keys to uppercase directly in the received data
    //     const transformedData = data.data.map((item) =>
    //       Object.keys(item).reduce((acc, key) => {
    //         acc[key.toUpperCase()] = item[key];
    //         return acc;
    //       }, {})
    //     );
    //     //console.log('Transformed data:', transformedData);

    //     const options = transformedData.map((item) => ({
    //       value: item.NAME,
    //       label: item.NAME,
    //     }));
    //     setRequestorOptions(options);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch currency lookup:", error);
    //   });

// buat vendor
LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
      .then((data) => {
        console.log("Vendor lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const allOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));
        setAllVendorOptions(allOptions);

        const bothOptions = transformedData
          .filter((item) => item.ENTITY_TYPE === "BOTH")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
          }));
        setVendorOptions(bothOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch vendor lookup:", error);
      });

      LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
      .then((data) => {
        console.log("Poduct and Coa lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        const coaOptions = transformedData.map((item) => ({
          value: item.PRODUCT_ACCOUNT,
          label: item.PRODUCT_ACCOUNT,
        }));
        setCoaOptions(coaOptions);
        setProductOptions(options);
        console.log("Product :", options);
        const selectedProductOption = options.find((option) => option.value === selectedData[0].PRODUCT);
        setSelectedProduct(selectedProductOption || null);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    //  buat project, customer , dan COA tp masi ambigu
    LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
          customer: item.CUSTOMER,
        }));

        const optionsCustomer = transformedData.map((item) => ({
          value: item.CUSTOMER,
          label: item.CUSTOMER,
        }));
        setProjectOptions(options);
        setCustomerOptions(optionsCustomer);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // buat vendor
    LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
      .then((data) => {
        console.log("Vendor lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const allOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));
        setAllVendorOptions(allOptions);

        const bothOptions = transformedData
          .filter((item) => item.ENTITY_TYPE === "BOTH")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
          }));
        setVendorOptions(bothOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch vendor lookup:", error);
      });

      // buat department
      LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
      .then((data) => {
        console.log("Department lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));
        setDepartmentOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch payment term lookup:", error);
      });

    // buat payment term
    // LookupParamService.fetchLookupData("MSDT_FORMPYTM", authToken, branchId)
    //   .then((data) => {
    //     console.log("Payment term lookup data:", data);

    //     // Transform keys to uppercase directly in the received data
    //     const transformedData = data.data.map((item) =>
    //       Object.keys(item).reduce((acc, key) => {
    //         acc[key.toUpperCase()] = item[key];
    //         return acc;
    //       }, {})
    //     );
    //     //console.log('Transformed data:', transformedData);

    //     const options = transformedData.map((item) => ({
    //       value: item.NAME,
    //       label: item.NAME,
    //     }));
    //     setPaymentTermOptions(options);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch payment term lookup:", error);
    //   });

    // buat pr number
    LookupParamService.fetchLookupData("PURC_FORMPUREQ", authToken, branchId, { filter: "STATUS != 'DRAFT'" })
      .then((data) => {
        console.log("PR number lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        // Filter out PR numbers that start with "DRAFT"
        const filteredData = transformedData.filter((item) => !item.PR_NUMBER.startsWith("DRAFT"));

        const options = filteredData.map((item) => ({
          value: item.PR_NUMBER,
          label: item.PR_NUMBER,
          project: item.PROJECT,
          id: item.ID,
          totalAmount: item.TOTAL_AMOUNT,
          currency: item.CURRENCY,
          quantity: item.QUANTITY,
          description: item.DESCRIPTION,
        }));
        setPrNumberOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch PR number lookup:", error);
      });

    // PO NUMBER
    LookupParamService.fetchLookupData("PURC_FORMPUOR", authToken, branchId)
      .then((data) => {
        console.log("PO number lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.PO_NUMBER,
          label: item.PO_NUMBER,
          id: item.ID,
          project: item.PROJECT,
          totalAmount: item.TOTAL_AMOUNT,
          // currency: item.CURRENCY, // Add the currency property
          // quantity: item.QUANTITY,
          description: item.DESCRIPTION,
          title: item.TITLE,
        }));
        setPoNumberOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch PO number lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
      .then((data) => {
        // console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.CODE,
          label: item.CODE,
        }));
        setCurrencyOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));
        setProjectOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));
        setProductOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });
      

    LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData
          .filter((item) => item.TAX_TYPE === "PPh")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTax_Pph_Type_Option(options);

        const optionsPpn = transformedData
          .filter((item) => item.TAX_TYPE === "PPN")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTaxPpnTypeOption(optionsPpn);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });
  }, []);

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setDepartment(selectedOption ? selectedOption.value : "");
  };

  const handleProjectChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");
    setProjectContractNumber(selectedOption.project_contract_number);
  };

  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
    setCustomer(selectedOption ? selectedOption.value : "");
  };

  const handleAddItem = () => {
    setItems([...items, { 
      coa:" ",
      description:" ",
      // invoice_number:" ",
      amount:" ",
      db_cr:" ",
      type_of_vat:" ",
      tax_ppn:" ",
      tax_ppn_amount:" ",
      tax_pph:" ",
      tax_pph_rate:" ",
      tax_pph_2:" ",
      tax_pph_amount_2:" ",
      amount_paid:" ",
      tax_pph_rate_2:"",
      project:" ",
      description:"",
      department:" ",
      vendor: '',
      department: '',
      doc_reff_no: '',
      doc_reff:'',
     }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    if (field === "product" || field === "currency") {
      newItems[index][field] = value ? value.value : null;
    } else {
      newItems[index][field] = value;
    }

    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }

    setItems(newItems);
  };

  // const handlePrNumberChange = (index, selectedOption) => {
  //   if (selectedOption) {
  //     // Fetch lookup data based on the selected option
  //     LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
  //       .then((response) => {
  //         const fetchedItems = response.data || [];
  //         console.log("Items fetched:", fetchedItems);

  //         // Fetch product lookup data
  //         LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
  //           .then((productData) => {
  //             console.log("Product lookup data:", productData);

  //             // Transform and map product data to options
  //             const transformedProductData = productData.data.map((item) =>
  //               Object.keys(item).reduce((acc, key) => {
  //                 acc[key.toUpperCase()] = item[key];
  //                 return acc;
  //               }, {})
  //             );

  //             const productOptions = transformedProductData.map((item) => ({
  //               value: item.NAME,
  //               label: item.NAME,
  //             }));

  //             setProductOptions(productOptions); // Set product options to state
              

  //             // Fetch currency lookup data
  //             LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
  //               .then((currencyData) => {
  //                 console.log("Currency lookup data:", currencyData);

  //                 // Transform and map currency data to options
  //                 const transformedCurrencyData = currencyData.data.map((item) =>
  //                   Object.keys(item).reduce((acc, key) => {
  //                     acc[key.toUpperCase()] = item[key];
  //                     return acc;
  //                   }, {})
  //                 );

  //                 const currencyOptions = transformedCurrencyData.map((item) => ({
  //                   value: item.CODE,
  //                   label: item.CODE,
  //                 }));

  //                 setCurrencyOptions(currencyOptions); // Set currency options to state

  //                 LookupParamService.fetchLookupData("PURC_FORMPUREQ", authToken, branchId)
  //                 .then((descriptionData) => {
  //                   console.log("Descrription lookup data:", descriptionData);
      
  //                   // Transform and map product data to options
  //                   const transformedDescriptionData = descriptionData.data.map((item) =>
  //                     Object.keys(item).reduce((acc, key) => {
  //                       acc[key.toUpperCase()] = item[key];
  //                       return acc;
  //                     }, {})
  //                   );
      
  //                   const descriptionOptions = transformedDescriptionData.map((item) => ({
  //                     value: item.PR_NUMBER,
  //                     description: item.DESCRIPTION,
  //                   }));
      
  //                   setDescriptionOptions(descriptionOptions);

  //                 const newItems = [...items];
  //                 // Update fetched items with selected options
  //                 const updatedFetchedItems = fetchedItems.map((item) => {
  //                   return {
  //                     ...item,
  //                     doc_reff_no: item.pr_number,
  //                     selectedProduct: productOptions.find((option) => option.value === item.product),
  //                     selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
  //                     selectedProject: projectOptions.find((option) => option.value === item.project),
  //                     selectedDepartement: departementOptions.find((option) => option.value === item.departement),
  //                     selectedCustomer: customerOptions.find((option) => option.value === item.customer),
  //                     description: descriptionOptions.find((desc) => desc.value === item.pr_number)?.description || "",
  //                     selectedCoa: coaOptions.find((option) => option.value === item.coa),
  //                   };
  //                 });

  //                 updatedFetchedItems.forEach((fetchedItem, i) => {
  //                   // Either update the existing index or add new items for each fetched object
  //                   newItems[index + i] = {
  //                     ...newItems[index + i],
  //                     ...fetchedItem,
  //                   };
  //                 });

  //                 // Set the updated items to state
  //                 setItems(newItems);
  //               })

  //               .catch((error) => {
  //                 console.error("Failed to fetch currency lookup:", error);
  //               });
  //           })
  //               .catch((error) => {
  //                 console.error("Failed to fetch currency lookup:", error);
  //               });
  //           })
  //           .catch((error) => {
  //             console.error("Failed to fetch product lookup:", error);
  //           });
  //       })
  //       .catch((error) => {
  //         console.error("Failed to load items:", error);
  //       });
  //   } else {
  //     const newItems = [...items];
  //     newItems[index] = {
  //       ...newItems[index],
  //       product: "",
  //       product_note: "",
  //       quantity: 1,
  //       currency: "IDR",
  //       unit_price: 0,
  //       original_unit_price: 0,
  //       total_price: 0,
  //       type_of_vat: "",
  //       tax_ppn: "",
  //       tax_ppn_rate: 0,
  //       tax_ppn_amount: 0,
  //       tax_base: 0,
  //       discount: 0,
  //       subTotal: 0,
  //       vat_included: false,
  //       new_unit_price: 0,
  //       doc_reff_num: "",
  //       vendor: "",
  //       project: "",
  //       customer: "",
  //       departement: "",
  //       contract_number: "",
  //       description : "",
  //       coa :"",
  //     };
  //     setItems(newItems); // Update state with reset selections
  //   }
  // };

  const handlePrNumberChange = (index, selectedOption) => {
    if (selectedOption) {
      // Fetch lookup data based on the selected option
      LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);
          
          // Fetch product lookup data
          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
            .then((productData) => {
              console.log("Product lookup data:", productData);

              // Transform and map product data to options
              const transformedProductData = productData.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const productOptions = transformedProductData.map((item) => ({
                value: item.NAME,
                label: item.NAME,
              }));

              const coaOptions = transformedProductData.map((item) => ({
                value: item.PRODUCT_ACCOUNT,
                label: item.PRODUCT_ACCOUNT,
              }));

              setCoaOptions(coaOptions);
              setProductOptions(productOptions); // Set product options to state

              // Fetch currency lookup data
              LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                .then((currencyData) => {
                  console.log("Currency lookup data:", currencyData);

                  // Transform and map currency data to options
                  const transformedCurrencyData = currencyData.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                      acc[key.toUpperCase()] = item[key];
                      return acc;
                    }, {})
                  );

                  const currencyOptions = transformedCurrencyData.map((item) => ({
                    value: item.CODE,
                    label: item.CODE,
                  }));

                  setCurrencyOptions(currencyOptions); // Set currency options to state

                  LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId)
                    .then((data) => {
                      console.log("Currency lookup data:", data);

                      // Transform keys to uppercase directly in the received data
                      const transformedData = data.data.map((item) =>
                        Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                        }, {})
                      );
                      //console.log('Transformed data:', transformedData);

                      const options = transformedData
                        .filter((item) => item.TAX_TYPE === "PPh")
                        .map((item) => ({
                          value: item.NAME,
                          label: item.NAME,
                          RATE: item.RATE,
                        }));
                      setTax_Pph_Type_Option(options);

                      const optionsPpn = transformedData
                        .filter((item) => item.TAX_TYPE === "PPN")
                        .map((item) => ({
                          value: item.NAME,
                          label: item.NAME,
                          RATE: item.RATE,
                        }));
                      setTaxPpnTypeOption(optionsPpn);
                    })
                    .catch((error) => {
                      console.error("Failed to fetch currency lookup:", error);
                    });

                    LookupParamService.fetchLookupData("PURC_FORMPUREQ", authToken, branchId)
                    .then((descriptionData) => {
                      console.log("Product lookup data:", descriptionData);

                      // Transform and map product data to options
                      const transformedDescriptionData = descriptionData.data.map((item) =>
                        Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                        }, {})
                      );

                      const descriptionOptions = transformedDescriptionData.map((item) => ({
                        value: item.PR_NUMBER,
                        description: item.DESCRIPTION,
                        total_after_discount: item.TOTAL_AFTER_DISCOUNT,
                       
                      }));

                      setDescriptionOptions(descriptionOptions); // Set product options to state


                  const newItems = [...items];
                  // Update fetched items with selected options
                  const updatedFetchedItems = fetchedItems.map((item) => {
                    return {
                      ...item,
                      doc_reff_no: item.pr_number,
                      // tax_exchange_rate: tax_exchange_rate,
                      // selectedProduct: productOptions.find((option) => option.value === item.product),
                      // selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
                      // selectedVendor: allvendoroptions.find((option) => option.value === item.vendor),
                      selectedProject: projectOptions.find((option) => option.value === item.project),
                      selectedCoa : coaOptions.find((option) => option.value === item.coa),
                      description: descriptionOptions.find((desc) => desc.value === item.pr_number)?.description || "",
                      total_after_discount: descriptionOptions.find((desc) => desc.value === item.pr_number)?.total_after_discount || "",
                      // selectedDepartement: departementOptions.find((option) => option.value === item.departement),
                      // selectedCustomer: customerOptions.find((option) => option.value === item.customer),
                      // selectedContractNumber: contractNumberOption.find((option) => option.value === item.project_contract_number),
                      // selectedTaxPpnType: taxPpnTypeOption.find((option) => option.value === item.tax_ppn),
                    };
                  });

                  updatedFetchedItems.forEach((fetchedItem, i) => {
                    // Either update the existing index or add new items for each fetched object
                    newItems[index + i] = {
                      ...newItems[index + i],
                      ...fetchedItem,
                    };
                  });

                  // Set the updated items to state
                  setItems(newItems);
                })
                
                .catch((error) => {
                  console.error("Failed to fetch D lookup:", error);
                });
            })
                .catch((error) => {
                  console.error("Failed to fetch currency lookup:", error);
                });
            })
            .catch((error) => {
              console.error("Failed to fetch product lookup:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to load items:", error);
        });
    } else {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        product: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        original_unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
        tax_ppn_rate: 0,
        tax_ppn_amount: 0,
        tax_base: 0,
        discount: 0,
        subTotal: 0,
        vat_included: false,
        new_unit_price: 0,
        doc_reff_num: "",
        vendor: "",
        project: "",
        customer: "",
        departement: "",
        contract_number: "",
        coa: "",
        amount: "",
        description: "",
        total_after_discount: 0,
        
      };
      setItems(newItems); // Update state with reset selections
    }
  };

  
  const handlePoNumberChange = (index, selectedOption) => {
    if (selectedOption) {
      // Fetch lookup data based on the selected option
      LookupService.fetchLookupData(`PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);
          
          // Fetch product lookup data
          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
            .then((productData) => {
              console.log("Product lookup data:", productData);

              // Transform and map product data to options
              const transformedProductData = productData.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const productOptions = transformedProductData.map((item) => ({
                value: item.NAME,
                label: item.NAME,
              }));

              const coaOptions = transformedProductData.map((item) => ({
                value: item.PRODUCT_ACCOUNT,
                label: item.PRODUCT_ACCOUNT,
              }));

              setCoaOptions(coaOptions);
              setProductOptions(productOptions); // Set product options to state

              // Fetch currency lookup data
              LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                .then((currencyData) => {
                  console.log("Currency lookup data:", currencyData);

                  // Transform and map currency data to options
                  const transformedCurrencyData = currencyData.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                      acc[key.toUpperCase()] = item[key];
                      return acc;
                    }, {})
                  );

                  const currencyOptions = transformedCurrencyData.map((item) => ({
                    value: item.CODE,
                    label: item.CODE,
                  }));

                  setCurrencyOptions(currencyOptions); // Set currency options to state

                  LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId)
                    .then((data) => {
                      console.log("Currency lookup data:", data);

                      // Transform keys to uppercase directly in the received data
                      const transformedData = data.data.map((item) =>
                        Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                        }, {})
                      );
                      //console.log('Transformed data:', transformedData);

                      const options = transformedData
                        .filter((item) => item.TAX_TYPE === "PPh")
                        .map((item) => ({
                          value: item.NAME,
                          label: item.NAME,
                          RATE: item.RATE,
                        }));
                      setTax_Pph_Type_Option(options);

                      const optionsPpn = transformedData
                        .filter((item) => item.TAX_TYPE === "PPN")
                        .map((item) => ({
                          value: item.NAME,
                          label: item.NAME,
                          RATE: item.RATE,
                        }));
                      setTaxPpnTypeOption(optionsPpn);
                    })
                    .catch((error) => {
                      console.error("Failed to fetch currency lookup:", error);
                    });

                    LookupParamService.fetchLookupData("PURC_FORMPUOR", authToken, branchId)
                    .then((descriptionData) => {
                      console.log("Product lookup data:", descriptionData);

                      // Transform and map product data to options
                      const transformedDescriptionData = descriptionData.data.map((item) =>
                        Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                        }, {})
                      );

                      const descriptionOptions = transformedDescriptionData.map((item) => ({
                        value: item.PO_NUMBER,
                        description: item.DESCRIPTION,
                        total_after_discount: item.TOTAL_AFTER_DISCOUNT,
                       
                      }));

                      setDescriptionOptions(descriptionOptions); // Set product options to state


                  const newItems = [...items];
                  // Update fetched items with selected options
                  const updatedFetchedItems = fetchedItems.map((item) => {
                    return {
                      ...item,
                      doc_reff_no: item.po_number,
                      // tax_exchange_rate: tax_exchange_rate,
                      // selectedProduct: productOptions.find((option) => option.value === item.product),
                      // selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
                      // selectedVendor: allvendoroptions.find((option) => option.value === item.vendor),
                      selectedProject: projectOptions.find((option) => option.value === item.project),
                      selectedCoa : coaOptions.find((option) => option.value === item.coa),
                      description: descriptionOptions.find((desc) => desc.value === item.po_number)?.description || "",
                      total_after_discount: descriptionOptions.find((desc) => desc.value === item.po_number)?.total_after_discount || "",
                      // selectedDepartement: departementOptions.find((option) => option.value === item.departement),
                      // selectedCustomer: customerOptions.find((option) => option.value === item.customer),
                      // selectedContractNumber: contractNumberOption.find((option) => option.value === item.project_contract_number),
                      // selectedTaxPpnType: taxPpnTypeOption.find((option) => option.value === item.tax_ppn),
                    };
                  });

                  updatedFetchedItems.forEach((fetchedItem, i) => {
                    // Either update the existing index or add new items for each fetched object
                    newItems[index + i] = {
                      ...newItems[index + i],
                      ...fetchedItem,
                    };
                  });

                  // Set the updated items to state
                  setItems(newItems);
                })
                
                .catch((error) => {
                  console.error("Failed to fetch D lookup:", error);
                });
            })
                .catch((error) => {
                  console.error("Failed to fetch currency lookup:", error);
                });
            })
            .catch((error) => {
              console.error("Failed to fetch product lookup:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to load items:", error);
        });
    } else {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        product: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        original_unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
        tax_ppn_rate: 0,
        tax_ppn_amount: 0,
        tax_base: 0,
        discount: 0,
        subTotal: 0,
        vat_included: false,
        new_unit_price: 0,
        doc_reff_num: "",
        vendor: "",
        project: "",
        customer: "",
        departement: "",
        contract_number: "",
        coa: "",
        amount: "",
        description: "",
        total_after_discount: 0,
        
      };
      setItems(newItems); // Update state with reset selections
    }
  };
  
  const handleOptionChange = (setter, stateSetter, selectedOption) => {
    setter(selectedOption);
    stateSetter(selectedOption ? selectedOption.value : "");
  }
  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
  };

  const handleBothVendorChange = (selectedOption) => {
    setSelectedBothVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : ""); 
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

  const handleExchangeRateChange = (selectedOption) => {
    setSelectedExchangeRate(selectedOption);
    setExchangeRate(selectedOption ? selectedOption.value : "");
  };

  const resetForm = () => {
    // setPaymentSource("");
    generateVoucherNumber("DRAFT_VOUC")
    setPaidTo("");
    setDocReff("");
    // setDocReffNo("");
    // setVoucherNumber("")
    setStatus("");
    setVoucherDate("");
    setTotalAmount("");

  // detail item
    setDocReffNo("");
    setExchangeRate("");
    setAmountInIdr("");
    // setProduct("");
    // setPurchaseInvoiceNumber("");
    // setEmployee("");
    setCustomer("");
    // setPurchaseInvoiceDate("");
    setVendor("");
    setProjectContractNumber("");
    setCoa("");
    setDescription("");
    setInvoiceNumber(""); 
    setAmount("");
    setDbCr("");
    setTypeOfVat("");
    setTax_ppn("");
    setTaxPpnAmount("");
    // setTaxPpn_rate("");
    // setTaxPph2("");
    // setTaxPphRate2("");
    // setTaxPphAmount2("");
    setDepartment("");
    setProject("");
    setAmountPaid("");
    setItems([]);
    setSelectedItems([]);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Petty Cash?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit It!",
      cancelButtonText: "No, Cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const voucher_number = await generateVoucherNumber();
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const generalInfo = {
           // payment_source,
           paid_to,
           voucher_number,
           doc_reff,
           // doc_reff_no,
           status : " DRAFT",
           voucher_date,
          //  total_amount, 
           exchange_rate,
           description,
        };

        console.log("Master", generalInfo);

        const response = await InsertDataService.postData(generalInfo, "VCPETTY", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              voucher_number,
              invoice_number,
              type_of_vat: item.vat,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
              tax_base: item.total_tax_base,
              tax_ppn_amount: item.total_amount_ppn,
              tax_pph_amount: item.total_amount_pph,
            };
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.description;
            // delete updatedItem.voucher_number;

            const itemResponse = await InsertDataService.postData(updatedItem, "VCPETTYD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };

  const generateVoucherNumber = async (code) => {
    try {
      const response = await axios.get(`${GENERATED_NUMBER}?code=${code}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Ensure this token is valid
        },
      });
      const uniquePrNumber = response.data; // Adjust based on your API response structure
      setVoucherNumber(uniquePrNumber); // Update state, if needed elsewhere in your component
      return uniquePrNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate PR Number:", error.response ? error.response.data : error.message);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the Petty Cash?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit It!",
      cancelButtonText: "No, Cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const voucher_number = await generateVoucherNumber("Voucher");
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const generalInfo = {
          // payment_source,
          paid_to,
          voucher_number,
          doc_reff,
          // doc_reff_no,
          status: " IN_PROSES",
          voucher_date,
          // total_amount, 
          exchange_rate,
          description,
        };

        console.log("Master", generalInfo);

        const response = await InsertDataService.postData(generalInfo, "VCPETTY", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              voucher_number,
              invoice_number,
              type_of_vat: item.vat,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
              tax_base: item.total_tax_base,
              tax_ppn_amount: item.total_amount_ppn,
              tax_pph_amount: item.total_amount_pph,
            };
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.description;
            // delete updatedItem.voucher_number;

            const itemResponse = await InsertDataService.postData(updatedItem, "VCPETTYD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };

  return (
    <Fragment>
      <section className="content">
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>General Info</Card.Title>
                <div className="ml-auto">
 <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => {
                      handleRefresh();
                      setIsAddingNewPettyCash(false);
                    }}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </Button>
                  <Button variant="primary" className="mr-2" onClick={handleSave}>
                    <i className="fas fa-save"></i> Save
                  </Button>
                  <Button variant="primary" className="mr-2" onClick={handleSubmit}>
                    <i className="fas fa-check"></i> Submit
                  </Button>
                </div>
              </Card.Header>

              <Card.Body>
                <Form>
                  <Row>
                  {/* <Col md={6}>
                      <Form.Group controlId="formPaymentSource">
                        <Form.Label>Payment Source</Form.Label>
                        <Form.Control type="text" placeholder="Enter Payment Source" value={payment_source} onChange={(e) => setPaymentSource(e.target.value)} />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                    <Form.Label>Paid To</Form.Label>
                    <Select
                        value={selectedVendor}
                        onChange={handleVendorChange}
                        options={vendorOptions}
                        isClearable
                        placeholder="Select..."
                    />                                
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formDoc_Reff">
                        <Form.Label>Document Reference</Form.Label>
                        <Form.Control as="select" placeholder="Enter Document Reference" value={doc_reff} onChange={(e) => setDocReff(e.target.value)}>
                          <option value="">Select Document Reference</option>
                          <option value="purchaseRequest">Purchase Request</option>
                          <option value="purchaseOrder">Purchase Order</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    {/* {doc_reff === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formPrNumber">
                          <Form.Label>Purchase Request</Form.Label>
                          <Select value={selectedPrNumber} onChange={handlePrNumberChange} options={prNumberOptions} isClearable placeholder="Select PR Number..." />
                        </Form.Group>
                      </Col>
                    )}

                    {doc_reff === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formPoNumber">
                          <Form.Label>Purchase Order </Form.Label>
                          <Select value={selectedPoNumber} onChange={handlePoNumberChange} options={poNumberOptions} isClearable placeholder="Select PO Number..." />
                        </Form.Group>
                      </Col>
                    )} */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formDocumentSourceNumber">
                        <Form.Label>Document Source Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Document Source Number" value={doc_reff_no} onChange={(e) => setDocReffNo(e.target.value)} />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formVoucherNumber">
                        <Form.Label>Voucher Number</Form.Label>
                        <Form.Control type="text" value={voucher_number} readOnly />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formStatus">
                        <Form.Label>Voucher Status</Form.Label>
                        <Form.Control type="text" placeholder="" value={status} onChange={(e) => setStatus(e.target.value)} readOnly/>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVoucherDate">
                        <Form.Label>Voucher Date</Form.Label>
                        <Form.Control type="date" value={voucher_date} onChange={(e) => setVoucherDate(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" placeholder="Your Amount" value={amount} onChange={(e) => setAmount(e.target.value)} readOnly/>
                      </Form.Group>
                    </Col> 

                    {/* <Col md={6}>
                      <Form.Group controlId="formExchangeRate">
                        <Form.Label>Exchange Rate</Form.Label>
                        <Select
                        value={selectedExchangeRate}
                        onChange={handleExchangeRateChange}
                        options={exchangerateOptions}
                        isClearable
                        placeholder="Select..."
                    />                           </Form.Group>
                    </Col>                     */}
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
                    <Button variant="success" size="sm" onClick={handleAddItem}>
                      <i className="fas fa-plus"></i> New Item
                    </Button>
                    <Button variant="danger" size="sm" className="ml-2" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                      <i className="fas fa-trash"></i> Delete Selected
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="detail">
                    {(provided) => (
                      <div className="table-responsive" {...provided.droppableProps} ref={provided.innerRef}>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>
                                <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === items.length && items.length > 0} />
                              </th>
                              {/* <th>Document Reference</th> */}
                              <th>Document Reference Number</th>
                              <th>Code/Account Name</th>
                              <th>Description</th>
                              <th>Product</th>
                              <th>Db/Cr</th>
                              <th>Type of VAT</th>
                              <th>PPN</th>
                              <th>Vendor</th>
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Department</th>
                              <th>Amount</th>
                              <th>PPh</th>
                              <th>Amount PPN</th>
                              <th>Amount PPh</th>
                              {/* <th>Total Amount PPH</th> */}
                              <th>Total To Be Paid</th>
                              <th>Expanse Voucher</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="20" className="text-center">
                                  No data available
                                </td>
                              </tr>
                            ) : (
                              items.map((item, index) => (
                                <tr key={index} className={selectedItems.includes(index) ? "table-active" : ""}>
                                  <td>
                                    <input type="checkbox" checked={selectedItems.includes(index)} onChange={() => handleSelectItem(index)} />
                                  </td>
                                  <td>
                                    
                                    {doc_reff === "purchaseRequest" && (
                                      <Form.Group controlId="formPrNumber">
                                      <Select
                                        value={prNumberOptions.find((option) => option.value === item.doc_reff_no)}
                                        options={prNumberOptions}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, "doc_reff_no", selectedOption ? selectedOption.value : null);
                                          handlePrNumberChange(index, selectedOption);
                                        }}
                                        isClearable
                                        required
                                        placeholder="Select PR Number..."
                                      />
                                    </Form.Group>
                                    )}

                                    {doc_reff === "purchaseOrder" && (
                                      <Form.Group controlId="formPoNumber">
                                      <Select
                                        value={poNumberOptions.find((option) => option.value === item.doc_reff_no)}
                                        options={poNumberOptions}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, "doc_reff_no", selectedOption ? selectedOption.value : null);
                                          handlePoNumberChange(index, selectedOption);
                                        }}
                                        isClearable
                                        required
                                        placeholder="Select PO Number..."
                                      />
                                    </Form.Group>
                                    )}
                                    
                                    {/* {docRef !== "purchaseRequest" && docRef !== "purchaseOrder" && docRef !== "internalMemo" && docRef !== "customerContract" && (
                                      <Form.Control type="number" value={item.document_reference_number} onChange={(e) => handleItemChange(index, "document_reference_number", parseFloat(e.target.value))} />
                                    )} */}
                                  </td>
                                  {/* <td>
                                  <Select
                                      value={ doc_reffOptions.find((option) => option.value === item.doc_reff)}
                                      onChange={(selectedOption) => handleItemChange(index, "doc_reff", selectedOption)}
                                      options={doc_reffOptions}
                                      isClearable
                                      placeholder="Select Document Reference"
                                    />                                      
                                    </td> */}
                                   {/* <td>
                                    <Form.Control type="number" value={item.doc_reff_no} onChange={(e) => handleItemChange(index, "doc_ref_no",parseFloat (e.target.value))} />
                                  </td>  */}
                                  <td>
                                     <Form.Group controlId="formCoa">
                                     <Select
                                        id="coa"
                                        value={coaOptions.find(option => option.value === item.coa)}
                                        onChange={(selectedOption) => {
                                          handleOptionChange(setSelectedCoa, setCoa, selectedOption);
                                        }}
                                        options={coaOptions}
                                        placeholder="Select Coa"
                                        isClearable
                                        required
                                      />
                                    </Form.Group>                         
                                    </td>
                                  <td>
                                    <Form.Control type="text" value={item.description} onChange={(e) => handleItemChange(index, "description",e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.product} onChange={(e) => handleItemChange(index, "product",e.target.value)} />
                                  </td>
                                  <td>
                                  <Form.Group controlId="db_cr">
                                    <Form.Control as="select" value={db_cr || "Db"} onChange={(e) => setDbCr(e.target.value)}>
                                      <option value="purchaseRequest">Db</option>
                                      <option value="purchaseOrder">Cr</option>
                                    </Form.Control>
                                  </Form.Group>                                  
                                  </td>
                                  <td>                           
                                  <Form.Control as="select" value={item.type_of_vat} onChange={(e) => handleItemChange(index, "type_of_vat", e.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                      <option value="non_ppn">Non PPN</option>
                                      <option value="ppn_royalty">PPN Royalty</option>
                                    </Form.Control>
                                  </td>
                                  <td>
                                    <Select
                                      value={taxPpnTypeOption.find((option) => option.value === items[index].tax_ppn) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn for the specific item
                                        handleItemChange(index, "tax_ppn", selectedOption ? selectedOption.value : "");

                                        // Update the PpnRate for the specific item
                                        // if (selectedOption) {
                                        //   handleItemChange(index, "tax_ppn_rate", selectedOption.RATE);
                                        //   setPpnRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        // } else {
                                        //   handleItemChange(index, "tax_ppn_rate", 0);
                                        //   setPpnRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        // }
                                      }}
                                      options={taxPpnTypeOption}
                                      isClearable
                                      placeholder="Select Tax PPN Type..."
                                    />
                                  </td>
                                  <td>
                                  {/* <Form.Group controlId="formVendor"> */}
                                  {/* <Select 
                                    value={
                                      items[index].vendor ?
                                      vendorOptions.find(option => option.value === item.vendor)
                                      :
                                      null
                                    } 
                                    onChange={(selectedOption) => {
                                      handleItemChange(index, 'vendor', selectedOption ? selectedOption.value : null);
                                    }} 
                                    options={vendorOptions}
                                    isClearable placeholder="Select Vendor..." /> */}
                                 
                                  {/* </Form.Group>                 */}
                                  <Form.Control type="text" value={item.vendor} onChange={(e) => handleItemChange(index, "vendor",e.target.value)} />
                                  </td>
                                  {doc_reff === "purchaseRequest" ? (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        {/* <Form.Label>Project</Form.Label> */}
                                        <Select
                                          value={projectOptions.find((option) => option.value === item.project)}
                                          onChange={(selectedOption) => handleItemChange(index, "project", selectedOption ? selectedOption.value : null)}
                                          options={projectOptions}
                                          isClearable
                                          placeholder="Select Project..."
                                          // isDisabled={true} // Field is disabled for "purchaseRequest"
                                        />
                                      </Form.Group>
                                    </td>
                                  ) : (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        {/* <Form.Label>Project</Form.Label> */}
                                        <Select
                                          value={projectOptions.find((option) => option.value === item.project)}
                                          onChange={(selectedOption) => handleItemChange(index, "project", selectedOption ? selectedOption.value : null)}
                                          options={projectOptions}
                                          isClearable
                                          placeholder="Select Project..."
                                          // isDisabled={docRef === "purchaseOrder"} // Field is disabled for "purchaseOrder"
                                        />
                                      </Form.Group>
                                    </td>
                                  )}
                                  <td>
                                    <Form.Control type="text" value={item.project_contract_number} onChange={(e) => handleItemChange(index, "project_contract_number",e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Group controlId="formCustomer">
                                      {/* <Form.Label>Customer</Form.Label> */}
                                      <Select
                                        id="customer"
                                        value={customerOptions.find(option => option.value === item.customer)}
                                        onChange={(selectedOption) => {
                                          handleOptionChange(setSelectedCustomer, setCustomer, selectedOption);
                                        }}
                                        options={customerOptions}
                                        placeholder="Customer..."
                                        isClearable
                                        required
                                        // isDisabled={docRef === "purchaseRequest" || !docRef}
                                      />
                                    </Form.Group>
                                  </td>
                                  <td>
                                    {/* <Form.Group controlId="formDepartment">
                                      <Select
                                        id="Department"
                                        value={departmentOptions.find(option => option.value === item.department)}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, 'departement', selectedOption.departement)
                                        }}
                                        options={departmentOptions}
                                        placeholder="Department..."
                                        isClearable
                                        required
                                        // isDisabled={docRef === "purchaseRequest" || !docRef}
                                      />
                                    </Form.Group> */}
                                  <Form.Control type="text" value={item.departement} onChange={(e) => handleItemChange(index, "departement",e.target.value)} />

                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.total_after_discount} onChange={(e) => handleItemChange(index, "amount", e.target.value)} />
                                  </td>
                                  <td>
                                  <Form.Group controlId="formTaxPphType">
                                  <Select
                                          value={selectedTaxPphType}
                                          onChange={(selectedOption) => {
                                            setSelectedTaxPphType(selectedOption);
                                            handleItemChange(index, "tax_pph_type", selectedOption ? selectedOption.value : null);
                                          }}
                                          options={tax_pph_type_option}
                                          isClearable
                                          placeholder="Select Tax PPH Type..."
                                        />
                                  </Form.Group>
                                  </td>
                                  {/* <td>
                                  <Form.Control type="text" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", e.target.value)} />
                                  </td> */}
                                  <td>
                                    <Form.Control type="number" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount",parseFloat (e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_pph_amount || "0"} onChange={(e) => handleItemChange(index, "tax_pph_amount", parseFloat( e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.amount_paid} onChange={(e) => handleItemChange(index, "amount_paid", e.target.value)} />
                                  </td>

                                  <td>
                                    <Form.Control type="text" value={item.expanse_account} onChange={(e) => handleItemChange(index, "expanse_account", e.target.value)} />
                                  </td>

                                  {/* <td>
                                  <Select
                                      value={ coa_options.find((option) => option.value === item.coa)}
                                      onChange={(selectedOption) => handleItemChange(index, "coa", selectedOption)}
                                      options={coa_options}
                                      isClearable
                                      placeholder="Select coa"
                                    />                                      
                                    </td>
                                  <td>
                                    <Form.Control type="text" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.invoice_number} onChange={(e) => handleItemChange(index, "invoice_number", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.amount} onChange={(e) => handleItemChange(index, "amount", parseFloat (e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.db_cr} onChange={(e) => handleItemChange(index, "db_cr", e.target.value)} />
                                  </td> 
                                  <td>                           
                                  <Form.Control as="select" value={item.type_of_vat} onChange={(e) => handleItemChange(index, "type_of_vat", e.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                    </Form.Control>
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount",parseFloat (e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_pph_rate} onChange={(e) => handleItemChange(index, "tax_pph_rate",parseFloat( e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_pph_amount_2} onChange={(e) => handleItemChange(index, "tax_pph_amount_2", parseFloat( e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.tax_pph_2} onChange={(e) => handleItemChange(index, "tax_pph_2", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_pph_rate_2} onChange={(e) => handleItemChange(index, "tax_pph_rate_2", parseFloat( e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.amount_paid} onChange={(e) => handleItemChange(index, "amount_paid", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.project} onChange={(e) => handleItemChange(index, "project", e.target.value)} />
                                  </td> */}
                                  {/* <td>
                                    <Form.Control type="text" value={item.voucher_number} onChange={(e) => handleItemChange(index, "voucher_number", e.target.value)} />
                                  </td> */}
                                  {/* <td>
                                    <Form.Control type="text" value={item.department} onChange={(e) => handleItemChange(index, "department", e.target.value)} />
                                  </td> */}
                                  {/* <td>
                                    <Select
                                      value={ productOptions.find((option) => option.value === item.coa)}
                                      onChange={(selectedOption) => handleItemChange(index, "product", selectedOption)}
                                      options={productOptions}
                                      isClearable
                                      placeholder="Select product"
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} style={{ width: "80px" }} />
                                  </td>
                                  <td>
                                    <Select
                                      value={currencyOptions.find((option) => option.value === item.currency)}
                                      onChange={(selectedOption) => handleItemChange(index, "currency", selectedOption)}
                                      options={currencyOptions}
                                      isClearable
                                      placeholder="Select currency"
                                      style={{ width: "80px" }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      onChange={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas to get raw number
                                        const value = parseFloat(rawValue);

                                        if (!isNaN(value)) {
                                          handleItemChange(index, "unit_price", value); // Update state with raw numeric value
                                        } else if (rawValue === "") {
                                          handleItemChange(index, "unit_price", 0); // Set value to 0 if input is cleared
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas to get raw number
                                        let value = parseFloat(rawValue) || 0;

                                        let formattedValue;
                                        if (item.currency === "IDR") {
                                          // For IDR: Format without decimals
                                          formattedValue = value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                                        } else {
                                          // For non-IDR: Ensure there are 2 decimal places
                                          formattedValue = value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                        }

                                        console.log("Formatted value:", formattedValue);

                                        e.target.value = formattedValue; // Set the formatted value in the input field

                                        handleItemChange(index, "unit_price", value); // Update state with the parsed value
                                      }}
                                      style={{ textAlign: "right" }}
                                    />
                                  </td>
                                  <td className="text-end">{item.total_price.toLocaleString("en-US", { currency: item.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td> */}
                                  <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                          {/* <tfoot>
                            <tr>
                              <td colSpan="15" className="text-right">
                                Tax Code
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="12" className="text-right">
                                Total Amount DPP
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="12" className="text-right">
                                Tax Amount
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="12 " className="text-right">
                                Subtotal
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                          </tfoot> */}
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
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* <Col md={6}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>Tax Summary</Card.Title>
            </Card.Header>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-bordered ">
                  <thead>
                    <tr>
                      <th>Kode Pajak</th>
                      <th>Total Amount DPP</th>
                      <th>Tax Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id}>
                          <td>
                                    <Form.Control type="number" value={item.tax_pph_rate_2} onChange={(e) => handleItemChange(index, "tax_pph_rate_2", parseFloat( e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount}", e.target.value)} />
                                  </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Col>  */}
        </Row>

        <Row className="mt-4">
          <Col md={12} className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="mr-2"
              onClick={() => {
                handleRefresh();
                setIsAddingNewPettyCash(false);
              }}
            >
              <i className="fas fa-arrow-left"></i>Go Back
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
};

export default AddPettyCash;
