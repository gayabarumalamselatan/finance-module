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
import { GENERATED_DUE_DATE } from "../config/ConfigUrl";
import axios from "axios";

const EditPettyCash = ({ setIsEditingPettyCash, handleRefresh, index, item, selectedData }) => {
  console.log("selectedData", selectedData);
  const headers = getToken();
  const branchId = getBranch();
  const [pr_number, setPrNumber] = useState("");
  const [request_date, setRequestDate] = useState("");
  const [schedule_date, setScheduleDate] = useState("");
  const [doc_no, setDocNo] = useState("FRM.PTAP.PRC.21a-01");
  const [requestor, setRequestor] = useState("");
  const [status_request, setStatusRequest] = useState("Draft");
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestorOptions, setRequestorOptions] = useState([]);
  const [selectedRequestor, setSelectedRequestor] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedtaxtype, setSelectedTaxType] = useState('');
  const [selectedDofReff, setSelectedDocRef] = ('');

  //   #INVOICE
  const [payment_term, setPaymentTerm] = useState("");
  const [invoice_date, setInvoiceDate] = useState("");
  const [due_date, setDueDate] = useState("");
  const [po_number, setPoNumber] = useState("");
  const [internalmemo, setInternalMemo] = useState("");
  const [tax_rate, setTaxRate] = useState("");
  const [bi_middle_rate, setBiMiddleRate] = useState("");
  const [vendorOptions, setVendorOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);
  const [docRef, setDocRef] = useState("");
  const [selectedPrNumber, setSelectedPrNumber] = useState(null);
  const [invoice_type, setInvoiceType] = useState("");
  const [tax_pph_option, setTax_Pph_Option] = useState([]);
  const [PphRate, setPphRate] = useState("");
  const [PpnRate, setPpnRate] = useState("");
  const [tax_ppn_type, setTaxPpnType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type_of_payment, setTypeOfPayment] = useState("");
  const [term_of_payment, setTermOfPayment] = useState("");
  const [total_tax_base, setTotalTaxBase] = useState("");
  const [total_amount_ppn, setTotalAmountPpn] = useState("");
  const [total_amount_pph, setTotalAmountPph] = useState("");
  

  const [payment_source, setPaymentSource] = useState("");
  const [paid_to, setPaidTo] = useState("");
  const [doc_reff, setDocReff] = useState("");
  const [doc_reff_no, setDocReffNo] = useState("");
  const [voucher_number, setVoucherNumber] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [voucher_date, setVoucherDate] = useState(new Date().toISOString().slice(0, 10));
  const [total_amount, setTotalAmount] = useState("");
  const [exchange_rate, setExchangeRate] = useState("");
  const [voucher, setVoucher] = useState("");
  const [departmentOptions , setDepartmentOptions ] = useState([]);

  // detail item
  const [coa, setCoa] = useState("");
  const [description, setDescription] = useState("");
  const [invoice_number, setInvoiceNumber] = useState("");
  const [db_cr, setDbCr] = useState("");
  const [type_of_vat, setTypeOfVat] = useState("");
  const [tax_ppn, setTax_ppn] = useState("");
  const [tax_ppn_amount, setTaxPpnAmount] = useState("");
  const [tax_pph_rate_2, setTaxPphRate2] = useState("");
  const [tax_pph_amount, setTaxPphAmount] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState("");
  const [amount_paid, setAmountPaid] = useState("");
  const [tax_pph, setTaxPph] = useState("");
  const [tax_pph_rate, setTaxPphRate] = useState("");
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState("");
  const [type_of_pph_option, setType_Of_Pph_Option] = useState([]);


  const [purchase_invoice_number, setPurchaseInvoiceNumber] = useState("");
  const [amount_in_idr, setAmountInIdr] = useState("");
  const [emlpoyee, setEmployee] = useState("");
  const [customer, setCustomer] = useState("");
  const [purchase_invoice_date, setPurchaseInvoiceDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [project_contract_number, setProjectContractNumber] = useState("");
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

  const authToken = headers;
  useEffect(() => {
    if (selectedData) {
      const { ID, VOUCHER_NUMBER } = selectedData[0];
      // Set data awal dari selectedData
      console.log("id and voucher number", ID, VOUCHER_NUMBER);
      setVoucherNumber(VOUCHER_NUMBER);

      LookupService.fetchLookupData(`VOUC_FORMVCPETTY&filterBy=VOUCHER_NUMBER&filterValue=${VOUCHER_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const data = response.data[0];
          if (data) {
            setVoucherNumber(data.voucher_number);
            setDocReff(data.doc_reff);
            setPaidTo(data.paid_to);
            setStatus(data.status);
            setVoucherDate(data.voucher_date);
            setTotalAmount(data.total_amount);
          } else {
            console.log("No data found");
          }
        })
        .catch((error) => {
          console.error("Failed to load purchase invoice data:", error);
        });

      // Fetch items based on PR_NUMBER and set them to state
      LookupService.fetchLookupData(`VOUC_FORMVCPETTYD&filterBy=voucher_number&filterValue=${VOUCHER_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          // Set fetched items to state
          setItems(fetchedItems);

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
              value: item.CUSTOMER,
              label: item.CUSTOMER,
            }));
    
            setCustomerOptions(options);
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
      })
      .catch((error) => {
        console.error("Failed to fetch payment term lookup:", error);
      });

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
                product_account: item.PRODUCT_ACCOUNT,
              }));

              setProductOptions(productOptions);
            })
            .catch((error) => {
              console.error("Failed to fetch payment term lookup:", error);
            });

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
            setType_Of_Pph_Option(options);

              const optionsPpn = transformedData
                .filter((item) => item.TAX_TYPE === "PPN")
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                }));
              setTaxPpnTypeOption(optionsPpn);
              const selectedPPNOption = optionsPpn.find((option) => option.value === selectedData[0].TAX_PPN);
              setSelectedTaxType(selectedPPNOption || null);
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

                  // Update fetched items with selected options
                  const updatedItems = fetchedItems.map((item) => {
                    const selectedProductOption = productOptions.find((option) => option.value === item.product);

                    console.log("Selected product option:", selectedProductOption);

                    const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);

                    console.log("Selected currency option:", selectedCurrencyOption);
                    setSelectedCurrency(selectedCurrencyOption);
                    setSelectedProduct(selectedProductOption);
                  });

                  // Set the updated items with selected product and currency options to state
                  setItems(fetchedItems);
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

      LookupParamService.fetchLookupData("PURC_FORMPUREQ", authToken, branchId)
      .then((data) => {
        console.log("PR number lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.PR_NUMBER,
          label: item.PR_NUMBER,
          id: item.ID,
          project: item.PROJECT,
          totalAmount: item.TOTAL_AMOUNT,
          // currency: item.CURRENCY, // Add the currency property
          // quantity: item.QUANTITY,
          description: item.DESCRIPTION,
          title: item.TITLE,
        }));
        setPrNumberOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Pr number lookup:", error);
      });

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

          // Extract vendor options
          const vendorOptions = transformedData.map((item) => ({
            value: item.NAME,
            label: item.NAME,
          }));

          // Set all vendor options
          setAllVendorOptions(vendorOptions);

          // Set vendor options (filtered by ENTITY_TYPE === "BOTH")
          const bothOptions = vendorOptions.filter((option) => option.value === transformedData.find((item) => item.ENTITY_TYPE === "BOTH").NAME);
          setVendorOptions(bothOptions);

          // Set selected vendor option
          const selectedVendor = vendorOptions.find((option) => option.value === selectedData[0].VENDOR);
          setSelectedVendor(selectedVendor ? selectedVendor : null);
        })
        .catch((error) => {
          console.error("Failed to fetch vendor lookup:", error);
        });

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
          // const selectedCurrencyOption = options.find(option => option.value === currency);
          // setSelectedCurrency(selectedCurrencyOption || null);
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

          const options = transformedData.map((item) => ({
            value: item.COUNT,
            label: item.NAME,
            dateType: item.DATE_TYPE,
          }));

          setPaymentTermOptions(options);

          // Get the payment term value from the selected data
          const paymentTermValue = selectedData[0].PAYMENT_TERM;

          // Find the corresponding payment term option
          const selectedPaymentTermOption = options.find((option) => option.value === paymentTermValue);

          // Update the payment term state
          setSelectedPaymentTerm(selectedPaymentTermOption);
          setPaymentTerm(paymentTermValue);
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

  // Handle PR Number Change
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
              const transformedProductData = productData.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const productOptions = transformedProductData.map((item) => ({
                value: item.NAME,
                label: item.NAME,
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

                  // Fetch tax lookup data
                  LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId)
                    .then((data) => {
                      console.log("Tax lookup data:", data);
                      const transformedData = data.data.map((item) =>
                        Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                        }, {})
                      );

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
                      console.error("Failed to fetch tax lookup:", error);
                    });

                  // Fetch description data
                  LookupParamService.fetchLookupData("PURC_FORMPUREQ", authToken, branchId)
                    .then((descriptionData) => {
                      console.log("Description lookup data:", descriptionData);
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

                      setDescriptionOptions(descriptionOptions); // Set description options to state

                      const newItems = [...items];

                      // Update fetched items with selected options
                      const updatedFetchedItems = fetchedItems.map((item) => {
                        const selectedProductOption = productOptions.find((option) => option.value === item.product);
                        const selectedDescription = descriptionOptions.find((desc) => desc.value === item.pr_number) || {};

                        return {
                          ...item,
                          doc_reff_no: item.pr_number,
                          selectedProduct: selectedProductOption ? selectedProductOption.value : "",
                          product_account: selectedProductOption ? selectedProductOption.product_account : "",
                          description: selectedDescription.description || "",
                          total_after_discount: selectedDescription.total_after_discount || "",
                        };
                      });

                      updatedFetchedItems.forEach((fetchedItem, i) => {
                        // Update or add new items for each fetched object
                        newItems[index + i] = {
                          ...newItems[index + i],
                          ...fetchedItem,
                        };
                      });

                      // Autofill the description based on the selected product
                      const autofillDescription = updatedFetchedItems[0]?.description || "";
                      newItems[index].description = autofillDescription;

                      // Set the updated items to state
                      setItems(newItems);
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
        // product_note: "",
        // quantity: 1,
        // currency: "IDR",
        // unit_price: 0,
        // original_unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
        tax_ppn_amount: 0,
        tax_base: 0,
        // discount: 0,
        subTotal: 0,
        // vat_included: false,
        // new_unit_price: 0,
        // doc_reff_num: "",
        vendor: "",
        project: "",
        customer: "",
        departement: "",
        contract_number: "",
        coa: "",
        amount: "",
        description: "",
        product_account: "",
        total_after_discount: 0,
      };
      setItems(newItems); // Update state with reset selections
    }
  };

  const handleVendorChange  = (selectedOption) => {
    if (selectedOption) {
    setSelectedVendor(selectedOption.label);
    setPaidTo(selectedOption ? selectedOption.value : "");
    } else {
    setSelectedVendor(null);
    setPaidTo("");
    }
  };

  const handleBothVendorChange = (selectedOption) => {
    setSelectedBothVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
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
              const transformedProductData = productData.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const productOptions = transformedProductData.map((item) => ({
                value: item.NAME,
                label: item.NAME,
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

                  // Fetch tax lookup data
                  LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId)
                    .then((data) => {
                      console.log("Tax lookup data:", data);
                      const transformedData = data.data.map((item) =>
                        Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                        }, {})
                      );

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
                      console.error("Failed to fetch tax lookup:", error);
                    });

                  // Fetch description data
                  LookupParamService.fetchLookupData("PURC_FORMPUOR", authToken, branchId)
                    .then((descriptionData) => {
                      console.log("Description lookup data:", descriptionData);
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

                      setDescriptionOptions(descriptionOptions); // Set description options to state

                      const newItems = [...items];

                      // Update fetched items with selected options
                      const updatedFetchedItems = fetchedItems.map((item) => {
                        const selectedProductOption = productOptions.find((option) => option.value === item.product);
                        const selectedDescription = descriptionOptions.find((desc) => desc.value === item.po_number) || {};

                        return {
                          ...item,
                          doc_reff_no: item.po_number,
                          selectedProduct: selectedProductOption ? selectedProductOption.value : "",
                          product_account: selectedProductOption ? selectedProductOption.product_account : "",
                          description: selectedDescription.description || "",
                          total_after_discount: selectedDescription.total_after_discount || "",
                        };
                      });

                      updatedFetchedItems.forEach((fetchedItem, i) => {
                        // Update or add new items for each fetched object
                        newItems[index + i] = {
                          ...newItems[index + i],
                          ...fetchedItem,
                        };
                      });

                      // Set the updated items to state
                      setItems(newItems);
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
        // product_note: "",
        // quantity: 1,
        // currency: "IDR",
        // unit_price: 0,
        // original_unit_price: 0,
        // total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
        tax_ppn_amount: 0,
        tax_base: 0,
        // discount: 0,
        subTotal: 0,
        // vat_included: false,
        // new_unit_price: 0,
        // doc_reff_num: "",
        vendor: "",
        project: "",
        customer: "",
        departement: "",
        contract_number: "",
        coa: "",
        amount: "",
        description: "",
        product_account: "",
        total_after_discount: 0,
      };
      setItems(newItems); // Update state with reset selections
    }
  };

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");
    console.log("project", project);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        coa: " ",
        description: " ",
        // invoice_number:" ",
        amount: " ",
        db_cr: "Db",
        type_of_vat: " ",
        tax_ppn: " ",
        tax_ppn_amount: " ",
        tax_pph: " ",
        amount_paid: " ",
        project: " ",
        description: "",
        department: " ",
        vendor: "",
        department: "",
        doc_reff_no: "",
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    // newItems[index].original_unit_price = newItems[index].unit_price || 0;

    console.log(index, field, value);

    // Itungan Baru

    // Reset field vat type dan ppn type ketika mengubah unit price dan quantity

    if (field === "unit_price" || field === "quantity") {
      newItems[index].type_of_vat = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_ppn = "";
      newItems[index].tax_pph_rate = 0;
      newItems[index].tax_pph = "";
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      if (newItems[index].vat_included !== undefined) {
        newItems[index].vat_included = false;
      }
    }
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }

    // Itungan New Unit Price
    let pengkali = newItems[index].tax_ppn_rate / 100;

    if (field === "tax_ppn" || field === "tax_ppn_rate") {
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
        newItems[index].tax_base = Math.round(newItems[index].unit_price / ((1 + newItems[index].tax_ppn_rate / 100) * newItems[index].quantity));
        newItems[index].tax_ppn_amount = Math.round(newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100));
        newItems[index].vat_included = true;
      } else if (newItems[index].type_of_vat === "exclude") {
        newItems[index].tax_ppn_amount = Math.round(newItems[index].total_price * (newItems[index].tax_ppn_rate / 100));
        newItems[index].tax_base = Math.round(newItems[index].unit_price * newItems[index].quantity);
      }
      newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    }

    let pengkali2 = newItems[index].tax_pph_rate / 100;

    // if (field === "tax_pph_type" || field === "tax_pph_rate") {
    //   if (newItems[index].vat_type === "include") {
    //     newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali2;
    //     newItems[index].tax_base = Math.round(newItems[index].unit_price / ((1 + newItems[index].tax_pph_rate / 100) * newItems[index].quantity));
    //     newItems[index].tax_pph_amount = Math.round(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100));
    //     newItems[index].vat_included = true;
    //   } else if (newItems[index].vat_type === "exclude") {
    //     newItems[index].tax_pph_amount = Math.round(newItems[index].total_price * (newItems[index].tax_pph_rate / 100));
    //     newItems[index].tax_base = Math.round(newItems[index].unit_price * newItems[index].quantity);
    //   }
    //   newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    // }

    if (field === "type_of_vat") {
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_pph = "";
      newItems[index].tax_pph_rate = 0;
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      if (newItems[index].type_of_vat === "exclude" && newItems[index].vat_included === true) {
        newItems[index].new_unit_price = newItems[index].new_unit_price - newItems[index].unit_price * pengkali;
        newItems[index].vat_included = false;
      } else {
        newItems[index].new_unit_price = newItems[index].unit_price;
      }
      newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    }

    if (field === "tax_pph" || field === "tax_pph_rate") {
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali2;
        // newItems[index].tax_base = Math.round(newItems[index].unit_price / ((1 + newItems[index].tax_pph_rate / 100) * newItems[index].quantity));
        newItems[index].tax_pph_amount = Math.round(((newItems[index].total_price / (1 + newItems[index].tax_ppn_rate / 100)) * newItems[index].tax_pph_rate) / 100);
        newItems[index].vat_included = true;
      } else if (newItems[index].type_of_vat === "exclude") {
        newItems[index].tax_pph_amount = Math.round(newItems[index].total_price * (newItems[index].tax_pph_rate / 100));
        // newItems[index].tax_base = Math.round(newItems[index].unit_price * newItems[index].quantity);
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

    console.log("new unit price", newItems[index].new_unit_price);
    console.log("original", newItems[index].original_unit_price);
    console.log("unit", newItems[index].unit_price);
    console.log("pengkali", pengkali);
    console.log("vatinc", newItems[index].vat_included);
    console.log("base", newItems[index].tax_base);
    console.log("vat", newItems[index].type_of_vat);
    console.log("pengkali2", pengkali2);

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
        const deleteResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "VCPETTYD", authToken, branchId);
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

  const handleProductChange = () => {
    
  }
  const handleOptionChange = () => {
    
  }

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
      const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : item.tax_ppn_amount;
      return total + taxPPNAmount;
    }, 0);

    const totalPPHAmount = items.reduce((total, item) => {
      const taxPPHAmount = isNaN(item.tax_pph_amount) ? 0 : item.tax_pph_amount;
      return total + taxPPHAmount;
    }, 0);

    const total_amount = subTotal + totalPPNAmount + totalPPHAmount;
    const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;
    return { subTotal, totalPPNAmount, totalPPHAmount, totalAmount: validTotalAmount };
  };
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const resetForm = () => {
    setPrNumber("");
    setTitle("");
    setInternalMemo("");
    setID("");
    setInvoiceNumber("");
    setInvoiceType("");
    setInvoiceDate("");
    setVendor("");
    setPaymentTerm("");
    setDueDate("");
    setTaxRate("");
    setTaxInvoiceNumber("");
    setBiMiddleRate("");
    setTypeOfPayment("");
    // setTermOfPayment("");
    setProject("");
    setDescription("");
    setItems([]);
    setSelectedItems([]);
    setSelectedPrNumber(null);
    setSelectedPoNumber(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    setSelectedPaymentTerm(null);
    setSelectedVendor(null);
    setSelectedDocRef(null);
  };

  const generatePrNumber = async () => {
    try {
      const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=PR`, authToken);
      return uniquePrNumber;
    } catch (error) {
      console.error("Failed to generate PR Number:", error);
      throw error; // Rethrow the error to be caught in handleSave
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
        console.log("Status: ", status_request);

        // const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating
        const { subTotal, totalPPNAmount, totalPPHAmount, total_amount } = calculateTotalAmount();

        const generalInfo = {
          doc_reff: docRef,
          doc_reff_no: doc_reference,
          // internalmemo,
          title,
          payment_term, // Converts to date format
          invoice_number,
          invoice_type,
          invoice_date,
          invoice_status: "IN_PROCESS",
          vendor,
          tax_rate,
          tax_invoice_number,
          term_of_payment,
          bi_middle_rate,
          total_tax_base: subTotal,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          project,
          due_date,
          description,
          total_amount: total_amount,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        console.log("General data posted successfully:", response);

        if (response.message === "Update Data Successfully") {
          // Iterate over items array and attempt to delete each item
          for (const item of items) {
            if (item.ID) {
              const itemId = item.ID;
              try {
                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUINVCD", authToken, branchId);
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
              invoice_number,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
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
        setIsEditingPettyCash(false);
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
        console.log("Status: ", status_request);

        // const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

        const { subTotal, totalPPNAmount, totalPPHAmount, total_amount } = calculateTotalAmount();

        const generalInfo = {
          doc_reff: docRef,
          doc_reff_no: doc_reference,
          // internalmemo,
          title,
          payment_term, // Converts to date format
          invoice_number,
          invoice_type,
          invoice_date,
          invoice_status: "IN_PROCESS",
          vendor,
          tax_rate,
          tax_invoice_number,
          term_of_payment,
          bi_middle_rate,
          total_tax_base: subTotal,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          project,
          due_date,
          description,
          total_amount: total_amount,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        console.log("General data posted successfully:", response);

        if (response.message === "Update Data Successfully") {
          // Iterate over items array and attempt to delete each item
          for (const item of items) {
            if (item.ID) {
              const itemId = item.ID;
              try {
                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUINVCD", authToken, branchId);
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
              invoice_number,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
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
        setIsEditingPettyCash(false);
        handleRefresh(); // Set loading state back to false after completion
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
                <Card.Title>General Information</Card.Title>
                <div className="ml-auto">
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => {
                      handleRefresh();
                      setIsEditingPettyCash(false);
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

                    <Col md={6}>
                      <Form.Group controlId="formPaidTo">
                        <Form.Label>Paid To</Form.Label>
                        <Select 
                        value={selectedVendor} 
                        onChange={handleVendorChange} 
                        options={vendorOptions} 
                        isClearable placeholder="Select..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formDoc_Reff">
                        <Form.Label>Document Reference</Form.Label>
                        <Form.Control as="select" placeholder="Enter Document Reference" value={doc_reff} onChange={(e) => setDocReff(e.target.value)}>
                          <option value="">Select Document Reference</option>
                          <option value="Purchase Request">Purchase Request</option>
                          <option value="Purchase Order">Purchase Order</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVoucherNumber">
                        <Form.Label>Voucher Number</Form.Label>
                        <Form.Control type="text" value={voucher_number} readOnly />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formStatus">
                        <Form.Label>Voucher Status</Form.Label>
                        <Form.Control type="text" placeholder="" value={status} onChange={(e) => setStatus(e.target.value)} readOnly />
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
                        <Form.Control type="number" placeholder="Your Amount" value={amount} onChange={(e) => setAmount(e.target.value)} readOnly />
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
                              {/* <th>Expanse Voucher</th> */}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="18" className="text-center">
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
                                    {doc_reff === "Purchase Request" && (
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

                                    {doc_reff === "Purchase Order" && (
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
                                    {/* <Form.Group controlId="formCoa">
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
                                    </Form.Group>                          */}
                                    <Form.Control
                                      type="text"
                                      value={items[index]?.coa || ""}
                                      //  onChange={(e) => handleItemChange(index, "coa", e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Group controlId="formProduct">
                                      <Select
                                        value={productOptions.find((option) => option.value === items[index]?.product)}
                                        onChange={(selectedProduct) => handleProductChange(index, selectedProduct)}
                                        options={productOptions}
                                        placeholder="Select Product"
                                      />
                                    </Form.Group>{" "}
                                  </td>
                                  <td>
                                    <Form.Group controlId="db_cr">
                                      <Form.Control as="select" value={db_cr || "Db"} onChange={(e) => setDbCr(e.target.value)}>
                                        <option value="Db">Db</option>
                                        <option value="Cr">Cr</option>
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
                                    <Form.Control type="text" value={item.vendor} onChange={(e) => handleItemChange(index, "vendor", e.target.value)} />
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
                                    <Form.Control type="text" value={item.project_contract_number} onChange={(e) => handleItemChange(index, "project_contract_number", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Group controlId="formCustomer">
                                      {/* <Form.Label>Customer</Form.Label> */}
                                      <Select
                                        id="customer"
                                        value={customerOptions.find((option) => option.value === item.customer)}
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
                                    </Form.Group>
                                    {/* <Form.Control type="text" value={item.departement} onChange={(e) => handleItemChange(index, "departement", e.target.value)} /> */}
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
                                          handleItemChange(index, "type_of_pph", selectedOption ? selectedOption.value : null);
                                        }}
                                        options={type_of_pph_option}
                                        isClearable
                                        placeholder="Select Tax PPH Type..."
                                      />
                                    </Form.Group>
                                  </td>
                                  {/* <td>
                                  <Form.Control type="text" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", e.target.value)} />
                                  </td> */}
                                  <td>
                                    <Form.Control type="number" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_pph_amount || "0"} onChange={(e) => handleItemChange(index, "tax_pph_amount", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.amount_paid} onChange={(e) => handleItemChange(index, "amount_paid", e.target.value)} />
                                  </td>

                                  {/* <td>
                                    <Form.Control type="text" value={item.expanse_account} onChange={(e) => handleItemChange(index, "expanse_account", e.target.value)} />
                                  </td> */}
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
                              <td colSpan="18">Subtotal:</td>
                              <td>
                                <strong>{calculateTotalAmount().subTotal.toLocaleString("en-US", { style: "currency", currency: "IDR" })}</strong>
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="18">Total Ppn Amount:</td>
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
                              <td colSpan="18">Total Pph Amount:</td>
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
                              <td colSpan="18">Total Amount:</td>
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
                setIsEditingPettyCash(false);
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

export default EditPettyCash;
