import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from "../service/InsertDataService";
import { getBranch, getToken, token } from "../config/Constant";
import { FORM_SERVICE_UPDATE_DATA, GENERATED_NUMBER } from "../config/ConfigUrl";
import { generateUniqueId } from "../service/GeneratedId";
import Select from "react-select";
import LookupParamService from "../service/LookupParamService";
import { GENERATED_DUE_DATE, UPLOAD_FILES } from "../config/ConfigUrl";
import axios from "axios";
import LookupService from "../service/LookupService";

const AddPurchaseInvoice = ({ setIsAddingNewPurchaseInvoice, handleRefresh, index, item }) => {
  const headers = getToken();
  const branchId = getBranch();
  const [pr_number, setPrNumber] = useState("");
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
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
  const [codCorSkbOptions, setCodCorSkbOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendor, setVendor] = useState("");
  const [payment_term, setPaymentTerm] = useState("");
  const [invoice_date, setInvoiceDate] = useState("");
  const [ID, setID] = useState("");
  const [due_date, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [invoice_number, setInvoiceNumber] = useState("");
  const [po_number, setPoNumber] = useState("");
  const [internalmemo, setInternalMemo] = useState("");
  const [tax_rate, setTaxRate] = useState("");
  const [bi_middle_rate, setBiMiddleRate] = useState("");
  const [tax_invoice_number, setTaxInvoiceNumber] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCodCorSkb, setSelectedCodCorSkb] = useState(null);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [docRef, setDocRef] = useState("");
  const [prNumberOptions, setPrNumberOptions] = useState([]);
  const [selectedPrNumber, setSelectedPrNumber] = useState(null);
  const [poNumberOptions, setPoNumberOptions] = useState([]);
  const [selectedPoNumber, setSelectedPoNumber] = useState(null);
  const [invoice_type, setInvoiceType] = useState("");
  const [tax_pph_type_option, setTax_Pph_Type_Option] = useState([]);
  const [PphRate, setPphRate] = useState("");
  const [PpnRate, setPpnRate] = useState("");
  const [selectedTaxPphType, setSelectedTaxPphType] = useState(null);
  const [selectedtaxtype, setSelectedTaxType] = useState(null);
  const [tax_ppn_type, setTaxPpnType] = useState("");
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [type_of_payment, setTypeOfPayment] = useState("");
  const [term_of_payment, setTermOfPayment] = useState("");
  const [total_tax_base, setTotalTaxBase] = useState("");
  const [total_amount_ppn, setTotalAmountPpn] = useState("");
  const [total_amount_pph, setTotalAmountPph] = useState("");
  const [invoice_status, setInvoiceStatus] = useState("Draft");
  const [doc_reference, setDocReference] = useState("");
  const [allvendoroptions, setAllVendorOptions] = useState([]);
  const [selectedbothvendor, setSelectedBothVendor] = useState([]);
  const [doc_source, setDocSource] = useState("");
  const [doc_reff, setDocReff] = useState("");
  const [endToEnd, setEndToEnd] = useState("");
  const [idPr, setIdPr] = useState("");
  const [idPo, setIdPo] = useState("");
  const [cod_cor_skb, SetCodCorSkb] = useState("");
  const [tax_exchange_rate, setTaxExchangeRate] = useState("");
  const [customer_contract, setCustomerContract] = useState("");
  const [file, setFile] = useState("");
  const [vatType, setVatType] = useState(null);
  const [formattedDiscount, setFormattedDiscount] = useState("IDR 0.00");
  const [discount, setDiscount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customer, setCustomer] = useState("");
  const [departement, setDepartement] = useState("");
  const [contractNumberOption, setContractNumberOptions] = useState([]);

  const authToken = headers;

  const [inputWidth, setInputWidth] = useState(100);

  useEffect(() => {
    const generateInitialInvoiceNumber = async () => {
      const generatedInvoiceNumber = await generatePrNumber("DRAFT_INVC"); // Adjust the code as needed

      setInvoiceNumber(generatedInvoiceNumber);
    };

    generateInitialInvoiceNumber();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Ambil data lookup untuk currency
    // MSDT_FORMEMPL adalah nama table yang menyimpan data lookup untuk currency
    // authToken dan branchId digunakan untuk mengirimkan token otorisasi dan kode cabang ke server
    LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
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
        setRequestorOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    //  buat project
    // LookupParamService.fetchLookupData("MSDT_PRJT", authToken, branchId)
    //   .then((data) => {
    //     console.log("Project lookup data:", data);

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
    //     setProjectOptions(options);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch project lookup:", error);
    //   });

    // const options = transformedData
    //     .filter((item) => item.ENTITY_TYPE === "BOTH")
    //     .map((item) => ({
    //       value: item.NAME,
    //       label: item.NAME,
    //     }));
    //   setVendorOptions(options);

    // buat cod/cor
    LookupParamService.fetchLookupDataView("BooleanTrueFalse", authToken, branchId)
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
          value: item.CODE,
          label: item.CODE,
        }));
        setCodCorSkbOptions(options);
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
          .filter((item) => item.ENTITY_TYPE === "BOTH" || item.ENTITY_TYPE === "Vendor")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
          }));
        setVendorOptions(bothOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch vendor lookup:", error);
      });

    // Lookup Department
    LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
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
        setDepartementOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // buat payment term
    LookupParamService.fetchLookupData("MSDT_FORMPYTM", authToken, branchId)
      .then((data) => {
        console.log("Payment term lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.COUNT,
          label: item.NAME,
          dateType: item.DATE_TYPE,
        }));
        setPaymentTermOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch payment term lookup:", error);
      });

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
          paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
          dueDate: item.DUE_DATE,
          vendor: item.VENDOR,
          ENDTOENDID: item.ENDTOENDID,
          customer: item.CUSTOMER,
          departement: item.DEPARTEMENT,
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
          vendor: item.VENDOR,
          ENDTOENDID: item.ENDTOENDID,
          vatType: item.TYPE_OF_VAT,
          tax_ppn_type: item.TAX_PPN_TYPE,
          tax_ppn: item.TAX_PPN,
          discount: item.DISCOUNT,
          currency: item.CURRENCY,
          quantity: item.QUANTITY,
          paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
          dueDate: item.DUE_DATE,
          customer: item.CUSTOMER,
          departement: item.DEPARTEMENT,
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

  const handlePaymentTermChange = async (selectedOption) => {
    console.log("pay term select", selectedOption);
    console.log(due_date);
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");

    const payload = {
      date: invoice_date,
      count: selectedOption ? selectedOption.value : "",
      dateType: selectedOption ? selectedOption.dateType : "",
    };

    console.log(payload);
    try {
      // Hit the API with the required data and Bearer token in the headers
      const response = await axios.post(`${GENERATED_DUE_DATE}`, payload, {
        headers: {
          Authorization: `Bearer ${headers}`,
        },
      });

      // Process the response if needed
      console.log("API response:", response.data.dueDate);
      setDueDate(response.data.dueDate);
    } catch (error) {
      // Handle any errors
      console.error("Error calling API:", error);
    }
  };

  // const handlePrNumberChange = (selectedOption) => {
  //   setSelectedPrNumber(selectedOption);
  //   setPrNumber(selectedOption ? selectedOption.value : "");
  // };

  // Handle PR Number Change
  // const handlePrNumberChange = (selectedOption) => {
  //   setSelectedPrNumber(selectedOption);
  //   // setPrNumber(selectedOption ? selectedOption.value : "");
  //   setDocReference(selectedOption ? selectedOption.value : "");
  //   console.log("pr_number", pr_number);

  //   if (selectedOption) {
  //     const projectValue = selectedOption.project || selectedOption.PR_NUMBER;

  //     const matchingProjectOption = projectOptions.find((option) => option.value === projectValue);
  //     setSelectedProject(matchingProjectOption ? matchingProjectOption : null);
  //     setProject(selectedOption.project);
  //     setID(selectedOption.id); // Set the selected ID value
  //     setTotalAmount(selectedOption.totalAmount); // Autofill total amount
  //     setTitle(selectedOption.title);
  //     setDescription(selectedOption.description); // Autofill description
  //     setPaymentTerm(selectedOption.paymentTerm);

  //     const selectedPaymentTermOption = paymentTermOptions.find((option) => option.value === selectedOption.paymentTerm);
  //     if (!selectedPaymentTermOption) {
  //       console.error("Payment term is required for PR number", selectedOption.value);
  //       setSelectedPaymentTerm(null); // Clear the payment term selection
  //       return; // Exit the function to prevent further processing
  //     }
  //     setSelectedPaymentTerm(selectedPaymentTermOption);

  //     LookupParamService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
  //       .then((response) => {
  //         const fetchedItems = response.data || [];
  //         console.log("Items fetched:", fetchedItems);

  //         const resetItems = fetchedItems.map((item) => ({
  //           ...item,
  //           vat_type: "",
  //           tax_ppn_type: "",
  //           tax_base: item.tax_base || 0,
  //         }));
  //         // Set fetched items to state
  //         setItems(resetItems);

  //         // product lookup data
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

  //                 // Update fetched items with selected options
  //                 const updatedItems = fetchedItems.map((item) => {
  //                   const selectedProductOption = productOptions.find((option) => option.value === item.product);

  //                   console.log("Selected product option:", selectedProductOption);

  //                   const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);

  //                   console.log("Selected currency option:", selectedCurrencyOption);
  //                   const selectedPaymentTerm = paymentTermOptions.find((option) => option.value === item.paymentTerm);
  //                   console.log("payment term:", selectedPaymentTermOption);

  //                   setSelectedCurrency(selectedCurrencyOption);
  //                   setSelectedProduct(selectedProductOption);
  //                   setSelectedPaymentTerm(selectedPaymentTermOption);
  //                 });

  //                 // Set the updated items with selected product and currency options to state
  //                 setItems(fetchedItems);
  //               })
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
  //     setSelectedProject(null);
  //     setTotalAmount(null); // Clear total amount if no option is selected
  //     setTitle(null);
  //     setID(null); // Clear the ID value if no option is selected
  //     setDescription(null);
  //     setSelectedPaymentTerm(null);
  //     setItems([]);
  //   }
  // };
  // const handlePrNumberChange = (selectedOption) => {
  //   setSelectedPrNumber(selectedOption);
  //   setDocReference(selectedOption ? selectedOption.value : "");

  //   if (selectedOption) {
  //     console.log("vendor:", selectedOption.vendor);

  //     const projectValue = selectedOption.project || selectedOption.PO_NUMBER;
  //     const vendorValue = selectedOption.vendor || selectedOption.PO_NUMBER;

  //     const customerOption = customerOptions.find((option) => option.value === selectedOption.CUSTOMER);
  //     setCustomer(customerOption ? customerOption : null);

  //     const departementOption = departementOptions.find((option) => option.value === selectedOption.DEPARTEMENT);
  //     setDepartement(departementOption ? departementOption : null);

  //     const matchingVendorOption = allvendoroptions.find((option) => option.value === vendorValue);
  //     setSelectedVendor(matchingVendorOption ? matchingVendorOption : null);
  //     setVendor(selectedOption.vendor); // Autofill vendor
  //     setSelectedBothVendor(matchingVendorOption); // Autofill vendor when PO number is chosen

  //     const matchingProjectOption = projectOptions.find((option) => option.value === projectValue);
  //     setSelectedProject(matchingProjectOption ? matchingProjectOption : null);
  //     setProject(selectedOption.project);
  //     setID(selectedOption.id); // Set the selected ID value
  //     setTotalAmount(selectedOption.totalAmount); // Autofill total amount
  //     setTitle(selectedOption.title);
  //     setDescription(selectedOption.description); // Autofill description
  //     setVendor(selectedOption.vendor); // Autofill vendor
  //     setEndToEnd(selectedOption.ENDTOENDID);
  //     setVatType(selectedOption.TYPE_OF_VAT); // Autofill vat_type
  //     setCustomer(selectedOption.customer);
  //     setDepartement(selectedOption.DEPARTEMENT);
  //     setIdPo(selectedOption.ID);

  //     // Fetch customer and departement from lookup data
  //     LookupParamService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)

  //       .then((response) => {
  //         const fetchedData = response.data || [];

  //         if (fetchedData.length > 0) {
  //           const fetchedCustomer = fetchedData[0].CUSTOMER; // Assuming this is the correct field

  //           const fetchedDepartement = fetchedData[0].DEPARTEMENT; // Assuming this is the correct field

  //           // Set the fetched customer and department

  //           const customerOption = customerOptions.find((option) => option.value === fetchedCustomer);

  //           setCustomer(customerOption ? customerOption : null);

  //           const departementOption = departementOptions.find((option) => option.value === fetchedDepartement);

  //           setDepartement(departementOption ? departementOption : null);
  //         }

  //         // Continue with other lookups (items, product, VAT, etc.)
  //         LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
  //           .then((productData) => {
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

  //             setProductOptions(productOptions);

  //             LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId).then((data) => {
  //               const transformedData = data.data.map((item) =>
  //                 Object.keys(item).reduce((acc, key) => {
  //                   acc[key.toUpperCase()] = item[key];
  //                   return acc;
  //                 }, {})
  //               );

  //               const optionsPpn = transformedData
  //                 .filter((item) => item.TAX_TYPE === "PPN")
  //                 .map((item) => ({
  //                   value: item.NAME,
  //                   label: item.NAME,
  //                   RATE: item.RATE,
  //                 }));
  //               setTaxPpnTypeOption(optionsPpn);
  //             });

  //             // Fetch currency lookup data
  //             LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
  //               .then((currencyData) => {
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

  //                 setCurrencyOptions(currencyOptions);

  //                 // Update fetched items with selected product and currency options
  //                 const updatedItems = fetchedData.map((item) => {
  //                   const selectedProductOption = productOptions.find((option) => option.value === item.product);
  //                   const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);
  //                   const selectedVat = fetchedData[0].type_of_vat;
  //                   const selectedTypePPN = fetchedData[0].tax_ppn;
  //                   return {
  //                     ...item,
  //                     product: selectedProductOption ? selectedProductOption.value : item.product,
  //                     currency: selectedCurrencyOption ? selectedCurrencyOption.value : item.currency,
  //                     tax_ppn_type: selectedTypePPN ? selectedTypePPN : item.tax_ppn_type,
  //                     vat_type: selectedVat,
  //                   };
  //                 });

  //                 setItems(updatedItems);
  //               })
  //               .catch((error) => {
  //                 console.error("Failed to fetch currency lookup:", error);
  //               });
  //           })
  //           .catch((error) => {
  //             console.error("Failed to fetch product lookup:", error);
  //           });
  //       })
  //       .catch((error) => {
  //         console.error("Failed to load customer and departement:", error);
  //       });
  //   } else {
  //     // Clear fields when no option is selected
  //     setSelectedProject(null);
  //     setTotalAmount(null);
  //     setTitle(null);
  //     setID(null);
  //     setDescription(null);
  //     setSelectedPaymentTerm(null); // Clear payment term if no option is selected
  //     setPaymentTerm(null); // Clear payment term if no option is selected
  //     setSelectedBothVendor(null); // Clear selectedBothVendor
  //     setItems([]);
  //   }
  // };

  const handlePrNumberChange = (selectedOption) => {
    setSelectedPrNumber(selectedOption);
    setDocReference(selectedOption ? selectedOption.value : "");

    if (selectedOption) {
      const projectValue = selectedOption.project || selectedOption.PO_NUMBER;
      const vendorValue = selectedOption.vendor || selectedOption.PO_NUMBER;

      const customerOption = customerOptions.find((option) => option.value === selectedOption.CUSTOMER);
      setCustomer(customerOption ? customerOption : null);

      const departementOption = departementOptions.find((option) => option.value === selectedOption.DEPARTEMENT);
      setDepartement(departementOption ? departementOption : null);

      const matchingVendorOption = allvendoroptions.find((option) => option.value === vendorValue);
      setSelectedVendor(matchingVendorOption ? matchingVendorOption : null);
      setVendor(selectedOption.vendor); // Autofill vendor
      setSelectedBothVendor(matchingVendorOption); // Autofill vendor when PO number is chosen

      const matchingProjectOption = projectOptions.find((option) => option.value === projectValue);
      setSelectedProject(matchingProjectOption ? matchingProjectOption : null);
      setProject(selectedOption.project);
      setID(selectedOption.id); // Set the selected ID value
      setTotalAmount(selectedOption.totalAmount); // Autofill total amount
      setTitle(selectedOption.title);
      setDescription(selectedOption.description); // Autofill description
      setVendor(selectedOption.vendor); // Autofill vendor
      setEndToEnd(selectedOption.ENDTOENDID);
      setVatType(selectedOption.TYPE_OF_VAT); // Autofill vat_type
      setCustomer(selectedOption.customer);
      setDepartement(selectedOption.DEPARTEMENT);
      setIdPo(selectedOption.ID);

      // Fetch customer and department from lookup data
      LookupParamService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedData = response.data || [];
          console.log("fetc", fetchedData);

          if (fetchedData.length > 0) {
            const fetchedCustomer = fetchedData[0].CUSTOMER; // Assuming this is the correct field
            const fetchedDepartement = fetchedData[0].DEPARTEMENT; // Assuming this is the correct field

            // Set the fetched customer and department
            const customerOption = customerOptions.find((option) => option.value === fetchedCustomer);
            setCustomer(customerOption ? customerOption : null);

            const departementOption = departementOptions.find((option) => option.value === fetchedDepartement);
            setDepartement(departementOption ? departementOption : null);
          }

          // Continue with other lookups (items, product, VAT, etc.)
          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
            .then((productData) => {
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

              setProductOptions(productOptions);

              // Fetch currency lookup data
              LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                .then((currencyData) => {
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

                  setCurrencyOptions(currencyOptions);

                  // Update fetched items with selected product and currency options
                  const updatedItems = fetchedData.map((item) => {
                    const selectedProductOption = productOptions.find((option) => option.value === item.product);
                    const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);
                    const selectedVendorOption = vendorOptions.find((option) => option.value === item.vendor);
                    const selectedVat = fetchedData[0].type_of_vat;
                    const selectedTypePPN = fetchedData[0].tax_ppn;
                    return {
                      ...item,
                      vendor: selectedVendorOption ? selectedVendorOption.value : item.vendor,
                      product: selectedProductOption ? selectedProductOption.value : item.product,
                      currency: selectedCurrencyOption ? selectedCurrencyOption.value : item.currency,
                      tax_ppn_type: selectedTypePPN ? selectedTypePPN : item.tax_ppn_type,
                      vat_type: selectedVat,
                    };
                  });

                  setItems(updatedItems);
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
          console.error("Failed to load customer and department:", error);
        });
    } else {
      // Clear fields when no option is selected
      setSelectedProject(null);
      setTotalAmount(null);
      setTitle(null);
      setID(null);
      setDescription(null);
      setSelectedPaymentTerm(null); // Clear payment term if no option is selected
      setPaymentTerm(null); // Clear payment term if no option is selected
      setSelectedBothVendor(null); // Clear selectedBothVendor
      setItems([]);
    }
  };

  const handlePoNumberChange = (selectedOption) => {
    setSelectedPoNumber(selectedOption);
    setDocReference(selectedOption ? selectedOption.value : "");

    if (selectedOption) {
      console.log("vendor:", selectedOption.vendor);

      const projectValue = selectedOption.project || selectedOption.PO_NUMBER;
      const vendorValue = selectedOption.vendor || selectedOption.PO_NUMBER;

      const customerOption = customerOptions.find((option) => option.value === selectedOption.CUSTOMER);
      setCustomer(customerOption ? customerOption : null);

      const departementOption = departementOptions.find((option) => option.value === selectedOption.DEPARTEMENT);
      setDepartement(departementOption ? departementOption : null);

      const matchingVendorOption = allvendoroptions.find((option) => option.value === vendorValue);
      setSelectedVendor(matchingVendorOption ? matchingVendorOption : null);
      setVendor(selectedOption.vendor); // Autofill vendor
      setSelectedBothVendor(matchingVendorOption); // Autofill vendor when PO number is chosen

      const matchingProjectOption = projectOptions.find((option) => option.value === projectValue);
      setSelectedProject(matchingProjectOption ? matchingProjectOption : null);
      setProject(selectedOption.project);
      setID(selectedOption.id); // Set the selected ID value
      setTotalAmount(selectedOption.totalAmount); // Autofill total amount
      setTitle(selectedOption.title);
      setDescription(selectedOption.description); // Autofill description
      setVendor(selectedOption.vendor); // Autofill vendor
      setEndToEnd(selectedOption.ENDTOENDID);
      setVatType(selectedOption.TYPE_OF_VAT); // Autofill vat_type
      setCustomer(selectedOption.customer);
      setDepartement(selectedOption.DEPARTEMENT);
      setIdPo(selectedOption.ID);

      // Autofill vatType from selectedOption.TYPE_OF_VAT

      setItems((prevItems) => {
        return prevItems.map((item) => {
          return { ...item, vat_type: selectedOption.TYPE_OF_VAT };
        });
      });

      // Fetch items and vat_type from the selected PO number
      LookupParamService.fetchLookupData(`PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          if (fetchedItems.length > 0) {
            const fetchedVatType = fetchedItems[0].type_of_vat; // Correct casing
            console.log("Fetched VAT Type:", fetchedVatType); // Correct log
            setVatType(fetchedVatType); // Set VAT type state
          }

          // Fetch product lookup data
          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
            .then((productData) => {
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

              setProductOptions(productOptions);
              // Fetch currency lookup data
              LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                .then((currencyData) => {
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

                  setCurrencyOptions(currencyOptions);

                  // Update fetched items with selected product and currency options
                  const updatedItems = fetchedItems.map((item) => {
                    const selectedProductOption = productOptions.find((option) => option.value === item.product);
                    const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);
                    const selectedVat = fetchedItems[0].type_of_vat;
                    const selectedTypePPN = fetchedItems[0].tax_ppn;
                    console.log("ahdu", selectedTypePPN);
                    return {
                      ...item,
                      product: selectedProductOption ? selectedProductOption.value : item.product,
                      currency: selectedCurrencyOption ? selectedCurrencyOption.value : item.currency,
                      tax_ppn_type: selectedTypePPN ? selectedTypePPN : item.tax_ppn_type,
                      vat_type: selectedVat,
                    };
                  });

                  setItems(updatedItems);
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
      // Clear fields when no option is selected
      setSelectedProject(null);
      setTotalAmount(null);
      setTitle(null);
      setID(null);
      setDescription(null);
      setSelectedPaymentTerm(null); // Clear payment term if no option is selected
      setPaymentTerm(null); // Clear payment term if no option is selected
      setSelectedBothVendor(null); // Clear selectedBothVendor
      setItems([]);
    }
  };

  const handleCodCorSkbChange = (selectedOption) => {
    setSelectedCodCorSkb(selectedOption);
    SetCodCorSkb(selectedOption ? selectedOption.value : "");
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
  };

  const handleBothVendorChange = (selectedOption) => {
    setSelectedBothVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
  };

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");

    if (selectedOption) {
      const customerProject = customerOptions.find((option) => option.value === selectedOption.customer);
      setSelectedCustomer(customerProject);
      setCustomer(customerProject ? customerProject.value : null);
    } else {
      setSelectedCustomer(null);
      setCustomer("");
    }
  };
  const handleOptionChange = (setter, stateSetter, selectedOption) => {
    setter(selectedOption);
    stateSetter(selectedOption ? selectedOption.value : "");
  };
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: "",
        invoice_number: "",
        product: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        vat_type: "",
        tax_ppn: 0,
        tax_ppn_type: "",
        tax_ppn_rate: "",
        tax_ppn_amount: 0,
        tax_pph: 0,
        tax_pph_type: "",
        tax_pph_rate: "",
        tax_pph_amount: 0,
        tax_base: "IDR 0.00",
        total_tax_base: 0,
        total_amount_ppn: 0,
        total_amount_pph: 0,
        total_price: 0,
        total_price_idr: 0,
        vat_included: false,
        new_unit_price: 0,
        exchange_rate: 0,
        vendor: "",
      },
    ]);
  };

  //yg baru
  // const handleItemChange = (index, field, value) => {
  //   const newItems = [...items];
  //   newItems[index][field] = value;
  //   if (field === "unit_price" || field === "quantity") {
  //     newItems[index].vat_type = "";
  //     newItems[index].tax_ppn_type = "";
  //     newItems[index].tax_base = 0;
  //     newItems[index].tax_ppn_amount = 0;
  //     newItems[index].tax_pph_amount = 0;
  //     newItems[index].type_of_pph = "";
  //     newItems[index].tax_pph_rate = 0;
  //     if (newItems[index].vat_included !== undefined) {
  //       newItems[index].vat_included = false;
  //     }
  //   }
  //   // if (field === "quantity" || field === "unit_price") {
  //   //   newItems[index].total_price_idr = newItems[index].quantity * newItems[index].unit_price;
  //   // }

  //   if (field === "quantity" || field === "unit_price") {
  //     newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;

  //     // If the currency is not IDR, calculate total_price_idr with exchange rate
  //     if (newItems[index].currency !== "IDR" && newItems[index].total_price > 0) {
  //       newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].exchange_rate || 0);
  //     } else if (newItems[index].currency === "IDR") {
  //       newItems[index].total_price_idr = newItems[index].total_price;
  //     } else {
  //       newItems[index].total_price_idr = 0;
  //     }
  //   }

  //   // Itungan New Unit Price
  //   let pengkali = newItems[index].tax_ppn_rate / 100;

  //   if (field === "tax_ppn_type" || field === "tax_ppn_rate") {
  //     if (newItems[index].vat_type === "include") {
  //       newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
  //       newItems[index].tax_base = Math.round(newItems[index].unit_price / ((1 + newItems[index].tax_ppn_rate / 100) * newItems[index].quantity));
  //       newItems[index].tax_ppn_amount = newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100);
  //       newItems[index].vat_included = true;
  //     } else if (newItems[index].vat_type === "exclude") {
  //       newItems[index].tax_ppn_amount = newItems[index].total_price_idr * (newItems[index].tax_ppn_rate / 100);
  //       newItems[index].tax_base = newItems[index].unit_price * newItems[index].quantity;
  //     }
  //     newItems[index].total_price_idr = newItems[index].unit_price * newItems[index].quantity;
  //   }

  //   if (field === "tax_pph_type" || field === "tax_pph_rate") {
  //     if (newItems[index].type_of_pph === "gross") {
  //       if (newItems[index].vat_type === "exclude") {
  //         newItems[index].tax_pph_amount = newItems[index].unit_price * (newItems[index].tax_pph_rate / 100);
  //       } else {
  //         newItems[index].tax_pph_amount = newItems[index].tax_base * (newItems[index].tax_pph_rate / 100);
  //         console.log("asdsad", newItems[index].tax_pph_amount);
  //       }
  //     } else if (newItems[index].type_of_pph === "nett") {
  //       if (newItems[index].vat_type === "include") {
  //         let taxWithPPh = newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_pph_amount = taxWithPPh * (newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_ppn_amount = taxWithPPh * (newItems[index].tax_ppn_rate / 100);
  //       } else if (newItems[index].vat_type === "exclude") {
  //         let taxWithPPh = newItems[index].unit_price / (1 - newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_pph_amount = taxWithPPh * (newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_ppn_amount = taxWithPPh * (newItems[index].tax_ppn_rate / 100);
  //       }
  //     }
  //   }

  //   if (field === "vat_type") {
  //     newItems[index].tax_ppn_type = "";
  //     newItems[index].tax_ppn_rate = 0;
  //     newItems[index].tax_base = 0;
  //     newItems[index].tax_ppn_amount = 0;
  //     newItems[index].tax_pph_amount = 0;
  //     newItems[index].tax_pph_type = "";
  //     newItems[index].type_of_pph = "";
  //     newItems[index].tax_pph_rate = 0;

  //     if (newItems[index].vat_type === "exclude" && newItems[index].vat_included === true) {
  //       newItems[index].new_unit_price = newItems[index].new_unit_price - newItems[index].unit_price * pengkali;
  //       newItems[index].vat_included = false;
  //     } else {
  //       newItems[index].new_unit_price = newItems[index].unit_price;
  //     }
  //     newItems[index].total_price_idr = newItems[index].unit_price * newItems[index].quantity;
  //   }
  //   console.log("pphtype", newItems[index].type_of_pph);
  //   console.log("pphrate", newItems[index].tax_pph_rate);
  //   console.log("ppham", newItems[index].exchange_rate);
  //   console.log("totalam", newItems[index].total_price);
  //   setItems(newItems);
  // };

  // itungan paling baru dan benar
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Reset fields when 'unit_price' or 'quantity' changes
    if (field === "unit_price" || field === "quantity") {
      newItems[index].vat_type = "";
      newItems[index].tax_ppn_type = "";
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;
      if (newItems[index].vat_included !== undefined) {
        newItems[index].vat_included = false;
      }
    }

    // Update total price and total price IDR
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;

      // Calculate total_price_idr based on exchange rate if currency is not IDR
      if (newItems[index].currency !== "IDR" && newItems[index].total_price > 0) {
        newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].exchange_rate || 0);
      } else if (newItems[index].currency === "IDR") {
        newItems[index].total_price_idr = newItems[index].total_price;
      } else {
        newItems[index].total_price_idr = 0;
      }
    }

    // Calculate New Unit Price based on VAT and PPN
    let pengkali = newItems[index].tax_ppn_rate / 100;

    if (field === "tax_ppn_type" || field === "tax_ppn_rate") {
      if (newItems[index].vat_type === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
        newItems[index].tax_base = Math.round(newItems[index].total_price_idr / (1 + newItems[index].tax_ppn_rate / 100));
        newItems[index].tax_ppn_amount = newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100);
        newItems[index].vat_included = true;
      } else if (newItems[index].vat_type === "exclude") {
        newItems[index].tax_ppn_amount = newItems[index].total_price_idr * (newItems[index].tax_ppn_rate / 100);
        newItems[index].tax_base = newItems[index].total_price_idr;
      }

      // Tetap gunakan total_price_idr yang telah dihitung untuk non-IDR
      newItems[index].total_price_idr = newItems[index].total_price_idr;
    }

    // Calculate PPh based on PPh type and rate
    if (field === "tax_pph_type" || field === "tax_pph_rate") {
      if (newItems[index].type_of_pph === "gross") {
        if (newItems[index].vat_type === "exclude") {
          newItems[index].tax_pph_amount = newItems[index].total_price_idr * (newItems[index].tax_pph_rate / 100);
        } else {
          newItems[index].tax_pph_amount = newItems[index].tax_base * (newItems[index].tax_pph_rate / 100);
        }
      } else if (newItems[index].type_of_pph === "nett") {
        let taxWithPPh = newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100);
        newItems[index].tax_pph_amount = taxWithPPh * (newItems[index].tax_pph_rate / 100);
        newItems[index].tax_ppn_amount = taxWithPPh * (newItems[index].tax_ppn_rate / 100);
      }
    }

    // Update VAT type logic
    if (field === "vat_type") {
      newItems[index].tax_ppn_type = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph_type = "";
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;

      if (newItems[index].vat_type === "exclude" && newItems[index].vat_included === true) {
        newItems[index].new_unit_price = newItems[index].new_unit_price - newItems[index].unit_price * pengkali;
        newItems[index].vat_included = false;
      } else {
        newItems[index].new_unit_price = newItems[index].unit_price;
      }

      // Tetap gunakan total_price_idr yang telah dihitung sebelumnya untuk non-IDR
      if (newItems[index].currency !== "IDR") {
        newItems[index].total_price_idr = newItems[index].total_price_idr;
      } else {
        newItems[index].total_price_idr = newItems[index].unit_price * newItems[index].quantity;
      }
    }

    // Update item state
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

  // perhitungan awal
  // const calculateTotalAmount = () => {
  //   const subTotal = items.reduce((total, item) => {
  //     const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
  //     return total + taxBase;
  //   }, 0);

  //   const totalPPNAmount = items.reduce((total, item) => {
  //     const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : item.tax_ppn_amount;
  //     return total + taxPPNAmount;
  //   }, 0);

  //   const totalPPHAmount = items.reduce((total, item) => {
  //     const taxPPHAmount = isNaN(item.tax_pph_amount) ? 0 : item.tax_pph_amount;
  //     return total + taxPPHAmount;
  //   }, 0);

  //   const total_amount = subTotal - totalPPHAmount + totalPPNAmount;
  //   const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;
  //   return { subTotal, totalPPNAmount, totalPPHAmount, totalAmount: validTotalAmount };
  // };

  // yang biasanya dipake coy
  const calculateTotalAmount = () => {
    const subTotal = items.reduce((total, item) => {
      const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
      return total + taxBase;
    }, 0);

    const taxbasePPH = items.reduce((total, item) => {
      if (item.vat_type === "include" && item.type_of_pph === "nett") {
        const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
        const taxPphRate = isNaN(item.tax_pph_rate) ? 0 : item.tax_pph_rate;
        return total + taxBase / (1 - taxPphRate / 100);
      } else if (item.vat_type === "exclude") {
        return total + item.unit_price / (1 - item.tax_pph_rate / 100);
      } else {
        return total + (isNaN(item.tax_base) ? 0 : item.tax_base);
      }
    }, 0);

    const subtotalAfterDiscount = subTotal - discount;

    const totalPPNAmount = items.reduce((total, item) => {
      const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : item.tax_ppn_amount;
      return total + taxPPNAmount;
    }, 0);

    const totalPPHAmount = items.reduce((total, item) => {
      const taxPPHAmount = isNaN(item.tax_pph_amount) ? 0 : item.tax_pph_amount;
      return total + taxPPHAmount;
    }, 0);

    // Calculate total_amount based on vat_type and type_of_pph
    let total_amount;

    // Case 1: PPN Include, PPH Gross
    const case1 = items.filter((item) => item.vat_type === "include" && item.type_of_pph === "gross");
    if (case1.length > 0) {
      total_amount = subtotalAfterDiscount + totalPPNAmount - totalPPHAmount;
    }

    // Case 2: PPN Include, PPH Nett (using the new formula)
    const case2 = items.filter((item) => item.vat_type === "include" && item.type_of_pph === "nett");
    if (case2.length > 0) {
      const taxBasePPNAF = Math.round(taxbasePPH);
      // const taxPphRate = totalPPHAmount / taxBase; // Example PPh rate from total PPH amount
      total_amount = taxBasePPNAF - totalPPHAmount + totalPPNAmount;
      console.log("taxppsdsd", taxBasePPNAF);
      console.log("pphamisnada", totalPPHAmount);
      console.log("ppnamkd", totalPPNAmount);
      console.log("totalamaos", total_amount);
    }

    // Case 3: PPN Exclude, PPH Gross
    const case3 = items.filter((item) => item.vat_type === "exclude" && item.type_of_pph === "gross");
    if (case3.length > 0) {
      total_amount = subtotalAfterDiscount + totalPPNAmount - totalPPHAmount;
    }

    // Case 4: PPN Exclude, PPH Nett (using the new formula)
    const case4 = items.filter((item) => item.vat_type === "exclude" && item.type_of_pph === "nett");
    if (case4.length > 0) {
      const taxBase = taxbasePPH;
      const taxPphRate = totalPPHAmount / taxBase; // Example PPh rate from total PPH amount
      total_amount = taxBase - totalPPNAmount + totalPPHAmount;
    }

    // Ensure valid total amount
    const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;

    return { subTotal, subtotalAfterDiscount, taxbasePPH, totalPPNAmount, totalPPHAmount, totalAmount: validTotalAmount };
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const resetForm = () => {
    generatePrNumber("DRAFT_INVC");
    setPrNumber("");
    setTitle("");
    setInternalMemo("");
    setCustomerContract("");
    setID(null);
    setInvoiceNumber("");
    setInvoiceType("");
    setInvoiceDate("");
    setVendor(null);
    setPaymentTerm(null);
    setDueDate("");
    setTaxRate("");
    setTaxInvoiceNumber("");
    setTaxExchangeRate("");
    SetCodCorSkb("");
    setInvoiceStatus("");
    setBiMiddleRate("");
    setTypeOfPayment("");
    setTermOfPayment("");
    setProject("");
    setDescription("");
    setItems([]);
    setSelectedItems([]);
    setSelectedPrNumber(null);
    setSelectedPoNumber(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    setDocSource(null);
    setAllVendorOptions(null);
    setVendorOptions(null);
    setPaymentTermOptions(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!invoice_number) {
      messageAlertSwal("Error", "Invoice Number cannot be empty.", "error");
      return; // Prevent form submission
    }

    if (!tax_exchange_rate) {
      messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
      return;
    }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Purchase Invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Save It!",
      cancelButtonText: "No, Cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const pr_number = await generatePrNumber("PR");

        console.log("pr_number", pr_number);
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
        const { subTotal, subtotalAfterDiscount, totalPPNAmount, totalPPHAmount, total_amount } = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const generalInfo = {
          doc_reff: docRef,
          doc_reff_no: doc_reference,
          // internalmemo,
          title,
          payment_term, // Converts to date format
          invoice_number,
          // invoice_type,
          invoice_date,
          invoice_status: "Draft",
          vendor,
          // tax_rate,
          tax_exchange_rate,
          tax_invoice_number,
          term_of_payment,
          // bi_middle_rate,
          cod_cor_skb,
          total_tax_base: subtotalAfterDiscount,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          project,
          due_date,
          description,
          total_amount: total_amount,
          endtoendid: endToEndId,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          console.log(response.message);
          for (const item of items) {
            console.log(item.vat_type);
            const updatedItem = {
              ...item,
              invoice_number,
              type_of_vat: item.vat_type,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
              tax_base: item.tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
              vat_type: item.type_of_payment,
              tax_exchange_rate: item.exchange_rate,
              // new_unit_price: item.unit_price,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;

            const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          if (doc_source) {
            const request = {
              idTrx: endToEndId,
              code: "PUINVC",
            };

            const formData = new FormData();
            formData.append("request", JSON.stringify(request));
            formData.append("file", doc_source); // Use the file variable directly

            const uploadResponse = await axios.post(`${UPLOAD_FILES}`, formData, {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
              },
            });

            if (uploadResponse.ok) {
              console.log("File uploaded successfully");
            } else {
              console.error("Error uploading file:", uploadResponse.status);
            }
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
  const generatePrNumber = async (code) => {
    try {
      const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
      setPrNumber(uniquePrNumber); // Updates state, if needed elsewhere in your component
      return uniquePrNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate PR Number:", error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!invoice_number) {
      messageAlertSwal("Error", "Invoice Number cannot be empty.", "error");
      return; // Prevent form submission
    }

    if (!tax_exchange_rate) {
      messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
      return;
    }

    // if (!title) {
    //   messageAlertSwal("Error", "Title cannot be empty", "error");
    //   return;
    // }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the Purchase Invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const pr_number = await generatePrNumber("PR");

        console.log("pr_number", pr_number);
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
        const { subTotal, subtotalAfterDiscount, totalPPNAmount, totalPPHAmount, total_amount } = calculateTotalAmount();
        // Save general information and description
        const generalInfo = {
          doc_reff: docRef,
          doc_reff_no: doc_reference,
          // internalmemo,
          title,
          payment_term, // Converts to date format
          invoice_number,
          // invoice_type,
          invoice_date,
          invoice_status: "IN_PROCESS",
          vendor,
          // tax_rate,
          tax_invoice_number,
          term_of_payment,
          // bi_middle_rate,
          total_tax_base: subtotalAfterDiscount,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          project,
          due_date,
          description,
          total_amount: total_amount,
          endtoendid: endToEndId,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (doc_source) {
          const request = {
            idTrx: endToEndId,
            code: "PUINVC",
          };

          const formData = new FormData();
          formData.append("request", JSON.stringify(request));
          formData.append("file", doc_source); // Use the file variable directly

          const uploadResponse = await axios.post(`${UPLOAD_FILES}`, formData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          });

          if (uploadResponse.ok) {
            console.log("File uploaded successfully");
          } else {
            console.error("Error uploading file:", uploadResponse.status);
          }
        }

        // Update Status
        if (idPr) {
          const updatePRStatus = await axios.post(
            `${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}`,
            {
              status_request: "INVOICE",
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          return updatePRStatus;
        } else if (idPo) {
          const updatePOStatus = await axios.post(
            `${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}`,
            {
              status_request: "INVOICE",
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          return updatePOStatus;
        }

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              invoice_number,
              type_of_vat: item.vat_type,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
              tax_base: item.tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
              vat_type: item.type_of_payment,
              tax_exchange_rate: item.exchange_rate,
              // new_unit_price: item.unit_price,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;

            const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
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

  // #Buat generate
  // useEffect(() => {
  //   const generatePrNumber = async () => {
  //     try {
  //       const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=INV`, authToken);
  //       setPrNumber(uniquePrNumber);
  //     } catch (error) {
  //       console.error("Failed to generate PR Number:", error);
  //     }
  //   };

  //   generatePrNumber();
  // }, []);

  const dynamicFormWidth = (e) => {
    const contentLength = e.target.value.length;
    const newWidth = Math.max(100, contentLength * 12); // 8px per character, adjust as needed
    setInputWidth(newWidth);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setInvoiceDate(today);
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
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => {
                      handleRefresh();
                      setIsAddingNewPurchaseInvoice(false);
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
                    {/* <Col md={6}>
                        <Form.Group controlId="formTitle">
                          <Form.Label>Title</Form.Label>
                          <Form.Control type="text" placeholder="Enter Title" value={title || ""} onChange={(e) => setTitle(e.target.value)} disabled={docRef === "purchaseOrder"} required />
                        </Form.Group>
                      </Col> */}

                    {/* {docRef === "purchaseRequest" ? (
                        <Col md={6}>
                          <Form.Group controlId="formId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Enter ID"
                              value={ID}
                              onChange={(e) => setID(e.target.value)}
                              required
                              disabled={true} // Add this prop to disable the field
                            />
                          </Form.Group>
                        </Col>
                      ) : (
                        <Col md={6}>
                          <Form.Group controlId="formId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="number" placeholder="Enter ID" value={ID} onChange={(e) => setID(e.target.value)} required />
                          </Form.Group>
                        </Col>
                      )} */}

                    <Col md={6} hidden>
                      <Form.Group controlId="formInternalMemo">
                        <Form.Label>End To End Id</Form.Label>
                        <Form.Control type="text" placeholder="Enter Internal Memo" value={endToEnd} onChange={(e) => setEndToEnd(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceNumber">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control type="text" value={invoice_number} readOnly /> {/* Make it read-only */}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceDate">
                        <Form.Label>Invoice Date</Form.Label>
                        <Form.Control type="date" value={invoice_date} onChange={(e) => setInvoiceDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formDocReff">
                        <Form.Label>Document Reference</Form.Label>
                        <Form.Control as="select" placeholder="Enter Document Number" value={docRef} onChange={(e) => setDocRef(e.target.value)}>
                          <option value="">Select Document Reference</option>
                          <option value="purchaseRequest">Purchase Request</option>
                          <option value="internalMemo">Internal Memo</option>
                          <option value="purchaseOrder">Purchase Order</option>
                          <option value="customerContract">Customer Contract</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    {docRef === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formPrNumber">
                          <Form.Label>PR Number</Form.Label>
                          <Select value={selectedPrNumber} onChange={handlePrNumberChange} options={prNumberOptions} isClearable placeholder="Select PR Number..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formPoNumber">
                          <Form.Label>PO Number</Form.Label>
                          <Select value={selectedPoNumber} onChange={handlePoNumberChange} options={poNumberOptions} isClearable placeholder="Select PO Number..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "internalMemo" && (
                      <Col md={6}>
                        <Form.Group controlId="formInternalMemo">
                          <Form.Label>Internal Memo</Form.Label>
                          <Form.Control type="text" placeholder="Enter Internal Memo" value={internalmemo} onChange={(e) => setInternalMemo(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "customerContract" && (
                      <Col md={6}>
                        <Form.Group controlId="formInternalMemo">
                          <Form.Label>Customer Contract</Form.Label>
                          <Form.Control type="text" placeholder="Enter Document Contract" value={customer_contract} onChange={(e) => setCustomerContract(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseOrder" ? (
                      <Col md={6}>
                        <Form.Group controlId="formPaymentTerm">
                          <Form.Label>Payment Term</Form.Label>
                          <Select value={selectedPaymentTerm} onChange={handlePaymentTermChange} options={paymentTermOptions} isClearable placeholder="Select Payment Term..." />
                        </Form.Group>
                      </Col>
                    ) : (
                      <Col md={6}>
                        <Form.Group controlId="formPaymentTerm">
                          <Form.Label>Payment Term</Form.Label>
                          <Select value={selectedPaymentTerm} onChange={handlePaymentTermChange} options={paymentTermOptions} isClearable placeholder="Select Payment Term..." />
                        </Form.Group>
                      </Col>
                    )}

                    <Col md={6}>
                      <Form.Group controlId="formDueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type="date" value={due_date} onChange={(e) => setDueDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTermOfPayment">
                        <Form.Label>Term Of Payment</Form.Label>
                        <Form.Control type="text" placeholder="Enter Term Of Payment" value={term_of_payment} onChange={(e) => setTermOfPayment(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTaxRate">
                        <Form.Label>Tax Exchange Rate (Amount)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Tax Exchange Rate"
                          value={tax_exchange_rate}
                          onChange={(e) => {
                            setTaxExchangeRate(e.target.value);
                            items.forEach((item) => {
                              item.exchange_rate = parseFloat(e.target.value) || 0;
                            });
                          }}
                        />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                      <Form.Group controlId="formDocSource">
                        <Form.Label>Choose File</Form.Label>
                        <Form.Control
                          type="file"
                          placeholder="Choose File"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setDocSource(e.target.files[0]);
                            } else {
                              setDocSource(null); // or some other default value
                            }
                          }}
                        />
                      </Form.Group>
                    </Col> */}

                    {/* {docRef === "purchaseRequest" && (
                        <Col md={6}>
                          <Form.Group controlId="formVendor">
                            <Form.Label>Vendor</Form.Label>
                            <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                          </Form.Group>
                        </Col>
                      )}

                      {docRef === "purchaseOrder" && (
                        <Col md={6}>
                          <Form.Group controlId="formProject">
                            <Form.Label>Project</Form.Label>
                            <Select value={selectedProject} onChange={handleProjectChange} options={projectOptions} isClearable placeholder="Select Project..." />
                          </Form.Group>
                        </Col>
                      )}

                      {docRef === "purchaseOrder" && (
                        <Col md={6}>
                          <Form.Group controlId="formVendor">
                            <Form.Label>Vendor</Form.Label>
                            <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                          </Form.Group>
                        </Col>
                      )}

                      {docRef === "purchaseOrder" && (
                        <Col md={6}>
                          <Form.Group controlId="formPaymentTerm">
                            <Form.Label>Payment Term</Form.Label>
                            <Select value={selectedPaymentTerm} onChange={handlePaymentTermChange} options={paymentTermOptions} isClearable placeholder="Select Payment Term..." />
                          </Form.Group>
                        </Col>
                      )}

                      {docRef === "purchaseOrder" && (
                        <Col md={6}>
                          <Form.Group controlId="formDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                          </Form.Group>
                        </Col>
                      )} */}

                    {/* <Col md={6}>
                        <Form.Group controlId="formPrNumber">
                          <Form.Label>PR Number</Form.Label>
                          <Select value={selectedPrNumber} onChange={handlePrNumberChange} options={prNumberOptions} isClearable placeholder="Select PR Number..." />
                        </Form.Group>
                      </Col> */}

                    {/* <Col md={6}>
                        <Form.Group controlId="formPoNumber">
                          <Form.Label>PO Number</Form.Label>
                          <Select value={selectedPoNumber} onChange={handlePoNumberChange} options={poNumberOptions} isClearable placeholder="Select PO Number..." />
                        </Form.Group>
                      </Col> */}

                    {/* <Col md={6}>
                        <Form.Group controlId="formInternalMemo">
                          <Form.Label>Internal Memo</Form.Label>
                          <Form.Control type="text" placeholder="Enter Internal Memo" value={internalmemo} onChange={(e) => setInternalMemo(e.target.value)} required />
                        </Form.Group>
                      </Col> */}

                    {/* <Col md={6}>
                        <Form.Group controlId="formInvoiceType">
                          <Form.Label>Invoice Type</Form.Label>
                          <Form.Control type="text" placeholder="Enter Invoice Type" value={invoice_type} onChange={(e) => setInvoiceType(e.target.value)} />
                        </Form.Group>
                      </Col> */}

                    {/* {docRef === "purchaseRequest" ? (
                      <Col md={6}>
                        <Form.Group controlId="formProject">
                          <Form.Label>Project</Form.Label>
                          <Select
                            value={selectedProject}
                            onChange={handleProjectChange}
                            options={projectOptions}
                            isClearable
                            placeholder="Select Project..."
                            isDisabled={true} // Add this prop to disable the field
                          />
                        </Form.Group>
                      </Col>
                    ) : (
                      <Col md={6}>
                        <Form.Group controlId="formProject">
                          <Form.Label>Project</Form.Label>
                          <Select value={selectedProject} onChange={handleProjectChange} options={projectOptions} isClearable placeholder="Select Project..." isDisabled={docRef === "purchaseOrder"} />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}
                    {docRef === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedbothvendor} onChange={handleBothVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." isDisabled />
                        </Form.Group>
                      </Col>
                    )}
                    {!(docRef === "purchaseRequest" || docRef === "purchaseOrder") && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceStatus">
                        <Form.Label>Invoice Status</Form.Label>
                        <Form.Control type="Text" placeholder="Enter Invoice Status" value={invoice_status} onChange={(e) => setInvoiceStatus(e.target.value)} disabled />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTaxInvoiceNumber">
                        <Form.Label>Tax Invoice Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Tax Invoice Number" value={tax_invoice_number} onChange={(e) => setTaxInvoiceNumber(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formCodCorSkb">
                        <Form.Label>COD/COR, SKB</Form.Label>

                        <Select value={selectedCodCorSkb} onChange={handleCodCorSkbChange} options={codCorSkbOptions} isClearable placeholder="Select COD/COR, SKB..." />
                      </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                        <Form.Group controlId="formTypeOfPayment">
                          <Form.Label>Type of Payment</Form.Label>
                          <Form.Control type="text" placeholder="Enter Type Of Payment" value={type_of_payment} onChange={(e) => setTypeOfPayment(e.target.value)} />
                        </Form.Group>
                      </Col> */}
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
                  <Droppable droppableId="items">
                    {(provided) => (
                      <div className="table-responsive" {...provided.droppableProps} ref={provided.innerRef}>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>
                                <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === items.length && items.length > 0} />
                              </th>
                              {/* <th>ID</th> */}
                              {/* <th>Invoice Number</th> */}
                              <th>Document Referance Number</th>
                              <th>Document Referance Source</th>
                              <th>Invoice Number Vendor</th>
                              <th>Tax Invoice Number Vendor</th>
                              <th>Vendor</th>
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Departement</th>
                              <th>Product</th>
                              <th>Product Note</th>
                              <th>Currency</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Tax Exchange Rate</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Total Price</th>
                              <th>Total Price IDR</th>
                              <th>Cod, Cor, Skb</th>
                              <th>Type Of VAT</th>
                              {/* <th>Tax PPN</th> */}
                              <th>Tax PPN</th>
                              <th>Tax PPN Rate %</th>
                              {/* <th>Tax PPN Amount</th> */}
                              {/* <th>Tax PPh</th> */}
                              <th>Tax PPh Type</th>
                              <th>Tax PPh</th>
                              <th>Tax PPh Rate %</th>
                              {/* <th>Tax PPh Amount</th> */}
                              <th>Tax Base</th>
                              {/* <th>Total Price</th> */}
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="26" className="text-center">
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
                                    {docRef === "purchaseRequest" && (
                                      <Form.Group controlId="formPrNumber">
                                        {/* <Form.Label>PR Number</Form.Label> */}
                                        <Select value={selectedPrNumber} onChange={handlePrNumberChange} options={prNumberOptions} isClearable placeholder="Select PR Number..." />
                                      </Form.Group>
                                    )}

                                    {docRef === "purchaseOrder" && (
                                      <Form.Group controlId="formPoNumber">
                                        {/* <Form.Label>PO Number</Form.Label> */}
                                        <Select value={selectedPoNumber} onChange={handlePoNumberChange} options={poNumberOptions} isClearable placeholder="Select PO Number..." />
                                      </Form.Group>
                                    )}

                                    {docRef === "internalMemo" && (
                                      <Form.Group controlId="formInternalMemo">
                                        {/* <Form.Label>Internal Memo</Form.Label> */}
                                        <Form.Control type="text" placeholder="Enter Internal Memo" value={internalmemo} onChange={(e) => setInternalMemo(e.target.value)} required />
                                      </Form.Group>
                                    )}

                                    {docRef === "customerContract" && (
                                      <Form.Group controlId="formCustomerContract">
                                        {/* <Form.Label>Customer Contract</Form.Label> */}
                                        <Form.Control type="text" placeholder="Enter Document Contract" value={customer_contract} onChange={(e) => setCustomerContract(e.target.value)} required />
                                      </Form.Group>
                                    )}

                                    {docRef !== "purchaseRequest" && docRef !== "purchaseOrder" && docRef !== "internalMemo" && docRef !== "customerContract" && (
                                      <Form.Control type="number" value={item.document_reference_number} onChange={(e) => handleItemChange(index, "document_reference_number", parseFloat(e.target.value))} />
                                    )}
                                  </td>

                                  <td>
                                    <Form.Group controlId="formDocSource">
                                      {/* <Form.Label>Choose File</Form.Label> */}
                                      <Form.Control
                                        type="file"
                                        placeholder="Choose File"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            setDocSource(e.target.files[0]);
                                          } else {
                                            setDocSource(null); // or some other default value
                                          }
                                        }}
                                      />
                                    </Form.Group>
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.invoice_number_vendor} onChange={(e) => handleItemChange(index, "invoice_number_vendor", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_invoice_number_vendor} onChange={(e) => handleItemChange(index, "tax_invoice_number_vendor", parseFloat(e.target.value))} />
                                  </td>
                                  {docRef === "purchaseRequest" && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select value={vendorOptions.find(option => option.value === item.vendor)} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                                      </Form.Group>
                                    </td>
                                  )}
                                  {docRef === "purchaseOrder" && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select value={selectedbothvendor} onChange={handleBothVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." />
                                      </Form.Group>
                                    </td>
                                  )}
                                  {!(docRef === "purchaseRequest" || docRef === "purchaseOrder") && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select 
                                        value={vendorOptions.find(option => option.value === item.vendor)} 
                                        onChange={handleVendorChange} 
                                        options={allvendoroptions} isClearable placeholder="Select Vendor..." />
                                      </Form.Group>
                                    </td>
                                  )}

                                  {docRef === "purchaseRequest" ? (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        {/* <Form.Label>Project</Form.Label> */}
                                        <Select
                                          value={selectedProject}
                                          onChange={handleProjectChange}
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
                                          value={selectedProject}
                                          onChange={handleProjectChange}
                                          options={projectOptions}
                                          isClearable
                                          placeholder="Select Project..."
                                          // isDisabled={docRef === "purchaseOrder"} // Field is disabled for "purchaseOrder"
                                        />
                                      </Form.Group>
                                    </td>
                                  )}

                                  <td>
                                    <Form.Control type="number" value={item.project_contract_number} onChange={(e) => handleItemChange(index, "project_contract_number", parseFloat(e.target.value))} />
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
                                    <Form.Group controlId="formDepartment">
                                      {/* <Form.Label>Department</Form.Label> */}
                                      <Select
                                        id="department"
                                        value={selectedDepartement}
                                        onChange={(selectedOption) => {
                                          handleOptionChange(setSelectedDepartement, setDepartement, selectedOption);
                                        }}
                                        options={departementOptions}
                                        placeholder="Department..."
                                        isClearable
                                        required
                                        // isDisabled={docRef === "purchaseRequest"}
                                      />
                                    </Form.Group>{" "}
                                  </td>

                                  {/* <td>
                                      <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                    </td>
                                    <td>
                                      <Form.Control type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)} />
                                    </td> */}
                                  {/* {docRef === "purchaseRequest" || docRef === "purchaseOrder" ? (
                                      <td>
                                        <Form.Control type="number" value={item.id || selectedPrNumber?.id} onChange={(e) => handleItemChange(index, "id", e.target.value)} />
                                      </td>
                                    ) : (
                                      <td>
                                        <Form.Control type="number" value={item.id} onChange={(e) => handleItemChange(index, "id", e.target.value)} />
                                      </td>
                                    )} */}
                                  {/* <td>
                                      <Form.Control type="number" value={item.id || selectedPrNumber?.id} onChange={(e) => handleItemChange(index, "id", e.target.value)} />
                                    </td> */}

                                  {/* <td>
                                      <Form.Control type="text" value={item.invoice_number} onChange={(e) => handleItemChange(index, "invoice_number", e.target.value)} />
                                    </td> */}
                                  <td>
                                    <Select
                                      value={productOptions.find((option) => option.value === item.product)} // Menemukan produk yang sesuai
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "product", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui state
                                      }}
                                      options={productOptions} // Daftar opsi produk
                                      isClearable
                                      placeholder="Select Product..."
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                  </td>
                                  <td>
                                    <Select
                                      value={currencyOptions.find((option) => option.value === item.currency)} // Menemukan mata uang yang sesuai
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "currency", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                                      }}
                                      options={currencyOptions} // Daftar opsi mata uang
                                      // isClearable
                                      placeholder="Select Currency"
                                      defaultValue={currencyOptions.find((option) => option.value === (item.currency || "USD"))} // Set default value to USD if item.currency is not set
                                    />
                                  </td>

                                  <td className={item.currency === "IDR"}>
                                    <Form.Control type="number" value={item.tax_exchange_rate || tax_exchange_rate} min="0" onChange={(e) => handleItemChange(index, "tax_exchange_rate", parseFloat(e.target.value))} disabled />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.quantity || 0} min="0" onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    {item.currency === "IDR" ? (
                                      <Form.Control
                                        className="text-left"
                                        type="text"
                                        value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString("en-US") : 0}
                                        onChange={(e) => {
                                          const newPrice = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                          handleItemChange(index, "unit_price", newPrice);
                                          dynamicFormWidth(e);
                                        }}
                                        style={{
                                          width: `${inputWidth}px`,
                                        }}
                                      />
                                    ) : (
                                      <Form.Control
                                        className="text-left"
                                        type="text"
                                        value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString("en-US", { minimumFractionDigits: 2, useGrouping: false }) : "0"}
                                        onChange={(e) => {
                                          const input = e.target.value;

                                          // Allow only numbers, periods, and remove unwanted characters
                                          const sanitizedInput = input.replace(/[^0-9.]/g, "");

                                          // Update the state with sanitized input
                                          handleItemChange(index, "unit_price", sanitizedInput);

                                          // Optional: You can maintain original price logic if needed
                                          // handleItemChange(index, 'original_unit_price', sanitizedInput);
                                        }}
                                        onBlur={() => {
                                          const price = parseFloat(item.unit_price) || 0;
                                          handleItemChange(index, "unit_price", price); // Convert back to number on blur
                                        }}
                                      />
                                    )}
                                  </td>

                                  <td className={item.currency === "IDR"}>{item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency }) || 0}</td>

                                  <td>{item.total_price_idr?.toLocaleString("en-US", { style: "currency", currency: "IDR" }) ?? "IDR 0.00"}</td>
                                  <td>
                                    <Form.Group controlId="formCodCorSkb">
                                      {/* <Form.Label>COD/COR, SKB</Form.Label> */}

                                      <Select value={selectedCodCorSkb} onChange={handleCodCorSkbChange} options={codCorSkbOptions} isClearable placeholder="Select COD/COR, SKB..." />
                                    </Form.Group>
                                  </td>
                                  <td>
                                    <Form.Control as="select" value={item.vat_type || "Select an Option"} onChange={(e) => handleItemChange(index, "vat_type", e.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                    </Form.Control>
                                  </td>

                                  {/* <td>
                                      <Form.Control type="number" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", parseFloat(e.target.value))} />
                                    </td> */}
                                  <td>
                                    <Select
                                      value={taxPpnTypeOption.find((option) => option.value === item.tax_ppn_type) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn_type for the specific item
                                        handleItemChange(index, "tax_ppn_type", selectedOption ? selectedOption.value : "");

                                        // Update the PpnRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_ppn_rate", selectedOption.RATE);
                                          setPpnRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_ppn_rate", 0);
                                          setPpnRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      options={taxPpnTypeOption}
                                      isClearable
                                      placeholder="Select Tax PPN Type..."
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly />
                                  </td>

                                  {/* <td style={{ textAlign: "right" }}>{item.tax_ppn_amount ? item.tax_ppn_amount.toLocaleString("en-US", { style: "currency", currency: item.currency }) : "IDR 0.00"}</td> */}

                                  {/* <td>
                                      <Form.Control type="number" value={item.tax_pph} onChange={(e) => handleItemChange(index, "tax_pph", parseFloat(e.target.value))} />
                                    </td> */}
                                  {/* {docRef === "purchaseRequest" || docRef === "purchaseOrder" ? (
                                      <td>
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
                                      </td>
                                    ) : (
                                      <td>
                                        <Form.Control type="text" value={item.tax_pph_type} onChange={(e) => handleItemChange(index, "tax_pph_type", e.target.value)} />
                                      </td>
                                    )} */}

                                  {/* <td>
                                      <Select
                                        value={tax_pph_type_option.find((option) => option.value === item.tax_pph_type)}
                                        onChange={(selectedOption) => {
                                          handleItemChange(index, "tax_pph_type", selectedOption ? selectedOption.value : "");
                                          if (selectedOption) {
                                            handleItemChange(index, "PphRate", selectedOption.RATE);
                                            setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                          } else {
                                            handleItemChange(index, "PphRate", 0);
                                            setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                          }
                                        }}
                                        options={tax_pph_type_option}
                                        isClearable
                                        placeholder="Select Tax PPH Type..."
                                      />
                                    </td> */}

                                  <td>
                                    <Form.Control as="select" value={item.type_of_pph} onChange={(e) => handleItemChange(index, "type_of_pph", e.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="gross">Gross</option>
                                      <option value="nett">Nett</option>
                                    </Form.Control>
                                  </td>

                                  <td>
                                    <Select
                                      value={tax_pph_type_option.find((option) => option.value === item.tax_pph_type) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_pph_type for the specific item
                                        handleItemChange(index, "tax_pph_type", selectedOption ? selectedOption.value : "");

                                        // Update the PphRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_pph_rate", selectedOption.RATE);
                                          setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_pph_rate", 0);
                                          setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      options={tax_pph_type_option}
                                      isClearable
                                      placeholder="Select Tax PPH Type..."
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.tax_pph_rate} onChange={(e) => handleItemChange(index, "tax_pph_rate", parseFloat(e.target.value))} readOnly />
                                  </td>

                                  {/* <td>
                                      <Form.Control type="text" value={item.tax_pph_type} onChange={(e) => handleItemChange(index, "tax_pph_type", e.target.value)} />
                                    </td> */}
                                  {/* <td style={{ textAlign: "right" }}>{item.tax_pph_amount ? item.tax_pph_amount.toLocaleString("en-US", { style: "currency", currency: item.currency }) : "IDR 0.00"}</td> */}

                                  <td className="">
                                    {item.currency === "IDR" ? (
                                      <Form.Control
                                        type="text"
                                        disabled
                                        style={{
                                          textAlign: "right",
                                          width: `${inputWidth}px`,
                                          marginLeft: "auto",
                                          display: "flex",
                                        }}
                                        value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base.toLocaleString("en-US") : 0}
                                        onChange={(e) => {
                                          const newTaxBase = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                          handleItemChange(index, "tax_base", Math.max(0, newTaxBase));
                                          dynamicFormWidth(e);
                                        }}
                                      />
                                    ) : (
                                      <Form.Control
                                        type="text"
                                        disabled
                                        style={{
                                          textAlign: "right",
                                          width: `${inputWidth}px`,
                                          marginLeft: "auto",
                                          display: "flex",
                                        }}
                                        value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base : 0}
                                        onChange={(e) => {
                                          handleItemChange(index, "tax_base", Math.max(0, parseFloat(e.target.value) || 0));
                                          dynamicFormWidth(e);
                                        }}
                                      />
                                    )}
                                  </td>

                                  {/* <td>
                                      <Form.Control type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)} />
                                    </td> */}
                                  {/* <td>{item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency })}</td> */}
                                  <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                          <tfoot>
                            <tr className="text-right">
                              <td colSpan="25">Subtotal Before Discount:</td>
                              <td>
                                <strong>
                                  {items.length > 0
                                    ? calculateTotalAmount().subTotal.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: (item && item[0].currency) || "IDR",
                                      })
                                    : "IDR 0.00"}
                                </strong>
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="25">Discount:</td>
                              <td>
                                <Form.Control
                                  className="text-right"
                                  type="text"
                                  value={formattedDiscount}
                                  onChange={(e) => {
                                    // Remove any non-numeric characters for easy input
                                    dynamicFormWidth(e);
                                    const newValue = e.target.value.replace(/[^\d.-]/g, "");
                                    setDiscount(parseFloat(newValue) || 0); // Update the raw number state
                                    setFormattedDiscount(e.target.value); // Keep the input as is for display
                                  }}
                                  onBlur={() => {
                                    // When focus is lost, apply the currency format
                                    const formattedValue = discount.toLocaleString("en-US", {
                                      style: "currency",
                                      currency: items.length > 0 ? items[0].currency || "IDR" : "IDR",
                                    });
                                    setFormattedDiscount(formattedValue); // Set the formatted value for display
                                  }}
                                  onFocus={(e) => {
                                    // When the input is focused, remove currency formatting for easy editing
                                    setFormattedDiscount(discount.toString().replace(/[^\d.-]/g, "")); // Display the raw number
                                    setTimeout(() => {
                                      // Select the text for easy overwriting
                                      e.target.select();
                                    }, 0);
                                  }}
                                  style={{
                                    textAlign: "right",
                                    width: `${inputWidth}px`,
                                    marginLeft: "auto",
                                    display: "flex",
                                  }}
                                />
                              </td>
                            </tr>
                            <tr className="text-right" hidden>
                              <td colSpan="16">taxbase with pph:</td>
                              <td>
                                <strong>{calculateTotalAmount().taxbasePPH.toLocaleString("en-US", { style: "currency", currency: "IDR" })}</strong>
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="25">Subtotal After Discount:</td>
                              <td>
                                <strong>
                                  {items.length > 0
                                    ? calculateTotalAmount().subtotalAfterDiscount.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: (item && item[0].currency) || "IDR",
                                      })
                                    : "IDR 0.00"}
                                </strong>
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="25">Total PPN Amount:</td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={calculateTotalAmount().totalPPNAmount}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    const totalPPNAmount = e.target.value;
                                    newItems.forEach((item) => {
                                      item.tax_ppn_amount = totalPPNAmount / newItems.length;
                                    });
                                    setItems(newItems);
                                  }}
                                />
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="25">Total PPh Amount:</td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={calculateTotalAmount().totalPPHAmount}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    const totalPPHAmount = e.target.value;
                                    newItems.forEach((item) => {
                                      item.tax_pph_amount = totalPPHAmount / newItems.length;
                                    });
                                    setItems(newItems);
                                  }}
                                />
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="25">Total Amount:</td>
                              <td>
                                <strong>{calculateTotalAmount().totalAmount.toLocaleString("en-US", { style: "currency", currency: "IDR" })} </strong>
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
            <Button
              variant="secondary"
              className="mr-2"
              onClick={() => {
                handleRefresh();
                setIsAddingNewPurchaseInvoice(false);
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

export default AddPurchaseInvoice;
