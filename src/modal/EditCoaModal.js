import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { getBranch, getToken } from '../config/Constant';
import LookupParamService from '../service/LookupParamService';

const EditCoaModal = ({ show, handleClose, handleSave, coaData }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState(null);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [parentCode, setParentCode] = useState(null);
    const [parentCodeOptions, setParentCodeOptions] = useState([]);
    const [isParent, setIsParent] = useState('Y');

    const headers = getToken();
    const branchId = getBranch();
    const authToken = headers;

    const clearForm = () => {
        setCode('');
        setName('');
        setType('');
        setDescription('');
        setCurrency(null);
        setParentCode(null);
        setIsParent('Y');
    };

    const handleSubmit = () => {
        const updatedCoa = {
            CODE: code,
            NAME: name,
            TYPE: type,
            DESCRIPTION: description,
            CURRENCY: currency?.value,
            PARENT_CODE_ID: parentCode?.value,
            IS_PARENT: isParent,
        };
        handleSave(updatedCoa);
        clearForm();
        handleClose();
    };

    const handleCloseModal = () => {
        clearForm();
        handleClose();
    };

    useEffect(() => {
        LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
            .then(data => {
                const transformedData = data.data.map(item =>
                    Object.keys(item).reduce((acc, key) => {
                        acc[key.toUpperCase()] = item[key];
                        return acc;
                    }, {})
                );

                const options = transformedData.map(item => ({
                    value: item.CODE,
                    label: item.CODE + " - " + item.DESCRIPTION
                }));
                setCurrencyOptions(options);
            })
            .catch(error => {
                console.error('Failed to fetch currency lookup:', error);
            });

        LookupParamService.fetchLookupData("MSDT_FORMCOAA", authToken, branchId)
            .then(data => {
                const transformedData = data.data.map(item =>
                    Object.keys(item).reduce((acc, key) => {
                        acc[key.toUpperCase()] = item[key];
                        return acc;
                    }, {})
                );

                const options = transformedData.map(item => ({
                    value: item.CODE,
                    label: item.CODE + " - " + item.NAME
                }));
                setParentCodeOptions(options);
            })
            .catch(error => {
                console.error('Failed to fetch parent COA lookup:', error);
            });
    }, [authToken, branchId]);

    useEffect(() => {
        if (coaData) {
            setCode(coaData.CODE);
            setName(coaData.NAME);
            setType(coaData.TYPE);
            setDescription(coaData.DESCRIPTION);
            setCurrency({
                value: coaData.CURRENCY,
                label: `${coaData.CURRENCY} - ${coaData.CURRENCY_DESCRIPTION}`
            });
            setParentCode({
                value: coaData.PARENT_CODE_ID,
                label: `${coaData.PARENT_CODE} - ${coaData.PARENT_NAME}`
            });
            setIsParent(coaData.IS_PARENT);
        }
    }, [coaData]);

    useEffect(() => {
        if (!show) {
            clearForm();
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit COA</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="code">
                                <Form.Label>Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter COA code"
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter COA name"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Form.Group controlId="type">
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    placeholder="Enter COA type"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter COA description"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Form.Group controlId="currency">
                                <Form.Label>Currency</Form.Label>
                                <Select
                                    value={currency}
                                    onChange={setCurrency}
                                    options={currencyOptions}
                                    placeholder="Select currency"
                                    isClearable
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="parentCode">
                                <Form.Label>Parent COA</Form.Label>
                                <Select
                                    value={parentCode}
                                    onChange={setParentCode}
                                    options={parentCodeOptions}
                                    placeholder="Select parent COA"
                                    isClearable
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="isParent" className="mt-3">
                        <Form.Label>Is Parent</Form.Label>
                        <Form.Control
                            as="select"
                            value={isParent}
                            onChange={(e) => setIsParent(e.target.value)}
                        >
                            <option value="Y">Yes</option>
                            <option value="N">No</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCoaModal;
