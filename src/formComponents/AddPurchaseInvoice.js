import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from "../service/InsertDataService";
import { getBranch, getToken, token } from "../config/Constant";
import { FORM_SERVICE_UPDATE_DATA, GENERATED_NUMBER, DOWNLOAD_FILES } from "../config/ConfigUrl";
import { generateUniqueId } from "../service/GeneratedId";
import Select from "react-select";
import LookupParamService from "../service/LookupParamService";
import { GENERATED_DUE_DATE, UPLOAD_FILES } from "../config/ConfigUrl";
import axios from "axios";
import LookupService from "../service/LookupService";
import UpdateDataService from "../service/UpdateDataService";
import DeleteDataService from "../service/DeleteDataService";
import UpdateStatusService from "../service/UpdateStatusService";

const AddPurchaseInvoice = ({ setIsAddingNewPurchaseInvoice, setIsEditingPurchaseInvoice, handleRefresh, index, item, selectedData }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem("userId");
  const idUser = sessionStorage.getItem("id");
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
  const [tax_ppn, setTaxPpnType] = useState("");
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [type_of_payment, setTypeOfPayment] = useState("");
  const [term_of_payment, setTermOfPayment] = useState("");
  const [total_after_discount, setTotalAfterDiscount] = useState("");
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
  const [tax_exchange_rate, setTaxExchangeRate] = useState("1");
  const [customer_contract, setCustomerContract] = useState("");
  const [file, setFile] = useState("");
  const [vatType, setVatType] = useState(null);
  const [formattedDiscount, setFormattedDiscount] = useState("IDR 0.00");
  const [discount, setDiscount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customer, setCustomer] = useState("");
  const [departement, setDepartement] = useState("");
  const [doc_reff_no, setDocReffNo] = useState("");
  const [contractNumberOption, setContractNumberOptions] = useState([]);
  const [selectedtaxppntype, setSelectedTaxPpnType] = useState(null);
  const [isAddFile, setIsAddFile] = useState(false);
  const [tax_ppn_royalty_option, setTaxPpnRoyaltyOption] = useState([]);
  const [selectedPrNumbers, setSelectedPrNumbers] = useState([]);
  const [fetchedDetail, setFetchedDetail] = useState([]);

  const authToken = headers;

  const [inputWidth, setInputWidth] = useState(100);

  useEffect(() => {
    const generateInitialInvoiceNumber = async () => {
      const generatedInvoiceNumber = await generatePrNumber("DRAFT_INVC"); // Adjust the code as needed

      setInvoiceNumber(generatedInvoiceNumber);
    };

    generateInitialInvoiceNumber();
  }, []); // Empty dependency array means this runs once on mount

  // buat edit autofill
  useEffect(() => {
    if (selectedData) {
      const { ID, INVOICE_NUMBER } = selectedData[0];
      // Set data awal dari selectedData
      console.log("id and invoice number", ID, INVOICE_NUMBER);
      setInvoiceNumber(INVOICE_NUMBER);

      // Panggil API untuk mendapatkan data berdasarkan ID
      // LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=invoice_number&filterValue=${invoice_number}&operation=EQUAL`, authToken, branchId)
      //   .then((response) => {
      //     const data = response.data[0];
      //     console.log("Data:", data);
      //     setInvoiceNumber(data.invoice_number);
      //     setTitle(data.title);
      //     setVendor(data.vendor);
      //     setDueDate(data.dueDate);
      //     setTermOfPayment(data.term_of_payment);
      //     setTypeOfPayment(data.type_of_payment);
      //     setBiMiddleRate(data.bi_middle_rate);

      //     setProject(data.project);
      //     setDescription(data.description);
      //   })
      //   .catch((error) => {
      //     console.error("Failed to load purchase request data:", error);
      //   });

      LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=INVOICE_NUMBER&filterValue=${INVOICE_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const data = response.data[0];
          if (data) {
            setInvoiceNumber(data.invoice_number);
            setDocReffNo(data.doc_reff_no);
            setDocRef(data.doc_reff);
            setTitle(data.title);
            setVendor(data.vendor);
            setDueDate(data.due_date);
            setTermOfPayment(data.term_of_payment);
            setTypeOfPayment(data.type_of_payment);
            setBiMiddleRate(data.bi_middle_rate);
            setTaxInvoiceNumber(data.tax_invoice_number);
            setProject(data.project);
            setPaymentTerm(data.payment_term);
            setDescription(data.description);
            setInvoiceDate(data.invoice_date);
            setInvoiceType(data.invoice_type);
            setDocReference(data.doc_reference);
            setTaxRate(data.tax_rate);
            setTaxExchangeRate(data.tax_exchange_rate);
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

      // Fetch items based on PR_NUMBER and set them to state
      LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=invoice_number&filterValue=${INVOICE_NUMBER}&operation=EQUAL`, authToken, branchId)
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
          LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
              LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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

      LookupParamService.fetchLookupDataView("MSDT_FORMCUST", authToken, branchId)
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

      LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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

      // LookupParamService.fetchLookupDataView("MSDT_FORMPRJT", authToken, branchId)
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
      //       customer: item.CUSTOMER,
      //       contract_number: item.CONTRACT_NUMBER,
      //     }));

      //     const optionsCustomer = transformedData.map((item) => ({
      //       value: item.CUSTOMER,
      //       label: item.CUSTOMER,
      //     }));
      //     const contractNumOptions = transformedData.map((item) => ({
      //       value: item.CONTRACT_NUMBER,
      //       label: item.CONTRACT_NUMBER,
      //     }));
      //     setProjectOptions(options);
      //     setCustomerOptions(optionsCustomer);
      //     setContractNumberOptions(contractNumOptions);
      //   })
      //   .catch((error) => {
      //     console.error("Failed to fetch currency lookup:", error);
      //   });

      LookupParamService.fetchLookupDataView("MSDT_FORMPYTM", authToken, branchId)
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

      LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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

      LookupParamService.fetchLookupDataView("MSDT_FORMCUST", authToken, branchId)
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

  useEffect(() => {
    // Ambil data lookup untuk currency
    // MSDT_FORMEMPL adalah nama table yang menyimpan data lookup untuk currency
    // authToken dan branchId digunakan untuk mengirimkan token otorisasi dan kode cabang ke server
    LookupParamService.fetchLookupDataView("MSDT_FORMEMPL", authToken, branchId)
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

    LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
    LookupParamService.fetchLookupDataView("MSDT_FORMCUST", authToken, branchId)
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
    LookupParamService.fetchLookupDataView("MSDT_FORMDPRT", authToken, branchId)
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
    LookupParamService.fetchLookupDataView("MSDT_FORMPYTM", authToken, branchId)
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

    //buat pr baru
    // LookupService.fetchLookupData("PURC_FORMPUREQ&filterBy=STATUS_REQUEST&filterValue=IN_PROCESS&operation=EQUAL&filterBy=STATUS&filterValue=APPROVED&operation=EQUAL", authToken, branchId)
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

    //     const options = transformedData
    //       .map((item) => {
    //         const label = item.PR_NUMBER;
    //         if (label.startsWith("DRAFT")) {
    //           return null; // or you can return an empty object {}
    //         }
    //         return {
    //           value: item.PR_NUMBER,
    //           label: label.replace("DRAFT ", ""), // remove 'DRAFT ' from the label
    //           // REQUESTOR: item.REQUESTOR,
    //           project: item.PROJECT,
    //           id: item.ID,
    //           totalAmount: item.TOTAL_AMOUNT,
    //           currency: item.CURRENCY,
    //           quantity: item.QUANTITY,
    //           description: item.DESCRIPTION,
    //           paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
    //           dueDate: item.DUE_DATE,
    //           vendor: item.VENDOR,
    //           ENDTOENDID: item.ENDTOENDID,
    //           customer: item.CUSTOMER,
    //           departement: item.DEPARTEMENT,
    //         };
    //       })
    //       .filter((option) => option !== null);
    //     setPrNumberOptions(options);
    //     console.log("Pr number options:", options);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch currency lookup:", error);
    //   });

    // buat pr number status request in_process dan partial requested
    LookupService.fetchLookupData("PURC_FORMPUREQ&filterBy=STATUS&filterValue=APPROVED&operation=EQUAL", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        // Filter the transformed data based on STATUS_REQUEST
        const filteredData = transformedData.filter((item) => item.STATUS_REQUEST === "IN_PROCESS" || item.STATUS_REQUEST === "PARTIAL_REQUESTED");
        console.log("status baru", filteredData);

        const options = filteredData
          .map((item) => {
            const label = item.PR_NUMBER;
            if (label.startsWith("DRAFT")) {
              return null; // or you can return an empty object {}
            }
            return {
              value: item.PR_NUMBER,
              label: label.replace("DRAFT ", ""), // remove 'DRAFT ' from the label
              id: item.ID,
              project: item.PROJECT,
              totalAmount: item.TOTAL_AMOUNT,
              description: item.DESCRIPTION,
              title: item.TITLE,
              vendor: item.VENDOR,
              ENDTOENDID: item.ENDTOENDID,
              vatType: item.TYPE_OF_VAT,
              tax_ppn: item.TAX_PPN,
              discount: item.DISCOUNT,
              currency: item.CURRENCY,
              quantity: item.QUANTITY,
              paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
              dueDate: item.DUE_DATE,
              customer: item.CUSTOMER,
              departement: item.DEPARTEMENT,
            };
          })
          .filter((option) => option !== null); // Filter out null options

        setPrNumberOptions(options);
        console.log("Pr number options:", options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // buat po baru
    LookupService.fetchLookupData("PURC_FORMPUOR&filterBy=STATUS&filterValue=APPROVED&operation=EQUAL", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        // Filter the transformed data based on STATUS_PO
        const filteredData = transformedData.filter((item) => item.STATUS_PO === "IN_PROCESS" || item.STATUS_PO === "PARTIAL_ORDERED");
        console.log("Filtered data based on STATUS_PO:", filteredData);

        const options = filteredData.map((item) => {
          const label = item.PO_NUMBER;
          return {
            value: item.PO_NUMBER,
            label: label.replace("DRAFT ", ""), // remove 'DRAFT ' from the label
            id: item.ID,
            project: item.PROJECT,
            totalAmount: item.TOTAL_AMOUNT,
            description: item.DESCRIPTION,
            title: item.TITLE,
            vendor: item.VENDOR,
            ENDTOENDID: item.ENDTOENDID,
            vatType: item.TYPE_OF_VAT,
            tax_ppn: item.TAX_PPN,
            discount: item.DISCOUNT,
            currency: item.CURRENCY,
            quantity: item.QUANTITY,
            paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
            dueDate: item.DUE_DATE,
            customer: item.CUSTOMER,
            departement: item.DEPARTEMENT,
          };
        });

        setPoNumberOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // PO NUMBER
    // LookupParamService.fetchLookupData("PURC_FORMPUOR", authToken, branchId)
    //   .then((data) => {
    //     console.log("PO number lookup data:", data);

    //     // Transform keys to uppercase directly in the received data
    //     const transformedData = data.data.map((item) =>
    //       Object.keys(item).reduce((acc, key) => {
    //         acc[key.toUpperCase()] = item[key];
    //         return acc;
    //       }, {})
    //     );
    //     //console.log('Transformed data:', transformedData);

    //     const options = transformedData.map((item) => ({
    //       value: item.PO_NUMBER,
    //       label: item.PO_NUMBER,
    //       id: item.ID,
    //       project: item.PROJECT,
    //       totalAmount: item.TOTAL_AMOUNT,
    //       // currency: item.CURRENCY, // Add the currency property
    //       // quantity: item.QUANTITY,
    //       description: item.DESCRIPTION,
    //       title: item.TITLE,
    //       vendor: item.VENDOR,
    //       ENDTOENDID: item.ENDTOENDID,
    //       vatType: item.TYPE_OF_VAT,
    //       tax_ppn: item.tax_ppn,
    //       tax_ppn: item.TAX_PPN,
    //       discount: item.DISCOUNT,
    //       currency: item.CURRENCY,
    //       quantity: item.QUANTITY,
    //       paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
    //       dueDate: item.DUE_DATE,
    //       customer: item.CUSTOMER,
    //       departement: item.DEPARTEMENT,
    //     }));
    //     setPoNumberOptions(options);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch PO number lookup:", error);
    //   });

    LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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

    // buar project dll
    LookupParamService.fetchLookupDataView("MSDT_FORMPRJT", authToken, branchId)
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
          contract_number: item.CONTRACT_NUMBER,
        }));

        const optionsCustomer = transformedData.map((item) => ({
          value: item.CUSTOMER,
          label: item.CUSTOMER,
        }));
        const contractNumOptions = transformedData.map((item) => ({
          value: item.CONTRACT_NUMBER,
          label: item.CONTRACT_NUMBER,
        }));
        setProjectOptions(options);
        setCustomerOptions(optionsCustomer);
        setContractNumberOptions(contractNumOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

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
          Authorization: `Bearer ${authToken}`,
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
  //           type_of_vat: "",
  //           tax_ppn: "",
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
  //     setVatType(selectedOption.TYPE_OF_VAT); // Autofill type_of_vat
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
  //                     tax_ppn: selectedTypePPN ? selectedTypePPN : item.tax_ppn,
  //                     type_of_vat: selectedVat,
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

  const handlePrNumberChange = (index, selectedOption) => {
    if (selectedOption) {
      // Fetch lookup data based on the selected option
      LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          // Filter fetched items where status_detail is null
          const filteredItems = fetchedItems.filter((item) => item.status_detail === null);
          console.log("Filtered items:", filteredItems);

          // Fetch product lookup data
          LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
              LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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

                  const newItems = [...items];
                  const newStored = [...items];

                  const storedItems = fetchedItems.map((item => {
                    return{
                      ...item,
                    }
                  }));

                  storedItems.forEach((fetchedDetail, i) => {
                    newStored[index, i] = {
                      ...newStored[index + i],
                      ...fetchedDetail,
                    }
                  })

                  console.log('storedItems', newStored);
                  setFetchedDetail(newStored);

                  // Update fetched items with selected options
                  const updatedFetchedItems = filteredItems.map((item) => {
                    return {
                      ...item,
                      doc_reff_no: item.pr_number,
                      // selectedProduct: productOptions.find((option) => option.value === item.product),
                      // selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
                      // selectedProject: projectOptions.find((option) => option.value === item.project),
                      // selectedDepartement: departementOptions.find((option) => option.value === item.departement),
                      // selectedCustomer: customerOptions.find((option) => option.value === item.customer),
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

          // Filter fetched items where status_detail is null
          const filteredItems = fetchedItems.filter((item) => item.status_detail === null);
          console.log("Filtered items:", filteredItems);

          // Fetch product lookup data
          LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
              LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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
                  const newStored = [...items];
                  
                  const storedPRItems = fetchedItems.map((item => {
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
                setFetchedDetail    (newStored);

                  // Update fetched items with selected options
                  const updatedFetchedItems = fetchedItems.map((item) => {
                    return {
                      ...item,
                      doc_reff_no: item.po_number,
                      tax_exchange_rate: tax_exchange_rate,
                      // selectedProduct: productOptions.find((option) => option.value === item.product),
                      // selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
                      // selectedVendor: allvendoroptions.find((option) => option.value === item.vendor),
                      // selectedProject: projectOptions.find((option) => option.value === item.project),
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
      };
      setItems(newItems); // Update state with reset selections
    }
  };

  // const handlePoNumberChange = (selectedOption) => {
  //   setSelectedPoNumber(selectedOption);
  //   setDocReference(selectedOption ? selectedOption.value : "");

  //   if (selectedOption) {
  //     console.log("vendor:", selectedOption.vendor);

  //     const projectValue = selectedOption.project || selectedOption.PO_NUMBER;
  //     const vendorValue = selectedOption.vendor || selectedOption.PO_NUMBER;

  //     const customerOption = customerOptions.find((option) => option.value === selectedOption.CUSTOMER);
  //     setCustomer(c    ustomerOption ? customerOption : null);

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
  //     setVatType(selectedOption.TYPE_OF_VAT); // Autofill type_of_vat
  //     setCustomer(selectedOption.customer);
  //     setDepartement(selectedOption.DEPARTEMENT);
  //     setIdPo(selectedOption.ID);

  //     // Autofill vatType from selectedOption.TYPE_OF_VAT

  //     // tambahin buat doc_reff_no
  //     setItems((prevItems) => {
  //       return prevItems.map((item, index) => {
  //         let docReffNo = item.doc_reff_no;

  //         if (docRef === "purchaseRequest") {
  //           docReffNo = selectedPrNumber;
  //         } else if (docRef === "purchaseOrder") {
  //           docReffNo = selectedPoNumber;
  //         } else if (docRef === "internalMemo") {
  //           docReffNo = internalmemo;
  //         } else if (docRef === "customerContract") {
  //           docReffNo = customer_contract;
  //         }

  //         return { ...item, type_of_vat: selectedOption.TYPE_OF_VAT, doc_reff_no: docReffNo };
  //       });
  //     });

  //     // Fetch items and type_of_vat from the selected PO number
  //     LookupParamService.fetchLookupData(`PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
  //       .then((response) => {
  //         const fetchedItems = response.data || [];
  //         console.log("Items fetched:", fetchedItems);

  //         if (fetchedItems.length > 0) {
  //           const fetchedVatType = fetchedItems[0].type_of_vat; // Correct casing
  //           console.log("Fetched VAT Type:", fetchedVatType); // Correct log
  //           setVatType(fetchedVatType); // Set VAT type state
  //         }

  //         // Fetch product lookup data
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
  //                 const updatedItems = fetchedItems.map((item) => {
  //                   const selectedProductOption = productOptions.find((option) => option.value === item.product);
  //                   const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);
  //                   const selectedVat = fetchedItems[0].type_of_vat;
  //                   const selectedTypePPN = fetchedItems[0].tax_ppn;
  //                   console.log("ahdu", selectedTypePPN);
  //                   return {
  //                     ...item,
  //                     product: selectedProductOption ? selectedProductOption.value : item.product,
  //                     currency: selectedCurrencyOption ? selectedCurrencyOption.value : item.currency,
  //                     tax_ppn: selectedTypePPN ? selectedTypePPN : item.tax_ppn,
  //                     type_of_vat: selectedVat,
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
  //         console.error("Failed to load items:", error);
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

  // const handlePrNumberChange = (selectedOption) => {
  //   setSelectedPrNumber(selectedOption);
  //   setDocReference(selectedOption ? selectedOption.value : "");

  //   if (selectedOption) {
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
  //     setVatType(selectedOption.TYPE_OF_VAT); // Autofill type_of_vat
  //     setCustomer(selectedOption.customer);
  //     setDepartement(selectedOption.DEPARTEMENT);
  //     setIdPo(selectedOption.ID);

  //     // Fetch lookup data
  //     LookupParamService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
  //       .then((response) => {
  //         const fetchedData = response.data || [];
  //         console.log("fetc", fetchedData);

  //         if (fetchedData.length > 0) {
  //           const fetchedCustomer = fetchedData[0].CUSTOMER;
  //           const fetchedDepartement = fetchedData[0].DEPARTEMENT;

  //           const customerOption = customerOptions.find((option) => option.value === fetchedCustomer);
  //           setCustomer(customerOption ? customerOption : null);

  //           const departementOption = departementOptions.find((option) => option.value === fetchedDepartement);
  //           setDepartement(departementOption ? departementOption : null);
  //         }

  //         // Fetch product lookup data
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

  //                 // Update fetched items with product, currency, and other options
  //                 const updatedItems = fetchedData.map((item) => {
  //                   const selectedProductOption = productOptions.find((option) => option.value === item.product);
  //                   const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);
  //                   const selectedVendorOption = vendorOptions.find((option) => option.value === item.vendor);
  //                   const selectedVat = fetchedData[0].type_of_vat;
  //                   const selectedTypePPN = fetchedData[0].tax_ppn;

  //                   return {
  //                     ...item,
  //                     vendor: selectedVendorOption ? selectedVendorOption.value : item.vendor,
  //                     product: selectedProductOption ? selectedProductOption.value : item.product,
  //                     currency: selectedCurrencyOption ? selectedCurrencyOption.value : item.currency,
  //                     tax_ppn: selectedTypePPN ? selectedTypePPN : item.tax_ppn,
  //                     type_of_vat: selectedVat,
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
  //     setSelectedPaymentTerm(null);
  //     setPaymentTerm(null);
  //     setSelectedBothVendor(null);
  //     setItems([]);
  //   }
  // };

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

  const handleProjectChange = (index, selectedOption) => {
    const newItems = [...items]; // Create a copy of the current items array

    // Update the selected project state
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");

    if (selectedOption) {
      // Find the corresponding customer for the selected project
      const customerProject = customerOptions.find((option) => option.value === selectedOption.customer);
      setSelectedCustomer(customerProject);
      setCustomer(customerProject ? customerProject.value : null);

      // Update the project and project_contract_number in the newItems array
      newItems[index] = {
        ...newItems[index],
        project: selectedOption.value, // Set the project value
        project_contract_number: selectedOption.contract_number || "", // Set the project_contract_number from the selected option
      };
    } else {
      // If no project is selected, clear the project and project_contract_number
      newItems[index] = {
        ...newItems[index],
        project: "",
        project_contract_number: "",
      };
      setSelectedCustomer(null);
      setCustomer("");
    }

    // Update the items state with the new items array
    setItems(newItems);
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
        type_of_vat: "",
        tax_ppn: "",
        tax_ppn_rate: "",
        tax_ppn_amount: 0,
        tax_pph: 0,
        tax_pph_type: "",
        tax_pph_rate: "",
        tax_pph_amount: 0,
        tax_base: 0,
        total_after_discount: 0,
        total_before_discount: 0,
        total_amount_ppn: 0,
        total_amount_pph: 0,
        total_price: 0,
        total_price_idr: 0,
        vat_included: false,
        new_unit_price: 0,
        tax_exchange_rate: 1,
        vendor: "",
        doc_reff_no: "",
        project_contract_number: "",
      },
    ]);
  };

  //yg baru
  // const handleItemChange = (index, field, value) => {
  //   const newItems = [...items];
  //   newItems[index][field] = value;
  //   if (field === "unit_price" || field === "quantity") {
  //     newItems[index].type_of_vat = "";
  //     newItems[index].tax_ppn = "";
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

  //   if (field === "tax_ppn" || field === "tax_ppn_rate") {
  //     if (newItems[index].type_of_vat === "include") {
  //       newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
  //       newItems[index].tax_base = Math.round(newItems[index].unit_price / ((1 + newItems[index].tax_ppn_rate / 100) * newItems[index].quantity));
  //       newItems[index].tax_ppn_amount = newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100);
  //       newItems[index].vat_included = true;
  //     } else if (newItems[index].type_of_vat === "exclude") {
  //       newItems[index].tax_ppn_amount = newItems[index].total_price_idr * (newItems[index].tax_ppn_rate / 100);
  //       newItems[index].tax_base = newItems[index].unit_price * newItems[index].quantity;
  //     }
  //     newItems[index].total_price_idr = newItems[index].unit_price * newItems[index].quantity;
  //   }

  //   if (field === "tax_pph_type" || field === "tax_pph_rate") {
  //     if (newItems[index].type_of_pph === "gross") {
  //       if (newItems[index].type_of_vat === "exclude") {
  //         newItems[index].tax_pph_amount = newItems[index].unit_price * (newItems[index].tax_pph_rate / 100);
  //       } else {
  //         newItems[index].tax_pph_amount = newItems[index].tax_base * (newItems[index].tax_pph_rate / 100);
  //         console.log("asdsad", newItems[index].tax_pph_amount);
  //       }
  //     } else if (newItems[index].type_of_pph === "nett") {
  //       if (newItems[index].type_of_vat === "include") {
  //         let taxWithPPh = newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_pph_amount = taxWithPPh * (newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_ppn_amount = taxWithPPh * (newItems[index].tax_ppn_rate / 100);
  //       } else if (newItems[index].type_of_vat === "exclude") {
  //         let taxWithPPh = newItems[index].unit_price / (1 - newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_pph_amount = taxWithPPh * (newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_ppn_amount = taxWithPPh * (newItems[index].tax_ppn_rate / 100);
  //       }
  //     }
  //   }

  //   if (field === "type_of_vat") {
  //     newItems[index].tax_ppn = "";
  //     newItems[index].tax_ppn_rate = 0;
  //     newItems[index].tax_base = 0;
  //     newItems[index].tax_ppn_amount = 0;
  //     newItems[index].tax_pph_amount = 0;
  //     newItems[index].tax_pph_type = "";
  //     newItems[index].type_of_pph = "";
  //     newItems[index].tax_pph_rate = 0;

  //     if (newItems[index].type_of_vat === "exclude" && newItems[index].vat_included === true) {
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
      newItems[index].type_of_vat = "";
      newItems[index].tax_ppn = "";
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
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
      if (newItems[index].currency === "IDR") {
        newItems[index].total_price_idr = newItems[index].total_price;
      } else {
        newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].tax_exchange_rate || 1);
      }
    }

    // Calculate New Unit Price based on VAT and PPN
    let pengkali = newItems[index].tax_ppn_rate / 100;

    // Calculate PPN
    if (field === "tax_ppn" || field === "tax_ppn_rate") {
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
        newItems[index].tax_base = Math.round(newItems[index].total_price_idr / (1 + newItems[index].tax_ppn_rate / 100));
        newItems[index].tax_ppn_amount = newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100);
        newItems[index].vat_included = true;
      } else if (newItems[index].type_of_vat === "exclude" || newItems[index].type_of_vat === "ppn_royalty") {
        newItems[index].tax_ppn_amount = newItems[index].total_price_idr * (newItems[index].tax_ppn_rate / 100);
        newItems[index].tax_base = newItems[index].total_price_idr;
      }
    }

    // Calculate PPh based on PPh type and rate
    if (field === "tax_pph_type" || field === "tax_pph_rate") {
      if (newItems[index].type_of_pph === "gross") {
        if (newItems[index].type_of_vat === "exclude") {
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
    if (field === "type_of_vat") {
      // Reset VAT-related fields
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;

      // Retain total_price_idr for non-IDR currencies
      if (newItems[index].currency !== "IDR") {
        const previousTotalPriceIdr = newItems[index].total_price_idr;
        if (newItems[index].type_of_vat === "exclude" && newItems[index].vat_included === true) {
          newItems[index].new_unit_price = newItems[index].new_unit_price - newItems[index].unit_price * pengkali;
          newItems[index].vat_included = false;
        } else if (newItems[index].type_of_vat === "non_ppn") {
          newItems[index].tax_base = previousTotalPriceIdr;
        } else {
          newItems[index].new_unit_price = newItems[index].unit_price;
        }
        newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
        newItems[index].total_price_idr = previousTotalPriceIdr; // Keep the previous value
      } else {
        newItems[index].new_unit_price = newItems[index].unit_price;
        newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
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
  // const calculateTotalAmount = () => {
  //   const subTotal = items.reduce((total, item) => {
  //     const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
  //     return total + taxBase;
  //   }, 0);

  //   const taxbasePPH = items.reduce((total, item) => {
  //     if (item.type_of_vat === "include" && item.type_of_pph === "nett") {
  //       const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
  //       const taxPphRate = isNaN(item.tax_pph_rate) ? 0 : item.tax_pph_rate;
  //       return total + taxBase / (1 - taxPphRate / 100);
  //     } else if (item.type_of_vat === "exclude") {
  //       return total + item.unit_price / (1 - item.tax_pph_rate / 100);
  //     } else {
  //       return total + (isNaN(item.tax_base) ? 0 : item.tax_base);
  //     }
  //   }, 0);

  //   const subtotalAfterDiscount = subTotal - discount;

  //   const totalPPNAmount = items.reduce((total, item) => {
  //     const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : item.tax_ppn_amount;
  //     return total + taxPPNAmount;
  //   }, 0);

  //   const totalPPHAmount = items.reduce((total, item) => {
  //     const taxPPHAmount = isNaN(item.tax_pph_amount) ? 0 : item.tax_pph_amount;
  //     return total + taxPPHAmount;
  //   }, 0);

  //   // Calculate total_amount based on type_of_vat and type_of_pph
  //   let total_amount;

  //   // Case 1: PPN Include, PPH Gross
  //   const case1 = items.filter((item) => item.type_of_vat === "include" && item.type_of_pph === "gross");
  //   if (case1.length > 0) {
  //     total_amount = subtotalAfterDiscount + totalPPNAmount - totalPPHAmount;
  //   }

  //   // Case 2: PPN Include, PPH Nett (using the new formula)
  //   const case2 = items.filter((item) => item.type_of_vat === "include" && item.type_of_pph === "nett");
  //   if (case2.length > 0) {
  //     const taxBasePPNAF = Math.round(taxbasePPH);
  //     // const taxPphRate = totalPPHAmount / taxBase; // Example PPh rate from total PPH amount
  //     total_amount = taxBasePPNAF - totalPPHAmount + totalPPNAmount;
  //     console.log("taxppsdsd", taxBasePPNAF);
  //     console.log("pphamisnada", totalPPHAmount);
  //     console.log("ppnamkd", totalPPNAmount);
  //     console.log("totalamaos", total_amount);
  //   }

  //   // Case 3: PPN Exclude, PPH Gross
  //   const case3 = items.filter((item) => item.type_of_vat === "exclude" && item.type_of_pph === "gross");
  //   if (case3.length > 0) {
  //     total_amount = subtotalAfterDiscount + totalPPNAmount - totalPPHAmount;
  //   }

  //   // Case 4: PPN Exclude, PPH Nett (using the new formula)
  //   const case4 = items.filter((item) => item.type_of_vat === "exclude" && item.type_of_pph === "nett");
  //   if (case4.length > 0) {
  //     const taxBase = taxbasePPH;
  //     const taxPphRate = totalPPHAmount / taxBase; // Example PPh rate from total PPH amount
  //     total_amount = taxBase - totalPPNAmount + totalPPHAmount;
  //   }

  //   // Ensure valid total amount
  //   const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;

  //   return { subTotal, subtotalAfterDiscount, taxbasePPH, totalPPNAmount, totalPPHAmount, totalAmount: validTotalAmount };
  // };

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

    // Calculate total_amount based on type_of_vat and type_of_pph
    if (hasRoyalty) {
      // If there are royalties, total amount is just the subtotal after discount
      total_amount = subtotalAfterDiscount;
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

    console.log('kols', subTotal);
    return {
      subTotal,
      subtotalAfterDiscount,
      taxbasePPH,
      totalPPNAmount,
      totalPPHAmount,
      totalAmount: validTotalAmount,
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
    // generatePrNumber("DRAFT_INVC");
    setPrNumber("");
    setTitle("");
    setInternalMemo("");
    setCustomerContract("");
    setID(null);
    setDocRef(null);
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

  // Function to handle form submission save
  // const handleSave = async (event) => {
  //   event.preventDefault();

  //   // Validation for required fields
  //   if (!invoice_number) {
  //     messageAlertSwal("Error", "Invoice Number cannot be empty.", "error");
  //     return; // Prevent form submission
  //   }

  //   if (!tax_exchange_rate) {
  //     messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
  //     return;
  //   }

  //   // Show SweetAlert2 confirmation
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to save the Purchase Invoice?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, save it!",
  //     cancelButtonText: "No, cancel!",
  //     reverseButtons: true,
  //   });

  //   if (result.isConfirmed) {
  //     setIsLoading(true);
  //     try {
  //       // Generate PR number
  //       const pr_number = await generatePrNumber("PR");
  //       console.log("pr_number", pr_number);

  //       let endToEndId;
  //       if (!endToEnd) {
  //         endToEndId = await generatePrNumber("PURC");
  //       } else {
  //         endToEndId = endToEnd;
  //         console.log("endtoendId is not empty");
  //       }

  //       const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount } = calculateTotalAmount();

  //       // Save general information
  //       const generalInfo = {
  //         doc_reff: docRef,
  //         payment_term,
  //         invoice_number,
  //         invoice_date,
  //         invoice_status: "DRAFT",
  //         term_of_payment,
  //         total_after_discount: subtotalAfterDiscount,
  //         total_before_discount: subTotal,
  //         discount,
  //         total_amount_ppn: totalPPNAmount,
  //         total_amount_pph: totalPPHAmount,
  //         tax_exchange_rate,
  //         due_date,
  //         description,
  //         total_amount: totalAmount,
  //         endtoendid: endToEndId,
  //       };

  //       console.log("Master", generalInfo);
  //       console.log("Items", items);

  //       let response;

  //       // Check if updating existing data or inserting new data
  //       if (selectedData) {
  //         const id = selectedData[0].ID;
  //         response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
  //       } else {
  //         response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
  //       }

  //       console.log("Data posted successfully:", response);

  //       // Handle file upload if applicable
  //       if (doc_source) {
  //         const request = {
  //           idTrx: endToEndId,
  //           code: "PUINVC",
  //         };

  //         const formData = new FormData();
  //         formData.append("request", JSON.stringify(request));
  //         formData.append("file", doc_source);

  //         const uploadResponse = await axios.post(`${UPLOAD_FILES}`, formData, {
  //           headers: {
  //             Authorization: `Bearer ${authToken}`,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         });

  //         if (uploadResponse.ok) {
  //           console.log("File uploaded successfully");
  //         } else {
  //           console.error("Error uploading file:", uploadResponse.status);
  //         }
  //       }

  //       // Update Status for PR or PO
  //       if (idPr) {
  //         await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}`, { status_request: "INVOICE" }, { headers: { Authorization: `Bearer ${authToken}` } });
  //       } else if (idPo) {
  //         await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}`, { status_po: "INVOICE" }, { headers: { Authorization: `Bearer ${authToken}` } });
  //       }

  //       // Handle item deletion and insertion
  //       if (response.message === "Update Data Successfully") {
  //         // Delete existing items
  //         for (const item of items) {
  //           if (item.ID) {
  //             const itemId = item.ID;
  //             try {
  //               const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUINVCD", authToken, branchId);
  //               console.log("Item deleted successfully:", itemResponse);
  //             } catch (error) {
  //               console.error("Error deleting item:", itemId, error);
  //             }
  //           } else {
  //             console.log("No ID found, skipping delete for this item:", item);
  //           }
  //         }

  //         // Insert updated items
  //         for (const item of items) {
  //           const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedProject, ...rest } = item;
  //           const updatedItem = {
  //             ...rest,
  //             invoice_number,
  //           };
  //           delete updatedItem.ID;
  //           delete updatedItem.id;
  //           delete updatedItem.vat;
  //           delete updatedItem.tax_pph_type;
  //           delete updatedItem.total_tax_base;
  //           delete updatedItem.total_amount_pph;
  //           delete updatedItem.total_amount_ppn;
  //           delete updatedItem.total_ppn_amount;
  //           delete updatedItem.rwnum;
  //           delete updatedItem.pr_number;
  //           delete updatedItem.id_trx;
  //           delete updatedItem.status;
  //           delete updatedItem.selectedCurrency;
  //           delete updatedItem.selectedProduct;
  //           delete updatedItem.selectedProject;
  //           delete updatedItem.selectedCustomer;
  //           delete updatedItem.selectedDepartement;
  //           delete updatedItem.new_unit_price;
  //           delete updatedItem.vat_included;
  //           delete updatedItem.exchange_rate;
  //           delete updatedItem.company;
  //           delete updatedItem.po_number;
  //           delete updatedItem.requestor;
  //           delete updatedItem.id_upload;
  //           delete updatedItem.total_before_discount;
  //           delete updatedItem.total_after_discount;

  //           try {
  //             const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
  //             console.log("Item inserted successfully:", itemResponse);
  //           } catch (error) {
  //             console.error("Error inserting item:", updatedItem, error);
  //           }
  //         }

  //         // Show success message and reset form
  //         messageAlertSwal("Success", response.message, "success");
  //         resetForm();
  //       } else if (response.message === "insert Data Successfully") {
  //         // Insert new items
  //         for (const item of items) {
  //           const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedAllVendor, selectedbothvendor, selectedProject, selcetedContractNumber, ...rest } = item;
  //           const updatedItem = {
  //             ...rest,
  //             invoice_number,
  //             type_of_vat: item.type_of_vat,
  //             tax_ppn: item.tax_ppn,
  //             tax_base: item.tax_base,
  //             tax_ppn_amount: item.tax_ppn_amount,
  //             tax_pph_amount: item.tax_pph_amount,
  //             tax_exchange_rate: item.exchange_rate,
  //             total_after_discount: item.subtotalAfterDiscount,
  //           };
  //           delete updatedItem.ID;
  //           delete updatedItem.id;
  //           delete updatedItem.vat;
  //           delete updatedItem.tax_pph_type;
  //           delete updatedItem.total_tax_base;
  //           delete updatedItem.total_amount_pph;
  //           delete updatedItem.total_amount_ppn;
  //           delete updatedItem.total_ppn_amount;
  //           delete updatedItem.rwnum;
  //           delete updatedItem.pr_number;
  //           delete updatedItem.id_trx;
  //           delete updatedItem.status;
  //           delete updatedItem.selectedCurrency;
  //           delete updatedItem.selectedProduct;
  //           delete updatedItem.selectedProject;
  //           delete updatedItem.new_unit_price;
  //           delete updatedItem.vat_included;
  //           delete updatedItem.exchange_rate;
  //           delete updatedItem.company;
  //           delete updatedItem.po_number;
  //           delete updatedItem.requestor;
  //           delete updatedItem.id_upload;
  //           delete updatedItem.total_before_discount;

  //           const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
  //           console.log("Item posted successfully:", itemResponse);
  //         }

  //         messageAlertSwal("Success", response.message, "success");
  //         resetForm();
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setIsLoading(false);
  //       messageAlertSwal("Error", err.message, "error");
  //     } finally {
  //       setIsLoading(false);
  //       setIsEditingPurchaseInvoice(false);
  //       handleRefresh(); // Set loading state back to false after completion
  //     }
  //   } else {
  //     console.log("Form submission was canceled.");
  //   }
  // };

  const handleSave = async (event) => {
    event.preventDefault();

    // Validation for required fields
    if (!invoice_number) {
      messageAlertSwal("Error", "Invoice Number cannot be empty.", "error");
      return; // Prevent form submission
    }

    // if (!tax_exchange_rate) {
    //   messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
    //   return;
    // }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Purchase Invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        // Generate PR number
        const pr_number = await generatePrNumber("PR");
        console.log("pr_number", pr_number);

        let endToEndId;
        if (!endToEnd) {
          endToEndId = await generatePrNumber("PURC");
        } else {
          endToEndId = endToEnd;
          console.log("endtoendId is not empty");
        }

        const checkDataResponse = await LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=invoice_number&filterValue=${invoice_number}&operation=EQUAL`, authToken, branchId);
        const existingData = checkDataResponse.data;

        const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount } = calculateTotalAmount();

        // Save general information
        const generalInfo = {
          doc_reff: docRef,
          payment_term,
          invoice_number,
          invoice_date,
          invoice_status: "DRAFT",
          term_of_payment,
          total_after_discount: subtotalAfterDiscount,
          total_before_discount: subTotal,
          discount,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          tax_exchange_rate,
          due_date,
          description,
          total_amount: totalAmount,
          endtoendid: endToEndId,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        let response;

        // Check if updating existing data or inserting new data
        if (selectedData) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        } else if (existingData && existingData.length > 0) {
          const id = existingData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        } else {
          response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
        }

        console.log("Data posted successfully:", response);

        // Handle file upload if applicable
        if (doc_source) {
          const request = {
            idTrx: endToEndId,
            code: "PUINVC",
          };

          const formData = new FormData();
          formData.append("request", JSON.stringify(request));
          formData.append("file", doc_source);

          const uploadResponse = await axios.post(`${UPLOAD_FILES}`, formData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          });

          if (uploadResponse.status === 200) {
            // Corrected to check status
            console.log("File uploaded successfully");
          } else {
            console.error("Error uploading file:", uploadResponse.status);
          }
        }

        // // Update Status for PR or PO
        // if (idPr) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}, { status_request: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // } else if (idPo) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}, { status_po: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // }

        // Handle item deletion and insertion
        if (response.message === "Update Data Successfully") {
          if (existingData && existingData.length > 0) {
            const piNum = existingData[0].invoice_number;
            const lookupResponse = await LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=invoice_number&filterValue=${piNum}&operation=EQUAL`, authToken, branchId);

            const ids = lookupResponse.data.map((item) => item.ID); // Dapatkan semua ID dari respons array
            console.log("IDs to delete:", ids);

            // Delete each item based on fetched IDs
            for (const id of ids) {
              try {
                await DeleteDataService.postData(`column=id&value=${id}`, "PUINVCD", authToken, branchId);
                console.log("Item deleted successfully:", id);
              } catch (error) {
                console.error("Error deleting item:", id, error);
              }
            }
          } else {
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
          }

          // Insert updated items
          for (const item of items) {
            const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedProject, ...rest } = item;
            const updatedItem = {
              ...rest,
              invoice_number,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.selectedCurrency;
            delete updatedItem.selectedProduct;
            delete updatedItem.selectedProject;
            delete updatedItem.selectedCustomer;
            delete updatedItem.selectedDepartement;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;
            delete updatedItem.company;
            delete updatedItem.po_number;
            delete updatedItem.requestor;
            delete updatedItem.id_upload;
            delete updatedItem.total_before_discount;
            delete updatedItem.total_after_discount;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
              console.log("Item inserted successfully:", itemResponse);
            } catch (error) {
              console.error("Error inserting item:", updatedItem, error);
            }
          }

          // Show success message and reset form
          messageAlertSwal("Success", response.message, "success");
          // resetForm();
        } else if (response.message === "insert Data Successfully") {
          // Insert new items
          for (const item of items) {
            const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedAllVendor, selectedbothvendor, selectedProject, selcetedContractNumber, ...rest } = item;
            const updatedItem = {
              ...rest,
              invoice_number,
              type_of_vat: item.type_of_vat,
              tax_ppn: item.tax_ppn,
              tax_base: item.tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
              tax_exchange_rate: item.tax_exchange_rate,
              total_after_discount: item.subtotalAfterDiscount,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.selectedCurrency;
            delete updatedItem.selectedProduct;
            delete updatedItem.selectedProject;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;
            delete updatedItem.company;
            delete updatedItem.po_number;
            delete updatedItem.requestor;
            delete updatedItem.id_upload;
            delete updatedItem.total_before_discount;

            const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          //Set status workflow VERIFIED
          LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
            .then((response) => {
              const data = response.data[0];
              console.log("Data:", data);

              const requestData = {
                idTrx: data.ID,
                status: "DRAFT", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
              };
              UpdateStatusService.postData(requestData, "PUINVC", authToken, branchId)
                .then((response) => {
                  console.log("Data updated successfully:", response);
                })
                .catch((error) => {
                  console.error("Failed to update data:", error);
                });
            })
            .catch((error) => {
              console.error("Failed to load purchase request data:", error);
            });
        }

        messageAlertSwal("Success", response.message, "success");
        // resetForm();
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false);
        // setIsEditingPurchaseInvoice(false);
        // handleRefresh(); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };

  const generatePrNumber = async (code) => {
    try {
      const response = await axios.get(`${GENERATED_NUMBER}?code=${code}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Ensure this token is valid
        },
      });
      const uniquePrNumber = response.data; // Adjust based on your API response structure
      setPrNumber(uniquePrNumber); // Update state, if needed elsewhere in your component
      return uniquePrNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate PR Number:", error.response ? error.response.data : error.message);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for required fields
    if (!invoice_number) {
      messageAlertSwal("Error", "Invoice Number cannot be empty.", "error");
      return; // Prevent form submission
    }

    // if (!tax_exchange_rate) {
    //   messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
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
        // Generate PR number
        const pr_number = await generatePrNumber("PR");
        console.log("pr_number", pr_number);

        let endToEndId;
        if (!endToEnd) {
          endToEndId = await generatePrNumber("PURC");
        } else {
          endToEndId = endToEnd;
          console.log("endtoendId is not empty");
        }

        const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount } = calculateTotalAmount();

        // Save general information
        const generalInfo = {
          doc_reff: docRef,
          payment_term,
          invoice_number: invoice_number.replace("DRAFT_", ""),
          invoice_date,
          invoice_status: "IN_PROCESS",
          term_of_payment,
          total_after_discount: subtotalAfterDiscount,
          total_before_discount: subTotal,
          discount,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          tax_exchange_rate,
          description,
          total_amount: totalAmount,
          endtoendid: endToEndId,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        let response;

        // Check if updating existing data or inserting new data
        if (selectedData) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        } else {
          response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
        }

        console.log("Data posted successfully:", response);

        // Handle file upload if applicable applicable
        if (doc_source) {
          const request = {
            idTrx: endToEndId,
            code: "PUINVC",
          };

          const formData = new FormData();
          formData.append("request", JSON.stringify(request));
          formData.append("file", doc_source);

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

        // Update Status for PR or PO
        if (idPr) {
          await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}`, { status_request: "INVOICE" }, { headers: { Authorization: `Bearer ${authToken}` } });
        } else if (idPo) {
          await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}`, { status_po: "INVOICE" }, { headers: { Authorization: `Bearer ${authToken}` } });
        }

        // Handle item deletion and insertion
        if (response.message === "Update Data Succesfully") {
          // Delete existing items
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

          // Insert updated items
          for (const item of items) {
            const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedProject, ...rest } = item;
            const updatedItem = {
              ...rest,
              invoice_number,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.selectedCurrency;
            delete updatedItem.selectedProduct;
            delete updatedItem.selectedProject;
            delete updatedItem.selectedCustomer;
            delete updatedItem.selectedDepartement;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;
            delete updatedItem.company;
            delete updatedItem.po_number;
            delete updatedItem.requestor;
            delete updatedItem.id_upload;
            delete updatedItem.total_before_discount;
            delete updatedItem.total_after_discount;

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
        } else if (response.message === "insert Data Successfully") {
          // Insert new items
          for (const item of items) {
            const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedAllVendor, selectedbothvendor, selectedProject, selcetedContractNumber, ...rest } = item;
            const updatedItem = {
              ...rest,
              invoice_number: invoice_number.replace("DRAFT_", ""),
              type_of_vat: item.type_of_vat,
              tax_ppn: item.tax_ppn,
              tax_base: item.tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
              tax_exchange_rate: item.tax_exchange_rate,
              total_after_discount: item.subtotalAfterDiscount,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.selectedCurrency;
            delete updatedItem.selectedProduct;
            delete updatedItem.selectedProject;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;
            delete updatedItem.company;
            delete updatedItem.po_number;
            delete updatedItem.requestor;
            delete updatedItem.id_upload;
            delete updatedItem.total_before_discount;

            const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);

            if(docRef === 'purchaseRequest' || docRef === 'purchaseOrder'){
              let fetchUrl;
              let formToDel;
              let getHeader;
              let formHeader;
              let fetchPRD;

              if(docRef === 'purchaseRequest'){
                fetchUrl = `PURC_FORMPUREQD&filterBy=pr_number&filterValue=${item.pr_number}&operation=EQUAL`;
                formToDel = 'PUREQD';
                formHeader = 'PUREQ';
                getHeader = `PURC_FORMPUREQ&filterBy=pr_number&filterValue=${item.doc_reff_no}&operation=EQUAL`
              }else if(docRef === 'purchaseOrder'){
                fetchUrl = `PURC_FORMPUORD&filterBy=po_number&filterValue=${item.po_number}&operation=EQUAL`;
                formToDel = 'PUORD';
                formHeader = 'PUOR';
                getHeader = `PURC_FORMPUOR&filterBy=po_number&filterValue=${item.doc_reff_no}&operation=EQUAL`;
              }
              
              const fetchCheckIsUsed = await LookupService.fetchLookupData(fetchUrl, authToken, branchId);
              const checkIsUsedData = fetchCheckIsUsed.data;
              console.log('fetchedisuseddata', checkIsUsedData);

              if(docRef === 'purchaseOrder'){
                const prno = checkIsUsedData.map(item => item.doc_reff_no);
                console.log('pron', prno);
                fetchPRD = await LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=pr_number&filterValue=${prno}&operation=EQUAL`, authToken, branchId);
                const prToDel = fetchPRD.data.map(item => item.ID);
                console.log('prtodel', prToDel);
                console.log('prtodels', fetchPRD);
                for (const prdel of prToDel) {
                  try {
                    // Now, find the corresponding stored item to update/insert
                    const storedItem = fetchPRD.data.find(item => item.ID === prdel);
                    
                    if (prToDel) {
  
                      // Delete the item first
                      await DeleteDataService.postData(`column=id&value=${prdel}`, 'PUREQD', authToken, branchId);
                      console.log('Item deleted successfully:', prdel);
                      
  
                      const { rwnum, ID, status, id_trx, ...stored } = storedItem;
  
                      console.log('storeditem', storedItem);
                      console.log('itemsa', item);
  
                      let invoicenum;
  
                      for (const item of items) { // Assuming 'items' is an array of items to check against
                        if (storedItem.ID === item.ID || storedItem.po_number !== null) {
                          invoicenum = invoice_number.replace('DRAFT_', "");
                          break; // Exit the loop early if we find a match
                        }
                      }
  
                
                      const updatedStoredItem = {
                        ...stored,
                        invoice_number: invoicenum,
                      };
                      console.log('updatedstatus', updatedStoredItem.status_detail);
                
                      // Remove unwanted fields
                      const fieldsToDelete = [
                        'rwnum',
                        'ID',
                        'id',
                        'status',
                        'id_trx',
                        'original_unit_price',
                        'type_of_vat',
                        'tax_ppn',
                        'tax_pph',
                        'tax_pph_type',
                        'total_amount_ppn',
                        'total_amount_pph',
                        'total_price_idr',
                        'tax_exchange_rate',
                        'total_after_discount',
                        'total_before_discount',
                        'tax_ppn_amount',
                        'tax_pph_amount',
                        'tax_ppn_rate',
                        'tax_pph_rate',
                        'subtotal',
                        'subTotal',
                        'tax_base',
                        'discount',
                        'vat_included',
                        'new_unit_price',
                        'requestor',
                      ];
  
                      fieldsToDelete.forEach(field => delete updatedStoredItem[field]);
  
                      // Insert the updated stored item
                      const storedItemResponse = await InsertDataService.postData(updatedStoredItem, 'PUREQD', authToken, branchId);
                      console.log('Stored item posted successfully:', storedItemResponse);
                      
                    } else {
                      console.log('No corresponding stored item found for ID:', prdel);
                    }
                
                  } catch (error) {
                    console.error('Error processing item:', prdel, error);
                  }
                }
              }

              const dels = fetchCheckIsUsed.data.map(item => item.ID);
              console.log('idtoChange', dels);

              let hasNullStatus = false;

              for (const del of dels) {
                try {
                  // Now, find the corresponding stored item to update/insert
                  const storedItem = fetchedDetail.find(item => item.ID === del);
                  
                  if (storedItem) {

                    // Delete the item first
                    await DeleteDataService.postData(`column=id&value=${del}`, formToDel, authToken, branchId);
                    console.log('Item deleted successfully:', del);
                    

                    const { rwnum, ID, status, id_trx, ...stored } = storedItem;

                    console.log('storeditem', storedItem);
                    console.log('itemsa', item);

                    let statusDetail;
                    let matchfound = false;

                    for (const item of items) { // Assuming 'items' is an array of items to check against
                      if (storedItem.ID === item.ID || storedItem.status_detail === "USED") {
                        statusDetail = "USED";
                        matchfound = true
                        break; // Exit the loop early if we find a match
                      }
                    }

                    if (!matchfound) {
                      hasNullStatus = true;
                    }
              
                    const updatedStoredItem = {
                      ...stored,
                      status_detail: statusDetail,
                      invoice_number: invoice_number,
                    };
                    console.log('updatedstatus', updatedStoredItem.status_detail);
              
                    // Remove unwanted fields
                    const fieldsToDelete = [
                      'rwnum',
                      'ID',
                      'id',
                      'status',
                      'id_trx',
                      'original_unit_price',
                      'type_of_vat',
                      'tax_ppn',
                      'tax_pph',
                      'tax_pph_type',
                      'total_amount_ppn',
                      'total_amount_pph',
                      'total_price_idr',
                      'tax_exchange_rate',
                      'total_after_discount',
                      'total_before_discount',
                      'tax_ppn_amount',
                      'tax_pph_amount',
                      'tax_ppn_rate',
                      'tax_pph_rate',
                      'subtotal',
                      'subTotal',
                      'tax_base',
                      'discount',
                      'vat_included',
                      'new_unit_price',
                      'requestor',
                    ];

                    fieldsToDelete.forEach(field => delete updatedStoredItem[field]);

                    // Insert the updated stored item
                    const storedItemResponse = await InsertDataService.postData(updatedStoredItem, formToDel, authToken, branchId);
                    console.log('Stored item posted successfully:', storedItemResponse);
                    
                  } else {
                    console.log('No corresponding stored item found for ID:', del);
                  }
              
                } catch (error) {
                  console.error('Error processing item:', del, error);
                }
              }
  
              const getDocRefList = await LookupService.fetchLookupData(getHeader, authToken, branchId);
              const prID = getDocRefList.data[0].ID;
              console.log('PRid', prID);

              let updateStatusData;
              if(docRef === 'purchaseRequest'){
                updateStatusData = {
                  status_request: hasNullStatus ? "PARTIAL_REQUESTED" : "REQUESTED",
                }
              }else if(docRef === 'purchaseOrder') {
                updateStatusData = {
                  status_po: hasNullStatus ? "PARTIAL_ORDERED" : "ORDERED ",
                }
              }

              // Update Status
                const updatePRStatus = await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=${formHeader}&column=id&value=${prID}&branchId=${branchId}`, updateStatusData, {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  }
                });
                await updatePRStatus;
            }
          } 

          //Set status workflow VERIFIED
          // LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
          // .then(response => {
          //   const data = response.data[0];
          //   console.log('Data:', data);

          //   const requestData = {
          //     idTrx: data.ID, 
          //     status: "IN_PROCESS", 
          //   };
          //   UpdateStatusService.postData(requestData, "PUOR", authToken, branchId)
          //     .then(response => {
          //       console.log('Data updated successfully:', response);
          //     })
          //     .catch(error => {
          //       console.error('Failed to update data:', error);
          //     });

          // })
          // .catch(error => {
          //   console.error('Failed to load purchase request data:', error);
          // });
          

          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false);
        // setIsEditingPurchaseInvoice(false);
        // handleRefresh(); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };
  //handle submit hanya insert dan benar
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (!invoice_number) {
  //     messageAlertSwal("Error", "Invoice Number cannot be empty.", "error");
  //     return; // Prevent form submission
  //   }

  //   if (!tax_exchange_rate) {
  //     messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
  //     return;
  //   }

  //   // if (!title) {
  //   //   messageAlertSwal("Error", "Title cannot be empty", "error");
  //   //   return;
  //   // }

  //   // Show SweetAlert2 confirmation
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to submit the Purchase Invoice?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, submit it!",
  //     cancelButtonText: "No, cancel!",
  //     reverseButtons: true,
  //   });

  //   if (result.isConfirmed) {
  //     setIsLoading(true);
  //     try {
  //       const pr_number = await generatePrNumber("PR");

  //       console.log("pr_number", pr_number);
  //       let endToEndId;
  //       // const endToEndId = await handleEndToEnd();
  //       if (!endToEnd) {
  //         // Call generate function if endtoendId is empty or null
  //         endToEndId = await generatePrNumber("PURC");
  //       } else {
  //         // Do something else if endtoendId is not empty
  //         endToEndId = endToEnd;
  //         console.log("endtoendId is not empty");
  //       }
  //       const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount } = calculateTotalAmount();
  //       // Save general information and description
  //       const generalInfo = {
  //         doc_reff: docRef,
  //         // doc_reff_no: doc_reference,
  //         // internalmemo,
  //         payment_term, // Converts to date format
  //         invoice_number,
  //         // invoice_type,
  //         invoice_date,
  //         invoice_status: "IN_PROCESS",
  //         // vendor,
  //         // tax_rate,
  //         // tax_invoice_number,
  //         term_of_payment,
  //         // bi_middle_rate,
  //         total_after_discount: subtotalAfterDiscount,
  //         total_before_discount: subTotal,
  //         discount,
  //         total_amount_ppn: totalPPNAmount,
  //         total_amount_pph: totalPPHAmount,
  //         tax_exchange_rate,
  //         // project,
  //         due_date,
  //         description,
  //         total_amount: totalAmount,
  //         endtoendid: endToEndId,
  //       };

  //       console.log("Master", generalInfo);
  //       console.log("Items", items);

  //       const response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
  //       console.log("Data posted successfully:", response);

  //       if (doc_source) {
  //         const request = {
  //           idTrx: endToEndId,
  //           code: "PUINVC",
  //         };

  //         const formData = new FormData();
  //         formData.append("request", JSON.stringify(request));
  //         formData.append("file", doc_source); // Use the file variable directly

  //         const uploadResponse = await axios.post(`${UPLOAD_FILES}`, formData, {
  //           headers: {
  //             Authorization: `Bearer ${authToken}`,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         });

  //         if (uploadResponse.ok) {
  //           console.log("File uploaded successfully");
  //         } else {
  //           console.error("Error uploading file:", uploadResponse.status);
  //         }
  //       }

  //       // Update Status
  //       if (idPr) {
  //         const updatePRStatus = await axios.post(
  //           `${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}`,
  //           {
  //             status_request: "INVOICE",
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${authToken}`,
  //             },
  //           }
  //         );
  //         return updatePRStatus;
  //       } else if (idPo) {
  //         const updatePOStatus = await axios.post(
  //           `${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}`,
  //           {
  //             status_po: "INVOICE",
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${authToken}`,
  //             },
  //           }
  //         );
  //         return updatePOStatus;
  //       }

  //       if (response.message === "insert Data Successfully") {
  //         // Iterate over items array and post each item individually
  //         for (const item of items) {
  //           const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedAllVendor, selectedbothvendor, selectedProject, selectedDepartement, selectedCustomer, selcetedContractNumber, ...rest } = item;
  //           const updatedItem = {
  //             ...rest,
  //             invoice_number,
  //             type_of_vat: item.type_of_vat,
  //             tax_ppn: item.tax_ppn,
  //             tax_pph: item.tax_pph_type,
  //             tax_base: item.tax_base,
  //             tax_ppn_amount: item.tax_ppn_amount,
  //             tax_pph_amount: item.tax_pph_amount,
  //             type_of_vat: item.type_of_payment,
  //             tax_exchange_rate: item.exchange_rate,
  //             total_after_discount: item.subtotalAfterDiscount,
  //             // new_unit_price: item.unit_price,
  //           };
  //           delete updatedItem.ID;
  //           delete updatedItem.id;
  //           delete updatedItem.vat;
  //           delete updatedItem.tax_ppn;
  //           delete updatedItem.tax_pph_type;
  //           delete updatedItem.total_tax_base;
  //           delete updatedItem.total_amount_pph;
  //           delete updatedItem.total_amount_ppn;
  //           delete updatedItem.total_ppn_amount;
  //           delete updatedItem.rwnum;
  //           delete updatedItem.pr_number;
  //           delete updatedItem.id_trx;
  //           delete updatedItem.status;
  //           delete updatedItem.new_unit_price;
  //           delete updatedItem.vat_included;
  //           delete updatedItem.exchange_rate;
  //           delete updatedItem.company;
  //           delete updatedItem.po_number;
  //           delete updatedItem.requestor;
  //           delete updatedItem.id_upload;
  //           delete updatedItem.total_before_discount;

  //           const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
  //           console.log("Item posted successfully:", itemResponse);
  //         }

  //         messageAlertSwal("Success", response.message, "success");
  //         resetForm();
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setIsLoading(false);
  //       messageAlertSwal("Error", err.message, "error");
  //     } finally {
  //       setIsLoading(false); // Set loading state back to false after completion
  //     }
  //   } else {
  //     console.log("Form submission was canceled.");
  //   }
  // };

  const dynamicFormWidth = (e) => {
    const contentLength = e.target.value.length;
    const newWidth = Math.max(100, contentLength * 12); // 8px per character, adjust as needed
    setInputWidth(newWidth);
  };

  const taxExchangeChange = (e) => {
    setTaxExchangeRate(e);
    console.log("taxe", tax_exchange_rate);
    items.forEach((item) => {
      item.tax_exchange_rate = parseFloat(e) || 0;
    });
  };

  console.log("subl", items.tax_exchange_rate);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setInvoiceDate(today);
  }, []);

  const getFileDocument = async (endtoendid) => {
    const request = {
      idTrx: "2910202400024",
      code: "PUREQD",
    };

    const formData = new FormData();
    formData.append("request", JSON.stringify(request));
    console.log("token", authToken);
    try {
      const getFileResponse = await axios.get(`${DOWNLOAD_FILES}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: request,
        responseType: "blob",
      });
      const blob = new Blob([getFileResponse.data], { type: getFileResponse.headers["content-type"] || "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = getFileResponse.headers["content-disposition"];
      const filename = contentDisposition ? contentDisposition.split("filename=")[1].replace(/"/g, "") : "download.pdf";

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const usedOptions = new Set(items.map((item) => item.doc_reff_no));
  const optionsWithDisabled = prNumberOptions.map((option) => ({
    ...option,
    isDisabled: usedOptions.has(option.value),
  }));
  const optionsWithDisabled1 = poNumberOptions.map((option) => ({
    ...option,
    isDisabled: usedOptions.has(option.value),
  }));

  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>{selectedData ? "Edit Purchase Invoice" : "Add Purchase Invoice"}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">{selectedData ? "Edit Purchase Invoice" : "Add Purchase Invoice"}</li>
              </ol>
            </div>
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
                  {setIsEditingPurchaseInvoice && (
                    <>
                      <Button
                        variant="secondary"
                        className="mr-2"
                        onClick={() => {
                          handleRefresh();
                          setIsEditingPurchaseInvoice(false);
                        }}
                      >
                        <i className="fas fa-arrow-left"></i> Go Back
                      </Button>
                    </>
                  )}
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
                    )}

                    {docRef === "customerContract" && (
                      <Col md={6}>
                        <Form.Group controlId="formInternalMemo">
                          <Form.Label>Customer Contract</Form.Label>
                          <Form.Control type="text" placeholder="Enter Document Contract" value={customer_contract} onChange={(e) => setCustomerContract(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    )} */}

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
                          min="0"
                          value={tax_exchange_rate.toLocaleString('en-US')}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                            taxExchangeChange(newPrice);
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
                              {/* <th>Tax Invoice Number Vendor</th> */}
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
                                  {/* <td>
                                    <Select
                                      value={prNumberOptions.find((option) => option.value === item.doc_reff_num)}
                                      options={prNumberOptions}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "doc_reff_num", selectedOption ? selectedOption.value : null);
                                        handlePrNumberChange(index, selectedOption);
                                      }}
                                      isMulti
                                      isClearable
                                      required
                                      placeholder={
                                        docRef === "customerContract" ? "Customer Contract..." : docRef === "internalMemo" ? "Internal Memo..." : docRef === "purchaseRequest" ? "Purchase Request..." : "Please Select Doc Reference"
                                      }
                                      isDisabled={docRef === ""}
                                    />
                                  </td> */}
                                  <td>
                                    {docRef === "purchaseRequest" && (
                                      <Form.Group controlId="formPrNumber">
                                        <Select
                                          value={prNumberOptions.find((option) => option.value === item.doc_reff_no)}
                                          options={optionsWithDisabled}
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

                                    {docRef === "purchaseOrder" && (
                                      <Form.Group controlId="formPoNumber">
                                        <Select
                                          value={poNumberOptions.find((option) => option.value === item.doc_reff_no)}
                                          options={optionsWithDisabled1}
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

                                    {docRef === "internalMemo" && (
                                      <Form.Group controlId="formInternalMemo">
                                        <Form.Control type="text" placeholder="Enter Internal Memo" value={item.doc_reff_no} onChange={(e) => handleItemChange(index, "doc_reff_no", e.target.value)} required />
                                      </Form.Group>
                                    )}

                                    {docRef === "customerContract" && (
                                      <Form.Group controlId="formCustomerContract">
                                        <Form.Control type="text" placeholder="Enter Document Contract" value={item.doc_reff_no} onChange={(e) => handleItemChange(index, "doc_reff_no", e.target.value)} required />
                                      </Form.Group>
                                    )}

                                    {docRef !== "purchaseRequest" && docRef !== "purchaseOrder" && docRef !== "internalMemo" && docRef !== "customerContract" && (
                                      <Form.Control type="number" value={item.doc_reff_no} onChange={(e) => handleItemChange(index, "doc_reff_no", parseFloat(e.target.value))} disabled />
                                    )}
                                  </td>
                                  <td>
                                    {isAddFile ? (
                                      <div className="d-flex">
                                        <Form.Control type="file" placeholder="Upload Document" onChange={(e) => setFile(e.target.files[0])} disabled />
                                        <button className="btn btn-danger ms-2" onClick={() => setIsAddFile(false)}>
                                          <i className="fa fa-times" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {item.doc_source ? (
                                          <a
                                            href="#"
                                            className="me-2"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              getFileDocument(item.endtoendid);
                                            }}
                                          >
                                            {item.doc_source}
                                          </a>
                                        ) : (
                                          <span className="me-2">No Data</span>
                                        )}
                                        <button className="btn btn-success" onClick={() => setIsAddFile(true)}>
                                          <i className="fa fa-edit" />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.invoice_number_vendor} onChange={(e) => handleItemChange(index, "invoice_number_vendor")} />
                                  </td>
                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_invoice_number_vendor} onChange={(e) => handleItemChange(index, "tax_invoice_number_vendor", parseFloat(e.target.value))} />
                                  </td> */}
                                  {docRef === "purchaseRequest" && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select
                                          value={vendorOptions.find((option) => option.value === item.vendor)}
                                          onChange={(selectedOption) => handleItemChange(index, "vendor", selectedOption ? selectedOption.value : null)}
                                          options={vendorOptions}
                                          isClearable
                                          placeholder="Select Vendor..."
                                        />
                                      </Form.Group>
                                    </td>
                                  )}
                                  {docRef === "purchaseOrder" && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select
                                          value={allvendoroptions.find((option) => option.value === item.vendor)}
                                          onChange={(selectedOption) => handleItemChange(index, "vendor", selectedOption ? selectedOption.value : null)}
                                          options={allvendoroptions}
                                          isClearable
                                          placeholder="Select Vendor..."
                                        />
                                      </Form.Group>
                                    </td>
                                  )}
                                  {!(docRef === "purchaseRequest" || docRef === "purchaseOrder") && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select
                                          value={allvendoroptions.find((option) => option.value === item.vendor)}
                                          onChange={(selectedOption) => handleItemChange(index, "vendor", selectedOption.value)}
                                          options={allvendoroptions}
                                          isClearable
                                          placeholder="Select Vendor..."
                                        />
                                      </Form.Group>
                                    </td>
                                  )}

                                  {docRef === "purchaseRequest" ? (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        {/* <Form.Label>Project</Form.Label> */}
                                        <Select
                                          value={projectOptions.find((option) => option.value === item.project)}
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, "project", selectedOption ? selectedOption.value : null);

                                            if (selectedOption) {
                                              const prjtNum = selectedOption.contract_number || ""; // Check for null
                                              handleItemChange(index, "project_contract_number", prjtNum);

                                              // Assuming selectedOption contains customer information
                                              const customer = selectedOption.customer || ""; // Adjust this based on your data structure
                                              handleItemChange(index, "customer", customer);
                                            } else {
                                              handleItemChange(index, "customer", ""); // Clear if null
                                              handleItemChange(index, "project_contract_number", ""); // Clear if null
                                            }
                                          }}
                                          options={projectOptions}
                                          isClearable
                                          placeholder="Select Project..."
                                          styles={{
                                            placeholder: (base) => ({
                                              ...base,
                                              color: "#8d8080",
                                            }),
                                          }}
                                        />
                                      </Form.Group>
                                    </td>
                                  ) : (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        {/* <Form.Label>Project</Form.Label> */}
                                        <Select
                                          value={projectOptions.find((option) => option.value === item.project)}
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, "project", selectedOption ? selectedOption.value : null);

                                            if (selectedOption) {
                                              const prjtNum = selectedOption.contract_number || ""; // Check for null
                                              handleItemChange(index, "project_contract_number", prjtNum);

                                              // Assuming selectedOption contains customer information
                                              const customer = selectedOption.customer || ""; // Adjust this based on your data structure
                                              handleItemChange(index, "customer", customer);
                                            } else {
                                              handleItemChange(index, "customer", ""); // Clear if null
                                              handleItemChange(index, "project_contract_number", ""); // Clear if null
                                            }
                                          }}
                                          options={projectOptions}
                                          isClearable
                                          placeholder="Select Project..."
                                          styles={{
                                            placeholder: (base) => ({
                                              ...base,
                                              color: "#8d8080",
                                            }),
                                          }}
                                        />
                                      </Form.Group>
                                    </td>
                                  )}

                                  <td>
                                    <Select
                                      id="projectContractNumber"
                                      value={contractNumberOption.find((option) => option.value === item.project_contract_number)}
                                      options={contractNumberOption}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "project_contract_number", selectedOption ? selectedOption.value : null);
                                      }}
                                      placeholder="Project Contract Number..."
                                      isClearable
                                      required
                                      styles={{
                                        placeholder: (base) => ({
                                          ...base,
                                          color: "#8d8080",
                                        }),
                                      }}
                                    />
                                  </td>

                                  <td>
                                    <Select
                                      id="customer"
                                      value={customerOptions.find((option) => option.value === item.customer)}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "customer", selectedOption ? selectedOption.value : null);
                                      }}
                                      options={customerOptions}
                                      placeholder="Customer..."
                                      isClearable
                                      required
                                    />
                                  </td>
                                  <td>
                                    <Select
                                      id="department"
                                      value={departementOptions.find((option) => option.value === item.departement)}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "departement", selectedOption ? selectedOption.value : null);
                                      }}
                                      options={departementOptions}
                                      placeholder="Department..."
                                      isClearable
                                      required
                                    />
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

                                  <td>
                                    <Form.Control
                                      className="text-left"
                                      type="text"
                                      value={item.tax_exchange_rate !== undefined && item.tax_exchange_rate !== null ? item.tax_exchange_rate.toLocaleString("en-US") : "0"}
                                      onChange={(e) => {
                                        const input = e.target.value;

                                        // Allow only numbers, periods, and remove unwanted characters
                                        const sanitizedInput = input.replace(/[^0-9.]/g, "");

                                        // Update the state with sanitized input
                                        handleItemChange(index, "tax_exchange_rate", sanitizedInput);

                                        // Optional: Adjust the width dynamically based on the input
                                        dynamicFormWidth(e);
                                      }}
                                      onBlur={() => {
                                        const rate = parseFloat(item.tax_exchange_rate) || 0;
                                        handleItemChange(index, "tax_exchange_rate", rate); // Convert back to number on blur
                                      }}
                                      disabled
                                    />
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

                                  <td className={item.currency}>{item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency }) || 0}</td>

                                  <td>{item.total_price_idr?.toLocaleString("en-US", { style: "currency", currency: "IDR" }) ?? "IDR 0.00"}</td>
                                  <td>
                                    <Select
                                      value={codCorSkbOptions.find((option) => option.value === items[index].cod_cor_skb)} // Find the corresponding COD/COR, SKB option
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "cod_cor_skb", selectedOption ? selectedOption.value : null); // Call handleItemChange to update the codCorSkb for the specific item
                                      }}
                                      options={codCorSkbOptions} // List of COD/COR, SKB options
                                      isClearable // Allow clearing the selection
                                      placeholder="Select COD/COR, SKB..." // Placeholder text
                                    />
                                  </td>
                                  <td>
                                    <Form.Control as="select" value={items[index].type_of_vat || ""} onChange={(selectedOption) => handleItemChange(index, "type_of_vat", selectedOption.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                      <option value="non_ppn">Non PPN</option>
                                      <option value="ppn_royalty">PPN Royalty</option>
                                    </Form.Control>
                                  </td>

                                  {/* <td>
                                      <Form.Control type="number" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", parseFloat(e.target.value))} />
                                    </td> */}
                                  <td>
                                    <Select
                                      value={
                                        items[index].type_of_vat === "ppn_royalty" ? tax_ppn_royalty_option.find((option) => option.value === item.tax_ppn) : taxPpnTypeOption.find((option) => option.value === items[index].tax_ppn) || null
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
                                    className='text-right'
                                    type="text"
                                    value={discount !== undefined && discount !== null ? discount.toLocaleString('en-US') : 0}
                                    onChange={(e) => {
                                      const newDiscount = parseFloat(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                                      setDiscount(newDiscount);
                                      
                                    }}
                                    style={{
                                      textAlign: 'right',
                                      marginLeft: 'auto',  
                                      display: 'flex',
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
                              <td colSpan="25">Total PPh Amount:</td>
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
            {/* <Button
              variant="secondary"
              className="mr-2"
              onClick={() => {
                handleRefresh();
                setIsAddingNewPurchaseInvoice(false);
              }}
            >
              <i className="fas fa-arrow-left"></i>Go Back
            </Button> */}
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
