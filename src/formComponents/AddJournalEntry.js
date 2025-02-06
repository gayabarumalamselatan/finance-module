import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  CardFooter,
} from "react-bootstrap";
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

const AddJournalEntry = ({
  setIsAddingNewJournalEntry,
  setIsEditingJournalEntry,
  handleRefresh,
  index,
  item,
  selectedData,
}) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem("userId");

  // Function to format the date
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const [journal_number, setJournalNumber] = useState("");
  const [vendor_id, setVendorId] = useState("");
  const [status, setStatus] = useState("");
  const [posting_date, setPostingDate] = useState("");
  const [currency_code, setCurrencyCode] = useState("");
  const [currency_id, setCurrencyId] = useState("");
  const [period, setPeriod] = useState("");
  const [journal_type, setJournalType] = useState("");

  const [coa_id, setCoaId] = useState("");
  const [description, setDescription] = useState("");
  const [debet_idr, setDebetIdr] = useState(0);
  const [credit_idr, setCreditIdr] = useState(0);
  const [debet, setDebet] = useState(0);
  const [credit, setCredit] = useState(0);
  const [exchange_rate, setExchangeRate] = useState(0);
  const [invoice_number, setInvoiceNumber] = useState("");
  const [reconFlag, setReconFlag] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const [journal_id, setJournalId] = useState("");
  const [project_id, setProjectId] = useState("");

  const [items, setItems] = useState([]);

  const [journalNumberOptions, setJournalNumberOptions] = useState([]);
  const [postingDateOptions, setPostingDateOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [journalTypeOptions, setJournalTypeOptions] = useState([]);
  const [periodeOptions, setPeriodeOptions] = useState([]);
  const [invoiceNumberOptions, setInvoiceNumberOptions] = useState([]);
  const [vendorIdOptions, setVendorIdOptions] = useState([]);
  const [alllvendorIdOptions, setAllVendorIdOptions] = useState([]);
  const [currencyIdOptions, setCurrencyIdOptions] = useState([]);

  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);

  const [selectedCoaId, setSelectedCoaId] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [coaIdOptions, setCoaIdOptions] = useState([]);
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [debetIdrOptions, setDebetIdrOptions] = useState([]);
  const [creditIdrOptions, setCreditIdrOptions] = useState([]);
  const [debetOptions, setDebetOptions] = useState([]);
  const [creditOptions, setCreditOptions] = useState([]);
  const [exchangeRateOptions, setExchangeRateOptions] = useState([]);
  const [reconFlagOptions, setReconFlagOptions] = useState([]);
  const [departmentIdOptions, setDepartmentIdOptions] = useState([]);
  const [journalIdOptions, setJournalIdOptions] = useState([]);
  const [projectIdOptions, setProjectIdOptions] = useState([]);

  const [isSubmited, setIsSubmited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authToken = headers;

  const [isReadOnly, setIsReadOnly] = useState(false);

  const [inputWidth, setInputWidth] = useState(100);

  useEffect(() => {
    if (selectedData) {
      const { ID, JOURNAL_NUMBER } = selectedData[0];
      console.log("id and Jornal Number", ID, JOURNAL_NUMBER);
      setJournalNumber(JOURNAL_NUMBER);

      LookupService.fetchLookupData(
        `JOUR_FORMENTRY&filterBy=JOURNAL_NUMBER&filterValue=${JOURNAL_NUMBER}&operation=EQUAL`,
        authToken,
        branchId
      )
        .then((response) => {
          const data = response.data[0];
          if (data) {
            console.log("Data:", data);
            setJournalNumber(data.journal_number);
            setPostingDate(data.posting_date);
            setStatus(data.status);
            setExchangeRate(data.exchange_rate);
            setJournalType(data.journal_type);
            setPeriod(data.periode);
            setInvoiceNumber(data.invoice_number);
            setVendorId(data.vendor_id);
            setCurrencyId(data.currency_id);
          } else {
            console.log("No data found");
          }
        })
        .catch((error) => {
          console.error("Failed to load Journal Entry data:", error);
        });

      LookupService.fetchLookupData(
        `JOUR_FORMENTRYD&filterBy=JOURNAL_ID&filterValue=${ID}&operation=EQUAL`,
        authToken,
        branchId
      )
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetchedda:", fetchedItems);

          setItems(
            fetchedItems.map((item) => ({
              ...item,
            }))
          );
        })
        .catch((error) => {
          console.error("Failed to load items:", error);
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
            value: item.ID,
            label: item.NAME,
          }));
          setVendorIdOptions(allOptions);
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
            value: item.ID,
            label: item.CODE,
          }));
          setCurrencyIdOptions(options);
          console.log("currency selected : ", currencyIdOptions);
          // const selectedCurrencyOption = options.find((option) => option.value === currency_id);
          // console.log('currency selected : ', selectedCurrencyOption);
          // console.log('currency ID selected : ', currency_id);
          // setSelectedCurrencyId(selectedCurrencyOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });

      LookupParamService.fetchLookupDataView(
        "MSDT_FORMCOAA",
        authToken,
        branchId
      )
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
            id: item.ID,
            value: item.ID,
            label: `${item.CODE} - ${item.NAME}`,
          }));
          setCoaIdOptions(options);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });

      LookupParamService.fetchLookupDataView(
        "MSDT_FORMDPRT",
        authToken,
        branchId
      )
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
            value: item.ID,
            label: item.CODE,
          }));
          setDepartmentIdOptions(options);
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
            value: item.ID,
            label: item.NAME,
          }));
          setProjectIdOptions(options);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });
    }
  }, [selectedData]);

  useEffect(() => {
    const generateInitialJournalNumber = async () => {
      const generatedJournalNumber = await generateJournalNumber(
        "DRAFT_JOURNAL_ENTRY"
      ); // Adjust the code as needed

      setJournalNumber(generatedJournalNumber);
    };
    generateInitialJournalNumber();
  }, []); // Empty dependency array means this runs once on mount

  function formatIDR(value) {
    if (isNaN(value)) return "Rp0"; // Jika nilai bukan angka, tampilkan default
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Tanpa desimal
    }).format(value);
  }

  const generateJournalNumber = async (code) => {
    try {
      const uniqueJournalNumber = await generateUniqueId(
        `${GENERATED_NUMBER}?code=${code}`,
        authToken
      );
      setJournalNumber(uniqueJournalNumber); // Updates state, if needed elsewhere in your component
      return uniqueJournalNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate Journal Number:", error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const formatNumber = (number) => {
    if (isNaN(number) || number === null) return "0";
    return number.toLocaleString("en-US"); // Formats as 50,000
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const responses = await Promise.all([
          LookupParamService.fetchLookupData(
            "MSDT_FORMCCY",
            authToken,
            branchId
          ),
          LookupParamService.fetchLookupData(
            "MSDT_FORMDPRT",
            authToken,
            branchId
          ),
          LookupParamService.fetchLookupData(
            "MSDT_FORMPRJT",
            authToken,
            branchId
          ),
          LookupParamService.fetchLookupData(
            "MSDT_FORMCUST",
            authToken,
            branchId
          ),
          LookupParamService.fetchLookupData(
            "MSDT_FORMCOAA",
            authToken,
            branchId
          ),
        ]);

        const transformedData = responses.map((response) =>
          response.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          )
        );

        setCurrencyIdOptions(
          transformedData[0].map((item) => ({
            value: item.ID,
            label: item.CODE,
          }))
        );
        setDepartmentIdOptions(
          transformedData[1].map((item) => ({
            value: item.ID,
            label: item.NAME,
          }))
        );
        setProjectIdOptions(
          transformedData[2].map((item) => ({
            value: item.ID,
            label: item.NAME,
            project_contract_number: item.CONTRACT_NUMBER,
          }))
        );
        setVendorIdOptions(
          transformedData[3].map((item) => ({
            value: item.ID,
            label: item.NAME,
          }))
        );
        setCoaIdOptions(
          transformedData[4].map((item) => ({
            id: item.ID,
            value: item.ID,
            label: `${item.CODE} - ${item.NAME}`,
          }))
        );
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

  const handleProjectIdChange = (selectedOption) => {
    setSelectedProjectId(selectedOption);
    setProjectId(selectedOption ? selectedOption.value : "");
  };

  const handleDepartmentIdChange = (selectedOption) => {
    setSelectedDepartmentId(selectedOption);
    setDepartmentId(selectedOption ? selectedOption.value : "");
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedVendorId(selectedOption);
    setVendorId(selectedOption ? selectedOption.value : "");
  };

  const handleCoaIdChange = (selectedOption) => {
    setSelectedCoaId(selectedOption);
    setCoaId(selectedOption ? selectedOption.value : "");
  };

  const handleJournalNumberChange = (selectedOption) => {
    setJournalNumber(selectedOption ? selectedOption.value : "");
  };

  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption ? selectedOption.value : "");
  };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrencyId(selectedOption);
    setCurrencyId(selectedOption ? selectedOption.value : "");
    setCurrencyCode(selectedOption ? selectedOption.label : "");
    console.log("handleCurrency called");
  };

  const handleCreatedByChange = (selectedOption) => {
    setSelectedSalesPerson(selectedOption);
    setCreatedBy(selectedOption ? selectedOption.value : "");
  };

  console.log("currency IDnya", currency_id);
  // const handlePpnChange = (selectedOption) => {
  //   setSelectedPpn(selectedOption);
  //   setPPN(selectedOption ? selectedOption.value : "");
  // };
  const handleAddItem = () => {
    setSelectedCoaId(null);
    setCoaId("");
    setSelectedProjectId("");
    setSelectedDepartmentId("");
    setItems((prevItems) => [
      ...prevItems,
      {
        coa_id: "",
        description: "",
        debet: 0,
        credit: 0,
        debet_idr: 0,
        credit_idr: 0,
        exchange_rate: 0,
        project_id: "",
        department_id: "",
      },
    ]);
  };

  //   const handleAddItem = () => {
  //     // Reset product states for the new item
  //     //setSelectedProduct(null); // Reset selected product
  //     //setProduct(""); // Reset product input
  // setItems([
  //       ...items,
  //       {
  //         coa_id: "",
  //         description: "",
  //         debet: 0,
  //         credit: 0,
  //         debet_idr: 0,
  //         credit_idr: 0,
  //         exchange_rate: 0,
  //         project_id: "",
  //         department_id: "",
  //       },
  //     ]);
  //     // Add new empty item to the items array
  //     // setItems((prevItems) => [
  //     //   ...prevItems,
  //     //   {
  //     //     coa_id: "",
  //     //     description: "",
  //     //     debet: 0,
  //     //     credit: 0,
  //     //     debet_idr: 0,
  //     //     credit_idr: 0,
  //     //     exchange_rate: 0,
  //     //     project_id: "",
  //     //     department_id: "",
  //     //   },
  //     // ]);
  //   };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "debet" || field === "credit" || field === "exchange_rate") {
      const debet = newItems[index].debet || 0;
      const credit = newItems[index].credit || 0;
      const exchange_rate = newItems[index].exchange_rate || 0;

      // Calculate debet dan credit based on exchange rate if currency is not IDR
      if (currency_id === 61) {
        newItems[index].debet_idr = debet * 1;
        newItems[index].credit_idr = credit * 1;
      } else {
        newItems[index].debet_idr =
          debet * (newItems[index].exchange_rate || 1);
        newItems[index].credit_idr =
          credit * (newItems[index].exchange_rate || 1);
      }
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

  const calculateTotalAmount = () => {
    const debetTotal = items.reduce((total, item) => {
      const debet = isNaN(item.debet) ? 0 : item.debet;
      return total + debet;
    }, 0);

    const creditTotal = items.reduce((total, item) => {
      const credit = isNaN(item.credit) ? 0 : item.credit;
      return total + credit;
    }, 0);

    const debetIdrTotal = items.reduce((total, item) => {
      const debetIdr = isNaN(item.debet_idr) ? 0 : item.debet_idr;
      return total + debetIdr;
    }, 0);

    const creditIdrTotal = items.reduce((total, item) => {
      const creditIdr = isNaN(item.credit_idr) ? 0 : item.credit_idr;
      return total + creditIdr;
    }, 0);

    return {
      debetTotal,
      creditTotal,
      debetIdrTotal,
      creditIdrTotal,
    };
  };

  // const calculateTotalAmount = () => {
  //   // Ensure items is an array
  //   if (!Array.isArray(items)) return { totalAmount: 0, totalPPNAmount: 0, totalPPHAmount: 0, subTotal: 0, totalPaid: 0 };

  //   // Calculate total values
  //   const totalAmount = items.reduce((total, item) => total + (item.total_price || 0), 0);
  //   const totalPPNAmount = items.reduce((total, item) => total + (item.tax_ppn_amount || 0), 0);
  //   const totalPPHAmount = items.reduce((total, item) => total + (item.tax_pph_amount || 0), 0);

  //   // Calculate Sub Total (Handling NaN values for tax_base)
  //   const sub_total = items.reduce((total, item) => {
  //     const taxBase = isNaN(item.tax_base) || item.tax_base == null ? 0 : item.tax_base;
  //     return total + taxBase;
  //   }, 0);

  //   // Calculate totalPaid by adding subTotal and totalPPNAmount
  //   const totalPaid = sub_total + totalPPNAmount;

  //   return { totalAmount, totalPPNAmount, totalPPHAmount, sub_total, totalPaid };
  // };

  const detailFormStyle = () => {
    return {
      border: "none",
      background: "transparent",
      color: "#000",
    };
  };

  const dynamicFormWidth = (e) => {
    const contentLength = e.target.value.length;
    const newWidth = Math.max(100, contentLength * 12); // 8px per character, adjust as needed
    setInputWidth(newWidth);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const resetForm = () => {
    setVendorId(null);
    setCurrencyId(null);
    setPostingDate("");
    setStatus("");
    setCoaId("");
    setDescription("");
    setDebet(0);
    setCredit(0);
    setDebetIdr(0);
    setCreditIdr(0);
    setExchangeRate(0);
    setDepartmentId("");
    setProjectId("");
    // setSelectedVendorId(null);
    // setSelectedCurrencyId(null);
    setItems([]);
    setSelectedItems([]);
    // setVendorIdOptions(null);
    // setCurrencyIdOptions(null);
    setIsSubmited(false);
    setIsReadOnly(false);
    setJournalNumber(generateJournalNumber("DRAFT_JOURNAL_ENTRY"));
  };

  const handleOptionChange = (setter, stateSetter, selectedOption) => {
    setter(selectedOption);
    stateSetter(selectedOption ? selectedOption.value : "");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus("DRAFT");

    if (
      calculateTotalAmount().debetTotal == calculateTotalAmount().creditTotal
    ) {
      if (
        calculateTotalAmount().debetIdrTotal !=
        calculateTotalAmount().creditIdrTotal
      ) {
        console.log("debet IDR total if", calculateTotalAmount().debetIdrTotal);
        console.log(
          "credit IDR total if",
          calculateTotalAmount().creditIdrTotal
        );
        const resultBalanceIdr = await Swal.fire({
          title: "Journal Unbalance",
          text: "Please correcting Journal Amount IDR ",
          icon: "warning",
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: "Ok, I will Correcting!",
        });

        resultBalanceIdr;
      } else {
        console.log(
          "debet IDR total else",
          calculateTotalAmount().debetIdrTotal
        );
        console.log(
          "credit IDR total else",
          calculateTotalAmount().creditIdrTotal
        );
        // Show SweetAlert2 confirmation
        // console.log("debet total", calculateTotalAmount().debetTotal);
        // console.log("credit total", calculateTotalAmount().creditTotal);
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to save the Journal Entry?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Submit It!",
          cancelButtonText: "No, Cancel!",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          setIsLoading(true);
          try {
            // Save general information and description
            const createBy = sessionStorage.getItem("userId");
            const generalInfo = {
              vendor_id,
              posting_date,
              currency_id,
              journal_number,
              status: "DRAFT",
            };

            console.log("Master", generalInfo);
            console.log("items", items);

            const checkDataResponse = await LookupService.fetchLookupData(
              `JOUR_FORMENTRY&filterBy=journal_number&filterValue=${journal_number}&operation=EQUAL`,
              authToken,
              branchId
            );
            const getExistData = checkDataResponse.data;

            let response;
            if (getExistData && getExistData.length > 0) {
              response = await UpdateDataService.postData(
                generalInfo,
                `ENTRY&column=id&value=${getExistData[0]?.ID}`,
                authToken,
                branchId
              );
              console.log("Data update successfully:", response);
              console.log("Data update for ID", getExistData[0]?.ID);
            } else {
              response = await InsertDataService.postData(
                generalInfo,
                "ENTRY",
                authToken,
                branchId
              );
              console.log("Data insert successfully:", response);
            }

            if (response.message === "Update Data Successfully") {
              if (getExistData && getExistData.length > 0) {
                const lookupResponse = await LookupService.fetchLookupData(
                  `JOUR_FORMENTRYD&filterBy=journal_id&filterValue=${getExistData[0]?.ID}&operation=EQUAL`,
                  authToken,
                  branchId
                );

                const ids = lookupResponse.data.map((item) => item.ID); // Dapatkan semua ID dari respons array
                console.log("IDs to delete:", ids);

                // Delete each item based on fetched IDs
                for (const id of ids) {
                  try {
                    await DeleteDataService.postData(
                      `column=id&value=${id}`,
                      "ENTRYD",
                      authToken,
                      branchId
                    );
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
                      const itemResponse = await DeleteDataService.postData(
                        `column=id&value=${itemId}`,
                        "ENTRYD",
                        authToken,
                        branchId
                      );
                      console.log("Item deleted successfully:", itemResponse);
                    } catch (error) {
                      console.error("Error deleting item:", itemId, error);
                    }
                  } else {
                    console.log(
                      "No ID found, skipping delete for this item:",
                      item
                    );
                  }
                }
              }
              for (const item of items) {
                const updatedItem = {
                  ...item,
                  //coa_id,
                  // description,
                  //debet,
                  //credit,
                  //debet_idr,
                  //credit_idr,
                  //exchange_rate,
                  journal_id: getExistData[0]?.ID,
                  // project_id,
                  // department_id,
                };
                delete updatedItem.rwnum;
                delete updatedItem.ID;
                delete updatedItem.id_trx;
                delete updatedItem.status;

                const itemResponse = await InsertDataService.postData(
                  updatedItem,
                  "ENTRYD",
                  authToken,
                  branchId
                );
                console.log("Item posted successfully:", itemResponse);
              }
              messageAlertSwal("Success", response.message, "success");
            }

            if (response.message === "insert Data Successfully") {
              const getNewData = await LookupService.fetchLookupData(
                `JOUR_FORMENTRY&filterBy=journal_number&filterValue=${journal_number}&operation=EQUAL`,
                authToken,
                branchId
              );
              const getNewId = getNewData.data[0];
              // Iterate over items array and post each item individually
              for (const item of items) {
                const updatedItem = {
                  ...item,
                  //coa_id,
                  // description,
                  //debet,
                  //credit,
                  //debet_idr,
                  //credit_idr,
                  //exchange_rate,
                  journal_id: getNewId.ID,
                  // project_id,
                  // department_id,
                };

                const itemResponse = await InsertDataService.postData(
                  updatedItem,
                  "ENTRYD",
                  authToken,
                  branchId
                );
                console.log("Item posted successfully:", itemResponse);
              }

              messageAlertSwal("Success", response.message, "success");
              //resetForm();
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
      }
    } else {
      console.log("debet total", calculateTotalAmount().debetTotal);
      console.log("credit total", calculateTotalAmount().creditTotal);
      const resultBalance = await Swal.fire({
        title: "Journal Unbalance",
        text: "Please correcting Journal Amount ",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "Ok, I will Correcting!",
      });
      resultBalance;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("POST");

    if (
      calculateTotalAmount().debetTotal == calculateTotalAmount().creditTotal
    ) {
      if (
        calculateTotalAmount().debetIdrTotal !=
        calculateTotalAmount().creditIdrTotal
      ) {
        console.log("debet IDR total if", calculateTotalAmount().debetIdrTotal);
        console.log(
          "credit IDR total if",
          calculateTotalAmount().creditIdrTotal
        );
        const resultBalanceIdr = await Swal.fire({
          title: "Journal Unbalance",
          text: "Please correcting Journal Amount IDR ",
          icon: "warning",
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: "Ok, I will Correcting!",
        });

        resultBalanceIdr;
      } else {
        console.log(
          "debet IDR total else",
          calculateTotalAmount().debetIdrTotal
        );
        console.log(
          "credit IDR total else",
          calculateTotalAmount().creditIdrTotal
        );
        // Show SweetAlert2 confirmation
        // console.log("debet total", calculateTotalAmount().debetTotal);
        // console.log("credit total", calculateTotalAmount().creditTotal);
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to save the Journal Entry?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Submit It!",
          cancelButtonText: "No, Cancel!",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          setIsLoading(true);
          try {
            const getNewJournalNumber = await generateJournalNumber("JM");
            console.log("JOURNAL POSTED NUMBER:", getNewJournalNumber);
            setJournalNumber(getNewJournalNumber);
            // Save general information and description
            const createBy = sessionStorage.getItem("userId");
            const generalInfo = {
              vendor_id,
              posting_date,
              currency_id,
              journal_number: getNewJournalNumber,
              status: "POST",
            };

            console.log("Master", generalInfo);
            console.log("items", items);

            const checkDataResponse = await LookupService.fetchLookupData(
              `JOUR_FORMENTRY&filterBy=journal_number&filterValue=${journal_number}&operation=EQUAL`,
              authToken,
              branchId
            );
            const getExistData = checkDataResponse.data;

            let response;
            if (getExistData && getExistData.length > 0) {
              response = await UpdateDataService.postData(
                generalInfo,
                `ENTRY&column=id&value=${getExistData[0]?.ID}`,
                authToken,
                branchId
              );
              console.log("Data update successfully:", response);
              console.log("Data update for ID", getExistData[0]?.ID);
            } else {
              response = await InsertDataService.postData(
                generalInfo,
                "ENTRY",
                authToken,
                branchId
              );
              console.log("Data insert successfully:", response);
            }

            if (response.message === "Update Data Successfully") {
              if (getExistData && getExistData.length > 0) {
                const lookupResponse = await LookupService.fetchLookupData(
                  `JOUR_FORMENTRYD&filterBy=journal_id&filterValue=${getExistData[0]?.ID}&operation=EQUAL`,
                  authToken,
                  branchId
                );

                const ids = lookupResponse.data.map((item) => item.ID); // Dapatkan semua ID dari respons array
                console.log("IDs to delete:", ids);

                // Delete each item based on fetched IDs
                for (const id of ids) {
                  try {
                    await DeleteDataService.postData(
                      `column=id&value=${id}`,
                      "ENTRYD",
                      authToken,
                      branchId
                    );
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
                      const itemResponse = await DeleteDataService.postData(
                        `column=id&value=${itemId}`,
                        "ENTRYD",
                        authToken,
                        branchId
                      );
                      console.log("Item deleted successfully:", itemResponse);
                    } catch (error) {
                      console.error("Error deleting item:", itemId, error);
                    }
                  } else {
                    console.log(
                      "No ID found, skipping delete for this item:",
                      item
                    );
                  }
                }
              }
              for (const item of items) {
                const updatedItem = {
                  ...item,
                  //coa_id,
                  // description,
                  //debet,
                  //credit,
                  //debet_idr,
                  //credit_idr,
                  //exchange_rate,
                  journal_id: getExistData[0]?.ID,
                  // project_id,
                  // department_id,
                };

                delete updatedItem.rwnum;
                delete updatedItem.ID;
                delete updatedItem.id_trx;
                delete updatedItem.status;

                const itemResponse = await InsertDataService.postData(
                  updatedItem,
                  "ENTRYD",
                  authToken,
                  branchId
                );
                console.log("Item posted successfully:", itemResponse);
              }
              messageAlertSwal("Success", response.message, "success");
              setIsReadOnly(true);
              setIsSubmited(true);
            }

            if (response.message === "insert Data Successfully") {
              console.log("new journal number", journal_number);
              const getNewData = await LookupService.fetchLookupData(
                `JOUR_FORMENTRY&filterBy=journal_number&filterValue=${getNewJournalNumber}&operation=EQUAL`,
                authToken,
                branchId
              );

              const getNewId = getNewData.data[0];
              console.log("newDataSubmit1", getNewData.data[0]);
              console.log("newDataSubmit", getNewId);
              console.log("newIDSubmit", getNewId.ID);
              // Iterate over items array and post each item individually
              for (const item of items) {
                const updatedItem = {
                  ...item,
                  //coa_id,
                  // description,
                  //debet,
                  //credit,
                  //debet_idr,
                  //credit_idr,
                  //exchange_rate,
                  journal_id: getNewId.ID,
                  // project_id,
                  // department_id,
                };

                const itemResponse = await InsertDataService.postData(
                  updatedItem,
                  "ENTRYD",
                  authToken,
                  branchId
                );
                console.log("Item posted successfully:", itemResponse);
              }

              messageAlertSwal("Success", response.message, "success");
              setIsReadOnly(true);
              setIsSubmited(true);
              //resetForm();
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
      }
    } else {
      console.log("debet total", calculateTotalAmount().debetTotal);
      console.log("credit total", calculateTotalAmount().creditTotal);
      const resultBalance = await Swal.fire({
        title: "Journal Unbalance",
        text: "Please correcting Journal Amount ",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "Ok, I will Correcting!",
      });
      resultBalance;
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
                  {setIsEditingJournalEntry ? (
                    <Button
                      variant="secondary"
                      className="mr-2"
                      onClick={() => {
                        handleRefresh();
                        //setIsAddingNewJournalEntry(false);
                        setIsEditingJournalEntry(false);
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
                      <Button
                        variant="primary"
                        className="mr-2"
                        onClick={handleSave}
                      >
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
                      <Form.Group controlId="vendorId">
                        <Form.Label>Vendor / Customer</Form.Label>
                        {/* <Select
                  id="vendorId"
                  options={vendorIdOptions}
                  isClearable
                  placeholder="Select..."
                  value={selectedVendorId}
                  onChange={handleVendorChange}
                  isDisabled={isReadOnly} // Disable Select component
                  required
                /> */}
                        <Select
                          // value={vendorIdOptions.find(
                          //   (option) => option.value === vendor_id
                          // )}
                          // onChange={handleVendorChange}
                          // options={vendorIdOptions}
                          value={
                            (vendorIdOptions || []).find(
                              (option) => option.value === vendor_id
                            ) || null
                          }
                          onChange={handleVendorChange}
                          options={vendorIdOptions || []}
                          isClearable
                          placeholder="Select Vendor..."
                          isDisabled={isReadOnly}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="journalNumber">
                        <Form.Label>Journal Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={journal_number}
                          readOnly={true}
                          placeholder="Journal Number"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="postingDate">
                        <Form.Label>Posting Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={posting_date}
                          onChange={(e) => setPostingDate(e.target.value)}
                          readOnly={isReadOnly}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                          type="text"
                          value={status}
                          readOnly
                          placeholder="NEW"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="currency">
                        <Form.Label>Currency</Form.Label>
                        {/* <Select
                  id="currency"
                  options={currencyIdOptions}
                  isClearable
                  placeholder="Select..."
                  value={selectedCurrencyId}
                  onChange={(selectedOption) => {
                    handleCurrencyChange(selectedOption); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                  }}
                  isDisabled={isReadOnly} // Disable Select component
                  required
                /> */}
                        <Select
                          // value={currencyIdOptions.find(
                          //   (option) => option.value === currency_id
                          // )}
                          // onChange={handleCurrencyChange}
                          // options={currencyIdOptions}
                          value={
                            (currencyIdOptions || []).find(
                              (option) => option.value === currency_id
                            ) || null
                          }
                          onChange={handleCurrencyChange}
                          options={currencyIdOptions || []}
                          isClearable
                          placeholder="Select Currency..."
                          isDisabled={isReadOnly}
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
                  <Card.Title>Detail Item</Card.Title>
                  <div>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleAddItem}
                      disabled={isReadOnly}
                    >
                      <i className="fas fa-plus"></i> New Item
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ml-2"
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
                  <Droppable droppableId="detail">
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
                                  checked={
                                    selectedItems.length === items.length &&
                                    items.length > 0
                                  }
                                />
                              </th>
                              <th>Code / Name Account</th>
                              <th>Descriptions</th>
                              <th>Debet</th>
                              <th>Credit</th>
                              <th>Debet IDR</th>
                              <th>Credit IDR</th>
                              <th>Excange Rate</th>
                              <th>Project</th>
                              <th>Department</th>
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
                                <tr
                                  key={index}
                                  className={
                                    selectedItems.includes(index)
                                      ? "table-active"
                                      : ""
                                  }
                                >
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={selectedItems.includes(index)}
                                      onChange={() => handleSelectItem(index)}
                                    />
                                  </td>
                                  {/* <td>
                                  <Select id="coa_id" options={coaIdOptions} isClearable placeholder="Select Code Account..." value={selectedCoaId} onChange={handleCoaIdChange} required />
                                  </td> */}
                                  <td>
                                    <Select
                                      value={
                                        items[index].coa_id
                                          ? coaIdOptions.find(
                                              (option) =>
                                                option.value ===
                                                items[index].coa_id
                                            )
                                          : null
                                      }
                                      onChange={(selectedOption) => {
                                        handleItemChange(
                                          index,
                                          "coa_id",
                                          selectedOption
                                            ? selectedOption.value
                                            : null
                                        );
                                      }}
                                      options={coaIdOptions}
                                      isClearable
                                      placeholder="Select Code Account..."
                                      isDisabled={isReadOnly}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      value={item.description}
                                      placeholder="Enter a description"
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      readOnly={isReadOnly}
                                      style={{
                                        border: "none",
                                        boxShadow: "none",
                                        backgroundColor: "transparent",
                                      }}
                                    />
                                  </td>
                                  <td>
                                    {currency_id === 61 ? (
                                      <Form.Control
                                        className="text-right"
                                        type="text"
                                        value={
                                          item.debet !== undefined &&
                                          item.debet !== null
                                            ? item.debet.toLocaleString("en-US")
                                            : 0
                                        }
                                        onChange={(e) => {
                                          const newPrice =
                                            parseFloat(
                                              e.target.value.replace(
                                                /[^\d.-]/g,
                                                ""
                                              )
                                            ) || 0;
                                          handleItemChange(
                                            index,
                                            "debet",
                                            newPrice
                                          );
                                          dynamicFormWidth(e);
                                        }}
                                        readOnly={isReadOnly}
                                        style={detailFormStyle()}
                                      />
                                    ) : (
                                      <Form.Control
                                        className="text-right"
                                        type="text"
                                        value={
                                          item.debet !== undefined &&
                                          item.debet !== null
                                            ? item.debet.toLocaleString(
                                                "en-US",
                                                {
                                                  minimumFractionDigits: 2,
                                                  useGrouping: false,
                                                }
                                              )
                                            : "0"
                                        }
                                        onChange={(e) => {
                                          const input = e.target.value;

                                          // Allow only numbers, periods, and remove unwanted characters
                                          const sanitizedInput = input.replace(
                                            /[^0-9.]/g,
                                            ""
                                          );

                                          // Update the state with sanitized input
                                          handleItemChange(
                                            index,
                                            "debet",
                                            sanitizedInput
                                          );

                                          // Optional: You can maintain original price logic if needed
                                          // handleItemChange(index, 'original_unit_price', sanitizedInput);
                                        }}
                                        onBlur={() => {
                                          const price =
                                            parseFloat(item.debet) || 0;
                                          handleItemChange(
                                            index,
                                            "debet",
                                            price
                                          ); // Convert back to number on blur
                                        }}
                                        readOnly={isReadOnly}
                                        style={detailFormStyle()}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    {currency_id === 61 ? (
                                      <Form.Control
                                        className="text-right"
                                        type="text"
                                        value={
                                          item.credit !== undefined &&
                                          item.credit !== null
                                            ? item.credit.toLocaleString(
                                                "en-US"
                                              )
                                            : 0
                                        }
                                        onChange={(e) => {
                                          const newPrice =
                                            parseFloat(
                                              e.target.value.replace(
                                                /[^\d.-]/g,
                                                ""
                                              )
                                            ) || 0;
                                          handleItemChange(
                                            index,
                                            "credit",
                                            newPrice
                                          );
                                          dynamicFormWidth(e);
                                        }}
                                        readOnly={isReadOnly}
                                        style={detailFormStyle()}
                                      />
                                    ) : (
                                      <Form.Control
                                        className="text-right"
                                        type="text"
                                        value={
                                          item.credit !== undefined &&
                                          item.credit !== null
                                            ? item.credit.toLocaleString(
                                                "en-US",
                                                {
                                                  minimumFractionDigits: 2,
                                                  useGrouping: false,
                                                }
                                              )
                                            : "0"
                                        }
                                        onChange={(e) => {
                                          const input = e.target.value;

                                          // Allow only numbers, periods, and remove unwanted characters
                                          const sanitizedInput = input.replace(
                                            /[^0-9.]/g,
                                            ""
                                          );

                                          // Update the state with sanitized input
                                          handleItemChange(
                                            index,
                                            "credit",
                                            sanitizedInput
                                          );

                                          // Optional: You can maintain original price logic if needed
                                          // handleItemChange(index, 'original_unit_price', sanitizedInput);
                                        }}
                                        onBlur={() => {
                                          const price =
                                            parseFloat(item.credit) || 0;
                                          handleItemChange(
                                            index,
                                            "credit",
                                            price
                                          ); // Convert back to number on blur
                                        }}
                                        readOnly={isReadOnly}
                                        style={detailFormStyle()}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <Form.Control
                                      className="text-right"
                                      type="text"
                                      value={
                                        item.debet_idr !== null &&
                                        item.debet_idr !== undefined
                                          ? formatNumber(item.debet_idr)
                                          : 0
                                      }
                                      onChange={(e) => {
                                        const numericValue = parseFloat(
                                          e.target.value.replace(/,/g, "")
                                        );
                                        handleItemChange(
                                          index,
                                          "debet_idr",
                                          isNaN(numericValue) ? 0 : numericValue
                                        );
                                      }}
                                      readOnly={isReadOnly}
                                      style={{
                                        border: "none",
                                        boxShadow: "none",
                                        backgroundColor: "transparent",
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      className="text-right"
                                      type="text"
                                      value={
                                        item.credit_idr !== null &&
                                        item.credit_idr !== undefined
                                          ? formatNumber(item.credit_idr)
                                          : 0
                                      }
                                      onChange={(e) => {
                                        const numericValue = parseFloat(
                                          e.target.value.replace(/,/g, "")
                                        );
                                        handleItemChange(
                                          index,
                                          "credit_idr",
                                          isNaN(numericValue) ? 0 : numericValue
                                        );
                                      }}
                                      readOnly={isReadOnly}
                                      style={{
                                        border: "none",
                                        boxShadow: "none",
                                        backgroundColor: "transparent",
                                      }}
                                    />
                                  </td>
                                  <td>
                                    {currency_id === 61 ? (
                                      <Form.Control
                                        className="text-right"
                                        type="text"
                                        value={
                                          item.exchange_rate !== undefined &&
                                          item.exchange_rate !== null
                                            ? item.exchange_rate.toLocaleString(
                                                "en-US"
                                              )
                                            : 0
                                        }
                                        onChange={(e) => {
                                          const newPrice =
                                            parseFloat(
                                              e.target.value.replace(
                                                /[^\d.-]/g,
                                                ""
                                              )
                                            ) || 0;
                                          handleItemChange(
                                            index,
                                            "exchange_rate",
                                            newPrice
                                          );
                                          dynamicFormWidth(e);
                                        }}
                                        readOnly={isReadOnly}
                                        style={detailFormStyle()}
                                      />
                                    ) : (
                                      <Form.Control
                                        className="text-right"
                                        type="text"
                                        value={
                                          item.exchange_rate !== undefined &&
                                          item.exchange_rate !== null
                                            ? item.exchange_rate.toLocaleString(
                                                "en-US",
                                                {
                                                  minimumFractionDigits: 2,
                                                  useGrouping: false,
                                                }
                                              )
                                            : "0"
                                        }
                                        onChange={(e) => {
                                          const input = e.target.value;

                                          // Allow only numbers, periods, and remove unwanted characters
                                          const sanitizedInput = input.replace(
                                            /[^0-9.]/g,
                                            ""
                                          );

                                          // Update the state with sanitized input
                                          handleItemChange(
                                            index,
                                            "exchange_rate",
                                            sanitizedInput
                                          );

                                          // Optional: You can maintain original price logic if needed
                                          // handleItemChange(index, 'original_unit_price', sanitizedInput);
                                        }}
                                        onBlur={() => {
                                          const price =
                                            parseFloat(item.exchange_rate) || 0;
                                          handleItemChange(
                                            index,
                                            "exchange_rate",
                                            price
                                          ); // Convert back to number on blur
                                        }}
                                        readOnly={isReadOnly}
                                        style={detailFormStyle()}
                                      />
                                    )}
                                  </td>
                                  {/* <td>
                                  <Select id="project_id" options={projectIdOptions} isClearable placeholder="Select Project..." value={selectedProjectId} onChange={handleProjectIdChange} required />
                                  </td> */}
                                  <td>
                                    <Select
                                      value={
                                        items[index].project_id
                                          ? projectIdOptions.find(
                                              (option) =>
                                                option.value ===
                                                items[index].project_id
                                            )
                                          : null
                                      }
                                      onChange={(selectedOption) => {
                                        handleItemChange(
                                          index,
                                          "project_id",
                                          selectedOption
                                            ? selectedOption.value
                                            : null
                                        );
                                      }}
                                      options={projectIdOptions}
                                      isClearable
                                      placeholder="Select Project..."
                                      isDisabled={isReadOnly}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>
                                  {/* <td>
                                  <Select id="department_id" options={departmentIdOptions} isClearable placeholder="Select Department..." value={selectedDepartmentId} onChange={handleDepartmentIdChange} required />
                                  </td> */}
                                  <td>
                                    <Select
                                      value={
                                        items[index].department_id
                                          ? departmentIdOptions.find(
                                              (option) =>
                                                option.value ===
                                                items[index].department_id
                                            )
                                          : null
                                      }
                                      onChange={(selectedOption) => {
                                        handleItemChange(
                                          index,
                                          "department_id",
                                          selectedOption
                                            ? selectedOption.value
                                            : null
                                        );
                                      }}
                                      options={departmentIdOptions}
                                      isClearable
                                      placeholder="Select Department..."
                                      isDisabled={isReadOnly}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
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
                            <tr>
                              <td style={{ border: "none" }}></td>
                              <td style={{ border: "none" }}></td>
                              <td style={{ border: "none" }}></td>
                              <td className="text-right">
                                <strong>
                                  {calculateTotalAmount().debetTotal.toLocaleString(
                                    "en-US",
                                    {
                                      style: "currency",
                                      currency: currency_code || "IDR",
                                    }
                                  )}
                                </strong>
                              </td>
                              <td className="text-right">
                                <strong>
                                  {calculateTotalAmount().creditTotal.toLocaleString(
                                    "en-US",
                                    {
                                      style: "currency",
                                      currency: currency_code || "IDR",
                                    }
                                  )}
                                </strong>
                              </td>
                              <td className="text-right">
                                <strong>
                                  {calculateTotalAmount().debetIdrTotal.toLocaleString(
                                    "en-US",
                                    {
                                      style: "currency",
                                      currency: "IDR",
                                    }
                                  )}
                                </strong>
                              </td>
                              <td className="text-right">
                                <strong>
                                  {calculateTotalAmount().creditIdrTotal.toLocaleString(
                                    "en-US",
                                    {
                                      style: "currency",
                                      currency: "IDR",
                                    }
                                  )}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                          <tfoot></tfoot>
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
          <Col md={12} className="d-flex justify-content-end">
            {setIsEditingJournalEntry ? (
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => {
                  handleRefresh();
                  //setIsAddingNewJournalEntry(false);
                  setIsEditingJournalEntry(false);
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

export default AddJournalEntry;
