import React, { Fragment, useState } from "react";
import { Button, Col, Form, Row, Card, Table } from "react-bootstrap";
import { FaSyncAlt, FaUserPlus, FaFilter } from "react-icons/fa";

function PurchaseInvoice() {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [vendor, setVendor] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [ID, setID] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [invoicenumber, setInvoiceNumeber] = useState("");
  const [description, setDescription] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSection, setShowSection] = useState(""); // Set default section to "test"

  const handleAddItem = () => {
    setItems([...items, { product: "", product_note: "", quantity: 0, currency: "IDR", unit_price: 0, tax_ppn: 0, tax_ppn_type: "", tax_ppn_amount: 0, tax_base: "", total_price: 0 }]);
    setShowSection("menu"); // Show both sections when adding an item
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
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
    return items.reduce((total, item) => total + item.total_price, 0);
  };

  const calculateSubTotal = () => {
    return items.reduce((total, item) => total + item.total_price, 0);
  };

  const calculatePPN = () => {
    return calculateSubTotal() * 0.1;
  };

  // Handlers for Cancel and Save buttons
  const handleCancel = () => {
    // Add logic to handle cancel action (e.g., reset form or navigate away)
  };

  const handleSave = () => {
    // Add logic to handle save action (e.g., submit form data)
  };

  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Purchase Invoice</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Purchase Invoice</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        {/* Conditionally render General Information and Item List sections */}
        {showSection === "menu" && (
          <>
            <Row>
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Title>General Information</Card.Title>
                      <div>
                        <Button variant="secondary" className="mr-2" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Enter ID"
                              value={ID}
                              onChange={(e) => setID(e.target.value)} // Updated to setID
                              required
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formInvoceNumber">
                            <Form.Label>Invoice Number</Form.Label>
                            <Form.Control type="text" placeholder="Enter Invoice Number" value={invoicenumber} onChange={(e) => setInvoiceNumeber(e.target.value)} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formPRNumber">
                            <Form.Label>PR Number</Form.Label>
                            <Form.Control type="text" placeholder="Enter PR Number" value={prNumber} onChange={(e) => setPrNumber(e.target.value)} />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formPoNumber">
                            <Form.Label>PO Number</Form.Label>
                            <Form.Control type="text" placeholder="Enter PO Number" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formInvoiceType">
                            <Form.Label>Invoice Type</Form.Label>
                            <Form.Control type="text" placeholder="Enter Invoice Type" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formInvoiceDate">
                            <Form.Label>Invoice Date</Form.Label>
                            <Form.Control type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formProject">
                            <Form.Label>Project</Form.Label>
                            <Form.Control type="text" placeholder="Enter Project" value={project} onChange={(e) => setProject(e.target.value)} />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formVendor">
                            <Form.Label>Vendor</Form.Label>
                            <Form.Control type="text" placeholder="Enter Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formPaymentTerm">
                            <Form.Label>Payment Term</Form.Label>
                            <Form.Control type="text" placeholder="Enter Payment Term" value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formInvoiceStatus">
                            <Form.Label>Invoice Status</Form.Label>
                            <Form.Select value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="formTotalAmount">
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control type="number" placeholder="Enter Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Title>Item List</Card.Title>
                      <div className="">
                        <Button variant="success" onClick={handleAddItem}>
                          Add Item
                        </Button>
                        <Button className="ml-2" variant="danger" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                          Delete Selected
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Select</th>
                          <th>Product</th>
                          <th>Note</th>
                          <th>Quantity</th>
                          <th>Currency</th>
                          <th>Unit Price</th>
                          <th>Tax PPN</th>
                          <th>Tax Base</th>
                          <th>Total Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <input type="checkbox" checked={selectedItems.includes(index)} onChange={() => handleSelectItem(index)} />
                            </td>
                            <td>
                              <Form.Control type="text" value={item.product} onChange={(e) => handleItemChange(index, "product", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="text" value={item.currency} onChange={(e) => handleItemChange(index, "currency", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="number" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="text" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", e.target.value)} />
                            </td>
                            <td>{item.total_price.toFixed(2)}</td>
                            <td>
                              <Button variant="danger" onClick={() => handleDeleteItem(index)}>
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="9">Subtotal</td>
                          <td>{calculateSubTotal().toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan="9">PPN (10%)</td>
                          <td>{calculatePPN().toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan="9">Total Amount</td>
                          <td>{calculateTotalAmount().toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Title>Description</Card.Title>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col md={12}>
                          <Form.Control as="textarea" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="mr-2" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </>
        )}

        {showSection === "" && (
          <Row className="mt-4">
            <Col md={12}>
              <Card>
                <Card.Header>
                  <div className="row my-1">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                  <label htmlFor="pageSizeSelect" className="me-2">
                    Rows per page:
                  </label>
                  <select
                    id="pageSizeSelect"
                    className="form-form-select form-select-sm"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                      <div className="col-6 d-flex justify-content-end align-items-center">
                        <div className="btn-group ml-2">
                          <button type="button" className="btn btn-default">
                            <FaSyncAlt />
                          </button>
                          <button type="button" className="btn btn-default" onClick={handleAddItem}>
                            <FaUserPlus /> Add New
                          </button>
                          <button type="button" className="btn btn-default">
                            <FaFilter /> Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>
                            <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === items.length && items.length > 0} />
                          </th>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Invoice Number</th>
                          <th>PR Number</th>
                          <th>PO Number</th>
                          <th>Invoice Type</th>
                          <th>Invoice Date</th>
                          <th>Project</th>
                          <th>Vendor</th>
                          <th>Payment Term</th>
                          <th>Due Date</th>
                          <th>Total Amount</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan="15" className="text-center">
                              No data available
                            </td>
                          </tr>
                        ) : (
                          items.map((item, index) => (
                            <tr key={index} className={selectedItems.includes(index) ? "table-active" : ""}>
                              <td>
                                <input type="checkbox" checked={selectedItems.includes(index)} onChange={() => handleSelectItem(index)} />
                              </td>
                              <td>{item.id}</td>
                              <td>{item.title}</td>
                              <td>{item.invoiceNumber}</td>
                              <td>{item.prNumber}</td>
                              <td>{item.poNumber}</td>
                              <td>{item.invoiceType}</td>
                              <td>{item.invoiceDate}</td>
                              <td>{item.project}</td>
                              <td>{item.vendor}</td>
                              <td>{item.paymentTerm}</td>
                              <td>{item.dueDate}</td>
                              <td>{item.totalAmount.toFixed(2)}</td>
                              <td>{item.description}</td>
                              <td>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </section>
    </Fragment>
  );
}

export default PurchaseInvoice;