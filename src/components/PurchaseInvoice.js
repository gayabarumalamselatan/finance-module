import React, { Fragment, useState } from "react";
import { Button, Col, Form, Row, Card } from "react-bootstrap";

function PurchaseOrder() {
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [docNo, setDocNo] = useState("");
  const [requestor, setRequestor] = useState("");
  const [department, setDepartment] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [vendor, setVendor] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [createBy, setCreateBy] = useState("");
  const [approveBy, setApproveBy] = useState("");
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

  const handleAddItem = () => {
    setItems([...items, { product: "", product_note: "", quantity: 0, currency: "IDR", unit_price: 0, tax_ppn: 0, tax_ppn_type: "", tax_ppn_amount: 0, tax_base: "", total_price: 0 }]);
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
                <li className="breadcrumb-item active">Purchase Request</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title>General Information</Card.Title>
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
                          <option value="">Select Invoice Status</option>
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

                    <Col md={12}>
                      <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="textarea" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === items.length && items.length > 0} />
                        </th>
                        <th>ID</th>
                        <th>Invoice Number</th>
                        <th>Product</th>
                        <th>Currency</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Product Note</th>
                        <th>Tax PPN</th>
                        <th>Tax PPN Type</th>
                        <th>Tax PPN Amount</th>
                        <th>Tax PPh</th>
                        <th>Tax PPh Type</th>
                        <th>Tax PPh Amount</th>
                        <th>Tax Base</th>
                        <th>Total Price</th>
                        <th>Actions</th>
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
                              <Form.Control type="number" value={item.ID} onChange={(e) => handleItemChange(index, "ID", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="text" value={item.invoice_number} onChange={(e) => handleItemChange(index, "invoice_number", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="text" value={item.product} onChange={(e) => handleItemChange(index, "product", parseFloat(e.target.value))} />
                            </td>
                            <td>
                              <Form.Control type="text" value={item.currency} onChange={(e) => handleItemChange(index, "currency", e.target.value)} />
                            </td>
                            <td>
                              <Form.Control type="text" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="text" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="text" value={item.tax_ppn_type} onChange={(e) => handleItemChange(index, "tax_ppn_type", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="number" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="text" value={item.tax_pph} onChange={(e) => handleItemChange(index, "tax_pph", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="text" value={item.tax_pph_type} onChange={(e) => handleItemChange(index, "tax_pph_type", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="number" value={item.tax_pph_amount} onChange={(e) => handleItemChange(index, "tax_pph_amount", parseFloat(e.target.value))} />
                            </td>

                            <td>
                              <Form.Control type="text" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", parseFloat(e.target.value))} />
                            </td>

                            <td>{item.total_price.toFixed(2)}</td>

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
                        <td colSpan="15" className="text-right">
                          Total Amount:
                        </td>
                        <td>{calculateTotalAmount().toFixed(2)}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="15" className="text-right">
                          Sub Total:
                        </td>
                        <td>{calculateTotalAmount().toFixed(2)}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="15" className="text-right">
                          PPN 10%:
                        </td>
                        <td>{calculateTotalAmount().toFixed(2)}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Fragment>
  );
}

export default PurchaseOrder;
