import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { getBranch, getToken } from '../config/Constant';
import LookupParamService from '../service/LookupParamService';

const AddCoaModal = ({ show, handleClose, handleSave }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    // const [currency, setCurrency] = useState(null);
    const [normalBalancePosition, setNormalBalancePosition] = useState(0);
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
        // setCurrency(null);
        setNormalBalancePosition(0);
        setParentCode(null);
        setIsParent('Y');
    };

    const handleSubmit = () => {
        const newCoa = {
            CODE: code,
            NAME: name,
            TYPE: type,
            DESCRIPTION: description,
            NORMAL_BALANCE_POSITION: normalBalancePosition,
            PARENT_CODE_ID: parentCode?.value,
            IS_PARENT: isParent,
        };
        handleSave(newCoa);
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
        if (!show) {
            clearForm();
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add New COA</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="code">
                                <Form.Label>Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter COA code"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
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
                        <Col md={6}>
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
                        <Col md={6}>
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
                        <Col md={6}>
                            <Form.Group controlId="nominalBalancePosition">
                                <Form.Label>Normal Balance Position</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={normalBalancePosition}
                                    onChange={(e) => setNormalBalancePosition(e.target.value)}
                                    placeholder="Enter normal balance position"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
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
                    <Row className="mt-3">
                        <Col md={6}>
                            <Form.Group controlId="isParent">
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
                        </Col>
                    </Row>
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

export default AddCoaModal;
