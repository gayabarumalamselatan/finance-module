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
import CreatableSelect from "react-select/creatable";
import LookupService from "../service/LookupService";
import UpdateDataService from "../service/UpdateDataService";
import DeleteDataService from "../service/DeleteDataService";



const EditPurchaseExpanseVoucher = ({ setIsEditingPurchaseExpanse, handleRefresh, index, item, selectedData }) => {
  console.log("selectedData", selectedData);
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
  const [total_debt, setTotalDebt] = useState("");
  const [total_paid, setTotalPaid] = useState("");
  const [tax_pph, setTaxPhh] = useState("");
  const [tax_ppn, setTaxPnn] = useState("");
  const [tax_pph_rate, setTaxPhhRate] = useState("");
  const [tax_ppn_rate, setTaxPnnRate] = useState("");
  const [exchange_rate_bank, setExchangeRateBank] = useState("");

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
  const [selectedPaidTo, setSelectedPaidTo] = useState(null);
  const [selectedBankName, setSelectedBankName] = useState(null);
  const [selectedAccountBank, setSelectedAccountBank] = useState(null);
  const [selectedCurrencyBank, setSelectedCurrencyBank] = useState(null);
  const [selectedExchangeRate, setSelectedExchangeRate] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [paidToOptions, setPaidToOptions] = useState([]);
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
  const [formattedDiscount, setFormattedDiscount] = useState("IDR 0.00");
  const [discount, setDiscount] = useState(0);
  const [tax_ppn_royalty_option, setTaxPpnRoyaltyOption] = useState([]);


  
  const authToken = headers;
  useEffect(() => {
    if (selectedData) {
      const { ID,   VOUCHER_NUMBER } = selectedData[0];
      // Set data awal dari selectedData
      console.log("id and invoice number", ID, VOUCHER_NUMBER);
      setVoucherNumber(VOUCHER_NUMBER);

      LookupService.fetchLookupData(`VOUC_FORMVCBANK&filterBy=VOUCHER_NUMBER&filterValue=${VOUCHER_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const data = response.data[0];
          if (data) {
            setVoucherNumber(data.voucher_number);
            setVoucherDate(data.voucher_date);
            setPaymentSource(data.payment_source);
            setBankName(data.bank_name);
            setSelectedBankName(data.bank_name);
            setPayTo(data.paid_to);
            setAccountBank(data.account_bank);
            setSelectedPaidTo(data.paid_to);
            setNumberCheckGiro(data.number_check_giro);   
            setExchangeRate(data.exchange_rate);
            setStatus(data.status);
            setDueDate(data.due_date);
            setTaxInvoiceNumber(data.tax_invoice_number);
            // setProject(data.project);
            // if (data.payment_term) {
            //   setPaymentTerm(data.payment_term);
            // } else {
            //   console.log("payment_term not found in response data");
            // }
            
            setDescription(data.description);
            setSelectedTaxType(data.tax_ppn_type);  // For PPN Type
            setSelectedTaxPphType(data.tax_pph_type); // For PPh Type
            // setTotalTaxBase(data.total_tax_base);
            setTaxRate(data.tax_rate);
          } else {
            console.log("No data found");
          }
        })
        .catch((error) => {
          console.error("Failed to load purchase invoice data:", error);
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

      // Fetch items based on INVOICE_NUMBER and set them to state
      LookupService.fetchLookupData(`VOUC_FORMVCBANKD&filterBy=voucher_number&filterValue=${VOUCHER_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          // Set fetched items to state
          setItems(fetchedItems);

            // Lookup PPN & PPh
            LookupParamService.fetchLookupDataView("MSDT_FORMTAX", authToken, branchId)
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

              const optionsPpnRoyalty = transformedData
                .filter((item) => item.TAX_TYPE === "PPN Royalty")
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                }));
              setTaxPpnRoyaltyOption(optionsPpnRoyalty);
            })
            .catch((error) => {
              console.error("Failed to fetch currency lookup:", error);
            });

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
                expenseAccount: item.EXPENSE_ACCOUNT, 
                product_account: item.PRODUCT_ACCOUNT,

              }));

              setProductOptions(productOptions); // Set product options to state
            

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


                  LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
                  .then((employeeData) => {
                    console.log("Employee lookup data:", employeeData);
      
                    // Transform and map product data to options
                    const transformedEmployeeData = employeeData.data.map((item) =>
                      Object.keys(item).reduce((acc, key) => {
                        acc[key.toUpperCase()] = item[key];
                        return acc;
                      }, {})
                    );
      
                    const employeeOptions = transformedEmployeeData.map((item) => ({
                      value: item.NAME,
                      label: item.NAME,
                    }))
                    setEmployeeOptions(employeeOptions); // Set product options to state


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

                  

                  // Update fetched items with selected options
                  const updatedItems = fetchedItems.map((item) => {
                    const selectedProductOption = productOptions.find((option) => option.value === item.product);

                    console.log("Selected product option:", selectedProductOption);


                    const selectedProjectOption = projectOptions.find((option) => option.value === item.project);

                    console.log("Selected project option:", selectedProjectOption);


                    const selectedEmployeeOption = employeeOptions.find((option) => option.value === item.employee);

                    console.log("Selected product option:", selectedEmployeeOption);


                    const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);

                    console.log("Selected currency option:", selectedCurrencyOption);

                    setSelectedCurrency(selectedCurrencyOption);
                    setSelectedEmployee(selectedEmployeeOption);
                    setSelectedProduct(selectedProductOption);
                    setSelectedProject(selectedProjectOption);
                  });

                  // Set the updated items with selected product and currency options to state
                  setItems(fetchedItems);
                })
                .catch((error) => {
                  console.error("Failed to fetch currency lookup:", error);
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
              console.error("Failed to fetch product lookup:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to load items:", error);
        });

        //buat bank
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

       //Pi Number
       LookupParamService.fetchLookupData("PURC_FORMPUINVC&filterBy=INVOICE_STATUS&filterValue=IN_PROCESS&operation=EQUAL", authToken, branchId)
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
   
         // const filteredData = transformedData.filter(item => item.STATUS_INVOICE === "IN_PROCESS");
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
           department: item.DEPARTEMENT,
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
         expenseAccount: item.EXPENSE_ACCOUNT, 
         product_account: item.PRODUCT_ACCOUNT,
       }));
       setProductOptions(options);
     })
     .catch((error) => {
       console.error("Failed to fetch Product lookup:", error);
     });

  //      LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
  // .then((data) => {
  //   console.log("Description lookup data:", data);

  //   // Transform keys to uppercase directly in the received data
  //   const transformedData = data.data.map((item) =>
  //     Object.keys(item).reduce((acc, key) => {
  //       acc[key.toUpperCase()] = item[key];
  //       return acc;
  //     }, {})
  //   );
  //   //console.log('Transformed data:', transformedData);

  //   const options = transformedData.map((item) => ({
  //     value: item.DESCRIPTION,
  //     label: item.DESCRIPTION,
  //   }));
  //   setDescriptionOptions(options);
  // })
  // .catch((error) => {
  //   console.error("Failed to fetch Description lookup:", error);
  // });

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

  //buat Paid_to
  LookupParamService.fetchLookupDataView("VOUC_VIEWVCBANK", authToken, branchId)
  .then((data) => {
    console.log("paid to lookup data:", data);

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
    setPaidToOptions(options);
  })
  .catch((error) => {
    console.error("Failed to fetch paid to lookup:", error);
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
  // LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
  // .then((data) => {
  //   console.log("Department lookup data:", data);

  //   // Transform keys to uppercase directly in the received data
  //   const transformedData = data.data.map((item) =>
  //     Object.keys(item).reduce((acc, key) => {
  //       acc[key.toUpperCase()] = item[key];
  //       return acc;
  //     }, {})
  //   );
  //   //console.log('Transformed data:', transformedData);

  //   const options = transformedData.map((item) => ({
  //     value: item.NAME,
  //     label: item.NAME,
  //   }));
  //   setDepartmentOptions(options);
  // })
  // .catch((error) => {
  //   console.error("Failed to fetch Department lookup:", error);
  // });



      // Lookup PPN & PPh
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
          console.log("Tax_PPh :", options);
          const selectedTaxPphType = options.find((option) => option.value === selectedData[0].TAX_PPH);
          setSelectedTaxPphType(selectedTaxPphType || null);

          const optionsPpn = transformedData
            .filter((item) => item.TAX_TYPE === "PPN")
            .map((item) => ({
              value: item.NAME,
              label: item.NAME,
              RATE: item.RATE,
            }));
          setTaxPpnTypeOption(optionsPpn);
          console.log("Tax_PPN :", optionsPpn);
          const selectedPPNOption = optionsPpn.find((option) => option.value === selectedData[0].TAX_PPN);
          setSelectedTaxType(selectedPPNOption || null);

          const optionsPpnRoyalty = transformedData
          .filter((item) => item.TAX_TYPE === "PPN Royalty")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTaxPpnRoyaltyOption(optionsPpnRoyalty);

        })
        .catch((error) => {
          console.error("Failed to fetch tax lookup:", error);
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
          const selectedProjectOption = options.find((option) => option.value === selectedData[0].PROJECT);
          setSelectedProject(selectedProjectOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });

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
            value: item.NAME,
            label: item.NAME,
          }));
          setPaymentTermOptions(options);
          const selectedPaymentTermOption = options.find((option) => option.value === selectedData[0].PAYMENT_TERM);
          setSelectedPaymentTerm(selectedPaymentTermOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch payment term lookup:", error);
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
          console.log("Product :", options);
          const selectedProductOption = options.find((option) => option.value === selectedData[0].PRODUCT);
          setSelectedProduct(selectedProductOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });

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
          console.log("Department :", options);
          const selectedDepartmentOption = options.find((option) => option.value === selectedData[0].DEPARTMENT);
          setSelectedDepartment(selectedDepartmentOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });

      LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
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
          setCustomerOptions(options);
          console.log("Customer :", customer);
          const selectedCustomerOption = options.find((option) => option.value === selectedData[0].CUSTOMER);
          setSelectedCustomer(selectedCustomerOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });
    }
  }, [selectedData]);

  const handlePaymentTermChange = (selectedOption) => {
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");
  };

  // const handlePrNumberChange = (selectedOption) => {
  //   setSelectedPrNumber(selectedOption);
  //   setPrNumber(selectedOption ? selectedOption.value : "");
  // };

  // Handle PR Number Change
  // const handlePiNumberChange = (selectedOption) => {
  //   setSelectedPiNumber(selectedOption);
  //   setPiNumber(selectedOption ? selectedOption.value : "");

  //   if (selectedOption) {
  //     const projectValue = selectedOption.project || selectedOption.INVOICE_NUMBER;

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

                                        LookupParamService.fetchLookupDataView("MSDT_FORMTAX", authToken, branchId)
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
                    
                                          const optionsPpnRoyalty = transformedData
                                            .filter((item) => item.TAX_TYPE === "PPN Royalty")
                                            .map((item) => ({
                                              value: item.NAME,
                                              label: item.NAME,
                                              RATE: item.RATE,
                                            }));
                                          setTaxPpnRoyaltyOption(optionsPpnRoyalty);
                                        })
                                        .catch((error) => {
                                          console.error("Failed to fetch currency lookup:", error);
                                        });

                                        const newItems = [...items];

                                        const updatedFetchedItems = fetchedItems.map((item) => {
                                            const selectedProductOption = productOptions.find((option) => option.value === item.product);
                                            return {
                                                ...item,
                                                purchase_invoice_number: item.invoice_number,
                                                department: item.departement,
                                                exchange_rate: item.tax_exchange_rate,
                                                tax_invoice_number: item.invoice_number_vendor,
                                                // selectedProduct: selectedProductOption,
                                                // selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
                                                // selectedProject: projectOptions.find((option) => option.value === item.project),
                                                // selectedCustomer: customerOptions.find((option) => option.value === item.customer),
                                               
                                                description: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.description || "",
                                                // amount: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.totalAmount || 0,
                                                purchase_invoice_date: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_date || "",
                                                status_detail: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.status_detail || "",
                                                // invoice_number_vendor: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_number_vendor || "",
                                                coa: selectedProductOption?.expenseAccount || "", // Autofill expense_account
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
            quantity: 1,
            type_of_vat: "",
            // original_unit_price: 0,
            total_price: 0,
            vat_type: "",
            tax_ppn: "",
            tax_ppn_rate: 0,
            tax_ppn_amount: 0,
            tax_pph: "",
            tax_pph_rate: 0,
            tax_pph_amount: 0,
            tax_base: 0,
            tax_invoice_number: "",
            discount: 0,
            subTotal: 0,
            vat_included: false,
            new_unit_price: 0,
            doc_reff_num: "",
            vendor: "",
            project: "",
            customer: "",
            department: "",
            contract_number: "",
            description: "",
            // amount: 0,
            purchase_invoice_date: "",
            invoice_number_vendor: "",
            coa: "", // Reset expense_account on reset
            status_detail: "",
            product_account: "",
            exchange_rate: 0,
        };
        setItems(newItems); // Update state with reset selections
    }
};
 

const handlePaidToChange = (selectedOption) => {
  setSelectedPaidTo(selectedOption);
  setPayTo(selectedOption ? selectedOption.value : "");

  if (selectedOption) {
    // Fetch data for the selected "paid_to"
    LookupService.fetchLookupData(
      `PURC_FORMPUINVC&filterBy=VENDOR&filterValue=${selectedOption.value}&operation=EQUAL`,
      authToken,
      branchId
    )
    .then((response) => {
        const fetchedItems = response.data || [];
        console.log("Items fetched for Paid To:", fetchedItems);

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
            

            // Fetch description, total amount, invoice date, and invoice_number_vendor from "PURC_FORMPUINVC"
            LookupParamService.fetchLookupData("PURC_FORMPUINVCD", authToken, branchId)
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
                  label: item.INVOICE_NUMBER,
                  invoice_status: item.INVOICE_STATUS,
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
                  // description: item.DESCRIPTION,  
                  // totalAmount: item.TOTAL_AMOUNT,
                  // invoice_date: item.INVOICE_DATE,
                  // status_detail: item.INVOICE_STATUS,
                  // invoice_number_vendor: item.INVOICE_NUMBER_VENDOR
                }));

                const newItems = [...items];
                  
                // Map the fetched data to items
                const updatedItems = fetchedItems.map((item) => {
                  const productFromDescription = descriptionOptions.find(
                    (option) => option.value === item.invoice_number
                )?.product;

                const relatedProduct = productOptions.find(
                    (option) => option.value === productFromDescription
                );
                  return {
                    ...item,
                    db_cr: item.db_cr || "Db",
                    purchase_invoice_number: item.invoice_number,
                    purchase_invoice_date: item.invoice_date,
                    // exchange_rate: item.tax_exchange_rate,
                    // department: item.departement,
                    // purchase_invoice_date: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_date || "",
                    // description: descriptionOptions.find((desc) => desc.value === item.invoice_number) ?.description || "",
                    // product: descriptionOptions.find((option) => option.value === item.invoice_number)?.product || "",
                    product: productFromDescription || "",
                    tax_invoice_number: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_invocie_number || "",
                    project: descriptionOptions.find((option) => option.value === item.invoice_number)?.project || "",
                    project_contract_number: descriptionOptions.find((option) => option.value === item.invoice_number)?.project_contract_number || "",
                    customer: descriptionOptions.find((option) => option.value === item.invoice_number)?.customer || "",
                    department: descriptionOptions.find((option) => option.value === item.invoice_number)?.departement || "",
                    exchange_rate: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_exchange_rate || 1,
                    quantity: descriptionOptions.find((option) => option.value === item.invoice_number)?.quantity || 1,
                    unit_price: descriptionOptions.find((option) => option.value === item.invoice_number)?.unit_price || 0,
                    total_price: descriptionOptions.find((option) => option.value === item.invoice_number)?.total_price || "",
                    type_of_vat: descriptionOptions.find((option) => option.value === item.invoice_number)?.type_of_vat || "",
                    tax_ppn: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_ppn || "",
                    tax_ppn_amount: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_ppn_amount || 0,
                    type_of_pph: descriptionOptions.find((option) => option.value === item.invoice_number)?.type_of_pph || "",
                    tax_pph: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_pph || "",
                    tax_pph_amount: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_pph_amount || 0,
                    tax_base: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_base || 0,
                    // amount: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.totalAmount || 0,
                    // status_detail: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.status_detail || "",
                    // invoice_number_vendor: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_number_vendor || "",
                    coa: relatedProduct?.expenseAccount || "", // Autofill expense_account
                    product_account: relatedProduct?.product_account || "",

                  }
                });

                updatedItems.forEach((fetchedItem, i) => {
                  newItems[i] = {
                    ...newItems[i],
                    ...fetchedItem,
                  };
                });

                console.log('new', newItems)
                setItems(newItems); // Update state with the autofilled items


                // updatedFetchedItems.forEach((fetchedItem, i) => {
                //     newItems[index + i] = {
                //         ...newItems[index + i],
                //         ...fetchedItem,
                //     };
                // });

                // setItems(newItems); // Update items state with new data


              })
              .catch((error) => {
                console.error("Failed to fetch data for Paid To:", error);
              })
          })
          .catch((error) => {
            console.error("Failed to fetch data for Paid To:", error);
          })

      })
      .catch((error) => {
        console.error("Failed to fetch data for Paid To:", error);
      });
  } else {
    // Reset fields when no option is selected
    const newItems = items.map((item) => ({
      ...item,
      product: "",
      // currency: "IDR",
      unit_price: 0,
      quantity: 1,
      type_of_vat: "",
      // original_unit_price: 0,
      total_price: 0,
      vat_type: "",
      tax_ppn: "",
      tax_ppn_rate: 0,
      tax_ppn_amount: 0,
      tax_pph: "",
      tax_pph_rate: 0,
      tax_pph_amount: 0,
      tax_base: 0,
      tax_invoice_number: "",
      purchase_invoice_number: "",
      discount: 0,
      subTotal: 0,
      vat_included: false,
      new_unit_price: 0,
      doc_reff_num: "",
      // vendor: "",
      project: "",
      customer: "",
      department: "",
      contract_number: "",
      description: "",
      // amount: 0,
      purchase_invoice_date: "",
      invoice_number_vendor: "",
      coa: "", // Reset expense_account on reset
      // status_detail: "",
      // product_account: "",
      exchange_rate: 0,
      amount_paid: 0,
      project_contract_number: "",
      type_of_pph: "",
    }
  ));
  console.log('items new', newItems)
    setItems(newItems);
  }
};

  

const handlePaidToChange = (selectedOption) => {
  setSelectedPaidTo(selectedOption);
  setPayTo(selectedOption ? selectedOption.value : "");

  if (selectedOption) {
    // Fetch data for the selected "paid_to"
    LookupService.fetchLookupData(
      `PURC_FORMPUINVC&filterBy=VENDOR&filterValue=${selectedOption.value}&operation=EQUAL`,
      authToken,
      branchId
    )
    .then((response) => {
        const fetchedItems = response.data || [];
        console.log("Items fetched for Paid To:", fetchedItems);

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
            

            // Fetch description, total amount, invoice date, and invoice_number_vendor from "PURC_FORMPUINVC"
            LookupParamService.fetchLookupData("PURC_FORMPUINVCD", authToken, branchId)
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
                  label: item.INVOICE_NUMBER,
                  invoice_status: item.INVOICE_STATUS,
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
                  // description: item.DESCRIPTION,  
                  // totalAmount: item.TOTAL_AMOUNT,
                  // invoice_date: item.INVOICE_DATE,
                  // status_detail: item.INVOICE_STATUS,
                  // invoice_number_vendor: item.INVOICE_NUMBER_VENDOR
                }));

                const newItems = [...items];
                  
                // Map the fetched data to items
                const updatedItems = fetchedItems.map((item) => {
                  const productFromDescription = descriptionOptions.find(
                    (option) => option.value === item.invoice_number
                )?.product;

                const relatedProduct = productOptions.find(
                    (option) => option.value === productFromDescription
                );
                  return {
                    ...item,
                    db_cr: item.db_cr || "Db",
                    purchase_invoice_number: item.invoice_number,
                    purchase_invoice_date: item.invoice_date,
                    // exchange_rate: item.tax_exchange_rate,
                    // department: item.departement,
                    // purchase_invoice_date: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_date || "",
                    // description: descriptionOptions.find((desc) => desc.value === item.invoice_number) ?.description || "",
                    // product: descriptionOptions.find((option) => option.value === item.invoice_number)?.product || "",
                    product: productFromDescription || "",
                    tax_invoice_number: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_invocie_number || "",
                    project: descriptionOptions.find((option) => option.value === item.invoice_number)?.project || "",
                    project_contract_number: descriptionOptions.find((option) => option.value === item.invoice_number)?.project_contract_number || "",
                    customer: descriptionOptions.find((option) => option.value === item.invoice_number)?.customer || "",
                    department: descriptionOptions.find((option) => option.value === item.invoice_number)?.departement || "",
                    exchange_rate: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_exchange_rate || 1,
                    quantity: descriptionOptions.find((option) => option.value === item.invoice_number)?.quantity || 1,
                    unit_price: descriptionOptions.find((option) => option.value === item.invoice_number)?.unit_price || 0,
                    total_price: descriptionOptions.find((option) => option.value === item.invoice_number)?.total_price || "",
                    type_of_vat: descriptionOptions.find((option) => option.value === item.invoice_number)?.type_of_vat || "",
                    tax_ppn: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_ppn || "",
                    tax_ppn_amount: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_ppn_amount || 0,
                    type_of_pph: descriptionOptions.find((option) => option.value === item.invoice_number)?.type_of_pph || "",
                    tax_pph: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_pph || "",
                    tax_pph_amount: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_pph_amount || 0,
                    tax_base: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_base || 0,
                    // amount: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.totalAmount || 0,
                    // status_detail: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.status_detail || "",
                    // invoice_number_vendor: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_number_vendor || "",
                    coa: relatedProduct?.expenseAccount || "", // Autofill expense_account
                    product_account: relatedProduct?.product_account || "",

                  }
                });

                updatedItems.forEach((fetchedItem, i) => {
                  newItems[i] = {
                    ...newItems[i],
                    ...fetchedItem,
                  };
                });

                console.log('new', newItems)
                setItems(newItems); // Update state with the autofilled items


                // updatedFetchedItems.forEach((fetchedItem, i) => {
                //     newItems[index + i] = {
                //         ...newItems[index + i],
                //         ...fetchedItem,
                //     };
                // });

                // setItems(newItems); // Update items state with new data


              })
              .catch((error) => {
                console.error("Failed to fetch data for Paid To:", error);
              })
          })
          .catch((error) => {
            console.error("Failed to fetch data for Paid To:", error);
          })

      })
      .catch((error) => {
        console.error("Failed to fetch data for Paid To:", error);
      });
  } else {
    // Reset fields when no option is selected
    const newItems = items.map((item) => ({
      ...item,
      product: "",
      // currency: "IDR",
      unit_price: 0,
      quantity: 1,
      type_of_vat: "",
      // original_unit_price: 0,
      total_price: 0,
      vat_type: "",
      tax_ppn: "",
      tax_ppn_rate: 0,
      tax_ppn_amount: 0,
      tax_pph: "",
      tax_pph_rate: 0,
      tax_pph_amount: 0,
      tax_base: 0,
      tax_invoice_number: "",
      purchase_invoice_number: "",
      discount: 0,
      subTotal: 0,
      vat_included: false,
      new_unit_price: 0,
      doc_reff_num: "",
      // vendor: "",
      project: "",
      customer: "",
      department: "",
      contract_number: "",
      description: "",
      // amount: 0,
      purchase_invoice_date: "",
      invoice_number_vendor: "",
      coa: "", // Reset expense_account on reset
      // status_detail: "",
      // product_account: "",
      exchange_rate: 0,
      amount_paid: 0,
      project_contract_number: "",
      type_of_pph: "",
    }
  ));
  console.log('items new', newItems)
    setItems(newItems);
  }
};

  
const handleProductChange = (index, selectedProduct) => {
  const newItems = [...items];
  if (selectedProduct) {
      const selectedProductOption = productOptions.find(option => option.value === selectedProduct.value);

      newItems[index] = {
          ...newItems[index],
          product: selectedProduct.value,
          coa: selectedProductOption?.expenseAccount || "", 
          product_account: selectedProductOption?.product_account || ""  
      };
  } else {
      newItems[index] = {
          ...newItems[index],
          product: "",
          coa: "",
          product_account: ""
      };
  }

  setItems(newItems); // Update items state with new data
};




const handleProjectChange = (index, selectedProject) => {
  const newItems = [...items];
  if (selectedProject) {
  const selectedProjectOption = projectOptions.find(option => option.value === selectedProject.value);

  newItems[index] = {
    ...newItems[index],
    project: selectedProject.value,
    project_contract_number: selectedProjectOption?.project_contract_number || "", 
    
  };
} else {
  newItems[index] = {
      ...newItems[index],
      project: "",
      project_contract_number: ""
  };
}

  setItems(newItems); // Update items state with new data
};

 
  // bank Name
  const handleBankSelection = (selectedOption) => {
    if (selectedOption) {
      const selectedAccount = accountOptions.find(option => option.value === selectedOption.bank_account);
      setSelectedAccountBank(selectedAccount ? selectedAccount : null);
      setAccountBank(selectedOption.bank_account || "");
      setSelectedBankName(selectedOption.label);
      setBankName(selectedOption ? selectedOption.value : "");

  
    } else {
      setSelectedAccountBank(null);
      setSelectedBankName(null);
      setAccountBank(""); // Clear bank account
      setBankName(""); // Clear bank name
    }
  };

    //payment Source
    const handlePaymentSourceChange = (selectedOption) => {
      setPaymentSource(selectedOption);
    
      if (selectedOption === "" || "Bank" || "Cash") {
        setSelectedBankName(null); // Reset bank name when payment source changes
        setSelectedAccountBank(null); // Reset account bank
        setAccountBank("");
        setBankName("");
      }
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
  if (selectedOption) {
  setSelectedEmployee(selectedOption);
  setEmployee(selectedOption ? selectedOption.value : "");
} else {
  setSelectedEmployee(null);
  setEmployee("");
  }
};

const handleVendorChange  = (selectedOption) => {
  if (selectedOption) {
  setSelectedVendor(selectedOption.label);
  setPayTo(selectedOption ? selectedOption.value : "");
  } else {
  setSelectedVendor(null);
  setPayTo("");
  }
};

// const handlePaidToChange  = (selectedOption) => {
//   if (selectedOption) {
//   setSelectedPaidTo(selectedOption.label);
//   setPayTo(selectedOption ? selectedOption.value : "");
//   } else {
//   setSelectedPaidTo(null);
//   setPayTo("");
//   }
// };

const handleBothVendorChange = (selectedOption) => {
  setSelectedBothVendor(selectedOption);
  setVendor(selectedOption ? selectedOption.value : "");
};

const handleExchangeRateBankChange = (value) => {
  const parsedValue = parseFloat(value) || 0; // Ensure numeric value, default to 0 if invalid
  setExchangeRateBank(value); // Update exchange_rate_bank
  setExchangeRate(parsedValue); // Update exchange_rate
};

const handleCurrencyChange = (selectedOption) => {
  setSelectedCurrency(selectedOption);
  setCurrency(selectedOption ? selectedOption.value : "");
};

// seEffect(() => {
//   // Assuming `currencyOptions` is populated with options like { value: "IDR", label: "IDR" }
//   const defaultCurrency = currencyOptions.find(option => option.value === "IDR");
//   setSelectedCurrency(defaultCurrency);
//   setCurrency(defaultCurrency ? defaultCurrency.value : "IDR");
// }, [currencyOptions]);


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
        quantity: 1,
        unit_price: 0,
        coa: "",
        product: "",
        description: "",
        // amount: 0,
        db_cr: "Db",
        vendor: "",
        currency: "IDR",
        exchange_rate: 0,
        employee: "",
        department: "",
        project: "",
        tax_invoice_number: "",
        project_contract_number: "",
        tax_base: 0,
        vat: "Select an Option",
        customer: "",
        tax_ppn: "",
        // tax_ppn_type: "",
        tax_ppn_rate: "",
        tax_ppn_amount: 0,
        tax_pph: "",
        type_of_pph: "",
        tax_pph_rate: "",
        tax_pph_amount: 0,
        amount_paid: 0,
        total_tax_base: 0,
        // total_amount_ppn: 0,
        // total_amount_pph: 0,
        total_price: 0,
        total_price_idr: 0,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    ////// currency
     // Update dependent fields for the currency
  //    if (field === "currency") {
  //     const isIDR = value === "IDR";
  //     newItems[index].exchange_rate = isIDR ? 1 : (newItems[index].exchange_rate || 1); // Default to 1 for IDR
  //     newItems[index].total_price_idr = isIDR
  //         ? newItems[index].total_price
  //         : newItems[index].total_price * (newItems[index].exchange_rate || 1);
  // }

  // // Existing logic for quantity and unit_price
  // if (field === "quantity" || field === "unit_price") {
  //     newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;

  //     // Update IDR amount if currency is not IDR
  //     if (newItems[index].currency !== "IDR") {
  //         newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].exchange_rate || 1);
  //     } else {
  //         newItems[index].total_price_idr = newItems[index].total_price;
  //     }
  // }

  ////////////////

    // Reset fields when 'unit_price' or 'quantity' changes
    if (field === "unit_price" || field === "quantity") {
      newItems[index].type_of_vat = "";
      newItems[index].tax_ppn = "";
      newItems[index].tax_base = 0;
      newItems[index].amount_paid = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;
      if (newItems[index].vat_included !== undefined) {
        newItems[index].vat_included = false;
      }
    }

    if(field === "type_of_vat") {
      newItems[index].tax_ppn = "";
      newItems[index].tax_base = 0;
      newItems[index].amount_paid = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;
    } 


    if (field === "type_of_pph") {
      newItems[index].tax_pph = ""; // Reset tax_pph
      newItems[index].tax_pph_rate = 0; // Reset tax_pph_rate
    }

    // Update total price and total price IDR
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;

      // Calculate total_price_idr based on exchange rate if currency is not IDR
      if (newItems[index].currency === "IDR") {
        newItems[index].total_price_idr = newItems[index].total_price;
      } else {
        newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].tax_exchange_rate || 1);
      }
    }

    // Calculate VAT, PPN, and new unit price
    if (field === "tax_ppn" || field === "tax_ppn_rate") {
      const taxRate = newItems[index].tax_ppn_rate / 100;
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * taxRate;
        newItems[index].tax_base = Math.round(newItems[index].total_price / (1 + taxRate));
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].tax_base * taxRate);
        newItems[index].vat_included = true;
      } else if (["exclude", "ppn_royalty"].includes(newItems[index].type_of_vat)) {
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].total_price * taxRate);
        newItems[index].tax_base = newItems[index].total_price;
      }
    }

    // Handle non-PPN case
    if (newItems[index].type_of_vat === "non_ppn") {
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].new_unit_price = newItems[index].unit_price;
      newItems[index].tax_base = newItems[index].total_price;
      newItems[index].tax_pph_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100));
    }

    // Calculate PPh
    if (field === "type_of_pph" || field === "tax_pph_rate") {
      if (newItems[index].type_of_pph === "gross") {
        const base = newItems[index].type_of_vat === "exclude" ? newItems[index].total_price : newItems[index].tax_base;
        newItems[index].tax_pph_amount = Math.floor(base * (newItems[index].tax_pph_rate / 100));
        if (newItems[index].type_of_vat === "non_ppn") {
          newItems[index].amount_paid = Math.round(newItems[index].tax_base - newItems[index].tax_pph_amount);
        }
      } else if (newItems[index].type_of_pph === "nett") {
        const adjustedTaxBase = newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100);
        newItems[index].tax_pph_amount = Math.floor(adjustedTaxBase * (newItems[index].tax_pph_rate / 100));
        newItems[index].tax_ppn_amount = Math.floor(adjustedTaxBase * (newItems[index].tax_ppn_rate / 100));
        if (newItems[index].type_of_vat === "non_ppn") {
          newItems[index].amount_paid = Math.round(newItems[index].tax_base / (1-(newItems[index].tax_pph_rate / 100)) - (newItems[index].tax_pph_amount * 2));
        }
      }
    }
    //calculate amount paid
    if (field === "tax_ppn" || field === "tax_ppn_rate" || field === "type_of_pph" || field === "tax_pph_rate") {
      if ((newItems[index].type_of_vat === "include" || newItems[index].type_of_vat === "exclude") && newItems[index].type_of_pph === "gross") {
        newItems[index].amount_paid = Math.round(newItems[index].tax_base - newItems[index].tax_pph_amount + newItems[index].tax_ppn_amount );
      } else if (newItems[index].type_of_vat === "include" && newItems[index].type_of_pph === "nett") {
        newItems[index].amount_paid = Math.round(newItems[index].tax_base / (1-(newItems[index].tax_pph_rate/100)) - newItems[index].tax_pph_amount + newItems[index].tax_ppn_amount );
      } else if (newItems[index].type_of_vat === "exclude" && newItems[index].type_of_pph === "nett") {
        newItems[index].amount_paid = Math.round(newItems[index].unit_price / (1-(newItems[index].tax_pph_rate/100)) - newItems[index].tax_ppn_amount + newItems[index].tax_pph_amount );
      }
    }
    setItems(newItems);
  };


  const handleDeleteItem = async (index) => {
    // Get the item to be deleted based on the index
    const itemToDelete = items[index];

    if (itemToDelete && itemToDelete.ID) {
      try {
        // Call the Delete API for the item using the ID
        const itemId = itemToDelete.ID;
        const deleteResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "VCBANKD", authToken, branchId);
        console.log("Item deleted from API successfully:", deleteResponse);

        // Proceed to update local state only if API call was successful
        const newItems = items.filter((item, i) => i !== index);
        setItems(newItems);
        setSelectedItems(selectedItems.filter((i) => i !== index));
      } catch (error) {
        console.error("Error deleting item from API:", error);
        // Optionally, you can display an error message to the user here
      }
    } else {
      // If the item doesn't have an ID, simply remove it from local state
      const newItems = items.filter((item, i) => i !== index);
      setItems(newItems);
      setSelectedItems(selectedItems.filter((i) => i !== index));
      console.log("Item removed locally, no ID found.");
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
    const subTotal = items.reduce((total, item) => {
      const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
      return total + taxBase;
    }, 0);

    const taxbasePPH = items.reduce((total, item) => {
      if (item.type_of_vat === "include" && item.type_of_pph === "nett") {
        const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
        const taxPphRate = isNaN(item.tax_pph_rate) ? 0 : item.tax_pph_rate;
        return total + taxBase / (1 - taxPphRate / 100);
      } else if (item.type_of_vat === "exclude") {
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

    // Initialize total_amount
    let total_amount = subtotalAfterDiscount;

    // Determine if any items qualify for royalty
    const hasRoyalty = items.some((item) => item.type_of_vat === "ppn_royalty");

    // Determine if any items are non_ppn
    const hasNonPPN = items.some((item) => item.type_of_vat === "non_ppn");

    // Calculate total_amount based on type_of_vat and type_of_pph
    if (hasRoyalty) {
      // If there are royalties, total amount is subtotalAfterDiscount + totalPPNAmount
      total_amount = subtotalAfterDiscount + totalPPNAmount;
    } else if (hasNonPPN) {
      // If there are non_ppn items, total amount is subtotalAfterDiscount - totalPPHAmount
      total_amount = subtotalAfterDiscount - totalPPHAmount;
    } else {
      // Calculate total amount based on the cases
      const case1 = items.some((item) => item.type_of_vat === "include" && item.type_of_pph === "gross");
      const case2 = items.some((item) => item.type_of_vat === "include" && item.type_of_pph === "nett");
      const case3 = items.some((item) => item.type_of_vat === "exclude" && item.type_of_pph === "gross");
      const case4 = items.some((item) => item.type_of_vat === "exclude" && item.type_of_pph === "nett");

      if (case1 || case3) {
        total_amount += totalPPNAmount - totalPPHAmount;
      }

      if (case2) {
        const taxBasePPNAF = Math.round(taxbasePPH);
        total_amount = taxBasePPNAF - totalPPHAmount + totalPPNAmount;
      }

      if (case4) {
        const taxBase = taxbasePPH;
        total_amount = taxBase - totalPPNAmount + totalPPHAmount;
      }
    }

    // Ensure valid total amount
    const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;

    const amount_idr = validTotalAmount * (exchange_rate_bank || 1);

    console.log("kols", subTotal);
    return {
      subTotal,
      subtotalAfterDiscount,
      taxbasePPH,
      totalPPNAmount,
      totalPPHAmount,
      totalAmount: validTotalAmount,
      amount_idr,

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
    generateVoucherNumber("DRAFT_VOUC")
    setInvoiceNumber("");
    setTitle("");
    setInternalMemo("");
    setID(null);
    setInvoiceNumber("");
    setInvoiceType("");
    setInvoiceDate("");
    setEmployee(""),
    setVendor("");
    setPayTo("");
    setPaymentTerm("");
    setDueDate("");
    setTaxRate("");
    setCoa("");
    setNumberCheckGiro("");
    setExchangeRate("");
    setPaymentSource("");
    setProductAccount("");
    setTaxInvoiceNumber("");
    setInvoiceStatus("");
    setBiMiddleRate("");
    setTypeOfPayment("");
    setTermOfPayment("");
    setProject("");
    setDescription("");
    setAccountBank("");
    setAmountPaid("");
    setItems([]);
    setSelectedItems([]);
    setSelectedPiNumber(null);
    setSelectedVendor(null);
    setSelectedPaidTo(null);
    // setSelected(null);
    // setSelectedPrNumber(null);
    setSelectedBankName(null);
    setSelectedEmployee(null);
    setSelectedAccountBank(null);
    // setSelectedPoNumber(null);
    setSelectedProduct(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    setSelectedCurrencyBank(null);
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
        // console.log("Status: ", status_request);
        const voucher_number = await generateVoucherNumber("DRAFT_VOUC");
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

        const generalInfo = {
          voucher_number,
          voucher_date, // Converts to date format
          bank_name,
          account_bank,
          exchange_rate,
        
          status: "DRAFT",
          paid_to,
          payment_source,
          number_check_giro,
          currency,
          amount_idr,
          total_paid,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await UpdateDataService.postData(generalInfo, `VCBANK&column=id&value=${id}`, authToken, branchId);
        console.log("General data posted successfully:", response);

        if (response.message === "Update Data Successfully") {
          // Iterate over items array and attempt to delete each item
          for (const item of items) {
            if (item.ID) {
              const itemId = item.ID;
              try {
                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "VCBANKD", authToken, branchId);
                console.log("Item deleted successfully:", itemResponse);
              } catch (error) {
                console.error("Error deleting item:", itemId, error);
              }
            } else {
              console.log("No ID found, skipping delete for this item:", item);
            }
          }

          // After deletion, insert updated items
          for (const item of items) {
            // Exclude rwnum, ID, status, and id_trx fields
            const { rwnum, ID, status, id_trx, ...rest } = item;

            const updatedItem = {
              ...rest,
              voucher_number,
           
              // purchase_invoice_number: item.invoice_number,
              // department: item.departement,
              // tax_invoice_number: item.invoice_number_vendor,   
              // quantity,
              // unit_price,
              type_of_vat: item.vat,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
            };
            delete updatedItem.status_request;
            delete updatedItem.ID;
            delete updatedItem.vat_included;
            delete updatedItem.invoice_number;
            delete updatedItem.invoice_date;
            delete updatedItem.vat;
            delete updatedItem.vat_type;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.tax_pph_type_2;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_pph_2;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.doc_reference;
            delete updatedItem.doc_reff;
            // delete updatedItem.total_price;
            delete updatedItem.kurs_deal;
            // delete updatedItem.unit_price;
            delete updatedItem.rwnum;
            // delete updatedItem.quantity;
            delete updatedItem.product_note;
            // delete updatedItem.tax_ppn_rate;
            // delete updatedItem.tax_pph_rate;
            // delete updatedItem.type_of_vat;
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
            delete updatedItem.discount;
            delete updatedItem.doc_reff_num;
            delete updatedItem.contract_number;
            delete updatedItem.discount;
            delete updatedItem.subTotal;
            delete updatedItem.new_unit_price;
            delete updatedItem.tax_invoice_number_vendor;        
            delete updatedItem.amount_in_idr;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
              console.log("Item inserted successfully:", itemResponse);
            } catch (error) {
              console.error("Error inserting item:", updatedItem, error);
            }
          }

          // Show success message and reset form
          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false);
        setIsEditingPurchaseExpanse(false);
        handleRefresh(); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
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
        // console.log("Status: ", status_request);
        const voucher_number = await generateVoucherNumber("VOUCHER");
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

        const generalInfo = {
          voucher_number,
          voucher_date, // Converts to date format
          bank_name,
          account_bank,
          exchange_rate,
          status: "IN_PROCESS",
          paid_to,
          payment_source,
          number_check_giro,
          currency,
          amount_idr,
          total_paid,    
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await UpdateDataService.postData(generalInfo, `VCBANK&column=id&value=${id}`, authToken, branchId);
        console.log("General data posted successfully:", response);

        if (response.message === "Update Data Successfully") {
          // Iterate over items array and attempt to delete each item
          for (const item of items) {
            if (item.ID) {
              const itemId = item.ID;
              try {
                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "VCBANKD", authToken, branchId);
                console.log("Item deleted successfully:", itemResponse);
              } catch (error) {
                console.error("Error deleting item:", itemId, error);
              }
            } else {
              console.log("No ID found, skipping delete for this item:", item);
            }
          }

          // After deletion, insert updated items
          for (const item of items) {
            // Exclude rwnum, ID, status, and id_trx fields
            const { rwnum, ID, status, id_trx, ...rest } = item;

            const updatedItem = {
              ...rest,
              voucher_number,
            
              // purchase_invoice_number: item.invoice_number,
              // department: item.departement,
              // tax_invoice_number: item.invoice_number_vendor,
              // quantity,
              // unit_price,
              type_of_vat: item.vat,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,   
            
            };
            delete updatedItem.status_request;
            delete updatedItem.ID;
            delete updatedItem.vat_included;
            delete updatedItem.invoice_number;
            delete updatedItem.invoice_date;
            delete updatedItem.vat;
            delete updatedItem.vat_type;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.tax_pph_type_2;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_pph_2;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.doc_reference;
            delete updatedItem.doc_reff;
            // delete updatedItem.total_price;
            delete updatedItem.kurs_deal;
            // delete updatedItem.unit_price;
            delete updatedItem.rwnum;
            // delete updatedItem.quantity;
            delete updatedItem.product_note;
            // delete updatedItem.tax_ppn_rate;
            // delete updatedItem.tax_pph_rate;
            // delete updatedItem.type_of_vat;
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
            delete updatedItem.discount;
            delete updatedItem.doc_reff_num;
            delete updatedItem.contract_number;
            delete updatedItem.discount;
            delete updatedItem.subTotal;
            delete updatedItem.new_unit_price;
            delete updatedItem.tax_invoice_number_vendor;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
              console.log("Item inserted successfully:", itemResponse);
            } catch (error) {
              console.error("Error inserting item:", updatedItem, error);
            }
          }

          // Show success message and reset form
          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false);
        setIsEditingPurchaseExpanse(false);
        handleRefresh(); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };

  // const taxExchangeChange = (e) => {
  //   setExchangeRate(e);
  //   console.log("taxe", exchange_rate);
  //   items.forEach((item) => {
  //     item.exchange_rate = parseFloat(e) || 0;
  //   });
  // };

  const dynamicFormWidth = (e) => {
    const contentLength = e.target.value.length;
    const newWidth = Math.max(100, contentLength * 12); // 8px per character, adjust as needed
    setInputWidth(newWidth);
  };

  const detailFormStyle = () => {
    return {
      border: 'none',
      background: 'transparent',
      color: '#000'
    }
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
                      setIsEditingPurchaseExpanse(false);
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
                      <Form.Group controlId="formPayToSource">
                        <Form.Label>Pay To Source</Form.Label>
                        <Form.Control type="text" placeholder="Enter..." value={pay_to_source} onChange={(e) => setPayToSource(e.target.value)} />
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
                        <Form.Control as="select" placeholder="" value={payment_source} onChange={(e) => handlePaymentSourceChange(e.target.value)}>
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
                          <Select
                          value={selectedBankName ? { label: selectedBankName, value: selectedBankName } : null}
                          onChange={handleBankSelection}
                          options={bankOptions}
                          isClearable
                          placeholder="Select Bank"
                        />
                        </Form.Group>
                      </Col>
                    )}

                    {payment_source === "Cash" && (
                      <Col md={6}>
                        <Form.Group controlId="formKas">
                          <Form.Label>Cash</Form.Label>
                          <Select
                          value={selectedBankName ? { label: selectedBankName, value: selectedBankName } : null}
                          onChange={handleBankSelection}
                          options={bankOptions}
                          isClearable
                          placeholder="Select Cash"
                        />
                          {/* <Select  value={selectedBankName} onChange={handleBankSelection} options={bankOptions} isClearable placeholder="Select Cash" /> */}
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
                          value={selectedPaidTo ? { label: selectedPaidTo, value: paid_to} : null}
                          onChange={selectedOption => handlePaidToChange(selectedOption)}
                          options={paidToOptions}
                          isClearable
                          placeholder="Select..." 
                        />
                    </Form.Group>
                    </Col>    


                    {/* <Col md={6}>
                      <Form.Group controlId="formCurrency">
                       <Form.Label>Currency</Form.Label>
                        <Select
                          value={currencyOptions}
                          onChange={handleItemChange}
                          options={currencyOptions}
                          isClearable
                          placeholder="Select..." 
                        />
                    </Form.Group>
                    </Col>   */}

                    <Col md={6}>
                      <Form.Group controlId="formExchangeRateBank">
                        <Form.Label>Exchange Rate Bank (Amount)</Form.Label>
                        <Form.Control 
                        type="number" 
                        value={exchange_rate} 
                        placeholder="Enter Exchange Rate Bank..."  
                        onChange={(e) => handleExchangeRateBankChange(parseFloat(e.target.value))}/>
                      </Form.Group>
                    </Col>

                     <Col md={6}>
                      <Form.Group controlId="formVoucherStatus">
                        <Form.Label>Voucher Status</Form.Label>
                        <Form.Control type="text" value={status} placeholder=""  onChange={(e) => setStatus(e.target.value)} disabled/>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                              <Form.Group controlId="formCurrency">
                                <Form.Label>Currency</Form.Label>   
                                  <Select
                                    value={selectedCurrency} // Menemukan mata uang yang sesuai
                                    onChange={(selectedOption) => { 
                                      handleCurrencyChange(selectedOption) // Memanggil handleItemChange untuk memperbarui mata uang per baris
                                    }}
                                    options={currencyOptions}
                                    isClearable
                                    placeholder="Select Currency..." 
                                  />
                                </Form.Group>
                              </Col>

                   <Col md={6}>
                      <Form.Group controlId="formIDRAmount">
                        <Form.Label>IDR Amount</Form.Label>
                        <Form.Control
                          type="text"
                          value={calculateTotalAmount().amount_idr.toLocaleString("en-US")}
                          placeholder="0"
                          onChange={(e) => {
                            const newIdrAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            setIDRAmount(index, "amount_idr", newIdrAmount)
                          }}
                          readOnly
                        />
                      </Form.Group>
                    </Col>

                    {/* 
                    <Col md={6}>
                      <Form.Group controlId="formTotalDebt">
                        <Form.Label>Total Debt</Form.Label>
                        <Form.Control
                          type="number"
                          value={total_debt}
                          placeholder="0"
                          onChange={(e) => setTotalDebt(parseFloat(e.target.value))} // Convert input to a number
                          readOnly
                        />
                      </Form.Group>
                    </Col> */}
                    <Col md={6}>
                      <Form.Group controlId="formTotalPaid">
                        <Form.Label>Total Paid</Form.Label>
                        <Form.Control
                          type="text"
                          value={calculateTotalAmount().totalAmount.toLocaleString("en-US")}
                          placeholder="0"
                          onChange={(e) => {
                            const newTotalPaid = parseFloat(e.target.value.replace(/[^\d.-]/g, ""));
                            setTotalPaid(index, "total_paid", newTotalPaid)
                          }} // Convert input to a number
                          readOnly
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
                              {/* <th>Status Detail</th> */}
                              <th>Chart of Account(COA)</th>
                              <th>Product</th>
                              {/* <th>Product Account</th> */}
                              <th>Description</th>
                              <th>Tax Invoice Number Vendor</th>
                              <th>Db/Cr</th>
                              {/* <th>Vendor</th> */}
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Department</th>
                              {/* <th>Employee</th> */}
                              {/* <th>Tax Invoice Number</th> */}
                              {/* <th>Amount</th> */}
                              {/* <th>Currency</th> */}
                             
                              <th>Exchange Rate</th>
                              {/* <th>Kurs Deal</th> */}
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Quantity</th>} */}
                              <th>Quantity</th>
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Unit Price</th>} */}
                              <th>Unit Price</th>
                              <th>Total Price</th>
                              <th hidden>Amount IDR</th>
                              {/* <th>Type of VAT</th> */}
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Type of VAT</th>} */}
                              <th>Type of VAT</th>
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Tax PPN</th>} */}
                              <th>Tax PPN</th>
                              <th>Amount PPN</th>
                              {/* <th>Total Amount PPN in IDR</th> */}
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Tax PPh Type</th>} */}
                              <th>Tax PPh Type</th>
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Tax PPh</th>} */}
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
                                <td colSpan="30" className="text-center">
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
                                      value={piNumberOptions.find(option => option.value === item.purchase_invoice_number) || null} 
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "purchase_invoice_number", selectedOption ? selectedOption.value : null);
                                        handlePiNumberChange(index, selectedOption);
                                      }}
                                      options={piNumberOptions} 
                                      isClearable placeholder="Select Invoice Number" 
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle()
                                        }),
                                      }}
                                      />
                                  </td>
                                  <td>
                                 <Form.Control type="date" value={item.purchase_invoice_date} onChange={(e) => handleItemChange(index, "purchase_invoice_date", e.target.value)} style={detailFormStyle()} />
                               </td>

                               {/* <td>
                               <Form.Control
                                      type="text"
                                      value={item.status_detail}
                                      onChange={(e) => setSelectedDescription(e.target.value)} 
                                      placeholder="..." 
                                      readOnly
                                    />
                               </td> */}

                               <td>
                               <Form.Control
                                      type="text"
                                      value={item.coa}
                                      onChange={(e) => handleProductChange(e.target.value)} 
                                      placeholder="..." 
                                      readOnly
                                      style={detailFormStyle()}
                                    />
                              </td>
                              <td>
                              <Select
                                      value={productOptions.find(option => option.value === item.product) || null} 
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "product", selectedOption ? selectedOption.value : null);
                                        handleProductChange(index, selectedOption);
                                      }}
                                      // value={productOptions.find(option => option.value === items[index]?.product)}
                                      // onChange={(selectedProduct) => handleProductChange(index, selectedProduct)}
                                      options={productOptions}
                                      isClearable
                                      placeholder="Select Product"
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle()
                                        }),
                                      }}
                                  />
                              </td>
                              {/* <td>
                               <Form.Control
                                      type="text"
                                      value={item.product_account}
                                      onChange={(e) => handleProductChange(e.target.value)} 
                                      placeholder="..." 
                                      readOnly
                                    />
                               </td> */}
                               <td>
                                 <Form.Control 
                                 type="text" 
                                 value={item.description} 
                                 placeholder="Enter..." 
                                 onChange={(e) => handleItemChange(index, "description", e.target.value)} 
                                 style={detailFormStyle()}
                                 />
                               </td>

                               <td>
                                 <Form.Control type="text" value={item.tax_invoice_number} placeholder="Enter.." onChange={(e) => handleItemChange(index, "tax_invoice_number_vendor", e.target.value)} style={detailFormStyle()}/>
                               </td>

                               <td>
                                 <Form.Control as="select" value={item.db_cr || "Db"} onChange={(e) => handleItemChange(index, "db_cr", e.target.value)}
                                  style={detailFormStyle()}>
                                 {/* <option value="Select an Option">Select an Option</option> */}
                                      <option value="Db">Db</option>
                                      <option value="Cr">Cr</option>
                                  </Form.Control>
                               </td>

                               {/* <td>
                               <Select 
                                  value={vendorOptions.find((option) => option.value === item.vendor)}
                                  onChange={(selectedOption) => handleItemChange(index, "vendor", selectedOption ? selectedOption.value : null)}
                                  options={vendorOptions}
                                  isClearable
                                  placeholder="Select Vendor..." 
                                />
                               </td> */}

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
                                      value={projectOptions.find(option => option.value === item.project) || null} 
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "project", selectedOption ? selectedOption.value : null);
                                        handleProjectChange(index, selectedOption);
                                      }}
                                      // value={productOptions.find(option => option.value === items[index]?.product)}
                                      // onChange={(selectedProduct) => handleProductChange(index, selectedProduct)}
                                      options={projectOptions}
                                      isClearable
                                      placeholder="Select Project"
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
                                      type="text"
                                      value={item.project_contract_number}
                                      onChange={(e) => setSelectedProjectContract(e.target.value)} 
                                      placeholder="Enter..." 
                                      readOnly
                                      style={detailFormStyle()}
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
                                  value={customerOptions.find((option) => option.value === item.customer) || null}
                                  onChange={(selectedOption) => {
                                    handleItemChange(index, "customer", selectedOption ? selectedOption.value : null);
                                  }}
                                  options={customerOptions}
                                  isClearable
                                  placeholder="Select Customer..." 
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
                                 value={departmentOptions.find((option) => option.value === item.department) || null}
                                 onChange={(selectedOption) => {
                                   handleItemChange(index, "department", selectedOption ? selectedOption.value : null);
                                 }}
                                  options={departmentOptions}
                                  isClearable
                                  placeholder="Select Department..." 
                                  styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      ...detailFormStyle()
                                    }),
                                  }}
                                />
                               </td>

                               {/* <td>
                               <Select 
                                  value={employeeOptions.find((option) => option.value === item.employee)}
                                  onChange={(selectedOption) => {
                                    handleItemChange(index, "employee", selectedOption ? selectedOption.value : null);
                                  }}
                                  options={employeeOptions}
                                  isClearable
                                  placeholder="Select Employee..." 
                                />
                               </td> */}

                               {/* <td>
                                 <Form.Control type="number" value={item.invoice_number} onChange={(e) => handleItemChange(index, "invoice_number", e.target.value)} />
                               </td> */}

                        
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

                                  {/* <td>
                                  <Select
                                    value={currencyOptions.find((option) => option.value === item.currency)} // Menemukan mata uang yang sesuai
                                    onChange={(selectedOption) => {
                                      handleItemChange(index, "currency", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                                    }}
                                    options={currencyOptions}
                                    // isClearable
                                    placeholder="Select Currency..." 
                                  />
                                  </td> */}

                                  <td>
                                    <Form.Control type="number" value={item.exchange_rate} min="0" onChange={(e) => handleItemChange(index, "exchange_rate", parseFloat(e.target.value))} disabled 
                                      style={detailFormStyle()}/>
                                  </td>

                                  <td>
                                    {/* {!item.purchase_invoice_number ? ( */}
                                      <Form.Control 
                                        type="number" 
                                        value={item.quantity || 0} 
                                        min="0" 
                                        onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} 
                                        style={detailFormStyle()}
                                      />
                                    {/* ) : null} */}
                                  </td>


                                  <td>
                                    {currency === "IDR" ? (
                                      <Form.Control
                                        className="text-left"
                                        type="text"
                                        value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString("en-US") : 0}
                                        onChange={(e) => {
                                          const newPrice = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                          handleItemChange(index, "unit_price", newPrice);
                                        
                                        }}
                                        style={detailFormStyle()}
                                      
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
                                        style={detailFormStyle()}
                                      
                                      />
                                    )}
                                  </td>

                                  {/* <td>
                                      <Form.Control 
                                      type="number" 
                                      value={item.amount} 
                                      min="0" 
                                      onChange={(e) => handleItemChange(index, "amount", parseFloat(e.target.value))}/>
                                  </td> */}

                                {/* <td className={currency}>
                                    {item.total_price != null && !isNaN(item.total_price)
                                      ? item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency })
                                      : "0.00"}
                                  </td> */}

                                  <td className={currency || "default-currency"}>
                                    {
                                      item.total_price != null && !isNaN(item.total_price)
                                        ? item.total_price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: currency || "IDR", // Fallback to "USD"
                                          })
                                        : 0
                                    }
                                  </td>


                                  <td hidden>{item.total_price_idr?.toLocaleString("en-US", { style: "currency", currency: "IDR" }) ?? "IDR 0.00"}</td>
                                  
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

                                  {/* <td hidden>{item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency || 0 })}</td> */}

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
                                     <Form.Control as="select" value={items[index].type_of_vat || ""} onChange={(selectedOption) => handleItemChange(index, "type_of_vat", selectedOption.target.value)}
                                       style={detailFormStyle()}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                      <option value="non_ppn">Non PPN</option>
                                      <option value="ppn_royalty">PPN Royalty</option>
                                    </Form.Control>
                                  </td>

                                    <td>
                                    <Select
                                      value={
                                        items[index].type_of_vat === "ppn_royalty" 
                                          ? (tax_ppn_royalty_option || []).find((option) => option.value === item.tax_ppn) 
                                          : (taxPpnTypeOption || []).find((option) => option.value === items[index].tax_ppn) || null
                                      }
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn for the specific item
                                        handleItemChange(index, "tax_ppn", selectedOption ? selectedOption.value : "");

                                        // Update the PpnRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_ppn_rate", selectedOption.RATE);
                                          setPpnRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_ppn_rate", 0);
                                          setPpnRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      options={items[index].type_of_vat === "ppn_royalty" ? tax_ppn_royalty_option : taxPpnTypeOption}
                                      // options={taxPpnTypeOption}
                                      isClearable
                                      placeholder="Select Tax PPN Type..."
                                      isDisabled={items[index].type_of_vat === "non_ppn"}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle()
                                        }),
                                      }}
                                    />
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
                                    {/* <Select 
                                            value={taxPpnTypeOption.find(option => option.value === item.tax_ppn)}
                                            onChange={setSelectedTaxType}
                                            options={taxPpnTypeOption}
                                            isClearable
                                            placeholder="Select PPN Type..." 
                                          /> */}
                                  </td>

                                  <td hidden>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly />
                                  </td>
                                
                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly />
                                  </td> */}
                                  {/* 
                                  <td>
                                    <Form.Control type="number" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", parseFloat(e.target.value))} />
                                  </td> */}

                                  {/* <td>
                                    <Form.Control className="text-end" type="text" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount", e.target.value)} />
                                  </td> */}

                                  <td>
                                    <Form.Control
                                      className="text-end" type="text"
                                      // value={item.tax_ppn_amount} 
                                      value={item.tax_ppn_amount !== undefined && item.tax_ppn_amount !== null ? item.tax_ppn_amount.toLocaleString("en-US") : 0}
                                      onChange={(e) => {
                                        const newAmountPpn = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                        handleItemChange(index, "tax_ppn_amount", newAmountPpn);
                                      }}
                                      readOnly
                                      style={detailFormStyle()}
                                    />
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
                                    <Form.Control as="select" value={item.type_of_pph} onChange={(e) => handleItemChange(index, "type_of_pph", e.target.value)}
                                      style={detailFormStyle()}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="gross">Gross</option>
                                      <option value="nett">Nett</option>
                                    </Form.Control>
                                  </td>

                                  <td>
                                  <Select
                                      value={tax_pph_type_option.find((option) => option.value === items[index].tax_pph) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_pph_type for the specific item
                                        handleItemChange(index, "tax_pph", selectedOption ? selectedOption.value : "");

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
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle()
                                        }),
                                      }}
                                    />
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
                                         {/* <Select 
                                            value={tax_pph_type_option.find(option => option.value === item.tax_pph)}
                                            onChange={setSelectedTaxPphType}
                                            options={tax_pph_type_option}
                                            isClearable
                                            placeholder="Select PPh Type..." 
                                          /> */}
                                  </td>

                                  <td hidden>
                                    <Form.Control type="number" value={item.tax_pph_rate} onChange={(e) => handleItemChange(index, "tax_pph_rate", parseFloat(e.target.value))} readOnly />
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
                                  {/* <td>
                                    <Form.Control className="text-end " type="text" value={item.tax_pph_amount} onChange={(e) => handleItemChange(index, "tax_pph_amount", e.target.value)} />
                                  </td> */}

                                  <td>
                                    <Form.Control
                                      className="text-end "
                                      type="text"
                                      // value={item.tax_pph_amount} 
                                      value={item.tax_pph_amount !== undefined && item.tax_pph_amount !== null ? item.tax_pph_amount.toLocaleString("en-US") : 0}
                                      onChange={(e) => {
                                        const newAmountPph = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                        handleItemChange(index, "tax_pph_amount", newAmountPph)
                                      }}
                                      readOnly
                                      style={detailFormStyle()}
                                    />
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

                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", parseFloat(e.target.value))} />
                                  </td> */}

                                  <td className="">
                                    {currency === "IDR" ? (
                                      <Form.Control
                                        type="text"
                                        disabled
                                        style={detailFormStyle()}
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

                                        style={detailFormStyle()}
                                        value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base : 0}
                                        onChange={(e) => {
                                          handleItemChange(index, "tax_base", Math.max(0, parseFloat(e.target.value) || 0));
                                          dynamicFormWidth(e);
                                        }}
                                      />
                                    )}
                                  </td>

                                  {/* <td>
                                    <Form.Control type="number" value={item.amount_paid} onChange={(e) => handleItemChange(index, "amount_paid", parseFloat(e.target.value))} />
                                  </td> */}

                                  {/* <td>
                                    <Form.Control
                                      type="number"
                                      value={items[index]?.amount_paid }
                                      onChange={(e) =>
                                        handleItemChange(index, "amount_paid", parseFloat(e.target.value))
                                      }
                                    />
                                  </td> */}

                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.amount_paid}
                                      onChange={(e) => {
                                        // handleItemChange(index, "amount_paid", parseFloat(e.target.value))
                                        const newAmountPaid = parseFloat(e.target.value.replace(/[^\d.-]/g, ""));
                                        handleItemChange(index, "amount_paid", newAmountPaid);
                                      }}
                                      style={detailFormStyle()}
                                    />
                                  </td>

                
                                  <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                          
                          <tr>
                            <td colSpan="30" className="text-left">
                              <div>
                                <Button variant="success" size="sm" onClick={handleAddItem}>
                                  <i className="fas fa-plus"></i> New Item
                                </Button>
                              </div>
                            </td>
                          </tr>

                        </table>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Card.Body>

              <Card.Footer>
                <table className="table table-bordered">
                  <tbody>
                    {/* <tr>
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
                            </tr> */}


                    <tr className="text-right">
                      <td colSpan="16">Subtotal:</td>
                      <td className="text-right col-2">
                        <strong>
                          {items.length > 0
                            ? calculateTotalAmount().subtotalAfterDiscount.toLocaleString("en-US", {
                              style: "currency",
                              currency: currency || "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })
                            : "IDR 0.00"}
                        </strong>
                      </td>
                    </tr>

                    <tr className="text-right">
                      <td colSpan="16">Total PPN Amount:</td>
                      <td>
                        <Form.Control
                          className="text-right"
                          type="text"
                          value={calculateTotalAmount().totalPPNAmount.toLocaleString("en-US") || 0}
                          onChange={(e) => {
                            // dynamicFormWidth(e.target.value, index);
                            const newItems = [...items];
                            const totalPPNAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            newItems.forEach((item) => {
                              item.tax_ppn_amount = totalPPNAmount / newItems.length;
                            });
                            setItems(newItems);
                          }}
                          style={{
                            textAlign: "right",
                            marginLeft: "auto",
                            display: "flex",
                          }}
                        />
                      </td>
                    </tr>

                    <tr className="text-right">
                      <td colSpan="16">Total PPh Amount:</td>
                      <td>
                        <Form.Control
                          className="text-right"
                          type="text"
                          value={calculateTotalAmount().totalPPHAmount.toLocaleString("en-US") || 0}
                          onChange={(e) => {
                            // dynamicFormWidth(e.target.value, index);
                            const newItems = [...items];
                            const totalPPHAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            newItems.forEach((item) => {
                              item.tax_pph_amount = totalPPHAmount / newItems.length;
                            });
                            setItems(newItems);
                          }}
                          style={{
                            textAlign: "right",
                            marginLeft: "auto",
                            display: "flex",
                          }}
                        />
                      </td>
                    </tr>

                    <tr className="text-right">
                      <td colSpan="16">Total Amount:</td>
                      <td>
                        <strong>
                          {items.length > 0
                            ? calculateTotalAmount(currency).totalAmount.toLocaleString("en-US", {
                              style: "currency",
                              currency: currency || "IDR",
                              minimumFractionDigits: 0, // No decimal places
                              maximumFractionDigits: 0,
                            })
                            : "IDR 0.00"}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card.Footer>

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
                setIsEditingPurchaseExpanse(false);
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
};

export default EditPurchaseExpanseVoucher;
