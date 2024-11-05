import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Card } from "react-bootstrap";
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
import { Color } from "antd/es/color-picker";

const AddPurchaseExpanseVoucher = ({ setIsAddingNewPurchaseExpanse, handleRefresh, index, item }) => {
  const headers = getToken();
  const branchId = getBranch();
  const [voucher_number, setVoucherNumber] = useState("");
  const [voucher_date, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [bank_name, setBankName] = useState("");
  const [account_bank, setAccountBank] = useState("");
  const [exchange_rate, setExchangeRate] = useState("");
  const [status, setStatus] = useState("Draft");
  const [status_detail, setStatusDetail] = useState("");
  const [paid_to, setPayTo] = useState("");
  const [number_check_giro, setNumberCheckGiro] = useState("");
  const [giro_no, setNoGiro] = useState("");
  const [amount_idr, setIDRAmount] = useState("");
  const [payment_source, setPaymentSource] = useState("");
  const [coa, setCoa] = useState("");
  const [amount, setAmount] = useState([]);
  const [invoice_id, setInvoiceID] = useState("");
  const [db_cr, setDbCr] = useState("");
  const [tax_base, setTaxBase] = useState("");
  const [amount_paid, setAmountPaid] = useState("");
  const [employee, setEmployee] = useState("");
  const [department, setDepartment] = useState("");
  const [customer, setCustomer] = useState("");
  const [project_contract_number, setProjectContractNumber] = useState("");
  const [purchase_invoice_date, setPurchaseInvoiceDate] = useState("");

  const [currency, setCurrency] = useState()
  const [pr_number, setPrNumber] = useState("");
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [product, setProduct] = useState("");
  const [product_account, setProductAccount] = useState("");
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestorOptions, setRequestorOptions] = useState([]);
  const [selectedRequestor, setSelectedRequestor] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [amountOptions, setAmountOptions] = useState([]);
  // const [exchangeOptions, setExchangeRateOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectContractOptions, setProjectContractOptions] = useState([]);
  const [selectedProjectContract, setSelectedProjectContract] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendor, setVendor] = useState("");
  const [payment_term, setPaymentTerm] = useState("");
  const [invoice_date, setInvoiceDate] = useState("");
  const [ID, setID] = useState("");
  const [due_date, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [purchase_invoice_number, setInvoiceNumber] = useState("");
  const [piNumberOptions, setPiNumberOptions] = useState([]);
  const [selectedPiNumber, setSelectedPiNumber] = useState(null);
  const [po_number, setPoNumber] = useState("");
  const [internalmemo, setInternalMemo] = useState("");
  const [tax_rate, setTaxRate] = useState("");
  const [bi_middle_rate, setBiMiddleRate] = useState("");
  const [tax_invoice_number, setTaxInvoiceNumber] = useState("");

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedBankName, setSelectedBankName] = useState(null);
  const [selectedAccountBank, setSelectedAccountBank] = useState(null);
  const [selectedCurrencyBank, setSelectedCurrencyBank] = useState(null);
  const [selectedExchangeRate, setSelectedExchangeRate] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [currencyBankOptions, setCurrencyBankOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [ExchangeRateOptions, setExchangeRateOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [doc_reff, setDocRef] = useState("");
  const [prNumberOptions, setPrNumberOptions] = useState([]);
  const [selectedPrNumber, setSelectedPrNumber] = useState(null);
  const [poNumberOptions, setPoNumberOptions] = useState([]);
  const [selectedPoNumber, setSelectedPoNumber] = useState(null);

  const [invoice_type, setInvoiceType] = useState("");
  const [tax_pph_type_option, setTax_Pph_Type_Option] = useState([]);
  const [tax_pph_type2_option, setTax_Pph_Type2_Option] = useState([]);
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
  const [invoice_status, setInvoiceStatus] = useState("IN_PROCESS");
  const [doc_reference, setDocReference] = useState("");
  const [allvendoroptions, setAllVendorOptions] = useState([]);
  const [selectedbothvendor, setSelectedBothVendor] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const authToken = headers;


  useEffect(() => {
    const generateInitialVoucherNumber = async () => {
      const generatedVoucherNumber = await generateVoucherNumber("DRAFT_VOUC"); // Adjust the code as needed

      setVoucherNumber(generatedVoucherNumber);
    };

    generateInitialVoucherNumber();
  }, []); // Empty dependency array means this runs once on mount


  useEffect(() => {
    // Ambil data lookup untuk currency
    // MSDT_FORMEMPL adalah nama table yang menyimpan data lookup untuk currency
    // authToken dan branchId digunakan untuk mengirimkan token otorisasi dan kode cabang ke server
    LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
      .then((data) => {
        console.log("Requestor lookup data:", data);

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
        console.error("Failed to fetch Requestor lookup:", error);
      });




       // buat PI number
    // LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
    // .then((data) => {
    //   console.log("PI number lookup data:", data);

    //   // Transform keys to uppercase directly in the received data
    //   const transformedData = data.data.map((item) =>
    //     Object.keys(item).reduce((acc, key) => {
    //       acc[key.toUpperCase()] = item[key];
    //       return acc;
    //     }, {})
    //   );

    //   // Filter out PR numbers that start with "DRAFT"
    //   const filteredData = transformedData.filter((item) => !item.INVOICE_NUMBER.startsWith("DRAFT"));

    //   const options = filteredData.map((item) => ({
    //     value: item.INVOICE_NUMBER,
    //     label: item.INVOICE_NUMBER,
    //     project: item.PROJECT,
    //     id: item.ID,
    //     totalAmount: item.TOTAL_AMOUNT,
    //     currency: item.CURRENCY,
    //     quantity: item.QUANTITY,
    //     description: item.DESCRIPTION,
    //     paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
    //     dueDate: item.DUE_DATE,
    //     vendor: item.VENDOR,
    //     // ENDTOENDID: item.ENDTOENDID,
    //     customer: item.CUSTOMER,
    //     departement: item.DEPARTEMENT,
    //   }));
    //   setPiNumberOptions(options);
    // })
    // .catch((error) => {
    //   console.error("Failed to fetch PI number lookup:", error);
    // });


    // const options = transformedData
    //     .filter((item) => item.ENTITY_TYPE === "BOTH")
    //     .map((item) => ({
    //       value: item.NAME,
    //       label: item.NAME,
    //     }));
    //   setVendorOptions(options);

   
      // buat Bank_Name
      // LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
      // .then((data) => {
      //   console.log("Bank lookup data:", data);

      //   // Transform keys to uppercase directly in the received data
      //   const transformedData = data.data.map((item) =>
      //     Object.keys(item).reduce((acc, key) => {
      //       acc[key.toUpperCase()] = item[key];
      //       return acc;
      //     }, {})
      //   );
      //   //console.log('Transformed data:', transformedData);

      //   const options = transformedData.map((item) => ({
      //     value: item.BANK_NAME,
      //     label: item.BANK_NAME,

      //   }));
      //   setBankOptions(options);
      // })
      // .catch((error) => {
      //   console.error("Failed to fetch Bank lookup:", error);
      // });


      // buat Currency Bank
      LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
      .then((data) => {
        console.log("Bank Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.CURRENCY,
          label: item.CURRENCY,
        }));
        setCurrencyBankOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Bank Currency lookup:", error);
      });


       // buat Bank_Name
       LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
       .then((data) => {
         console.log("Bank lookup data:", data);
 
         // Transform keys to uppercase directly in the received data
         const transformedData = data.data.map((item) =>
           Object.keys(item).reduce((acc, key) => {
             acc[key.toUpperCase()] = item[key];
             return acc;
           }, {})
         );
         //console.log('Transformed data:', transformedData);
 
         const options = transformedData
          .filter((item) => item.TYPE !== "PETTY CASH")
          .map((item) => ({
            value: item.BANK_NAME,
            label: item.BANK_NAME,
            bank_account: item.BANK_ACCOUNT,
          }));
         setBankOptions(options);
       })
       .catch((error) => {
         console.error("Failed to fetch Bank lookup:", error);
       });


        // buat Account Bank
        LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
        .then((data) => {
          console.log("Account Bank lookup data:", data);
  
          // Transform keys to uppercase directly in the received data
          const transformedData = data.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          );
          //console.log('Transformed data:', transformedData);
  
          const options = transformedData.map((item) => ({
            value: item.BANK_ACCOUNT,
            label: item.BANK_ACCOUNT,
          }));
          setAccountOptions(options);
        })
        .catch((error) => {
          console.error("Failed to fetch Account lookup:", error);
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

    
      // //Exchnage Rate
      // LookupParamService.fetchLookupData("PURC_FORMPUINVCD", authToken, branchId)
      // .then((data) => {
      //   // console.log("Currency lookup data:", data);

      //   // Transform keys to uppercase directly in the received data
      //   const transformedData = data.data.map((item) =>
      //     Object.keys(item).reduce((acc, key) => {
      //       acc[key.toUpperCase()] = item[key];
      //       return acc;
      //     }, {})
      //   );
      //   //console.log('Transformed data:', transformedData);

      //   const options = transformedData.map((item) => ({
      //     value: item.TAX_EXCHANGE_RATE,
      //     label: item.TAX_EXCHANGE_RATE,
      //   }));
      //   setExchangeRateOptions(options);
      // })
      // .catch((error) => {
      //   console.error("Failed to fetch currency lookup:", error);
      // });



   

    // LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
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
    //     setProductOptions(options);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch currency lookup:", error);
    //   });


    //Invoice Number
    // LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
    // .then((data) => {
    //   console.log("Invoice Number lookup data:", data);

    //   // Transform keys to uppercase directly in the received data
    //   const transformedData = data.data.map((item) =>
    //     Object.keys(item).reduce((acc, key) => {
    //       acc[key.toUpperCase()] = item[key];
    //       return acc;
    //     }, {})
    //   );
    //   //console.log('Transformed data:', transformedData);

    //   const options = transformedData.map((item) => ({
    //     value: item.INVOICE_NUMBER,
    //     label: item.INVOICE_NUMBER,
    //     id: item.ID,
    //     doc_reff: item.DOC_REFF,
    //     invoice_date: item.INVOICE_DATE,
    //     payment_term: item.PAYMENT_TERM,
    //     due_date: item.DUE_DATE,
    //     invoice_status: item.INVOICE_STATUS,
    //     description: item.DESCRIPTION,
    //     total_amount: item.TOTAL_AMOUNT,
    //     term_of_payment: Item.TERM_OF_PAYMENT,
    //     tax_exchange_rate: item.TAX_EXCHANGE_RATE,
    //     total_after_discount: item.TOTAL_AFTER_DISCOUNT,
    //     total_amount_ppn: item.TOTAL_AMOUNT_PPH,
    //     total_amount_pph: item.TOTAL_AMOUNT_PPN,
    //     endtoendid: item.ENDTOENDID,
    //     total_before_discount: item.TOTAL_BEFORE_DISCOUNT,
    //     discount: item.DISCOUNT,
    //   }));
    //   setPiNumberOptions(options);
    // })
    // .catch((error) => {
    //   console.error("Failed to fetch Invoice lookup:", error);
    // });


    LookupParamService.fetchLookupData("PURC_FORMPUINVCD", authToken, branchId)
    .then((data) => {
      console.log("Invoice Number lookup data:", data);

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map((item) =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );
      //console.log('Transformed data:', transformedData);

      const options = transformedData.map((item) => ({
        value: item.INVOICE_NUMBER,
        label: item.INVOICE_NUMBER,
        product: item.PRODUCT,
        currency: item.CURRENCY,
        // quantity: item.QUANTITY,
        unit_price: item.UNIT_PRICE,
        total_price: item.TOTAL_PRICE,
        // product_note: item.PRODUCT_NOTE,
        tax_ppn: item.TAX_PPN,
        tax_ppn_rate: item.TAX_PPN_RATE,
        tax_ppn_amount: item.TAX_PPN_AMOUNT,
        tax_pph: item.TAX_PPH,
        tax_pph_rate: item.TAX_PPH_RATE,
        tax_pph_amount: item.TAX_PPH_AMOUNT,
        tax_base: item.TAX_BASE,
        type_of_vat: item.TYPE_OF_VAT,
        type_of_pph: item.TYPE_OF_PPH,
        tax_exchange_rate: item.TAX_EXCHANGE_RATE,
        total_price_idr: item.TOTAL_PRICE_IDR,
        project: item.PROJECT,
        project_contract_number: item.PROJECT_CONTRACT_NUMBER,
        customer: item.CUSTOMER,
        vendor: item.VENDOR,
        departement: item.DEPARTEMENT,
        tax_invocie_number: item.TAX_INVOICE_NUMBER,
        cod_cor_skb: item.COD_COR_SKB,
        doc_source: item.DOC_SOURCE,
        doc_reff_no: item.DOC_REFF_NO,
        invoice_number_vendor: item.INVOICE_NUMBER_VENDOR,
        status_detail: item.STATUS_DETAIL,
        id_upload: item.ID_UPLOAD,
      }));
      setPiNumberOptions(options);
    })
    .catch((error) => {
      console.error("Failed to fetch Invoice lookup:", error);
    });


    LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
  .then((data) => {
    console.log("Description lookup data:", data);

    // Transform keys to uppercase directly in the received data
    const transformedData = data.data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    );
    //console.log('Transformed data:', transformedData);

    const options = transformedData.map((item) => ({
      value: item.DESCRIPTION,
      label: item.DESCRIPTION,
    }));
    setDescriptionOptions(options);
  })
  .catch((error) => {
    console.error("Failed to fetch Description lookup:", error);
  });


     //buat project
  LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
  .then((data) => {
    console.log("Project lookup data:", data);

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
      project_contract_number: item.CONTRACT_NUMBER,
    }));
    setProjectOptions(options);
  })
  .catch((error) => {
    console.error("Failed to fetch project number lookup:", error);
  });

  LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
  .then((data) => {
    console.log("Project lookup data:", data);

    // Transform keys to uppercase directly in the received data
    const transformedData = data.data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    );
    //console.log('Transformed data:', transformedData);

    const options = transformedData.map((item) => ({
      value: item.CONTRACT_NUMBER,
      label: item.CONTRACT_NUMBER,
    }));
    setProjectContractOptions(options);
  })
  .catch((error) => {
    console.error("Failed to fetch project number lookup:", error);
  });

  //buat vendor
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


  //buat Customer
  LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
  .then((data) => {
    console.log("Customer lookup data:", data);

    // Transform keys to uppercase directly in the received data
    const transformedData = data.data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    );
    //console.log('Transformed data:', transformedData);

    const options = transformedData.map((item) => ({
      value: item.CUSTOMER,
      label: item.CUSTOMER,
    }));
    setCustomerOptions(options);
  })
  .catch((error) => {
    console.error("Failed to fetch Customer lookup:", error);
  });


  //buat Department
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
    console.error("Failed to fetch Department lookup:", error);
  });


    //buat Currency
    LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
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
      setCurrencyOptions(options);
    })
    .catch((error) => {
      console.error("Failed to fetch Currency lookup:", error);
    });


    //buat Employee
    LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
    .then((data) => {
      console.log("Employee lookup data:", data);
  
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
      setEmployeeOptions(options);
    })
    .catch((error) => {
      console.error("Failed to fetch Employee lookup:", error);
    });


    //buat Product
    LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
    .then((data) => {
      console.log("Product lookup data:", data);
  
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
      setEmployeeOptions(options);
    })
    .catch((error) => {
      console.error("Failed to fetch Product lookup:", error);
    });




    //buat Exchnage rate
    // LookupParamService.fetchLookupData("PURC_FORMPUINVCD", authToken, branchId)
    // .then((data) => {
    //   console.log("Departmen lookup data:", data);
  
    //   // Transform keys to uppercase directly in the received data
    //   const transformedData = data.data.map((item) =>
    //     Object.keys(item).reduce((acc, key) => {
    //       acc[key.toUpperCase()] = item[key];
    //       return acc;
    //     }, {})
    //   );
    //   //console.log('Transformed data:', transformedData);
  
    //   const options = transformedData.map((item) => ({
    //     value: item.TAX_EXCHANGE_RATE,
    //     label: item.TAX_EXCHANGE_RATE,
    //   }));
    //   setExchangeRateOptions(options);
    // })
    // .catch((error) => {
    //   console.error("Failed to fetch project lookup:", error);
    // });


    //tax PPN & tax PPh
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

        // const optionsPph = transformedData
        //   .filter((item) => item.TAX_TYPE === "PPh2")
        //   .map((item) => ({
        //     value: item.NAME,
        //     label: item.NAME,
        //     RATE: item.RATE,
        //   }));
        // setTax_Pph_Type2_Option(optionsPph);

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
        console.error("Failed to fetch lookup:", error);
      });
  }, []);

  const handlePaymentTermChange = (selectedOption) => {
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");
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
  //   } else {
  //     setSelectedProject(null);
  //     setTotalAmount(null); // Clear total amount if no option is selected
  //     setTitle(null);
  //     setID(null); // Clear the ID value if no option is selected
  //     setDescription(null);
  //   }
  // };

  // const handlePoNumberChange = (selectedOption) => {
  //   setSelectedPoNumber(selectedOption);
  //   // setPoNumber(selectedOption ? selectedOption.value : "");
  //   setDocReference(selectedOption ? selectedOption.value : "");

  //   if (selectedOption) {
  //     const projectValue = selectedOption.project || selectedOption.PO_NUMBER;

  //     const matchingProjectOption = projectOptions.find((option) => option.value === projectValue);
  //     setSelectedProject(matchingProjectOption ? matchingProjectOption : null);
  //     setProject(selectedOption.project);
  //     setID(selectedOption.id); // Set the selected ID value
  //     setTotalAmount(selectedOption.totalAmount); // Autofill total amount
  //     setTitle(selectedOption.title);
  //     setDescription(selectedOption.description); // Autofill description
  //   } else {
  //     setSelectedProject(null);
  //     setTotalAmount(null); // Clear total amount if no option is selected
  //     setTitle(null);
  //     setID(null); // Clear the ID value if no option is selected
  //     setDescription(null);
  //   }
  // };

  // const handlePiNumberChange = (selectedOption) => {
  //   setSelectedPiNumber(selectedOption);
  //   setInvoiceNumber(selectedOption ? selectedOption.value : "");

  //   if (selectedOption) {
  //     const projectValue = selectedOption.project || selectedOption.INVOICE_NUMBER;
  //     const vendorValue = selectedOption.vendor || selectedOption.INVOICE_NUMBER;

  //     const customerOption = customerOptions.find((option) => option.value === selectedOption.CUSTOMER);
  //     setCustomer(customerOption ? customerOption : null);

  //     const departementOption = departementOptions.find((option) => option.value === selectedOption.DEPARTEMENT);
  //     setDepartment(departementOption ? departementOption : null);

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
  //     // setEndToEnd(selectedOption.ENDTOENDID);
  //     // setVatType(selectedOption.TYPE_OF_VAT); // Autofill vat_type
  //     setCustomer(selectedOption.customer);
  //     setDepartment(selectedOption.DEPARTEMENT);
  //     setIdPi(selectedOption.ID);

  //     // Fetch customer and department from lookup data
  //     LookupParamService.fetchLookupData(`PURC_FORMPUINVC&filterBy=INVOICE_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
  //       .then((response) => {
  //         const fetchedData = response.data || [];
  //         console.log("fetc", fetchedData);

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
  //         LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
  //           .then((productData) => {
  //             const transformedProductData = productData.data.map((item) =>
  //               Object.keys(item).reduce((acc, key) => {
  //                 acc[key.toUpperCase()] = item[key];
  //                 return acc;
  //               }, {})
  //             );

  //             const productOptions = transformedProductData.map((item) => ({
  //               value: item.PRODUCT,
  //               label: item.PRODUCT,
  //             }));

  //             setProductOptions(productOptions);

  //             // Fetch currency lookup data
  //             LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
  //               .then((currencyData) => {
  //                 const transformedCurrencyData = currencyData.data.map((item) =>
  //                   Object.keys(item).reduce((acc, key) => {
  //                     acc[key.toUpperCase()] = item[key];
  //                     return acc;
  //                   }, {})
  //                 );

  //                 const currencyOptions = transformedCurrencyData.map((item) => ({
  //                   value: item.CURRENCY,
  //                   label: item.CURRENCY,
  //                 }));

  //                 setCurrencyOptions(currencyOptions);

  //                 // Update fetched items with selected product and currency options
  //                 const updatedItems = fetchedData.map((item) => {
  //                   const selectedProductOption = productOptions.find((option) => option.value === item.product);
  //                   const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);
  //                   const selectedVendorOption = vendorOptions.find((option) => option.value === item.vendor);
  //                   // const selectedVat = fetchedData[0].type_of_vat;
  //                   // const selectedTypePPN = fetchedData[0].tax_ppn;
  //                   return {
  //                     ...item,
  //                     vendor: selectedVendorOption ? selectedVendorOption.value : item.vendor,
  //                     product: selectedProductOption ? selectedProductOption.value : item.product,
  //                     currency: selectedCurrencyOption ? selectedCurrencyOption.value : item.currency,
  //                     // tax_ppn_type: selectedTypePPN ? selectedTypePPN : item.tax_ppn_type,
  //                     // vat_type: selectedVat,
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
  //         console.error("Failed to load customer and department:", error);
  //       });
  //   } else {
  //     // Clear fields when no option is selected
  //     setSelectedProject(null);
  //     setTotalAmount(null);
  //     setTitle(null);
  //     setID(null);
  //     setDescription(null);
  //     // setSelectedPaymentTerm(null); // Clear payment term if no option is selected
  //     // setPaymentTerm(null); // Clear payment term if no option is selected
  //     setSelectedBothVendor(null); // Clear selectedBothVendor
  //     setItems([]);
  //   }
  // };
    
  //Handle PI
  const handlePiNumberChange = (index, selectedOption) => {
    if (selectedOption) {
        LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
            .then((response) => {
                const fetchedItems = response.data || [];
                console.log("Items fetched:", fetchedItems);

                // Fetch product lookup data with expense_account
                LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
                    .then((productData) => {
                        console.log("Product lookup data:", productData);

                        const transformedProductData = productData.data.map((item) =>
                            Object.keys(item).reduce((acc, key) => {
                                acc[key.toUpperCase()] = item[key];
                                return acc;
                            }, {})
                        );

                        const productOptions = transformedProductData.map((item) => ({
                            value: item.NAME,
                            label: item.NAME,
                            expenseAccount: item.EXPENSE_ACCOUNT, // Include expense account field
                            product_account: item.PRODUCT_ACCOUNT,
                        }));

                        setProductOptions(productOptions); // Set product options to state

                        // Fetch currency lookup data
                        LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                            .then((currencyData) => {
                                console.log("Currency lookup data:", currencyData);

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

                                // Fetch description, total amount, invoice date, and invoice_number_vendor from "PURC_FORMPUINVC"
                                LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
                                    .then((descriptionData) => {
                                        console.log("Description lookup data:", descriptionData);

                                        const transformedDescriptionData = descriptionData.data.map((item) =>
                                            Object.keys(item).reduce((acc, key) => {
                                                acc[key.toUpperCase()] = item[key];
                                                return acc;
                                            }, {})
                                        );

                                        const descriptionOptions = transformedDescriptionData.map((item) => ({
                                            value: item.INVOICE_NUMBER,
                                            description: item.DESCRIPTION,
                                            totalAmount: item.TOTAL_AMOUNT,
                                            invoice_date: item.INVOICE_DATE,
                                            status_detail: item.INVOICE_STATUS,
                                            // invoice_number_vendor: item.INVOICE_NUMBER_VENDOR
                                        }));

                                        const newItems = [...items];

                                        const updatedFetchedItems = fetchedItems.map((item) => {
                                            const selectedProductOption = productOptions.find((option) => option.value === item.product);
                                            return {
                                                ...item,
                                                doc_reff_no: item.invoice_number,
                                                // selectedProduct: selectedProductOption,
                                                // selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
                                                // selectedProject: projectOptions.find((option) => option.value === item.project),
                                                // selectedDepartment: departmentOptions.find((option) => option.value === item.departement),
                                                // selectedCustomer: customerOptions.find((option) => option.value === item.customer),
                                                description: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.description || "",
                                                totalAmount: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.totalAmount || 0,
                                                invoice_date: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_date || "",
                                                status_detail: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.status_detail || "",
                                                // invoice_number_vendor: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_number_vendor || "",
                                                expense_account: selectedProductOption?.expenseAccount || "", // Autofill expense_account
                                                product_account: selectedProductOption?.product_account || "",
                                            };
                                        });

                                        updatedFetchedItems.forEach((fetchedItem, i) => {
                                            newItems[index + i] = {
                                                ...newItems[index + i],
                                                ...fetchedItem,
                                            };
                                        });

                                        setItems(newItems); // Update items state with new data

                                    })
                                    .catch((error) => {
                                        console.error("Failed to fetch description lookup:", error);
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
            currency: "IDR",
            unit_price: 0,
            original_unit_price: 0,
            total_price: 0,
            vat_type: "",
            tax_ppn: "",
            tax_pph: "",
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
            description: "",
            totalAmount: 0,
            invoice_date: "",
            invoice_number_vendor: "",
            expense_account: "", // Reset expense_account on reset
            status_detail: "",
            product_account: "",
        };
        setItems(newItems); // Update state with reset selections
    }
};


const handleProductChange = (index, selectedProduct) => {
  const newItems = [...items];
  const selectedProductOption = productOptions.find(option => option.value === selectedProduct.value);

  newItems[index] = {
    ...newItems[index],
    product: selectedProduct.value,
    expense_account: selectedProductOption?.expenseAccount || "", 
    product_account: selectedProductOption?.product_account || ""  // Autofill product_account
  };

  setItems(newItems); // Update items state with new data
};


const handleProjectChange = (index, selectedProject) => {
  const newItems = [...items];
  const selectedProjectOption = projectOptions.find(option => option.value === selectedProject.value);

  newItems[index] = {
    ...newItems[index],
    project: selectedProject.value,
    project_contract_number: selectedProjectOption?.project_contract_number || "", 
    
  };

  setItems(newItems); // Update items state with new data
};

 
  // bank Name
  const handleBankSelection = (selectedOption) => {
    if (selectedOption) {
      const selectedAccount = accountOptions.find(option => option.value === selectedOption.bank_account);
      setSelectedAccountBank(selectedAccount ? selectedAccount : null);
      setSelectedBankName(selectedOption);
      setAccountBank(selectedAccount.value);
     
      setBankName(selectedOption ? selectedOption.value : "");
      console.log("bank name", bank_name);
      
  
    } else {
      setSelectedAccountBank(null);
      setSelectedBankName(null);
      setAccountBank(null); // Clear bank account
      setBankName(null); // Clear bank name
    }
  };
  
  // const handlePiNumberChange = async (selectedOption) => {
  //   setSelectedPiNumber(selectedOption);
  //   // setPrNumber(selectedOption ? selectedOption.value : "");
  //   setInvoieNumber(selectedOption ? selectedOption.value : "");
  //   console.log("invoice_number", invoice_number);

  //   if (selectedOption) {
  //     const projectValue = selectedOption.project || selectedOption.INVOICE_NUMBER;
  //     const vendorValue = selectedOption.vendor || selectedOption.INVOICE_NUMBER;
  //     const currencyValue = selectedOption.currency || selectedOption.INVOICE_NUMBER;

  //     const matchingVendorOption = allvendoroptions.find((option) => option.value === vendorValue);
  //     setSelectedVendor(matchingVendorOption ? matchingVendorOption : null);
  //     setVendor(selectedOption.vendor); // Autofill vendor
  //     // setSelectedBothVendor(matchingVendorOption); // Autofill vendor when PO number is chosen
  //     const matchingCurrencyOption = currencyOptions.find((option) => option.value === currencyValue);
  //     setSelectedCurrency(matchingCurrencyOption ? matchingCurrencyOption : null);
  //     setCurrencyOptions(selectedOption.currency); 

  //     const matchingProjectOption = projectOptions.find((option) => option.value === projectValue);
  //     setSelectedProject(matchingProjectOption ? matchingProjectOption : null);
  //     setProject(selectedOption.project);
  //     setID(selectedOption.id); // Set the selected ID value
  //     setTotalAmount(selectedOption.totalAmount); // Autofill total amount
  //     setTitle(selectedOption.title);
  //     setDescription(selectedOption.description); // Autofill description
  //     setPaymentTerm(selectedOption.paymentTerm);
  //     setVendor(selectedOption.vendor);
  //     // setEndToEnd(selectedOption.ENDTOENDID);
  //     setInvoiceID(selectedOption.invoice_id);

  //     const selectedPaymentTermOption = paymentTermOptions.find((option) => option.value === selectedOption.paymentTerm);
  //     if (!selectedPaymentTermOption) {
  //       console.error("Payment term is required for PR number", selectedOption.value);
  //       setSelectedPaymentTerm(null); // Clear the payment term selection
  //       return; // Exit the function to prevent further processing
  //     }
  //     setSelectedPaymentTerm(selectedPaymentTermOption);

  //     const paymentTerm = selectedOption.paymentTerm;
  //     const payload = {
  //       date: invoice_date,
  //       count: paymentTerm,
  //       dateType: paymentTermOptions.find((option) => option.value === paymentTerm).dateType,
  //     };

  //     try {
  //       // Hit the API with the required data and Bearer token in the headers
  //       const response = await axios.post(`${GENERATED_DUE_DATE}`, payload, {
  //         headers: {
  //           Authorization:`Bearer ${headers}`,
  //         },
  //       });

  //       //Process the response if needed
  //       console.log("API response:", response.data.dueDate);
  //       setDueDate(response.data.dueDate);
  //     } catch (error) {
  //       // Handle any errors
  //       console.error("Error calling API:", error);
  //     }

  //     try {
  //       const response = await LookupParamService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId);
  //       const fetchedItems = response.data || [];
  //       console.log("Items fetched:", fetchedItems);

  //       const resetItems = fetchedItems.map((item) => ({
  //         ...item,
  //         currency: item.CURRENCY,
  //         exchange_rate: item.TAX_EXCHANGE_RATE,
  //         type_of_vat: item.TYPE_OF_VAT,
  //         tax_ppn_type: item.TAX_PPN,
  //         tax_ppn_type: item.TAX_PPH,
  //         tax_base: item.TOTAL_TAX_BASE,
  //       }));
  //       // Set fetched items to state
  //       setItems(resetItems);

  //       //project lookup data
  //       try {
  //         const projectData = await LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId);
  //         console.log("Product lookup data:", projectData);

  //         // Transform and map product data to options
  //         const transformedProjectData = productData.data.map((item) =>
  //           Object.keys(item).reduce((acc, key) => {
  //             acc[key.toUpperCase()] = item[key];
  //             return acc;
  //           }, {})
  //         );

  //         const projectOptions = transformedProjectData.map((item) => ({
  //           value: item.PROJECT,
  //           label: item.PROJECT,
  //         }));

  //         setProjectOptions(projectOptions); // Set product options to state

  //         try {
  //           const vendorData = await LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId);
  //           console.log("Product lookup data:", productData);
  
  //           // Transform and map product data to options
  //           const transformedVendorData = vendorData.data.map((item) =>
  //             Object.keys(item).reduce((acc, key) => {
  //               acc[key.toUpperCase()] = item[key];
  //               return acc;
  //             }, {})
  //           );
  
  //           const vendorOptions = transformedVendorData.map((item) => ({
  //             value: item.VENDOR,
  //             label: item.VENDOR,
  //           }));
  
  //           setVendorOptions(vendorOptions); // Set product options to state

  //         //Fetch currency lookup data
  //         try {
  //           const currencyData = await LookupParamService.fetchLookupData("PURC_FORMPUINVCD", authToken, branchId);
  //           console.log("Currency lookup data:", currencyData);

  //           // Transform and map currency data to options
  //           const transformedCurrencyData = currencyData.data.map((item) =>
  //             Object.keys(item).reduce((acc, key) => {
  //               acc[key.toUpperCase()] = item[key];
  //               return acc;
  //             }, {})
  //           );

  //           const currencyOptions = transformedCurrencyData.map((item) => ({
  //             value: item.CODE,
  //             label: item.CODE,
  //           }));

  //           setCurrencyOptions(currencyOptions); // Set currency options to state

  //           // Update fetched items with selected options
  //           const updatedItems = fetchedItems.map((item) => {
  //             const selectedProjectOption = projectOptions.find((option) => option.value === item.project);
  //             console.log("Selected project option :", selectedProjectOption);

  //             const selectedVendorOption = vendorOptions.find((option) => option.value === item.vendor);
  //             console.log("Selected Vendor option :", selectedVendorOption);

  //             const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);
  //             console.log("Selected currency option:", selectedCurrencyOption);

  //             const selectedPaymentTerm = paymentTermOptions.find((option) => option.value === item.paymentTerm);
  //             console.log("payment term:", selectedPaymentTermOption);

  //             setSelectedCurrency(selectedCurrencyOption);
  //             setSelectedVendor(selectedVendorOption);
  //             setSelectedProject(selectedProjectOption);
  //             setSelectedPaymentTerm(selectedPaymentTermOption);
  //           });

  //           // Set the updated items with selected product and currency options to state
  //           setItems(fetchedItems);
  //         } catch (error) {
  //           console.error("Failed to fetch currency lookup:", error);
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch product lookup:", error);
  //       }
  //       } catch (error) {
  //         console.error("Failed to fetch product lookup:", error);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load items:", error);
  //     }
  //   } else {
  //     setSelectedVendor(null);
  //     setSelectedProject(null);
  //     setTotalAmount(null); // Clear total amount if no option is selected
  //     setTitle(null);
  //     setID(null); // Clear the ID value if no option is selected
  //     setDescription(null);
  //     setSelectedPaymentTerm(null);
  //     // setSelectedBothVendor(null); // Clear selectedBothVendor
  //     setSelectedVendor(null);
  //     setItems([]);
  //   } 
  // };

  const handleBankChange = (selectedOption) => {
    setSelectedBankName(selectedOption);
    setBankName(selectedOption ? selectedOption.value : "");
    console.log("bank name", bank_name);
  };


  // const handleAccountChange = (selectedOption) => {
  //   setSelectedAccountBank(selectedOption);
  //   setAccountBank(selectedOption ? selectedOption.value : "");
  // };

  const handleCurrencyBankChange = (selectedOption) => {
    setSelectedCurrencyBank(selectedOption);
    setCurrency(selectedOption ? selectedOption.value : "");
  };

  const handleEmployeeChange = (selectedOption) => {
    setSelectedEmployee(selectedOption);
    setEmployee(selectedOption ? selectedOption.value : "");
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setPayTo(selectedOption ? selectedOption.value : "");
  };

  const handleBothVendorChange = (selectedOption) => {
    setSelectedBothVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
  };

  // const handleProjectChange = (selectedOption) => {
  //   setSelectedProject(selectedOption);
  //   setProject(selectedOption ? selectedOption.value : "");
  // };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        ID: "",
        voucher_number: "",
        purchase_invoice_number:"",
        purchase_invoice_date: "",
        status_detail: "",
        coa: "",
        product: "",
        description: "",
        amount: "",
        db_cr: "Dr",
        vendor: "",
        currency: "IDR",
        exchange_rate: 0,
        employee: "",
        department: "",
        project: "",
        project_contract_number: "",
        tax_base: 0,
        vat: "Select an Option",
        // tax_ppn: 0,
        // tax_ppn_type: "",
        // tax_ppn_rate: 0,
        tax_ppn_amount: 0,
        // tax_pph: 0,
        // tax_pph_type: "",
        // tax_pph_rate: 0,
        tax_pph_amount: 0,
        amount_paid: 0,
        total_tax_base: 0,
        // total_amount_ppn: 0,
        // total_amount_pph: 0,
        total_price: 0,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    value = value === null || value === undefined ? 0 : value;
    const newItems = [...items];
    newItems[index][field] = value;

    console.log(index, field, value);  

    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = (newItems[index].quantity || 0) * (newItems[index].unit_price || 0);
    }

    if (field === "vat") {
      if (value === "include") {
        newItems[index].unit_price = (newItems[index].unit_price || 0) * 1.1;
        newItems[index].total_price = (newItems[index].quantity || 0) * newItems[index].unit_price;
      } else if (value === "exclude") {
        newItems[index].unit_price = (newItems[index].unit_price || 0) / 1.1;
        newItems[index].total_price = (newItems[index].quantity || 0) * newItems[index].unit_price;
      }
    }

    if (field === "tax_ppn_rate") {
      newItems[index].tax_ppn_amount = ((newItems[index].total_price || 0) * value) / 100;
    }

     // Autofill expense_account when product is selected
  //    if (field === "product") {
  //     const selectedProduct = productOptions.find((option) => option.value === value);
  //     newItems[index].expense_account = selectedProduct ? selectedProduct.expense_account : "";
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
    generateVoucherNumber("DRAFT_VOUC")
    setInvoiceNumber("");
    setTitle("");
    setInternalMemo("");
    setID(null);
    setInvoiceNumber("");
    setInvoiceType("");
    setInvoiceDate("");
    setVendor("");
    setPaymentTerm("");
    setDueDate("");
    setTaxRate("");
    setTaxInvoiceNumber("");
    setInvoiceStatus("");
    setBiMiddleRate("");
    setTypeOfPayment("");
    setTermOfPayment("");
    setProject("");
    setDescription("");
    setItems([]);
    setSelectedItems([]);
    setSelectedPiNumber(null);
    setSelectedVendor(null);
    // setSelected(null);
    // setSelectedPrNumber(null);
    setSelectedBankName(null);
    setSelectedEmployee(null);
    setSelectedAccountBank(null);
    // setSelectedPoNumber(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    setSelectedCurrencyBank(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

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
        const voucher_number = await generateVoucherNumber("Voucher");
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const generalInfo = {
          
          // internalmemo,
          voucher_number,
          voucher_date, // Converts to date format
          bank_name,
          account_bank,
          exchange_rate,
          // currency,
          status: "DRAFT",
          // total_amount,
          // doc_reff,
          paid_to,
          payment_source,
          number_check_giro,

          // giro_no,
          // amount_idr,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await InsertDataService.postData(generalInfo, "VCBANK", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              voucher_number,
              employee,
              
              purchase_invoice_number: item.invoice_number,
              purchase_invoice_date: item.invoice_date,
              department: item.departement,
              amount: item.totalAmount,
              tax_invoice_number: item.invoice_number_vendor,   
              coa: item.expense_account,   
      

              type_of_vat: item.vat,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
              // tax_pph: item.tax_pph_type_2,
        
              // tax_pph_amount_2: item.total_amount_pph_2,
            };
            delete updatedItem.ID;
            delete updatedItem.invoice_number;
            delete updatedItem.invoice_date;
            delete updatedItem.vat;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.tax_pph_type_2;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_pph_2;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.doc_reference;
            delete updatedItem.doc_reff;
            delete updatedItem.total_price;
            delete updatedItem.kurs_deal;
            delete updatedItem.unit_price;
            delete updatedItem.rwnum;
            delete updatedItem.quantity;
            delete updatedItem.product_note;
            delete updatedItem.tax_ppn_rate;
            delete updatedItem.tax_pph_rate;
            delete updatedItem.type_of_vat;
            delete updatedItem.type_of_pph;
            delete updatedItem.tax_exchange_rate;
            delete updatedItem.total_price_idr;
            delete updatedItem.departement;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.doc_reff_no;
            delete updatedItem.doc_source;
            delete updatedItem.invoice_number_vendor;
            delete updatedItem.id_upload;
            delete updatedItem.totalAmount;
            delete updatedItem.expense_account;


            const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
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
      const uniqueVoucherNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
      setVoucherNumber(uniqueVoucherNumber); // Updates state, if needed elsewhere in your component
      return uniqueVoucherNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate Voucher Number:", error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        const voucher_number = await generateVoucherNumber("Voucher");
        const total_amount = totalAmount;
        // Save general information and description
        const generalInfo = {
          // po_number,
          // internalmemo,
          voucher_number,
          voucher_date, // Converts to date format
          bank_name,
          account_bank,
          exchange_rate,
          // currency,
          status: "IN_PROCESS",
          // total_amount,
          // doc_reff,
          paid_to,
          payment_source,
          number_check_giro,
          // giro_no,
          // amount_idr,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await InsertDataService.postData(generalInfo, "VCBANK", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              voucher_number,
              employee,
              
              purchase_invoice_number: item.invoice_number,
              purchase_invoice_date: item.invoice_date,
              department: item.departement,
              amount: item.totalAmount,
              tax_invoice_number: item.invoice_number_vendor,   
              coa: item.expense_account,       

              type_of_vat: item.vat,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
              // tax_pph: item.tax_pph_type_2,
        
              // tax_pph_amount_2: item.total_amount_pph_2,
            };
            delete updatedItem.ID;
            delete updatedItem.invoice_number;
            delete updatedItem.invoice_date;
            delete updatedItem.vat;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.tax_pph_type_2;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_pph_2;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.doc_reference;
            delete updatedItem.doc_reff;
            delete updatedItem.total_price;
            delete updatedItem.kurs_deal;
            delete updatedItem.unit_price;
            delete updatedItem.rwnum;
            delete updatedItem.quantity;
            delete updatedItem.product_note;
            delete updatedItem.tax_ppn_rate;
            delete updatedItem.tax_pph_rate;
            delete updatedItem.type_of_vat;
            delete updatedItem.type_of_pph;
            delete updatedItem.tax_exchange_rate;
            delete updatedItem.total_price_idr;
            delete updatedItem.departement;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.doc_reff_no;
            delete updatedItem.doc_source;
            delete updatedItem.invoice_number_vendor;
            delete updatedItem.id_upload;
            delete updatedItem.totalAmount;
            delete updatedItem.total_amount;
            delete updatedItem.expense_account;

            

            const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
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

  return (
    <Fragment>
      <section className="content-header">
        {/* <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Purchase Expanse Voucher by Bank</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Purchase Expanse Voucher by Bank</li>
              </ol>
            </div>
          </div>
        </div> */}
      </section>
      <section className="content">
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>General Information</Card.Title>
                <div className="ml-auto">
                  {/* <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => {
                      handleRefresh();
                      setIsAddingNewPurchaseExpanse(false);
                    }}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </Button> */}
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
                      <Form.Group controlId="formPayToSource">
                        <Form.Label>Pay To Source</Form.Label>
                        <Form.Control type="text" placeholder="Enter Pay To Source" value={pay_to_source} onChange={(e) => setPayToSource(e.target.value)} disabled > */}
                        {/* <option value="">Select...</option> */}
                        {/* </Form.Control>
                      </Form.Group>
                    </Col> */}

                    {/* {doc_reff === "purchaseInvoice" ? (
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
                    )} */}

                        <Col md={6}>
                         <Form.Group controlId="formVoucherNumber">
                           <Form.Label>Voucher Number</Form.Label>
                           <Form.Control type="text" value={voucher_number} readOnly />
                         </Form.Group>
                       </Col>

                       <Col md={6}>
                      <Form.Group controlId="formVoucherDate">
                        <Form.Label>Voucher Date</Form.Label>
                        <Form.Control type="date" value={voucher_date} onChange={(e) => setVoucherDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formaPaymenSource">
                        <Form.Label>Payment Source</Form.Label>
                        <Form.Control as="select" placeholder="" value={payment_source} onChange={(e) => setPaymentSource(e.target.value)}>
                          <option value="">Select Payment Source</option>
                          <option value="Bank">Bank</option>
                          <option value="Cash">Cash</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    {payment_source === "Bank" && (
                      <Col md={6}>
                        <Form.Group controlId="formBank">
                          <Form.Label>Bank</Form.Label>
                          <Select value={selectedBankName} onChange={handleBankSelection} options={bankOptions} isClearable placeholder="Select Bank" />
                        </Form.Group>
                      </Col>
                    )}

                    {payment_source === "Cash" && (
                      <Col md={6}>
                        <Form.Group controlId="formKas">
                          <Form.Label>Cash</Form.Label>
                          <Select  value={selectedBankName} onChange={handleBankSelection} options={bankOptions} isClearable placeholder="Select Cash" />
                        </Form.Group>
                      </Col>
                    )}

                    <Col md={6}>
                      <Form.Group controlId="formAccountBank">
                        <Form.Label>Bank Account Number </Form.Label>
                        {/* <Select
                          value={selectedAccountBank}
                          onChange={setSelectedAccountBank}
                          options={accountOptions}
                          isClearable
                          placeholder="Select..." 
                        /> */}
                          <Form.Control
                                      type="text"
                                      value={account_bank}
                                      onChange={(e) => setAccountBank(e.target.value)} 
                                      placeholder="Enter..." 
                                    
                                    />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                        <Form.Group controlId="formPINumber">
                          <Form.Label>Invoice Number</Form.Label>
                          <Select value={selectedPiNumber} onChange={handlePiNumberChange} options={piNumberOptions} isClearable placeholder="Select PI Number..." />
                        </Form.Group>
                      </Col> */}

                    <Col md={6}>
                         <Form.Group controlId="formNoCheck">
                           <Form.Label>Check Number/Giro Number</Form.Label>
                           <Form.Control type="text" value={number_check_giro} placeholder="Enter Check Number"  onChange={(e) => setNumberCheckGiro(e.target.value)}  />
                         </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVendor">
                       <Form.Label>Paid To</Form.Label>
                        <Select
                          value={selectedVendor}
                          onChange={handleVendorChange}
                          options={vendorOptions}
                          isClearable
                          placeholder="Select..." 
                        />
                    </Form.Group>
                    </Col>    

                    
                    {/* 
                    <Col md={6}>
                      <Form.Group controlId="formPayTo">
                        <Form.Label>Paid To</Form.Label>
                        <Form.Control tyoe="text" placeholder="Select..." value={pay_to} onChange={(e) => setPayTo(e.target.value)}required>
                          <option value="">Select...</option>
                          <option value="purchaseRequest">Purchase Request</option>
                          <option value="internalMemo">Internal Memo</option>
                          <option value="purchaseOrder">Purchase Order</option>
                        </Form.Control>
                      </Form.Group>
                    </Col> */}

                    {/* {doc_reff === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Paid To</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}
                    {doc_reff === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Paid To</Form.Label>
                          <Select value={selectedbothvendor} onChange={handleBothVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}
                    {!(doc_reff === "purchaseRequest" || doc_reff === "purchaseOrder") && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Paid To</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )} */}

                    {/* {docRef === "purchaseRequest" && (
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
                    )} */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formCoaBank">
                        <Form.Label>Bank</Form.Label>
                        <Form.Control type="text" placeholder="Select Bank" value={coa_bank} onChange={(e) => setCoaBank(e.target.value)} required>
                          <option value="">Select...</option>
                          <option value="purchaseRequest">Purchase Request</option>
                          <option value="internalMemo">Internal Memo</option>
                          <option value="purchaseOrder">Purchase Order</option>
                        </Form.Control>
                      </Form.Group>
                    </Col> */}


                    <Col md={6}>
                      <Form.Group controlId="formExchangeRate">
                        <Form.Label>Exchange Rate Bank</Form.Label>
                        <Form.Control type="text" value={exchange_rate} placeholder="Enter..."  onChange={(e) => setExchangeRate(e.target.value)}/>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVoucherStatus">
                        <Form.Label>Voucher Status</Form.Label>
                        <Form.Control type="text" value={status} placeholder=""  onChange={(e) => setStatus(e.target.value)} disabled/>
                      </Form.Group>
                    </Col>
                    
                    {/* <Col md={6}>
                      <Form.Group controlId="formCurrency">
                       <Form.Label>Currency</Form.Label>
                        <Select
                          value={selectedCurrencyBank}
                          onChange={handleCurrencyBankChange}
                          options={currencyBankOptions}
                          isClearable
                          placeholder="Select..." 
                        />
                    </Form.Group>
                    </Col>     */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formTotalAmount">
                        <Form.Label>Total Amount</Form.Label>
                        <Form.Control type="number" value={totalAmount} placeholder="0"  onChange={(e) => setTotalAmount(e.target.value)} />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formTotalAmount">
                        <Form.Label>Total Amount</Form.Label>
                        <Form.Control
                          type="number"
                          value={totalAmount}
                          placeholder="0"
                          onChange={(e) => setTotalAmount(parseFloat(e.target.value))} // Convert input to a number
                        />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                         <Form.Group controlId="formVoucherNumber">
                           <Form.Label>Voucher Number</Form.Label>
                           <Form.Control type="text" value={voucher_number} placeholder="Enter Voucher Number"  onChange={(e) => setVoucherNumber(e.target.value)} />
                         </Form.Group>
                       </Col> */}
                
                    {/* 
                    <Col md={6}>
                         <Form.Group controlId="formNoCheck">
                           <Form.Label>No Check/Giro</Form.Label>
                           <Form.Control type="text" value={check_no} placeholder=""  onChange={(e) => setNoCheck(e.target.value)}  />
                         </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formIDRAnount">
                        <Form.Label>IDR Amount</Form.Label>
                        <Form.Control type="number" min="0" placeholder="Enter..." value={amount_idr} onChange={(e) => setIDRAmount(e.target.value)} required />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formIDRAmount">
                        <Form.Label>IDR Amount</Form.Label>
                        <Form.Control
                          type="number"
                          value={amount_idr}
                          placeholder="0"
                          onChange={(e) => setIDRAmount(parseFloat(e.target.value))} // Convert input to a number
                        />
                      </Form.Group>
                    </Col>
                
                       {/* <Col md={6}>
                         <Form.Group controlId="formNoCheck">
                           <Form.Label>Check Number/Giro Number</Form.Label>
                           <Form.Control type="text" value={check_no} placeholder="Enter Check Number"  onChange={(e) => setNoCheck(e.target.value)}  />
                         </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                         <Form.Group controlId="formNoGiro">
                           <Form.Label>No Giro</Form.Label>
                           <Form.Control type="text" value={giro_no} placeholder="Enter Giro Number"  onChange={(e) => setNoGiro(e.target.value)}  />
                         </Form.Group>
                    </Col> */}
{/* 
                    <Col md={6}>
                        <Form.Group controlId="formPINumber">
                          <Form.Label>PI Number</Form.Label>
                          <Select value={selectedPiNumber} onChange={handlePiNumberChange} options={piNumberOptions} isClearable placeholder="Select PI Number..." />
                        </Form.Group>
                      </Col> */}

                       {/* <Col md={6}>
                      <Form.Group controlId="formDocRef">
                        <Form.Label>Purchase Invoice</Form.Label>
                        <Form.Control as="select" placeholder="Select..." value={doc_reff} onChange={(e) => setDocRef(e.target.value)}required>
                          
                          <option value="Invoice">Invoice</option>
                        </Form.Control>
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
                          <Select value={selectedProject} onChange={handleProjectChange} options={projectOptions} isClearable placeholder="Select Project..." />
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
                          <Select value={selectedbothvendor} onChange={handleBothVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}
                    {!(docRef === "purchaseRequest" || docRef === "purchaseOrder") && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )} */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formPaymentTerm">
                        <Form.Label>Payment Term</Form.Label>
                        <Select value={selectedPaymentTerm} onChange={handlePaymentTermChange} options={paymentTermOptions} isClearable placeholder="Select Payment Term..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formDueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type="date" value={due_date} onChange={(e) => setDueDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceStatus">
                        <Form.Label>Invoice Status</Form.Label>
                        <Form.Control type="Text" placeholder="Enter Invoice Status" value={invoice_status} onChange={(e) => setInvoiceStatus(e.target.value)} disabled />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTaxRate">
                        <Form.Label>Tax Rate</Form.Label>
                        <Form.Control type="text" placeholder="Enter Tax Rate" value={tax_rate} onChange={(e) => setTaxRate(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTaxInvoiceNumber">
                        <Form.Label>Tax Invoice Number</Form.Label>
                        <Form.Control type="number" min="0" placeholder="Enter Tax Invoice Number" value={tax_invoice_number} onChange={(e) => setTaxInvoiceNumber(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formBiMiddleRate">
                        <Form.Label>BI Middle Rate</Form.Label>
                        <Form.Control type="text" placeholder="Enter BI Middle" value={bi_middle_rate} onChange={(e) => setBiMiddleRate(e.target.value)} />
                      </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formTypeOfPayment">
                        <Form.Label>Type of Payment</Form.Label>
                        <Form.Control type="text" placeholder="Enter Type Of Payment" value={type_of_payment} onChange={(e) => setTypeOfPayment(e.target.value)} />
                      </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formTermOfPayment">
                        <Form.Label>Term Of Payment</Form.Label>
                        <Form.Control type="text" placeholder="Enter Term Of Payment" value={term_of_payment} onChange={(e) => setTermOfPayment(e.target.value)} />
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
                              <th>Purchase Invoice Number</th>
                              <th>Purchase Invoice Date</th>
                              <th>Status Detail</th>
                              <th>Code/Account</th>
                              <th>Product</th>
                              <th>Product Account</th>
                              <th>Description</th>
                              <th>Tax Invoice Number Vendor</th>
                              <th>Db/Cr</th>
                              <th>Vendor</th>
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Department</th>
                              <th>Employee</th>
                              {/* <th>Tax Invoice Number</th> */}
                              <th>Amount</th>
                              <th>Currency</th>
                              <th>Exchange Rate</th>
                              {/* <th>Kurs Deal</th> */}
                              <th hidden>Amount IDR</th>
                              {/* <th>Type of VAT</th> */}
                              <th>Tax PPN</th>
                              <th>Amount PPN</th>
                              {/* <th>Total Amount PPN in IDR</th> */}
                              <th>Tax PPh</th>
                              <th>Amount PPh</th>
                              {/* <th>PPh 2</th>
                              <th>Total Amount PPh 2</th> */}
                              <th>Tax Base</th>
                              <th>Total Amount to be Paid</th>
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
                                    <Select
                                      value={piNumberOptions.find(option => option.value === item.purchase_invoice_number)} 
                                      onChange={(selectedOption) => handlePiNumberChange(index, selectedOption)} 
                                      options={piNumberOptions} 
                                      isClearable placeholder="Select Invoice Number" />
                                  
                                  </td>
                                  <td>
                                 <Form.Control type="date" value={item.invoice_date} onChange={(e) => handleItemChange(index, "purchase_invoice_date", e.target.value)} />
                               </td>

                               <td>
                               <Form.Control
                                      type="text"
                                      value={item.status_detail}
                                      onChange={(e) => setSelectedDescription(e.target.value)} 
                                      placeholder="..." 
                                      readOnly
                                    />
                               </td>

                               <td>
                                  <Form.Control 
                                      type="text" 
                                      value={items[index]?.expense_account || ""} 
                                      placeholder="..."
                                      readOnly 
                                  />
                              </td>
                              <td>
                                  <Select
                                      value={productOptions.find(option => option.value === items[index]?.product)}
                                      onChange={(selectedProduct) => handleProductChange(index, selectedProduct)}
                                      options={productOptions}
                                      placeholder="Select Product"
                                  />
                              </td>
                              <td>
                               <Form.Control
                                      type="text"
                                      value={item.product_account}
                                      onChange={(e) => handleProductChange(e.target.value)} 
                                      placeholder="..." 
                                      readOnly
                                    />
                               </td>
                               <td>
                               <Form.Control
                                      type="text"
                                      value={item.description}
                                      onChange={(e) => setSelectedDescription(e.target.value)} 
                                      placeholder="Enter..." 
                                      
                                    />
                               </td>
                               <td>
                                 <Form.Control type="text" value={item.invoice_number_vendor} placeholder="..." onChange={(e) => handleItemChange(index, "tax_invoice_number_vendor", e.target.value)} />
                               </td>

                               <td>
                                 <Form.Control as="select" value={item.db_cr || "Db"} onChange={(e) => handleItemChange(index, "db_cr", e.target.value)}>
                                 {/* <option value="Select an Option">Select an Option</option> */}
                                      <option value="Db">Db</option>
                                      <option value="Cr">Cr</option>
                                  </Form.Control>
                               </td>

                               <td>
                               <Select 
                                  value={vendorOptions.find(option => option.value === items[index].vendor)}
                                  onChange={handlePiNumberChange}
                                  options={vendorOptions}
                                  isClearable
                                  placeholder="Select Vendor..." 
                                />
                               </td>

                               {/* <td>
                                 <Form.Control type="text"  onChange={(e) => handleItemChange(index, "project", e.target.value)} />
                               </td> */}
                               <td>
                               {/* <Select
                                  value={projectOptions.find(option => option.value === item.project)}
                                  onChange={setSelectedProject} 
                                  options={projectOptions}
                                  isClearable
                                  placeholder="Select Project..." 
                                /> */}
                                <Select
                                      value={projectOptions.find(option => option.value === items[index]?.project)}
                                      onChange={(selectedProject) => handleProjectChange(index, selectedProject)}
                                      options={projectOptions}
                                      placeholder="Select Project"
                                  />
                                </td>

                                <td>
                               <Form.Control
                                      type="text"
                                      value={item.project_contract_number}
                                      onChange={(e) => setSelectedProjectContract(e.target.value)} 
                                      placeholder="Enter..." 
                                      readOnly
                                    />
                               </td>

                                  {/* <td>
                                  <Select
                                  value={projectContractOptions.find(option => option.value === item.project_contract_number)}
                                  onChange={setSelectedProjectContract} 
                                  options={projectContractOptions}
                                  isClearable
                                  placeholder="Project Contract..." 
                                />
                               </td> */}

                               <td>
                               <Select 
                                  value={customerOptions.find(option => option.value === item.customer)}
                                  onChange={setSelectedCustomer}
                                  options={customerOptions}
                                  isClearable
                                  placeholder="Select Customer..." 
                                />
                               </td>

                               <td>
                               <Select 
                                  value={departmentOptions.find(option => option.value === item.departement)}
                                  onChange={setSelectedDepartment}
                                  options={departmentOptions}
                                  isClearable
                                  placeholder="Select Department..." 
                                />
                               </td>

                               <td>
                               <Select 
                                  value={employeeOptions.find(option => option.value === item.employee)}
                                  onChange={handleEmployeeChange}
                                  options={employeeOptions}
                                  isClearable
                                  placeholder="Select Employee..." 
                                />
                               </td>
                               {/* <td>
                                 <Form.Control type="number" value={item.invoice_number} onChange={(e) => handleItemChange(index, "invoice_number", e.target.value)} />
                               </td> */}
                               <td>
                               <Form.Control 
                                 type="number"
                                 value={item.totalAmount}
                                 onChange={(e) => handleItemChange(e.target.value)} 
                                 placeholder="0" 
                               />
                               </td>

                             

                                  {/* <td>
                                    <Select
                                      value={productOptions.find((option) => option.value === item.product)} // Menemukan produk yang sesuai
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "product", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui state
                                      }}
                                      options={productOptions} // Daftar opsi produk
                                      isClearable
                                      placeholder="Select Product..."
                                    />
                                  </td> */}

                                  <td>
                                  <Select
                                  value={currencyOptions.find(option => option.value === item.currency)}
                                  onChange={setSelectedCurrency} 
                                  options={currencyOptions}
                                  isClearable
                                  placeholder="Select Currency..." 
                                  />
                                  </td>

                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.tax_exchange_rate}
                                      onChange={(e) => handleItemChange(e.target.value)} 
                                      placeholder="0" 
                                    />
                                  </td>

                                  
                              {/*
                               <td>
                                 <Form.Control type="text" value={item.kurs_deal} onChange={(e) => handleItemChange(index, "kurs_deal", e.target.value)} />
                               </td> */}

                                  {/* <td>
                                    <Form.Control type="number" value={item.quantity || 0} min="0" onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.unit_price || 0} min="0" onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))} />
                                  </td> */}

                                  <td hidden>{item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency || 0 })}</td>

                                  {/* <td>
                                    <Form.Control as="select" value={item.vat} onChange={(e) => handleItemChange(index, "vat", e.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                    </Form.Control>
                                  </td> */}
                                  {/* <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                  </td> */}
                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", parseFloat(e.target.value))} />
                                  </td> */}
                                        <td>
                                    {/* <Select
                                      value={taxPpnTypeOption.find((option) => option.value === item.tax_ppn_type) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn_type for the specific item
                                        handleItemChange(index, "tax_ppn_type", selectedOption ? selectedOption.value : "");

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
                                    /> */}
                                    <Select 
                                            value={taxPpnTypeOption.find(option => option.value === item.tax_ppn)}
                                            onChange={setSelectedTaxType}
                                            options={taxPpnTypeOption}
                                            isClearable
                                            placeholder="Select PPN Type..." 
                                          />
                                  </td>

                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly />
                                  </td> */}
{/* 
                                  <td>
                                    <Form.Control type="number" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", parseFloat(e.target.value))} />
                                  </td> */}

                                  <td>
                                    <Form.Control className="text-end" type="text" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount", e.target.value)} />
                                  </td>

                                  
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

                                  <td>
                                    {/* <Select
                                      value={item.tax_pph}
                                      onChange={(selectedOption) => {
                                        // Update the tax_pph_type for the specific item
                                        handleItemChange(index, "tax_pph_type", selectedOption ? selectedOption.value : "");

                                        // Update the PphRate for the specific item
                                        // if (selectedOption) {
                                        //   handleItemChange(index, "tax_pph_rate", selectedOption.RATE);
                                        //   setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        // } else {
                                        //   handleItemChange(index, "tax_pph_rate", 0);
                                        //   setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        // }
                                      }}
                                      options={tax_pph_type_option}
                                      isClearable
                                      placeholder="Select Tax PPH Type..."
                                    /> */}
                                          <Select 
                                            value={tax_pph_type_option.find(option => option.value === item.tax_pph)}
                                            onChange={setSelectedTaxPphType}
                                            options={tax_pph_type_option}
                                            isClearable
                                            placeholder="Select PPh Type..." 
                                          />
                                  </td>

 
                                {/* <td>
                                 <Form.Control type="number"  onChange={(e) => handleItemChange(index, "", e.target.value)} />
                               </td> */}
{/* 
                                  <td>
                                    <Select
                                      value={tax_pph_type_option.find((option) => option.value === item.tax_pph_type)}
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
                                  </td> */}

                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_pph_rate} onChange={(e) => handleItemChange(index, "tax_pph_rate", parseFloat(e.target.value))} readOnly />
                                  </td> */}

                                  {/* <td>
                                    <Form.Control type="text" value={item.tax_pph_type} onChange={(e) => handleItemChange(index, "tax_pph_type", e.target.value)} />
                                  </td> */}
                                  <td>
                                    <Form.Control className="text-end " type="text" value={item.tax_pph_amount} onChange={(e) => handleItemChange(index, "tax_pph_amount", e.target.value)} />
                                  </td>

                                  {/* <td>
                                    <Select
                                      value={tax_pph_type2_option.find((option) => option.value === item.tax_pph_type_2)}
                                      onChange={(selectedOption) => {
                                        // Update the tax_pph_type for the specific item
                                        handleItemChange(index, "tax_pph_type_2", selectedOption ? selectedOption.value : "");

                                        // Update the PphRate for the specific item
                                        // if (selectedOption) {
                                        //   handleItemChange(index, "tax_pph_rate", selectedOption.RATE);
                                        //   setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        // } else {
                                        //   handleItemChange(index, "tax_pph_rate", 0);
                                        //   setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        // }
                                      }}
                                      options={tax_pph_type2_option}
                                      isClearable
                                      placeholder="Select Tax PPH Type 2..."
                                    />
                                  </td> */}

                                  {/* <td>
                                    <Form.Control className="text-end " type="text" value={item.tax_pph_amount_2} onChange={(e) => handleItemChange(index, "tax_pph_amount_2", e.target.value)} />
                                  </td> */}

                                  <td>
                                    <Form.Control type="number" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", parseFloat(e.target.value))} />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.amount_paid} onChange={(e) => handleItemChange(index, "amount_paid", parseFloat(e.target.value))} />
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
                            <tr>
                              <td colSpan="24" className="text-right">
                                Sub Total:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="24" className="text-right">
                                Total PPN Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="24" className="text-right">
                                Total PPh Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="24" className="text-right">
                                Total Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>

                            <tr>
                              <td colSpan="24" className="text-right">
                                Total Dept:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="24" className="text-right">
                                Total Paid:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
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
{/* 
        <Row className="mt-4">
          <Col md={12} className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="mr-2"
              onClick={() => {
                handleRefresh();
                setIsAddingNewPurchaseExpanse(false);
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
        </Row> */}
      </section>

      {isLoading && (
        <div className="full-screen-overlay">
          <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
        </div>
      )}
    </Fragment>
  );
};

export default AddPurchaseExpanseVoucher;