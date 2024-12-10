import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Card, CardBody, CardHeader, FormControl, CardFooter } from "react-bootstrap";
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

const AddSalesOrder = ({ setIsAddingNewSalesOrder, setIsEditingSalesOrder, handleRefresh, index, item, selectedData }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem("userId");

  // Function to format the date
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const [so_number, setSoNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [to_address, setToAddress] = useState("");
  const [project, setProject] = useState("");
  const [status_so, setStatus] = useState("DRAFT");
  const [order_date, setOrderDate] = useState("");
  const [project_period_startdate, setStartPeriod] = useState("");
  const [project_period_enddate, setEndPeriod] = useState("");
  const [currency, setCurrency] = useState("");
  const [loi_so_spk_contract, setContract] = useState("");
  const [payment_term, setPaymentTerm] = useState("");
  const [negotiation_rate, setNegotiationRate] = useState("");
  const [sales_person, setSalesPerson] = useState("");
  const [manager_person, setManagerPerson] = useState("");
  const [sub_total, setSubTotal] = useState("");
  const [total_ppn_amount, setPpnAmount] = useState("");
  const [total_paid, setTotalPaid] = useState("");
  const [created_by, setCreatedBy] = useState("");
  const [approved_by, setApprovedBy] = useState("");
  const [total_amount_ppn, setTotalPpnAmount] = useState("");
  const [description, setDescription] = useState("");
  const [tax_base, setTaxBase] = useState("");

  const [product, setProduct] = useState("");
  const [tax_ppn, setPPN] = useState("");
  const [tax_ppn_amount, setTotalAmountPpn] = useState("");
  const [tax_pph_amount, setTotalAmountPph] = useState("");
  const [type_of_vat, setTypeOfVat] = useState("");
  const [period_start, setPeriodStart] = useState("");
  const [period_end, setPeriodEnd] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit_price, setUnitPrice] = useState("");
  const [total_price, setTotalPrice] = useState("");
  const [product_note, setProductNote] = useState("");
  const { doc_reff, setDocReff } = useState("");
  const { doc_reff_no, setDocReffNo } = useState("");
  const { ba_date, setBaDate } = useState("");

  const [pph1, setPph1] = useState("");
  const [totalAmountPph1, setTotalAmountPph1] = useState("");
  const [pph2, setPph2] = useState("");
  const [totalAmountPph2, setTotalAmountPph2] = useState("");
  const [totalAmountPaid, setTotalAmountPaid] = useState("");
  const [department, setDepartment] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [totalAmountDpp, setTotalAmountDpp] = useState("");
  const [taxAmount, setTaxAmount] = useState("");

  const [code_account_name_options, setCodeAccountNameOptions] = useState([]);
  const [dr_cr_options, setDrCrOptions] = useState([]);
  const [typeOfVat_options, setTypeOfVatOptions] = useState([]);
  const [pph1_options, setPph1Options] = useState([]);
  const [pph2_options, setPph2Options] = useState([]);
  const [department_options, setDepartmentOptions] = useState([]);

  const [items, setItems] = useState([]);

  const [projectOptions, setProjectOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [ManagerPersonOptions, setManagerPersonOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [PpnOptions, setPpnOption] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [SalesPersonOptions, setSalesPersonOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedJenisPPN, setSelectedjenisPPN] = useState([]);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState([]);
  const [selectedManagerPerson, setSelectedManagerPerson] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPpn, setSelectedPpn] = useState([]);
  const [taxPphTypeOption, setTaxPphTypeOption] = useState([]);
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [taxPpnRoyaltyOption, setTaxPpnRoyaltyOption] = useState([]);
  const [tax_ppn_rate, setTaxPpnRate] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [tax_pph_type_option, setTax_Pph_Type_Option] = useState([]);
  const [allVendorOptions, setAllVendorOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedTaxType, setSelectedTaxType] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const authToken = headers;

  useEffect(() => {
    if (selectedData) {
      const { ID, SO_NUMBER } = selectedData[0];
      console.log("id and SO Number", ID, SO_NUMBER);
      setSoNumber(SO_NUMBER);

      LookupService.fetchLookupData(`SALE_FORMSAOR&filterBy=SO_NUMBER&filterValue=${SO_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const data = response.data[0];
          if (data) {
            setCustomer(data.customer);
            setSoNumber(data.so_number);
            setToAddress(data.to_address);
            setOrderDate(data.order_date);
            setProject(data.project);
            setStatus(data.status_so);
            setStartPeriod(data.project_period_startdate);
            setEndPeriod(data.project_period_enddate);
            setCurrency(data.currency);
            setContract(data.loi_so_spk_contract);
            setNegotiationRate(data.negotiation_rate);
            setPaymentTerm(data.payment_term);
            setSalesPerson(data.sales_person);
            setManagerPerson(data.manager_person);

            setProject(data.project);
            setDescription(data.description);
          } else {
            console.log("No data found");
          }
        })
        .catch((error) => {
          console.error("Failed to load purchase request data:", error);
        });

      // Fetch items based on SO_NUMBER and set them to state
      LookupService.fetchLookupData(`SALE_FORMSAORD&filterBy=so_number&filterValue=${SO_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          setItems(fetchedItems);

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

          const optionsPpn = transformedData
            .filter((item) => item.TAX_TYPE === "PPN")
            .map((item) => ({
              value: item.NAME,
              label: item.NAME,
              RATE: item.RATE,
            }));
          setTaxPpnTypeOption(optionsPpn);
          const selectedPPNOption = options.find((option) => option.value === selectedData[0].TAX_PPN);
          setSelectedTaxType(selectedPPNOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
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
    const generateInitialSoNumber = async () => {
      const generatedSoNumber = await generateSoNumber("DRAFT_SO"); // Adjust the code as needed

      setSoNumber(generatedSoNumber);
    };
    generateInitialSoNumber();
  }, []); // Empty dependency array means this runs once on mount

  function formatIDR(value) {
    if (isNaN(value)) return "Rp0"; // Jika nilai bukan angka, tampilkan default
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Tanpa desimal
    }).format(value);
  }

  const generateSoNumber = async (code) => {
    try {
      const uniqueSoNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
      setSoNumber(uniqueSoNumber); // Updates state, if needed elsewhere in your component
      return uniqueSoNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate Voucher Number:", error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const formatNumber = (number) => {
    if (isNaN(number) || number === null) return "0";
    return number.toLocaleString("en-US"); // Formats as 50,000
  };

  useEffect(() => {
    LookupParamService.fetchLookupDataView("MSDT_FORMTAX", authToken, branchId)
      .then((data) => {
        console.log("TAX:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const optionsPPH = transformedData
          .filter((item) => item.TAX_TYPE === "PPh")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTaxPphTypeOption(optionsPPH);

        const optionsPpn = transformedData
          .filter((item) => item.TAX_TYPE === "PPN")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTaxPpnTypeOption(optionsPpn);
        console.log("ppnop", optionsPpn);

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
        console.error("Failed to fetch  lookup:", error);
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

        const optionsCustomer = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
          to_address: item.ADDRESS,
        }));

        setCustomerOptions(optionsCustomer);
      })
      .catch((error) => {
        console.error("Failed to fetch customer lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMPYTM", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const paymentTermOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        setPaymentTermOptions(paymentTermOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch Payment Term lookup:", error);
      });

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

        const SalesPersonOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        setSalesPersonOptions(SalesPersonOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch Sales Person lookup:", error);
      });

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

        const ManagerPersonOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        setManagerPersonOptions(ManagerPersonOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch Manager Person lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
      .then((data) => {
        console.log("product lookup data:", data);
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const ManagerPersonOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        setProductOptions(productOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch PPN lookup:", error);
      });

    const fetchLookupData = async () => {
      try {
        const responses = await Promise.all([
          LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMPYTM", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId),
        ]);

        const transformedData = responses.map((response) =>
          response.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          )
        );

        setCurrencyOptions(transformedData[0].map((item) => ({ value: item.CODE, label: item.CODE })));
        setDepartementOptions(transformedData[1].map((item) => ({ value: item.NAME, label: item.NAME })));
        setProjectOptions(transformedData[2].map((item) => ({ value: item.NAME, label: item.NAME, project_contract_number: item.CONTRACT_NUMBER })));
        setProductOptions(transformedData[3].map((item) => ({ value: item.NAME, label: item.NAME })));
        setPaymentTermOptions(transformedData[4].map((item) => ({ value: item.NAME, label: item.NAME })));
        setSalesPersonOptions(transformedData[6].map((item) => ({ value: item.NAME, label: item.NAME })));
        setManagerPersonOptions(transformedData[6].map((item) => ({ value: item.NAME, label: item.NAME })));
      } catch (error) {
        console.error("Failed to fetch lookup data:", error);
      }
    };

    fetchLookupData();
  }, []);

  // const handleDeppartementChange = (selectedOption) => {
  //   setSelectedDepartement(selectedOption);
  //   setDepartment(selectedOption ? selectedOption.value : "");
  // };

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");
  };

  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
    setCustomer(selectedOption ? selectedOption.value : "");
    if (selectedOption) {
      setToAddress(selectedOption.to_address); // Assuming selectedOption contains an address field
    } else {
      setToAddress(""); // Clear address if no customer is selected
    }
  };

  const handleSoNumberChange = (selectedOption) => {
    setSoNumber(selectedOption ? selectedOption.value : "");
  };

  const handleToAddressChange = (selectedOption) => {
    setToAddress(selectedOption ? selectedOption.value : "");
  };

  const handlePaymentTermChange = (selectedOption) => {
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");
  };

  const handleNegotiationRateChange = (selectedOption) => {
    setNegotiationRate(selectedOption || "");
  };

  const handlePpnAmountChange = (e) => {
    // Remove any non-numeric characters (except the decimal point)
    const value = e.target.value.replace(/[^\d.-]/g, "");

    // Convert to number and update state
    setTotalPpnAmount(parseFloat(value) || 0);
  };

  const handleProjectStartChange = (selectedOption) => {
    setStartPeriod(selectedOption || "");
  };

  const handleProjectEndChange = (selectedOption) => {
    setEndPeriod(selectedOption || "");
  };

  const handleContractChange = (selectedOption) => {
    setContract(selectedOption || "");
  };

  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption ? selectedOption.value : "");
  };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
    setCurrency(selectedOption ? selectedOption.value : "");
  };

  const handleSalesPersonChange = (selectedOption) => {
    setSelectedSalesPerson(selectedOption);
    setSalesPerson(selectedOption ? selectedOption.value : "");
  };

  const handleCreatedByChange = (selectedOption) => {
    setSelectedSalesPerson(selectedOption);
    setCreatedBy(selectedOption ? selectedOption.value : "");
  };

  const handleManagerPersonChange = (selectedOption) => {
    setSelectedManagerPerson(selectedOption);
    setManagerPerson(selectedOption ? selectedOption.value : "");
  };

  const handleProductChange = (index, selectedOption) => {
    const updatedItems = [...items]; // Create a copy of the items array
    updatedItems[index].product = selectedOption ? selectedOption.value : ""; // Update the specific item's product
    setItems(updatedItems); // Set the updated items array in the state
  };

  // const handlePpnChange = (selectedOption) => {
  //   setSelectedPpn(selectedOption);
  //   setPPN(selectedOption ? selectedOption.value : "");
  // };

  const handleAddItem = () => {
    // Reset product states for the new item
    setSelectedProduct(null); // Reset selected product
    setProduct(""); // Reset product input

    // Add new empty item to the items array
    setItems((prevItems) => [
      ...prevItems,
      {
        product: "",
        product_note: "",
        invoice_number: 0,
        doc_reff_no: "",
        period_start: "",
        period_end: "",
        quantity: 0,
        unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn_rate: 0,
        tax_ppn: "",
        tax_ppn_amount: 0,
        tax_base: 0,
      },
    ]);
  };
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
      newItems[index].tax_ppn_rate = 0;
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

    // Extract required values
    const { total_price, tax_ppn_rate, type_of_vat } = newItems[index];

    // Fungsi untuk menghitung total PPN dari seluruh item
    const calculateTotalPPNAmount = (items) => {
      return items.reduce((total, item) => {
        return total + (item.tax_ppn_amount || 0);
      }, 0);
    };

    // Pastikan PPN rate dalam format desimal
    let pengkali = tax_ppn_rate / 100; // Mengkonversi persentase ke format desimal

    // Handle calculation based on type of VAT
    if (type_of_vat === "Include") {
      // Untuk 'Include' VAT, hitung PPN amount dan Tax Base
      const tax_ppn_amount = total_price * pengkali; // PPN Amount = Total Price * Rate
      const tax_base = total_price - tax_ppn_amount; // Tax Base = Total Price - PPN Amount

      // Menyimpan nilai yang dihitung
      newItems[index].tax_ppn_amount = tax_ppn_amount;
      newItems[index].tax_base = tax_base;
    } else if (type_of_vat === "Exclude") {
      // Untuk 'Exclude' VAT, hitung PPN amount dan Tax Base
      const tax_ppn_amount = total_price * pengkali; // PPN Amount = Total Price * Rate
      newItems[index].tax_ppn_amount = tax_ppn_amount;
      newItems[index].tax_base = total_price; // Tax Base adalah total price
    } else if (type_of_vat === "Non PPN") {
      // Untuk 'Non PPN', tidak ada PPN yang diterapkan
      newItems[index].tax_ppn_amount = 0; // PPN Amount adalah 0
      newItems[index].tax_base = total_price; // Tax Base adalah total price
    } else {
      // Handle unexpected VAT types
      console.error("Unexpected VAT type:", type_of_vat);
    }

    // Perhitungan New Unit Price berdasarkan VAT dan PPN:
    if (field === "tax_ppn" || field === "tax_ppn_rate") {
      if (newItems[index].type_of_vat === "Include") {
        // Jika VAT sudah termasuk, harga unit baru harus mempertimbangkan PPN
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;

        // Recalculating the tax base by removing VAT from the total price
        newItems[index].tax_base = total_price - newItems[index].tax_ppn_amount;
      } else if (newItems[index].type_of_vat === "Exclude" || newItems[index].type_of_vat === "ppn_royalty") {
        // Jika VAT dikecualikan, hitung jumlah PPN berdasarkan harga total
        newItems[index].tax_ppn_amount = total_price * (newItems[index].tax_ppn_rate / 100);

        // Tax base adalah total price dalam hal ini
        newItems[index].tax_base = total_price;
      }
    }

    // Menghitung total PPN dari seluruh item
    const totalPPN = calculateTotalPPNAmount(newItems); // Menghitung total PPN dari newItems
    setTotalPpnAmount(totalPPN); // Menyimpan hasil total PPN

    // Update VAT type logic
    if (field === "type_of_vat") {
      // Reset VAT-related fields
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;

      // Retain total_price_idr for non-IDR currencies
      //   if (newItems[index].currency !== "IDR") {
      //     const previousTotalPriceIdr = newItems[index].total_price_idr;
      //     if (newItems[index].type_of_vat === "exclude" && newItems[index].vat_included === true) {
      //       newItems[index].new_unit_price = newItems[index].new_unit_price - newItems[index].unit_price * pengkali;
      //       newItems[index].vat_included = false;
      //     } else if (newItems[index].type_of_vat === "non_ppn") {
      //       newItems[index].tax_base = previousTotalPriceIdr;
      //     } else {
      //       newItems[index].new_unit_price = newItems[index].unit_price;
      //     }
      //     newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
      //     newItems[index].total_price_idr = previousTotalPriceIdr; // Keep the previous value
      //   } else {
      //     newItems[index].new_unit_price = newItems[index].unit_price;
      //     newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
      //     newItems[index].total_price_idr = newItems[index].unit_price * newItems[index].quantity;
      //   }
    }
    // console.log('rate', newItems[index].tax_ppn_rate);
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

  const calculateTotalAmount = () => {
    // Ensure items is an array
    if (!Array.isArray(items)) return { totalAmount: 0, totalPPNAmount: 0, totalPPHAmount: 0, subTotal: 0, totalPaid: 0 };

    // Calculate total values
    const totalAmount = items.reduce((total, item) => total + (item.total_price || 0), 0);
    const totalPPNAmount = items.reduce((total, item) => total + (item.tax_ppn_amount || 0), 0);
    const totalPPHAmount = items.reduce((total, item) => total + (item.tax_pph_amount || 0), 0);

    // Calculate Sub Total (Handling NaN values for tax_base)
    const sub_total = items.reduce((total, item) => {
      const taxBase = isNaN(item.tax_base) || item.tax_base == null ? 0 : item.tax_base;
      return total + taxBase;
    }, 0);

    // Calculate totalPaid by adding subTotal and totalPPNAmount
    const totalPaid = sub_total + totalPPNAmount;

    return { totalAmount, totalPPNAmount, totalPPHAmount, sub_total, totalPaid };
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const resetForm = () => {
    setCustomer("");
    setToAddress("");
    // setPaymentTerm("");
    setSoNumber("");
    setOrderDate("");
    setStatus("");
    setCurrency("");
    setNegotiationRate("");
    setPaymentTerm("");
    setSalesPerson("");
    setManagerPerson("");
    // setDocSourceType("");
    // setDocSourceNumber("");
    // setVoucherStatus("");
    // setVoucherDate("");
    // setTotalAmount("");
    // setCodeAccountName("");
    setDescription("");
    // setInvoiceNumber("");
    // setAmount("");
    // setDrCr("");
    // setTypeOfVat("");
    // setPPN("");
    // setTotalAmountPpn("");
    // setPph1("");
    // setTotalAmountPph1("");
    // setPph2("");
    // setTotalAmountPph2("");
    // setTotalAmountPaid("");
    setProject("");
    setDepartment("");
    setTaxCode("");
    setTotalAmountDpp("");
    setTaxAmount("");
    setItems([]);
    setIsSubmited(false);
    setSelectedItems([]);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus("in process");

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Sales Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit It!",
      cancelButtonText: "No, Cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const generalInfo = {
          customer,
          so_number,
          to_address,
          project,
          status_so,
          order_date,
          project_period_startdate,
          project_period_enddate,
          currency,
          loi_so_spk_contract,
          payment_term,
          negotiation_rate,
          sales_person,
          manager_person,
          description,
          total_amount_ppn,

          doc_reff: "awa",
          doc_reff_no,
        };

        console.log("Master", generalInfo);
        console.log("items", items);

        const response = await InsertDataService.postData(generalInfo, "SAOR", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              so_number,
              product,
              // description,
              // period_start,
              // period_end,
              // quantity,
              // unit_price,
              // total_price,
              // type_of_vat,
              // tax_ppn,
              // tax_ppn_amount,
            };
            delete updatedItem.description;
            delete updatedItem.new_unit_price;

            const itemResponse = await InsertDataService.postData(updatedItem, "SAORD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
        // delete updatedItem.customer;
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the Sales Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit It!",
      cancelButtonText: "No, Cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const generalInfo = {
          customer,
          so_number,
          to_address,
          project,
          status_so,
          order_date,
          project_period_startdate,
          project_period_enddate,
          currency,
          loi_so_spk_contract,
          payment_term,
          negotiation_rate,
          sales_person,
          manager_person,
          description,
          total_ppn_amount,
          sub_total,
          total_paid,

          doc_reff: "awa",
          doc_reff_no,
        };

        console.log("Master", generalInfo);

        const response = await InsertDataService.postData(generalInfo, "SAOR", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              //  customer,
              so_number,
              product: item.product || "Default Product",

              // to_address,
              // project,
              // status_so,
              // // order_date,
              // period_start,
              // period_end,
              // currency,
              // loi_so_spk_contract,
              // payment_term,
              // negotiation_rate,
              // sales_person,
              // manager_person,
              // description,
              // tax_base,
              // tax_ppn,
              // doc_reff: 'awa',
              // doc_reff_no,
            };
            // delete updatedItem.tax_base;
            delete updatedItem.tax_pph_amount;
            delete updatedItem.tax_pph;
            delete updatedItem.type_of_pph;
            delete updatedItem.tax_pph_rate;
            delete updatedItem.total_price_idr;
            delete updatedItem.new_unit_price;

            const itemResponse = await InsertDataService.postData(updatedItem, "SAORD", authToken, branchId);
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
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>{selectedData ? "Edit Sales Order" : "Add Sales Order"}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">{selectedData ? "Edit Sales Order" : "Add Sales Order"}</li>
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
                  {setIsEditingSalesOrder && (
                    <Button
                      variant="secondary"
                      className="mr-2"
                      onClick={() => {
                        handleRefresh();
                        setIsEditingSalesOrder(false);
                      }}
                    >
                      <i className="fas fa-arrow-left"></i> Go Back1
                    </Button>
                  )}
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
                    <Col md={6}>
                      <Form.Group controlId="customer">
                        <Form.Label>Customer</Form.Label>
                        <Select id="customer" options={customerOptions} isClearable placeholder="Select..." value={selectedCustomer} onChange={handleCustomerChange} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="soNumber">
                        <Form.Label>SO Number</Form.Label>
                        <Form.Control type="text" value={so_number} readOnly placeholder="Nomor SO" />
                      </Form.Group>
                      {/* Add other form fields here */}
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="to_address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter the Address" value={to_address} onChange={handleToAddressChange} readOnly required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Order Date</Form.Label>
                        <Form.Control type="date" value={order_date} onChange={(e) => setOrderDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Project</Form.Label>
                        <Select id="project" options={projectOptions} isClearable value={selectedProject} onChange={handleProjectChange} placeholder="Select..." required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control type="text" value={status_so} readOnly placeholder="NEW" onChange={handleStatusChange} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Project Period</Form.Label>
                        <div className="d-flex">
                          <Form.Control type="date" value={project_period_startdate} onChange={(e) => handleProjectStartChange(e.target.value)} required />
                          <div className="d-flex justify-content-center items-center mx-2">-</div>
                          <Form.Control type="date" value={project_period_enddate} onChange={(e) => handleProjectEndChange(e.target.value)} required />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Currency</Form.Label>
                        <Select id="Select the currency" options={currencyOptions} isClearable placeholder="Select..." value={selectedCurrency} onChange={handleCurrencyChange} required />
                      </Form.Group>
                      <Form.Group controlId="">
                        <Form.Label>LOI/PO/SPK/Contract</Form.Label>
                        <Form.Control type="text" isClearable placeholder=" " value={loi_so_spk_contract} onChange={(e) => handleContractChange(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="negotiationRate">
                        <Form.Label>Negotiation Rate</Form.Label>
                        <Form.Control type="number" value={negotiation_rate} onChange={(e) => handleNegotiationRateChange(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Payment Term</Form.Label>
                        <Select id="paymentTerm" options={paymentTermOptions} value={selectedPaymentTerm} isClearable placeholder="Select..." onChange={handlePaymentTermChange} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="salesPerson">
                        <Form.Label>Sales Person</Form.Label>
                        <Select
                          id="salesPerson"
                          options={SalesPersonOptions}
                          value={selectedSalesPerson}
                          isClearable
                          placeholder="Select..."
                          onChange={handleSalesPersonChange} // Handle selection
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="managerPerson">
                        <Form.Label>Manager Person</Form.Label>
                        <Select id="managerPerson" options={ManagerPersonOptions} isClearable placeholder="Select..." onChange={handleManagerPersonChange} value={selectedManagerPerson} required />
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
                  <Card.Title>Detail Item</Card.Title>
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
                              <th>Product</th>
                              <th>Product Note</th>
                              <th>BA Date</th>
                              <th>BA Number</th>
                              <th>Start Period</th>
                              <th>End Period</th>
                              <th>Quantity</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Unit Price</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Total Price</th>
                              <th>Type of VAT</th>
                              <th>PPN</th>
                              <th>PPN Rate</th>
                              <th>PPN Amount</th>
                              <th>DPP Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="17" className="text-center">
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
                                    <Form.Group controlId={`product-${index}`} key={index}>
                                      <Select
                                        id={`product-${index}`}
                                        options={productOptions}
                                        isClearable
                                        placeholder="Select..."
                                        value={items[index].product ? { value: items[index].product, label: items[index].product } : null} // Set the value of each Select based on the item's product
                                        onChange={(selectedOption) => handleProductChange(index, selectedOption)} // Pass the index to handle the change
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
                                        required
                                      />
                                    </Form.Group>
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      value={item.product_note}
                                      placeholder="Enter a product note"
                                      onChange={(e) => handleItemChange(index, "product_note", e.target.value)}
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="date" value={item.ba_date} onChange={(e) => handleItemChange(index, "ba_date", e.target.value)} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.doc_reff_no}
                                      placeholder="Enter a BA Number"
                                      onChange={(e) => handleItemChange(index, "doc_reff_no", e.target.value)}
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="date"
                                      value={item.period_start}
                                      onChange={(e) => handleItemChange(index, "period_start", e.target.value)}
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="date" value={item.period_end} onChange={(e) => handleItemChange(index, "period_end", e.target.value)} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      value={item.unit_price !== null && item.unit_price !== undefined ? formatNumber(item.unit_price) : "0"}
                                      onChange={(e) => {
                                        const numericValue = parseFloat(e.target.value.replace(/,/g, ""));
                                        handleItemChange(index, "unit_price", isNaN(numericValue) ? 0 : numericValue);
                                      }}
                                      style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                    />
                                  </td>
                                  <td className={currency}>
                                    {item.total_price != null && item.total_price >= 0
                                      ? item.total_price.toLocaleString("en-US", {
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
                                  <Form.Control type="text" value={item.total_price !== null && item.unit_price !== undefined ? formatNumber(item.total_price) : "0"} readOnlyonChange={(e) => {const numericValue = parseFloat(e.target.value.replace(/,/g, "")); handleItemChange(index, "total_price", isNaN(numericValue) ? 0 : numericValue);}} style={{ border: "none", boxShadow: "none",backgroundColor: "transparent",}}/>
                                  </td> */}
                                  <td>
                                    <Form.Group controlId="type_of_vat">
                                      <Form.Select
                                        value={item.type_of_vat}
                                        onChange={(e) => handleItemChange(index, "type_of_vat", e.target.value)}
                                        aria-label="Select PPN"
                                        style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }}
                                      >
                                        <option value="Select Type of VAT">Select Type of VAT</option>
                                        <option value="Include">INCLUDE</option>
                                        <option value="Exclude">EXCLUDE</option>
                                        <option value="Non PPN">NON PPN</option>
                                      </Form.Select>
                                    </Form.Group>
                                  </td>
                                  <td>
                                    <Select
                                      value={taxPpnTypeOption.find((option) => option.value === items[index].tax_ppn) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn for the specific item
                                        handleItemChange(index, "tax_ppn", selectedOption ? selectedOption.value : "");

                                        // Update the PpnRate for the specific item
                                        handleItemChange(index, "tax_ppn_rate", selectedOption?.RATE ? parseFloat(selectedOption.RATE) : 0);

                                        // Optionally reset RATE if no selection is made
                                        setTaxPpnRate(selectedOption?.RATE || null);
                                      }}
                                      options={taxPpnTypeOption}
                                      isClearable
                                      placeholder={items[index].type_of_vat === "Non PPN" ? "-" : "Select Tax PPN Type..."}
                                      isDisabled={items[index].type_of_vat === "Non PPN"} // Disable for "non_ppn"
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          border: "none",
                                          boxShadow: "none",
                                          backgroundColor: "transparent",
                                          outline: "none",
                                          cursor: state.isDisabled ? "not-allowed" : "default",
                                          // Hide the dropdown arrow when disabled
                                          ...(state.isDisabled && {
                                            backgroundImage: "none",
                                          }),
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 9999, // Ensure dropdown is on top
                                        }),
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <FormControl type="number" value={item.tax_ppn_rate} readOnly style={{ border: "none", boxShadow: "none", backgroundColor: "transparent" }} />
                                  </td>
                                  <td className={currency}>
                                    {item.tax_ppn_amount != null && item.tax_ppn_amount >= 0
                                      ? item.tax_ppn_amount.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: currency && typeof currency === "string" && currency.length === 3 ? currency : "IDR",
                                          minimumFractionDigits: currency === "USD" ? 2 : 0, // Show .00 for USD, omit for IDR
                                          maximumFractionDigits: currency === "USD" ? 2 : 0, // Consistent precision
                                        })
                                      : currency === "USD"
                                      ? "$0.00"
                                      : "IDR 0"}
                                  </td>
                                  <td className={currency}>
                                    {item.tax_base != null && item.tax_base >= 0
                                      ? item.tax_base.toLocaleString("en-US", {
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
                          <tfoot></tfoot>
                        </table>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Card.Body>
              <CardFooter>
                <table className="table table-bordered">
                  <tbody>
                    <tr className="text-right">
                      <td colSpan="16">Sub Total:</td>
                      <td className="text col-4">
                        <strong>
                          {calculateTotalAmount().sub_total.toLocaleString("en-US", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </strong>
                      </td>
                    </tr>

                    <tr className="text-right">
                      <td colSpan="16">Total PPN:</td>
                      <td>
                        <Form.Control
                          type="text" // Tetap "text" agar nilai format string dapat tampil
                          value={total_amount_ppn ? formatIDR(total_amount_ppn) : "Rp0"}
                          readOnly
                          style={{
                            textAlign: "right",
                            width: "100%",
                            border: "none",
                          }}
                        />
                      </td>
                    </tr>

                    <tr className="text-right">
                      <td colSpan="16">Total Paid:</td>
                      <td className="text col-2">
                        <strong>
                          {(calculateTotalAmount().totalPaid ?? 0).toLocaleString("en-US", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Form.Group controlId="formDescription">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter note"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}

                    // Add state and event handling logic as needed
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Row className="mt-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Row style={{ gap: "4cm" }}>
                    <Col md={5} className="me-3 ms-3">
                      <Form.Group controlId="">
                        <Form.Label>Diajukan Oleh</Form.Label>
                        <Select
                          id="salesPerson"
                          value={selectedSalesPerson}
                          options={SalesPersonOptions} // Use the fetched options here
                          isClearable
                          placeholder="Select..."
                          onChange={handleCreatedByChange} // Handle selection
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="">
                        <Form.Label>Tanggal Diajukan</Form.Label>
                        <Form.Control type="date" required />
                      </Form.Group>
                    </Col>

                    <Col md={5}>
                      <Form.Group controlId="">
                        <Form.Label>Disetujui Oleh</Form.Label>
                        <Select
                          id="salesPerson"
                          options={SalesPersonOptions} // Use the fetched options here
                          isClearable
                          placeholder="Select..."
                          onChange={handleSalesPersonChange} // Handle selection
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="">
                        <Form.Label>Tanggal Disetujui</Form.Label>
                        <Form.Control type="date" required />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              {/* <Card>
                <Card.Body>
                  <Col md={6}>
                    <Form.Group controlId="">
                      <Form.Label>Disetujui Oleh</Form.Label>
                      <Select
                        id="salesPerson"
                        options={SalesPersonOptions} // Use the fetched options here
                        isClearable
                        placeholder="Select..."
                        onChange={handleSalesPersonChange} // Handle selection
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="">
                      <Form.Label>Tanggal Disetujui</Form.Label>
                      <Form.Control type="date" required />
                    </Form.Group>
                  </Col>
                </Card.Body>
              </Card> */}
            </Col>
          </Row>
        </Row>
        <Row className="mt-4">
          <Col md={12} className="d-flex justify-content-end">
            {setIsEditingSalesOrder ? (
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => {
                  handleRefresh();
                  setIsAddingNewSalesOrder(false);
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

export default AddSalesOrder;
