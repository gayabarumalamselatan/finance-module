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
import UpdateDataService from "../service/UpdateDataService";
import DeleteDataService from "../service/DeleteDataService";
import UpdateStatusService from "../service/UpdateStatusService";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

const AddPettyCash = ({ setIsAddingNewPettyCash, setIsEditingPettyCash, handleRefresh, index, item, selectedData }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem("userId");
  const [inputWidth, setInputWidth] = useState(100);
  const [tax_pph_type_option, setTax_Pph_Type_Option] = useState([]);
  const [tax_ppn_royalty_option, setTaxPpnRoyaltyOption] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);
  const [payment_term, setPaymentTerm] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);

  // general info
  const [payment_source, setPaymentSource] = useState("");
  const [currency, setCurrency] = useState("");
  const [paid_to, setPaidTo] = useState("");
  const [doc_reff, setDocReff] = useState("");
  const [doc_reff_no, setDocReffNo] = useState("");
  const [voucher_number, setVoucherNumber] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [voucher_date, setVoucherDate] = useState(new Date().toISOString().slice(0, 10));
  const [total_amount, setTotalAmount] = useState("");
  const [exchange_rate, setExchangeRate] = useState("");
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState("");
  const [total_debt, setTotalDebt] = useState("");
  const [total_paid, setTotalPaid] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [total_price, setTotalPrice] = useState("");

  // detail item
  const [coa, setCoa] = useState("");
  const [description, setDescription] = useState("");
  const [invoice_number, setInvoiceNumber] = useState("");
  const [db_cr, setDbCr] = useState("");
  const [type_of_vat, setTypeOfVat] = useState("");
  const [tax_ppn, setTax_ppn] = useState("");
  const [tax_ppn_amount, setTaxPpnAmount] = useState("");
  const [tax_ppn_rate, setPpnRate] = useState("");
  const [tax_pph_rate_2, setTaxPphRate2] = useState("");
  const [tax_pph_amount, setTaxPphAmount] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState("");
  const [amount_paid, setAmountPaid] = useState("");
  const [tax_pph, setTaxPph] = useState("");
  const [tax_pph_rate, setTaxPphRate] = useState("");
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState("");
  const [amount_idr, setAmountIDR] = useState("");

  const [purchase_invoice_number, setPurchaseInvoiceNumber] = useState("");
  const [amount_in_idr, setAmountInIdr] = useState("");
  const [employee, setEmployee] = useState("");
  const [customer, setCustomer] = useState("");
  const [purchase_invoice_date, setPurchaseInvoiceDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [project_contract_number, setProjectContractNumber] = useState("");
  const [allVendorOptions, setAllVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedPaidTo, setSelectedPaidTo] = useState(null);
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
  const [type_of_pph_option, setType_Of_Pph_Option] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [selectedTaxPphType, setSelectedTaxPphType] = useState(null);
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState([]);

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
  const [paymentSourceOptions, setPaymentSourceOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedPaymentSource, setSelectedPaymentSource] = useState(null);
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
  // const [PpnRate, setPpnRate] = useState("");
  const [PphRate, setPphRate] = useState("");

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

          LookupParamService.fetchLookupDataView("VOUC_VIEWVCPETTY", authToken, branchId)
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

  useEffect(() => {
    const generateInitialVoucherNumber = async () => {
      const generatedVoucherNumber = await generateVoucherNumber("DRAFT_VOUC"); // Adjust the code as needed

      setVoucherNumber(generatedVoucherNumber);
    };

    generateInitialVoucherNumber();
  }, []);

  useEffect(() => {
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

    LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
      .then((data) => {
        console.log("Payment Source lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const bothOptions = transformedData
          .filter((item) => item.TYPE === "PETTY CASH")
          .map((item) => ({
            value: item.BANK_NAME,
            label: item.BANK_NAME,
          }));
        setPaymentSourceOptions(bothOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch payment source lookup:", error);
      });

    // buat vendor
    LookupParamService.fetchLookupDataView("VOUC_VIEWVCPETTY", authToken, branchId)
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
          product_account: item.PRODUCT_ACCOUNT,
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
        setType_Of_Pph_Option(options);

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

  const dynamicFormWidth = (e) => {
    const contentLength = e.target.value.length;
    const newWidth = Math.max(100, contentLength * 12); // 8px per character, adjust as needed
    setInputWidth(newWidth);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        coa: " ",
        description: " ",
        // invoice_number:" ",
        amount: 0,
        db_cr: "Db",
        type_of_vat: " ",
        tax_ppn: " ",
        tax_ppn_amount: 0,
        tax_pph_amount: 0,
        tax_pph: " ",
        amount_paid: 0,
        project: " ",
        description: "",
        department: " ",
        vendor: "",
        department: "",
        doc_reff_no: "",
        total_debt: 0,
        total_paid: 0,
        // employee:"",
        quantity: 0,
        unit_price: 0,
        tax_ppn_rate: "",
        // doc_reff:'',
      },
    ]);
  };

  // buat yang ada pph
  //   const handleItemChange = (index, field, value) => {
  //     const newItems = [...items];
  //     newItems[index][field] = value;

  // if (field === "amount_paid") {
  //       // Update item dengan amount_paid baru
  //       const numericValue = Number(value);
  //     newItems[index].amount_paid = numericValue;
  //       // newItems[index].amount_paid = value;

  //       // Hitung total_paid
  //       const newTotalPaid = newItems.reduce((total, item) => total + (item.amount_paid || 0), 0);
  //       setTotalPaid(newTotalPaid);
  //   }

  //     // Reset fields when 'unit_price' or 'quantity' changes
  //     if (field === "unit_price" || field === "quantity") {
  //       newItems[index].type_of_vat = "";
  //       newItems[index].tax_ppn = "";
  //       newItems[index].tax_base = 0;
  //       newItems[index].tax_ppn_amount = 0;
  //       newItems[index].tax_pph_amount = 0;
  //       newItems[index].tax_pph = "";
  //       newItems[index].type_of_pph = "";
  //       newItems[index].tax_pph_rate = 0;
  //       if (newItems[index].vat_included !== undefined) {
  //         newItems[index].vat_included = false;
  //       }
  //     }

  //     if (field === "type_of_pph") {
  //       newItems[index].tax_pph = ""; // Reset tax_pph
  //       newItems[index].tax_pph_rate = 0; // Reset tax_pph_rate
  //     }

  //     // Update total price and total price IDR
  //     if (field === "quantity" || field === "unit_price") {
  //       newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;

  //       // Calculate total_price_idr based on exchange rate if currency is not IDR
  //       if (newItems[index].currency === "IDR") {
  //         newItems[index].total_price_idr = newItems[index].total_price;
  //       } else {
  //         newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].tax_exchange_rate || 1);
  //       }
  //     }

  //     // Calculate New Unit Price based on VAT and PPN
  //     // Calculate New Unit Price based on VAT and PPN

  //     let pengkali = newItems[index].tax_ppn_rate / 100;

  //     // Calculate PPN and PPH

  //     if (field === "tax_ppn" || field === "tax_ppn_rate") {
  //       if (newItems[index].type_of_vat === "include") {
  //         newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
  //         newItems[index].tax_base = Math.round(newItems[index].total_price / (1 + newItems[index].tax_ppn_rate / 100));
  //         newItems[index].tax_ppn_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
  //         newItems[index].vat_included = true;
  //       } else if (newItems[index].type_of_vat === "exclude" || newItems[index].type_of_vat === "ppn_royalty") {
  //         newItems[index].tax_ppn_amount = Math.floor(newItems[index].total_price * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
  //         newItems[index].tax_base = newItems[index].total_price;
  //       }
  //     }

  //     // Handle non_ppn case

  //     if (newItems[index].type_of_vat === "non_ppn") {
  //       // Reset PPN related fields
  //       newItems[index].tax_ppn = "";
  //       newItems[index].tax_ppn_rate = 0;
  //       newItems[index].tax_ppn_amount = 0; // No PPN for non_ppn
  //       newItems[index].new_unit_price = newItems[index].unit_price; // Set new unit price to the original unit price
  //       newItems[index].tax_base = newItems[index].total_price; // Tax base is the total price
  //       newItems[index].tax_pph_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100)); // Calculate PPH only
  //     }

  //     // Calculate PPh based on PPh type and rate

  //     if (field === "tax_pph_type" || field === "tax_pph_rate") {
  //       if (newItems[index].type_of_pph === "gross") {
  //         if (newItems[index].type_of_vat === "exclude") {
  //           newItems[index].tax_pph_amount = Math.floor(newItems[index].total_price * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
  //         } else {
  //           newItems[index].tax_pph_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
  //         }
  //       } else if (newItems[index].type_of_pph === "nett") {
  //         let taxWithPPh = newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100);
  //         newItems[index].tax_pph_amount = Math.floor(taxWithPPh * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
  //         newItems[index].tax_ppn_amount = Math.floor(taxWithPPh * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
  //       }
  //     }

  //     // Update VAT type logic

  //     if (field === "type_of_vat") {
  //       // Reset VAT-related fields
  //       newItems[index].tax_ppn = "";
  //       newItems[index].tax_ppn_rate = 0;
  //       newItems[index].tax_base = 0;
  //       newItems[index].tax_ppn_amount = 0;
  //       newItems[index].tax_pph_amount = 0;
  //       newItems[index].tax_pph = "";
  //       newItems[index].type_of_pph = "";
  //       newItems[index].tax_pph_rate = 0;
  //       // Set new unit price to the original unit price

  //       newItems[index].new_unit_price = newItems[index].unit_price;
  //       newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
  //     }

  //     // Update item state

  //     setItems(newItems);
  //   };

  // const handlePaidToChange = (selectedOption) => {
  //   setSelectedPaidTo(selectedOption);
  //   setPaidTo(selectedOption ? selectedOption.value : "");

  //   if (selectedOption) {
  //     // Fetch data for the selected "paid_to"
  //     LookupService.fetchLookupData(
  //       `PURC_FORMPUREQD&filterBy=VENDOR&filterValue=${selectedOption.value}&operation=EQUAL`,authToken,branchId)

  //       .then((response) => {
  //         const fetchedItems = response.data || [];
  //         console.log("Items fetched for Paid To:", fetchedItems);

  //         LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
  //           .then((productData) => {
  //             console.log("Product lookup data:", productData);

  //             const transformedProductData = productData.data.map((item) =>
  //               Object.keys(item).reduce((acc, key) => {
  //                 acc[key.toUpperCase()] = item[key];
  //                 return acc;
  //               }, {})
  //             );

  //             const productOptions = transformedProductData.map((item) => ({
  //               value: item.NAME,
  //               label: item.NAME,
  //               product_account: item.PRODUCT_ACCOUNT,
  //             }));

  //             setProductOptions(productOptions); // Set product options to state

  //             // Fetch description, total amount, invoice date, and invoice_number_vendor from "PURC_FORMPUINVC"
  //             LookupParamService.fetchLookupData("PURC_FORMPUREQ", authToken, branchId)
  //               .then((descriptionData) => {
  //                 console.log("Description lookup data:", descriptionData);

  //                 const transformedDescriptionData = descriptionData.data.map((item) =>
  //                   Object.keys(item).reduce((acc, key) => {
  //                     acc[key.toUpperCase()] = item[key];
  //                     return acc;
  //                   }, {})
  //                 );

  //                 const descriptionOptions = transformedDescriptionData.map((item) => ({
  //                   value: item.PR_NUMBER,
  //                   description: item.DESCRIPTION,
  //                   total_after_discount: item.TOTAL_AFTER_DISCOUNT,
  //                 }));

  //                 const newItems = [...items];

  //                 // Map the fetched data to items
  //                 const updatedItems = fetchedItems.map((item) => {
  //                   const selectedProductOption = productOptions.find((option) => option.value === item.product);
  //                   const selectedDescription = descriptionOptions.find((desc) => desc.value === item.pr_number) || {};
  //                   return {
  //                     ...item,
  //                     doc_reff_no: item.pr_number,
  //                     selectedProduct: selectedProductOption ? selectedProductOption.value : "",
  //                     coa: selectedProductOption ? selectedProductOption.product_account : "",
  //                     description: selectedDescription.description || "",
  //                   }
  //                 });

  //                 updatedItems.forEach((fetchedItem, i) => {
  //                   newItems[i] = {
  //                     ...newItems[i],
  //                     ...fetchedItem,
  //                   };
  //                 });

  //                 console.log('new', newItems)
  //                 setItems(newItems); // Update state with the autofilled items

  //                 // updatedFetchedItems.forEach((fetchedItem, i) => {
  //                 //     newItems[index + i] = {
  //                 //         ...newItems[index + i],
  //                 //         ...fetchedItem,
  //                 //     };
  //                 // });

  //                 // setItems(newItems); // Update items state with new data

  //               })
  //               .catch((error) => {
  //                 console.error("Failed to fetch data for Paid To:", error);
  //               })
  //           })
  //           .catch((error) => {
  //             console.error("Failed to fetch data for Paid To:", error);
  //           })

  //       })
  //       .catch((error) => {
  //         console.error("Failed to fetch data for Paid To:", error);
  //       });
  //   } else {
  //     // Reset fields when no option is selected
  //     const newItems = items.map((item) => ({
  //       ...item,
  //       product: "",
  //       product_note: "",
  //       quantity: 1,
  //       currency: "IDR",
  //       unit_price: 0,
  //       original_unit_price: 0,
  //       total_price: 0,
  //       type_of_vat: "",
  //       tax_ppn: "",
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
  //       coa: "",
  //       amount: "",
  //       description: "",
  //       coa: "",
  //       total_after_discount: 0,
  //     }
  //   ));
  //   console.log('items new', newItems)
  //     setItems(newItems);
  //   }
  // };

  const handlePaidToChange = (selectedOption) => {
    setSelectedPaidTo(selectedOption);
    setPaidTo(selectedOption ? selectedOption.value : "");

    if (selectedOption) {
      // Fetch data for the selected "paid_to"
      LookupService.fetchLookupData(`PURC_FORMPUOR&filterBy=VENDOR&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)

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
                product_account: item.PRODUCT_ACCOUNT,
              }));

              setProductOptions(productOptions); // Set product options to state

              // Fetch description, total amount, invoice date, and invoice_number_vendor from "PURC_FORMPUINVC"
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
                    label: item.PO_NUMBER,
                    id: item.ID,
                    project: item.PROJECT,
                    totalAmount: item.TOTAL_AMOUNT,
                    // currency: item.CURRENCY, // Add the currency property
                    // quantity: item.QUANTITY,
                    description: item.DESCRIPTION,
                    title: item.TITLE,
                  }));

                  const newItems = [...items];

                  // Map the fetched data to items
                  const updatedItems = fetchedItems.map((item) => {
                    const selectedProductOption = productOptions.find((option) => option.value === item.product);
                    const selectedDescription = descriptionOptions.find((desc) => desc.value === item.pr_number) || {};
                    return {
                      ...item,
                      doc_reff_no: item.po_number,
                      selectedProduct: selectedProductOption ? selectedProductOption.value : "",
                      coa: selectedProductOption ? selectedProductOption.product_account : "",
                      description: selectedDescription.description || "",
                    };
                  });

                  updatedItems.forEach((fetchedItem, i) => {
                    newItems[i] = {
                      ...newItems[i],
                      ...fetchedItem,
                    };
                  });

                  console.log("new", newItems);
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
                });
            })
            .catch((error) => {
              console.error("Failed to fetch data for Paid To:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to fetch data for Paid To:", error);
        });
    }
    if (selectedOption) {
      // Fetch data for the selected "paid_to"
      LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=VENDOR&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)

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
                product_account: item.PRODUCT_ACCOUNT,
              }));

              setProductOptions(productOptions); // Set product options to state

              // Fetch description, total amount, invoice date, and invoice_number_vendor from "PURC_FORMPUINVC"
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

                  const newItems = [...items];

                  // Map the fetched data to items
                  const updatedItems = fetchedItems.map((item) => {
                    const selectedProductOption = productOptions.find((option) => option.value === item.product);
                    const selectedDescription = descriptionOptions.find((desc) => desc.value === item.pr_number) || {};
                    return {
                      ...item,
                      doc_reff_no: item.pr_number,
                      selectedProduct: selectedProductOption ? selectedProductOption.value : "",
                      coa: selectedProductOption ? selectedProductOption.product_account : "",
                      description: selectedDescription.description || "",
                    };
                  });

                  updatedItems.forEach((fetchedItem, i) => {
                    newItems[i] = {
                      ...newItems[i],
                      ...fetchedItem,
                    };
                  });

                  console.log("new", newItems);
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
                });
            })
            .catch((error) => {
              console.error("Failed to fetch data for Paid To:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to fetch data for Paid To:", error);
        });
    } else {
      // Reset fields when no option is selected
      const newItems = items.map((item) => ({
        ...item,
        product: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        original_unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
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
        coa: "",
        total_after_discount: 0,
      }));
      console.log("items new", newItems);
      setItems(newItems);
    }
  };

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
                      setType_Of_Pph_Option(options);

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
                          doc_reff_no: item.po_number,
                          selectedProduct: selectedProductOption ? selectedProductOption.value : "",
                          coa: selectedProductOption ? selectedProductOption.product_account : "",
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
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        original_unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
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
        coa: "",
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
                      setType_Of_Pph_Option(options);

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
                          coa: selectedProductOption ? selectedProductOption.product_account : "",
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
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        // original_unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
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
        coa: "",
        total_after_discount: 0,
      };
      setItems(newItems); // Update state with reset selections
    }
  };

  const handleProductChange = (index, selectedProduct) => {
    const newItems = [...items];
    const selectedProductOption = productOptions.find((option) => option.value === selectedProduct.value);

    newItems[index] = {
      ...newItems[index],
      product: selectedProduct.value,
      // expense_account: selectedProductOption?.expenseAccount || "",
      coa: selectedProductOption?.product_account || "", // Autofill product_account
    };

    setItems(newItems); // Update items state with new data
  };

  const handleOptionChange = (setter, stateSetter, selectedOption) => {
    setter(selectedOption);
    stateSetter(selectedOption ? selectedOption.value : "");
  };

  const handlePaymentSourceChange = (selectedOption) => {
    setSelectedPaymentSource(selectedOption);
    setPaymentSource(selectedOption ? selectedOption.value : "");
  };

  const handleEmployeeChange = (selectedOption) => {
    setSelectedEmployee(selectedOption);
    setEmployee(selectedOption ? selectedOption.value : "");
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setPaidTo(selectedOption ? selectedOption.value : "");
  };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
    setCurrency(selectedOption ? selectedOption.value : "");
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
    // Calculate total discount from all items
    const totalDiscount = items.reduce((total, item) => total + (item.discount || 0), 0);

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

    const subtotalAfterDiscount = subTotal - totalDiscount;

    // Initialize total_amount with default calculation
    let total_amount = subtotalAfterDiscount;

    // Check if any item has PPh
    const hasPPH = items.some((item) => item.type_of_pph && item.type_of_pph !== "none");

    if (!hasPPH) {
      // If no PPh, calculate as tax_base + ppnamount
      total_amount = subTotal + totalPPNAmount;
    } else {
      // Existing logic when PPh is applied
      const hasRoyalty = items.some((item) => item.type_of_vat === "ppn_royalty");
      const hasNonPPN = items.some((item) => item.type_of_vat === "non_ppn");

      if (hasRoyalty) {
        total_amount = subtotalAfterDiscount + totalPPNAmount;
      } else if (hasNonPPN) {
        total_amount = subtotalAfterDiscount - totalPPHAmount;
      } else {
        const case1 = items.some((item) => item.type_of_vat === "include" && item.type_of_pph === "gross");
        const case2 = items.some((item) => item.type_of_vat === "include" && item.type_of_pph === "nett");
        const case3 = items.some((item) => item.type_of_vat === "exclude" && item.type_of_pph === "gross");
        const case4 = items.some((item) => item.type_of_vat === "exclude" && item.type_of_pph === "nett");

        if (case1 || case3) {
          total_amount += totalPPNAmount - totalPPHAmount;
        }

        if (case2) {
          const taxBasePPNAF = Math.round(subTotal / (1 - totalPPHAmount / 100));
          total_amount = taxBasePPNAF + totalPPNAmount;
        }

        if (case4) {
          const taxBase = subTotal / (1 - totalPPHAmount / 100);
          total_amount = taxBase - totalPPNAmount + totalPPHAmount;
        }
      }
    }

    // Ensure valid total amount
    const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;

    return {
      subTotal,
      subtotalAfterDiscount,
      totalPPNAmount,
      totalPPHAmount,
      totalAmount: validTotalAmount,
    };
  };

  // hitungan buat ada pphnya dipake sesuai kebutuhan
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "amount_paid") {
      // Update item dengan amount_paid baru
      const numericValue = Number(value);
      newItems[index].amount_paid = numericValue;
      // newItems[index].amount_paid = value;

      // Hitung total_paid
      const newTotalPaid = newItems.reduce((total, item) => total + (item.amount_paid || 0), 0);
      setTotalPaid(newTotalPaid);
    }

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

    // Calculate New Unit Price based on VAT and PPN
    // Calculate New Unit Price based on VAT and PPN

    let pengkali = newItems[index].tax_ppn_rate / 100;

    // Calculate PPN and PPH

    // Calculate PPN and PPH
    if (field === "tax_ppn" || field === "tax_ppn_rate") {
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
        newItems[index].tax_base = Math.round(newItems[index].total_price / (1 + newItems[index].tax_ppn_rate / 100));
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100)); // Rounding up
        newItems[index].vat_included = true;
      } else if (newItems[index].type_of_vat === "exclude" || newItems[index].type_of_vat === "ppn_royalty") {
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].total_price * (newItems[index].tax_ppn_rate / 100)); // Rounding up
        newItems[index].tax_base = newItems[index].total_price;
      }
    }

    // Handle non_ppn case

    if (newItems[index].type_of_vat === "non_ppn") {
      // Reset PPN related fields
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_ppn_amount = 0; // No PPN for non_ppn
      newItems[index].new_unit_price = newItems[index].unit_price; // Set new unit price to the original unit price
      newItems[index].tax_base = newItems[index].total_price; // Tax base is the total price
      newItems[index].tax_pph_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100)); // Calculate PPH only
    }

    // Calculate PPh based on PPh type and rate

    if (field === "tax_pph_type" || field === "tax_pph_rate") {
      if (newItems[index].type_of_pph === "gross") {
        if (newItems[index].type_of_vat === "exclude") {
          newItems[index].tax_pph_amount = Math.floor(newItems[index].total_price * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
        } else {
          newItems[index].tax_pph_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
        }
      } else if (newItems[index].type_of_pph === "nett") {
        let taxWithPPh = newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100);
        newItems[index].tax_pph_amount = Math.floor(taxWithPPh * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
        newItems[index].tax_ppn_amount = Math.floor(taxWithPPh * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
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
      // Set new unit price to the original unit price

      newItems[index].new_unit_price = newItems[index].unit_price;
      newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    }

    // Update item state

    setItems(newItems);
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
    generateVoucherNumber("VOUC");
    setPaidTo("");
    setDocReff("");
    setVoucherNumber("");
    setStatus("DRAFT");
    setVoucherDate(new Date().toISOString().slice(0, 10)); // Reset ke tanggal hari ini
    setTotalAmount("");
    setSelectedEmployee(null);
    setSelectedDescription([]);
    setSelectedCoa(null);
    setSelectedCustomer(null);
    setDocReffNo("");
    setExchangeRate("");
    setAmountInIdr("");
    setProduct("");
    setTotalPaid("");
    setTaxPph("");
    setCustomer("");
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
    setDepartment("");
    setProject("");
    setAmountPaid("");
    setItems([]);
    setSelectedItems([]);
    setSelectedProduct([]);
    setDiscount(0); // Reset discount
    setTotalDebt(0); // Reset total debt
    setTotalPaid(0); // Reset total paid
    setIsSubmited(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // if (!tax_exchange_rate) {
    //   messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
    //   return;
    // }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Petty Cash?",
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
        // const pr_number = await generatePrNumber("PR");
        // console.log("pr_number", pr_number);

        // let endToEndId;
        // if (!endToEnd) {
        //   endToEndId = await generatePrNumber("PURC");
        // } else {
        //   endToEndId = endToEnd;
        //   console.log("endtoendId is not empty");
        // }

        const voucher_number = await generateVoucherNumber("DRAFT_VOUC");

        const checkDataResponse = await LookupService.fetchLookupData(`VOUC_FORMVCPETTY&filterBy=voucher_number&filterValue=${voucher_number}&operation=EQUAL`, authToken, branchId);
        const existingData = checkDataResponse.data;

        // const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount, total_amount_idr, total_before_discount_idr } = calculateTotalAmount();
        const total_amount = calculateTotalAmount();
        // Save general information
        const generalInfo = {
          // payment_source,
          paid_to,
          voucher_number,
          doc_reff,
          // doc_reff_no,
          status: "DRAFT",
          voucher_date,
          payment_source,
          //  total_amount,
          //  description,
          //  amount,
          total_debt,
          total_paid,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        let response;

        // Check if updating existing data or inserting new data
        if (selectedData) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `VCPETTY&column=id&value=${id}`, authToken, branchId);
        } else if (existingData && existingData.length > 0) {
          const id = existingData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `VCPETTY&column=id&value=${id}`, authToken, branchId);
        } else {
          response = await InsertDataService.postData(generalInfo, "VCPETTY", authToken, branchId);
        }

        console.log("Data posted successfully:", response);

        // // Update Status for PR or PO
        // if (idPr) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}, { status_request: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // } else if (idPo) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}, { status_po: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // }

        // Handle item deletion and insertion
        if (response.message === "Update Data Successfully") {
          if (existingData && existingData.length > 0) {
            const PettyNum = existingData[0].voucher_number;
            const lookupResponse = await LookupService.fetchLookupData(`VOUC_FORMVCPETTYD&filterBy=voucher_number&filterValue=${PettyNum}&operation=EQUAL`, authToken, branchId);

            const ids = lookupResponse.data.map((item) => item.ID); // Dapatkan semua ID dari respons array
            console.log("IDs to delete:", ids);

            // Delete each item based on fetched IDs
            for (const id of ids) {
              try {
                await DeleteDataService.postData(`column=id&value=${id}`, "VCPETTYD", authToken, branchId);
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
                  const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "VCPETTYD", authToken, branchId);
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
              voucher_number,
              coa: item.product_account,
              department: item.departement,
              type_of_vat: item.type_of_vat,
              tax_ppn: item.tax_ppn,
              tax_pph: item.tax_pph,
              type_of_pph: item.type_of_pph,
              tax_base: item.total_tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
            };
            delete updatedItem.vat;
            // delete updatedItem.tax_ppn_type;
            // delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.new_unit_price;
            delete updatedItem.total_price_idr;
            delete updatedItem.rwnum;
            delete updatedItem.invoice_number;
            delete updatedItem.id;
            delete updatedItem.ID;
            delete updatedItem.pr_number;
            delete updatedItem.product_note;
            delete updatedItem.amount;
            delete updatedItem.doc_source;
            delete updatedItem.company;
            delete updatedItem.departement;
            delete updatedItem.id_upload;
            delete updatedItem.po_number;
            delete updatedItem.selectedProduct;
            delete updatedItem.product_account;
            delete updatedItem.total_after_discount;
            delete updatedItem.requestor;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.total_paid;
            delete updatedItem.total_debt;
            delete updatedItem.vat_included;
            delete updatedItem.discount;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "VCPETTYD", authToken, branchId);
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
              voucher_number,
              coa: item.product_account,
              department: item.departement,
              type_of_vat: item.type_of_vat,
              tax_ppn: item.tax_ppn,
              tax_pph: item.tax_pph,
              type_of_pph: item.type_of_pph,
              tax_base: item.total_tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
            };
            delete updatedItem.vat;
            // delete updatedItem.tax_ppn_type;
            // delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.new_unit_price;
            delete updatedItem.total_price_idr;

            delete updatedItem.rwnum;
            delete updatedItem.invoice_number;
            delete updatedItem.id;
            delete updatedItem.ID;
            delete updatedItem.pr_number;
            delete updatedItem.product_note;
            delete updatedItem.amount;
            delete updatedItem.doc_source;
            delete updatedItem.company;
            delete updatedItem.departement;
            delete updatedItem.id_upload;
            delete updatedItem.po_number;
            delete updatedItem.selectedProduct;
            delete updatedItem.product_account;
            delete updatedItem.total_after_discount;
            delete updatedItem.requestor;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.total_paid;
            delete updatedItem.total_debt;
            delete updatedItem.vat_included;
            delete updatedItem.discount;

            const itemResponse = await InsertDataService.postData(updatedItem, "VCPETTYD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          //Set status workflow VERIFIED
          //   LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
          //     .then((response) => {
          //       const data = response.data[0];
          //       console.log("Data:", data);

          //       const requestData = {
          //         idTrx: data.ID,
          //         status: "DRAFT", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
          //       };
          //       UpdateStatusService.postData(requestData, "PUINVC", authToken, branchId)
          //         .then((response) => {
          //           console.log("Data updated successfully:", response);
          //         })
          //         .catch((error) => {
          //           console.error("Failed to update data:", error);
          //         });
          //     })
          //     .catch((error) => {
          //       console.error("Failed to load purchase request data:", error);
          //     });
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if (!tax_exchange_rate) {
    //   messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
    //   return;
    // }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the Petty Cash?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const voucher_number = await generateVoucherNumber("VOUC");

        const checkDataResponse = await LookupService.fetchLookupData(`VOUC_FORMVCPETTY&filterBy=voucher_number&filterValue=${voucher_number}&operation=EQUAL`, authToken, branchId);
        const existingData = checkDataResponse.data;

        // const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount, total_amount_idr, total_before_discount_idr } = calculateTotalAmount();
        const total_amount = calculateTotalAmount();
        // Save general information
        const generalInfo = {
          // payment_source,
          paid_to,
          voucher_number,
          doc_reff,
          // doc_reff_no,
          status: "IN_PROCESS",
          voucher_date,
          payment_source,
          //  total_amount,
          //  description,
          //  amount,
          total_debt,
          total_paid,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        let response;

        // Check if updating existing data or inserting new data
        if (selectedData) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `VCPETTY&column=id&value=${id}`, authToken, branchId);
        } else if (existingData && existingData.length > 0) {
          const id = existingData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `VCPETTY&column=id&value=${id}`, authToken, branchId);
        } else {
          response = await InsertDataService.postData(generalInfo, "VCPETTY", authToken, branchId);
        }

        console.log("Data posted successfully:", response);

        // // Update Status for PR or PO
        // if (idPr) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}, { status_request: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // } else if (idPo) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}, { status_po: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // }

        // Handle item deletion and insertion
        if (response.message === "Update Data Successfully") {
          if (existingData && existingData.length > 0) {
            const PettyNum = existingData[0].voucher_number;
            const lookupResponse = await LookupService.fetchLookupData(`VOUC_FORMVCPETTYD&filterBy=voucher_number&filterValue=${PettyNum}&operation=EQUAL`, authToken, branchId);

            const ids = lookupResponse.data.map((item) => item.ID); // Dapatkan semua ID dari respons array
            console.log("IDs to delete:", ids);

            // Delete each item based on fetched IDs
            for (const id of ids) {
              try {
                await DeleteDataService.postData(`column=id&value=${id}`, "VCPETTYD", authToken, branchId);
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
                  const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "VCPETTYD", authToken, branchId);
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
              voucher_number,
              coa: item.product_account,
              department: item.departement,
              type_of_vat: item.type_of_vat,
              tax_ppn: item.tax_ppn,
              tax_pph: item.tax_pph,
              type_of_pph: item.type_of_pph,
              tax_base: item.total_tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
            };
            delete updatedItem.vat;
            // delete updatedItem.tax_ppn_type;
            // delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.new_unit_price;
            delete updatedItem.total_price_idr;
            delete updatedItem.rwnum;
            delete updatedItem.invoice_number;
            delete updatedItem.id;
            delete updatedItem.ID;
            delete updatedItem.pr_number;
            delete updatedItem.product_note;
            delete updatedItem.amount;
            delete updatedItem.doc_source;
            delete updatedItem.company;
            delete updatedItem.departement;
            delete updatedItem.id_upload;
            delete updatedItem.po_number;
            delete updatedItem.selectedProduct;
            delete updatedItem.product_account;
            delete updatedItem.total_after_discount;
            delete updatedItem.requestor;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.total_paid;
            delete updatedItem.total_debt;
            delete updatedItem.vat_included;
            delete updatedItem.discount;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "VCPETTYD", authToken, branchId);
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
              voucher_number,
              coa: item.product_account,
              department: item.departement,
              type_of_vat: item.type_of_vat,
              tax_ppn: item.tax_ppn,
              tax_pph: item.tax_pph,
              type_of_pph: item.type_of_pph,
              tax_base: item.total_tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
            };
            delete updatedItem.vat;
            // delete updatedItem.tax_ppn_type;
            // delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.new_unit_price;
            delete updatedItem.total_price_idr;

            delete updatedItem.rwnum;
            delete updatedItem.invoice_number;
            delete updatedItem.id;
            delete updatedItem.ID;
            delete updatedItem.pr_number;
            delete updatedItem.product_note;
            delete updatedItem.amount;
            delete updatedItem.doc_source;
            delete updatedItem.company;
            delete updatedItem.departement;
            delete updatedItem.id_upload;
            delete updatedItem.po_number;
            delete updatedItem.selectedProduct;
            delete updatedItem.product_account;
            delete updatedItem.total_after_discount;
            delete updatedItem.requestor;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.total_paid;
            delete updatedItem.total_debt;
            delete updatedItem.vat_included;
            delete updatedItem.discount;

            const itemResponse = await InsertDataService.postData(updatedItem, "VCPETTYD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          //Set status workflow VERIFIED
          //   LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
          //     .then((response) => {
          //       const data = response.data[0];
          //       console.log("Data:", data);

          //       const requestData = {
          //         idTrx: data.ID,
          //         status: "DRAFT", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
          //       };
          //       UpdateStatusService.postData(requestData, "PUINVC", authToken, branchId)
          //         .then((response) => {
          //           console.log("Data updated successfully:", response);
          //         })
          //         .catch((error) => {
          //           console.error("Failed to update data:", error);
          //         });
          //     })
          //     .catch((error) => {
          //       console.error("Failed to load purchase request data:", error);
          //     });
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

  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>{selectedData ? "Edit Petty Cash" : "Add Petty Cash"}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">{selectedData ? "Edit Petty Cash" : "Add Petty Cash"}</li>
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
                  {setIsEditingPettyCash && (
                    <>
                      <Button
                        variant="secondary"
                        className="mr-2"
                        onClick={() => {
                          handleRefresh();
                          setIsEditingPettyCash(false);
                        }}
                      >
                        <i className="fas fa-arrow-left"></i> Go back
                      </Button>
                    </>
                  )}
                  {isSubmited === true ? (
                    <Button onClick={resetForm}>
                      <i className="fas fa-plus"></i> Add New
                    </Button>
                  ) : (
                    <>
                      <Button variant="primary" className="mr-2" onClick={handleSave}>
                        <i className="fas fa-save"></i> Save
                      </Button>
                      <Button variant="primary" onClick={handleSubmit}>
                        <i className="fas fa-check"></i> Submit
                      </Button>
                    </>
                  )}
                </div>
              </Card.Header>

              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="formPaymentSource">
                        <Form.Label>Payment Source</Form.Label>
                        <Select value={selectedPaymentSource} onChange={handlePaymentSourceChange} options={paymentSourceOptions} isClearable placeholder="Select..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formPaidTo">
                        <Form.Label>Paid To</Form.Label>
                        <Select value={selectedPaidTo} onChange={handlePaidToChange} options={allVendorOptions} isClearable placeholder="Select..." />
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
                      <Form.Group controlId="formCurrency">
                        <Form.Label>Currency</Form.Label>
                        <Select value={selectedCurrency || currencyOptions.find((option) => option.value === "IDR")} onChange={handleCurrencyChange} options={currencyOptions} isClearable placeholder="Select Currency..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formAmount">
                        <Form.Label>IDR Amount </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Your Amount"
                          value={
                            calculateTotalAmount().amount_idr !== null && calculateTotalAmount().amount_idr !== undefined
                              ? `IDR ${calculateTotalAmount().amount_idr.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                              : "IDR 0.00"
                          }
                          onChange={(e) => setAmountIDR(e.target.value)}
                          readOnly
                        />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                      <Form.Group controlId="formTotalPaid">
                        <Form.Label>Total Paid</Form.Label>
                        <Form.Control type="text" value={total_paid} onChange={(e) => setTotalPaid(e.target.value)} />
                      </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formTotalDebt">
                        <Form.Label>Total Debt</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="0"
                          value={new Intl.NumberFormat('id-ID', { 
                            style: 'currency', 
                            currency: 'IDR', 
                            currencyDisplay: 'code'
                          }).format(calculateTotalAmount().totalAmount)}
                          onChange={(e) => {
                          }}
                          readOnly
                        />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formTotalPaid">
                        <Form.Label>Total Paid</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Your Total Paid"
                          value={`IDR ${total_paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                          onChange={(e) => setTotalPaid(Number(e.target.value.replace(/[^0-9]/g, "")))}
                          readOnly
                        />
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
                              <th>Document Reference Number</th>
                              <th>Code/Account Name</th>
                              <th>Description</th>
                              <th>Product</th>
                              <th>Db/Cr</th>
                              {/* <th>Employee</th> */}
                              <th>Vendor</th>
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Department</th>
                              {/* <th>Currency</th> */}
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Total Price</th>
                              <th>Type of VAT</th>
                              <th>PPN</th>
                              <th>Tax Ppn Rate</th>
                              <th>Amount PPN</th>
                              <th>Type of PPh</th>
                              <th>PPh</th>
                              <th>Tax PPh Rate </th>
                              <th>Amount PPh</th>
                              <th>Tax Base</th>
                              <th>Total To Be Paid</th>
                              {/* <th>Expanse Voucher</th> */}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="25" className="text-center">
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
                                          styles={{
                                            control: (base) => ({
                                              ...base,
                                              border: "none",
                                              boxShadow: "none",
                                              backgroundColor: "transparent",
                                              outline: "none",
                                            }),
                                            menu: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
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
                                          styles={{
                                            control: (base) => ({
                                              ...base,
                                              border: "none",
                                              boxShadow: "none",
                                              backgroundColor: "transparent",
                                              outline: "none",
                                            }),
                                            menu: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
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
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={items[index].coa || ""} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} onChange={(e) => handleItemChange(index, "coa", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.description} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Group controlId="formProduct">
                                      <Select
                                        value={productOptions.find((option) => option.value === items[index]?.product)}
                                        onChange={(selectedProduct) => {
                                          handleProductChange(index, selectedProduct);
                                          if (selectedProduct) {
                                            handleItemChange(index, "coa", selectedProduct.product_account);
                                          } else {
                                            handleItemChange(index, "coa", "");
                                          }
                                        }}
                                        options={productOptions}
                                        placeholder="Select Product"
                                        styles={{
                                          control: (base) => ({
                                            ...base,
                                            border: "none",
                                            boxShadow: "none",
                                            backgroundColor: "transparent",
                                            outline: "none",
                                          }),
                                          menu: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                          }),
                                        }}
                                      />
                                    </Form.Group>{" "}
                                  </td>
                                  <td>
                                    <Form.Control as="select" value={item.db_cr || "Db"} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} onChange={(e) => handleItemChange(index, "db_cr", e.target.value)}>
                                      <option value="Db">Db</option>
                                      <option value="Cr">Cr</option>
                                    </Form.Control>
                                  </td>
                                  {/* <td>
                               <Select 
                                  value={employeeOptions.find(option => option.value === item.employee)}
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      border: 'none', 
                                      boxShadow: 'none', 
                                      backgroundColor: 'transparent', 
                                      outline: 'none', 
                                    }),
                                    menu: (base) => ({
                                      ...base,
                                      zIndex: 9999, 
                                    }),
                                  }}
                                  onChange={handleEmployeeChange}
                                  options={employeeOptions}
                                  isClearable
                                  placeholder="Select Employee..." 
                                />
                               </td> */}
                                  {doc_reff === "purchaseRequest" && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select
                                          value={vendorOptions.find((option) => option.value === item.vendor)}
                                          style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                          onChange={(selectedOption) => handleItemChange(index, "vendor", selectedOption ? selectedOption.value : null)}
                                          options={vendorOptions}
                                          isClearable
                                          placeholder="Select Vendor..."
                                        />
                                      </Form.Group>
                                    </td>
                                  )}
                                  {doc_reff === "purchaseOrder" && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select
                                          value={allVendorOptions.find((option) => option.value === item.vendor)}
                                          style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                          onChange={(selectedOption) => handleItemChange(index, "vendor", selectedOption ? selectedOption.value : null)}
                                          options={allVendorOptions}
                                          isClearable
                                          placeholder="Select Vendor..."
                                        />
                                      </Form.Group>
                                    </td>
                                  )}
                                  {!(doc_reff === "purchaseRequest" || doc_reff === "purchaseOrder") && (
                                    <td>
                                      <Form.Group controlId="formVendor">
                                        {/* <Form.Label>Vendor</Form.Label> */}
                                        <Select
                                          value={allVendorOptions.find((option) => option.value === item.vendor)}
                                          styles={{
                                            control: (base) => ({
                                              ...base,
                                              border: "none",
                                              boxShadow: "none",
                                              backgroundColor: "transparent",
                                              outline: "none",
                                            }),
                                            menu: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
                                          onChange={(selectedOption) => handleItemChange(index, "vendor", selectedOption.value)}
                                          options={allVendorOptions}
                                          isClearable
                                          placeholder="Select Vendor..."
                                        />
                                      </Form.Group>
                                    </td>
                                  )}
                                  {doc_reff === "purchaseRequest" ? (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        <Select
                                          value={projectOptions.find((option) => option.value === item.project)}
                                          styles={{
                                            control: (base) => ({
                                              ...base,
                                              border: "none",
                                              boxShadow: "none",
                                              backgroundColor: "transparent",
                                              outline: "none",
                                            }),
                                            menu: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
                                          onChange={(selectedOption) => handleItemChange(index, "project", selectedOption ? selectedOption.value : null)}
                                          options={projectOptions}
                                          isClearable
                                          placeholder="Select Project..."
                                        />
                                      </Form.Group>
                                    </td>
                                  ) : (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        {/* <Form.Label>Project</Form.Label> */}
                                        <Select
                                          value={projectOptions.find((option) => option.value === item.project)}
                                          styles={{
                                            control: (base) => ({
                                              ...base,
                                              border: "none",
                                              boxShadow: "none",
                                              backgroundColor: "transparent",
                                              outline: "none",
                                            }),
                                            menu: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
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
                                    <Form.Control
                                      type="text"
                                      value={item.project_contract_number}
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                      onChange={(e) => handleItemChange(index, "project_contract_number", e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    <Form.Group controlId="formCustomer">
                                      {/* <Form.Label>Customer</Form.Label> */}
                                      <Select
                                        id="customer"
                                        value={customerOptions.find((option) => option.value === item.customer)}
                                        styles={{
                                          control: (base) => ({
                                            ...base,
                                            border: "none",
                                            boxShadow: "none",
                                            backgroundColor: "transparent",
                                            outline: "none",
                                          }),
                                          menu: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                          }),
                                        }}
                                        onChange={(selectedOption) => handleItemChange(index, "customer", selectedOption ? selectedOption.value : null)}
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
                                    <Form.Control type="text" value={item.departement} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} onChange={(e) => handleItemChange(index, "departement", e.target.value)} />
                                  </td>
                                  {/* <td>
                                    <Select
                                      value={currencyOptions.find((option) => option.value === item.currency)} // Menemukan mata uang yang sesuai
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: 'none', 
                                          boxShadow: 'none', 
                                          backgroundColor: 'transparent', 
                                          outline: 'none', 
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 9999, 
                                        }),
                                      }}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "currency", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                                      }}
                                      options={currencyOptions} // Daftar opsi mata uang
                                      // isClearable
                                      placeholder="Select Currency"
                                      defaultValue={currencyOptions.find((option) => option.value === (item.currency || "USD"))} // Set default value to USD if item.currency is not set
                                    />
                                  </td> */}
                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.quantity}
                                      min="0"
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                      onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))}
                                    />
                                  </td>
                                  <td>
                                    {item.currency === "IDR" ? (
                                      <Form.Control
                                        className="text-left"
                                        type="text"
                                        value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString("en-US") : 0}
                                        style={{
                                          border: "none",
                                          boxShadow: "none",
                                          backgroundColor: "transparent",
                                          outline: "none",
                                          width: `${inputWidth}px`,
                                        }}
                                        onChange={(e) => {
                                          const newPrice = parseFloat(e.target.value.replace(/[^\d.-]/g, ""));
                                          handleItemChange(index, "unit_price", newPrice);

                                          // Update total price based on new unit price and quantity
                                          const quantity = item.quantity || 1; // Ganti dengan cara Anda mendapatkan kuantitas
                                          const newTotalPrice = newPrice * quantity;
                                          handleItemChange(index, "total_after_discount", newTotalPrice);

                                          dynamicFormWidth(e);
                                        }}
                                      />
                                    ) : (
                                      <Form.Control
                                        className="text-left"
                                        type="text"
                                        value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString("en-US") : "0"}
                                        style={{
                                          border: "none",
                                          boxShadow: "none",
                                          backgroundColor: "transparent",
                                          outline: "none",
                                          width: `${inputWidth}px`,
                                        }}
                                        onChange={(e) => {
                                          const input = e.target.value;
                                          const sanitizedInput = input.replace(/[^0-9.]/g, "");
                                          handleItemChange(index, "unit_price", sanitizedInput);

                                          // Update total price based on new unit price and quantity
                                          const quantity = item.quantity || 1; // Ganti dengan cara Anda mendapatkan kuantitas
                                          const newTotalPrice = parseFloat(sanitizedInput) * quantity;
                                          handleItemChange(index, "total_after_discount", newTotalPrice);
                                        }}
                                        onBlur={() => {
                                          const price = parseFloat(item.unit_price);
                                          handleItemChange(index, "unit_price", price);
                                        }}
                                      />
                                    )}
                                  </td>
                                  <td className={currency}>
                                    {item.total_after_discount != null && item.total_after_discount >= 0
                                      ? item.total_after_discount.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: currency && typeof currency === "string" && currency.length === 3 ? currency : "IDR",
                                          minimumFractionDigits: currency === "USD" ? 2 : 0, // Show .00 for USD, omit for IDR
                                          maximumFractionDigits: currency === "USD" ? 2 : 0, // Consistent precision
                                        })
                                      : currency === "USD"
                                      ? "$0.00"
                                      : "IDR 0"}
                                  </td>
                                  {/* <td>
                                    <Form.Control type="text" value={item.total_after_discount} onChange={(e) => handleItemChange(index, "amount", e.target.value)} />
                                  </td> */}
                                  <td>
                                    <Form.Control as="select" value={item.type_of_vat} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} onChange={(e) => handleItemChange(index, "type_of_vat", e.target.value)}>
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
                                        items[index].type_of_vat === "ppn_royalty" ? tax_ppn_royalty_option.find((option) => option.value === item.tax_ppn) : taxPpnTypeOption.find((option) => option.value === items[index].tax_ppn) || null
                                      }
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "none",
                                          boxShadow: "none",
                                          backgroundColor: "transparent",
                                          outline: "none",
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
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
                                    <Form.Control
                                      type="number"
                                      value={item.tax_ppn_rate}
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                      onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))}
                                      readOnly
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.tax_ppn_amount}
                                      readOnly
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                      onChange={(e) => handleItemChange(index, "tax_ppn_amount", parseFloat(e.target.value))}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control as="select" value={item.type_of_pph} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} onChange={(e) => handleItemChange(index, "type_of_pph", e.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="gross">Gross</option>
                                      <option value="nett">Nett</option>
                                    </Form.Control>
                                  </td>
                                  <td>
                                    <Select
                                      value={type_of_pph_option.find((option) => option.value === items[index].tax_pph) || null}
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "none",
                                          boxShadow: "none",
                                          backgroundColor: "transparent",
                                          outline: "none",
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
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
                                      options={type_of_pph_option}
                                      isClearable
                                      placeholder="Select Tax PPH Type..."
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.tax_pph_rate}
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                      onChange={(e) => handleItemChange(index, "tax_pph_rate", parseFloat(e.target.value))}
                                      readOnly
                                    />
                                  </td>
                                  {/* <td>
                                  <Form.Control type="text" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", e.target.value)} />
                                  </td> */}

                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.tax_pph_amount || "0"}
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                      onChange={(e) => handleItemChange(index, "tax_pph_amount", parseFloat(e.target.value))}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.amount_paid} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} onChange={(e) => handleItemChange(index, "amount_paid", e.target.value)} />
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
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <Button variant="success" size="sm" onClick={handleAddItem}>
                                  <i className="fas fa-plus"></i> New Item
                                </Button>
                              </div>
                            </div>
                          </tbody>
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
                    <tr className="text-right">
                      <td colSpan="16">Sub Total:</td>
                      <td className="text col-2">
                        <strong>
                          {calculateTotalAmount().subtotalAfterDiscount.toLocaleString("en-US", {
                            style: "currency",
                            currency: currency && typeof currency === "string" && currency.length === 3 ? currency : "IDR",
                            minimumFractionDigits: currency === "USD" ? 2 : 0,
                            maximumFractionDigits: currency === "USD" ? 2 : 0,
                          })}{" "}
                        </strong>
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td colSpan="16">Total PPN Amount:</td>
                      <td>
                        {/* <Form.Control
                                        type="number"
                                        value={calculateTotalAmount().totalPPNAmount.toLocaleString("en-US") || 0}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            const totalPPNAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                            newItems.forEach((item) => {
                                                item.tax_ppn_amount = totalPPNAmount / newItems.length;
                                            });
                                            setItems(newItems);
                                        }}
                                        style={{
                                            textAlign: "right",
                                            // marginLeft: "auto",
                                            // display: "flex",
                                          
                                        }}
                                    /> */}
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
                          {calculateTotalAmount().totalAmount.toLocaleString("en-US", {
                            style: "currency",
                            currency: currency && typeof currency === "string" && currency.length === 3 ? currency : "IDR",
                            minimumFractionDigits: currency === "USD" ? 2 : 0,
                            maximumFractionDigits: currency === "USD" ? 2 : 0,
                          })}{" "}
                        </strong>
                      </td>
                    </tr>

                    {/* <tr className="text-right">
                              <td colSpan="25">Total Debt:</td>
                              <td style={{ position: "sticky", right: 0, backgroundColor: "white", textAlign: "right", boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)" }}>
                                <strong>{calculateTotalAmount().totalAmount.toLocaleString("en-US", { style: "currency", currency: "IDR" })} </strong>
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="25">Total Paid:</td>
                              <td style={{ position: "sticky", right: 0, backgroundColor: "white", textAlign: "right", boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)" }}>
                                <strong>{calculateTotalAmount().totalAmount.toLocaleString("en-US", { style: "currency", currency: "IDR" })} </strong>
                              </td>
                            </tr> */}
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
                  <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
            {setIsEditingPettyCash ? (
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => {
                  handleRefresh();
                  setIsAddingNewPettyCash(false);
                }}
              >
                <i className="fas fa-arrow-left"></i> Back
              </Button>
            ) : (
              <></>
            )}
            {isSubmited === true ? (
              <Button onClick={resetForm}>
                <i className="fas fa-plus"></i> Add New
              </Button>
            ) : (
              <>
                <Button variant="primary" className="mr-2" onClick={handleSave}>
                  <i className="fas fa-save"></i> Save
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  <i className="fas fa-check"></i> Submit
                </Button>
              </>
            )}
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
