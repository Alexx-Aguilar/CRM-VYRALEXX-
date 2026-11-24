-- VYRALEXX CRM - persistence table for the first MySQL migration phase
USE vyralexx_crm;

CREATE TABLE IF NOT EXISTS crm_store (
  collection VARCHAR(50) PRIMARY KEY,
  payload JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);
