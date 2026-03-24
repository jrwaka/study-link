# Subscription ID, location, and project name

variable "subscription_id" {
  description = "Your Azure subscription ID"
  type        = string
}

variable "location" {
  description = "Azure region where all resources will be created"
  type        = string
  default     = "East US"
}

variable "project_name" {
  description = "Name prefix used for all resources (keep it short, lowercase)"
  type        = string
  default     = "studylink"
}

# Virtual Machine

variable "vm_size" {
  description = "Size of the main application VM"
  type        = string
  default     = "Standard_B1s"
}

variable "admin_username" {
  description = "Admin username for SSH access to the VMs"
  type        = string
  default     = "azureuser"
}

variable "admin_password" {
  description = "Admin password for the VMs"
  type        = string
  sensitive   = true
}

# Bastion Host

variable "bastion_vm_size" {
  description = "Size of the bastion host VM"
  type        = string
  default     = "Standard_B1s"
}

# Container Registry

variable "acr_sku" {
  description = "Azure Container Registry pricing tier"
  type        = string
  default     = "Basic"
}

# Database Credentials

variable "db_admin_username" {
  description = "Administrator login for PostgreSQL"
  type        = string
  default     = "psqladmin"
}

variable "db_admin_password" {
  description = "Administrator password for PostgreSQL"
  type        = string
  sensitive   = true
}

# SSH Security

variable "ssh_public_key" {
  description = "Public SSH key for VM access"
  type        = string
}

variable "admin_ip_allow" {
  description = "IP address/range allowed for SSH access"
  type        = string
  default     = "*" # In production, this should be a specific IP
}
