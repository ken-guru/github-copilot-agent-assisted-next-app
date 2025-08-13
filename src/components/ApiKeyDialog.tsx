"use client";
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useApiKey } from '@/contexts/ApiKeyContext';

interface ApiKeyDialogProps {
  show: boolean;
  onClose: () => void;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ show, onClose }) => {
  const { apiKey, setApiKey, clearApiKey, persistence } = useApiKey();
  const [value, setValue] = useState(apiKey ?? '');
  const [sessionOnly, setSessionOnly] = useState(persistence === 'session');

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    // SECURITY: Always use memory-only storage
    setApiKey(trimmed, 'memory');
    onClose();
  };

  const handleClear = () => {
    clearApiKey();
    setValue('');
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>OpenAI API Key</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="openai-key">API Key</Form.Label>
            <Form.Control
              id="openai-key"
              type="password"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk-..."
              data-testid="openai-api-key-input"
            />
            <Form.Text className="text-body-secondary">
              <strong>SECURITY:</strong> Never stored on any server or browser storage. Memory-only for this session.
            </Form.Text>
          </Form.Group>
          <Form.Check
            type="checkbox"
            id="session-only"
            label="Keep for this tab (DISABLED for security)"
            checked={false}
            disabled={true}
            onChange={() => {}}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>Close</Button>
        <Button variant="outline-danger" onClick={handleClear} data-testid="clear-openai-api-key">Clear</Button>
        <Button variant="primary" onClick={handleSave} data-testid="save-openai-api-key">Use key</Button>
      </Modal.Footer>
    </Modal>
  );
};
